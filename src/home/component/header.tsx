import React from 'react';
import { IMap, Relax } from 'plume2';
import { DatePicker, Icon, Select, Input, Button, message } from 'antd';
import '../index.less';
import { cache, noop } from 'qmkit';
import moment from 'moment';
import { Link } from 'react-router-dom';
//import { FormattedMessage } from 'react-intl';
const { WeekPicker } = DatePicker;
const { Option } = Select;

@Relax
export default class Header extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      prescribers: '',
      rc: '',
      searchData: '',
      prescriber: 'prescriberId',
      prescriberInput: '',
      searchType: false,
      selectList: [],
      buttonType: false,
      openType: false,
      prescriberId: '',
      week: '',
      id: ''
    };
  }

  props: {
    relaxProps?: {
      header: IMap;
      storeEvaluateSum: IMap;
      newInit: Function;
      prescriberInit: Function;
      search: any;
      searchData: any;
      onSearchData: Function;
    };
  };

  static relaxProps = {
    header: 'header',
    storeEvaluateSum: 'storeEvaluateSum',
    newInit: noop,
    prescriberInit: noop,
    search: 'search',
    searchData: 'searchData',
    onSearchData: noop
  };

  componentDidMount() {
    const { searchData } = this.props.relaxProps;
    let prescribers = JSON.parse(sessionStorage.getItem('s2b-employee@data')).prescribers;

    let PrescriberSelectType = sessionStorage.getItem('PrescriberSelectType');
    this.setState({
      prescribers: sessionStorage.getItem('s2b-employee@data') ? prescribers : '',
      prescriber: prescribers && prescribers.length > 0 ? prescribers[0] : '',
      prescriberId: prescribers && prescribers.length > 0 ? prescribers[0].prescriberId : '',
      id: prescribers && prescribers.length > 0 ? prescribers[0].id : ''
    });
    if (searchData == '') {
      this.setState({
        selectList: prescribers,
        defaultValue: PrescriberSelectType == null ? prescribers && prescribers[0] && prescribers[0].prescriberName : JSON.parse(sessionStorage.getItem('PrescriberSelect')).prescriberName
      });
    }
    if (PrescriberSelectType == null && prescribers != null) {
      sessionStorage.setItem('PrescriberSelect', JSON.stringify({ id: prescribers[0].id, prescriberId: prescribers[0].prescriberId, prescriberName: prescribers[0].prescriberName }));
    }
  }

  componentDidUpdate(prevProps, prevState: Readonly<any>, snapshot?: any) {
    const { searchData } = this.props.relaxProps;
    if (prevProps.relaxProps.searchData != searchData) {
      this.setState({
        selectList: searchData
      });
    }
  }

  dateChange = (date, dateString) => {
    const { newInit, prescriberInit } = this.props.relaxProps as any;
    let prescribers = JSON.parse(sessionStorage.getItem('s2b-employee@data')).prescribers;
    let year = sessionStorage.getItem(cache.CURRENT_YEAR);
    sessionStorage.setItem(cache.CURRENT_YEAR, date); //年

    this.setState({ week: date.week() });
    if (this.state.prescriber == '') {
      if (this.state.searchType == true) {
        let obj = {
          companyId: 2,
          weekNum: date.week(),
          year: moment(date).weekYear(),
          prescriberId: this.state.prescriberId == '' ? prescribers[0].prescriberId : this.state.prescriberId
        };
        prescriberInit(obj);
      } else {
        let obj = {
          companyId: 2,
          weekNum: date.week(),
          year: moment(date).weekYear()
        };
        newInit(obj);
      }
    } else {
      let obj = {
        companyId: 2,
        weekNum: date.week(),
        year: moment(date).weekYear(),
        prescriberId: this.state.prescriberId == '' ? prescribers[0].prescriberId : this.state.prescriberId
      };
      prescriberInit(obj);
    }
  };

  onSearch = (res) => {
    if (this.state.prescriberInput == '') {
      return;
    } else {
      this.setState({
        searchType: true,
        buttonType: true,
        openType: true
      });
      const { onSearchData } = this.props.relaxProps as any;
      onSearchData({ prescriberName: this.state.prescriberInput });
    }
  };

  selectSearch = (res) => {
    this.setState({
      prescriberInput: res
    });
  };

  onBlur = (res) => {
    this.setState({
      prescriberInput: res,
      openType: false
    });
  };

  onFocus = (res) => {
    this.setState({
      openType: true
    });
  };

  onChange = (res) => {
    if (res == 'all') {
      this.props.changePage({ type: false, getPrescriberId: null });
    } else {
      this.props.changePage({ type: true, getPrescriberId: res });
    }
    this.setState({
      openType: false,
      prescriberId: res
    });
  };

  onClean = (res) => {
    this.setState({
      searchType: false,
      buttonType: false
    });
    if (this.state.searchType == true) {
      this.props.changePage({ type: false, getPrescriberId: null, week: this.state.week });
    }
  };

  selectClick = (res) => {
    this.setState({
      openType: res
    });
  };

  onSearch2 = (res) => {
    this.setState({
      prescriberInput: res
    });
  };

  onPrescriberChange = (res, a) => {
    this.props.changePage({ type: true, getPrescriberId: res, week: moment(sessionStorage.getItem(cache.CURRENT_YEAR)).week() });
    this.setState({
      openType: false,
      prescriberId: res,
      id: a.props.val.id,
      week: moment(sessionStorage.getItem(cache.CURRENT_YEAR)).week()
    });
    sessionStorage.setItem('PrescriberSelectType', true);
    sessionStorage.setItem(
      'PrescriberSelect',
      JSON.stringify({
        id: a.props.val.id,
        prescriberId: a.props.val.prescriberId,
        prescriberName: a.props.val.prescriberName
      })
    );
    message.success('Prescriber choosed here will be setted as default for other pages.');
  };

  render() {
    return (
      <div className="shopHeader home space-between">
        <div className="Header-date flex-start-align">
          <Icon type="clock-circle" className="Header-date-icon" />
          <WeekPicker defaultValue={moment(sessionStorage.getItem(cache.CURRENT_YEAR) ? sessionStorage.getItem(cache.CURRENT_YEAR) : new Date())} onChange={this.dateChange} placeholder="Select week" />
          <div className="Header-date-text">* The data is updated every 15 minutes</div>
        </div>
        <div className="home-prescriber flex-start-end">
          <span style={{ marginRight: 8 }}>Prescriber: </span>
          {this.state.prescriber == '' ? (
            this.state.searchType == false ? (
              <Input
                style={{ width: 200, marginRight: 8 }}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.onSearch2(value);
                }}
              />
            ) : (
              <Select
                showArrow={false}
                autoFocus={false}
                open={this.state.openType}
                style={{ width: 200, marginRight: 8 }}
                placeholder="Select Prescriber Data"
                defaultValue="All"
                //optionFilterProp="children"
                onChange={this.onChange}
                //onFocus={this.onFocus}
                //onBlur={this.onBlur}
                onSearch={this.selectSearch}
                onDropdownVisibleChange={this.selectClick}
                /*filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }*/
              >
                <Option value="all">All</Option>
                {this.state.selectList && this.state.selectList.length !== 0
                  ? this.state.selectList.map((item, index) => {
                      return (
                        <Option value={item.id} key={item.id}>
                          {item.prescriberName}
                        </Option>
                      );
                    })
                  : null}
              </Select>
            )
          ) : (
            this.state.defaultValue && (
              <Select showArrow={false} autoFocus={false} open={this.state.openType} style={{ width: 200, marginRight: 8 }} placeholder="Select Prescriber Data" defaultValue={this.state.defaultValue} onChange={this.onPrescriberChange} onDropdownVisibleChange={this.selectClick}>
                {this.state.selectList.length !== 0
                  ? this.state.selectList.map((item, index) => {
                      return (
                        <Option value={item.id} val={item} key={item.id}>
                          {item.prescriberName}
                        </Option>
                      );
                    })
                  : null}
              </Select>
            )
          )}
          {this.state.prescriber == '' ? this.state.buttonType == false ? <Button shape="circle" icon="search" onClick={this.onSearch} /> : <Button shape="circle" icon="close-circle" onClick={this.onClean} /> : ''}
        </div>
        {this.state.prescriber.id ? (
          <div>
            <Link style={{ textDecoration: 'underline' }} to={'/prescriber-edit/' + this.state.id}>
              Manage Prescriber
            </Link>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}
