import * as React from 'react';
import { fromJS, Set } from 'immutable';

import { InputNumber, Input, Button, Select, Form } from 'antd';
import { DataGrid, ValidConst, cache, noop } from 'qmkit';
import { FormattedMessage, injectIntl } from 'react-intl';
import { GoodsModal } from 'biz';

const Option = Select.Option;
import { Table } from 'antd';

const Column = Table.Column;
const FormItem = Form.Item;


class ProductList extends React.Component<any, any> {
  props: {
    intl;
    form;
    initData;
  }
  constructor(props) {
    super(props);
    this.state = {
      //公用的商品弹出框
      goodsModal: {
        _modalVisible: false
      },
      selectedSkuIds: [],
      selectedRows: []
    };
  }

  componentDidMount() {
    this.changeForm();
  }

  componentDidUpdate(prevProps) {
    // 典型用法（不要忘记比较 props）：
    if (this.props.initData && !prevProps.initData) {
        this.initDataSource(this.props.initData);
    }
  }

  changeForm = () => {
    const { form } = this.props;
    const { selectedRows } = this.state;
    form.setFieldsValue({
      benefitList: [{
        gifts: selectedRows.map(item => ({ productId: item.goodsInfoId, productNum: item.productNum ?? 1 })),
        deliveryNumber: 1,
      }]
    });
  };

  initDataSource = (initData) => {
      if (!initData) return;
      let {fullGiftLevelList} = initData;

      if (Array.isArray(fullGiftLevelList) && fullGiftLevelList.length > 0) {
          let initDataSource = fullGiftLevelList.map(item => {
              let {
                  giftLevelId,
                  deliveryNumber,
                  fullGiftDetailList
              } = item;

              let selectedSkuIds = fullGiftDetailList.map(item => item.productId)
              let selectedRows = initData.goodsList.goodsInfoPage.content.filter(item => selectedSkuIds.includes(item.goodsInfoId));
              // 添加数量属性
              let gifts = selectedRows.map(item => {
                  let productNum = fullGiftDetailList.find(gifItem => gifItem.productId === item.goodsInfoId).productNum;
                  return {
                      ...item,
                      productNum,
                  }
              })

              return {
                  gifts,
                  selectedSkuIds,
                  selectedRows: selectedRows,
                  key: giftLevelId,
                  deliveryNumber: deliveryNumber,
              }
          })

          this.setState({
              selectedSkuIds: initDataSource[0].selectedSkuIds,
              selectedRows: initDataSource[0].gifts
          }, this.changeForm);
      }

  };

  render() {
    const { goodsModal, selectedSkuIds, selectedRows } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div>
        <Button type="primary" icon="plus" onClick={this.openGoodsModal} style={{ marginBottom: 10 }}>
          <FormattedMessage id="Subscription.AddWelcomebox" />
        </Button>

        <FormItem>
          {getFieldDecorator('benefitList', {initialValue:[]})(<div></div>)}
        </FormItem>

        <DataGrid scroll={{ y: 500 }} size="small" rowKey={(record) => record.goodsInfoId} dataSource={selectedRows} pagination={false}>
          <Column title="SKU code" dataIndex="goodsInfoNo" key="goodsInfoNo" />

          <Column
            title={<FormattedMessage id="Marketing.ProductName" />}
            dataIndex="goodsInfoName"
            key="goodsInfoName"
            render={(value) => {
              return <div className="line-two">{value}</div>;
            }}
          />

          <Column
            title={<FormattedMessage id="Marketing.Specification" />}
            dataIndex="specText"
            key="specText"
            render={(value) => {
              if (value) {
                return <div>{value}</div>;
              } else {
                return '-';
              }
            }}
          />

          <Column  title={<FormattedMessage id="Marketing.Category" />} key="cateName" dataIndex="cateName" />

          <Column
            title={<FormattedMessage id="Marketing.Brand" />}
            key="brandName"
            dataIndex="brandName"
            width="8%"
            render={(value) => {
              if (value) {
                return value;
              } else {
                return '-';
              }
            }}
          />

          <Column
            title={<FormattedMessage id="Marketing.Price" />}
            key="marketPrice"
            dataIndex="marketPrice"
            render={(data) => {
              return `${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) || ''}${data}`;
            }}
          />

          <Column
            title={<FormattedMessage id="Marketing.Inventory" />}
            key="stock"
            dataIndex="stock"
            render={(stock) => {
              if (stock < 20) {
                return (
                  <div className="has-error">
                    <p>{stock}</p>
                    <div className="ant-form-explain">Inventory is too low</div>
                  </div>
                );
              } else {
                return stock;
              }
            }}
          />

          <Column
            title={<FormattedMessage id="Marketing.GiveTheNumber" />}
            className="centerItem"
            key="count"
            render={(row, _record, detailIndex) => {
              return (
                <FormItem>
                  {getFieldDecorator(`${row.goodsInfoId}level_detail${detailIndex}`, {
                    initialValue: _record.productNum ?? 1,
                    rules: [
                      { required: true, message:
                          (window as any).RCi18n({
                            id: 'Marketing.greaterthan0andlessthan999'
                          })
                      },
                      {
                        pattern: ValidConst.noZeroNumber,
                        message: (window as any).RCi18n({
                          id: 'Marketing.greaterthan0andlessthan999'
                        })
                      },
                      {
                        validator: (_rule, value, callback) => {
                          if (value && ValidConst.noZeroNumber.test(value) && (value > 999 || value < 1)) {
                            callback(
                              (window as any).RCi18n({
                                id: 'Marketing.greaterthan0andlessthan999'
                              })
                            );
                          }
                          callback();
                        }
                      }
                    ]
                  })(
                    <InputNumber
                      min={0}
                      onChange={(val: string) => {
                        this.giftCountOnChange(detailIndex, val);
                      }}
                    />
                  )}
                </FormItem>
              );
            }}
          />

          <Column
            title={<FormattedMessage id="Marketing.Operation" />}
            key="operate"
            render={(row) => {
              return <a onClick={() => this.deleteRows(row.goodsInfoId)}>Delete</a>;
            }}
          />
        </DataGrid>
              
          
        {goodsModal && goodsModal._modalVisible && (
          <GoodsModal
            skuLimit={20}
            visible={goodsModal._modalVisible}
            selectedSkuIds={selectedSkuIds}
            selectedRows={fromJS(selectedRows)}
            onOkBackFun={(selectedSkuIds, selectedRows) => this.skuSelectedBackFun(selectedSkuIds, selectedRows)}
            onCancelBackFun={this.closeGoodsModal}
          />
        )}
      </div>
    );
  }

  /**
   * 删除已经绑定的商品
   * @param index
   * @param goodsInfoId
   */
  deleteRows = (goodsInfoId) => {
    const { selectedRows } = this.state;
    const index = selectedRows.findIndex(good => good.goodsInfoId === goodsInfoId);
    selectedRows.splice(index, 1);
    this.setState({
      selectedRows,
      selectedSkuIds: selectedRows.map(item => item.goodsInfoId)
    }, this.changeForm);
  };

  

  /**
   * sku选择之后的回调事件
   * @param index
   * @param selectedSkuIds
   * @param selectedRows
   */
  skuSelectedBackFun = (selectedSkuIds, selectedRows) => {
    if (!Array.isArray(selectedSkuIds) || !Array.isArray(selectedRows.toJS())) return;

    this.setState({
      selectedSkuIds,
      selectedRows: selectedRows.toJS()
    }, this.changeForm);
    this.closeGoodsModal();
  };

  /**
   * 满赠数量变化
   * @param index
   * @param goodsInfoId
   * @param count
   */
  giftCountOnChange = (detailIndex, count) => {
    const { selectedRows } = this.state;
    selectedRows[detailIndex]['productNum'] = count;
    this.setState({
      selectedRows
    }, this.changeForm);
  };

  /**
   * 打开modal
   * @param index
   */
  openGoodsModal = () => {
    this.setState({ goodsModal: { _modalVisible: true } });
  };

  /**
   * 关闭modal
   */
  closeGoodsModal = () => {
    this.setState({ goodsModal: { _modalVisible: false } });
  };


}
export default injectIntl(ProductList)
