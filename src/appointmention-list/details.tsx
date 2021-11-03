import { Breadcrumb, Card, Col, Form, Row, Spin, Table, Tabs } from 'antd'
import { Const } from 'qmkit';
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl';
import './index.less';
import {  findAppointmentById } from './webapi';
const { TabPane } = Tabs;

class Details extends Component{
    state={

    }
    componentDidMount() {
        console.log(this.props.match)
        if (this.props.match.params.id) {
          //this.getAppointmentById(this.props.match.params.id);
        }
      }
    getAppointmentById = (id: number) => {
        this.setState({ loading: true });
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
     callback=(key)=> {
        console.log(key);
    }
    render() {
        let dataSource=[],
         columns = [
            {
              title: 'Operator Type',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: 'Operator',
              dataIndex: 'age',
              key: 'age',
            },
            {
              title: 'Time',
              dataIndex: 'address',
              key: 'address',
            },
            {
                title: 'Operation log',
                dataIndex: 'address',
                key: 'address',
              }
          ];
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
                                        <Form style={{ marginTop: 20 }}>
                                            <Form.Item label="Appointment No."></Form.Item>
                                            <Form.Item label="Appointment type"></Form.Item>
                                            <Form.Item label="Appointment status"></Form.Item>
                                            <Form.Item label="Expert type"></Form.Item>
                                            <Form.Item label="Expert name"></Form.Item>
                                            <Form.Item label="Appointment time"></Form.Item>
                                            <Form.Item label="Created time"></Form.Item>
                                            <Form.Item label="Last updated time"></Form.Item>
                                        </Form>

                                    </Card>

                                    <div style={{ marginTop: 20 }}>
                                        <Card style={{ width: '90%', background: '#f8f8f8' }}>
                                            <h3><strong>Order</strong></h3>
                                            <Form layout="inline" style={{ marginTop: 20 }}>
                                                <Form.Item label="Order number"></Form.Item>
                                                <Form.Item label="Order time"></Form.Item>
                                                <Form.Item label="Order status"></Form.Item>
                                                <Form.Item label="Order  source"></Form.Item>
                                                <Form.Item label="Order type"></Form.Item>
                                                <Form.Item label="Create by"></Form.Item>
                                                <Form.Item label="Payment method"></Form.Item>
                                            </Form>
                                        </Card>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <Card style={{ width: '90%', background: '#f8f8f8' }}>
                                        <h3><strong>Pet owner</strong></h3>
                                        <Form style={{ marginTop: 20 }}>
                                            <Form.Item label="Pet owner name"></Form.Item>
                                            <Form.Item label="Phone number"></Form.Item>
                                            <Form.Item label="Email"></Form.Item>
                                            <Form.Item label="Pet Owner type"></Form.Item>

                                        </Form>
                                    </Card>

                                </Col>
                            </Row>






                        </TabPane>
                        <TabPane tab="Operation log" key="2">
                        <Table dataSource={dataSource} columns={columns} />;
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </div>
    )
    }
}
export default Details
