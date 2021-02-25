import * as React from 'react';
import { Relax } from 'plume2';
import { Tabs } from 'antd';
import { IList, IMap } from 'typings/globalType';
import { ErrorBoundary, noop, ReactEditor, history } from 'qmkit';
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
    const { goods } = this.props.relaxProps;
    let resource = goods.get('resource');
    if (resource !== 1 && goodsDetailTabObj[name].contentType === 'json') {
      const reg = /[^><]+(?=<\/xmp>)/gim;
      let _html = html.match(reg);
      goodsDetailTabObj[name].content = _html ? _html.toString() : '';
    } else {
      goodsDetailTabObj[name].content = html;
    }
    this.sortDetailTab();
  };

  sortDetailTab = () => {
    const { editEditorContent } = this.props.relaxProps;
    let arr = [];
    for (let key in goodsDetailTabObj) {
      arr.push(goodsDetailTabObj[key]);
    }
    editEditorContent(arr);
  };

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
                disabled = item.editable;
                if (item.contentType === 'json') {
                  item.content = `<pre type="${item.contentType.toUpperCase()}"><code><xmp>${item.content}</xmp></code></pre>`;
                }
              }

              return (
                <Tabs.TabPane tab={item.descriptionName} key={'main' + item.descriptionId} forceRender>
                  <ErrorBoundary>
                    <ReactEditor
                      id={'main-' + item.descriptionId}
                      cateId={item.goodsCateId}
                      content={item.content}
                      onContentChange={this.onContentChange}
                      contentType={item.contentType}
                      tabNanme={item.descriptionName + '_' + item.descriptionId}
                      disabled={!disabled}
                      height={320}
                    />
                  </ErrorBoundary>
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
