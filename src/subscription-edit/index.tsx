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
  InputNumber
} from 'antd';
import { StoreProvider } from 'plume2';

import { Headline, BreadCrumb, SelectGroup } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import './index.less';
import * as webapi from './webapi';

const InputGroup = Input.Group;
const { Option } = Select;
/**
 * 订单详情
 */
export default class SubscriptionDetail extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      pageType: 'Edit',
      orderInfo: {
        orderTimes: 1,
        recentOrder: 'O123456234',
        orderStatus: 'Not Yet Shipped'
      },
      subscriptionInfo: {
        subscriptionStatus: 'Active',
        subscriptionNumber: 'S202007071782774',
        subscriptionTime: '2020-07-07 17:56:25',
        presciberID: '1758',
        presciberName: 'CLINICA EL FAISAN',
        consumer: 'ILIANA ROMO MANZANO',
        consumerAccount: 'ilia****.com',
        consumerType: 'Member',
        phoneNumber: '57797287'
      },
      recentOrderList: [
        {
          id: '001',
          orderNumber: 'O123456234'
        }
      ],
      frequencyList: [],
      subscriptionData: [],
      petInfo: {
        breed: 'xxx',
        petName: 'Rita',
        petType: 'cat',
        petBirthday: '2018/12/12'
      }
    };
  }

  componentDidMount() {
    this.querySysDictionary('Frequency');
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

  render() {
    const {
      orderInfo,
      recentOrderList,
      subscriptionInfo,
      frequencyList,
      subscriptionData,
      petInfo
    } = this.state;
    const cartTitle = (
      <div className="cart-title">
        <span>Subscription</span>
        <span className="order-time">{'#' + orderInfo.orderTimes}</span>
      </div>
    );
    const menu = (
      <Menu>
        {recentOrderList.map((item) => (
          <Menu.Item key={item.id}>{item.orderNumber}</Menu.Item>
        ))}
      </Menu>
    );
    // const cartExtra = (
    //   <Button type="link" className="underline-button" style={{fontSize:16,}}>Skip Next Dilivery</Button>
    // );
    const columns = [
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Product</span>
        ),
        dataIndex: 'Product',
        key: 'Product',
        render: (text, record) => (
          <div>
            <img src={record.img} alt="" />
            <span>{text}</span>
          </div>
        )
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Price</span>,
        dataIndex: 'Price',
        key: 'Price',
        render: (text, record) => (
          <div>
            <span style={{ textDecoration: 'line-through' }}>{text}</span>
            <span>{text}</span>
          </div>
        )
      },
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Quantity</span>
        ),
        dataIndex: 'Quantity',
        key: 'Quantity',
        render: (text, record) => (
          <div>
            <InputNumber min={1} max={100} defaultValue={3} />
          </div>
        )
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Total</span>,
        dataIndex: 'Total',
        key: 'Total',
        render: (text, record) => (
          <div>
            <span>${text}</span>
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

    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>
            {<FormattedMessage id="subscription.detail" />}
          </Breadcrumb.Item>
        </BreadCrumb>
        <Card
          title={cartTitle}
          bordered={false}
          // extra={cartExtra}
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
                    {orderInfo.recentOrder + '(' + orderInfo.orderStatus + ')'}
                    <Icon type="down" style={{ margin: '0 5px' }} />
                  </a>
                </Dropdown>
              </div>
            </Col>
            <Col span={8}>
              <div className="previous-order-info">
                <p>Frequency</p>
                <p>4 Weeks</p>
              </div>
            </Col>
            <Col span={8}>
              <div className="previous-order-info">
                <p>Next order date</p>
                <p>June, 23rd</p>
              </div>
            </Col>
          </Row>
          {/* subscription 和 total */}
          <Row style={{ marginTop: 20 }} gutter={16}>
            <Col span={16}>
              <Table columns={columns} dataSource={subscriptionData}></Table>
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
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                </div>
              </Card>
              <div className="order-summary-total flex-between">
                <span>Total (Inclu IVA):</span>
                <span>$0</span>
              </div>
              <Row style={{ marginTop: 20 }}>
                <Col span={16}>
                  <Input placeholder="Promotional code" />
                </Col>
                <Col span={8}>
                  <Button style={{ marginLeft: 20 }} type="primary">
                    Apply
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className="consumer-info" style={{ marginTop: 20 }}>
            <Col span={12}>
              <Row>
                <Col span={12}>
                  <label className="info-title">Pet Infomation</label>
                </Col>
                <Col span={12}>
                  <Button type="link" className="underline-button">
                    Change
                  </Button>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Pet Name: </p>
                  <p>{petInfo.petName}</p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Pet Type: </p>
                  <p>{petInfo.petType}</p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Pet Birthday: </p>
                  <p>{petInfo.petBirthday}</p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Breed: </p>
                  <p>{petInfo.breed}</p>
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
                  <p>{petInfo.breed}</p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Card Number: </p>
                  <p>{petInfo.breed}</p>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="consumer-info">
            <Col span={12}>
              <Row>
                <Col span={12}>
                  <label className="info-title">Shipping Address</label>
                </Col>
                <Col span={12}>
                  <Button type="link" className="underline-button">
                    Change
                  </Button>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Country: </p>
                  <p>{petInfo.breed}</p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>City: </p>
                  <p>{petInfo.breed}</p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Address1: </p>
                  <p>{petInfo.breed}</p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Address1: </p>
                  <p>{petInfo.breed}</p>
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row>
                <Col span={12}>
                  <label className="info-title">Billing Address</label>
                </Col>
                <Col span={12}>
                  <Button type="link" className="underline-button">
                    Change
                  </Button>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Country: </p>
                  <p>{petInfo.breed}</p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>City: </p>
                  <p>{petInfo.breed}</p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Address1: </p>
                  <p>{petInfo.breed}</p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Address1: </p>
                  <p>{petInfo.breed}</p>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}
