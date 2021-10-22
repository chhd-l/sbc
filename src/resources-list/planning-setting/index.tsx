import React, { useEffect, useState } from 'react';
import { Icon, Table, Tooltip, Divider, Switch, Modal, Button, Form, Input, Row, Col, message, Select, Spin } from 'antd';
// import * as webapi from './webapi'
import { FormattedMessage } from 'react-intl';
import { BreadCrumb, Headline, Const } from 'qmkit';
import { SelectGroup } from 'qmkit';
import * as webapi from '../webapi';
import ServiceSetting from '../component/service-setting'
import './index.less'
import { async } from '_@antv_x6@1.26.2@@antv/x6/lib/registry/marker/async';

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

// let AvailServiceType = [{id:'all',name:'all'}];
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
      settingDetailData:{},
      saveDetailData: {
        isAll: 0,
        resourceServicePlanVOList: [{
          serviceTypeId: "",
          serviceSort: "1",//serviceType的设置顺序
          resourceWeekPlanVOList: [{
            sort: "1",//一个serviceType下,日期选择行的顺序
            timeSlotVO: {
              id: "",
              // timeSlot: "00:00-23:59|00:00-23:59",
              timeSlot: "00:00-23:59",
            },
            resourceDatePlanVOS: [{
              id: "",
              dateNo: ""
            }]
          }]
        }]
      }
    }
  }

  componentDidMount() {
    this.getTypeDict()
    this.getDetailData()
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

  // 获取当前详情数据
  getDetailData = async() =>{
    const employeeId = this.props.match.params?.id
    const {res} = await webapi.findByEmployeeId({employeeId})
    const data = res?.context?.resourceSetting
    this.setState({
      settingDetailData: data,
      saveDetailData: Object.assign(this.state.saveDetailData,{
      id: data.id,
      employeeId:data.employeeId,
      }),
    })
  }

  saveResourceData = async(params)=>{
    await webapi.saveOrUpdateResource(params)
  }

  handleSelectChange = (type, value) => {
    if (type == 'serviceTypeId') {
      let avail = this.state.serviceTypeDict.filter(item => item.id === value.slice(-1).toString()) || []
      AvailServiceType.push(avail?.[0])
      this.setState({
        AvailServiceTypeDict: AvailServiceType,
        AvailServiceTypeDisabled: false
      })
    }
  }

  saveSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const params = Object.assign(this.state.saveDetailData,{
        ...values
      })
        if (!err) {
          this.saveResourceData(params)
        }
        console.log(params,'ffff=')
    });
  }

  updateServiceData = (data) =>{
    this.setState({
      saveDetailData:data
    })
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
    const {serviceTypeDict, appointmentTypeDict, expertTypeDict, AvailServiceTypeDict,AvailServiceTypeDisabled,settingDetailData,saveDetailData} =this.state;
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
            onSubmit={this.saveSubmit}
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
                initialValue: settingDetailData?.account
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
                ],
                // onChange: this._editGoods.bind(this, 'goodsNo'),
                initialValue: settingDetailData?.name
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
          <div className="availability-title">Availability:</div>
          <ServiceSetting 
          serviceData={saveDetailData} 
          serviceTypeDict={AvailServiceTypeDict} 
          selectDisabled={AvailServiceTypeDisabled}
          updateServiceData={(data)=>this.updateServiceData(data)}
          />
          <Row>
            <Col span={2} offset={9}>
            <Button type="primary" htmlType="submit"><FormattedMessage id="save" /></Button>
            </Col>
            <Col span={2} >
            <Button type="primary"><FormattedMessage id="cancel" /></Button>
            </Col>
          </Row>
          </Form>
        </div>
      </div>
    )
  }
}