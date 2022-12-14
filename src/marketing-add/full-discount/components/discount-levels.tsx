import * as React from 'react';

import { Input, Button, Form } from 'antd';
import { noop, ValidConst, cache, RCi18n } from 'qmkit';
import { FormattedMessage, injectIntl } from 'react-intl'
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
class DiscountLevels extends React.Component<any, any> {
  props: {
    intl: any;
  }
  constructor(props) {
    super(props);
    this.state = {
      isFullCount: null,
      isNormal: true,
      fullDiscountLevelList: []
    };
  }

  // componentDidMount() {
  //   if (!this.props.fullDiscountLevelList || this.props.fullDiscountLevelList.length == 0) {
  //     this.initLevel();
  //   }
  // }
  // componentWillReceiveProps(nextProps: Readonly<any>, nextContext: any) {
  //   this.setState({
  //     isNormal: nextProps.isNormal,
  //     isFullCount: nextProps.isFullCount,
  //     fullDiscountLevelList: nextProps.fullDiscountLevelList
  //   });
  // }
  //
  // shouldComponentUpdate(nextProps) {
  //   let resetFields = {};
  //   const { fullDiscountLevelList, isFullCount } = this.props;
  //   if (isFullCount != nextProps.isFullCount) {
  //     fullDiscountLevelList.forEach((_level, index) => {
  //       resetFields[`level_rule_value_${index}`] = null;
  //       resetFields[`level_rule_discount_${index}`] = null;
  //     });
  //     this.initLevel();
  //     this.setState({ isFullCount: nextProps.isFullCount });
  //   } else {
  //     if (fullDiscountLevelList && fullDiscountLevelList.length != nextProps.fullDiscountLevelList.length) {
  //       fullDiscountLevelList.forEach((level, index) => {
  //         if ((!isFullCount ? level.fullAmount : level.fullCount) != null) {
  //           resetFields[`level_rule_value_${index}`] = !isFullCount ? level.fullAmount : level.fullCount;
  //           resetFields[`level_rule_discount_${index}`] = level.discount;
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
    const { isFullCount, fullDiscountLevelList, isNormal } = this.props;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div>
        {fullDiscountLevelList &&
          fullDiscountLevelList.map((level, index) => {
            return (
              <div key={level.key ? level.key : level.discountLevelId}>
                <FormItem key={index} >
                  {getFieldDecorator(
                    `level_${index}`,
                    {}
                  )(
                    <HasError>
                      <div className="flex-wrap" >
                        {isNormal ? (
                          <div className="flex-inline">
                            <span>Full&nbsp;</span>
                            <FormItem style={{ display: 'inline-block' }}>
                              {getFieldDecorator(`level_rule_value_${index}`, {
                                rules: [
                                  { required: true, message:
                                      (window as any).RCi18n({
                                        id: 'Marketing.Mustenterrules'
                                      })
                                  },
                                  {
                                    validator: (_rule, value, callback) => {
                                      if (value) {
                                        if (!isFullCount) {
                                          if (value == 0) {
                                            callback();
                                          }
                                          if (!ValidConst.price.test(value) || !(value < 100000000 && value > 0)) {
                                            callback(
                                              (window as any).RCi18n({
                                                id: 'Marketing.0-99999999.99'
                                              })
                                            );
                                          }
                                        } else {
                                          if (!ValidConst.noZeroNineNumber.test(value) || !(value < 10000 && value > 0)) {
                                            callback(
                                              (window as any).RCi18n({
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
                                <Input
                                  // style={{ width: 200 }}
                                  className="input-width"
                                  placeholder={isFullCount === 0 ?
                                    (window as any).RCi18n({
                                      id: 'Marketing.0-99999999.99'
                                    })
                                    : isFullCount === 1 ?
                                      (window as any).RCi18n({
                                        id: 'Marketing.1-9999'
                                      })
                                      : 0}
                                  onChange={(e) => {
                                    this.ruleValueChange(index, e.target.value);
                                  }}
                                  value={!isFullCount ? level.fullAmount : level.fullCount}
                                  disabled={isFullCount === 2}
                                />

                              )}
                            </FormItem>
                            <span>
                            {' '}
                              &nbsp;
                              {isFullCount !== 1 ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) : 'items'},
                          </span>
                          </div>
                        ) : null}
                        <div  className="flex-inline">
                          <FormItem>
                            <span>&nbsp;discount price&nbsp;&nbsp;</span>
                            {getFieldDecorator(`level_rule_discount_${index}`, {
                              rules: [
                                {
                                  required: true,
                                  message: (window as any).RCi18n({
                                    id: 'Marketing.Discountmustbeentered'
                                  })
                                },
                                {
                                  validator: (_rule, value, callback) => {
                                    if (value) {
                                      if (!/^(?:[1-9][0-9]?)$/.test(value)) { // /(^[0-9]?(\.[0-9])?$)/
                                        callback(
                                          (window as any).RCi18n({
                                            id: 'Marketing.InputValuefrom1to99'
                                          })
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
                                // style={{ width: 200 }}
                                className="input-width"
                                title={
                                  (window as any).RCi18n({
                                    id: 'Marketing.InputValuefrom1to99'
                                  })
                                }
                                placeholder={
                                  (window as any).RCi18n({
                                    id: 'Marketing.InputValuefrom1to99'
                                  })
                                }
                                onChange={(e) => {
                                  this.onChange(index, 'discount', e.target.value); //parseFloat()
                                }}
                                value={level.discount}
                              />
                            )}
                            <span>&nbsp;<FormattedMessage id="Marketing.percent" />&nbsp;<FormattedMessage id="Marketing.ofOrginalPrice" /></span>
                          </FormItem>
                        </div>

                        <div className="flex-inline">
                          <FormItem>
                            <span>&nbsp;discount limit&nbsp;&nbsp;</span>
                            {getFieldDecorator(`level_rule_discount_limit${index}`, {
                              rules: [
                                // { required: true, message: 'Must enter rules' },
                                {
                                  validator: (_rule, value, callback) => {
                                    if (value) {
                                      if (!ValidConst.noZeroNumber.test(value) || !(value < 10000 && value > 0)) {
                                        callback(
                                          (window as any).RCi18n({
                                            id: 'Marketing.1-9999'
                                          })
                                        );
                                      }
                                    }
                                    callback();
                                  }
                                  // callback();
                                }
                              ],
                              initialValue: level.limitAmount
                            })(
                              <Input
                                // style={{ width: 200 }}
                                className="input-width"
                                title={
                                  (window as any).RCi18n({
                                    id: 'Marketing.1-9999'
                                  })
                                }
                                placeholder={
                                  (window as any).RCi18n({
                                    id: 'Marketing.1-9999'
                                  })
                                }
                                onChange={(e) => {
                                  this.onChange(index, 'limitAmount', e.target.value);//parseInt
                                }}
                                value={level.limitAmount}
                              />
                            )}
                            &nbsp;{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                          </FormItem>
                          {index > 0 && <a onClick={() => this.deleteLevels(index)}>Delete</a>}
                        </div>
                      </div>
                    </HasError>
                  )}
                </FormItem>
              </div>
            );
          })}
        {isNormal && isFullCount !== 2 ? (
          <div>
            <Button onClick={this.addLevels} disabled={fullDiscountLevelList && fullDiscountLevelList.length >= 5}>
              <FormattedMessage id="Marketing.Addmulti-levelpromotions" />
            </Button>
            &nbsp;&nbsp;<FormattedMessage id="Marketing.upto5levels" />
          </div>
        ) : null}
      </div>
    );
  }

  /**
   * ????????????
   * @param index
   */
  deleteLevels = (index) => {
    let { fullDiscountLevelList, onChangeBack } = this.props;
    //??????????????????
    this.props.form.setFieldsValue({
      [`level_rule_value_${fullDiscountLevelList.length - 1}`]: null
    });
    this.props.form.setFieldsValue({
      [`level_rule_discount_${fullDiscountLevelList.length - 1}`]: null
    });
    fullDiscountLevelList.splice(index, 1);
    //??????????????????
    onChangeBack(fullDiscountLevelList);
  };

  /**
   * ??????????????????
   */
  addLevels = () => {
    const { fullDiscountLevelList, onChangeBack } = this.props;
    if (fullDiscountLevelList.length >= 5) return;
    fullDiscountLevelList.push({
      key: this.makeRandom(),
      fullAmount: null,
      fullCount: null,
      discount: null
    });

    //??????????????????
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

    const { onChangeBack } = this.props;
    onChangeBack(initLevel);
  };

  /**
   * ????????????
   * @param index
   * @param value
   */
  ruleValueChange = (index, value) => {
    const { isFullCount } = this.props;
    this.onChange(index, !isFullCount ? 'fullAmount' : 'fullCount', value);
  };

  /**
   * ??????????????????????????????
   * @param index
   * @param props
   * @param value
   */
  onChange = (index, props, value) => {
    const { fullDiscountLevelList } = this.props;
    fullDiscountLevelList[index][props] = value;
    if (props == 'fullAmount') {
      fullDiscountLevelList[index]['fullCount'] = null;
    } else if (props == 'fullCount') {
      fullDiscountLevelList[index]['fullAmount'] = null;
    }


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

export default injectIntl(DiscountLevels)
