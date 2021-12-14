import { Breadcrumb, Card, Col, Form, Row, Spin, Table, Tabs } from 'antd'
import moment from 'moment';
import { Const } from 'qmkit';
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl';
import './index.less';
import { apptDetail ,getAllDict} from './webapi';
const { TabPane } = Tabs;

class Details extends Component {
    props: {
        match: any
    }
    state = {
        appointment: {},
        operations: [],
        order: {},
        petOwner: {},
        expertType:{},
        appointmentType:{},
        serviceType:{}
    }
    componentDidMount() {
        this.initDict()
        if (this.props.match.params.id) {
            this.getAppointmentById(this.props.match.params.id);
        }
    }
    initDict=async()=>{
        const appointmentType=await getAllDict('appointment_type')
        const expertType=await getAllDict('expert_type')
        const serviceType=await getAllDict('service_type')
        this.setState({
          expertType,
          appointmentType,
          serviceType
        })
    }
    getAppointmentById = (id: number) => {
        this.setState({ loading: true });
        apptDetail(id)
            .then(({ res }: any) => {
                if (res.code === Const.SUCCESS_CODE) {
                    let data=res.context
                    let text=data?.appointment?.appointmentTime
                    console.log(text,'text')
                    if(text){
                        let time= text.split('#')
                        let begin=moment(moment(time[0],'YYYY-MM-DD HH:mm')).format('YYYY-MM-DD HH:mm'),
                        end=moment(moment(time[1],'YYYY-MM-DD HH:mm')).format('HH:mm');
                        data.appointment.appointmentTime=begin+'-'+end
                      }
                    this.setState({ loading: true, ...res.context });
                } else {
                    this.setState({ loading: false });
                }
            })
            .catch(() => {
                this.setState({ loading: true });
            });
    };
    callback = (key) => {
        console.log(key);
    }
    render() {
        let { appointment, operations, order, petOwner,expertType,appointmentType,serviceType }: any = this.state,
            columns = [
                {
                    title: 'Operator Type',
                    dataIndex: 'operatorType',
                    key: 'operatorType',
                },
                {
                    title: 'Operator',
                    dataIndex: 'operatorName',
                    key: 'operatorName',
                },
                {
                    title: 'Time',
                    dataIndex: 'operateTime',
                    key: 'operateTime',
                },
                {
                    title: 'Operation Category',
                    dataIndex: 'operationCategory',
                    key: 'operationCategory',
                },
                {
                    title: 'Operation log',
                    dataIndex: 'operationLog',
                    key: 'operationLog',
                }
            ];
        const formItemLayout = {
            labelCol: {
                sm: { span: 6 },
            },
            wrapperCol: {
                sm: { span: 18 },
            },
        };
        let status = {
            "0": 'Booked',
            "1": 'Arrived',
            "2": 'Canceled'
          }
          let owenType={
           1:<FormattedMessage id="Appointment.Member" />,
           2:<FormattedMessage id="Appointment.Guest" />
          }
        return (
            <div className="appointmention-detail">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <a href="/appointmention-list"><FormattedMessage id="Appointment.list" /></a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item><FormattedMessage id="Appointment.Appointment" /></Breadcrumb.Item>
                </Breadcrumb>
                <div style={{ background: '#fff', padding: 10, margin: '12px 12px 0 12px' }}><strong>Appointment detail</strong></div>
                <div className="container" style={{ marginTop: 10 }}>
                    <div>
                        <Tabs defaultActiveKey="1" onChange={this.callback}>
                            <TabPane tab="Appointment" key="1">

                                <Row>
                                    <Col span={12}>
                                        <Card style={{ width: '90%', background: '#f8f8f8' }}>
                                            <h3><strong>Appointment</strong></h3>
                                            <Form style={{ marginTop: 20 }}  {...formItemLayout}>
                                                <Form.Item label="Appointment No.">
                                                    {appointment?.appointmentNo ?? ''}
                                                </Form.Item>
                                                <Form.Item label="Appointment type">
                                                    {(appointmentType?.objValue??{})[appointment?.appointmentTypeId ?? '']}
                                                </Form.Item>
                                                <Form.Item label="Appointment status">
                                                    {status[appointment?.appointmentStatus ?? '']}
                                                </Form.Item>
                                                <Form.Item label="Expert type">
                                                    {(expertType?.objValue??{})[appointment?.expertTypeId ?? '']}
                                                </Form.Item>
                                                <Form.Item label="Expert name">
                                                    {appointment?.expertNames ?? ''}
                                                </Form.Item>
                                                <Form.Item label="Appointment time">
                                                    {appointment?.appointmentTime ?? ''}
                                                </Form.Item>
                                                <Form.Item label="Created time">
                                                    {appointment?.createTime ?? ''}
                                                </Form.Item>
                                                <Form.Item label="Last updated time">
                                                    {appointment?.lastUpdatedTime ?? ''}
                                                </Form.Item>
                                            </Form>

                                        </Card>

                                        <div style={{ marginTop: 20 }}>
                                            <Card style={{ width: '90%', background: '#f8f8f8' }}>
                                                <h3><strong>Order</strong></h3>
                                                <Form layout="inline" style={{ marginTop: 20 }} >
                                                    <Form.Item label="Order number">
                                                        {order?.id ?? ''}
                                                    </Form.Item>
                                                    <Form.Item label="Order time">
                                                        {order?.orderTime ?? ''}
                                                    </Form.Item>
                                                    <Form.Item label="Order status">
                                                        {order?.status ?? ''}
                                                    </Form.Item>
                                                    <Form.Item label="Order  source">
                                                        {order?.source ?? ''}
                                                    </Form.Item>
                                                    <Form.Item label="Order type">
                                                        {order?.orderType ?? ''}
                                                    </Form.Item>
                                                    <Form.Item label="Create by">
                                                        {order?.orderCreateType ?? ''}
                                                    </Form.Item>
                                                    <Form.Item label="Payment method">
                                                        {order?.paymentMethodType ?? ''}
                                                    </Form.Item>
                                                </Form>
                                            </Card>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <Card style={{ width: '90%', background: '#f8f8f8' }}>
                                            <h3><strong>Pet owner</strong></h3>
                                            <Form style={{ marginTop: 20 }} {...formItemLayout}>
                                                <Form.Item label="Pet owner name">
                                                    {petOwner?.name ?? ''}
                                                </Form.Item>
                                                <Form.Item label="Phone number">
                                                    {petOwner?.phoneNumber ?? ''}
                                                </Form.Item>
                                                <Form.Item label="Email">
                                                    {petOwner?.email ?? ''}
                                                </Form.Item>
                                                <Form.Item label="Pet Owner type">
                                                    {owenType[petOwner?.petOwnerType ?? '']}
                                                </Form.Item>

                                            </Form>
                                        </Card>

                                    </Col>
                                </Row>






                            </TabPane>
                            <TabPane tab="Operation log" key="2">
                                <Table pagination={false} dataSource={operations} columns={columns} />;
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        )
    }
}
export default Details
