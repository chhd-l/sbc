import React, { useContext, useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, InputNumber, Radio, Select, Tree, TreeSelect } from 'antd';
import { FormattedMessage } from 'react-intl';
import ButtonLayer from '@/marketing-setting/create-promotion/components/ButtonLayer';
import { RadioChangeEvent } from 'antd/es/radio';
import { cache, Const, ValidConst } from 'qmkit';
import * as webapi from '../../webapi';
import { treeNesting } from '../../../../web_modules/qmkit/utils/utils';
import { fromJS } from 'immutable';
import { FormContext } from '@/marketing-setting/create-promotion';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

function Step4({setStep,form}){
  const { formData,setFormData,match } = useContext<any>(FormContext);
  const {getFieldDecorator,validateFields} = form

  const [purchaseType,setPurchaseType] = useState<number>(0)
  const [isSuperimposeSubscription,setIsSuperimposeSubscription] = useState<boolean>(false)

  const [cartLimits,setCartLimits] = useState<number>(0)



  useEffect(()=>{
    if(match.params.id){
      editInit()
    }
  },[])



  /**
   * 当时编辑进入时初始化所有的值
   */
  const editInit = async ()=>{
    setPurchaseType(formData.Conditions.promotionType)
    setIsSuperimposeSubscription(formData.Conditions.isSuperimposeSubscription === 0 ? true : false)
    setCartLimits(formData.Conditions.CartLimit)

  }

  return (
    <div>
      <div className="step-title">
        <FormattedMessage id="Marketing.Conditions" />
      </div>

      <Form {...formItemLayout} labelAlign="left" className="marketing-form-container">
        <Form.Item label={<FormattedMessage id="Marketing.TypeOfPurchase" />}>
          {getFieldDecorator('promotionType', {
            initialValue: formData.Conditions.promotionType,
            rules: [
              {
                required: true,
                message:
                  (window as any).RCi18n({
                    id: 'Marketing.PleaseSelectOne'
                  })
              },
            ],
          })(
            <Radio.Group onChange={(e:RadioChangeEvent)=>setPurchaseType(e.target.value)}>
              <Radio value={0}><FormattedMessage id="Marketing.All" /></Radio>
              <Radio value={1}><FormattedMessage id="Marketing.Autoship" /></Radio>
              <Radio value={2}><FormattedMessage id="Marketing.Club" /></Radio>
              <Radio value={3}><FormattedMessage id="Marketing.Singlepurchase" /></Radio>
            </Radio.Group>
          )}
          {
            purchaseType === 0 &&  (
              <div>
                <Checkbox value={{isSuperimposeSubscription}} onChange={(e=>{
                  setIsSuperimposeSubscription(e.target.checked)
                })}>
                  <FormattedMessage id="Marketing.Idontwanttocumulate" />
                </Checkbox>
              </div>
            )
          }
        </Form.Item>

        {/*CartLimit*/}
        <Form.Item label={<FormattedMessage id="Marketing.CartLimit" />}>
          {getFieldDecorator('CartLimit', {
            initialValue: formData.Conditions.CartLimit,
            rules: [
              {
                required: true,
                message:
                  (window as any).RCi18n({
                    id: 'Marketing.PleaseSelectOne'
                  })
              },
            ],
          })(
            <Radio.Group onChange={(e)=>{
              setCartLimits(e.target.value)
              if(e.target.value === 2 && formData.PromotionType.typeOfPromotion === 1){
                console.log('xx')
                formData.Advantage.couponPromotionType = 3
                setFormData({...formData})
              }else {
                formData.Advantage.couponPromotionType = 0
                setFormData({...formData})
              }
            }}>
              <Radio value={0}><FormattedMessage id="Order.none" /></Radio>
              <Radio value={2}><FormattedMessage id="Order.Quantity" /></Radio>
              <Radio value={1}><FormattedMessage id="Order.Amount" /></Radio>
            </Radio.Group>
          )}
        </Form.Item>
        {
          cartLimits === 2 && (
            <Form.Item wrapperCol={{offset: 6,span:18}}>
              <span>Full&nbsp;</span>
              {getFieldDecorator('fullItem', {
                initialValue: formData.Conditions.fullItem,
                rules: [
                  {
                    required: true,
                    message:
                      (window as any).RCi18n({
                        id: 'Marketing.ustenterrules',
                      })
                  },
                  {
                    validator: (_rule, value, callback) => {
                      if (value) {
                        if (!ValidConst.noZeroNumber.test(value) || !(value < 10000 && value > 0)) {
                          callback(
                            (window as any).RCi18n({
                              id: 'Marketing.1-9999',
                            })
                          );
                        }
                      }
                      callback();
                    }
                  }
                ],
              })(
                <Input style={{ width: 300 }} placeholder={(window as any).RCi18n({
                  id: 'Marketing.1-9999',
                })}/>,
              )}
              <span>&nbsp;<FormattedMessage id="Marketing.items" /></span>
            </Form.Item>
          )
        }
        {
          cartLimits === 1 && (
            <Form.Item wrapperCol={{offset: 6,span:18}}>
              <span>Full&nbsp;</span>
              {getFieldDecorator('fullMoney', {
                initialValue: formData.Conditions.fullMoney,
                rules: [
                  {
                    required: true,
                    message:
                      (window as any).RCi18n({
                        id: 'Marketing.ustenterrules',
                      })
                  },
                  {
                    validator: (_rule, value, callback) => {
                      if (value) {
                        if (!ValidConst.price.test(value) || !(value < 100000000 && value > 0)) {
                          callback(
                            (window as any).RCi18n({
                              id: 'Marketing.0-99999999.99',
                            })
                          );
                        }
                      }
                      callback();
                    }
                  }
                ],
              })(
                <Input style={{ width: 300 }} placeholder={(window as any).RCi18n({ id: 'Marketing.0-99999999.99' })}/>,
              )}
              <span>&nbsp;{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}</span>
            </Form.Item>
          )
        }
      </Form>

      <ButtonLayer setStep={setStep} step={3} validateFields={validateFields}
                   isSuperimposeSubscription={isSuperimposeSubscription}
                   />
    </div>
  )
}

export default Form.create<any>()(Step4);