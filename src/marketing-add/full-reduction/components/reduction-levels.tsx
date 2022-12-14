import * as React from 'react';

import { Input, Button, Form } from 'antd';
import { ValidConst, cache } from 'qmkit';
import { FormattedMessage, injectIntl } from 'react-intl';

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

class ReductionLevels extends React.Component<any, any> {
  props: {
    intl: any;
  }
  constructor(props) {
    super(props);
    this.state = {
      isFullCount: null,
      isNormal: true,
      fullReductionLevelList:  [],
      PromotionTypeValue: 0
    };
  }

  // componentDidMount() {
  //   if (!this.props.fullReductionLevelList || this.props.fullReductionLevelList.length == 0) {
  //     this.initLevel();
  //   }
  // }
  // componentWillReceiveProps(nextProps: Readonly<any>, nextContext: any) {
  //   this.setState({
  //     isNormal: nextProps.isNormal,
  //     isFullCount: nextProps.isFullCount,
  //     fullReductionLevelList:  nextProps.fullReductionLevelList,
  //   });
  // }
  // shouldComponentUpdate(nextProps) {
  //   let resetFields = {};
  //   const { fullReductionLevelList, isFullCount } = this.props;
  //
  //   if (isFullCount != nextProps.isFullCount) {
  //     fullReductionLevelList.forEach((_level, index) => {
  //       resetFields[`level_rule_value_${index}`] = null;
  //       resetFields[`level_rule_reduction_${index}`] = null;
  //     });
  //     this.initLevel();
  //     this.setState({ isFullCount: nextProps.isFullCount });
  //   } else {
  //     if (fullReductionLevelList && fullReductionLevelList.length != nextProps.fullReductionLevelList.length) {
  //       nextProps.fullReductionLevelList.forEach((level, index) => {
  //         if ((!isFullCount ? level.fullAmount : level.fullCount) != null) {
  //           resetFields[`level_rule_value_${index}`] = !isFullCount ? level.fullAmount : level.fullCount;
  //           resetFields[`level_rule_reduction_${index}`] = level.reduction;
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
    const { isFullCount, fullReductionLevelList, isNormal } = this.props;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div>
        {fullReductionLevelList && fullReductionLevelList.map((level, index) => {
          return (
            <div key={level.key ? level.key : level.reductionLevelId}>
              <div className="flex-wrap">
                <HasError>
                  {isNormal ? (
                    <div className="flex-inline">
                      <span>Full&nbsp;</span>

                      <FormItem style={{ display: 'inline-block' }}>
                        {getFieldDecorator(`level_rule_value_${index}`, {
                          rules: [
                            { required: true, message:
                                (window as any).RCi18n({
                                  id: 'Marketing.ustenterrules',
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
                                          id: 'Marketing.0-99999999.99',
                                        })
                                      );
                                    }
                                  } else {
                                    if (!ValidConst.noZeroNumber.test(value) || !(value < 10000 && value > 0)) {
                                      callback(
                                        (window as any).RCi18n({
                                          id: 'Marketing.1-9999',
                                        })
                                      );
                                    }
                                  }
                                }
                                callback();
                              }
                              // callback();
                            }
                          ],
                          initialValue: !isFullCount ? level.fullAmount : level.fullCount
                        })(
                          <Input
                            style={{ width: 180 }}
                            value={!isFullCount ? level.fullAmount : level.fullCount}
                            placeholder={!isFullCount ?
                              (window as any).RCi18n({
                                id: 'Marketing.0-99999999.99',
                              })
                              :
                              (window as any).RCi18n({
                                id: 'Marketing.1-9999',
                              })
                            }
                            onChange={(e) => {
                              this.ruleValueChange(index, e.target.value);
                            }}
                            disabled={isFullCount === 2}
                          />
                        )}
                      </FormItem>
                      <span>
                            &nbsp;
                        {isFullCount !== 1 ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) : <FormattedMessage id="Marketing.items" />}???
                          </span>
                    </div>
                  ) : null}
                  <div className="flex-inline">
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;reduction&nbsp;&nbsp;</span>

                    <FormItem style={{ display: 'inline-block' }}>
                      {getFieldDecorator(`level_rule_reduction_${index}`, {
                        rules: [
                          { required: true, message:
                              (window as any).RCi18n({
                                id: 'Marketing.AmountMustBeEntered',
                              })
                          },
                          {
                            validator: (_rule, value, callback) => {
                              if (value) {
                                if (!ValidConst.price.test(value) || !(value < 100000000 && value > 0)) {
                                  callback(
                                    (window as any).RCi18n({
                                      id: 'Marketing.0.01-99999999.99',
                                    })
                                  );
                                } else if(!isFullCount && level.fullAmount &&  Number(value) > Number(level.fullAmount)) {
                                  callback(
                                    'Value cannot be greater than the previous value.'
                                  );
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
                          placeholder={
                            (window as any).RCi18n({
                              id: 'Marketing.0.01-99999999.99',
                            })
                          }
                          value={level.reduction}
                          onChange={(e) => {
                            this.onChange(index, 'reduction', e.target.value);
                          }}
                        />
                      )}
                    </FormItem>
                    <span>
                          &nbsp;{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                      &nbsp;&nbsp;
                        </span>
                  </div>
                  {index > 0 && <a onClick={() => this.deleteLevels(index)}>
                    <FormattedMessage id="Marketing.Delete" />
                  </a>
                  }
                </HasError>
              </div>
            </div>
          );
        })}
        {isNormal && isFullCount !== 2 ? (
          <div>
            <Button onClick={this.addLevels} disabled={fullReductionLevelList.length >= 5}>
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
    let { fullReductionLevelList, onChangeBack } = this.props;
    //??????????????????
    this.props.form.setFieldsValue({
      [`level_rule_value_${fullReductionLevelList.length - 1}`]: null
    });
    this.props.form.setFieldsValue({
      [`level_rule_reduction_${fullReductionLevelList.length - 1}`]: null
    });
    fullReductionLevelList.splice(index, 1);
    //??????????????????
    onChangeBack(fullReductionLevelList);
  };

  /**
   * ??????????????????
   */
  addLevels = () => {
    const { fullReductionLevelList, onChangeBack } = this.props;
    if (fullReductionLevelList.length >= 5) return;
    fullReductionLevelList.push({
      key: this.makeRandom(),
      fullAmount: '0',
      fullCount: '0',
      reduction: null
    });
    this.setState({ fullReductionLevelList: fullReductionLevelList });

    //??????????????????
    onChangeBack(fullReductionLevelList);
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
        reduction: null
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
    const { fullReductionLevelList, onChangeBack } = this.props;
    fullReductionLevelList[index][props] = value;
    if (props == 'fullAmount') {
      fullReductionLevelList[index]['fullCount'] = null;
    } else if (props == 'fullCount') {
      fullReductionLevelList[index]['fullAmount'] = null;
    }
    this.setState({ fullReductionLevelList: fullReductionLevelList });

    //??????????????????
    onChangeBack(fullReductionLevelList);
  };

  /**
   * ????????????????????????key???
   * @returns {string}
   */
  makeRandom = () => {
    return 'key' + (Math.rdmValue() as any).toFixed(6) * 1000000;
  };
}

export default injectIntl(ReductionLevels)
