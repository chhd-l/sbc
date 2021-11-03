import React, { useContext, useEffect, useState, memo } from 'react';
import { Checkbox, Form, Input, InputNumber, Radio } from 'antd';
import { FormattedMessage } from 'react-intl';
import ButtonLayer from '@/marketing-setting/create-promotion/components/ButtonLayer';
import { FormContext } from '@/marketing-setting/create-promotion';
import { enumConst } from '@/marketing-setting/create-promotion/enum';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
function Step3({form}){
  const Context:any = useContext(FormContext);
  const { match,changeFormData,setStep,formData } = Context
  const {getFieldDecorator,validateFields} = form

  const [typeOfPromotion,setTypeOfPromotion] = useState<number>(0)
  const [promotionCode,setPromotionCode] = useState<string>('')
  const [publicStatus,setPublicStatus] = useState(true)
  const [limitStatus,setLimitStatus] = useState(false)

  useEffect(()=>{
    if(match.params.id){
      setPromotionCode(formData.PromotionType.promotionCode)
      setPublicStatus(formData.PromotionType.publicStatus === 0 ? false : true)
      setLimitStatus(formData.PromotionType.isNotLimit === 0 ? true : false)
      setTypeOfPromotion(formData.PromotionType.typeOfPromotion)
    }else {
      getPromotionCode()
    }
  },[])
  const toNext =() =>{
    validateFields((err, values) => {
      if (!err) {
        changeFormData(enumConst.stepEnum[2],{
          ...values,
          publicStatus: publicStatus ? 1 : 0,
          isNotLimit:limitStatus ? 0 : 1
        })
        setStep(3)
      }
    });
  }
  /**
   * 随机生成PromotionCode
   */
  const getPromotionCode = () => {
    let randomNumber = ('0'.repeat(8) + parseInt(Math.pow(2, 40) * Math.random()).toString(32)).slice(-8);
    let timeStamp = new Date(sessionStorage.getItem('defaultLocalDateTime')).getTime().toString().slice(-10);
    let promotionCode = randomNumber + timeStamp;
    setPromotionCode(promotionCode)
  };
  return (
    <div>
      <div className="step-title">
        <FormattedMessage id="Marketing.PromotionType" />
      </div>

      <Form {...formItemLayout} labelAlign="left" className="marketing-form-container">
        <Form.Item label={<FormattedMessage id="Marketing.TypeOfPromotion" />}>
          {getFieldDecorator('typeOfPromotion', {
            initialValue: formData.PromotionType.typeOfPromotion,
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
            <Radio.Group onChange={(e)=>{setTypeOfPromotion(e.target.value)}}>
              <Radio value={0}><FormattedMessage id="Order.PromotionCode" /></Radio>
              <Radio value={1}><FormattedMessage id="Order.CouponCode" /></Radio>
            </Radio.Group>,
          )}
        </Form.Item>
        { typeOfPromotion === 0 && (
          <>
            <Form.Item label={<FormattedMessage id="Marketing.CodesName" />}>
              {getFieldDecorator('promotionCode', {
                initialValue:promotionCode,
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
                <Input size="large"
                       disabled={publicStatus}
                       style={{ width: 360 }}
                       placeholder={(window as any).RCi18n({ id: 'Marketing.PleaseInputCodeName' })}/>,
              )}
              <Checkbox
                checked={publicStatus}
                style={{ marginLeft: 20 }}
                onChange={(e)=>{
                  setPublicStatus(e.target.checked)
                }}
              >
                <FormattedMessage id="Marketing.Public" />
              </Checkbox>
            </Form.Item>
          </>

        )}
        { typeOfPromotion === 0 && (<Form.Item label={<FormattedMessage id="Marketing.UsageLimit" />}>
          {getFieldDecorator('perCustomer', {
            initialValue: formData.PromotionType.perCustomer,
          })(
            <InputNumber  size="large" min={1} disabled={!limitStatus}/>
          )}
          <Checkbox
            checked={limitStatus}
            style={{ marginLeft: 20 }}
            onChange={(e)=>{
              setLimitStatus(e.target.checked)
            }}
          >
            <FormattedMessage id="Marketing.LimitTheUsagePerCustomer" />
          </Checkbox>
        </Form.Item>)}

      </Form>

      <ButtonLayer step={2} toNext={toNext} />
    </div>
  )
}
export default memo(Form.create<any>()(Step3));