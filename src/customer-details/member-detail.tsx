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

const calcPetAge = (dateStr: string) => {
  const birthday = moment(dateStr, 'YYYY-MM-DD');
  const diffMonth = moment().diff(birthday, 'months');
  if (diffMonth <= 1) {
    return `${diffMonth} month`;
  } else if (diffMonth < 12) {
    return `${diffMonth} months`;
  } else {
    const diffYear = Math.floor(diffMonth / 12);
    const diffMonthAfterYear = diffMonth % 12;
    return `${diffYear} ${diffYear > 1 ? 'years' : 'year'} ${diffMonthAfterYear === 0 ? '' : `${diffMonthAfterYear} ${diffMonthAfterYear > 1 ? 'months' : 'month'}`}`;
  }
};

const calcPetOwnerAge = (dateStr: string) => {
  const birthday = moment(dateStr, 'YYYY-MM-DD');
  const diffYear = moment().diff(birthday, 'years');
  return diffYear > 1 ? `${diffYear} years old` : `${diffYear} year old`;
};

export default class CustomerDetails extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      displayPage: 'detail',
      customerId: this.props.match.params.id ? this.props.match.params.id : '',
      customerAccount: this.props.match.params.account ? this.props.match.params.account : '',
      activeKey: 'order',
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
            petOwnerTag: res.context.segmentList ? res.context.segmentList.map((t) => t.name) : []
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
    const { tagList } = this.state;
    webapi
      .setTagging({
        relationId: this.state.customerId,
        segmentIdList: tagList.filter((tag) => values.indexOf(tag.name) > -1 && tag.segmentType == 0).map((tag) => tag.id),
        segmentType: 0
      })
      .then(() => {});
    this.setState({
      petOwnerTag: values
    });
  };

  clickTabs = (key) => {
    this.setState({
      activeKey: key
    });
  };
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
          <Breadcrumb>
            <Breadcrumb.Item>
              <a href="/customer-list">Pet owner</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="/customer-list">Pet owner list</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Pet owner detail</Breadcrumb.Item>
          </Breadcrumb>
          {/*导航面包屑*/}
          <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
            <div className="detail-container">
              <Headline
                title="Basic information"
                extra={
                  <>
                    <Link to={`/edit-petowner/${this.state.customerId}/${this.state.customerAccount}`}>
                      <i className="iconfont iconDetails"></i> Detail
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
                  <Col span={4}>
                    <div style={{ paddingLeft: 19 }}>{basic.customerName}</div>
                  </Col>
                  <Col span={4}>
                    <div style={{ paddingLeft: 19 }}>{basic.birthDay ? calcPetOwnerAge(basic.birthDay) : ''}</div>
                  </Col>
                </Row>
              </div>
              <div className="basic-info-detail">
                <Row type="flex" align="middle">
                  <Col span={3} className="text-tip">
                    Registration date
                  </Col>
                  <Col span={6} className="text-highlight">
                    {basic.createTime ? moment(basic.createTime, 'YYYY-MM-DD').format('YYYY-MM-DD') : ''}
                  </Col>
                  <Col span={3} className="text-tip">
                    Email address
                  </Col>
                  <Col span={6} className="text-highlight">
                    {basic.email}
                  </Col>
                </Row>
                <Row type="flex" align="middle">
                  <Col span={3} className="text-tip">
                    Phone number
                  </Col>
                  <Col span={6} className="text-highlight">
                    {basic.contactPhone}
                  </Col>
                  <Col span={3} className="text-tip">
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
                  <Col span={3} className="text-tip">
                    Country
                  </Col>
                  <Col span={6} className="text-highlight">
                    {basic.country}
                  </Col>
                  <Col span={3} className="text-tip">
                    Address reference
                  </Col>
                  <Col span={6} className="text-highlight">
                    {basic.address1}
                  </Col>
                </Row>
                <Row>
                  <Col span={3} className="text-tip">
                    City
                  </Col>
                  <Col span={6} className="text-highlight">
                    {basic.city}
                  </Col>
                </Row>
                {/* <Row>
                  <Col span={3} className="text-tip">
                    Consent
                  </Col>
                  <Col span={20} className="text-highlight">
                    {basic.userConsentList && basic.userConsentList.length > 0 ? basic.userConsentList.map((consent, idx) => <div key={idx} dangerouslySetInnerHTML={{ __html: consent.consentTitle }}></div>) : null}
                  </Col>
                </Row> */}
              </div>
            </div>
            <div className="detail-container">
              <Headline title="Tagging" />
              <Row>
                <Col span={12}>
                  <div className="text-highlight">Tag name</div>
                  <div>
                    <Select style={{ width: '100%' }} value={this.state.petOwnerTag} mode="multiple" onChange={this.setPetOwnerTagging} getPopupContainer={(trigger: any) => trigger.parentNode}>
                      {this.state.tagList
                        .filter((item) => item.segmentType == 0)
                        .map((v, idx) => (
                          <Option value={v.name} key={v.id}>
                            {v.name}
                          </Option>
                        ))}
                    </Select>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="detail-container" id="pets-list">
              <Headline title="Pet information" />
              <Row gutter={16}>
                {pets.map((pet, idx) => (
                  <Col key={idx} span={8} style={{ margin: '10px 0' }}>
                    <Card bodyStyle={{ padding: '10px 20px' }}>
                      <div className="text-align-right">
                        {/* <Popconfirm placement="topRight" title="Are you sure to remove this item?" onConfirm={() => {}} okText="Confirm" cancelText="Cancel">
                          <Button type="link">
                            <span className="iconfont iconDelete"></span> Delete
                          </Button>
                        </Popconfirm> */}
                        <Link to={`/edit-pet/${this.state.customerId}/${this.state.customerAccount}/${pet.petsId}`}>
                          <span className="iconfont iconDetails"></span> Detail
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
                            <Col span={12}>{pet.birthOfPets ? calcPetAge(pet.birthOfPets) : ''}</Col>
                            <Col span={12}>
                              {pet.petsBreed && (
                                <Tooltip title={pet.petsBreed}>
                                  <div style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{pet.petsBreed}</div>
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
              <Headline
                title="Other information"
                extra={<RangePicker style={{ display: ['order', 'subscrib'].indexOf(this.state.activeKey) > -1 ? 'block' : 'none' }} allowClear={false} defaultValue={[moment().subtract(3, 'months'), moment()]} onChange={this.handleChangeDateRange} getCalendarContainer={() => document.getElementById('page-content')} />}
              />
              <Tabs activeKey={this.state.activeKey} onChange={this.clickTabs}>
                <TabPane tab="Order information" key="order">
                  <OrderInformation startDate={startDate} endDate={endDate} customerId={this.state.customerId} />
                </TabPane>
                <TabPane tab="Subscription information" key="subscrib">
                  <SubscribInformation startDate={startDate} endDate={endDate} customerAccount={this.state.customerAccount} />
                </TabPane>
                <TabPane tab="Prescriber information" key="prescrib">
                  <PrescribInformation customerAccount={this.state.customerAccount} />
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
          <Breadcrumb>
            <Breadcrumb.Item>
              <a href="/customer-list">Pet owner</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="/customer-list">Pet owner list</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  this.backToDetail();
                }}
              >
                Pet owner detail
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{addressType === 'delivery' ? 'Delivery information' : 'Billing information'}</Breadcrumb.Item>
          </Breadcrumb>
          <DeliveryItem customerId={this.state.customerId} delivery={delivery} addressType={addressType} backToDetail={this.backToDetail} />
        </div>
      </>
    );
  }
}
