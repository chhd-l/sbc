import * as React from 'react';
import { Form, Input, Checkbox, Table, InputNumber, Tooltip, Icon } from 'antd';
import { Relax } from 'plume2';
import { fromJS } from 'immutable';
import { noop, ValidConst } from 'qmkit';
import { IList, IMap } from 'typings/globalType';

import UserPrice from './user-price';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

const CustomerSPU = styled.div`
  .has-error .ant-form-explain,
  .has-error .ant-form-split {
    margin-right: -250px;
  }
`;

const { Column } = Table;
const FormItem = Form.Item;

@Relax
export default class LevelPrice extends React.Component<any, any> {
  WrapperForm: any;

  props: {
    relaxProps?: {
      marketPrice: number;
      costPrice: number;
      openUserPrice: boolean;
      editPriceSetting: Function;
      userLevelList: IList;
      editUserLevelPriceItem: Function;
      updateLevelPriceForm: Function;
      userLevelPrice: IMap;
      editGoods: Function;
      //起订量同步
      levelCountChecked: boolean;
      levelCountDisable: boolean;
      updateLevelCountChecked: Function;
      synchLevelCount: Function;
      //限订量同步
      levelMaxCountChecked: boolean;
      levelMaxCountDisable: boolean;
      updateLevelMaxCountChecked: Function;
      synchLevelMaxCount: Function;
    };
  };

  static relaxProps = {
    marketPrice: ['goods', 'marketPrice'],
    costPrice: 'costPrice',
    // 是否开启按客户单独定价
    openUserPrice: 'openUserPrice',
    // 修改价格设置
    editPriceSetting: noop,
    // 级别列表
    userLevelList: 'userLevelList',
    // 修改价格表属性
    editUserLevelPriceItem: noop,
    updateLevelPriceForm: noop,
    // 级别价格数据
    userLevelPrice: 'userLevelPrice',
    // 编辑商品字段(这边主要用于编辑spu统一市场价)
    editGoods: noop,
    //起订量同步
    levelCountChecked: 'levelCountChecked',
    levelCountDisable: 'levelCountDisable',
    updateLevelCountChecked: noop,
    synchLevelCount: noop,
    //限订量同步
    levelMaxCountChecked: 'levelMaxCountChecked',
    levelMaxCountDisable: 'levelMaxCountDisable',
    updateLevelMaxCountChecked: noop,
    synchLevelMaxCount: noop
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(LevelPriceForm);
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const relaxProps = this.props.relaxProps;
    const { updateLevelPriceForm } = relaxProps;
    return <WrapperForm ref={(form) => form && updateLevelPriceForm(form)} {...{ relaxProps: relaxProps }} />;
  }
}

class LevelPriceForm extends React.Component<any, any> {
  render() {
    const { getFieldDecorator } = this.props.form;
    const { marketPrice, openUserPrice, userLevelList, userLevelPrice, levelCountChecked, levelCountDisable, levelMaxCountChecked, levelMaxCountDisable } = this.props.relaxProps;
    return (
      <div>
        <div style={styles.bar}>
          <Form className="login-form" layout="inline">
            <CustomerSPU>
              <FormItem label="SPU unified market price">
                {getFieldDecorator('marketPrice', {
                  rules: [
                    {
                      required: true,
                      message: <FormattedMessage id="Product.inputMarketPrice" />
                    },
                    {
                      pattern: ValidConst.zeroPrice,
                      message: <FormattedMessage id="Product.twoDecimalPlaces" />
                    },
                    {
                      type: 'number',
                      max: 9999999.99,
                      message: '最大值为9999999.99',
                      transform: function (value) {
                        return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
                      }
                    }
                  ],
                  onChange: (e) => this.props.relaxProps.editGoods(fromJS({ ['marketPrice']: e.target.value })),
                  initialValue: marketPrice
                })(<Input style={{ maxWidth: 120, marginRight: 5 }} />)}
                <Tooltip placement="top" title={'按照客户设价时需要填写统一的市场价，保存后，原有的SKU市场价将会被覆盖'}>
                  <a style={{ fontSize: 14 }}>
                    <Icon type="question-circle-o" />
                  </a>
                </Tooltip>
              </FormItem>
              <Checkbox onChange={this._editPriceSetting.bind(this, 'openUserPrice')} checked={openUserPrice} style={{ marginTop: 8 }}>
                Price separately by customer
              </Checkbox>
            </CustomerSPU>
            {/*级别价table*/}
            <Table dataSource={userLevelList.toJS()} pagination={false} rowKey="customerLevelId" style={{ paddingTop: '10px' }} scroll={{ y: 240 }}>
              <Column title="Level" key="customerLevelName" dataIndex="customerLevelName" width="15%" />
              <Column
                title={
                  <div>
                    Default discount price&nbsp;
                    <Tooltip placement="top" title={'如不填写自定义订货价，该级别售价默认使用折扣价，折扣价=市场价×等级折扣率'}>
                      <a style={{ fontSize: 14 }}>
                        <Icon type="question-circle-o" />
                      </a>
                    </Tooltip>
                  </div>
                }
                key="customerLevelDiscount"
                width="10%"
                render={(rowInfo) => (
                  <div>
                    <div>¥{((marketPrice ? marketPrice : 0) * rowInfo.customerLevelDiscount).toFixed(2)}</div>
                    <div>{(rowInfo.customerLevelDiscount * 100).toFixed(0) + '%'}</div>
                  </div>
                )}
              />
              <Column
                title={
                  <div>
                    Custom order price&nbsp;
                    <Tooltip placement="top" title={'填写后该级别销售价不会跟随市场价以及等级折扣率变化'}>
                      <a style={{ fontSize: 14 }}>
                        <Icon type="question-circle-o" />
                      </a>
                    </Tooltip>
                  </div>
                }
                key="price"
                width="25%"
                render={(rowInfo) => {
                  const levelId = rowInfo.customerLevelId + '';
                  return (
                    <FormItem>
                      {getFieldDecorator('levelprice_' + levelId, {
                        rules: [
                          {
                            pattern: ValidConst.zeroPrice,
                            message: '请填写两位小数的合法金额'
                          },
                          {
                            type: 'number',
                            max: 9999999.99,
                            message: '最大值为9999999.99',
                            transform: function (value) {
                              return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
                            }
                          }
                        ],
                        onChange: this._editPriceItem.bind(this, levelId, 'price'),
                        initialValue: userLevelPrice.get(levelId) && userLevelPrice.get(levelId).get('price')
                      })(<Input />)}
                    </FormItem>
                  );
                }}
              />
              <Column
                title={
                  <div>
                    Quantity
                    <br />{' '}
                    <Checkbox checked={levelCountChecked} onChange={this._synchLevelCount}>
                      All the same
                    </Checkbox>
                  </div>
                }
                key="count"
                width="25%"
                render={(rowInfo, _l, index) => {
                  const levelId = rowInfo.customerLevelId + '';
                  return (
                    <FormItem>
                      {getFieldDecorator('levelcount_' + levelId, {
                        rules: [
                          {
                            pattern: ValidConst.number,
                            message: 'Please enter the correct value'
                          },
                          {
                            level: levelId,
                            validator: (rule, value, callback) => {
                              let count = userLevelPrice.get(rule.level) ? userLevelPrice.get(rule.level).get('maxCount') : '';

                              // form表单initialValue方式赋值不成功，这里通过setFieldsValue方法赋值
                              const fieldsValue = this.props.form.getFieldsValue();
                              // 同步值
                              let levelPriceFields = {};
                              Object.getOwnPropertyNames(fieldsValue).forEach((field) => {
                                // 级别价的表单字段以levelcount_开头
                                if (field === 'levelmaxcount_' + rule.level) {
                                  levelPriceFields[field] = count;
                                }
                              });
                              // update
                              this.props.form.setFieldsValue(levelPriceFields);
                              if (count != null && count != '' && value != '' && value != null && value > count) {
                                callback('不可大于限订量');
                                return;
                              }
                              callback();
                            }
                          }
                        ],
                        onChange: this._editPriceItem.bind(this, levelId, 'count'),
                        initialValue: userLevelPrice.get(levelId) ? userLevelPrice.get(levelId).get('count') : ''
                      })(<InputNumber disabled={index > 0 && levelCountDisable} />)}
                    </FormItem>
                  );
                }}
              />
              <Column
                title={
                  <div>
                    Limited order
                    <br />{' '}
                    <Checkbox checked={levelMaxCountChecked} onChange={this._synchLevelMaxCount}>
                      All the same
                    </Checkbox>
                  </div>
                }
                key="maxCount"
                width="25%"
                render={(rowInfo, _i, index) => {
                  const levelId = rowInfo.customerLevelId + '';
                  return (
                    <FormItem>
                      {getFieldDecorator('levelmaxcount_' + levelId, {
                        rules: [
                          {
                            pattern: ValidConst.number,
                            message: '正整数'
                          },
                          {
                            level: levelId,
                            validator: (rule, value, callback) => {
                              let count = userLevelPrice.get(rule.level) ? userLevelPrice.get(rule.level).get('count') : '';

                              // form表单initialValue方式赋值不成功，这里通过setFieldsValue方法赋值
                              const fieldsValue = this.props.form.getFieldsValue();
                              // 同步值
                              let levelPriceFields = {};
                              Object.getOwnPropertyNames(fieldsValue).forEach((field) => {
                                // 级别价的表单字段以levelcount_开头
                                if (field === 'levelcount_' + rule.level) {
                                  levelPriceFields[field] = count;
                                }
                              });
                              // update
                              this.props.form.setFieldsValue(levelPriceFields);

                              if (count != null && count != '' && value != '' && value != null && value < count) {
                                callback('不可小于起订量');
                                return;
                              }
                              callback();
                            }
                          }
                        ],
                        onChange: this._editPriceItem.bind(this, levelId, 'maxCount'),
                        initialValue: userLevelPrice.get(levelId) ? userLevelPrice.get(levelId).get('maxCount') : ''
                      })(<InputNumber min={1} disabled={index > 0 && levelMaxCountDisable} />)}
                    </FormItem>
                  );
                }}
              />
            </Table>
          </Form>
        </div>

        {openUserPrice ? <UserPrice /> : null}
      </div>
    );
  }

  /**
   * 修改价格设置
   */
  _editPriceSetting = (key: string, e) => {
    const { editPriceSetting } = this.props.relaxProps;
    let checked;
    let value = e;
    if (e && e.target) {
      checked = e.target.checked;
      value = e.target.value;
    }

    if (value) {
      editPriceSetting(key, value);
    } else {
      editPriceSetting(key, checked);
    }
  };

  /**
   * 修改价格表属性
   */
  _editPriceItem = (userLevelId: string, key: string, e) => {
    const { editUserLevelPriceItem, synchLevelCount, levelCountChecked, synchLevelMaxCount, levelMaxCountChecked } = this.props.relaxProps;
    if (e && e.target) {
      e = e.target.value;
    }
    editUserLevelPriceItem(userLevelId, key, e);
    if (key == 'count') {
      // 修改store中的库存值
      synchLevelCount();

      // 是否同步值
      if (levelCountChecked) {
        // form表单initialValue方式赋值不成功，这里通过setFieldsValue方法赋值
        const fieldsValue = this.props.form.getFieldsValue();
        // 同步值
        let levelPriceFields = {};
        Object.getOwnPropertyNames(fieldsValue).forEach((field) => {
          // 级别价的表单字段以levelcount_开头
          if (field.indexOf('levelcount_') === 0) {
            levelPriceFields[field] = e;
          }
        });
        // update
        this.props.form.setFieldsValue(levelPriceFields);
      }
    } else if (key == 'maxCount') {
      // 修改store中的库存值
      synchLevelMaxCount();

      // 是否同步值
      if (levelMaxCountChecked) {
        // form表单initialValue方式赋值不成功，这里通过setFieldsValue方法赋值
        const fieldsValue = this.props.form.getFieldsValue();
        // 同步值
        let levelPriceFields = {};
        Object.getOwnPropertyNames(fieldsValue).forEach((field) => {
          // 级别价的表单字段以levelmaxcount_开头
          if (field.indexOf('levelmaxcount_') === 0) {
            levelPriceFields[field] = e;
          }
        });
        // update
        this.props.form.setFieldsValue(levelPriceFields);
      }
    }
  };

  /**
   * 同步起订量库存
   */
  _synchLevelCount = (e) => {
    const { updateLevelCountChecked, synchLevelCount, userLevelPrice } = this.props.relaxProps;
    updateLevelCountChecked(e.target.checked);
    synchLevelCount();
    // 是否同步值
    if (e.target.checked) {
      let count = userLevelPrice.get('0') ? userLevelPrice.get('0').get('count') : '';
      // form表单initialValue方式赋值不成功，这里通过setFieldsValue方法赋值
      const fieldsValue = this.props.form.getFieldsValue();
      // 同步值
      let levelPriceFields = {};
      Object.getOwnPropertyNames(fieldsValue).forEach((field) => {
        // 级别价的表单字段以levelcount_开头
        if (field.indexOf('levelcount_') === 0) {
          levelPriceFields[field] = count;
        }
      });
      // update
      this.props.form.setFieldsValue(levelPriceFields);
    }
  };

  /**
   * 同步起订量库存
   */
  _synchLevelMaxCount = (e) => {
    const { updateLevelMaxCountChecked, userLevelPrice, synchLevelMaxCount } = this.props.relaxProps;
    updateLevelMaxCountChecked(e.target.checked);
    synchLevelMaxCount();
    // 是否同步值
    if (e.target.checked) {
      let count = userLevelPrice.get('0') ? userLevelPrice.get('0').get('maxCount') : '';
      // form表单initialValue方式赋值不成功，这里通过setFieldsValue方法赋值
      const fieldsValue = this.props.form.getFieldsValue();
      // 同步值
      let levelPriceFields = {};
      Object.getOwnPropertyNames(fieldsValue).forEach((field) => {
        // 级别价的表单字段以levelmaxcount_开头
        if (field.indexOf('levelmaxcount_') === 0) {
          levelPriceFields[field] = count;
        }
      });
      // update
      this.props.form.setFieldsValue(levelPriceFields);
    }
  };
}

const styles = {
  bar: {
    padding: 10
  }
};
