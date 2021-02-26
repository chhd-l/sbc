import React from 'react';
import { Form, Card, Avatar, Input, InputNumber, DatePicker, Button, Select, message, Table, Row, Col, Breadcrumb, Modal, Popconfirm, Icon } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import * as webapi from './webapi';
import { Tabs, Spin } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Headline, BreadCrumb, history, Const } from 'qmkit';
import OrderInformation from './component/order-information';
import SubscribInformation from './component/subscrib-information';
import PrescribInformation from './component/prescrib-information';
import DeliveryList from './component/delivery-list';
import PaymentList from './component/payment-list';
import Feedback from './component/feedback';
import BasicEdit from './component/basic-edit';

import './index.less';
import basicEdit from './component/basic-edit';

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
      displayPage: 'detail',
      customerId: this.props.match.params.id ? this.props.match.params.id : '',
      customerAccount: this.props.match.params.account ? this.props.match.params.account : '',
      loading: false,
      basic: {
        customerName: '',
        email: '',
        age: '',
        createTime: '',
        contactPhone: '',
        preferredMethods: '',
        country: '',
        address: '',
        consent: ''
      },
      pets: [],
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD')
    };
  }
  componentDidMount() {
    if (this.state.customerType !== 'Guest') {
      this.getBasicInformation();
      this.getPetsList();
    }
  }

  getBasicInformation = () => {
    webapi.getBasicDetails(this.state.customerId).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        this.setState({
          basic: {
            customerName: res.context.customerName || '',
            email: res.context.email || '',
            age: res.context.birthDay ? moment(res.context.birthDay).fromNow() : '',
            createTime: res.context.createTime ? moment(res.context.createTime).format('YYYY-MM-DD') : '',
            contactPhone: res.context.contactPhone || '',
            preferredMethods: '',
            country: res.context.country,
            address: res.context.address1,
            consent: ''
          }
        });
      }
    });
  };

  getPetsList = () => {
    const { customerAccount } = this.state;
    webapi.petsByConsumer({ consumerAccount: customerAccount }).then((data) => {
      const pets = data.res.context.context.map((r) => ({
        petsId: r.petsId,
        petsImg: r.petsImg,
        petsName: r.petsName,
        petsAge: r.birthOfPets ? moment().diff(r.borthOfPets, 'months') : '',
        petsBreed: r.breederId
      }));
      this.setState({
        pets: pets
      });
    });
  };

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
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };

  handleChangeDateRange = (dates, dateStrs) => {
    this.setState({
      startDate: dateStrs[0],
      endDate: dateStrs[1]
    });
  };

  render() {
    const { displayPage, basic, pets, startDate, endDate } = this.state;
    return (
      <>
        <div style={{ display: displayPage === 'detail' ? 'block' : 'none' }}>
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>
              <FormattedMessage id="consumer.consumerDetails" />
            </Breadcrumb.Item>
          </BreadCrumb>
          {/*导航面包屑*/}
          <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
            <div className="detail-container">
              <Headline
                title="Basic information"
                extra={
                  <Popconfirm placement="topRight" title="Are you sure to remove this item?" onConfirm={() => this.removeConsumer(this.state.customerId)} okText="Confirm" cancelText="Cancel">
                    <Button type="link">
                      <FormattedMessage id="consumer.removeConsumer" />
                    </Button>
                  </Popconfirm>
                }
              />
              <div style={{ margin: '20px 0' }}>
                <Row className="text-tip">
                  <Col span={4}>
                    <Icon type="user" /> Name
                  </Col>
                  <Col span={4}>
                    <Icon type="calendar" /> Age
                  </Col>
                  <Col span={16} className="text-align-right" style={{ padding: '0 35px' }}>
                    <Link to={`/edit-customer-basicinfo/${this.state.customerId}`}>
                      <i className="iconfont iconEdit"></i> Edit
                    </Link>
                  </Col>
                </Row>
                <Row className="text-highlight" style={{ marginTop: 5 }}>
                  <Col span={4}>{basic.customerName}</Col>
                  <Col span={4}>{basic.age}</Col>
                </Row>
              </div>
              <div className="basic-info-detail">
                <Row type="flex" align="middle">
                  <Col span={4} className="text-tip">
                    Registration date
                  </Col>
                  <Col span={6} className="text-highlight">
                    {basic.createTime}
                  </Col>
                  <Col span={4} className="text-tip">
                    Email address
                  </Col>
                  <Col span={6} className="text-highlight">
                    {basic.email}
                  </Col>
                </Row>
                <Row type="flex" align="middle">
                  <Col span={4} className="text-tip">
                    Phone number
                  </Col>
                  <Col span={6} className="text-highlight">
                    {basic.contactPhone}
                  </Col>
                  <Col span={4} className="text-tip">
                    Prefer channel
                  </Col>
                  <Col span={6} className="text-highlight">
                    {basic.preferredMethods}
                  </Col>
                </Row>
                <Row type="flex" align="middle">
                  <Col span={4} className="text-tip">
                    Country
                  </Col>
                  <Col span={6} className="text-highlight">
                    {basic.country}
                  </Col>
                  <Col span={4} className="text-tip">
                    Address reference
                  </Col>
                  <Col span={6} className="text-highlight">
                    {basic.address}
                  </Col>
                </Row>
                <Row type="flex" align="middle">
                  <Col span={4} className="text-tip">
                    Consent
                  </Col>
                  <Col span={6} className="text-highlight">
                    {basic.consent}
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
              <Row gutter={16}>
                {pets.map((pet) => (
                  <Col span={8}>
                    <Card bodyStyle={{ padding: '10px 20px' }}>
                      <div className="text-align-right">
                        <Popconfirm placement="topRight" title="Are you sure to remove this item?" onConfirm={() => {}} okText="Confirm" cancelText="Cancel">
                          <Button type="link">
                            <span className="iconfont iconDelete"></span> Delete
                          </Button>
                        </Popconfirm>
                        <Link to={`/edit-customer-pet/${pet.petsId}`}>
                          <span className="iconfont iconEdit"></span> Edit
                        </Link>
                      </div>
                      <Row gutter={10}>
                        <Col span={6}>
                          <Avatar size={70} src={pet.petsImg} />
                        </Col>
                        <Col span={18}>
                          <Row>
                            <Col span={24}>
                              <div className="text-highlight">{pet.petsName}</div>
                            </Col>
                          </Row>
                          <Row className="text-tip">
                            <Col span={12}>Age</Col>
                            <Col span={12}>Breed</Col>
                          </Row>
                          <Row style={{ fontSize: 16 }}>
                            <Col span={12}>{pet.petsAge} months</Col>
                            <Col span={12}>{pet.petsBreed}</Col>
                          </Row>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
            <div className="container">
              <Headline title="Other information" extra={<RangePicker defaultValue={[moment(), moment()]} onChange={this.handleChangeDateRange} />} />
              <Tabs defaultActiveKey="basic" onChange={this.clickTabs}>
                <TabPane tab="Order information" key="order">
                  <OrderInformation startDate={startDate} endDate={endDate} customerAccount={this.state.customerAccount} />
                </TabPane>
                <TabPane tab="Subscription information" key="subscrib">
                  <SubscribInformation startDate={startDate} endDate={endDate} customerAccount="" />
                </TabPane>
                <TabPane tab="Prescriber information" key="prescrib">
                  <PrescribInformation startDate={startDate} endDate={endDate} />
                </TabPane>
                <TabPane tab="Delivery information" key="delivery">
                  <DeliveryList startDate={startDate} endDate={endDate} customerId={this.state.customerId} />
                </TabPane>
                <TabPane tab="Payment methods" key="payment">
                  <PaymentList startDate={startDate} endDate={endDate} customerId={this.state.customerId} />
                </TabPane>
              </Tabs>
            </div>
            <Feedback />
          </Spin>
        </div>
        <div style={{ display: displayPage === 'editbasic' ? 'block' : 'none' }}>
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>
              <FormattedMessage id="consumer.consumerDetails" />
            </Breadcrumb.Item>
            <Breadcrumb.Item>Edit basic information</Breadcrumb.Item>
          </BreadCrumb>
          <div className="container-search">
            <BasicEdit customer={basic} />
          </div>
        </div>
      </>
    );
  }
}
