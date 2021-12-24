import React from 'react';
import './pickup-delivery.less';

/**
 * 带有远程搜索功能的下拉选择组件
 */
export default class SearchSelection extends React.Component {
  static defaultProps = {
    inputCustomStyle: false, //input框是否要全长
    customCls: '',
    isBottomPaging: false, // 滑倒底部翻页
    isLoadingList: true, // 是否显示loading
    freeText: false,
    name: '',
    isCitySearchSelection: false,
    searchSelectionBlur: () => { },
    searchInputChange: () => { }
  };
  constructor(props) {
    super(props);
    this.state = {
      optionList: [],
      optionPanelVisible: false,
      form: {
        value: this.props.defaultValue,
        pageNum: 0
      },
      loadingList: false,
      placeholder: this.props.placeholder,
      searchForNoResult: true
    };
    this.timer = null;
    this.otherValue = '';
    this.searchText = React.createRef();
  }

  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };
  };
  handleInputChange = (e) => {
    e.nativeEvent.stopImmediatePropagation();
    const target = e.target;
    const { form } = this.state;
    try {
      form.value = target.value;
      // 返回搜索框输入的值
      this.props.searchInputChange(e);
      this.setState({
        form: form,
        searchForNoResult: true
      });
      if (!target.value) {
        return false;
      }
      form.pageNum = 0;
      this.setState(
        {
          form: form,
          optionList: []
        }
      );

      clearTimeout(this.timer);
      let tm = this.props.isLoadingList ? 1000 : 50;
      this.timer = setTimeout(() => {
        this.queryList(); // 搜索
      }, tm);
    } catch (error) {
      console.log(error);
    }
  };
  handleInputFocus = (e) => {
    const tmpVal = this.state.form.value;
    if (tmpVal) {
      this.setState({
        currentItem: tmpVal
      });
      // freeText= false，获取焦点时清空文本框value，赋值placeholder
      if (!this.props.freeText) {
        this.setState({
          placeholder: tmpVal,
          form: Object.assign(this.state.form, { value: '' })
        });
      }
    }
  };
  handleInputBlur = (e) => {
    if (this.props.freeText) {
      const target = e.target;
      const { form } = this.state;
      this.props.searchSelectionBlur(e);
      try {
        setTimeout(() => {
          // 可以输入，也可以选择
          if (this.otherValue && this.otherValue != '') {
            form.value = this.otherValue;
            setTimeout(() => {
              this.otherValue = '';
            }, 500);
          } else {
            form.value = target.value;
          }

          this.setState(
            {
              form: form,
              optionPanelVisible: false
            });
        }, 500);
      } catch (error) {
        console.log(error);
      }
    } else {
      setTimeout(() => {
        // 没有选择有效item时，回填之前的值
        this.setState({
          form: Object.assign(this.state.form, {
            value: this.state.currentItem || ''
          }),
          searchForNoResult: true
        });
      }, 500);
    }
  };
  async queryList() {
    const { form, optionList } = this.state;
    if (this.props.isLoadingList) {
      this.setState({
        loadingList: true
      });
    }
    this.setState({
      optionPanelVisible: true
    });
    try {
      let res = await this.props.queryList({
        inputVal: form.value,
        pageNum: form.pageNum
      });
      this.setState({
        optionList: optionList.concat(...res),
        loadingList: false,
        searchForNoResult: res.length > 0
      });
    } catch (err) {
      this.setState({
        optionList: [],
        loadingList: false
      });
    }
  }
  handleClickClinicItem = (e, item) => {
    e.nativeEvent.stopImmediatePropagation();
    const { form } = this.state;
    form.value = item.name;
    this.setState({
      form: form,
      optionList: [],
      optionPanelVisible: false,
      currentItem: item.name,
      otherValue: item.name
    });
    this.otherValue = item.name;
    this.props.selectedItemChange(item);
  };
  hanldeScroll = (e) => {
    let { form } = this.state;
    const target = e.target;
    let wholeHeight = target.scrollHeight;
    let scrollTop = target.scrollTop;
    let divHeight = target.clientHeight;
    // 滚动到容器底部
    if (scrollTop + divHeight >= wholeHeight && this.props.isBottomPaging) {
      form.pageNum++;
      this.setState(
        {
          form: form
        },
        () => {
          this.queryList();
        }
      );
    }
  };
  render() {
    const { optionList, form } = this.state;
    return (
      <div style={{ flex: this.props.inputCustomStyle ? 'auto' : '' }}>
        <div
          className={`${this.props.customCls} rc-input rc-input--label rc-margin--none rc-input--full-width searchSelection`}
          onBlur={() => {
            setTimeout(() => {
              this.setState({ optionList: [], optionPanelVisible: false });
            }, 500);
          }}
        >
          <input
            type="text"
            placeholder={this.state.placeholder}
            className={`rc-input__control`}
            value={form.value || ''}
            onChange={(e) => this.handleInputChange(e)}
            onFocus={this.handleInputFocus}
            onBlur={this.handleInputBlur}
            ref={this.searchText}
            name={this.props.name}
          />
          <label className="rc-input__label" />
          {this.state.optionPanelVisible && (
            <div className="clnc-overlay border mt-1 position-absolute w-100">
              <ul
                className="m-0 clinic-item-container test-scroll"
                onScroll={this.hanldeScroll}
              >
                {optionList.map((item, idx) => (
                  <li
                    className={`clinic-item pl-2 pr-2 ${idx !== optionList.length - 1 ? 'border-bottom' : ''
                      }`}
                    key={idx}
                    onClick={(e) => this.handleClickClinicItem(e, item)}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
              {this.state.loadingList && (
                <div className="text-center p-2">
                  <span className="ui-btn-loading ui-btn-loading-border-red" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
};