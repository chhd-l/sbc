import React, { useEffect, useState } from 'react';
import { Form, Button, Input, Row, Col, Spin, Select } from 'antd';
import { checkCompanyInfoExists, saveLegalInfo } from "../webapi";
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const { Option } = Select;
 function Step2({ setStep, userInfo, legalInfo={} ,form}) {
  const [loading, setLoading] = useState(false);
  const {getFieldDecorator}=form
 

 
  const toNext = async (e) => {
    e.preventDefault();
   
    form.validateFields(async(errs, values) => {
      console.log(values)
      // return
      if (!errs) {
        setLoading(true)
  checkCompanyInfoExists({
      legalCompanyName: values.legalCompanyName,
      commerceNumber: values.commerceNumber,
      storeName: '',
      storeId: userInfo.storeId,
      companyInfoId: userInfo.companyInfoId
    }).then(({res}) => {
      if (!res.context.legalCompanyNameExists && !res.context.commerceNumber) {
        saveLegalInfo({
          email: userInfo.accountName,
          storeId: userInfo.storeId,
          companyInfoId: userInfo.companyInfoId,
          sourceStoreId: 123457915,
          ...values
        }).then(res => {
          setStep(2)
        }).catch(err => {
          setLoading(false)
        })
      } else {
        let errorArray = []
        if (res.context.legalCompanyNameExists) {
          errorArray.push({ name: 'legalCompanyName', errors: ['Legal company name is repeated'] },)
        }
        if (res.context.commerceNumber) {
          errorArray.push({ name: 'commerceNumber', errors: ['Chamber of Commerce number is repeated'] },)
        }
        form.setFields(errorArray)
      }
      setLoading(false)
    })
  }
  })
  }
  return (
    <div>
      <div className="vmargin-level-4 align-item-center word big">2 / 5  Fill in legal information and contact person</div>
      <div style={{ width: 800, margin: '20px auto' }}>
        <Form layout="vertical" onSubmit={toNext}>
          <Row gutter={[24, 12]}>
            <Col span={12}>
              <FormItem label="Trader category code (MCC)" name="tradeCategoryCode">
                {getFieldDecorator('tradeCategoryCode', {
                  rules: [{ required: true, message: 'Trader category code (MCC)' }],
                 initialValue: legalInfo?.tradeCategoryCode??''
                })(<Input size="large" placeholder='Trader category code (MCC)' suffix={<i className="iconfont iconemail1" style={{ fontSize: 18, color: '#a0b0bb' }}></i>} />)}
              </FormItem>

            </Col>
            <Col span={12}>
              <FormItem label="Type of business">
                {getFieldDecorator('typeOfBusiness', {
                  rules: [{ required: true, message: 'Please input Type of business!' }],
                 initialValue: legalInfo?.typeOfBusiness??1
                })(
                  <Select size="large">
                    <Option value={1}>bussines</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
           <div style={{height:1,clear:'both'}}>&nbsp;</div>
            <Col span={12}>
              <FormItem label="Legal company name">
                {getFieldDecorator('legalCompanyName', {
                  rules: [{ required: true, message: 'Please input Legal company name!' }],
                 initialValue: legalInfo?.legalCompanyName??''
                })(<Input size="large"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Chamber of Commerce number">
                   {getFieldDecorator('commerceNumber', {
                  rules:[{ required: true, message: 'Please input Chamber of Commerce number!' }],
                 initialValue: legalInfo?.commerceNumber??''
                })( <Input size="large"/>)}
               
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="First name">
                {getFieldDecorator('firstName', {
                  rules:[{ required: true, message: 'Please input First name!' }],
                 initialValue: legalInfo?.firstName??''
                })(<Input size="large"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Last name">
                {getFieldDecorator('lastName', {
                  rules:[{ required: true, message: 'Please input Last name!' }],
                  initialValue: legalInfo?.lastName??''
                })(<Input size="large"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Email">
                {getFieldDecorator('contactEmail', {
                  rules:[
                    { required: true, message: 'Please input your Email!' },
                    { type: 'email', message: <FormattedMessage id="Login.email_address_vld1" /> }
                  ],
                  initialValue: legalInfo?.contactEmail??userInfo.accountName
                })(<Input size="large"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Phone number">
                {getFieldDecorator('contactPhone', {
                 initialValue: legalInfo?.contactPhone??''
                })(
                  <Input size="large"/>
                )}
              </FormItem>
            </Col>
            <Col span={24} className="align-item-right" style={{textAlign:"center"}}>
              <Button size="large" onClick={() => setStep(0)}>Back</Button>
              <Button loading={loading} size="large" style={{marginLeft:20}} type="primary" htmlType="submit">Next</Button>
            </Col>
           
          </Row>
        </Form>
      </div>
    </div>
  );
}

export default Form.create()(Step2);