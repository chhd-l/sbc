import * as React from 'react';

import { Input, Button, Form } from 'antd';
import { noop, ValidConst, cache } from 'qmkit';

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
export default class FirstDiscountLevels extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      isFullCount: props.isFullCount,
      isNormal: true,
      fullDiscountLevelList: props.fullDiscountLevelList ? props.fullDiscountLevelList : []
    };
  }

  componentDidMount() {
    if (!this.props.fullDiscountLevelList || this.props.fullDiscountLevelList.length == 0) {
      this.initLevel();
    }
  }
  componentWillReceiveProps(nextProps: Readonly<any>, nextContext: any) {
    this.setState({
      isNormal: nextProps.isNormal
    });
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
      if (fullDiscountLevelList && fullDiscountLevelList.length != nextProps.fullDiscountLevelList.length) {
        nextProps.fullDiscountLevelList.forEach((level, index) => {
          if ((!isFullCount ? level.fullAmount : level.fullCount) != null) {
            resetFields[`level_rule_value_${index}`] = !isFullCount ? level.fullAmount : level.fullCount;
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
                    <span>discount&nbsp;</span>
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
                                  callback('Input value between 0.1-9.9 e.g.9.0 means 90% of original price, equals to 10% off');
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
                          title={'Input value between 0.1-9.9 e.g.9.0 means 90% of original price, equals to 10% off'}
                          placeholder={'Input value between 0.1-9.9 e.g.9.0 means 90% of original price, equals to 10% off'}
                          onChange={(e) => {
                            this.onChange(index, 'discount', parseFloat(e.target.value));
                          }}
                        />
                      )}
                      <span>&nbsp;of orginal price&nbsp;&nbsp;</span>
                    </FormItem>
                    {index > 0 && <a onClick={() => this.deleteLevels(index)}>Delete</a>}
                  </HasError>
                )}
              </FormItem>
            </div>
          );
        })}
      </div>
    );
  }

  /**
   * ????????????
   * @param index
   */
  deleteLevels = (index) => {
    let { fullDiscountLevelList } = this.state;
    //??????????????????
    this.props.form.setFieldsValue({
      [`level_rule_value_${fullDiscountLevelList.length - 1}`]: null
    });
    this.props.form.setFieldsValue({
      [`level_rule_discount_${fullDiscountLevelList.length - 1}`]: null
    });
    fullDiscountLevelList.splice(index, 1);
    this.setState({ fullDiscountLevelList: fullDiscountLevelList });
    //??????????????????
    const { onChangeBack } = this.props;
    onChangeBack(fullDiscountLevelList);
  };

  /**
   * ??????????????????
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

    //??????????????????
    const { onChangeBack } = this.props;
    onChangeBack(fullDiscountLevelList);
  };

  /**
   * ???????????????
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
   * ????????????
   * @param index
   * @param value
   */
  ruleValueChange = (index, value) => {
    const { isFullCount } = this.state;
    this.onChange(index, !isFullCount ? 'fullAmount' : 'fullCount', value);
  };

  /**
   * ??????????????????????????????
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

    //??????????????????
    const { onChangeBack } = this.props;
    onChangeBack(fullDiscountLevelList);
  };

  /**
   * ????????????????????????key???
   * @returns {string}
   */
  makeRandom = () => {
    return 'key' + (Math.rdmValue() as any).toFixed(6) * 1000000;
  };
}
