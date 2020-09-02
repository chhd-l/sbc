import React, { Component } from 'react';
import { Table, Divider, Row, Col, Select } from 'antd';
import { WMChart } from 'biz';
import { getClinicById } from './../../prescriber-add/webapi';
import { cache } from 'qmkit';
import * as webapi from './../webapi';
import { FormattedMessage } from 'react-intl';
const Option = Select.Option;

const prescriberLog = require('./../images/Prescriber.png');

const tradeColumns = [
  {
    title: 'Date',
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
    render: (_text, record) =>
      sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) +
      (record.orderAmt || 0).toFixed(2),
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
    render: (_text, record) =>
      sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) +
      (record.payOrderAmt || 0).toFixed(2),
    key: 'payOrderAmt'
  }
];

const customerColumns = [
  {
    title: 'Date',
    dataIndex: 'baseDate',
    key: 'baseDate'
  },
  {
    title: 'Total active consumer number',
    dataIndex: 'cusAllCount',
    key: 'cusAllCount'
  },
  {
    title: 'New active consumer  number',
    dataIndex: 'cusDayGrowthCount',
    key: 'cusDayGrowthCount'
  }
];

export default class homePrescriber extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      tradeInfo: {},
      prescriber: {
        prescriberId: '',
        prescriberType: ''
      },
      tradeData: [],
      flowTrendData: [],
      customerData: [],
      customerGrowTrendData: []
    };
    this.getPrescriberDetail = this.getPrescriberDetail.bind(this);
    this.getPrescribersData = this.getPrescribersData.bind(this);
    this.getTradeData = this.getTradeData.bind(this);
    this.getFlowTrendData = this.getFlowTrendData.bind(this);
    this.getCustomerData = this.getCustomerData.bind(this);
    this.getCustomerGrowTrendData = this.getCustomerGrowTrendData.bind(this);

    this.allBind(this.props.prescriberId);
  }

  allBind = (id) => {
    this.getPrescriberDetail(id);
    this.getPrescribersData(id);
    this.getTradeData(id);
    this.getFlowTrendData(id);
    this.getCustomerData(id);
    this.getCustomerGrowTrendData(id);
  };
  componentDidMount() {
    let o = {
      value: JSON.parse(sessionStorage.getItem(cache.EMPLOYEE_DATA))
        .prescribers[0].id,
      children: JSON.parse(sessionStorage.getItem(cache.EMPLOYEE_DATA))
        .prescribers[0].prescriberName
    };
    let act = JSON.stringify(o);
    if (sessionStorage.getItem('PrescriberType') === null) {
      sessionStorage.setItem('PrescriberType', act);
    }
  }

  getPrescriberDetail = async (id) => {
    if (id) {
      const { res } = await getClinicById({
        id: id
      });
      if (res.code === 'K-000000') {
        this.setState({
          prescriber: res.context
        });
        sessionStorage.setItem(
          cache.PRESCRIBER_DATA,
          JSON.stringify(res.context)
        );
      } else {
        sessionStorage.removeItem(cache.PRESCRIBER_DATA);
      }
    } else {
      sessionStorage.removeItem(cache.PRESCRIBER_DATA);
    }
  };

  getPrescribersData = async (id) => {
    const { res } = await webapi.getPrescribersData(id);
    if (res.code === 'K-000000') {
      this.setState({
        tradeInfo: res.context
      });
    }
  };

  getTradeData = async (id) => {
    const { res } = await webapi.prescribersTradeView(id);
    if (res.code === 'K-000000') {
      if (!res.context.content) {
        return [];
      }
      let tradeData = res.context.content.map((order, index) => {
        return {
          key: index,
          orderCount: order.orderCount,
          orderAmt: order.orderAmt,
          payOrderCount: order.PayOrderCount,
          payOrderAmt: order.payOrderAmt,
          title: order.title
        };
      });
      this.setState({
        tradeData: tradeData
      });
    }
  };

  getFlowTrendData = async (id) => {
    const { res } = await webapi.prescribersTradeReport(id);
    if (res.code === 'K-000000') {
      let tradeFlowData = res.context.map((order, index) => {
        return {
          key: index,
          orderCount: order.orderCount,
          orderAmt: order.orderAmt,
          payOrderCount: order.PayOrderCount,
          payOrderAmt: order.payOrderAmt,
          title: order.title
        };
      });
      this.setState({
        flowTrendData: tradeFlowData
      });
    }
  };

  getCustomerData = async (id) => {
    const { res } = await webapi.prescribersCustomerGrowReport(id);
    if (res.code === 'K-000000') {
      let customerData = res.context.data.map((cus, index) => {
        return {
          key: index,
          cusAllCount: cus.customerAllCount,
          cusDayGrowthCount: cus.customerDayGrowthCount,
          cusDayRegisterCount: cus.customerDayRegisterCount,
          baseDate: cus.baseDate
        };
      });
      this.setState({
        customerData: customerData
      });
    }
  };

  getCustomerGrowTrendData = async (id) => {
    const { res } = await webapi.prescribersCustomerGrowTrend(id);
    if (res.code === 'K-000000') {
      let customerFlowData = res.context.map((cus, index) => {
        return {
          key: index,
          title: cus.xValue,
          cusAllCount: cus.customerAllCount,
          cusDayGrowthCount: cus.customerDayGrowthCount,
          cusDayRegisterCount: cus.customerDayRegisterCount
        };
      });
      this.setState({
        customerGrowTrendData: customerFlowData
      });
    }
  };

  _prescriberChange = (value, name) => {
    sessionStorage.setItem('PrescriberType', JSON.stringify(name.props));
    this.allBind(value);
  };

  render() {
    const employee = JSON.parse(sessionStorage.getItem(cache.EMPLOYEE_DATA));
    const allPrescribers =
      employee && employee.prescribers && employee.prescribers.length > 0
        ? employee.prescribers
        : [];
    return (
      <div>
        <div
          className="flowBox todayDataFour"
          style={{ marginLeft: -5, marginRight: -5 }}
        >
          <div
            className="homeItem todayData"
            style={{ width: 'calc(50% - 10px)' }}
          >
            <h3>
              <FormattedMessage id="transactionToday" />
            </h3>
            <div className="dateBg">
              <div className="dataItem">
                <label>
                  <FormattedMessage id="orderNumber" />
                </label>
                <strong>{this.state.tradeInfo.orderCount || 0}</strong>
              </div>
              <div className="dataItem">
                <label>
                  <FormattedMessage id="orderAmount" />
                </label>
                <strong>
                  {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}{' '}
                  {this.state.tradeInfo.orderAmt
                    ? (this.state.tradeInfo.orderAmt || 0).toFixed(2)
                    : 0.0}
                </strong>
              </div>
              <div className="dataItem" style={{ flex: 'inherit' }}>
                <label>
                  <FormattedMessage id="numberOfPaymentOrders" />
                </label>
                <strong>{this.state.tradeInfo.payOrderCount || 0}</strong>
              </div>
              <div className="dataItem">
                <label>
                  <FormattedMessage id="paymentAmount" />
                </label>
                <strong>
                  {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}{' '}
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
            <h3>
              <FormattedMessage id="rewardSummary" />
            </h3>
            <div className="dateBg">
              <div className="dataItem">
                <label>
                  <FormattedMessage id="rewardSummary" />
                </label>
                <strong>{this.state.tradeInfo.rewardRate || 0}%</strong>
              </div>
              <div className="dataItem">
                <label>
                  <FormattedMessage id="rewardAmount" />
                </label>
                <strong>
                  {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}{' '}
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
                    <Select
                      onChange={(value, name) =>
                        this._prescriberChange(value, name)
                      }
                      defaultValue={
                        sessionStorage.getItem('PrescriberType')
                          ? JSON.parse(sessionStorage.getItem('PrescriberType'))
                              .children
                          : null
                      }
                      style={{ width: '140px', marginBottom: '10px' }}
                    >
                      {allPrescribers.map((item) => (
                        <Option value={item.id} key={item.id}>
                          {item.prescriberName}
                        </Option>
                      ))}
                    </Select>
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
            <h3>
              <FormattedMessage id="transactionReportNearly10Days" />
            </h3>
            <Table
              dataSource={this.state.tradeData}
              columns={tradeColumns}
              size="middle"
              pagination={false}
            />
          </div>

          <div className="homeItem lastTenData">
            <h3>
              <FormattedMessage id="transactionTrendNearly10Days" />
            </h3>
          </div>

          <div className="homeItem lastTenData">
            <h3>
              <FormattedMessage id="consumerReportNearly10Days" />
            </h3>
            <Table
              dataSource={this.state.customerData}
              columns={customerColumns}
              size="middle"
              pagination={false}
            />
          </div>
          <div className="homeItem lastTenData">
            <h3>
              <FormattedMessage id="consumerTrendNearly10Days" />
            </h3>
            <WMChart
              title=""
              startTime={
                new Date(sessionStorage.getItem('defaultLocalDateTime'))
              }
              endTime={new Date(sessionStorage.getItem('defaultLocalDateTime'))}
              dataDesc={[
                { title: 'Total active consumer number', key: 'cusAllCount' },
                {
                  title: 'New active consumer  number',
                  key: 'cusDayGrowthCount'
                },
                {
                  title: 'Registered active consumers number',
                  key: 'cusDayRegisterCount'
                }
              ]}
              radioClickBack={() => {}}
              content={this.state.customerGrowTrendData}
              rangeVisible={false}
            />
          </div>
        </div>
      </div>
    );
  }
}
