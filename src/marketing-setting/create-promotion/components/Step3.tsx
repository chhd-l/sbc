import React from 'react'
import { Checkbox, Form, Input, InputNumber, Radio } from 'antd';
import { FormattedMessage } from 'react-intl';
import ButtonLayer from '@/marketing-setting/create-promotion/components/ButtonLayer';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
function Step3({setStep,form}){
  const {getFieldDecorator,validateFields} = form
  return (
    <div>
      <div className="step-title">
        <FormattedMessage id="Marketing.PromotionType" />
      </div>

      <Form {...formItemLayout} labelAlign="left" className="marketing-form-container">
        <Form.Item label={<FormattedMessage id="Marketing.TypeOfPromotion" />}>
          {getFieldDecorator('marketingName', {
            rules: [
              {
                required: true,
                message:
                  (window as any).RCi18n({
                    id: 'Marketing.PleaseChoosePromotionType'
                  })
              },
            ],
          })(
            <Radio.Group>
              <Radio value="a"><FormattedMessage id="Order.PromotionCode" /></Radio>
              <Radio value="b"><FormattedMessage id="Order.CouponCode" /></Radio>
            </Radio.Group>,
          )}
        </Form.Item>
        <Form.Item label={<FormattedMessage id="Marketing.CodesName" />}>
          {getFieldDecorator('time', {
            rules: [
              {
                required: true,
                whitespace: true,
                message:
                  (window as any).RCi18n({
                    id: 'Marketing.PleaseInputCodeName'
                  })
              },
            ],
          })(
            <Input size="large" style={{ width: 360 }} placeholder={(window as any).RCi18n({ id: 'Marketing.PleaseInputCodeName' })}/>,
          )}
          <Checkbox
            style={{ marginLeft: 20 }}
          >
            <FormattedMessage id="Marketing.Public" />
          </Checkbox>
        </Form.Item>
        <Form.Item label={<FormattedMessage id="Marketing.UsageLimit" />}>
          {getFieldDecorator('usage', {
            initialValue: 1,
          })(
            <InputNumber  size="large" min={1} />
          )}
          <Checkbox
            style={{ marginLeft: 20 }}
          >
            <FormattedMessage id="Marketing.LimitTheUsagePerCustomer" />
          </Checkbox>
        </Form.Item>
      </Form>

      <ButtonLayer setStep={setStep} step={2} validateFields={validateFields}/>
    </div>
  )
}
export default Form.create<any>()(Step3);