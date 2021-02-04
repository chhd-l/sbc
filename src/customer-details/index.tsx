import React from 'react';
import { Form, Card, Avatar, Input, InputNumber, DatePicker, Button, Select, message, Table, Row, Col, Breadcrumb, Modal, Popconfirm } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import * as webapi from './webapi';
import { Tabs, Spin } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Headline, BreadCrumb, history } from 'qmkit';
import BasicInfomation from './component/basic-infomation';
import PetInfomation from './component/pet-infomation';
import DeliveryInformation from './component/delivery-information';
import BillingInfomation from './component/billing-infomation';
import PaymentInfo from './component/payment-infomation';
import OrderInformation from './component/order-information';

import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const { Column } = Table;
const { confirm } = Modal;

export default class CustomerDetails extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      customerId: this.props.match.params.id ? this.props.match.params.id : '',
      customerType: this.props.match.params.type ? this.props.match.params.type : 'Guest',
      customerAccount: this.props.match.params.account ? this.props.match.params.account : '',
      loading: false
    };
  }
  componentDidMount() {
    // this.querySysDictionary('country');
    // this.querySysDictionary('city');
  }

  // querySysDictionary = async (type: String) => {
  //   const { res } = await webapi.querySysDictionary({
  //     type: type
  //   });
  //   if (res.code === 'K-000000') {
  //     if (type === 'city') {
  //       sessionStorage.setItem(
  //         'dict-city',
  //         JSON.stringify(res.context.sysDictionaryVOS)
  //       );
  //     }
  //     if (type === 'country') {
  //       sessionStorage.setItem(
  //         'dict-country',
  //         JSON.stringify(res.context.sysDictionaryVOS)
  //       );
  //     }
  //   } else {
  //     message.error('Unsuccessful');
  //   }
  // };
  clickTabs = (key) => {};
  showConfirm(id) {
    const that = this;
    confirm({
      title: 'Are you sure to delete this item?',
      onOk() {
        return that.removeConsumer(id);
      },
      onCancel() {}
    });
  }

  removeConsumer = (constomerId) => {
    this.setState({
      loading: true
    });
    let customerIds = [];
    customerIds.push(constomerId);
    let params = {
      customerIds: customerIds,
      userId: sessionStorage.getItem('employeeId') ? sessionStorage.getItem('employeeId') : ''
    };
    webapi
      .delCustomer(params)
      .then((data) => {
        if (data.res.code === 'K-000000') {
          message.success('Operate successfully');
          history.push('/customer-list');
        } else {
          message.error(data.res.message || 'Unsuccessful');
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        message.error(err.message || 'Unsuccessful');
        this.setState({
          loading: false
        });
      });
  };

  render() {
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>
            <FormattedMessage id="consumer.consumerDetails" />
          </Breadcrumb.Item>
        </BreadCrumb>
        {/*导航面包屑*/}
        <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
          {this.state.customerType !== 'Guest' && (
            <div>
              <div className="detail-container">
                <div className="text-align-right">
                  <Popconfirm placement="topRight" title="Are you sure to remove this item?" onConfirm={() => this.removeConsumer(this.state.customerId)} okText="Confirm" cancelText="Cancel">
                    <Button type="link">
                      <FormattedMessage id="consumer.removeConsumer" />
                    </Button>
                  </Popconfirm>
                </div>
                <Headline
                  title="Basic information"
                  extra={
                    <Link to={`/edit-customer-basicinfo/${this.state.customerId}`}>
                      <i className="iconfont iconEdit"></i> Edit
                    </Link>
                  }
                />
                <div style={{ margin: '20px 0' }}>
                  <Row className="text-tip">
                    <Col span="4">Name</Col>
                    <Col span="4">Age</Col>
                  </Row>
                  <Row className="text-highlight" style={{ marginTop: 5 }}>
                    <Col span="4">Shilin Hu</Col>
                    <Col span="4">30</Col>
                  </Row>
                </div>
                <div className="basic-info-detail">
                  <Row type="flex" align="middle">
                    <Col span="4" className="text-tip">
                      Registration date
                    </Col>
                    <Col span="6" className="text-highlight">
                      2020-10-09
                    </Col>
                    <Col span="4" className="text-tip">
                      Email address
                    </Col>
                    <Col span="6" className="text-highlight">
                      xxx@xxx.xx
                    </Col>
                  </Row>
                  <Row type="flex" align="middle">
                    <Col span="4" className="text-tip">
                      Phone number
                    </Col>
                    <Col span="6" className="text-highlight">
                      20200303
                    </Col>
                    <Col span="4" className="text-tip">
                      Prefer channel
                    </Col>
                    <Col span="6" className="text-highlight">
                      Email
                    </Col>
                  </Row>
                  <Row type="flex" align="middle">
                    <Col span="4" className="text-tip">
                      Country
                    </Col>
                    <Col span="6" className="text-highlight">
                      Mexico
                    </Col>
                    <Col span="4" className="text-tip">
                      Address reference
                    </Col>
                    <Col span="6" className="text-highlight">
                      none
                    </Col>
                  </Row>
                  <Row type="flex" align="middle">
                    <Col span="4" className="text-tip">
                      Consent
                    </Col>
                    <Col span="6" className="text-highlight">
                      Email comunication
                    </Col>
                  </Row>
                </div>
              </div>
              <div className="detail-container">
                <Headline title="Segment" />
                <Row>
                  <Col span={20}>
                    <Form layout="vertical">
                      <FormItem label="Tag name">
                        <Select mode="multiple">
                          <Option key="1" value="a">
                            Active User
                          </Option>
                          <Option key="2" value="b">
                            Student
                          </Option>
                        </Select>
                      </FormItem>
                    </Form>
                  </Col>
                </Row>
              </div>
              <div className="detail-container">
                <Headline title="Pet information" />
                <Card style={{ width: 350 }} bodyStyle={{ padding: '10px 20px' }}>
                  <div className="text-align-right">
                    <Popconfirm placement="topRight" title="Are you sure to remove this item?" onConfirm={() => {}} okText="Confirm" cancelText="Cancel">
                      <Button type="link">
                        <span className="iconfont iconDelete"></span> Delete
                      </Button>
                    </Popconfirm>
                    <Link>
                      <span className="iconfont iconEdit"></span> Edit
                    </Link>
                  </div>
                  <Row gutter={10}>
                    <Col span={6}>
                      <Avatar size={70} icon="user" />
                    </Col>
                    <Col span={18}>
                      <Row>
                        <Col span={24}>
                          <div className="text-highlight">Hanhan</div>
                        </Col>
                      </Row>
                      <Row className="text-tip">
                        <Col span={12}>Age</Col>
                        <Col span={12}>Breed</Col>
                      </Row>
                      <Row style={{ fontSize: 16 }}>
                        <Col span={12}>9 months</Col>
                        <Col span={12}>Weimaranger</Col>
                      </Row>
                    </Col>
                  </Row>
                </Card>
              </div>
            </div>
          )}
          <div className="container">
            {this.state.customerType !== 'Guest' ? (
              <div>
                <Headline title="Other information" extra={<RangePicker defaultValue={[moment(), moment()]} />} />
                <Tabs defaultActiveKey="basic" onChange={this.clickTabs}>
                  <TabPane tab="Order information" key="order">
                    <OrderInformation startDate="2020-02-01" endDate="2020-02-03" />
                  </TabPane>
                  <TabPane tab="Basic infomation" key="basic">
                    <BasicInfomation customerId={this.state.customerId}></BasicInfomation>
                  </TabPane>
                  <TabPane tab="Pet infomation" key="pet">
                    <PetInfomation customerId={this.state.customerId} customerAccount={this.state.customerAccount}></PetInfomation>
                  </TabPane>
                  <TabPane tab="Delivery infomation" key="delivery">
                    <DeliveryInformation customerId={this.state.customerId}></DeliveryInformation>
                  </TabPane>
                  <TabPane tab="Billing infomation" key="billing">
                    <BillingInfomation customerId={this.state.customerId}></BillingInfomation>
                  </TabPane>
                  <TabPane tab="Payment methods" key="payment">
                    <PaymentInfo customerId={this.state.customerId}></PaymentInfo>
                  </TabPane>
                </Tabs>
              </div>
            ) : (
              <Tabs defaultActiveKey="delivery" onChange={this.clickTabs}>
                <TabPane tab="Delivery infomation" key="vistor-delivery">
                  <DeliveryInformation customerId={this.state.customerId} customerType="Guest"></DeliveryInformation>
                </TabPane>
                <TabPane tab="Billing infomation" key="vistor-billing">
                  <BillingInfomation customerId={this.state.customerId} customerType="Guest"></BillingInfomation>
                </TabPane>
              </Tabs>
            )}
          </div>
        </Spin>
      </div>
    );
  }
}
