import React, { useState } from 'react';
import { Form, Input, Button, Radio, Row } from 'antd';
import ButtonLayer from '@/marketing-setting/create-promotion/components/ButtonLayer';
import { FormattedMessage } from 'react-intl';
import { cache, ValidConst } from 'qmkit';
import GiftLevels from '@/marketing-add/full-gift/components/gift-levels';
import { fromJS } from 'immutable';


const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};

function Step5({ setStep, form }) {
  const { getFieldDecorator, validateFields } = form;
  const [couponPromotionType,setCouponPromotionType] = useState(0)

  const [selectedRows,setSelectedRows] = useState<any>(fromJS([]))
  const [fullGiftLevelList,setFullGiftLevelList]  = useState<any>([{
    key: 1,
    fullAmount: null,
    fullCount: null,
    giftType: 1,
    fullGiftDetailList: []
  }])
  /**
   * 规则变化方法
   * @param rules
   */
  const onRulesChange = (rules) => {
    form.resetFields('rules');
    console.log(rules)
    setFullGiftLevelList(rules)
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
    setSelectedRows(rows)
  }
  return (
    <div>
      <div className="step-title">
        <FormattedMessage id="Marketing.Advantage" />
      </div>

      <Form {...formItemLayout} labelAlign="left" className="marketing-form-container">
        <Form.Item label={<FormattedMessage id="Marketing.PromotionName" />}>
          {getFieldDecorator('couponPromotionType', {
            initialValue: 0,
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
            <Radio.Group onChange={(e)=>{setCouponPromotionType(e.target.value)}}>
              <Radio value={0}>
                <FormattedMessage id="Marketing.Amount" />
              </Radio>
              <Radio value={1}>
                <FormattedMessage id="Marketing.Percentage" />
              </Radio>
              <Radio value={3}>
                <FormattedMessage id="Marketing.Freeshipping" />
              </Radio>
              <Radio value={4}>
                <FormattedMessage id="Marketing.Gifts" />
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
        {couponPromotionType === 0 && (
          <Form.Item {...formItemLayout} label={<FormattedMessage id="Marketing.PromotionValue" />} required={true}>
            {getFieldDecorator('denomination', {
              initialValue: '',
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
                    if (!ValidConst.noZeroNumber.test(value) || value < 1 || value > 99999) {
                      callback(
                        (window as any).RCi18n({
                          id: 'Marketing.IntegersBetweenAreAllowed'
                        })
                      );
                      return;
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
                  initialValue: '',
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
                  initialValue: '',
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
           <Form.Item {...formItemLayout} label='' required={true} labelAlign="left">
             {
               getFieldDecorator(
                 'rules',
                 {}
               )(
                 <GiftLevels
                   form={form}
                   selectedRows={selectedRows}
                   isNormal={true}
                   fullGiftLevelList={fullGiftLevelList}
                   onChangeBack={onRulesChange}
                   isFullCount={5 % 2}
                   GiftRowsOnChange={GiftRowsOnChange}
                 />
               )}
           </Form.Item>
          )
        }
      </Form>

      <ButtonLayer setStep={setStep} step={4} validateFields={validateFields} />
    </div>
  );
}

export default Form.create<any>()(Step5);