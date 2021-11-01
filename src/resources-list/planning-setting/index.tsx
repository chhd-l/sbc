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
      settingDetailData:{
        resourceServicePlanVOList: [{
          serviceTypeId: null,
          serviceSort: "1",//serviceType的设置顺序
          resourceWeekPlanVOList: [{
            sort: "1",//一个serviceType下,日期选择行的顺序
            timeSlotVO: {
              id: null,
              // timeSlot: "00:00-23:59|00:00-23:59",
              timeSlot: "00:00-23:59",
            },
            resourceDatePlanVOS: []
          }]
        }]
      },
      saveDetailData: {
        isAll: 1,
      },
      resourceServicePlanVOList: [{
        serviceTypeId: null,
        serviceSort: "1",//serviceType的设置顺序
        resourceWeekPlanVOList: [{
          sort: "1",//一个serviceType下,日期选择行的顺序
          timeSlotVO: {
            id: null,
            // timeSlot: "00:00-23:59|00:00-23:59",
            timeSlot: "00:00-23:59",
          },
          resourceDatePlanVOS: []
        }]
      }]
    }
  }

  async componentDidMount() {
    await this.getTypeDict()
    this.getDetailData()
  }

  // 字典枚举
  getTypeDict = () => {
    Promise.all([
      webapi.goodsDict({ type: 'service_type' }),
      webapi.goodsDict({ type: 'apprintment_type' }),
      webapi.goodsDict({ type: 'expert_type' })
    ]).then((dictArr) => {
      const serviceTypeDict = dictArr[0].res?.context?.goodsDictionaryVOS || []
      const appointmentTypeDict = dictArr[1]?.res?.context?.goodsDictionaryVOS || []
      const expertTypeDict = dictArr[2]?.res?.context?.goodsDictionaryVOS || []
      this.setState({
        serviceTypeDict,
        appointmentTypeDict,
        expertTypeDict
      })
    })
  }

  // 获取当前详情数据
  getDetailData = async () => {
    const employeeId = this.props.match.params?.id
    const { res } = await webapi.findByEmployeeId({ employeeId })
    const data = res?.context?.resourceSetting;
    let settingData = data;
    if(!data.resourceServicePlanVOList?.length) {
      settingData =  Object.assign(data,{
        resourceServicePlanVOList:this.state.resourceServicePlanVOList
        });
    }
    // const settingData =  data.resourceServicePlanVOList?.length ? data : defaultData
    this.setState({
      settingDetailData: settingData,//往下传的数据
      saveDetailData:data,
    }, () => {
      const AvailServiceTypeId = data.resourceServicePlanVOList?.[0].serviceTypeId
      const AvailServiceTypeDict = this.state.serviceTypeDict.filter(item => item.id == AvailServiceTypeId)
      this.setState({
        AvailServiceTypeDict
      })
    })
  }

  saveResourceData = async(params)=>{
    await webapi.saveOrUpdateResource(params)
  }

  handleSelectChange = (type, value) => {
    if (type == 'serviceTypeIds') {
     let AvailServiceTypeDict = []
      value.forEach(val => {
         this.state.serviceTypeDict.map(item =>{
           if( item.id ==val) AvailServiceTypeDict.push(item)
         })
      })
      this.setState({
        AvailServiceTypeDict,
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

  updateServiceData = (data) => {
    this.setState({
      saveDetailData: data
    })
  }

  dictFormat = (dataSource) => {
    console.log(dataSource,'dataSource===')
    if(!dataSource) return [];
    let dictIds = dataSource?.map(item => item.dictId)
    return dictIds
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
              {getFieldDecorator('serviceTypeIds', {
                rules: [
                  {
                    required: true,
                  },
                ],
                onChange: (value)=>{this.handleSelectChange('serviceTypeIds', value ) },
                initialValue:this.dictFormat(settingDetailData?.serviceType)
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
              {getFieldDecorator('expertTypeIds', {
                rules: [
                  {
                    required: true,
                  },
                ],
                onChange: (value)=>{this.handleSelectChange('expertTypeIds', value ) },
                initialValue:this.dictFormat(settingDetailData?.expertType)
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
              {getFieldDecorator('appointmentTypeIds', {
                rules: [
                  {
                    required: true,
                  }
                ],
                onChange: (value)=>{this.handleSelectChange('appointmentTypeIds', value ) },
                initialValue:this.dictFormat(settingDetailData?.appointmentType)
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
          serviceData={settingDetailData} 
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