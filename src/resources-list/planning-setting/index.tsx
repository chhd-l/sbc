import React from 'react';
import { Button, Form, Input, Row, Col, Select, Spin, Modal, message } from 'antd';
import { history, Const,BreadCrumb } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import * as webapi from '../webapi';
import ServiceSetting from '../component/service-setting'
import './index.less'
const { Option } = Select;
const FormItem = Form.Item;

// @ts-ignore
@Form.create()
export default class PlanningSetting extends React.Component<any, any>{
  constructor(props) {
    super(props);
    this.state = {
      serviceTypeDict: [],
      appointmentTypeDict: [],
      expertTypeDict: [],
      AvailServiceTypeDict: [],
      AvailServiceTypeDisabled: true,
      settingDetailData: {},
      // saveDetailData: {},
      spinLoading: false,
      resourceServicePlanVOList: [{
        serviceTypeId: null,
        serviceSort: 1,//serviceType的设置顺序
        resourceWeekPlanVOList: [{
          sort: 1,//一个serviceType下,日期选择行的顺序
          timeSlotVO: {
            id: null,
            timeSlot: "",
          },
          resourceDatePlanVOS: []
        }]
      }],
      timeErr:false,
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
      webapi.goodsDict({ type: 'appointment_type' }),
      webapi.goodsDict({ type: 'expert_type' })
    ]).then((dictArr) => {
      const serviceTypeDict = dictArr[0].res?.context?.goodsDictionaryVOS || []
        // 目前只有felin 先过滤一下，
    const serviceTypeDictFelin = serviceTypeDict.filter(item => item.id === "6")
      const appointmentTypeDict = dictArr[1]?.res?.context?.goodsDictionaryVOS || []
      const expertTypeDict = dictArr[2]?.res?.context?.goodsDictionaryVOS || []
      this.setState({
        serviceTypeDict:serviceTypeDictFelin,
        AvailServiceTypeDict:serviceTypeDictFelin,
        appointmentTypeDict,
        expertTypeDict
      })
    })
  }

  // 获取当前详情数据
  getDetailData = async () => {
    const employeeId = this.props.match.params?.id
    try {
      this.setState({
        spinLoading: true
      })
      const { res } = await webapi.findByEmployeeId({ employeeId })
      const data = res?.context?.resourceSetting;
      let settingData = data;
      if (!data?.resourceServicePlanVOList?.length) {
        settingData = Object.assign(data || {}, {
          resourceServicePlanVOList: this.state.resourceServicePlanVOList
        });
      }
      this.setState({
        settingDetailData: settingData,//往下传的数据,也是传给接口的数据
        spinLoading: false,
        // saveDetailData:data,
      }, () => {
        // 暂时不需要该段代码，因为只有felin
        // const AvailServiceTypeId = data?.resourceServicePlanVOList?.[0].serviceTypeId
        // const AvailServiceTypeDict = this.state.serviceTypeDict.filter(item => item.id == AvailServiceTypeId)
        // this.setState({
        //   AvailServiceTypeDict
        // })
      })
    }catch(err) {

    }
  }

  saveResourceData = async (params) => {
    try {
      this.setState({
        spinLoading: true
      })
      const { res } = await webapi.saveOrUpdateResource(params)
      if (res.code == Const.SUCCESS_CODE) {
        this.setState({
          spinLoading: false
        },()=>{
        message.success(res.message)
        history.push('/resources-planning')
        })
      } else {
        this.setState({
          spinLoading: false
        })
      }

    } catch (err) {
      // err
    }
  }

  handleSelectChange = (type, value) => {
    // 暂时不需要该段代码，因为只有felin
    // if (type == 'serviceTypeIds') {
    //   let AvailServiceTypeDict = []
    //   value.forEach(val => {
    //     this.state.serviceTypeDict.map(item => {
    //       if (item.id == val) AvailServiceTypeDict.push(item)
    //     })
    //   })
    //   this.setState({
    //     AvailServiceTypeDict,
    //     AvailServiceTypeDisabled: false
    //   })
    // }
  }

  saveSubmit = (e) => {
    e.preventDefault();
    if(this.state.timeErr) {
      Modal.error({
        content: ((window as any).RCi18n({ id: 'Resources.TimeErrorInfo' })),
        onOk() { },
      });
      return
    }
    let serviceList = this.state.settingDetailData.resourceServicePlanVOList || []
    const isHave = serviceList.some(listItem => listItem.serviceTypeId)
    if(!isHave){
      Modal.error({
        content: ((window as any).RCi18n({ id: 'Resources.ServiceTypeErrorInfo' })),
        onOk() { },
      });
      return
    }
    this.props.form.validateFields((err, values) => {
      const params = Object.assign(this.state.settingDetailData, {
        ...values
      })
      if (!err) {
        this.saveResourceData(params)
      }
    });
  }

  updateServiceData = (data) => {
    let _data = _.cloneDeep(data)
    this.setState({
      // saveDetailData: params,
      settingDetailData: _data,
    })
  }

  updateTimeRangeErrInfo = (bol) =>{
    this.setState({
      timeErr:bol
    })
  }

  dictFormat = (dataSource) => {
    if (!dataSource) return [];
    let dictIds = dataSource?.map(item => item.dictId)
    return dictIds
  }

  handleCancel = () => {
    history.push('/resources-planning')
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
    const { serviceTypeDict, appointmentTypeDict, expertTypeDict, AvailServiceTypeDict, settingDetailData } = this.state;
    return (
      <div className="planning-setting-wrap">
        <BreadCrumb />
        <div className="container">
          <Spin spinning={this.state.spinLoading}>
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
                  <FormItem label={<FormattedMessage id="Resources.email" />}>
                    {getFieldDecorator('email', {
                      rules: [
                        {
                          required: true,
                        },
                      ],
                      initialValue: settingDetailData?.account
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col span={14}>
                  <FormItem label={<FormattedMessage id="Resources.name" />}>
                    {getFieldDecorator('name', {
                      rules: [
                        {
                          required: true,
                        },
                      ],
                      initialValue: settingDetailData?.name
                    })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col span={14}>
                  <FormItem label={<FormattedMessage id="Resources.service_type" />}>
                    {getFieldDecorator('serviceTypeIds', {
                      rules: [
                        {
                          required: true,
                        },
                      ],
                      onChange: (value) => { this.handleSelectChange('serviceTypeIds', value) },
                      initialValue: this.dictFormat(settingDetailData?.serviceType)
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
                  <FormItem label={<FormattedMessage id="Resources.expert_type" />}>
                    {getFieldDecorator('expertTypeIds', {
                      rules: [
                        {
                          required: true,
                        },
                      ],
                      onChange: (value) => { this.handleSelectChange('expertTypeIds', value) },
                      initialValue: this.dictFormat(settingDetailData?.expertType)
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
                  <FormItem label={<FormattedMessage id="Resources.appointment_type" />}>
                    {getFieldDecorator('appointmentTypeIds', {
                      rules: [
                        {
                          required: true,
                        }
                      ],
                      onChange: (value) => { this.handleSelectChange('appointmentTypeIds', value) },
                      initialValue: this.dictFormat(settingDetailData?.appointmentType)
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
                updateServiceData={(data) => this.updateServiceData(data)}
                updateTimeRangeErrInfo={(bol)=>this.updateTimeRangeErrInfo(bol)}
              />
              <Row>
                <Col span={2} offset={9}>
                  <Button type="primary" htmlType="submit"><FormattedMessage id="save" /></Button>
                </Col>
                <Col span={2} >
                  <Button onClick={this.handleCancel} ><FormattedMessage id="cancel" /></Button>
                </Col>
              </Row>
            </Form>
          </Spin>
        </div>
      </div>
    )
  }
}