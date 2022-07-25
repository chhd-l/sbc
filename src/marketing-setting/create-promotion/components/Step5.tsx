import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Radio } from 'antd';
import ButtonLayer from '@/marketing-setting/create-promotion/components/ButtonLayer';
import { FormattedMessage } from 'react-intl';
import { cache, Const, ValidConst } from 'qmkit';
import GiftLevels from '@/marketing-add/full-gift/components/gift-levels';
import { fromJS } from 'immutable';
import { enumConst } from '@/marketing-setting/create-promotion/enum';
import { FormContext } from '@/marketing-setting/create-promotion';

function Step5({ form }) {
  const { changeFormData, formData, match, setStep, formItemLayout } = useContext<any>(FormContext);
  const { getFieldDecorator, validateFields, setFieldsValue, setFields, getFieldsValue } = form;
  const [couponPromotionType, setCouponPromotionType] = useState(0);
  const [appliesType, setAppliesType] = useState(0);

  const [selectedGiftRows, setSelectedGiftRows] = useState<any>(fromJS([]));
  const [fullGiftLevelList, setFullGiftLevelList] = useState<any>([]);

  const [selectedLeafletRows, setSelectedLeafletRows] = useState<any>(fromJS([]));
  const [leafletLevelList, setLeafletLevelList] = useState<any>([]);

  useEffect(() => {
    setFullGiftLevelList([
      {
        key: makeRandom(),
        fullAmount: null,
        fullCount: null,
        giftType: 1,
        fullGiftDetailList: []
      }
    ]);
    setLeafletLevelList([
      {
        key: makeRandom(),
        fullAmount: null,
        fullCount: null,
        giftType: 1,
        fullGiftDetailList: []
      }
    ]);
    if (match.params.id) {
      setCouponPromotionType(formData.Advantage.couponPromotionType);
      setAppliesType(formData.Advantage.appliesType)
      if (
        formData.subType === 4 ||
        formData.subType === 5 ||
        formData.Advantage.couponPromotionType
      ) {
        setFullGiftLevelList(formData.Advantage.fullGiftLevelList);
        setSelectedGiftRows(fromJS(formData.Advantage.selectedGiftRows) || fromJS([]));
      }
      if (formData.subType === 14 || formData.subType === 15 || formData.Advantage.couponPromotionType) {
        setLeafletLevelList(formData.Advantage.fullLeafletLevelList);
        setSelectedLeafletRows(fromJS(formData.Advantage.selectedLeafletRows) || fromJS([]));
      }
    }
  }, []);

  const toNext = () => {
    validateFields((err, values) => {
      if (couponPromotionType === 4 && selectedGiftRows.length === 0) {
        setFields({
          rules: {
            value: null,
            errors: [
              new Error(
                (window as any).RCi18n({
                  id: 'Marketing.PleaseSettingRules'
                })
              )
            ]
          }
        });
        return;
      }
      if (couponPromotionType === 5 && selectedLeafletRows.length === 0) {
        setFields({
          leaflet: {
            value: null,
            errors: [
              new Error(
                (window as any).RCi18n({
                  id: 'Marketing.PleaseSettingRules'
                })
              )
            ]
          }
        });
        return;
      }
      if (!err) {
        changeFormData(enumConst.stepEnum[4], {
          ...values,
          fullGiftLevelList,
          selectedGiftRows: selectedGiftRows.toJS(),
          fullLeafletLevelList: leafletLevelList,
          selectedLeafletRows: selectedLeafletRows.toJS()
        });
        setStep(5);
      }
    });
  };

  // 目的： 修改 step4 中 Cart limit- Amount 对 Promotion value 进行校验
  useEffect(() => {
    setFieldsValue(getFieldsValue(['denomination']));
  }, [formData.Conditions.fullMoney]);

  //当前面选项影响到gift时，处理默认选中项
  useEffect(() => {
    if (couponPromotionType === 4 || couponPromotionType === 5) {
      if (formData.PromotionType.typeOfPromotion === 1) {
        console.log('切换coupon');
        setFieldsValue({
          couponPromotionType: 0
        });
        setCouponPromotionType(0);
      }
    }
  }, [formData.PromotionType.typeOfPromotion, formData.Conditions.promotionType]);
  /**
   * 规则变化方法
   * @param rules
   */
  const onRulesChange = (rules) => {
    setFullGiftLevelList(rules);
    changeFormData(enumConst.stepEnum[4], {
      fullGiftLevelList: rules,
      couponPromotionType: couponPromotionType
    });
    // let errorObject = {};
    // //满赠规则具体内容校验
    // rules.forEach((level, index) => {
    //   //校验赠品是否为空
    //   if (!level.fullGiftDetailList || level.fullGiftDetailList.length == 0) {
    //     errorObject[`level_${index}`] = {
    //       value: null,
    //       errors: [new Error('A full gift cannot be empty')]
    //     };
    //   } else {
    //     errorObject[`level_${index}`] = {
    //       value: null,
    //       errors: null
    //     };
    //   }
    // });
    // form.setFields(errorObject);
  };

  const GiftRowsOnChange = (rows) => {
    console.log(rows);
    setSelectedGiftRows(rows);

    if (rows.length == 0) {
      setFields({
        rules: {
          value: null,
          errors: [
            new Error(
              (window as any).RCi18n({
                id: 'Marketing.PleaseSettingRules'
              })
            )
          ]
        }
      });
    } else {
      setFields({
        rules: {
          value: null,
          errors: null
        }
      });
    }
  };

  const onLeafletChange = (rules) => {
    setLeafletLevelList(rules);
    changeFormData(enumConst.stepEnum[4], {
      fullLeafletLevelList: rules,
      couponPromotionType: couponPromotionType
    });
  };
  const LeafletRowsOnChange = (rows) => {
    console.log(rows);
    setSelectedLeafletRows(rows);

    if (rows.length == 0) {
      setFields({
        leaflet: {
          value: null,
          errors: [
            new Error(
              (window as any).RCi18n({
                id: 'Marketing.PleaseSettingRules'
              })
            )
          ]
        }
      });
    } else {
      setFields({
        leaflet: {
          value: null,
          errors: null
        }
      });
    }
  };
  /**
   * 生成随机数，作为key值
   * @returns {string}
   */
  const makeRandom = () => {
    return 'key' + ((window.crypto.getRandomValues(new Uint8Array(1)) * 0.001) as any).toFixed(6) * 1000000;
  };
  return (
    <div>
      <div className="step-title">
        <FormattedMessage id="Marketing.Advantage" />
      </div>

      <Form {...formItemLayout} labelAlign="left" className="marketing-form-container">
        <Form.Item label={<FormattedMessage id="Marketing.AdvantageType" />}>
          {getFieldDecorator('couponPromotionType', {
            initialValue: couponPromotionType,
            rules: [
              {
                required: true,
                message: (window as any).RCi18n({
                  id: 'Marketing.PleaseSelectOne'
                })
              }
            ]
          })(
            <Radio.Group
              onChange={(e) => {
                setCouponPromotionType(e.target.value);
              }}
            >
              <Radio value={0}>
                <FormattedMessage id="Marketing.Amount" />
              </Radio>
              <Radio value={1}>
                <FormattedMessage id="Marketing.Percentage" />
              </Radio>
              {Const.SITE_NAME !== 'MYVETRECO' ? (
                <Radio value={3}>
                  <FormattedMessage id="Marketing.Freeshipping" />
                </Radio>
              ) : null}
              {Const.SITE_NAME !== 'MYVETRECO' ? (
                <Radio value={4}>
                  <FormattedMessage id="Marketing.Gifts" />
                </Radio>
              ) : null}
              {Const.SITE_NAME !== 'MYVETRECO' && formData.PromotionType.typeOfPromotion === 0 ? (
                <Radio value={5}><FormattedMessage id="Marketing.leaflet" /></Radio>
              ) : null}
            </Radio.Group>
          )}
        </Form.Item>
        {/*promotion 当选择 autoship和club时展示 首次订阅减免*/}
        {formData.PromotionType.typeOfPromotion === 0 &&
          (formData.Conditions.promotionType === 1 || formData.Conditions.promotionType === 2) ? (
          <>
            {couponPromotionType === 0 && (
              <>
                <Form.Item
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  label="For the first subscription order,reduction"
                >
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <FormattedMessage id="Marketing.reduction" />
                    &nbsp;&nbsp;
                  </span>
                  {getFieldDecorator('firstSubscriptionOrderReduction', {
                    initialValue: formData.Advantage.firstSubscriptionOrderReduction,
                    rules: [
                      {
                        required: true,
                        message: (window as any).RCi18n({
                          id: 'Marketing.AmountMustBeEntered'
                        })
                      },
                      {
                        validator: (_rule, value, callback) => {
                          if (value) {
                            if (
                              !ValidConst.price.test(value) ||
                              !(value < 100000000 && value > 0)
                            ) {
                              callback(
                                (window as any).RCi18n({
                                  id: 'Marketing.0.01-99999999.99'
                                })
                              );
                            }
                          }
                          callback();
                        }
                      }
                    ]
                  })(
                    <Input
                      style={{ width: 200 }}
                      placeholder={(window as any).RCi18n({
                        id: 'Marketing.0.01-99999999.99'
                      })}
                    />
                  )}
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  label="For the rest subscription order,reduction"
                  required={false}
                  labelAlign="left"
                >
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <FormattedMessage id="Marketing.reduction" />
                    &nbsp;&nbsp;
                  </span>
                  {getFieldDecorator('restSubscriptionOrderReduction', {
                    initialValue: formData.Advantage.restSubscriptionOrderReduction,
                    rules: [
                      {
                        validator: (_rule, value, callback) => {
                          if (value) {
                            if (
                              !ValidConst.price.test(value) ||
                              !(value < 100000000 && value > 0)
                            ) {
                              callback(
                                (window as any).RCi18n({
                                  id: 'Marketing.0.01-99999999.99'
                                })
                              );
                            }
                          }
                          callback();
                        }
                      }
                    ]
                  })(
                    <Input
                      style={{ width: 200 }}
                      placeholder={(window as any).RCi18n({
                        id: 'Marketing.0.01-99999999.99'
                      })}
                    />
                  )}
                </Form.Item>
                {formData.Conditions.promotionType === 2 && (
                  <Form.Item label={<FormattedMessage id="Marketing.LimitThePromotionTo" />}>
                    {getFieldDecorator('subscriptionRefillLimit', {
                      initialValue: formData.Advantage.subscriptionRefillLimit,
                      rules: [
                        {
                          validator: (_rule, value, callback) => {
                            let rule = /^(?:[1-5][0-9]?)$/;
                            if (value) {
                              if (!rule.test(value) || (value > 50 || value < 0)) {
                                callback(
                                  (window as any).RCi18n({
                                    id: 'Marketing.InputValuefrom1to50'
                                  })
                                )

                              }
                            }
                            callback();
                          }
                        },
                      ]
                    })(
                      <Input
                        style={{ width: 150 }}
                        type={'number'}
                        placeholder={
                          (window as any).RCi18n({
                            id: 'Marketing.InputValuefrom1to50'
                          })
                        }
                      />
                    )}
                    <span>
                      &nbsp;
                      <FormattedMessage id="Marketing.refills" />
                    </span>
                  </Form.Item>
                )}
              </>
            )}
            {couponPromotionType === 1 && (
              <>
                <Form.Item
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  label={<FormattedMessage id="Marketing.Forthefirstsubscription" />}
                  required={true}
                  labelAlign="left"
                >
                  <div style={{ display: 'flex' }}>
                    <Form.Item>
                      <span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <FormattedMessage id="Marketing.discount" />
                        &nbsp;&nbsp;
                      </span>
                      {getFieldDecorator('firstSubscriptionOrderDiscount', {
                        initialValue: formData.Advantage.firstSubscriptionOrderDiscount,
                        rules: [
                          {
                            required: true,
                            message: (window as any).RCi18n({
                              id: 'Marketing.AmountMustBeEntered'
                            })
                          },
                          {
                            validator: (_rule, value, callback) => {
                              if (value) {
                                if (!/^(?:[1-9][0-9]?)$/.test(value)) {
                                  // 0|[1-9][0-9]?|100
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
                        ]
                      })(
                        <Input
                          style={{ width: 150 }}
                          title={(window as any).RCi18n({
                            id: 'Marketing.InputValuefrom1to99'
                          })}
                          placeholder={(window as any).RCi18n({
                            id: 'Marketing.InputValuefrom1to99'
                          })}
                        />
                      )}
                      <span>
                        &nbsp;
                        <FormattedMessage id="Marketing.percent" />
                        &nbsp;
                        <FormattedMessage id="Marketing.ofOrginalPrice" />
                        ,&nbsp;
                      </span>
                    </Form.Item>
                    <Form.Item>
                      <span>
                        &nbsp;
                        <FormattedMessage id="Marketing.discount" />{' '}
                        <FormattedMessage id="Marketing.limit" />
                        &nbsp;&nbsp;
                      </span>
                      {getFieldDecorator('firstSubscriptionLimitAmount', {
                        initialValue: formData.Advantage.firstSubscriptionLimitAmount,
                        rules: [
                          // { required: true, message: 'Must enter rules' },
                          {
                            validator: (_rule, value, callback) => {
                              if (value) {
                                if (
                                  !ValidConst.noZeroNumber.test(value) ||
                                  !(value < 10000 && value > 0)
                                ) {
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
                        ]
                      })(
                        <Input
                          style={{ width: 150 }}
                          className="input-width"
                          title={(window as any).RCi18n({
                            id: 'Marketing.1-9999'
                          })}
                          placeholder={(window as any).RCi18n({
                            id: 'Marketing.1-9999'
                          })}
                        />
                      )}
                      &nbsp;{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                    </Form.Item>
                  </div>
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  label={<FormattedMessage id="Marketing.Fortherestsubscription" />}
                  required={false}
                  labelAlign="left"
                >
                  <div style={{ display: 'flex' }}>
                    <Form.Item>
                      <span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <FormattedMessage id="Marketing.discount" />
                        &nbsp;&nbsp;
                      </span>
                      {getFieldDecorator('restSubscriptionOrderDiscount', {
                        initialValue: formData.Advantage.restSubscriptionOrderDiscount,
                        rules: [
                          {
                            validator: (_rule, value, callback) => {
                              let rule =
                                formData.Conditions.promotionType == 1
                                  ? /^(?:[1-9][0-9]?)$/
                                  : /^(?:[1-9][0-9]?|100)$/;
                              if (value) {
                                if (!rule.test(value)) {
                                  formData.Conditions.promotionType == 1
                                    ? callback(
                                      (window as any).RCi18n({
                                        id: 'Marketing.InputValuefrom1to99'
                                      })
                                    )
                                    : callback(
                                      (window as any).RCi18n({
                                        id: 'Marketing.InputValuefrom1to100'
                                      })
                                    );
                                }
                              }
                              callback();
                            }
                          }
                        ]
                      })(
                        <Input
                          style={{ width: 150 }}
                          title={
                            formData.Conditions.promotionType == 1
                              ? (window as any).RCi18n({
                                id: 'Marketing.InputValuefrom1to99'
                              })
                              : (window as any).RCi18n({
                                id: 'Marketing.InputValuefrom1to100'
                              })
                          }
                          placeholder={
                            formData.Conditions.promotionType == 1
                              ? (window as any).RCi18n({
                                id: 'Marketing.InputValuefrom1to99'
                              })
                              : (window as any).RCi18n({
                                id: 'Marketing.InputValuefrom1to100'
                              })
                          }
                        />
                      )}
                      <span>
                        &nbsp;
                        <FormattedMessage id="Marketing.percent" />
                        &nbsp;
                        <FormattedMessage id="Marketing.ofOrginalPrice" />
                        ,&nbsp;
                      </span>
                    </Form.Item>

                    <Form.Item>
                      <span>
                        &nbsp;
                        <FormattedMessage id="Marketing.discount" />{' '}
                        <FormattedMessage id="Marketing.limit" />
                        &nbsp;&nbsp;
                      </span>
                      {getFieldDecorator('restSubscriptionLimitAmount', {
                        initialValue: formData.Advantage.restSubscriptionLimitAmount,
                        rules: [
                          {
                            validator: (_rule, value, callback) => {
                              if (value) {
                                if (
                                  !ValidConst.noZeroNumber.test(value) ||
                                  !(value < 10000 && value > 0)
                                ) {
                                  callback(
                                    (window as any).RCi18n({
                                      id: 'Marketing.1-9999'
                                    })
                                  );
                                }
                              }
                              callback();
                            }
                          }
                        ]
                      })(
                        <Input
                          style={{ width: 150 }}
                          className="input-width"
                          title={(window as any).RCi18n({
                            id: 'Marketing.1-9999'
                          })}
                          placeholder={(window as any).RCi18n({
                            id: 'Marketing.1-9999'
                          })}
                        />
                      )}
                      &nbsp;{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                    </Form.Item>
                  </div>
                </Form.Item>
                {Const.SITE_NAME !== 'MYVETRECO' && (
                  <Form.Item label={<FormattedMessage id="Marketing.promotionAppliesType" />}>
                    {getFieldDecorator('appliesType', {
                      initialValue: appliesType,
                      rules: [
                        {
                          required: true,
                          message: (window as any).RCi18n({
                            id: 'Marketing.PleaseSelectOne'
                          })
                        }
                      ]
                    })(
                      <Radio.Group
                        onChange={(e) => {
                          setAppliesType(e.target.value);
                        }}
                      >
                        <Radio value={0}>
                          <FormattedMessage id="Marketing.All" />
                        </Radio>
                        <Radio value={1}>
                          <FormattedMessage id="Marketing.MostExpensive" />
                        </Radio>
                        <Radio value={2}>
                          <FormattedMessage id="Marketing.Cheapest" />
                        </Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                )}

                {formData.Conditions.promotionType === 2 && (
                  <Form.Item label={<FormattedMessage id="Marketing.LimitThePromotionTo" />}>
                    {getFieldDecorator('subscriptionRefillLimit', {
                      initialValue: formData.Advantage.subscriptionRefillLimit,
                      rules: [
                        {
                          validator: (_rule, value, callback) => {
                            let rule = /^(?:[1-5][0-9]?)$/;
                            if (value) {
                              if (!rule.test(value) || (value > 50 || value < 0)) {
                                callback(
                                  (window as any).RCi18n({
                                    id: 'Marketing.InputValuefrom1to50'
                                  })
                                )

                              }
                            }
                            callback();
                          }
                        }
                      ]
                    })(
                      <Input
                        style={{ width: 150 }}
                        type='number'
                        placeholder={
                          (window as any).RCi18n({
                            id: 'Marketing.InputValuefrom1to50'
                          })
                        }
                      />
                    )}
                    <span>
                      &nbsp;
                      <FormattedMessage id="Marketing.refills" />
                    </span>
                  </Form.Item>
                )}



              </>
            )}
          </>
        ) : (
          <>
            {couponPromotionType === 0 && (
              <>
                <Form.Item
                  {...formItemLayout}
                  label={<FormattedMessage id="Marketing.PromotionValue" />}
                  required={true}
                >
                  {getFieldDecorator('denomination', {
                    initialValue: formData.Advantage.denomination,
                    rules: [
                      {
                        required: true,
                        message: (window as any).RCi18n({
                          id: 'Marketing.theFaceValueOfCoupon'
                        })
                      },
                      {
                        validator: (_rule, value, callback) => {
                          if (value) {
                            if (!ValidConst.noZeroNumber.test(value) || value < 1 || value > 99999) {
                              callback(
                                (window as any).RCi18n({
                                  id: 'Marketing.IntegersBetweenAreAllowed'
                                })
                              );
                              return;
                            }
                            if (
                              formData.Conditions.fullMoney &&
                              Number(value) > Number(formData.Conditions.fullMoney)
                            ) {
                              callback('Value cannot be greater than the previous value.');
                            }
                          }
                          callback();
                        }
                      }
                    ]
                  })(
                    <Input
                      placeholder={(window as any).RCi18n({
                        id: 'Marketing.integerfrom1to99999'
                      })}
                      addonBefore={sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                      maxLength={5}
                      style={{ width: 360 }}
                    />
                  )}
                </Form.Item>
              </>
            )}
            {couponPromotionType === 1 && (
              <>
                <Form.Item
                  {...formItemLayout}
                  label={<FormattedMessage id="Marketing.PromotionValue" />}
                  required={true}
                  style={{ marginBottom: '0px' }}
                >
                  <div style={{ display: 'flex' }}>
                    <Form.Item>
                      {getFieldDecorator('couponDiscount', {
                        // initialValue: 99,
                        initialValue: formData.Advantage.couponDiscount,
                        rules: [
                          {
                            required: true,
                            message: (window as any).RCi18n({
                              id: 'Marketing.Pleaseinputcoupondiscount'
                            })
                          },
                          {
                            validator: (_rule, value, callback) => {
                              if (value) {
                                if (!/^(?:[1-9][0-9]?)$/.test(value)) {
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
                        ]
                      })(<Input placeholder="1-99" maxLength={3} style={{ width: 160 }} />)}{' '}
                      %,
                    </Form.Item>
                    <Form.Item>
                      <span>
                        &nbsp;
                        <FormattedMessage id="Marketing.discount" />{' '}
                        <FormattedMessage id="Marketing.limit" />
                        &nbsp;&nbsp;
                      </span>
                      {getFieldDecorator('limitAmount', {
                        initialValue: formData.Advantage.limitAmount,
                        rules: [
                          {
                            validator: (_rule, value, callback) => {
                              if (value) {
                                if (
                                  !ValidConst.noZeroNumber.test(value) ||
                                  !(value < 10000 && value > 0)
                                ) {
                                  callback(
                                    (window as any).RCi18n({
                                      id: 'Marketing.1-9999'
                                    })
                                  );
                                }
                              }
                              callback();
                            }
                          }
                        ]
                      })(
                        <Input
                          className="input-width"
                          title={(window as any).RCi18n({
                            id: 'Marketing.1-9999'
                          })}
                          placeholder={(window as any).RCi18n({
                            id: 'Marketing.1-9999'
                          })}
                          style={{ width: 160 }}
                        />
                      )}
                      &nbsp;{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                    </Form.Item>
                  </div>
                </Form.Item>
                {Const.SITE_NAME !== 'MYVETRECO' && (
                  <Form.Item label={<FormattedMessage id="Marketing.promotionAppliesType" />}>
                    {getFieldDecorator('appliesType', {
                      initialValue: appliesType,
                      rules: [
                        {
                          required: true,
                          message: (window as any).RCi18n({
                            id: 'Marketing.PleaseSelectOne'
                          })
                        }
                      ]
                    })(
                      <Radio.Group
                        onChange={(e) => {
                          setAppliesType(e.target.value);
                        }}
                      >
                        <Radio value={0}>
                          <FormattedMessage id="Marketing.All" />
                        </Radio>
                        <Radio value={1}>
                          <FormattedMessage id="Marketing.MostExpensive" />
                        </Radio>
                        <Radio value={2}>
                          <FormattedMessage id="Marketing.Cheapest" />
                        </Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                )}

                {/* {formData.Conditions.promotionType === 2 && (
                  <Form.Item label={<FormattedMessage id="Marketing.LimitThePromotionTo" />}>
                    {getFieldDecorator('subscriptionRefillLimit', {
                      initialValue: formData.Advantage.subscriptionRefillLimit,
                      rules: [
                        {
                          validator: (_rule, value, callback) => {
                            let rule = /^(?:[1-5][0-9]?)$/;
                            if (value) {
                              if (!rule.test(value) || (value > 50 || value < 0)) {
                                callback(
                                  (window as any).RCi18n({
                                    id: 'Marketing.InputValuefrom1to50'
                                  })
                                )

                              }
                            }
                            callback();
                          }
                        }
                      ]
                    })(
                      <Input
                        style={{ width: 150 }}
                        placeholder={
                          (window as any).RCi18n({
                            id: 'Marketing.InputValuefrom1to50'
                          })
                        }
                      />
                    )}
                    <span>
                      &nbsp;
                      <FormattedMessage id="Marketing.refills" />
                    </span>
                  </Form.Item>
                )} */}

              </>
            )}
          </>
        )}
        {/*promotion gift所有可选*/}
        {couponPromotionType === 4 && (
          <Form.Item wrapperCol={{ offset: 0, span: 24 }} required={true} labelAlign="left">
            {getFieldDecorator(
              'rules',
              {}
            )(
              <GiftLevels
                form={form}
                selectedRows={selectedGiftRows}
                isNormal={false}
                fullGiftLevelList={fullGiftLevelList}
                onChangeBack={onRulesChange}
                isFullCount={formData.Conditions.CartLimit === 1 ? 0 : 1}
                GiftRowsOnChange={GiftRowsOnChange}
                noMulti={true}
                addText={<FormattedMessage id="Marketing.Addgift" />}
              />
            )}
          </Form.Item>
        )}
        {couponPromotionType === 5 && (
          <Form.Item wrapperCol={{ offset: 0, span: 24 }} required={true} labelAlign="left">
            {getFieldDecorator(
              'leaflet',
              {}
            )(
              <GiftLevels
                form={form}
                selectedRows={selectedLeafletRows}
                isNormal={false}
                fullGiftLevelList={leafletLevelList}
                onChangeBack={onLeafletChange}
                isFullCount={formData.Conditions.CartLimit === 1 ? 0 : 1}
                GiftRowsOnChange={LeafletRowsOnChange}
                noMulti={true}
                addText={<FormattedMessage id="Marketing.AddLeafletRule" />}
                goodsCate="commercial leaflet"
              />
            )}
          </Form.Item>
        )}
      </Form>

      <ButtonLayer
        step={4}
        toNext={toNext}
        fullGiftLevelList={fullGiftLevelList}
        setFields={setFields}
      />
    </div>
  );
}

export default Form.create<any>()(Step5);
