import React from 'react';
import { Const, Headline, history } from 'qmkit';
import { Radio, Button, Form, Breadcrumb, Input, Spin } from 'antd';
import moment from 'moment';
import CustomerList from './components/customer-list';
import AppointmentDatePicker from './components/appointment-date-picker';
import { addNewAppointment, findAppointmentById, updateAppointmentById } from './webapi';
import { FormattedMessage } from 'react-intl';
import { RCi18n } from 'qmkit';

import './index.less';
import WeekCalender from './components/week-calender';
import * as webapi from './webapi';
class NewAppointment extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      params: {
        apptTypeId: undefined,
        consumerName: undefined,
        consumerEmail: undefined,
        consumerPhone: undefined,
        customerId: undefined,
        bookSlotVO: {
          dateNo: "",
          startTime: "",
          endTime: "",
          employeeIds: []
        },
        minutes: 15,
        expertTypeId: undefined,
        serviceTypeId: undefined
      },
      memberType: 'member',
      serviceTypeList: [],
      apprintmentTypeList: [],
      expertTypeList: [],
      resources: [],
      key: (+new Date())
    };
  }

  componentDidMount() {
    //标记返回appointment list时需要记住筛选参数
    this.getAllDict();
    sessionStorage.setItem('remember-appointment-list-params', '1');
    if (this.props.match.params.id) {
      this.getAppointmentById(this.props.match.params.id);
    }
  }
  //获取字典
  getAllDict = async () => {
    const allDict = await Promise.all([webapi.goodsDict({ type: 'service_type' }), webapi.goodsDict({ type: 'apprintment_type' }), await webapi.goodsDict({ type: 'expert_type' })])
    console.log(allDict)
    let _listKey = ['serviceTypeList', 'apprintmentTypeList', 'expertTypeList',]
    allDict.map((item, index) => {
      const { res }: any = item;
      if (res?.code === Const.SUCCESS_CODE) {
        this.setState({
          [_listKey[index]]: res.context.goodsDictionaryVOS
        })
      }
    })
    this.queryDate()
  }
  //初始化能预约的时间
  queryDate = () => {
    const { getFieldsValue } = this.props.form;
    setTimeout(async () => {
      let { apptTypeId, minutes, expertTypeId } = getFieldsValue(['apptTypeId', 'minutes', 'expertTypeId'])
      console.log(apptTypeId, minutes, expertTypeId)
      const { res } = await webapi.queryDate({ appointmentTypeId: apptTypeId, minutes, expertTypeId });
      if (res.code === Const.SUCCESS_CODE) {
        let resources = res.context.resources
        this.setState({
          resources,
          key: (+new Date())
        })
      }
    });
  }

  getAppointmentById = (id: number) => {
    this.setState({ loading: true });
    const { setFieldsValue } = this.props.form;
    findAppointmentById(id)
      .then((data) => {
        if (data.res.code === Const.SUCCESS_CODE) {

        } else {
          this.setState({ loading: false });
        }
      })
      .catch(() => {
        this.setState({ loading: true });
      });
  };

  onSelectMemberType = (e) => {
    const { params } = this.state;
    const { setFieldsValue } = this.props.form;
    const memberType = e.target.value
    this.setState({
      memberType
    });
    setFieldsValue({
      consumerName: memberType === 'member' ? params.consumerName : '',
      consumerPhone: memberType === 'member' ? params.consumerPhone : '',
      consumerEmail: memberType === 'member' ? params.consumerEmail : ''
    });
  };


  onOpenMemberModal = (visible) => {
    this.setState({
      visible
    });
  };


  onChooseMember = (memberInfo) => {
    console.log(memberInfo, 'memberInfo')
    const { setFieldsValue } = this.props.form;
    let p = {
      consumerName: memberInfo.customerName,
      consumerPhone: memberInfo.contactPhone,
      consumerEmail: memberInfo.email,
      customerId: memberInfo.customerId
    }
    console.log(p)
    this.setState({
      visible: false,
      params: {
        ...this.state.params,
        ...p
      }
    });
    setFieldsValue(p);
  };

  validateDateTime = (rule, value, callback) => {
    console.log(value)
    if (!value.dateNo) {
      callback('Please select available date and time');
    } else {
      callback();
    }
  };

  onSaveAppointment = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        console.log(values)
        // this.setState({ loading: true });
        const { res } = await webapi.apptSave({...values,serviceTypeId:'6'})

      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { apprintmentTypeList, expertTypeList, params, resources, key } = this.state;
    return (
      <Spin spinning={this.state.loading}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/appointmention-list"><FormattedMessage id="Appointment.list" /></a>
          </Breadcrumb.Item>
          <Breadcrumb.Item><FormattedMessage id="Appointment.Appointment" /></Breadcrumb.Item>
        </Breadcrumb>
        <div className="container">
          <Headline title={this.props.match.params.id ? RCi18n({ id: 'Appointment.Update appointment' }) : RCi18n({ id: 'Appointment.ANA' })} />

          <Form onSubmit={this.onSaveAppointment} wrapperCol={{ sm: { span: 16 } }} labelCol={{ sm: { span: 4 } }}>
            <Form.Item label={RCi18n({ id: 'Appointment.SAType' })}>
              {getFieldDecorator('apptTypeId', {
                initialValue: params.apptTypeId || (apprintmentTypeList[0]?.id ?? ''),
                rules: [{
                  required: true,
                  message: 'Please Select appointment type',
                },],
                onChange: () => this.queryDate()
              })(
                <Radio.Group>
                  {apprintmentTypeList.map((item: any) => (<Radio key={item.id} value={item.id}>{item.name}</Radio>))}
                  {/* <Radio value="1"><FormattedMessage id="Appointment.Offline" /></Radio>
                  <Radio value="0"><FormattedMessage id="Appointment.Online" /></Radio> */}
                </Radio.Group>
              )}
            </Form.Item>


            <Form.Item label={RCi18n({ id: 'Appointment.Select.expert.type' })}>
              {getFieldDecorator('expertTypeId', {
                initialValue: params.expertTypeId || (expertTypeList[0]?.id ?? ''),
                rules: [{
                  required: true,
                  message: 'Please Select expert type',
                },],
                onChange: () => this.queryDate()
              })(
                <Radio.Group>
                  {expertTypeList.map((item: any) => (<Radio key={item.id} value={item.id}>{item.name}</Radio>))}

                  {/* <Radio value="1"><FormattedMessage id="Appointment.Behaviorist" /></Radio>
                  <Radio value="0"><FormattedMessage id="Appointment.Nutritionist" /></Radio>
                  <Radio value="2"><FormattedMessage id="Appointment.Orthopedist" /></Radio> */}

                </Radio.Group>
              )}
            </Form.Item>


            <Form.Item label={RCi18n({ id: 'Appointment.Duration' })}>
              {getFieldDecorator('minutes', {
                initialValue: params.minutes || 15,
                rules: [{
                  required: true,
                  message: 'Please Select Duration',
                },],
                onChange: () => this.queryDate()
              })(
                <Radio.Group>
                  <Radio value={15}><FormattedMessage id="Appointment.min15" /></Radio>
                  <Radio value={30}><FormattedMessage id="Appointment.min30" /></Radio>
                  <Radio value={45}><FormattedMessage id="Appointment.min45" /></Radio>
                </Radio.Group>
              )}
            </Form.Item>

            <Form.Item label={RCi18n({ id: 'Appointment.Select.time.slot' })}>
              {getFieldDecorator('bookSlotVO', {
                initialValue: params.bookSlotVO || {},
                rules: [{ validator: this.validateDateTime }]
              })(<WeekCalender key={key} data={resources} />)

              }
            </Form.Item>


            <div style={{ fontWeight: 'bolder' }}>PO’s Info:</div>

            <Form.Item label={RCi18n({ id: 'Appointment.Consumer information' })}>
              <Radio.Group value={this.state.memberType} onChange={this.onSelectMemberType}>
                <Radio value="member"><FormattedMessage id="Appointment.Member" /></Radio>
                <Radio value="guest"><FormattedMessage id="Appointment.Guest" /></Radio>
              </Radio.Group>
              <div style={{ margin: '10px 0' }}>
                {this.state.memberType === 'member' && (
                  <Button type="primary" onClick={() => this.onOpenMemberModal(true)}>
                    <FormattedMessage id="Appointment.Select member" />
                  </Button>
                )}
              </div>
            </Form.Item>
            <Form.Item label={RCi18n({ id: 'Appointment.PON' })}>
              {getFieldDecorator('consumerName', {
                initialValue: params.consumerName || '',
                rules: [{ required: true, message: 'Pet owner name  is required' }]
              })(<Input disabled={this.state.memberType === 'member'} />)}
            </Form.Item>
            <Form.Item label={RCi18n({ id: 'Appointment.Phone number' })}>
              {getFieldDecorator('consumerPhone', {
                initialValue: params.consumerPhone || '',
                rules: [{ required: true, message: 'Phone number is required' }]
              })(<Input />)}
            </Form.Item>
            <Form.Item label={RCi18n({ id: 'Appointment.Consumer email' })}>
              {getFieldDecorator('consumerEmail', {
                initialValue: params.consumerEmail || '',
                rules: [{ required: true, message: 'email is required' }]
              })(<Input disabled={this.state.memberType === 'member'} />)}
            </Form.Item>

            <CustomerList visible={this.state.visible} onConfirm={this.onChooseMember} onClose={() => this.onOpenMemberModal(false)} />
            <div className="bar-button">
              <Button htmlType="submit" type="primary" >
                <FormattedMessage id="Appointment.Save" />
              </Button>
              <Button style={{ marginLeft: 20 }} onClick={() => history.go(-1)}>
                <FormattedMessage id="Appointment.Cancel" />
              </Button>
            </div>
          </Form>
        </div>
      </Spin>
    );
  }
}

export default Form.create<any>()(NewAppointment);
