import React from 'react';

import { Form, Input, InputNumber, Radio, TreeSelect, Button, Table, Icon, Select } from 'antd';
import { QMMethod, FindArea, ValidConst, noop, cache, history, RCi18n } from 'qmkit';
import { ruleTableListQL } from '../ql';
import { IList } from 'typings/globalType';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { fromJS } from 'immutable';

const InlineBDiv = styled.div`
  display: inline-block;
`;
const FormDiv = styled.div`
  .ant-form-item-label {
    width: 130px;
  }
  // .ant-select-selection {
  //   width: 350px;
  // }
  .ant-radio-group {
    .radio-item {
      margin-bottom: 5px;
    }
    .ant-row {
      display: inline-block;
      margin-bottom: 0;
      #satisfyFreight,
      #fixedFreight,
      #minimumDeliveryFee,
      #satisfyPrice {
        width: 100px;
        text-align: center;
      }
      .has-error {
        margin-bottom: 13px;
        .ant-form-explain,
        .show-help-leave,
        .show-help-enter {
          position: absolute;
          width: 200px;
        }
      }
      .has-success {
        .ant-form-explain,
        .show-help-leave,
        .show-help-enter {
          position: absolute;
          width: 200px;
        }
      }
    }
  }
`;

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout2 = {
  wrapperCol: {
    span: 24
  }
};

/**
 * 运费模板
 */
export default class FreightTemp extends React.Component<any, any> {
  props: {
    form: any;
    id: any;
    relaxProps?: {
      // 规则名称
      ruleName: string;
      // 最低service fee
      minimumServiceFee: number;
      // 增加一条规则
      tableRulesAdd: Function;
      // 删除一条规则
      tableRulesDelete: Function;
      // 修改某条规则
      tableRulesEdit: Function;
      // 存储service fee规则
      saveServiceFeeRule: Function;
      // 支付方式code
      paymentMethodCode: string;
      // 支付方式列表
      paymentMethodList: IList;
      // 规则列表
      ruleTableList: any[];
      // 根据字段修改值
      storeFreightFieldsValue: Function;
    };
  };

  static relaxProps = {
    ruleName: 'ruleName',
    minimumServiceFee: 'minimumServiceFee',
    paymentMethodList: 'paymentMethodList',
    paymentMethodCode: 'paymentMethodCode',
    ruleTableList: ruleTableListQL,

    tableRulesAdd: noop,
    tableRulesDelete: noop,
    tableRulesEdit: noop,
    saveServiceFeeRule: noop,
    storeFreightFieldsValue: noop
  };

  constructor(props) {
    super(props);
    this.state = {
      saveLoading: false
    };
  }

  render() {
    const {
      ruleName,
      paymentMethodCode,
      paymentMethodList,
      minimumServiceFee,
      ruleTableList,
      tableRulesAdd,
      tableRulesDelete,
      tableRulesEdit,
      storeFreightFieldsValue
    } = this.props.relaxProps;

    const { getFieldDecorator } = this.props.form;
    const { id } = this.props;
    const isEdit = !!id; // 编辑状态下不允许修改rule name
    // 第一行和最后一行填写完整了，才能增加新的
    const canAddNewTableRow =
      (ruleTableList[0] ? ruleTableList[0].valid : false) &&
      ruleTableList[ruleTableList.length - 1]?.valid;
    return (
      <FormDiv>
        <Form>
          <FormItem
            // {...formItemLayout}
            {...{
              labelCol: {
                span: 4
              },
              wrapperCol: {
                span: 7
              }
            }}
            label="Rules name"
            required={true}
          >
            {getFieldDecorator('ruleName', {
              initialValue: ruleName,
              rules: [
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorTrimMinAndMax(rule, value, callback, 'Rules name', 1, 200);
                  }
                }
              ]
            })(
              <Input
                disabled={isEdit}
                placeholder="Rules name is limited to 1-200 characters"
                onChange={(e) =>
                  storeFreightFieldsValue({
                    field: 'ruleName',
                    value: e.target.value
                  })
                }
              />
            )}
          </FormItem>
          <FormItem
            {...{
              labelCol: {
                span: 4
              },
              wrapperCol: {
                span: 7
              }
            }}
            // {...formItemLayout}
            label="Payment Method"
            required={true}
          >
            {getFieldDecorator('paymentMethodCode', {
              initialValue: paymentMethodCode,
              rules: [{ required: true, message: 'Please select one payment method' }]
            })(
              <Select
                // style={{ width: '350px' }}
                onChange={(value) =>
                  storeFreightFieldsValue({
                    field: 'paymentMethodCode',
                    value: value
                  })
                }
              >
                {(paymentMethodList ? paymentMethodList.toJS() : []).map((p, idx) => (
                  <Option value={p.code} key={idx} disabled={!p.isOpen}>
                    {p.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem
            {...{
              labelCol: {
                span: 4
              },
              wrapperCol: {
                span: 20
              }
            }}
            label="Service fee rule"
            required={true}
          >
            <p>
              Based on order price(The final amount that customer pay, which equals to product
              price(including tax)+shipping fee-total discount.)
            </p>
            <p>
              {' '}
              Minimum service amount is
              {getFieldDecorator('minimumServiceFee', {
                initialValue: minimumServiceFee,
                rules: this._validMoney()
              })(
                <InputNumber
                  style={{ margin: '0 5px 14px' }}
                  onChange={(value) => {
                    storeFreightFieldsValue({
                      field: 'minimumServiceFee',
                      value: value
                    });
                  }}
                />
              )}
              {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}{' '}
            </p>
          </FormItem>
          <FormItem {...formItemLayout2}>
            <Table
              rowKey="id"
              bordered={true}
              pagination={false}
              columns={[
                {
                  align: 'center',
                  title: 'Order initial amount',
                  dataIndex: 'orderInitialAmount',
                  key: 'orderInitialAmount',
                  // width: '24%',
                  render: (text, record, index) => {
                    return (
                      <FormItem>
                        {getFieldDecorator(`orderInitialAmount_${index}`, {
                          initialValue: text,
                          rules: this._validMoney()
                        })(
                          <Input
                            // 第一列永远不许修改，只有第一行且不是最后一行允许修改，其他行是自动带入上一行最大值+1
                            disabled={true}
                            onChange={(e) => {
                              tableRulesEdit({
                                id: record.id,
                                index,
                                field: 'orderInitialAmount',
                                value: e.target.value
                              });
                            }}
                          />
                        )}
                      </FormItem>
                    );
                  }
                },
                {
                  align: 'center',
                  title: `Order Max amount`,
                  dataIndex: 'orderMaxAmount',
                  key: 'orderMaxAmount',
                  // width: '16%',
                  render: (text, record, index) => {
                    return (
                      <FormItem>
                        {getFieldDecorator(`orderMaxAmount_${index}`, {
                          initialValue: text,
                          rules: this._validMaxAmountMoney(record)
                        })(
                          <Input
                            // 只有最后一行允许修改
                            disabled={index !== ruleTableList.length - 1}
                            onChange={(e) => {
                              tableRulesEdit({
                                id: record.id,
                                index,
                                field: 'orderMaxAmount',
                                value: e.target.value
                              });
                            }}
                          />
                        )}
                      </FormItem>
                    );
                  }
                },
                {
                  align: 'center',
                  title: `Rule Setting`,
                  dataIndex: 'ruleSetting',
                  key: 'ruleSetting',
                  // width: '16%',
                  render: (text, record, index) => {
                    return (
                      <FormItem>
                        {getFieldDecorator(`ruleSetting_${index}`, {
                          initialValue: text,
                          rules: [{ required: true, message: 'Please select...' }]
                        })(
                          <Select
                            // 只有最后一行允许修改
                            disabled={index !== ruleTableList.length - 1}
                            style={{ width: 100 }}
                            onChange={(value) => {
                              tableRulesEdit({ id: record.id, index, field: 'ruleSetting', value });
                            }}
                          >
                            <Option value={2}>
                              <FormattedMessage id="ServiceFee.Percent" />
                            </Option>
                            <Option value={1}>
                              <FormattedMessage id="ServiceFee.Amount" />
                            </Option>
                          </Select>
                        )}
                      </FormItem>
                    );
                  }
                },
                {
                  align: 'center',
                  title: `Amount/Percentage`,
                  dataIndex: 'amountOrPercentageVal',
                  key: 'amountOrPercentageVal',
                  // width: '16%',
                  render: (text, record, index) => {
                    return (
                      <>
                        <FormItem>
                          <InlineBDiv>
                            {getFieldDecorator(`amountOrPercentageVal_${index}`, {
                              initialValue: text,
                              rules:
                                record.ruleSetting === 1 ? this._validMoney() : this._validPercent()
                            })(
                              <Input
                                style={{ width: 80, textAlign: 'center' }}
                                // 只有最后一行允许修改
                                disabled={index !== ruleTableList.length - 1}
                                onChange={(e) => {
                                  tableRulesEdit({
                                    id: record.id,
                                    index,
                                    field: 'amountOrPercentageVal',
                                    value: e.target.value
                                  });
                                }}
                              />
                            )}
                            <span style={{ paddingLeft: '10px' }}>
                              {record.ruleSetting === 1
                                ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)
                                : '%'}
                            </span>
                          </InlineBDiv>
                        </FormItem>
                      </>
                    );
                  }
                },
                {
                  align: 'center',
                  title: 'Operation',
                  dataIndex: 'operation',
                  key: 'operation',
                  // width: '13%',
                  render: (_text, record, index) => {
                    return index == 0 ? (
                      <Icon
                        type="plus"
                        onClick={() => (canAddNewTableRow ? tableRulesAdd() : noop)}
                        style={canAddNewTableRow ? styles.icon : styles.disabledIcon}
                      />
                    ) : (
                      <Icon
                        type="minus"
                        onClick={() =>
                          index === ruleTableList.length - 1 ? tableRulesDelete(record.id) : noop
                        }
                        style={
                          index === ruleTableList.length - 1 ? styles.icon : styles.disabledIcon
                        }
                      />
                    );
                  }
                }
              ]}
              dataSource={ruleTableList}
            />
          </FormItem>

          <div className="bar-button">
            <Button
              onClick={() => this._save()}
              type="primary"
              style={{ marginRight: 20, marginLeft: 22 }}
              loading={this.state.saveLoading}
            >
              Save
            </Button>
            <Button onClick={() => history.goBack()}>Cancel</Button>
          </div>
        </Form>
      </FormDiv>
    );
  }

  /**
   * 保存
   */
  _save = () => {
    const { id } = this.props;
    const { saveServiceFeeRule } = this.props.relaxProps;
    this.props.form.validateFieldsAndScroll((errs) => {
      //如果校验通过
      if (!errs) {
        this.setState({ saveLoading: true });
        saveServiceFeeRule(id);
      }
    });
  };

  /**
   * 规则校验
   */
  _validMoney = () => {
    return [
      { required: true, message: 'Please enter the amount' },
      {
        pattern: ValidConst.zeroPrice,
        message: 'Please input the legal amount with two decimal places'
      },
      {
        type: 'number',
        transform: function (value) {
          return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
        }
      }
    ];
  };

  /**
   * 校验百分数
   */
  _validPercent = () => {
    return [
      { required: true, message: 'Please enter the amount' },
      {
        pattern: ValidConst.zeroPrice,
        message: 'Please input the legal amount with two decimal places'
      },
      {
        type: 'number',
        max: 100,
        message: 'The maximum value is 100',
        transform: function (value) {
          return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
        }
      }
    ];
  };

  /**
   * 规则校验最大限制金额
   */
  _validMaxAmountMoney = (item) => {
    const curInitialAmount = isNaN(parseFloat(item.orderInitialAmount))
      ? 0
      : parseFloat(item.orderInitialAmount);
    return [
      { required: true, message: 'Please enter the amount' },
      {
        pattern: ValidConst.zeroPrice,
        message: 'Please input the legal amount with two decimal places'
      },
      {
        type: 'number',
        min: curInitialAmount + 1,
        message: `The minimum value is ${curInitialAmount + 1}`,
        transform: function (value) {
          return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
        }
      }
    ];
  };
}

const styles = {
  icon: {
    fontSize: 16,
    color: '#08c',
    fontWeight: 'bolder',
    cursor: 'pointer'
  },
  disabledIcon: {
    fontSize: 16,
    color: '#ccc',
    fontWeight: 'bolder',
    cursor: 'not-allowed'
  }
} as any;
