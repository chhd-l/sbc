import React, { useState } from 'react';
import { Checkbox, Form, Input, InputNumber, Radio } from 'antd';
import { FormattedMessage } from 'react-intl';
import ButtonLayer from '@/marketing-setting/create-promotion/components/ButtonLayer';
import { RadioChangeEvent } from 'antd/es/radio';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
function Step4({setStep,form}){
  const {getFieldDecorator,validateFields} = form

  const [purchaseType,setPurchaseType] = useState<number>(0)
  const [customerType,setCustomerType] = useState<number>(0)
  return (
    <div>
      <div className="step-title">
        <FormattedMessage id="Marketing.Conditions" />
      </div>

      <Form {...formItemLayout} labelAlign="left" className="marketing-form-container">
        <Form.Item label={<FormattedMessage id="Marketing.TypeOfPurchase" />}>
          {getFieldDecorator('scopeType', {
            initialValue: 0,
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
            purchaseType !== 1 &&  (
              <div>
                <Checkbox>
                  <FormattedMessage id="Marketing.Idontwanttocumulate" />
                </Checkbox>
              </div>
            )
          }
        </Form.Item>

        <Form.Item label={<FormattedMessage id="Marketing.GroupOfCustomer" />}>
          {getFieldDecorator('GroupOfCustomer', {
            initialValue: 0,
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
            <Radio.Group onChange={(e)=>setCustomerType(e.target.value)}>
              <Radio value={0}><FormattedMessage id="Marketing.all" /></Radio>
              <Radio value={2}><FormattedMessage id="Marketing.Group" /></Radio>
              <Radio value={1}><FormattedMessage id="Marketing.Byemail" /></Radio>
            </Radio.Group>
          )}

          {

          }
        </Form.Item>

        <Form.Item label={<FormattedMessage id="Marketing.ProductsInTheCart" />}>
          {getFieldDecorator('ProductsInTheCart', {
            initialValue: 0,
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
            <Radio.Group>
              <Radio value={0}><FormattedMessage id="Marketing.all" /></Radio>
              <Radio value={2}><FormattedMessage id="Marketing.Category" /></Radio>
              <Radio value={1}><FormattedMessage id="Marketing.Custom" /></Radio>
              <Radio value={4}><FormattedMessage id="Marketing.Exclusion" /></Radio>
              <Radio value={3}><FormattedMessage id="Marketing.Attribute" /></Radio>
            </Radio.Group>
          )}
        </Form.Item>

        <Form.Item label={<FormattedMessage id="Marketing.CartLimit" />}>
          {getFieldDecorator('CartLimit', {
            initialValue: 0,
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
            <Radio.Group>
              <Radio value={0}><FormattedMessage id="Order.none" /></Radio>
              <Radio value={2}><FormattedMessage id="Order.Quantity" /></Radio>
              <Radio value={1}><FormattedMessage id="Order.Amount" /></Radio>
            </Radio.Group>
          )}
        </Form.Item>
      </Form>

      <ButtonLayer setStep={setStep} step={2} validateFields={validateFields}/>
    </div>
  )
}
export default Form.create<any>()(Step4);