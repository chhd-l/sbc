import * as React from 'react';

import { Input, Button, Form } from 'antd';
import { ValidConst, cache } from 'qmkit';

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

export default class ReductionLevels extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      isFullCount: props.isFullCount,
      isNormal: true,
      fullReductionLevelList: props.fullReductionLevelList
        ? props.fullReductionLevelList
        : [],
      PromotionTypeValue: 0
    };
  }

  componentDidMount() {
    if (
      !this.props.fullReductionLevelList ||
      this.props.fullReductionLevelList.length == 0
    ) {
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
    const { fullReductionLevelList, isFullCount } = this.props;

    if (isFullCount != nextProps.isFullCount) {
      fullReductionLevelList.forEach((_level, index) => {
        resetFields[`level_rule_value_${index}`] = null;
        resetFields[`level_rule_reduction_${index}`] = null;
      });
      this.initLevel();
      this.setState({ isFullCount: nextProps.isFullCount });
    } else {
      if (
        fullReductionLevelList &&
        fullReductionLevelList.length != nextProps.fullReductionLevelList.length
      ) {
        nextProps.fullReductionLevelList.forEach((level, index) => {
          if ((!isFullCount ? level.fullAmount : level.fullCount) != null) {
            resetFields[`level_rule_value_${index}`] = !isFullCount
              ? level.fullAmount
              : level.fullCount;
            resetFields[`level_rule_reduction_${index}`] = level.reduction;
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
    const { isFullCount, fullReductionLevelList } = this.state;

    const { form } = this.props;

    const { getFieldDecorator } = form;

    return (
      <div>
        {fullReductionLevelList.map((level, index) => {
          return (
            <div key={level.key ? level.key : level.reductionLevelId}>
              <HasError>
                {this.state.isNormal ? (
                  <div>
                    <span>Full&nbsp;</span>
                    <FormItem
                      style={{ display: 'inline-block', width: '250px' }}
                    >
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
                            // callback();
                          }
                        ],
                        initialValue: !isFullCount
                          ? level.fullAmount
                          : level.fullCount
                      })(
                        <Input
                          style={{ width: 180 }}
                          placeholder={
                            !isFullCount ? '0.01-99999999.99' : '1-9999'
                          }
                          onChange={(e) => {
                            this.ruleValueChange(index, e.target.value);
                          }}
                        />
                      )}
                      <span>&nbsp;{!isFullCount ? 'yuan' : 'items'}，</span>
                    </FormItem>
                  </div>
                ) : null}
                <FormItem>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;reduction&nbsp;&nbsp;</span>
                  {getFieldDecorator(`level_rule_reduction_${index}`, {
                    rules: [
                      { required: true, message: 'Amount must be entered' },
                      {
                        validator: (_rule, value, callback) => {
                          if (value) {
                            if (
                              !ValidConst.price.test(value) ||
                              !(value < 100000000 && value > 0)
                            ) {
                              callback('0.01-99999999.99');
                            }
                          }
                          callback();
                        }
                      }
                    ],
                    initialValue: level.reduction
                  })(
                    <Input
                      style={{ width: 200 }}
                      placeholder={'0.01-99999999.99'}
                      onChange={(e) => {
                        this.onChange(index, 'reduction', e.target.value);
                      }}
                    />
                  )}
                  <span>
                    &nbsp;{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG_NAME)}
                    &nbsp;&nbsp;
                  </span>
                </FormItem>

                {index > 0 && (
                  <a onClick={() => this.deleteLevels(index)}>Delete</a>
                )}
              </HasError>
            </div>
          );
        })}
        {this.state.isNormal ? (
          <div>
            <Button
              onClick={this.addLevels}
              disabled={fullReductionLevelList.length >= 5}
            >
              Add multi-level promotions
            </Button>
            &nbsp;&nbsp;up to 5 levels can be set
          </div>
        ) : null}
      </div>
    );
  }

  /**
   * 删除等级
   * @param index
   */
  deleteLevels = (index) => {
    let { fullReductionLevelList } = this.state;
    //重置表单的值
    this.props.form.setFieldsValue({
      [`level_rule_value_${fullReductionLevelList.length - 1}`]: null
    });
    this.props.form.setFieldsValue({
      [`level_rule_reduction_${fullReductionLevelList.length - 1}`]: null
    });
    fullReductionLevelList.splice(index, 1);
    this.setState({ fullReductionLevelList: fullReductionLevelList });
    //传递到父页面
    const { onChangeBack } = this.props;
    onChangeBack(fullReductionLevelList);
  };

  /**
   * 添加多级促销
   */
  addLevels = () => {
    const { fullReductionLevelList } = this.state;
    if (fullReductionLevelList.length >= 5) return;
    fullReductionLevelList.push({
      key: this.makeRandom(),
      fullAmount: '0',
      fullCount: '0',
      reduction: null
    });
    this.setState({ fullReductionLevelList: fullReductionLevelList });

    //传递到父页面
    const { onChangeBack } = this.props;
    onChangeBack(fullReductionLevelList);
  };

  /**
   * 初始化等级
   */
  initLevel = () => {
    const initLevel = [
      {
        key: this.makeRandom(),
        fullAmount: '0',
        fullCount: '0',
        reduction: null
      }
    ];
    this.setState({ fullReductionLevelList: initLevel });

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
    const { fullReductionLevelList } = this.state;
    fullReductionLevelList[index][props] = value;
    if (props == 'fullAmount') {
      fullReductionLevelList[index]['fullCount'] = null;
    } else if (props == 'fullCount') {
      fullReductionLevelList[index]['fullAmount'] = null;
    }
    this.setState({ fullReductionLevelList: fullReductionLevelList });

    //传递到父页面
    const { onChangeBack } = this.props;
    onChangeBack(fullReductionLevelList);
  };

  /**
   * 生成随机数，作为key值
   * @returns {string}
   */
  makeRandom = () => {
    return 'key' + (Math.random() as any).toFixed(6) * 1000000;
  };
}
