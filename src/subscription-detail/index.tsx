import React from 'react';
import {
  Breadcrumb,
  Tabs,
  Card,
  Dropdown,
  Icon,
  Menu,
  Row,
  Col,
  Button,
  Input,
  Select,
  message,
  DatePicker,
  Table,
  InputNumber,
  Modal,
  Popconfirm,
  Radio,
  Collapse
} from 'antd';
import { StoreProvider } from 'plume2';
import { Link } from 'react-router-dom';

import { Headline, BreadCrumb, SelectGroup, Const } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import './index.less';
import * as webapi from './webapi';
const Panel = Collapse.Panel;

import moment from 'moment';

const InputGroup = Input.Group;
const { Option } = Select;
/**
 * 订单详情
 */
export default class SubscriptionDetail extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      pageType: 'Details',
      subscriptionId: this.props.match.params.subId,
      loading: true,
      orderInfo: {},
      subscriptionInfo: {},
      recentOrderList: [],
      frequencyList: [],
      goodsInfo: [],
      petsId: '',
      petsInfo: {
        breed: 'xxx',
        petName: 'Rita',
        petType: 'cat',
        petBirthday: '2018/12/12'
      },
      paymentInfo: {},
      deliveryAddressId: '',
      deliveryAddressInfo: {},
      billingAddressId: '',
      billingAddressInfo: {}
    };
  }

  componentDidMount() {
    this.querySysDictionary('Frequency');
    this.getSubscriptionDetail(this.state.subscriptionId);
  }

  //查询frequency
  querySysDictionary = (type: String) => {
    webapi
      .querySysDictionary({ type: type })
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          this.setState({
            frequencyList: res.context.sysDictionaryVOS
          });
        } else {
          message.error('Unsuccessful');
        }
      })
      .catch((err) => {
        message.error('Unsuccessful');
      });
  };

  getSubscriptionDetail = (id: String) => {
    webapi.getSubscriptionDetail(id).then((data) => {
      const { res } = data;
      if (res.code === 'K-000000') {
        let subscriptionDetail = res.context;
        let subscriptionInfo = {
          deliveryTimes: subscriptionDetail.deliveryTimes,
          subscriptionStatus:
            subscriptionDetail.subscribeStatus === '0' ? 'Active' : 'Inactive',
          subscriptionNumber: subscriptionDetail.subscribeId,
          subscriptionTime: subscriptionDetail.createTime,
          presciberID: subscriptionDetail.prescriberId,
          presciberName: subscriptionDetail.prescriberName,
          consumer: subscriptionDetail.customerName,
          consumerAccount: subscriptionDetail.customerAccount,
          consumerType: subscriptionDetail.customerType,
          phoneNumber: subscriptionDetail.customerPhone,
          frequency: subscriptionDetail.cycleTypeId,
          frequencyName: subscriptionDetail.frequency,
          nextDeliveryTime: subscriptionDetail.nextDeliveryTime,
          promotionCode: subscriptionDetail.promotionCode
        };
        let orderInfo = {
          recentOrderId: subscriptionDetail.trades[0].id,
          orderStatus: subscriptionDetail.trades[0].tradeState.deliverStatus
        };
        let recentOrderList = [];
        for (let i = 0; i < subscriptionDetail.trades.length; i++) {
          let recentOrder = {
            recentOrderId: subscriptionDetail.trades[i].id,
            orderStatus: subscriptionDetail.trades[i].tradeState.deliverStatus
          };
          recentOrderList.push(recentOrder);
        }

        let goodsInfo = subscriptionDetail.goodsInfo;
        let paymentInfo = subscriptionDetail.paymentInfo;
        this.setState(
          {
            subscriptionInfo: subscriptionInfo,
            orderInfo: orderInfo,
            recentOrderList: recentOrderList,
            goodsInfo: goodsInfo,
            paymentInfo: paymentInfo,
            petsId: subscriptionDetail.petsId,
            deliveryAddressId: subscriptionDetail.deliveryAddressId,
            billingAddressId: subscriptionDetail.billingAddressId,
            loading: false
          },
          () => {
            this.petsById(this.state.petsId);
          }
        );
      }
      console.log(data);
    });
  };
  skipNextDelivery = (id: String) => {
    this.setState({
      loading: true
    });
    webapi
      .cancelNextSubscription({ subscribeId: id })
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          this.getSubscriptionDetail(this.state.subscriptionId);
          message.success('Successful');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.success('Unsuccessful');
      });
  };

  petsById = (id) => {
    let params = {
      petsId: id
    };
    webapi
      .petsById(params)
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          let petsInfo = res.context.context;
          this.setState({
            petsInfo: petsInfo
          });
        } else {
          message.error(res.message || 'Unsuccessful');
        }
      })
      .catch((err) => {
        message.error('Unsuccessful');
      });
  };

  render() {
    const {
      orderInfo,
      recentOrderList,
      subscriptionInfo,
      frequencyList,
      goodsInfo,
      petsInfo,
      paymentInfo,
      deliveryAddressInfo,
      billingAddressInfo
    } = this.state;
    const cartTitle = (
      <div className="cart-title">
        <span>Subscription</span>
        <span className="order-time">
          {'#' + subscriptionInfo.deliveryTimes}
        </span>
      </div>
    );
    const menu = (
      <Menu>
        {recentOrderList.map((item) => (
          <Menu.Item key={item.recentOrderId}>{item.recentOrderId}</Menu.Item>
        ))}
      </Menu>
    );
    const cartExtra = (
      <Popconfirm
        placement="topRight"
        title="Are you sure skip next dilivery?"
        onConfirm={() =>
          this.skipNextDelivery(subscriptionInfo.subscriptionNumber)
        }
        okText="Confirm"
        cancelText="Cancel"
      >
        <Button type="link" style={{ fontSize: 16 }}>
          Skip Next Dilivery
        </Button>
      </Popconfirm>
    );
    const columns = [
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Product</span>
        ),
        key: 'Product',
        width: '40%',
        render: (text, record) => (
          <div style={{ display: 'flex' }}>
            <img src={record.goodsPic} style={{ width: 100 }} alt="" />
            <span style={{ margin: 'auto 0' }}>{record.goodsName}</span>
          </div>
        )
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Price</span>,
        key: 'Price',
        width: '15%',
        render: (text, record) => (
          <div>
            <p style={{ textDecoration: 'line-through' }}>
              ${record.originalPrice}
            </p>
            <p>${record.subscribePrice}</p>
          </div>
        )
      },
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Quantity</span>
        ),
        dataIndex: 'subscribeNum',
        key: 'subscribeNum',
        width: '15%'
        // render: (text, record) => (
        //   <div>
        //     <InputNumber min={1} max={100} value={record.subscribeNum} />
        //   </div>
        // )
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Total</span>,
        dataIndex: 'Total',
        key: 'Total',
        width: '15%',
        render: (text, record) => (
          <div>
            <span>${+record.subscribeNum * +record.subscribePrice}</span>
          </div>
        )
      }
    ];
    const totalCartTitleStyle = {
      background: '#fafafa',
      borderBottom: '2px solid #D7D7D7',
      color: '#8E8E8E',
      fontWeight: 500
    };

    enum operatorDic {
      PLATFORM = 'Platform',
      CUSTOMER = 'Customer',
      SUPPLIER = 'Supplier'
    }

    const operatorColumns = [
      {
        title: 'Operator Type',
        dataIndex: 'operator.platform',
        key: 'operator.platform',
        render: (val) => `${operatorDic[val]}`
      },
      {
        title: 'Operator',
        dataIndex: 'operator.name',
        key: 'operator.name'
      },
      {
        title: 'Time',
        dataIndex: 'eventTime',
        key: 'eventTime',
        render: (time) =>
          time &&
          moment(time)
            .format(Const.TIME_FORMAT)
            .toString()
      },
      {
        title: 'Operation Category',
        dataIndex: 'eventType',
        key: 'eventType'
      },
      {
        title: 'Operation Log',
        dataIndex: 'eventDetail',
        key: 'eventDetail',
        width: '50%'
      }
    ];

    const styles = {
      backItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 10,
        marginBottom: 20
      }
    } as any;

    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>
            {<FormattedMessage id="subscription.detail" />}
          </Breadcrumb.Item>
        </BreadCrumb>
        <Card
          loading={this.state.loading}
          title={cartTitle}
          bordered={false}
          extra={cartExtra}
          style={{ margin: 20 }}
        >
          {/* subscription 基本信息 */}
          <Row className="subscription-basic-info">
            <Col span={24}>
              <span style={{ fontSize: '16px', color: '#3DB014' }}>
                {subscriptionInfo.subscriptionStatus}
              </span>
            </Col>
            <Col span={11} className="basic-info">
              <p>
                Subscription Number :{' '}
                <span>{subscriptionInfo.subscriptionNumber}</span>
              </p>
              <p>
                Subscription Time :
                <span>{subscriptionInfo.subscriptionTime}</span>
              </p>
              <p>
                Presciber ID : <span>{subscriptionInfo.presciberID}</span>
              </p>
              <p>
                Presciber Name : <span>{subscriptionInfo.presciberName}</span>
              </p>
            </Col>
            <Col span={11} className="basic-info">
              <p>
                Consumer : <span>{subscriptionInfo.consumer}</span>
              </p>
              <p>
                Consumer Account :{' '}
                <span>{subscriptionInfo.consumerAccount}</span>
              </p>
              <p>
                Consumer Type : <span>{subscriptionInfo.consumerType}</span>
              </p>
              <p>
                Phone Number : <span>{subscriptionInfo.phoneNumber}</span>
              </p>
            </Col>
          </Row>

          {/* 订阅频率，配送日期修改 */}
          <Row style={{ marginTop: 20 }} gutter={16}>
            <Col span={8}>
              <div className="previous-order-info">
                <p>Previous Orders</p>
                <Dropdown overlay={menu} trigger={['click']}>
                  <a
                    className="ant-dropdown-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    {orderInfo.recentOrderId +
                      '(' +
                      orderInfo.orderStatus +
                      ')'}
                    <Icon type="down" style={{ margin: '0 5px' }} />
                  </a>
                </Dropdown>
              </div>
            </Col>
            <Col span={8}>
              <div className="previous-order-info">
                <p>Frequency</p>
                <p style={{ color: '#808285' }}>
                  {subscriptionInfo.frequencyName}
                </p>
                {/* <Select style={{ width: '50%' }} value={subscriptionInfo.frequency}>
                  {frequencyList.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select> */}
              </div>
            </Col>
            <Col span={8}>
              <div className="previous-order-info">
                <p>Next order date</p>
                <p style={{ color: '#808285' }}>
                  {subscriptionInfo.nextDeliveryTime}
                </p>
                {/* <DatePicker value={subscriptionInfo.nextDeliveryTime} format={'MMMM Do YY'} style={{ width: '50%' }} /> */}
              </div>
            </Col>
          </Row>
          {/* subscription 和 total */}
          <Row style={{ marginTop: 20 }} gutter={16}>
            <Col span={16}>
              <Table
                columns={columns}
                dataSource={goodsInfo}
                pagination={false}
              ></Table>
            </Col>
            <Col span={8}>
              <Card
                title="Order Summary"
                style={{ border: '1px solid #D7D7D7' }}
                headStyle={totalCartTitleStyle}
                bodyStyle={{ background: '#fafafa' }}
              >
                <div className="order-summary-content">
                  <div className="flex-between">
                    <span>Total</span>
                    <span>$123</span>
                  </div>
                  <div className="flex-between">
                    <span>Subscription Save Discount</span>
                    <span>-$12</span>
                  </div>
                  <div className="flex-between">
                    <span>Promotion Code</span>
                    <span>{subscriptionInfo.promotionCode}</span>
                  </div>
                  <div className="flex-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                </div>
              </Card>
              <div className="order-summary-total flex-between">
                <span>Total (Inclu IVA):</span>
                <span>$0</span>
              </div>
              {/* <Row style={{ marginTop: 20 }}>
                <Col span={16}>
                  <Input placeholder="Promotional code" />
                </Col>
                <Col span={8}>
                  <Button style={{ marginLeft: 20 }} type="primary">
                    Apply
                  </Button>
                </Col>
              </Row> */}
            </Col>
          </Row>

          <Row className="consumer-info" style={{ marginTop: 20 }}>
            <Col span={12}>
              <Row>
                <Col span={12}>
                  <label className="info-title">Pet Infomation</label>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Pet Name: </p>
                  <p>{petsInfo.petsName}</p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Pet Type: </p>
                  <p>{petsInfo.petsType}</p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Pet Birthday: </p>
                  <p>{petsInfo.birthOfPets}</p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Breed: </p>
                  <p>{petsInfo.petsBreed}</p>
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row>
                <Col span={18}>
                  <label className="info-title">Payment Method</label>
                </Col>

                <Col span={18}>
                  <p style={{ width: 140 }}>Payment Method: </p>
                  <p>{paymentInfo.vendor}</p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Card Number: </p>
                  <p>{paymentInfo.cardNumber}</p>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="consumer-info">
            <Col span={12}>
              <Row>
                <Col span={12}>
                  <label className="info-title">Delivery Address</label>
                </Col>

                <Col span={18}>
                  <p style={{ width: 140 }}>Country: </p>
                  <p>{petsInfo.breed}</p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>City: </p>
                  <p>{petsInfo.breed}</p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Address1: </p>
                  <p>{petsInfo.breed}</p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Address1: </p>
                  <p>{petsInfo.breed}</p>
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row>
                <Col span={12}>
                  <label className="info-title">Billing Address</label>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Country: </p>
                  <p>{petsInfo.breed}</p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>City: </p>
                  <p>{petsInfo.breed}</p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Address1: </p>
                  <p>{petsInfo.breed}</p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Address1: </p>
                  <p>{petsInfo.breed}</p>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row style={styles.backItem}>
            <Collapse>
              <Panel
                header={<FormattedMessage id="operationLog" />}
                key="1"
                style={{ paddingRight: 10 }}
              >
                <Row>
                  <Col span={24}>
                    <Table
                      // rowKey={(_record, index) => index.toString()}
                      columns={operatorColumns}
                      // dataSource={log.toJS()}
                      pagination={false}
                      bordered
                    />
                  </Col>
                </Row>
              </Panel>
            </Collapse>
          </Row>
        </Card>

        <div className="bar-button">
          <Button type="primary" onClick={() => (history as any).go(-1)}>
            {<FormattedMessage id="back" />}
          </Button>
        </div>
      </div>
    );
  }
}
