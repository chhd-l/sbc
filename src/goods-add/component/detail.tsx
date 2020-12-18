import * as React from 'react';
import { Relax } from 'plume2';
import { Tabs } from 'antd';
import { IList, IMap } from 'typings/globalType';
import { ErrorBoundary, noop, UEditor } from 'qmkit';
import { List } from 'immutable';
import { FormattedMessage } from 'react-intl';

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
    editEditor: noop
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

  render() {
    const { goods, refDetailEditor, reftabDetailEditor, chooseImgs, imgType, goodsTabs } = this.props.relaxProps;
    let { goodsDetailTab } = this.props.relaxProps;
    let goodsDetailTabCopy = goodsDetailTab.sort((a, b) => a.get('priority') - b.get('priority'));
    let goodsDetailTabContent: any = {};
    let goodsDetailContent;
    if (goods.get('goodsDetail')) {
      goodsDetailContent = goods.get('goodsDetail');
      try {
        goodsDetailTabContent = JSON.parse(goods.get('goodsDetail'));
      } catch {
        goodsDetailTabCopy.map((item) => {
          goodsDetailTabContent[item.get('name')] = '';
        });
      }
    }
    return (
      <div>
        <Tabs defaultActiveKey="main1" animated={false}>
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
                    content={this.getDetailString(goodsDetailTabContent, item.get('name'))}
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
        </Tabs>
        {/* <Tabs defaultActiveKey="main" onChange={() => {}}>
          <Tabs.TabPane
            tab={<FormattedMessage id="product.productDetail" />}
            key="main"
          >
            <UEditor
              ref={(UEditor) => {
                refDetailEditor((UEditor && UEditor.editor) || {});
                this.child = UEditor;
              }}
              id="main"
              height="320"
              content={goods.get('goodsDetail')}
              insertImg={() => {
                this._handleClick();
                this.props.relaxProps.editEditor('detail');
              }}
              chooseImgs={chooseImgs.toJS()}
              imgType={imgType}
            />
          </Tabs.TabPane>
          {goodsTabs &&
            goodsTabs.map((val, index) => {
              return (
                <Tabs.TabPane tab={val.tabName} key={index}>
                  <UEditor
                    ref={(UEditor) => {
                      reftabDetailEditor(
                        (UEditor &&
                          UEditor.editor && {
                            tabId: val.tabId,
                            tab: 'detailEditor_' + index,
                            val: UEditor.editor
                          }) ||
                          {}
                      );
                      this.child = UEditor;
                    }}
                    id={'main' + index}
                    height="320"
                    content={val.tabDetail}
                    insertImg={() => {
                      this._handleClick();
                      this.props.relaxProps.editEditor('detailEditor_' + index);
                    }}
                    chooseImgs={chooseImgs.toJS()}
                    imgType={imgType}
                  />
                </Tabs.TabPane>
              );
            })}
        </Tabs> */}
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
