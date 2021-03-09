import * as React from 'react';
import { Relax } from 'plume2';
import { Tabs } from 'antd';
import { IList, IMap } from 'typings/globalType';
import { noop, ErrorBoundary, ReactEditor, history } from 'qmkit';
import { List } from 'immutable';
import { FormattedMessage } from 'react-intl';
let goodsDetailTabObj = {};

@Relax
export default class Detail extends React.Component<any, any> {
  child: any;

  props: {
    relaxProps?: {
      goods: IMap;
      goodsTabs: IList;
      chooseImgs: List<any>;
      imgType: number;
      goodsDetailTab: IList;
      goodsDescriptionDetailList: any;

      editGoods: Function;
      refDetailEditor: Function;
      reftabDetailEditor: Function;
      modalVisible: Function;
      editEditor: Function;
      editEditorContent: Function;
    };
  };

  static relaxProps = {
    // 商品基本信息
    goods: 'goods',
    chooseImgs: 'chooseImgs',
    imgType: 'imgType',
    goodsTabs: 'goodsTabs',
    goodsDetailTab: 'goodsDetailTab',
    goodsDescriptionDetailList: 'goodsDescriptionDetailList',
    // 修改商品基本信息
    editGoods: noop,
    refDetailEditor: noop,
    reftabDetailEditor: noop,
    modalVisible: noop,
    editEditor: noop,
    editEditorContent: noop
  };

  onContentChange = (html: string, name: string) => {
    if (goodsDetailTabObj[name].contentType.toUpperCase() === 'JSON') {
      goodsDetailTabObj[name].content = this.functionTurnJson(html);
    } else {
      goodsDetailTabObj[name].content = html;
    }
    this.sortDetailTab();
  };
  functionTurnJson = (content) => {
    const reg = /\<[^>]*\>(([^xmp<])*)/gi; ///[^><]+(?=<\/xmp>)/gi;
    let _html = content.replace(reg, function () {
      return arguments[1];
    });
    return _html;
  };
  sortDetailTab = () => {
    const { editEditorContent } = this.props.relaxProps;
    let arr = [];
    for (let key in goodsDetailTabObj) {
      arr.push(goodsDetailTabObj[key]);
    }
    editEditorContent(arr);
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    // Store prevId in state so we can compare when props change.
    // Clear out previously-loaded data (so we don't render stale stuff).
    // if (nextProps.id !== prevState.prevId) {
    //   return {
    //     externalData: null,
    //     prevId: nextProps.id,
    //   };
    // }

    // No state update necessary
    return null;
  }

  render() {
    const { goods, goodsDescriptionDetailList } = this.props.relaxProps;
    goodsDetailTabObj = {};
    return (
      <div>
        {goodsDescriptionDetailList.length > 0 && (
          <Tabs defaultActiveKey={'main' + goodsDescriptionDetailList[0].descriptionId} animated={false}>
            {goodsDescriptionDetailList.map((item, i) => {
              goodsDetailTabObj[item.descriptionName + '_' + item.descriptionId] = item;
              let resource = goods.get('resource'),
                disabled = true;
              if (resource !== 1) {
                disabled = item?.editable ?? false;
              }
              if (item.contentType.toUpperCase() === 'JSON') {
                item.content = this.functionTurnJson(item.content);
                item.content = `<pre type="${item.contentType.toUpperCase()}"><code><xmp>${item.content || '{tip:"请输入json格式"}'}</xmp></code></pre>`;
              }

              return (
                <Tabs.TabPane tab={item.descriptionName} key={'main' + item.descriptionId} forceRender>
                  <ReactEditor
                    key={item.key}
                    id={'main-' + item.descriptionId}
                    cateId={item.goodsCateId}
                    content={item.content}
                    onContentChange={this.onContentChange}
                    contentType={item.contentType}
                    tabNanme={item.descriptionName + '_' + item.descriptionId}
                    disabled={!disabled}
                    height={320}
                  />
                </Tabs.TabPane>
              );
            })}
          </Tabs>
        )}
      </div>
    );
  }

  /**
   * 调用图片库弹框
   * @private
   */
  _handleClick = () => {
    this.props.relaxProps.modalVisible(10, 2);
  };
}
