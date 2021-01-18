import * as React from 'react';
import { Relax } from 'plume2';
import { Tabs } from 'antd';
import { IList, IMap } from 'typings/globalType';
import { noop, UEditor, ErrorBoundary, ReactEditor } from 'qmkit';
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
    // 修改商品基本信息
    editGoods: noop,
    refDetailEditor: noop,
    reftabDetailEditor: noop,
    modalVisible: noop,
    editEditor: noop,
    editEditorContent: noop
  };

  getDetailString = (goodsDetailTabContent, name) => {
    let detail = goodsDetailTabContent ? goodsDetailTabContent[name] : '';
    if (!detail) {
      return '';
    }
    if (Array.isArray(detail)) {
      return '[' + goodsDetailTabContent[name].toString().replace(/^\"|\"$/g, '') + ']';
    } else {
      return detail.toString();
    }
  };
  onContentChange = (html: string, name: string) => {
    const { editEditorContent } = this.props.relaxProps;

    const reg = /[^><]+(?=<\/code>)/gim;
    let _html = html.match(reg);
    if (_html) {
      goodsDetailTabObj[name] = _html.toString();
    } else {
      goodsDetailTabObj[name] = html;
    }
    let p = JSON.stringify(goodsDetailTabObj);
    editEditorContent('goodsDetail', p);
    // console.log(goodsDetailTabObj)
  };
  render() {
    const { goods, refDetailEditor, reftabDetailEditor, chooseImgs, imgType, goodsTabs, goodsDetailTab } = this.props.relaxProps;
    let goodsDetailTabCopy = goodsDetailTab.sort((a, b) => a.get('priority') - b.get('priority'));
    let goodsDetailTabContent: any = {};
    let goodsDetailContent: string = goods.get('goodsDetail');
    if (goodsDetailContent) {
      try {
        goodsDetailTabContent = JSON.parse(goods.get('goodsDetail'));
      } catch {
        goodsDetailTabCopy.map((item) => {
          goodsDetailTabContent[item.get('name')] = '';
        });
      }
    }
    let loginInfo = JSON.parse(sessionStorage.getItem('s2b-supplier@login'));
    let storeId = loginInfo ? loginInfo.storeId : '';
    return (
      <div>
        {/* <Tabs defaultActiveKey="main1" animated={false}>
          {goodsDetailTabCopy.map((item, i) => {
            return (
              <Tabs.TabPane tab={item.get('name')} key={'main' + i} forceRender>
                <ErrorBoundary>
                  <UEditor
                    ref={(UEditor) => {
                      refDetailEditor({
                        detailEditor: (UEditor && UEditor.editor) || {},
                        ref: 'detailEditor_' + i
                      });
                      this.child = UEditor;
                    }}
                    id={'main' + i}
                    height="320"
                    disabled={storeId === 123457909} //fr
                    content={this.getDetailString(goodsDetailTabContent, item.get('name'))} //去除前后的双引号, 数组加上[]
                    insertImg={() => {
                      this._handleClick();
                      this.props.relaxProps.editEditor('detail');
                    }}
                    chooseImgs={chooseImgs.toJS()}
                    imgType={imgType}
                  />
                </ErrorBoundary>
              </Tabs.TabPane>
            );
          })}
        </Tabs> */}
        <Tabs defaultActiveKey="main0" animated={false}>
          {goodsDetailTabCopy.map((item, i) => {
            return (
              <Tabs.TabPane tab={item.get('name')} key={'main' + i} forceRender>
                <ErrorBoundary>
                  <ReactEditor id={'main-' + i} content={this.getDetailString(goodsDetailTabContent, item.get('name'))} onContentChange={this.onContentChange} tabNanme={item.get('name')} disabled={false} height={320} />
                </ErrorBoundary>
              </Tabs.TabPane>
            );
          })}
        </Tabs>
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
