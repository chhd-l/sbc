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

import styled from 'styled-components';
import { Relax } from 'plume2';

const HasError = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  .ant-select-selection {
    border-color: #d9d9d9 !important;
  }
  .ant-select-selection .ant-select-arrow {
    color: #d9d9d9;
  }
`;

class GiftLevels extends React.Component<any, any> {
  props: {
    intl;
    isFullCount;
    fullGiftLevelList;
    isNormal;
    selectedRows
  }
  constructor(props) {
    super(props);
    this.state = {
      isFullCount: props.isFullCount,

      fullGiftLevelList: props.fullGiftLevelList ? props.fullGiftLevelList : [],
      //公用的商品弹出框
      goodsModal: {
        _modalVisible: false,
        _forIndex: 0
      },
      PromotionTypeValue: 0
    };
  }


  componentDidMount() {
    // if (!this.props.fullGiftLevelList || this.props.fullGiftLevelList.length == 0) {
    //   this.initLevel();
    // }
  }

  // shouldComponentUpdate(nextProps) {
  //   let resetFields = {};
  //   const { fullGiftLevelList, isFullCount } = this.props;
  //
  //   if (isFullCount != nextProps.isFullCount) {
  //     fullGiftLevelList.forEach((level, index) => {
  //       resetFields[`level_rule_value_${index}`] = null;
  //       level.fullGiftDetailList.forEach((detail, detailIndex) => {
  //         resetFields[`${detail.productId}level_detail${index}${detailIndex}`] = 1;
  //       });
  //     });
  //     this.initLevel();
  //     this.setState({
  //       selectedRows: fromJS([]),
  //       isFullCount: nextProps.isFullCount
  //     });
  //   } else {
  //     if (fullGiftLevelList && fullGiftLevelList.length != nextProps.fullGiftLevelList.length) {
  //       nextProps.fullGiftLevelList.forEach((level, index) => {
  //         if ((!isFullCount ? level.fullAmount : level.fullCount) != null) {
  //           resetFields[`level_rule_value_${index}`] = !isFullCount ? level.fullAmount : level.fullCount;
  //         }
  //       });
  //     }
  //   }
  //   if (JSON.stringify(resetFields) !== '{}') {
  //     this.props.form.setFieldsValue(resetFields);
  //   }
  //   return true;
  // }

  render() {
    const { isFullCount, fullGiftLevelList, isNormal, selectedRows } = this.props;
    const { goodsModal } = this.state
    const { form } = this.props;
    const { getFieldDecorator } = form;
    console.log(selectedRows.toJS(), 'selectedGiftRows-------');
    return (
      <div>
        {fullGiftLevelList &&
          fullGiftLevelList.map((level, index) => {
            return (
              <div key={level.key ? level.key : level.giftLevelId}>
                <HasError>
                  {isNormal && (
                    <div>
                      <span>Full&nbsp;</span>
                      <FormItem style={{ display: 'inline-block' }}>
                        {getFieldDecorator(`level_rule_value_${index}`, {
                          rules: [
                            { required: true, message:
                                RCi18n({
                                  id: 'Marketing.Mustenterrules'
                                })
                            },
                            {
                              validator: (_rule, value, callback) => {
                                if (value) {
                                  if (!isFullCount) {
                                    if (!ValidConst.price.test(value) || !(value < 100000000 && value > 0)) {
                                      callback(
                                        RCi18n({
                                          id: 'Marketing.0-99999999.99'
                                        })
                                      );
                                    }
                                  } else {
                                    if (!ValidConst.noZeroNumber.test(value) || !(value < 10000 && value > 0)) {
                                      callback(
                                        RCi18n({
                                          id: 'Marketing.1-9999'
                                        })
                                      );
                                    }
                                  }
                                }
                                callback();
                              }
                            }
                          ],
                          initialValue: !isFullCount ? level.fullAmount : level.fullCount
                        })(
                          // <Input
                          //   value={isFullCount ? level.fullAmount : null}
                          //   style={{ width: 200 }}
                          //   placeholder={!isFullCount ? '0.01-99999999.99' : '1-9999'}
                          //   onChange={(e) => {
                          //     this.ruleValueChange(index, e.target.value);
                          //   }}
                          // />
                          <Input
                            style={{ width: 180 }}
                            value={!isFullCount ? level.fullAmount : level.fullCount}
                            // placeholder={!isFullCount ?
                            //   RCi18n({
                            //     id: 'Marketing.0-99999999.99',
                            //   })
                            //   :
                            //   RCi18n({
                            //     id: 'Marketing.1-9999',
                            //   })
                            // }
                            onChange={(e) => {
                              this.ruleValueChange(index, e.target.value);
                            }}
                            disabled={isFullCount === 2}
                          />

                        )}
                      </FormItem>
                      <span>
                        &nbsp;
                        {isFullCount !== 1 ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) : 'items'}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </span>
                    </div>
                  )}
                  <Button type="primary" icon="plus" onClick={() => this.openGoodsModal(index)} style={{ marginTop: 3.5 }}>
                    <FormattedMessage id="Marketing.Addgift" />
                  </Button>
                  {/*&nbsp;&nbsp;*/}
                  {/*<Select*/}
                  {/*  value={level.giftType}*/}
                  {/*  style={{ width: 120, marginTop: 3.5 }}*/}
                  {/*  onChange={(val) => {*/}
                  {/*    this.onChange(index, 'giftType', val);*/}
                  {/*  }}*/}
                  {/*  getPopupContainer={(triggerNode) => triggerNode.parentElement}*/}
                  {/*>*/}
                  {/*  <Option value={1}>An optional one</Option>*/}
                  {/*  <Option value={0}>The default all give</Option>*/}
                  {/*</Select>*/}
                  &nbsp;&nbsp;&nbsp;
                  {index > 0 && <a onClick={() => this.deleteLevels(index)}>Delete</a>}
                </HasError>

                <DataGrid scroll={{ y: 500 }} size="small" rowKey={(record) => record.goodsInfoId} dataSource={level.fullGiftDetailList ? this.getSelectedRowByIds(this.getIdsFromLevel(level.fullGiftDetailList)) : []} pagination={false}>
                  <Column title="SKU code" dataIndex="goodsInfoNo" key="goodsInfoNo" width="10%" />

                  <Column
                    title={<FormattedMessage id="Marketing.ProductName" />}
                    dataIndex="goodsInfoName"
                    key="goodsInfoName"
                    width="20%"
                    render={(value) => {
                      return <div className="line-two">{value}</div>;
                    }}
                  />

                  <Column
                    title={<FormattedMessage id="Marketing.Specification" />}
                    dataIndex="specText"
                    key="specText"
                    width="8%"
                    render={(value) => {
                      if (value) {
                        return <div>{value}</div>;
                      } else {
                        return '-';
                      }
                    }}
                  />

                  <Column  title={<FormattedMessage id="Marketing.Category" />} key="cateName" dataIndex="cateName" width="8%" />

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
                    width="10%"
                    render={(data) => {
                      return `¥${data}`;
                    }}
                  />

                  <Column
                    title={<FormattedMessage id="Marketing.Inventory" />}
                    key="stock"
                    dataIndex="stock"
                    width="10%"
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
                    width="20%"
                    render={(row, _record, detailIndex) => {
                      return (
                        <FormItem>
                          {getFieldDecorator(`${row.goodsInfoId}level_detail${index}${detailIndex}`, {
                            initialValue: fullGiftLevelList[index]['fullGiftDetailList'][detailIndex] ? fullGiftLevelList[index]['fullGiftDetailList'][detailIndex]['productNum'] : 1,
                            rules: [
                              { required: true, message:
                                  RCi18n({
                                    id: 'Marketing.greaterthan0andlessthan999'
                                  })
                              },
                              {
                                pattern: ValidConst.noZeroNumber,
                                message: RCi18n({
                                  id: 'Marketing.greaterthan0andlessthan999'
                                })
                              },
                              {
                                validator: (_rule, value, callback) => {
                                  if (value && ValidConst.noZeroNumber.test(value) && (value > 999 || value < 1)) {
                                    callback(
                                      RCi18n({
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
                                this.giftCountOnChange(index, detailIndex, val);
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
                    width="12%"
                    render={(row) => {
                      return <a onClick={() => this.deleteRows(index, row.goodsInfoId)}>Delete</a>;
                    }}
                  />
                </DataGrid>
                <FormItem key={index}>{getFieldDecorator(`level_${index}`, {})(<div />)}</FormItem>
              </div>
            );
          })}
        <Button onClick={this.addLevels} disabled={fullGiftLevelList && fullGiftLevelList.length >= 5}>
          <FormattedMessage id="Marketing.Addmulti-levelpromotions" />
        </Button>
        &nbsp;&nbsp; <FormattedMessage id="Marketing.upto5levels" />
        {fullGiftLevelList && fullGiftLevelList.length > 0 && goodsModal && goodsModal._modalVisible && (
          <GoodsModal
            skuLimit={20}
            visible={goodsModal._modalVisible}
            selectedSkuIds={this.getIdsFromLevel(fullGiftLevelList[goodsModal._forIndex]['fullGiftDetailList'])}
            selectedRows={fromJS(this.getSelectedRowByIds(this.getIdsFromLevel(fullGiftLevelList[goodsModal._forIndex]['fullGiftDetailList'])))}
            onOkBackFun={(selectedSkuIds, selectedRows) => this.skuSelectedBackFun(goodsModal._forIndex, selectedSkuIds, selectedRows)}
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
  deleteRows = (_index, goodsInfoId) => {
    let { fullGiftLevelList, onChangeBack, selectedRows } = this.props;
    fullGiftLevelList.forEach((level) => {
      let levelIndex = level.fullGiftDetailList.findIndex((detail) => detail.productId == goodsInfoId);
      if (levelIndex > -1) {
        level.fullGiftDetailList.splice(levelIndex, 1);
      }
    });
    //去除选中
    let rowIndex = selectedRows.toJS().findIndex((row) => row.goodsInfoId == goodsInfoId);
    let newRows = selectedRows.toJS();
    //大于-1说明包含此元素
    if (rowIndex > -1) {
      newRows.splice(rowIndex, 1);
    }
    selectedRows = fromJS(newRows);

    this.props.GiftRowsOnChange(selectedRows)
    onChangeBack(fullGiftLevelList);
  };

  /**
   * 删除等级
   * @param index
   */
  deleteLevels = (index) => {
    let { fullGiftLevelList, onChangeBack } = this.props;
    //重置表单的值
    this.props.form.setFieldsValue({
      [`level_rule_value_${fullGiftLevelList.length - 1}`]: null
    });
    fullGiftLevelList.splice(index, 1);
    // this.setState({ fullGiftLevelList: fullGiftLevelList });
    //传递到父页面
    onChangeBack(fullGiftLevelList);
  };

  /**
   * 添加多级促销
   */
  addLevels = () => {
    const { fullGiftLevelList, onChangeBack } = this.props;
    if (fullGiftLevelList.length >= 5) return;
    fullGiftLevelList.push({
      key: this.makeRandom(),
      fullAmount: null,
      fullCount: null,
      giftType: 1,
      fullGiftDetailList: []
    });
    // this.setState({ fullGiftLevelList: fullGiftLevelList });

    //传递到父页面
    onChangeBack(fullGiftLevelList);
  };

  /**
   * 初始化等级
   */
  initLevel = () => {
    const initLevel = [
      {
        key: this.makeRandom(),
        fullAmount: null,
        fullCount: null,
        giftType: 1,
        fullGiftDetailList: []
      }
    ];
    // this.setState({ fullGiftLevelList: initLevel });

    const { onChangeBack } = this.props;
    onChangeBack(initLevel);
  };

  /**
   * 规则变更
   * @param index
   * @param value
   */
  ruleValueChange = (index, value) => {
    const { isFullCount } = this.props;
    this.onChange(index, !isFullCount ? 'fullAmount' : 'fullCount', value);
  };

  /**
   * 整个表单内容变化方法
   * @param index
   * @param props
   * @param value
   */
  onChange = (index, props, value) => {
    const { fullGiftLevelList } = this.props;
    fullGiftLevelList[index][props] = value;
    if (props == 'fullAmount') {
      fullGiftLevelList[index]['fullCount'] = null;
    } else if (props == 'fullCount') {
      fullGiftLevelList[index]['fullAmount'] = null;
    }
    this.setState({ fullGiftLevelList: fullGiftLevelList });

    //传递到父页面
    const { onChangeBack } = this.props;
    onChangeBack(fullGiftLevelList);
  };

  /**
   * sku选择之后的回调事件
   * @param index
   * @param selectedSkuIds
   * @param selectedRows
   */
  skuSelectedBackFun = (index, selectedSkuIds, selectedRows) => {
    this.onChange(
      index,
      'fullGiftDetailList',
      selectedSkuIds.map((skuId) => {
        return { productId: skuId, productNum: 1 };
      })
    );
    let rows = (selectedRows.isEmpty() ? Set([]) : selectedRows.toSet()).concat(fromJS(this.props.selectedRows).toSet());
    this.props.GiftRowsOnChange(rows)
    this.setState({ goodsModal: { _modalVisible: false }});
  };

  /**
   * 满赠数量变化
   * @param index
   * @param goodsInfoId
   * @param count
   */
  giftCountOnChange = (index, detailIndex, count) => {
    let { fullGiftLevelList } = this.props;
    let fullGiftDetailList = fullGiftLevelList[index].fullGiftDetailList;
    fullGiftDetailList[detailIndex]['productNum'] = count;
    this.onChange(index, 'fullGiftDetailList', fullGiftDetailList);
  };

  /**
   * 打开modal
   * @param index
   */
  openGoodsModal = (index) => {
    this.setState({ goodsModal: { _modalVisible: true, _forIndex: index } });
  };

  /**
   * 关闭modal
   */
  closeGoodsModal = () => {
    this.setState({ goodsModal: { _modalVisible: false } });
  };

  /**
   * 工具方法：通过选择id获取rows
   * @param ids
   * @returns {Array}
   */
  getSelectedRowByIds = (ids) => {
    debugger
    const { selectedRows } = this.props;
    const rows = selectedRows.filter((row) => ids.includes(row.get('goodsInfoId')));
    return rows && !rows.isEmpty() ? rows.toJS() : [];
  };

  /**
   * 通过detailList获取id集合
   * @param detailList
   * @returns {Array}
   */
  getIdsFromLevel = (detailList) => {
    return detailList
      ? detailList.map((detail) => {
          return detail.productId;
        })
      : [];
  };

  /**
   * 生成随机数，作为key值
   * @returns {string}
   */
  makeRandom = () => {
    return 'key' + (Math.random() as any).toFixed(6) * 1000000;
  };
}
export default injectIntl(GiftLevels)
