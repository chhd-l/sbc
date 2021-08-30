import React, {useEffect, useState} from 'react';
import {Form, Button, Input, Row, Col, Spin, Select} from 'antd';
import {checkCompanyInfoExists, saveLegalInfo} from "../webapi";
import intl from "react-intl-universal";
import debounce from 'lodash/debounce';

const FormItem = Form.Item;
const { Option } = Select;
export default function Step2({ setStep,userInfo,legalInfo={} }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    form.setFieldsValue({
      email:userInfo.accountName,
    })
    if(legalInfo){
      form.setFieldsValue({
        ...legalInfo,
      })
    }
  },[legalInfo])

  const toNext = async (values)=>{
    setLoading(true)
    checkCompanyInfoExists({
      legalCompanyName:values.legalCompanyName,
      commerceNumber:values.commerceNumber,
      storeName:'',
      storeId:userInfo.storeId,
      companyInfoId: userInfo.companyInfoId
    }).then(res=>{
      if(!res.context.legalCompanyNameExists && !res.context.commerceNumber){
        saveLegalInfo({
          email: userInfo.accountName,
          storeId: userInfo.storeId,
          companyInfoId:userInfo.companyInfoId,
          sourceStoreId:123457915,
          ...values
        }).then(res=>{
          setStep(2)
        }).catch(err=>{
          setLoading(false)
        })
      }else {
        let errorArray = []
        if(res.context.legalCompanyNameExists){
          errorArray.push({name:'legalCompanyName',errors:['Legal company name is repeated']},)
        }
        if(res.context.commerceNumber){
          errorArray.push({name:'commerceNumber',errors:['Chamber of Commerce number is repeated']},)
        }
        form.setFields(errorArray)
      }
      setLoading(false)
    })

  }
  return (
    <div>
      <div className="vmargin-level-4 align-item-center word big">2 / 5  Fill in legal information and contact person</div>
      <div style={{width:800,margin:'20px auto'}}>
        <Form layout="vertical" onFinish={toNext} form={form}>
          <Row gutter={[24,12]}>
            <Col span={12}>
              <FormItem label="Trader category code (MCC)"
                        name="tradeCategoryCode">
                <Input size="large" />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Type of business"
                        name="typeOfBusiness"
                        rules={[{ required: true, message: 'Please input Type of business!' }]}>
                <Select size="large">
                  <Option value={1}>bussines</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Legal company name"
                        name="legalCompanyName"
                        rules={[
                            { required: true, message: 'Please input Legal company name!' },
                        ]}>
                <Input size="large" />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Chamber of Commerce number"
                        name="commerceNumber"
                        rules={[
                            { required: true, message: 'Please input Chamber of Commerce number!' },
                        ]}>
                <Input size="large" />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="First name"
                        name="firstName"
                        rules={[{ required: true, message: 'Please input First name!' }]}>
                <Input size="large" />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Last name"
                        name="lastName"
                        rules={[{ required: true, message: 'Please input Last name!' }]}>
                <Input size="large" />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Email"
                        name="contactEmail"
                        rules={[
                            { required: true, message: 'Please input your Email!' },
                            {type:'email',message:intl.get('Login.email_address_vld1')}
                        ]}>
                <Input size="large" />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Phone number"
                        name="contactPhone">
                <Input size="large" />
              </FormItem>
            </Col>
            <Col span={12} className="align-item-right">
              <Button size="large" onClick={() => setStep(0)}>Back</Button>
            </Col>
            <Col span={12}>
              <FormItem>
                <Button loading={loading}  size="large" type="primary" htmlType="submit">Next</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}

