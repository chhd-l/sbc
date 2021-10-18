import React, { useEffect, useState } from 'react';
import { Icon, Table, Tooltip, Divider, Switch, Modal, Button, Form, Input, Row, Col, message, Select, Spin } from 'antd';
// import * as webapi from './webapi'
import { FormattedMessage } from 'react-intl';
import { BreadCrumb, Headline, Const } from 'qmkit';
import { SelectGroup } from 'qmkit';
import * as webapi from '../webapi';
import ServiceSetting from '../component/service-setting'
import './index.less'

const { Option } = Select;
const FormItem = Form.Item;

const styles = {
  planningBtn: {
    marginRight: 12
  }
};

const optionTest = [{
  label:'1',
  value:'1',
},{
  label:'2',
  value:'2',
},{
  label:'3',
  value:'3',
},]

let AvailServiceType = [];

// @ts-ignore
@Form.create()
export default class PlanningSetting extends React.Component<any, any>{
  constructor(props) {
    super(props);
    this.state={
      serviceTypeDict:[],
      appointmentTypeDict:[],
      expertTypeDict:[],
      AvailServiceTypeDict:[],
      AvailServiceTypeDisabled:true,
    }
  }

  componentDidMount() {
    this.getTypeDict()
  }

  getTypeDict = async () => {
    const serviceTypeRes = await webapi.goodsDict({ type: 'service_type' })
    const appointmentTypeRes = await webapi.goodsDict({ type: 'apprintment_type' })
    const expertTypeRes = await webapi.goodsDict({ type: 'expert_type' })
    
    const serviceTypeDict = serviceTypeRes?.res?.context?.goodsDictionaryVOS || []
    const appointmentTypeDict = appointmentTypeRes?.res?.context?.goodsDictionaryVOS || []
    const expertTypeDict = expertTypeRes?.res?.context?.goodsDictionaryVOS || []
    this.setState({
      serviceTypeDict,
      appointmentTypeDict,
      expertTypeDict
    })
  }

  handleSelectChange =(type,value)=>{
    if(type == 'serviceTypeId') {
     let avail =  this.state.serviceTypeDict.filter(item=>item.id === value.slice(-1).toString()) || []
     AvailServiceType.push(avail?.[0])
      this.setState({
        AvailServiceTypeDict:AvailServiceType,
        AvailServiceTypeDisabled:false
      })
    }
  }

  render() {
    let {
      getFieldDecorator,
    } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    const {serviceTypeDict, appointmentTypeDict, expertTypeDict, AvailServiceTypeDict} =this.state;
    return (
      <div className="planning-setting-wrap">
        {/* <BreadCrumb /> */}
        <div className="container">
          <div className="title-box">
            <span className="title-text">Planning Setting</span>
          </div>
          <Form
          className="planning-setting-form"
          {...formItemLayout}
            // onSubmit={this.handleSubmit}
          >
          <Row >
              <Col span={14}>
            <FormItem  label={ <FormattedMessage id="Resources.email" />}>
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                  },
                  // {
                  //   min: 1,
                  //   max: 20,
                  //   message: '1-20 characters'
                  // },
                  // {
                  //   validator: (rule, value, callback) => {
                  //     QMMethod.validatorEmoji(rule, value, callback, 'SPU encoding');
                  //   }
                  // }
                ],
                // onChange: this._editGoods.bind(this, 'goodsNo'),
                // initialValue: goods.get('goodsNo')
              })(<Input disabled/>)}
            </FormItem>
          </Col>
          <Col span={14}>
            <FormItem  label={ <FormattedMessage id="Resources.name" />}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                  },
                  // {
                  //   min: 1,
                  //   max: 20,
                  //   message: '1-20 characters'
                  // },
                  // {
                  //   validator: (rule, value, callback) => {
                  //     QMMethod.validatorEmoji(rule, value, callback, 'SPU encoding');
                  //   }
                  // }
                ],
                // onChange: this._editGoods.bind(this, 'goodsNo'),
                // initialValue: goods.get('goodsNo')
              })(<Input disabled/>)}
            </FormItem>
          </Col>
          <Col span={14}>
            <FormItem label={ <FormattedMessage id="Resources.service_type" />}>
              {getFieldDecorator('serviceType', {
                rules: [
                  {
                    required: true,
                  },
                ],
                onChange: (value)=>{this.handleSelectChange('serviceTypeId', value ) },
                // initialValue: goods.get('goodsNo')
              })(<Select
                mode="multiple"
                className="service-type-setting"
                getPopupContainer={() => document.getElementsByClassName('service-type-setting')[0]}
                >
                  {serviceTypeDict.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                </Select>)}
            </FormItem>
          </Col>
          <Col span={14}>
            <FormItem label={ <FormattedMessage id="Resources.expert_type" />}>
              {getFieldDecorator('expertType', {
                rules: [
                  {
                    required: true,
                  },
                  // {
                  //   min: 1,
                  //   max: 20,
                  //   message: '1-20 characters'
                  // },
                  // {
                  //   validator: (rule, value, callback) => {
                  //     QMMethod.validatorEmoji(rule, value, callback, 'SPU encoding');
                  //   }
                  // }
                ],
                onChange: (value)=>{this.handleSelectChange('expertTypeId', value ) },
                // initialValue: goods.get('goodsNo')
              })(<Select
                mode="multiple"
                className="expert-type-setting"
                getPopupContainer={() => document.getElementsByClassName('expert-type-setting')[0]}
                >
                  {expertTypeDict.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                </Select>)}
            </FormItem>
          </Col>
          <Col span={14}>
            <FormItem label={ <FormattedMessage id="Resources.appointment_type" />}>
              {getFieldDecorator('appointmentType', {
                rules: [
                  {
                    required: true,
                  },
                  // {
                  //   min: 1,
                  //   max: 20,
                  //   message: '1-20 characters'
                  // },
                  // {
                  //   validator: (rule, value, callback) => {
                  //     QMMethod.validatorEmoji(rule, value, callback, 'SPU encoding');
                  //   }
                  // }
                ],
                onChange: (value)=>{this.handleSelectChange('appointmentTypeId', value ) },
                // initialValue: goods.get('goodsNo')
              })(<Select
                mode="multiple"
                className='appointment-type-setting'
                getPopupContainer={() => document.getElementsByClassName('appointment-type-setting')[0]}
                >
                  {appointmentTypeDict.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                </Select>)}
            </FormItem>
          </Col>
          </Row>
          </Form>
          <div className="availability-title">Availability:</div>
          <ServiceSetting serviceTypeDict={AvailServiceTypeDict} selectDisabled={AvailServiceTypeDisabled}/>
        </div>
      </div>
    )
  }
}