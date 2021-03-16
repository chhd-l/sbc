import React from 'react';
import { Form, Input, InputNumber, Button, Select, message, Table, Row, Col, Breadcrumb, Modal, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './webapi';
import { Tabs, Spin } from 'antd';
import { FormattedMessage } from 'react-intl';
import { history } from 'qmkit';
import BasicInfomation from './component/basic-infomation';
import PetInfomation from './component/pet-infomation';
import DeliveryInformation from './component/delivery-information';
import BillingInfomation from './component/billing-infomation';
import PaymentInfo from './component/payment-infomation';

const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

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
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/customer-list">Pet owner</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="/customer-list">Pet owner list</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <FormattedMessage id="consumer.consumerDetails" />
          </Breadcrumb.Item>
        </Breadcrumb>
        {/*导航面包屑*/}
        <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
          <div className="container">
            {this.state.customerType !== 'Guest' ? (
              <Tabs
                defaultActiveKey="basic"
                onChange={this.clickTabs}
                tabBarExtraContent={
                  <Popconfirm placement="topRight" title="Are you sure to remove this item?" onConfirm={() => this.removeConsumer(this.state.customerId)} okText="Confirm" cancelText="Cancel">
                    <Button type="link">
                      <FormattedMessage id="consumer.removeConsumer" />
                    </Button>
                  </Popconfirm>
                }
              >
                <TabPane tab="Basic information" key="basic">
                  <BasicInfomation customerId={this.state.customerId}></BasicInfomation>
                </TabPane>
                <TabPane tab="Pet information" key="pet">
                  <PetInfomation customerId={this.state.customerId} customerAccount={this.state.customerAccount}></PetInfomation>
                </TabPane>
                <TabPane tab="Delivery information" key="delivery">
                  <DeliveryInformation customerId={this.state.customerId}></DeliveryInformation>
                </TabPane>
                <TabPane tab="Billing information" key="billing">
                  <BillingInfomation customerId={this.state.customerId}></BillingInfomation>
                </TabPane>
                <TabPane tab="Payment methods" key="payment">
                  <PaymentInfo customerId={this.state.customerId}></PaymentInfo>
                </TabPane>
              </Tabs>
            ) : (
              <Tabs defaultActiveKey="delivery" onChange={this.clickTabs}>
                <TabPane tab="Delivery information" key="vistor-delivery">
                  <DeliveryInformation customerId={this.state.customerId} customerType="Guest"></DeliveryInformation>
                </TabPane>
                <TabPane tab="Billing information" key="vistor-billing">
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
