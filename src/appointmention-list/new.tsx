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

class NewAppointment extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      appointment: {},
      memberInfo: {
        customerName: '',
        contactPhone: '',
        email: ''
      },
      memberType: 'member'
    };
  }

  componentDidMount() {
    //标记返回appointment list时需要记住筛选参数
    sessionStorage.setItem('remember-appointment-list-params', '1');
    if (this.props.match.params.id) {
      this.getAppointmentById(this.props.match.params.id);
    }
  }

  getAppointmentById = (id: number) => {
    this.setState({ loading: true });
    const { setFieldsValue } = this.props.form;
    findAppointmentById(id)
      .then((data) => {
        if (data.res.code === Const.SUCCESS_CODE) {
          const appointment = data.res.context.settingVO;
          this.setState({
            loading: false,
            appointment,
            memberInfo: {
              customerId: appointment.customerId,
              customerName: appointment.consumerName,
              contactPhone: appointment.consumerPhone,
              email: appointment.consumerEmail
            },
            memberType: appointment.customerId ? 'member' : 'guest'
          });
          setFieldsValue({
            consumerName: appointment.consumerName,
            consumerPhone: appointment.consumerPhone,
            consumerEmail: appointment.consumerEmail,
            type: appointment.type,
            apptDateTime: [moment(appointment.apptDate, 'YYYYMMDD').format('YYYY-MM-DD'), appointment.apptTime]
          });
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(() => {
        this.setState({ loading: true });
      });
  };

  onSelectMemberType = (e) => {
    const { memberInfo } = this.props;
    const { setFieldsValue } = this.props.form;
    this.setState({
      memberType: e.target.value
    });
    setFieldsValue({
      consumerName: e.target.value === 'member' ? memberInfo.customerName : '',
      consumerPhone: e.target.value === 'member' ? memberInfo.contactPhone : '',
      consumerEmail: e.target.value === 'member' ? memberInfo.email : ''
    });
  };

  onOpenMemberModal = () => {
    this.setState({
      visible: true
    });
  };

  onCloseMemberModal = () => {
    this.setState({
      visible: false
    });
  };

  onChooseMember = (memberInfo) => {
    const { setFieldsValue } = this.props.form;
    this.setState({
      visible: false,
      memberInfo: memberInfo
    });
    setFieldsValue({
      consumerName: memberInfo.customerName,
      consumerPhone: memberInfo.contactPhone,
      consumerEmail: memberInfo.email
    });
  };

  validateDateTime = (rule, value, callback) => {
    if (value.length !== 2 || !value[0] || !value[1] || moment(value[0], 'YYYY-MM-DD') < moment('2021-04-20', 'YYYY-MM-DD').startOf('day') || moment(value[0], 'YYYY-MM-DD') > moment('2021-06-13', 'YYYY-MM-DD').endOf('day')) {
      callback('Please select available date and time');
    } else {
      callback();
    }
  };

  onSaveAppointment = () => {
    this.props.form.validateFields((err, fields) => {
      if (!err) {
        this.setState({ loading: true });
        const handler = this.props.match.params.id ? updateAppointmentById : addNewAppointment;
        handler({
          ...this.state.appointment,
          ...fields,
          customerId: this.state.memberType === 'member' ? this.state.memberInfo.customerId : undefined,
          status: 0,
          apptDate: fields.apptDateTime[0].split('-').join(''),
          apptTime: fields.apptDateTime[1]
        })
          .then((data) => {
            if (data.res.code === Const.SUCCESS_CODE) {
              history.push('/appointment-list');
            } else {
              this.setState({ loading: false });
            }
          })
          .catch(() => {
            this.setState({ loading: false });
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Spin spinning={this.state.loading}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/appointment-list"><FormattedMessage id="Appointment.list" /></a>
          </Breadcrumb.Item>
          <Breadcrumb.Item><FormattedMessage id="Appointment.Appointment" /></Breadcrumb.Item>
        </Breadcrumb>
        <div className="container">
          <Headline title={this.props.match.params.id ? RCi18n({id:'Appointment.Update appointment'}) : RCi18n({id:'Appointment.ANA'})} />
          
          <Form wrapperCol={{ sm: { span: 16 } }} labelCol={{ sm: { span: 4 } }}>
            <Form.Item label={RCi18n({id:'Appointment.SAType'})}>
              {getFieldDecorator('type', {
                initialValue: '1'
              })(
                <Radio.Group>
                  <Radio value="1"><FormattedMessage id="Appointment.Offline" /></Radio>
                  <Radio value="0"><FormattedMessage id="Appointment.Online" /></Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label={RCi18n({id:'Appointment.Update appointment'})}>
              {getFieldDecorator('apptDateTime', {
                initialValue: [moment() < moment('2021-04-20', 'YYYY-MM-DD').startOf('day') ? '2021-04-20' : moment().day() === 1 ? moment().add(1, 'days').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'), ''],
                rules: [{ validator: this.validateDateTime }]
              })( <WeekCalender />)
              
              }
           
          
           {/* <AppointmentDatePicker onFetching={(state) => this.setState({ loading: state })} /> */}
            </Form.Item>
            <Form.Item label={RCi18n({id:'Appointment.Consumer information'})}>
              <Radio.Group value={this.state.memberType} onChange={this.onSelectMemberType}>
                <Radio value="member"><FormattedMessage id="Appointment.Member" /></Radio>
                <Radio value="guest"><FormattedMessage id="Appointment.Guest" /></Radio>
              </Radio.Group>
              <div style={{ margin: '10px 0' }}>
                {this.state.memberType === 'member' && (
                  <Button type="primary" onClick={this.onOpenMemberModal}>
                  <FormattedMessage id="Appointment.Select member" />
                  </Button>
                )}
              </div>
            </Form.Item>
            <Form.Item label={RCi18n({id:'Appointment.PON'})}>
              {getFieldDecorator('consumerName', {
                initialValue: '',
                rules: [{ required: true, message: 'Pet owner name  is required' }]
              })(<Input disabled={this.state.memberType === 'member'} />)}
            </Form.Item>
            <Form.Item label={RCi18n({id:'Appointment.Phone number'})}>
              {getFieldDecorator('consumerPhone', {
                initialValue: '',
                rules: [{ required: true, message: 'Phone number is required' }]
              })(<Input />)}
            </Form.Item>
            <Form.Item label={RCi18n({id:'Appointment.Consumer email'})}>
              {getFieldDecorator('consumerEmail', {
                initialValue: '',
                rules: [{ required: true, message: 'email is required' }]
              })(<Input disabled={this.state.memberType === 'member'} />)}
            </Form.Item>
          </Form>
          <CustomerList visible={this.state.visible} onConfirm={this.onChooseMember} onClose={this.onCloseMemberModal} />
          <div className="bar-button">
            <Button type="primary" onClick={this.onSaveAppointment}>
            <FormattedMessage id="Appointment.Save" />
            </Button>
            <Button style={{ marginLeft: 20 }} onClick={() => history.go(-1)}>
            <FormattedMessage id="Appointment.Cancel" />
            </Button>
          </div>
        </div>
      </Spin>
    );
  }
}

export default Form.create<any>()(NewAppointment);
