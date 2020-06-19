import React from 'react';
import { IMap, Relax } from 'plume2';

import { AuthWrapper } from 'qmkit';
import { Table } from 'antd';

import TradeTrendsCharts from './trade-trends';
import { IList } from 'typings/globalType';
import FlowTrendsCharts from './flow-trends';
import CustomerGrowTrendsCharts from './cus-trends';

const trafficColumns = [
  {
    title: 'date',
    dataIndex: 'date',
    key: 'date'
  },
  {
    title: 'visitor number',
    dataIndex: 'totalUv',
    key: 'totalUv'
  },
  {
    title: 'page view',
    dataIndex: 'totalPv',
    key: 'totalPv'
  },
  {
    title: 'Product visitor number',
    dataIndex: 'skuTotalUv',
    key: 'skuTotalUv'
  },
  {
    title: 'Products page view',
    dataIndex: 'skuTotalPv',
    key: 'skuTotalPv'
  }
];

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
    title: 'Customer total number',
    dataIndex: 'cusAllCount',
    key: 'cusAllCount'
  },
  {
    title: 'New customer number',
    dataIndex: 'cusDayGrowthCount',
    key: 'cusDayGrowthCount'
  }
];

const oviewUi = {
  0: 'flowBox',
  1: 'flowBox todayDataOne',
  2: 'flowBox todayDataTwo',
  3: 'flowBox todayDataThree',
  4: 'flowBox todayDataFour'
};

@Relax
export default class StatisticalReport extends React.Component<any, any> {
  props: {
    relaxProps?: {
      trafficReport: boolean;
      tradeReport: boolean;
      customerGrowthReport: boolean;
      trafficTrends: boolean;
      tradeTrends: boolean;
      customerGrowthTrends: boolean;
      tradeData: IList;
      flowData: IList;
      customerData: IList;
      trafficOview: boolean;
      tradeOview: boolean;
      skuOview: boolean;
      customerOview: boolean;
      skuNum: IMap;
      tradeNum: IMap;
      oViewNum: number;
      customerNum: IMap;
      trafficNum: IMap;
    };
  };

  static relaxProps = {
    trafficReport: 'trafficReport',
    tradeReport: 'tradeReport',
    customerGrowthReport: 'customerGrowthReport',
    trafficTrends: 'trafficTrends',
    tradeTrends: 'tradeTrends',
    customerGrowthTrends: 'customerGrowthTrends',
    tradeData: 'tradeData',
    flowData: 'flowData',
    customerData: 'customerData',
    trafficOview: 'trafficOview',
    tradeOview: 'tradeOview',
    skuOview: 'skuOview',
    customerOview: 'customerOview',
    skuNum: 'skuNum',
    tradeNum: 'tradeNum',
    oViewNum: 'oViewNum',
    customerNum: 'customerNum',
    trafficNum: 'trafficNum'
  };

  render() {
    const {
      trafficReport,
      tradeReport,
      customerGrowthReport,
      trafficTrends,
      tradeTrends,
      customerGrowthTrends,
      tradeData,
      flowData,
      customerData,
      trafficOview,
      tradeOview,
      skuOview,
      customerOview,
      skuNum,
      tradeNum,
      oViewNum,
      customerNum,
      trafficNum
    } = this.props.relaxProps;

    return (
      <div
        className={oviewUi[oViewNum]}
        style={{ marginLeft: -5, marginRight: -5 }}
      >
        {/* 流量统计报表查看 */}
        {trafficOview ? (
          <AuthWrapper functionName="f_flow_watch_1">
            <div className="homeItem todayData">
              <h3>Flow profile&nbsp;Today</h3>
              <div className="dateBg">
                <div className="dataItem">
                  <label>visitor number UV</label>
                  <strong>{trafficNum.get('totalUv') || 0}</strong>
                </div>
              </div>
              <div className="dateBg">
                <div className="dataItem">
                  <label>page view PV</label>
                  <strong>{trafficNum.get('totalPv') || 0}</strong>
                </div>
              </div>
              {/* <div className="dateBg">
                <div className="dataItem">
                  <label>Product visitor number</label>
                  <strong>{trafficNum.get('skuTotalUv') || 0}</strong>
                </div>
                <div className="dataItem">
                  <label>Products page view</label>
                  <strong>{trafficNum.get('skuTotalPv') || 0}</strong>
                </div>
              </div> */}
            </div>
          </AuthWrapper>
        ) : null}
        {tradeOview ? (
          <AuthWrapper functionName="f_trade_watch_1">
            <div className="homeItem todayData">
              <h3>Transaction overview&nbsp;Today</h3>
              <div className="dateBg">
                <div className="dataItem">
                  <label>Order number</label>
                  <strong>
                    {tradeNum && (tradeNum.get('orderCount') || 0)}
                  </strong>
                </div>
                <div className="dataItem">
                  <label>Order amount</label>
                  <strong>
                    ￥
                    {tradeNum
                      ? (tradeNum.get('orderAmt') || 0).toFixed(2)
                      : 0.0}
                  </strong>
                </div>
              </div>
              <div className="dateBg">
                <div className="dataItem">
                  <label>Number of payment orders</label>
                  <strong>
                    {tradeNum && (tradeNum.get('payOrderCount') || 0)}
                  </strong>
                </div>
                <div className="dataItem">
                  <label>Payment amount</label>
                  <strong>
                    ￥
                    {tradeNum
                      ? (tradeNum.get('payOrderAmt') || 0).toFixed(2)
                      : 0.0}
                  </strong>
                </div>
              </div>
            </div>
          </AuthWrapper>
        ) : null}
        {customerOview ? (
          <AuthWrapper functionName="f_customer_watch_1">
            <div className="homeItem todayData">
              <h3>Customer profile&nbsp;Today</h3>
              <div className="dateBg">
                <div className="dataItem">
                  <label>Customer total number</label>
                  <strong>{customerNum.get('cusAllCount') || 0}</strong>
                </div>
              </div>
              <div className="dateBg">
                <div className="dataItem">
                  <label>New customer number</label>
                  <strong>{customerNum.get('cusDayGrowthCount') || 0}</strong>
                </div>
              </div>
            </div>
          </AuthWrapper>
        ) : null}
        {skuOview ? (
          <AuthWrapper functionName="f_goods_watch_1">
            <div className="homeItem todayData">
              <h3>Product overview&nbsp;Today</h3>
              <div className="dateBg">
                <div className="dataItem">
                  <label>Products total number SKU</label>
                  <strong>{skuNum && (skuNum.get('total') || 0)}</strong>
                </div>
              </div>
              <div className="dateBg">
                <div className="dataItem">
                  <label>Number of products on shelves</label>
                  <strong>{skuNum && (skuNum.get('addedTotal') || 0)}</strong>
                </div>
              </div>
              {/* <div className="dateBg">
                <div className="dataItem">
                  <label>Audited products SKU</label>
                  <strong>{skuNum && (skuNum.get('checkedTotal') || 0)}</strong>
                </div>
                <div className="dataItem">
                  <label>Products in sale SKU</label>
                  <strong>{skuNum && (skuNum.get('saleTotal') || 0)}</strong>
                </div>
              </div> */}
            </div>
          </AuthWrapper>
        ) : null}
        {trafficReport ? (
          <AuthWrapper functionName="f_flow_watch_1">
            <div className="homeItem lastTenData">
              <h3>Flow Reports&nbsp;Nearly 10 days</h3>
              <Table
                dataSource={flowData.size > 0 ? flowData.toJS() : null}
                columns={trafficColumns}
                size="middle"
                pagination={false}
              />
            </div>
          </AuthWrapper>
        ) : null}
        {trafficTrends ? (
          <AuthWrapper functionName="f_flow_watch_1">
            <div className="homeItem lastTenData">
              <h3>Traffic trend&nbsp;Nearly 10 days</h3>
              <FlowTrendsCharts />
            </div>
          </AuthWrapper>
        ) : null}
        {tradeReport ? (
          <AuthWrapper functionName="f_trade_watch_1">
            <div className="homeItem lastTenData">
              <h3>Transaction Reports&nbsp;Nearly 10 days</h3>
              <Table
                dataSource={tradeData.size > 0 ? tradeData.toJS() : null}
                columns={tradeColumns}
                size="middle"
                pagination={false}
              />
            </div>
          </AuthWrapper>
        ) : null}
        {tradeTrends ? (
          <AuthWrapper functionName="f_trade_watch_1">
            <div className="homeItem lastTenData">
              <h3>Trading trend&nbsp;Nearly 10 days</h3>
              <TradeTrendsCharts />
            </div>
          </AuthWrapper>
        ) : null}
        {customerGrowthReport ? (
          <AuthWrapper functionName="f_customer_watch_1">
            <div className="homeItem lastTenData">
              <h3>Customer growth reports&nbsp;Nearly 10 days</h3>
              <Table
                dataSource={customerData.size > 0 ? customerData.toJS() : null}
                columns={customerColumns}
                size="middle"
                pagination={false}
              />
            </div>
          </AuthWrapper>
        ) : null}
        {customerGrowthTrends ? (
          <AuthWrapper functionName="f_customer_watch_1">
            <div className="homeItem lastTenData">
              <h3>Customer growth trend&nbsp;Nearly 10 days</h3>
              <CustomerGrowTrendsCharts />
            </div>
          </AuthWrapper>
        ) : null}
      </div>
    );
  }
}
