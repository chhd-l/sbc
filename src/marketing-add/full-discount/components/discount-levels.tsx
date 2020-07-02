import * as React from 'react';

import { Input, Button, Form } from 'antd';
import { ValidConst } from 'qmkit';

const FormItem = Form.Item;

import styled from 'styled-components';
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

export default class DiscountLevels extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      isFullCount: props.isFullCount,
      fullDiscountLevelList: props.fullDiscountLevelList
        ? props.fullDiscountLevelList
        : []
    };
  }

  componentDidMount() {
    if (
      !this.props.fullDiscountLevelList ||
      this.props.fullDiscountLevelList.length == 0
    ) {
      this.initLevel();
    }
  }

  shouldComponentUpdate(nextProps) {
    let resetFields = {};
    const { fullDiscountLevelList, isFullCount } = this.props;

    if (isFullCount != nextProps.isFullCount) {
      fullDiscountLevelList.forEach((_level, index) => {
        resetFields[`level_rule_value_${index}`] = null;
        resetFields[`level_rule_discount_${index}`] = null;
      });
      this.initLevel();
      this.setState({ isFullCount: nextProps.isFullCount });
    } else {
      if (
        fullDiscountLevelList &&
        fullDiscountLevelList.length != nextProps.fullDiscountLevelList.length
      ) {
        nextProps.fullDiscountLevelList.forEach((level, index) => {
          if ((!isFullCount ? level.fullAmount : level.fullCount) != null) {
            resetFields[`level_rule_value_${index}`] = !isFullCount
              ? level.fullAmount
              : level.fullCount;
            resetFields[`level_rule_discount_${index}`] = level.discount;
          }
        });
      }
    }
    if (JSON.stringify(resetFields) !== '{}') {
      this.props.form.setFieldsValue(resetFields);
    }
    return true;
  }

  render() {
    const { isFullCount, fullDiscountLevelList } = this.state;

    const { form } = this.props;

    const { getFieldDecorator } = form;

    return (
      <div>
        {fullDiscountLevelList.map((level, index) => {
          return (
            <div key={level.key ? level.key : level.discountLevelId}>
              <FormItem key={index}>
                {getFieldDecorator(
                  `level_${index}`,
                  {}
                )(
                  <HasError>
                    <span>Full&nbsp;</span>
                    <FormItem>
                      {getFieldDecorator(`level_rule_value_${index}`, {
                        rules: [
                          { required: true, message: 'Must enter rules' },
                          {
                            validator: (_rule, value, callback) => {
                              if (value) {
                                if (!isFullCount) {
                                  if (
                                    !ValidConst.price.test(value) ||
                                    !(value < 100000000 && value > 0)
                                  ) {
                                    callback('0.01-99999999.99');
                                  }
                                } else {
                                  if (
                                    !ValidConst.noZeroNumber.test(value) ||
                                    !(value < 10000 && value > 0)
                                  ) {
                                    callback('1-9999');
                                  }
                                }
                              }
                              callback();
                            }
                          }
                        ],
                        initialValue: !isFullCount
                          ? level.fullAmount
                          : level.fullCount
                      })(
                        <Input
                          style={{ width: 200 }}
                          placeholder={
                            !isFullCount ? '0.01-99999999.99' : '1-9999'
                          }
                          onChange={(e) => {
                            this.ruleValueChange(index, e.target.value);
                          }}
                        />
                      )}
                    </FormItem>
                    <span>
                      &nbsp;{!isFullCount ? 'yuan' : 'items'}
                      ，&nbsp;&nbsp;&nbsp;&nbsp;discount&nbsp;&nbsp;
                    </span>
                    <FormItem>
                      {getFieldDecorator(`level_rule_discount_${index}`, {
                        rules: [
                          {
                            required: true,
                            message: 'Discount must be entered'
                          },
                          {
                            validator: (_rule, value, callback) => {
                              if (value) {
                                if (!/(^[0-9]?(\.[0-9])?$)/.test(value)) {
                                  callback(
                                    'The number between 0.1-9.9 supports one decimal'
                                  );
                                }
                              }
                              callback();
                            }
                          }
                        ],
                        initialValue: level.discount
                      })(
                        <Input
                          style={{ width: 200 }}
                          placeholder={
                            'The number between 0.1-9.9 supports one decimal'
                          }
                          onChange={(e) => {
                            this.onChange(index, 'discount', e.target.value);
                          }}
                        />
                      )}
                    </FormItem>
                    <span>&nbsp;discount&nbsp;&nbsp;</span>
                    {index > 0 && (
                      <a onClick={() => this.deleteLevels(index)}>Delete</a>
                    )}
                  </HasError>
                )}
              </FormItem>
            </div>
          );
        })}
        <Button
          onClick={this.addLevels}
          disabled={fullDiscountLevelList.length >= 5}
        >
          Add multi-level promotions
        </Button>
        &nbsp;&nbsp;up to 5 levels can be set
      </div>
    );
  }

  /**
   * 删除等级
   * @param index
   */
  deleteLevels = (index) => {
    let { fullDiscountLevelList } = this.state;
    //重置表单的值
    this.props.form.setFieldsValue({
      [`level_rule_value_${fullDiscountLevelList.length - 1}`]: null
    });
    this.props.form.setFieldsValue({
      [`level_rule_discount_${fullDiscountLevelList.length - 1}`]: null
    });
    fullDiscountLevelList.splice(index, 1);
    this.setState({ fullDiscountLevelList: fullDiscountLevelList });
    //传递到父页面
    const { onChangeBack } = this.props;
    onChangeBack(fullDiscountLevelList);
  };

  /**
   * 添加多级促销
   */
  addLevels = () => {
    const { fullDiscountLevelList } = this.state;
    if (fullDiscountLevelList.length >= 5) return;
    fullDiscountLevelList.push({
      key: this.makeRandom(),
      fullAmount: null,
      fullCount: null,
      discount: null
    });
    this.setState({ fullDiscountLevelList: fullDiscountLevelList });

    //传递到父页面
    const { onChangeBack } = this.props;
    onChangeBack(fullDiscountLevelList);
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
        discount: null
      }
    ];
    this.setState({ fullDiscountLevelList: initLevel });

    const { onChangeBack } = this.props;
    onChangeBack(initLevel);
  };

  /**
   * 规则变更
   * @param index
   * @param value
   */
  ruleValueChange = (index, value) => {
    const { isFullCount } = this.state;
    this.onChange(index, !isFullCount ? 'fullAmount' : 'fullCount', value);
  };

  /**
   * 整个表单内容变化方法
   * @param index
   * @param props
   * @param value
   */
  onChange = (index, props, value) => {
    const { fullDiscountLevelList } = this.state;
    fullDiscountLevelList[index][props] = value;
    if (props == 'fullAmount') {
      fullDiscountLevelList[index]['fullCount'] = null;
    } else if (props == 'fullCount') {
      fullDiscountLevelList[index]['fullAmount'] = null;
    }
    this.setState({ fullDiscountLevelList: fullDiscountLevelList });

    //传递到父页面
    const { onChangeBack } = this.props;
    onChangeBack(fullDiscountLevelList);
  };

  /**
   * 生成随机数，作为key值
   * @returns {string}
   */
  makeRandom = () => {
    return 'key' + (Math.random() as any).toFixed(6) * 1000000;
  };
}
