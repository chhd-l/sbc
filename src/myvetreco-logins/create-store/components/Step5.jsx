import React, {useEffect, useState} from 'react';
import { Button, Row, Col, Input, Form } from 'antd';
import {savePaymentInfo} from "../webapi";

const FormItem = Form.Item;

export default function Step5({ setStep,userInfo,paymentInfoRequest }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    if(paymentInfoRequest){
      form.setFieldsValue({...paymentInfoRequest})
    }
  },[paymentInfoRequest])

  const toNext = async (values)=>{
    setLoading(true)
    savePaymentInfo({
      email: userInfo.accountName,
      storeId: userInfo.storeId,
      companyInfoId:userInfo.companyInfoId,
      ...values
    }).then(res=>{
      setLoading(false)
      setStep(5)
    }).catch(err=>{
      setLoading(false)
    })
  }


  return (
    <div>
      <div className="vmargin-level-4 align-item-center word big">5 / 5 add a bank account so you can get paid</div>
      <div style={{width:800,margin:'20px auto'}}>
        <Row gutter={24}>
          <Col span={6}></Col>
        </Row>
      </div>
      <div style={{width:600,margin:'20px auto'}}>
        <Form layout="vertical" onFinish={toNext} form={form}>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <FormItem label="IBAN"
                        name="iban"
                        rules={[
                            { required: true, message: 'Please input IBAN!' },
                            { type: "string", len: 16 }
                        ]}>
                <Input size="large" />
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem label="Payout Summary Label"
                        name="payoutSummaryLabel"
                        // rules={[{ required: true, message: 'Please input Payout Summary Label!' }]}
              >
                <Input size="large" />
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem label="Debit Summary Label"
                        name="debitSummaryLabel"
                        // rules={[{ required: true, message: 'Please input Debit Summary Label!' }]}
              >
                <Input size="large" />
              </FormItem>
            </Col>
            <Col span={12} className="align-item-right">
              <Button size="large" onClick={() => setStep(3)}>Back</Button>
            </Col>
            <Col span={12}>
              <FormItem>
                <Button loading={loading} size="large" type="primary" htmlType="submit">Next</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}


