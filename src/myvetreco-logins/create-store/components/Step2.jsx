import React, { useEffect, useState } from 'react';
import { Form, Button, Input, Row, Col, Spin, Select } from 'antd';
import { checkCompanyInfoExists, saveLegalInfo } from "../webapi";
import { FormattedMessage } from 'react-intl';
import { Const, cache } from 'qmkit';

const FormItem = Form.Item;
const { Option } = Select;
 function Step2({ setStep, userInfo, legalInfo={} ,form,sourceStoreId,sourceCompanyInfoId}) {
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
          sourceStoreId: sessionStorage.getItem(cache.CREATESTORE_SOURCE_STORE_ID) || sourceStoreId,
          ...values
        }).then(res => {
          setStep(2)
        }).catch(err => {
          setLoading(false)
        })
      } else {
        let errorArray = {}
        if (res.context.legalCompanyNameExists) {
          errorArray.legalCompanyName = { value: values.legalCompanyName, errors: [new Error('Legal company name is repeated')] }
        }
        if (res.context.commerceNumberExists) {
          errorArray.commerceNumber = { value: values.commerceNumber, errors: [new Error('Chamber of Commerce number is repeated')] }
        }
        form.setFields(errorArray)
      }
      setLoading(false)
    })
  }
  })
  };

  const onChangePhoneNumber = (e) => {
    if (Const.SITE_NAME === 'MYVETRECO' && e && !e.target.value.startsWith('+31')) {
      const temp = e.target.value;
      setTimeout(() => {
        form.setFieldsValue({
          contactPhone: `+31${temp.replace(/^[+|+3|+31]/, '')}`
        });
      });
    }
  };

  const validatePhoneNumber = (rules, value, callback) => {
    if (Const.SITE_NAME === 'MYVETRECO' && !/^\+31[0-9]{9}$/.test(value)) {
      callback('Please input the right format: +31xxxxxxxxx');
    } else if (!/^[0-9+-\\(\\)\s]{6,25}$/.test(value)) {
      callback('Please input a right phone number');
    } else {
      callback();
    }
  };

  return (
    <div>
      <div className="vmargin-level-4 align-item-center word big">2 / {Const.SITE_NAME === 'MYVETRECO' ? '5' : '3'}  Fill in legal information and contact person</div>
      <div style={{ width: 800, margin: '20px auto' }}>
        <Form layout="vertical" onSubmit={toNext}>
          <Row gutter={[24, 12]}>
            {/* <Col span={12}>
              <FormItem label="Trader category code (MCC)" name="tradeCategoryCode">
                {getFieldDecorator('tradeCategoryCode', {
                  rules: [{ required: true, message: 'Trader category code (MCC)' }],
                 initialValue: legalInfo?.tradeCategoryCode??''
                })(<Input size="large" placeholder='Trader category code (MCC)' />)}
              </FormItem>

            </Col> */}
            <Col span={12} style={{display: Const.SITE_NAME === 'MYVETRECO' ? 'block' : 'none'}}>
              <FormItem label="Type of business">
                {getFieldDecorator('typeOfBusiness', {
                  rules: [{ required: true, message: 'Please input Type of business!' }],
                 initialValue: legalInfo?.typeOfBusiness??1
                })(
                  <Select size="large">
                    <Option value={1}>Business</Option>
                    <Option value={0}>Individual</Option>
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
            <Col span={12} style={{display: Const.SITE_NAME === 'MYVETRECO' ? 'block' : 'none'}}>
              <FormItem label="Chamber of Commerce number">
                   {getFieldDecorator('commerceNumber', {
                  rules:[{ required: Const.SITE_NAME === 'MYVETRECO', message: 'Please input Chamber of Commerce number!' }],
                 initialValue: legalInfo?.commerceNumber??''
                })( <Input size="large"/>)}
               
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="First name">
                {getFieldDecorator('firstName', {
                  rules:[{ required: true, message: 'Please input First name!' },{ pattern: /^((?![0-9]).)*$/, message: 'First name should not contain numbers' }],
                 initialValue: legalInfo?.firstName??''
                })(<Input size="large"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Last name">
                {getFieldDecorator('lastName', {
                  rules:[{ required: true, message: 'Please input Last name!' },{ pattern: /^((?![0-9]).)*$/, message: 'Last name should not contain numbers' }],
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
                  rules:[
                    { required: true, validator: validatePhoneNumber }
                  ],
                  initialValue: legalInfo?.contactPhone??''
                })(
                  <Input size="large" maxLength={12} onChange={onChangePhoneNumber} />
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