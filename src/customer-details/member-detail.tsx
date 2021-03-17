import React from 'react';
import { Form, Card, Avatar, Input, InputNumber, DatePicker, Button, Select, message, Table, Row, Col, Breadcrumb, Modal, Popconfirm, Icon, Tooltip } from 'antd';
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
import DeliveryItem from './component/delivery-item';
import PaymentList from './component/payment-list';
import { getTaggingList } from './component/webapi';

import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const { Column } = Table;
const { confirm } = Modal;

const dogImg = require('./img/dog.png');
const catImg = require('./img/cat.png');

export default class CustomerDetails extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      displayPage: 'detail',
      customerId: this.props.match.params.id ? this.props.match.params.id : '',
      customerAccount: this.props.match.params.account ? this.props.match.params.account : '',
      loading: false,
      tagList: [],
      basic: {},
      petOwnerTag: [],
      pets: [],
      delivery: {},
      addressType: 'delivery',
      startDate: moment().subtract(3, 'months').format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD')
    };
  }
  componentDidMount() {
    this.getBasicInformation();
    this.getPetsList();
    this.getTagList();
    if (this.props.location.query && this.props.location.query.hash) {
      document.getElementById('page-content').scrollTo(0, document.getElementById(this.props.location.query.hash).offsetTop + 40);
    }
  }

  getBasicInformation = () => {
    this.setState({ loading: true });
    webapi
      .getBasicDetails(this.state.customerId)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            loading: false,
            basic: {
              ...res.context,
              customerAccount: this.state.customerAccount
            },
            petOwnerTag: res.context.segmentList ? res.context.segmentList.map((t) => t.id) : []
          });
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  getPetsList = () => {
    const { customerAccount } = this.state;
    webapi.petsByConsumer({ consumerAccount: customerAccount }).then((data) => {
      this.setState({
        pets: data.res.context.context
      });
    });
  };

  getTagList = () => {
    getTaggingList().then((data) => {
      this.setState({
        tagList: data.res.context.segmentList
      });
    });
  };

  setPetOwnerTagging = (values) => {
    webapi
      .setTagging({
        relationId: this.state.customerId,
        segmentIdList: values,
        segmentType: 0
      })
      .then(() => {});
    this.setState({
      petOwnerTag: values
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
        if (data.res.code === Const.SUCCESS_CODE) {
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

  handleDeletePet = (petsId: string) => {
    this.setState({ loading: true });
    webapi
      .delPets({ petsIds: [petsId] })
      .then((data) => {
        message.success(data.res.message);
        this.setState(
          {
            loading: false
          },
          () => {
            this.getPetsList();
          }
        );
      })
      .catch(() => {
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

  openDeliveryPage = (addressType, delivery) => {
    this.setState({
      displayPage: 'delivery',
      addressType: addressType,
      delivery: delivery
    });
  };

  backToDetail = () => {
    this.changeDisplayPage('detail');
  };

  changeDisplayPage = (page: string) => {
    this.setState(
      {
        displayPage: page
      },
      () => {
        document.getElementById('page-content').scrollTop = 0;
      }
    );
  };

  render() {
    const { displayPage, basic, pets, delivery, addressType, startDate, endDate } = this.state;
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
                  <>
                    <Link to={`/edit-petowner/${this.state.customerId}/${this.state.customerAccount}`}>
                      <i className="iconfont iconEdit"></i> Edit
                    </Link>
                    <Link to={`/pet-owner-activity/${this.state.customerId}`} style={{ marginLeft: '20px' }}>
                      <i className="iconfont iconfenxiang"></i> Overview
                    </Link>
                  </>
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
                    {/* <Popconfirm placement="topRight" title="Are you sure to remove this item?" onConfirm={() => this.removeConsumer(this.state.customerId)} okText="Confirm" cancelText="Cancel">
                      <Button type="link">
                        <FormattedMessage id="consumer.removeConsumer" />
                      </Button>
                    </Popconfirm> */}
                  </Col>
                </Row>
                <Row className="text-highlight" style={{ marginTop: 5 }}>
                  <Col span={4}>{basic.customerName}</Col>
                  <Col span={4}>{basic.birthDay ? moment().diff(moment(basic.birthDay, 'YYYY-MM-DD'), 'years') : ''}</Col>
                </Row>
              </div>
              <div className="basic-info-detail">
                <Row type="flex" align="middle">
                  <Col span={4} className="text-tip">
                    Registration date
                  </Col>
                  <Col span={6} className="text-highlight">
                    {moment(basic.createTime, 'YYYY-MM-DD').format('YYYY-MM-DD')}
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
                    {['Email', 'Phone']
                      .reduce((prev, curr) => {
                        if (+basic[`communication${curr}`]) {
                          prev.push(curr);
                        }
                        return prev;
                      }, [])
                      .join(' ')}
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
                    {basic.address1}
                  </Col>
                </Row>
                <Row>
                  <Col span={4} className="text-tip">
                    Consent
                  </Col>
                  <Col span={6} className="text-highlight">
                    {basic.userConsentList && basic.userConsentList.length > 0 ? basic.userConsentList.map((consent, idx) => <div key={idx} dangerouslySetInnerHTML={{ __html: consent.consentTitle }}></div>) : null}
                  </Col>
                  <Col span={4} className="text-tip">
                    City
                  </Col>
                  <Col span={6} className="text-highlight">
                    {basic.city}
                  </Col>
                </Row>
              </div>
            </div>
            <div className="detail-container">
              <Headline title="Tagging" />
              <Row>
                <Col span={20}>
                  <Form layout="vertical">
                    <FormItem label="Tag name">
                      <Select value={this.state.petOwnerTag} mode="multiple" onChange={this.setPetOwnerTagging}>
                        {this.state.tagList
                          .filter((item) => item.segmentType == 0)
                          .map((v, idx) => (
                            <Option value={v.id} key={idx}>
                              {v.name}
                            </Option>
                          ))}
                      </Select>
                    </FormItem>
                  </Form>
                </Col>
              </Row>
            </div>
            <div className="detail-container" id="pets-list">
              <Headline title="Pet information" />
              <Row gutter={16}>
                {pets.map((pet) => (
                  <Col span={8} style={{ margin: '10px 0' }}>
                    <Card bodyStyle={{ padding: '10px 20px' }}>
                      <div className="text-align-right">
                        {/* <Popconfirm placement="topRight" title="Are you sure to remove this item?" onConfirm={() => {}} okText="Confirm" cancelText="Cancel">
                          <Button type="link">
                            <span className="iconfont iconDelete"></span> Delete
                          </Button>
                        </Popconfirm> */}
                        <Link to={`/edit-pet/${pet.petsId}`}>
                          <span className="iconfont iconEdit"></span> Edit
                        </Link>
                      </div>
                      <Row gutter={10}>
                        <Col span={6}>
                          <Avatar size={70} src={pet.petsImg && pet.petsImg.startsWith('http') ? pet.petsImg : pet.petsType === 'dog' ? dogImg : catImg} />
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
                            <Col span={12}>{pet.birthOfPets && `${moment().diff(moment(pet.birthOfPets, 'YYYY-MM-DD'), 'months')} months`}</Col>
                            <Col span={12}>
                              {pet.petsBreed && (
                                <Tooltip title={pet.petsBreed}>
                                  <div style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} title={pet.petsBreed}>
                                    {pet.petsBreed}
                                  </div>
                                </Tooltip>
                              )}
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
                {pets.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <span>
                      <FormattedMessage id="noData" />
                    </span>
                  </div>
                )}
              </Row>
            </div>
            <div className="container">
              <Headline title="Other information" extra={<RangePicker defaultValue={[moment().subtract(3, 'months'), moment()]} onChange={this.handleChangeDateRange} />} />
              <Tabs defaultActiveKey="order" onChange={this.clickTabs}>
                <TabPane tab="Order information" key="order">
                  <OrderInformation startDate={startDate} endDate={endDate} customerAccount={this.state.customerAccount} />
                </TabPane>
                <TabPane tab="Subscription information" key="subscrib">
                  <SubscribInformation startDate={startDate} endDate={endDate} customerAccount={this.state.customerAccount} />
                </TabPane>
                <TabPane tab="Prescriber information" key="prescrib">
                  <PrescribInformation startDate={startDate} endDate={endDate} customerAccount={this.state.customerAccount} />
                </TabPane>
                <TabPane tab="Delivery information" key="delivery">
                  {displayPage === 'detail' && <DeliveryList customerId={this.state.customerId} type="DELIVERY" onEdit={(record) => this.openDeliveryPage('delivery', record)} />}
                </TabPane>
                <TabPane tab="Billing information" key="billing">
                  {displayPage === 'detail' && <DeliveryList customerId={this.state.customerId} type="BILLING" onEdit={(record) => this.openDeliveryPage('billing', record)} />}
                </TabPane>
                <TabPane tab="Payment methods" key="payment">
                  <PaymentList customerId={this.state.customerId} />
                </TabPane>
              </Tabs>
            </div>
          </Spin>
        </div>
        <div style={{ display: displayPage === 'delivery' ? 'block' : 'none' }}>
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>
              <FormattedMessage id="consumer.consumerDetails" />
            </Breadcrumb.Item>
            <Breadcrumb.Item>{addressType === 'delivery' ? 'Delivery information' : 'Billing information'}</Breadcrumb.Item>
          </BreadCrumb>
          <DeliveryItem customerId={this.state.customerId} delivery={delivery} addressType={addressType} backToDetail={this.backToDetail} />
        </div>
      </>
    );
  }
}
