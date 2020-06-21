import React, { Component } from 'react';
import { Table, Divider, Row, Col } from 'antd';
import { WMChart } from 'biz';
import { getClinicById } from './../../prescriber-add/webapi';
import { cache } from 'qmkit';
import * as webapi from './../webapi';

const prescriberLog = require('./../images/Prescriber.png');

const tradeColumns = [
  {
    title: 'date',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: 'Order number',
    dataIndex: 'orderCount',
    key: 'orderCount'
  },
  {
    title: 'Order amount',
    dataIndex: 'orderAmt',
    render: (_text, record) => '￥' + (record.orderAmt || 0).toFixed(2),
    key: 'orderAmt'
  },
  {
    title: 'Number of payment orders',
    dataIndex: 'payOrderCount',
    key: 'payOrderCount'
  },
  {
    title: 'Payment amount',
    dataIndex: 'payOrderAmt',
    render: (_text, record) => '￥' + (record.payOrderAmt || 0).toFixed(2),
    key: 'payOrderAmt'
  }
];

const customerColumns = [
  {
    title: 'date',
    dataIndex: 'baseDate',
    key: 'baseDate'
  },
  {
    title: 'Consumer total number',
    dataIndex: 'cusAllCount',
    key: 'cusAllCount'
  },
  {
    title: 'New consumer  number',
    dataIndex: 'cusDayGrowthCount',
    key: 'cusDayGrowthCount'
  }
];

export default class homePrescriber extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      tradeInfo: {},
      prescriber: {},
      tradeData: [],
      flowTrendData: [],
      customerData: [],
      customerGrowTrendData: []
    };
    this.getPrescriberDetail = this.getPrescriberDetail.bind(this);
    this.getPrescribersData = this.getPrescribersData.bind(this);
    this.getTradeData = this.getTradeData.bind(this);
    this.getFlowTrendData = this.getFlowTrendData.bind(this);
    this.getCustomerData = this.getPrescriberDetail.bind(this);
    this.getCustomerGrowTrendData = this.getCustomerGrowTrendData.bind(this);
    this.getPrescriberDetail();
    this.getPrescribersData();
    this.getTradeData();
    this.getFlowTrendData();
    this.getCustomerData();
    this.getCustomerGrowTrendData();
  }

  getPrescriberDetail = async () => {
    let employee = JSON.parse(sessionStorage.getItem(cache.EMPLOYEE_DATA));
    if (employee.clinicsId) {
      const { res } = await getClinicById({
        prescriberId: employee.clinicsId
      });
      if (res.code === 'K-000000') {
        this.setState({
          prescriber: res.context
        });
        sessionStorage.setItem(
          cache.PRESCRIBER_DATA,
          JSON.stringify(res.context)
        );
      }
    } else {
      sessionStorage.removeItem(cache.PRESCRIBER_DATA);
    }
  };

  getPrescribersData = async () => {
    const { res } = await webapi.getPrescribersData({
      selectType: 0,
      isPrescriber: true
    });
    if (res.code === 'K-000000') {
      this.setState({
        tradeInfo: res.context
      });
    }
  };

  getTradeData = async () => {
    const { res } = await webapi.prescribersTradeView();

    if (res.code === 'K-000000') {
      this.setState({
        tradeData: this.turnToOrderData(res.context.context)
      });
    }
  };

  getFlowTrendData = async () => {
    const { res } = await webapi.prescribersTradeReport();
    if (res.code === 'K-000000') {
      this.setState({
        flowTrendData: this.turnToOrderData(res.context)
      });
    }
  };

  getCustomerData = async () => {
    const { res } = await webapi.prescribersCustomerGrowReport();
    if (res.code === 'K-000000') {
      this.setState({
        customerData: this.turnToCustomerData(res.context)
      });
    }
  };

  getCustomerGrowTrendData = async () => {
    const { res } = await webapi.prescribersCustomerGrowTrend();
    if (res.code === 'K-000000') {
      debugger;
      this.setState({
        customerGrowTrendData: this.turnToCustomerData(res.context)
      });
    }
  };

  turnToOrderData = (data) => {
    let tradeData = data.map((order, index) => {
      return {
        key: index,
        orderCount: order.orderCount,
        orderAmt: order.orderAmt,
        payOrderCount: order.PayOrderCount,
        payOrderAmt: order.payOrderAmt,
        title: order.title
      };
    });
    return tradeData;
  };

  turnToCustomerData = (data) => {
    let customerData = data.map((cus, index) => {
      return {
        key: index,
        title: cus.xValue,
        cusAllCount: cus.customerAllCount,
        cusDayGrowthCount: cus.customerDayGrowthCount,
        cusDayRegisterCount: cus.customerDayRegisterCount
      };
    });
    return customerData;
  };

  render() {
    return (
      <div
        className="flowBox todayDataFour"
        style={{ marginLeft: -5, marginRight: -5 }}
      >
        <div
          className="homeItem todayData"
          style={{ width: 'calc(50% - 10px)' }}
        >
          <h3>Transaction overview &nbsp;Today</h3>
          <div className="dateBg">
            <div className="dataItem">
              <label>Order number</label>
              <strong>{this.state.tradeInfo.orderCount || 0}</strong>
            </div>
            <div className="dataItem">
              <label>Order amount</label>
              <strong>
                ￥
                {this.state.tradeInfo.orderAmt
                  ? (this.state.tradeInfo.orderAmt || 0).toFixed(2)
                  : 0.0}
              </strong>
            </div>
            <div className="dataItem" style={{ flex: 'inherit' }}>
              <label>Number of payment orders</label>
              <strong>{this.state.tradeInfo.payOrderCount || 0}</strong>
            </div>
            <div className="dataItem">
              <label>Payment amount</label>
              <strong>
                ￥
                {this.state.tradeInfo.payOrderAmt
                  ? (this.state.tradeInfo.payOrderAmt || 0).toFixed(2)
                  : 0.0}
              </strong>
            </div>
          </div>
        </div>

        <div
          className="homeItem todayData"
          style={{ width: 'calc(27% - 10px)' }}
        >
          <h3>Reward summary</h3>
          <div className="dateBg">
            <div className="dataItem">
              <label>Reward rate</label>
              <strong>{this.state.tradeInfo.rewardRate || 0}%</strong>
            </div>
            <div className="dataItem">
              <label>Reward amount</label>
              <strong>
                ￥
                {this.state.tradeInfo.orderCount
                  ? (this.state.tradeInfo.rewardCount || 0).toFixed(2)
                  : 0.0}
              </strong>
            </div>
          </div>
        </div>

        <div
          className="homeItem todayData prescriberInfo"
          style={{ width: 'calc(23% - 10px)', paddingLeft: '0px' }}
        >
          <div>
            <Row>
              <Col span={10}>
                <img src={prescriberLog} alt="" className="prescriberLog" />
              </Col>
              <Col span={2}>
                <Divider type="vertical" />
              </Col>
              <Col span={12}>
                <div className="prescriberWord">
                  <h3>{this.state.prescriber.prescriberName}</h3>
                  <div className="prescriberLable">
                    Prescriber ID: {this.state.prescriber.prescriberId}
                  </div>
                  <div className="prescriberLable">
                    Prescriber Type: {this.state.prescriber.prescriberType}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div className="homeItem lastTenData">
          <h3>Flow Reports&nbsp;Nearly 10 days</h3>
          <Table
            dataSource={this.state.tradeData}
            columns={tradeColumns}
            size="middle"
            pagination={false}
          />
        </div>

        <div className="homeItem lastTenData">
          <h3>Traffic trend&nbsp;Nearly 10 days</h3>
          <WMChart
            title=""
            startTime={new Date()}
            endTime={new Date()}
            dataDesc={[
              { title: 'visitor number UV', key: 'totalUv' },
              { title: 'page view PV', key: 'totalPv' },
              { title: 'Product visitor number', key: 'skuTotalUv' },
              { title: 'Products page view', key: 'skuTotalPv' }
            ]}
            radioClickBack={() => {}}
            content={this.state.flowTrendData}
            rangeVisible={false}
          />
        </div>

        <div className="homeItem lastTenData">
          <h3>Consumer growth reports&nbsp;Nearly 10 days</h3>
          <Table
            dataSource={this.state.customerData}
            columns={customerColumns}
            size="middle"
            pagination={false}
          />
        </div>
        <div className="homeItem lastTenData">
          <h3>Consumer growth trend&nbsp;Nearly 10 days</h3>
          <WMChart
            title=""
            startTime={new Date()}
            endTime={new Date()}
            dataDesc={[
              { title: 'Consumer  total number', key: 'cusAllCount' },
              { title: 'New consumer  number', key: 'cusDayGrowthCount' },
              {
                title: 'Registered consumers number',
                key: 'cusDayRegisterCount'
              }
            ]}
            radioClickBack={() => {}}
            content={this.state.customerGrowTrendData}
            rangeVisible={false}
          />
        </div>
      </div>
    );
  }
}
