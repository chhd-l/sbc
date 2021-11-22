import React from 'react';
import { Const, Headline, history } from 'qmkit';
import { Radio, Button, Form, Breadcrumb, Input, Spin, Row, Col } from 'antd';
import moment from 'moment';
import CustomerList from './components/customer-list';
import AppointmentDatePicker from './components/appointment-date-picker';
import { apptUpdate, findAppointmentById, apptSave, queryDate, getAllDict } from './webapi';
import { FormattedMessage } from 'react-intl';
import { RCi18n } from 'qmkit';

import './index.less';
import WeekCalender from './components/week-calender';
// import * as webapi from './webapi';
class NewAppointment extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      params: {
        id:undefined,
        consumerName: undefined,
        apptTypeId: undefined,
        consumerFirstName: undefined,
        consumerLastName: undefined,
        consumerEmail: undefined,
        consumerPhone: undefined,
        customerId: undefined,
        customerLevelId: 234,
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
      expertType: {},
      appointmentType: {},
      serviceType: {},
      resources: [],
      key: (+new Date())
    };
  }

  componentDidMount() {
    //标记返回appointment list时需要记住筛选参数
    this.initDict();
    sessionStorage.setItem('remember-appointment-list-params', '1');
    if (this.props.match.params.id) {
      this.getAppointmentById(this.props.match.params.id);
    }
  }
  //获取字典
  initDict = async () => {
    const appointmentType = await getAllDict('appointment_type')
    const expertType = await getAllDict('expert_type')
    const serviceType = await getAllDict('service_type')
    this.setState({
      expertType,
      appointmentType,
      serviceType
    })
  }
  //初始化能预约的时间
  queryDate = (type: boolean = false, chooseData: any = {}) => {
    const { getFieldsValue } = this.props.form;
    setTimeout(async () => {
      let { apptTypeId, minutes, expertTypeId } = getFieldsValue(['apptTypeId', 'minutes', 'expertTypeId'])
      const resources = await new Promise(async (reslove) => {
        const { res } = await queryDate({ appointmentTypeId: apptTypeId, minutes, expertTypeId });
        if (res.code === Const.SUCCESS_CODE) {
          let _resources = res.context.resources
          if (type && minutes === chooseData.minutes) {
            let _temp: any = {
              "date": chooseData.bookSlotVO.dateNo,
              "minutes": chooseData.minutes,
              "minuteSlotVOList": []
            }
            _temp.minuteSlotVOList.push({ ...chooseData.bookSlotVO, type: 'primary', disabled: true })
            if (_resources.length == 0) {
              _resources.push(_temp)
            } else {
              _resources.map(item => {
                if (item.dateNo === _temp.dateNo) {
                  item.minuteSlotVOList.map(it => {
                    if (it.startTime === _temp.startTime) {
                      it = { ...it, ..._temp }
                    }
                  })
                }
              })
            }
          }
          reslove(_resources);
        }
      })

      this.setState({
        resources,
        key: (+new Date())
      })
    });
  }

  getAppointmentById = (id: number) => {
    this.setState({ loading: true });
    const { setFieldsValue } = this.props.form;
    findAppointmentById(id)
      .then(({ res }) => {
        if (res.code === Const.SUCCESS_CODE) {
          let p = res.context
          this.setState({ params: p, loading: false }, () => {
            setFieldsValue(p);
            this.queryDate(true, p)
          });
        } else {
          this.setState({ loading: false });
        }

      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  onSelectMemberType = (e) => {
    const { params } = this.state;
    const { setFieldsValue,getFieldsValue } = this.props.form;
    setTimeout(() => {
      let customerLevelId=e.target.value;
      setFieldsValue({
        // customerLevelId,
        consumerFirstName: customerLevelId === 234 ? params.consumerFirstName : '',
        consumerLastName: customerLevelId === 234 ? params.consumerLastName : '',
        consumerPhone: customerLevelId === 234 ? params.consumerPhone : '',
        consumerEmail: customerLevelId === 234 ? params.consumerEmail : ''
      });
    });
  };


  onOpenMemberModal = (visible) => {
    this.setState({
      visible
    });
  };


  onChooseMember = (memberInfo) => {
    const { setFieldsValue } = this.props.form;
    let p = {
      consumerName: memberInfo.customerName,
      consumerFirstName: memberInfo.firstName,
      consumerLastName: memberInfo.lastName,
      consumerPhone: memberInfo.contactPhone,
      consumerEmail: memberInfo.email,
      customerId: memberInfo.customerId,
      // customerLevelId: memberInfo.customerLevelId
    }
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
        this.setState({ loading: true });
        const { params } = this.state;
        let d: any = {}

        let cc = { ...params, ...values, serviceTypeId: '6' }
        console.log(cc);
        // return
        if (params.id) {
          d = await apptUpdate(cc)
        } else {
          d = await apptSave(cc)
        }
        if (d.res.code === Const.SUCCESS_CODE) {
          this.setState({ loading: false });
          history.push('/appointment-list')
        }
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldsValue } = this.props.form;
    // const { getFieldsValue } = this.props.form;
    const { expertType, appointmentType, serviceType, params, resources, key } = this.state;
    let customerLevelId=getFieldsValue(['customerLevelId']).customerLevelId;
    return (
      <Spin spinning={this.state.loading}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/appointment-list"><FormattedMessage id="Appointment.list" /></a>
          </Breadcrumb.Item>
          <Breadcrumb.Item><FormattedMessage id="Appointment.Appointment" /></Breadcrumb.Item>
        </Breadcrumb>
        <div className="container">
          <Headline title={this.props.match.params.id ? RCi18n({ id: 'Appointment.Update appointment' }) : RCi18n({ id: 'Appointment.ANA' })} />

          <Form onSubmit={this.onSaveAppointment} wrapperCol={{ sm: { span: 16 } }} labelCol={{ sm: { span: 4 } }}>
            <Form.Item label={RCi18n({ id: 'Appointment.SAType' })}>
              {getFieldDecorator('apptTypeId', {
                initialValue: params.apptTypeId || ((appointmentType?.list ?? [])[0]?.id ?? ''),
                rules: [{
                  required: true,
                  message: 'Please Select appointment type',
                },],
                onChange: () => this.queryDate(params.id ? true : false, params)
              })(
                <Radio.Group>
                  {(appointmentType?.list ?? []).map((item: any) => (<Radio key={item.id} value={item.id}>{item.name}</Radio>))}
                  {/* <Radio value="1"><FormattedMessage id="Appointment.Offline" /></Radio>
                  <Radio value="0"><FormattedMessage id="Appointment.Online" /></Radio> */}
                </Radio.Group>
              )}
            </Form.Item>


            <Form.Item label={RCi18n({ id: 'Appointment.Select.expert.type' })}>
              {getFieldDecorator('expertTypeId', {
                initialValue: params.expertTypeId || ((expertType?.list ?? [])[0]?.id ?? ''),
                rules: [{
                  required: true,
                  message: 'Please Select expert type',
                },],
                onChange: () => this.queryDate(params.id ? true : false, params)
              })(
                <Radio.Group>
                  {(expertType?.list ?? []).map((item: any) => (<Radio key={item.id} value={item.id}>{item.name}</Radio>))}

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
                onChange: () => this.queryDate(params.id ? true : false, params)
              })(
                <Radio.Group>
                  <Radio key={15} value={15}><FormattedMessage id="Appointment.min15" /></Radio>
                  <Radio key={30} value={30}><FormattedMessage id="Appointment.min30" /></Radio>
                  <Radio key={45} value={45}><FormattedMessage id="Appointment.min45" /></Radio>
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
              {getFieldDecorator('customerLevelId', {
                initialValue: params.customerLevelId,
                onChange:this.onSelectMemberType
              })(<Radio.Group
              disabled={params.id}
              >
                <Radio value={234}><FormattedMessage id="Appointment.Member" /></Radio>
                <Radio value={233}><FormattedMessage id="Appointment.Guest" /></Radio>
              </Radio.Group>)}
            { !params.id&& <div style={{ margin: '10px 0' }} >
                {customerLevelId === 234 && (
                  <Button type="primary" onClick={() => this.onOpenMemberModal(true)}>
                    <FormattedMessage id="Appointment.Select member" />
                  </Button>
                )}
              </div>
  }
            </Form.Item>
            {/* <Form.Item label={RCi18n({ id: 'Appointment.PON' })}>
              {getFieldDecorator('consumerName', {
                initialValue: params.consumerName || '',
                rules: [{ required: true, message: 'Pet owner name  is required' }]
              })(<Input disabled={this.state.memberType === 'member'} />)}
            </Form.Item> */}
            <Row>
              <Col span={12}>
                <Form.Item label={RCi18n({ id: 'PetOwner.FirstName' })} wrapperCol={{ sm: { span: 13 } }} labelCol={{ sm: { span: 8 } }}>
                  {getFieldDecorator('consumerFirstName', {
                    initialValue: params.consumerFirstName || '',
                    rules: [{ required: true, message: 'The first name  is required' }]
                  })(<Input disabled={customerLevelId === 234||params.id} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={RCi18n({ id: 'PetOwner.LastName' })} wrapperCol={{ sm: { span: 12 } }} labelCol={{ sm: { span: 4 } }}>
                  {getFieldDecorator('consumerLastName', {
                    initialValue: params.consumerLastName || '',
                    rules: [{ required: true, message: 'The last name  is required' }]
                  })(<Input disabled={customerLevelId === 234||params.id} />)}
                </Form.Item>
              </Col>
            </Row>


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
              })(<Input disabled={customerLevelId === 234||params.id} />)}
            </Form.Item>

            <CustomerList visible={this.state.visible} onConfirm={this.onChooseMember} onClose={() => this.onOpenMemberModal(false)} />
            <div className="bar-button">
              <Button htmlType="submit" type="primary" >
                <FormattedMessage id="Appointment.Save" />
              </Button>
              <Button style={{ marginLeft: 20 }} onClick={() => history.push('/appointment-list')}>
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
