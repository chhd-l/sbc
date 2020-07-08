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
  DatePicker
} from 'antd';
import { StoreProvider } from 'plume2';
import AppStore from './store';

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
      frequencyList: []
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
      frequencyList
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
    const cartExtra = (
      <div className="cart-extra">
        <span>Order Status:</span>
        <span className="order-status">{orderInfo.orderStatus}</span>
        <span style={{ margin: '0 10px' }}>Recent Order:</span>
        <Dropdown overlay={menu} trigger={['click']}>
          <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
            {orderInfo.recentOrder}
            <Icon type="down" style={{ margin: '0 5px' }} />
          </a>
        </Dropdown>
      </div>
    );

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
          extra={cartExtra}
          style={{ margin: 20 }}
        >
          {/* subscription 基本信息 */}
          <Row className="subscription-basic-info">
            <Col span={24} className="status-operate">
              <span style={{ fontSize: '16px', color: '#3DB014' }}>
                {subscriptionInfo.subscriptionStatus}
              </span>
              <div style={{ marginRight: 40 }}>
                <Button type="link" style={{ fontSize: 18 }}>
                  Skip this order
                </Button>
                <Button type="link" style={{ fontSize: 18 }}>
                  Cancel All
                </Button>
              </div>
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
          <Row style={{ marginTop: 20 }}>
            <Col span={8}>
              <InputGroup compact>
                <Input
                  style={{ width: '30%', textAlign: 'center' }}
                  defaultValue="Frequency"
                  disabled
                />
                <Select style={{ width: '50%' }}>
                  {frequencyList.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </InputGroup>
            </Col>
            <Col span={8} offset={3}>
              <InputGroup compact>
                <Input
                  style={{ width: '30%', textAlign: 'center' }}
                  defaultValue="Next Received Date"
                  disabled
                />
                <DatePicker style={{ width: '50%' }} />
              </InputGroup>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}
