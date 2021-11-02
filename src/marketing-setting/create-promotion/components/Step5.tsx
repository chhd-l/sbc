import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, Radio, Tree, Select, TreeSelect } from 'antd';
import ButtonLayer from '@/marketing-setting/create-promotion/components/ButtonLayer';
import { FormattedMessage } from 'react-intl';
import { cache, Const, ValidConst } from 'qmkit';
import GiftLevels from '@/marketing-add/full-gift/components/gift-levels';
import { fromJS } from 'immutable';
import { enumConst } from '@/marketing-setting/create-promotion/enum';
import { FormContext } from '@/marketing-setting/create-promotion';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};

function Step5({ form }) {
  const { changeFormData,formData,match,setFormData } = useContext<any>(FormContext);
  const { getFieldDecorator, validateFields, setFieldsValue, setFields, getFieldsValue } = form;
  const [couponPromotionType,setCouponPromotionType] = useState(0)

  const [selectedGiftRows,setSelectedGiftRows] = useState<any>(fromJS([]))
  const [fullGiftLevelList,setFullGiftLevelList]  = useState<any>([])


  useEffect(()=>{
    setFullGiftLevelList([{
      key: makeRandom(),
      fullAmount: null,
      fullCount: null,
      giftType: 1,
      fullGiftDetailList: []
    }])
    if(match.params.id){
      // editInit()
      setCouponPromotionType(formData.Advantage.couponPromotionType)
      if(formData.subType === 4 || formData.subType === 5){
        setFullGiftLevelList(formData.Advantage.fullGiftLevelList)
        setFullGiftLevelList(fromJS(formData.Advantage.selectedRows))
      }
    }
  },[])
  useEffect(()=>{
    console.log(formData)
    console.log(formData.Advantage.couponPromotionType)
    setCouponPromotionType(formData.Advantage.couponPromotionType)
  },[formData])

  // 目的： 修改 step4 中 Cart limit- Amount 对 Promotion value 进行校验
  useEffect(()=>{
    setFieldsValue(getFieldsValue(['denomination']))
  },[formData.Conditions.fullMoney])
  /**
   * 规则变化方法
   * @param rules
   */
  const onRulesChange = (rules) => {
    form.resetFields('rules');
    console.log(rules)
    setFullGiftLevelList(rules)
    changeFormData(enumConst.stepEnum[4],{
      fullGiftLevelList: rules,
      couponPromotionType:couponPromotionType,
    })
    let errorObject = {};
    //满赠规则具体内容校验
    rules.forEach((level, index) => {
      //校验赠品是否为空
      if (!level.fullGiftDetailList || level.fullGiftDetailList.length == 0) {
        errorObject[`level_${index}`] = {
          value: null,
          errors: [new Error('A full gift cannot be empty')]
        };
      } else {
        errorObject[`level_${index}`] = {
          value: null,
          errors: null
        };
      }
    });
    form.setFields(errorObject);
  };

  const GiftRowsOnChange = (rows) => {
    console.log(rows)
    setSelectedGiftRows(rows)
  }
  /**
   * 生成随机数，作为key值
   * @returns {string}
   */
  const makeRandom = () => {
    return 'key' + (Math.random() as any).toFixed(6) * 1000000;
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
                message:
                  (window as any).RCi18n({
                    id: 'Marketing.PleaseSelectOne'
                  })
              },
            ]
          })(
            <Radio.Group onChange={(e)=>{
              setCouponPromotionType(e.target.value)
              formData.Advantage.couponPromotionType = e.target.value
              setFormData({...formData})
              if(e.target.value === 3 && customerType === -4){
                setCustomerType(0)
                setFieldsValue({joinLevel:0})
              }
            }}>
              {
                !(formData.PromotionType.typeOfPromotion === 1 && formData.Conditions.CartLimit === 2) &&
                !(formData.PromotionType.typeOfPromotion === 0 &&
                  (formData.Conditions.promotionType === 1 || formData.Conditions.promotionType === 2) &&
                  (formData.Conditions.CartLimit === 1 || formData.Conditions.CartLimit === 2)
                )
                &&
                  (
                    <Radio value={0}>
                      <FormattedMessage id="Marketing.Amount" />
                    </Radio>
                  )
              }
              {
                !(formData.PromotionType.typeOfPromotion === 1 && formData.Conditions.CartLimit === 2)
                &&
                (
                  <Radio value={1}>
                    <FormattedMessage id="Marketing.Percentage" />
                  </Radio>
                )
              }
              <Radio value={3}>
                <FormattedMessage id="Marketing.Freeshipping" />
              </Radio>
              {
                (formData?.PromotionType?.typeOfPromotion !== 1 && formData?.Conditions?.promotionType === 0 ) &&
                <Radio value={4}>
                  <FormattedMessage id="Marketing.Gifts" />
                </Radio>
              }

            </Radio.Group>
          )}
        </Form.Item>
        {/*promotion 当选择 autoship和club时展示 首次订阅减免*/}
        {
          formData.PromotionType.typeOfPromotion === 0 && (formData.Conditions.promotionType === 1 || formData.Conditions.promotionType === 2) ?
            (
              <>
                {
                  couponPromotionType === 0 &&
                    (
                      <>
                      <Form.Item labelCol={{span: 8}} wrapperCol={{span:16}} label="For the first subscription order,reduction">
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;<FormattedMessage id="Marketing.reduction" />&nbsp;&nbsp;</span>
                        {getFieldDecorator('firstSubscriptionOrderReduction', {
                          initialValue: formData.Advantage.firstSubscriptionOrderReduction,
                          rules: [
                            {
                              required: true, message:
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
                                  }
                                }
                                callback();
                              }
                            }
                          ],
                        })(
                          <Input
                            style={{ width: 200 }}
                            placeholder={
                              (window as any).RCi18n({
                                id: 'Marketing.0.01-99999999.99',
                              })
                            }
                          />
                        )}
                      </Form.Item>
                      <Form.Item labelCol={{span: 8}} wrapperCol={{span:16}} label="For the rest subscription order,reduction" required={false} labelAlign="left" >
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;<FormattedMessage id="Marketing.reduction" />&nbsp;&nbsp;</span>
                        {getFieldDecorator('restSubscriptionOrderReduction', {
                          initialValue: formData.Advantage.restSubscriptionOrderReduction,
                          rules: [
                            {
                              validator: (_rule, value, callback) => {
                                if (value) {
                                  if (!ValidConst.price.test(value) || !(value < 100000000 && value > 0)) {
                                    callback(
                                      (window as any).RCi18n({
                                        id: 'Marketing.0.01-99999999.99',
                                      })
                                    );
                                  }
                                }
                                callback();
                              }
                            }
                          ],
                        })(
                          <Input
                            style={{ width: 200 }}
                            placeholder={
                              (window as any).RCi18n({
                                id: 'Marketing.0.01-99999999.99',
                              })
                            }
                          />
                        )}
                      </Form.Item>
                      </>
                    )
                }
                {
                  couponPromotionType === 1 &&
                  (
                    <>
                      <Form.Item labelCol={{span: 8}} wrapperCol={{span:16}} label={<FormattedMessage id="Marketing.Forthefirstsubscription" />} required={true} labelAlign="left" >
                        <div style={{ display: 'flex' }}>
                          <Form.Item>
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;<FormattedMessage id="Marketing.discount" />&nbsp;&nbsp;</span>
                            {getFieldDecorator('firstSubscriptionOrderDiscount', {
                              initialValue: formData.Advantage.firstSubscriptionOrderDiscount ?  formData.Advantage.firstSubscriptionOrderDiscount*100 : '',
                              rules: [
                                {
                                  required: true, message:
                                    (window as any).RCi18n({
                                      id: 'Marketing.AmountMustBeEntered',
                                    })
                                },
                                {
                                  validator: (_rule, value, callback) => {
                                    if (value) {
                                      if (!/^(?:[1-9][0-9]?)$/.test(value)) { // 0|[1-9][0-9]?|100
                                        callback(
                                          (window as any).RCi18n({
                                            id: 'Marketing.InputValuefrom1to99',
                                          })
                                        );
                                      }
                                    }
                                    callback();
                                  }
                                }
                              ],
                            })(
                              <Input
                                style={{ width: 150 }}
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
                              />
                            )}
                            <span>&nbsp;<FormattedMessage id="Marketing.percent" />&nbsp;<FormattedMessage id="Marketing.ofOrginalPrice" />,&nbsp;</span>
                          </Form.Item>
                          <Form.Item>
                            <span>&nbsp;discount limit&nbsp;&nbsp;</span>
                            {getFieldDecorator('firstSubscriptionLimitAmount', {
                              initialValue: formData.Advantage.firstSubscriptionLimitAmount,
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
                            })(
                              <Input
                                style={{ width: 150 }}
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
                              />
                            )}
                            &nbsp;{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                          </Form.Item>
                        </div>
                      </Form.Item>
                      <Form.Item labelCol={{span: 8}} wrapperCol={{span:16}} label={<FormattedMessage id="Marketing.Fortherestsubscription" />} required={false} labelAlign="left">
                        <div style={{ display: 'flex' }}>
                          <Form.Item>
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;<FormattedMessage id="Marketing.discount" />&nbsp;&nbsp;</span>
                            {getFieldDecorator('restSubscriptionOrderDiscount', {
                              initialValue: formData.Advantage.restSubscriptionOrderDiscount ?  formData.Advantage.restSubscriptionOrderDiscount*100 : '',
                              rules: [
                                {
                                  validator: (_rule, value, callback) => {
                                    let rule = formData.Conditions.promotionType == 1 ? /^(?:[1-9][0-9]?)$/ : /^(?:[1-9][0-9]?|100)$/
                                    if (value) {
                                      if (!rule.test(value)) {
                                        formData.Conditions.promotionType == 1 ?
                                          callback(
                                            (window as any).RCi18n({
                                              id: 'Marketing.InputValuefrom1to99'
                                            })
                                          ) : callback(
                                          (window as any).RCi18n({
                                            id: 'Marketing.InputValuefrom1to100'
                                          })
                                          )
                                      }
                                    }
                                    callback();
                                  }
                                }
                              ],
                            })(
                              <Input
                                style={{ width: 150 }}
                                title={
                                  formData.Conditions.promotionType == 1 ?
                                    (window as any).RCi18n({
                                      id: 'Marketing.InputValuefrom1to99'
                                    }) : (window as any).RCi18n({
                                      id: 'Marketing.InputValuefrom1to100'
                                    })
                                }
                                placeholder={
                                  formData.Conditions.promotionType == 1 ?
                                    (window as any).RCi18n({
                                      id: 'Marketing.InputValuefrom1to99'
                                    }) : (window as any).RCi18n({
                                      id: 'Marketing.InputValuefrom1to100'
                                    })
                                }
                              />
                            )}
                            <span>&nbsp;<FormattedMessage id="Marketing.percent" />&nbsp;<FormattedMessage id="Marketing.ofOrginalPrice" />,&nbsp;</span>
                          </Form.Item>

                          <Form.Item>
                            <span>&nbsp;discount limit&nbsp;&nbsp;</span>
                            {getFieldDecorator('restSubscriptionLimitAmount', {
                              initialValue: formData.Advantage.restSubscriptionLimitAmount,
                              rules: [
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
                                }
                              ],
                            })(
                              <Input
                                style={{ width: 150 }}
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
                              />
                            )}
                            &nbsp;{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                          </Form.Item>
                        </div>
                      </Form.Item>
                    </>
                  )
                }
              </>

            )
            : (
              <>
                {couponPromotionType === 0 && (
                  <Form.Item {...formItemLayout} label={<FormattedMessage id="Marketing.PromotionValue" />} required={true}>
                    {getFieldDecorator('denomination', {
                      initialValue: formData.Advantage.denomination,
                      rules: [
                        {
                          required: true,
                          message:
                            (window as any).RCi18n({
                              id: 'Marketing.theFaceValueOfCoupon'
                            })
                        },
                        {
                          validator: (_rule, value, callback) => {
                            if(value){
                              if (!ValidConst.noZeroNumber.test(value) || value < 1 || value > 99999) {
                                callback(
                                  (window as any).RCi18n({
                                    id: 'Marketing.IntegersBetweenAreAllowed'
                                  })
                                );
                                return;
                              }
                              if(formData.Conditions.fullMoney &&  Number(value) > Number(formData.Conditions.fullMoney)) {
                                callback(
                                  'Value cannot be greater than the previous value.'
                                );
                              }
                            }
                            callback();
                          }
                        }
                      ]
                    })(
                      <Input
                        placeholder={
                          (window as any).RCi18n({
                            id: 'Marketing.integerfrom1to99999'
                          })
                        }
                        prefix={sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                        maxLength={5}
                        style={{ width: 360 }}
                      />
                    )}
                  </Form.Item>
                )}
                {couponPromotionType === 1 && (
                  <Form.Item {...formItemLayout} label={<FormattedMessage id="Marketing.PromotionValue" />} required={true}>
                    <div style={{ display: 'flex' }}>
                      <Form.Item>
                        {getFieldDecorator('couponDiscount', {
                          initialValue: formData.Advantage.couponDiscount > 1 ?  (formData.Advantage.couponDiscount || '') : formData.Advantage.couponDiscount*100,
                          rules: [
                            {
                              required: true,
                              message:
                                (window as any).RCi18n({
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
                        })(
                          <Input
                            placeholder="1-99"
                            maxLength={3}
                            style={{ width: 160 }}
                          />
                        )} %,
                      </Form.Item>
                      <Form.Item>
                        <span>&nbsp;discount limit&nbsp;&nbsp;</span>
                        {getFieldDecorator('limitAmount', {
                          initialValue: formData.Advantage.limitAmount,
                          rules: [
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
                            }
                          ],
                        })(
                          <Input
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
                            style={{ width: 160 }}
                          />
                        )}
                        &nbsp;{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                      </Form.Item>
                    </div>
                  </Form.Item>
                )}
                {
                  couponPromotionType === 4 && (
                    <Form.Item wrapperCol={{offset: 6,span:18}} required={true} labelAlign="left">
                      {
                        getFieldDecorator(
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
                          />
                        )}
                    </Form.Item>
                  )
                }
              </>
            )
        }


      </Form>

     <ButtonLayer step={4} validateFields={validateFields} fullGiftLevelList={fullGiftLevelList} setFields={setFields}/>
    </div>
  );
}

export default Form.create<any>()(Step5);