import React from 'react';
import { IMap, Relax } from 'plume2';

import { AuthWrapper } from 'qmkit';
import { Table } from 'antd';
import { cache } from 'qmkit';

import TradeTrendsCharts from './trade-trends';
import { IList } from 'typings/globalType';
import FlowTrendsCharts from './flow-trends';
import CustomerGrowTrendsCharts from './cus-trends';
import { FormattedMessage } from 'react-intl';
const visitorsImg = require('/public/images/other/home-icon/btn-visitors.png');
import { PieChart } from 'biz';
import ReactEchartsCore from 'echarts-for-react/lib/core';

const trafficColumns = [
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date'
  },
  {
    title: 'UV',
    dataIndex: 'totalUv',
    key: 'totalUv'
  },
  {
    title: 'PV',
    dataIndex: 'totalPv',
    key: 'totalPv'
  }
];

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
    title: 'New active consumer number',
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
      <div className={oviewUi[4]} style={{ marginLeft: -5, marginRight: -5 }}>
        {/* 流量统计报表查看 */}
        {
          // <AuthWrapper functionName="f_flow_watch_1">
          <div className="homeItem todayData">
            <h3>
              <FormattedMessage id="visitsToday" />
            </h3>
            <div className="align-items-center">
              <div style={{ width: '20%' }}>
                <img src={visitorsImg} alt="" width={47} height={47} />
              </div>
              <div style={{ width: '80%' }}>
                <div className="dateBg">
                  <div className="dataItem">
                    <label>
                      <FormattedMessage id="uv" />
                    </label>
                    <strong>{trafficNum.get('totalUv') || 0}</strong>
                  </div>
                </div>
                <div className="dateBg">
                  <div className="dataItem">
                    <label>
                      <FormattedMessage id="pv" />
                    </label>
                    <strong>{trafficNum.get('totalPv') || 0}</strong>
                  </div>
                </div>
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
          // </AuthWrapper>}
        }
        {/* {tradeOview ? (
          <AuthWrapper functionName="f_trade_watch_1"> */}
        <div className="homeItem todayData">
          <h3>
            <FormattedMessage id="transactionToday" />
          </h3>
          <div className="dateBg">
            <div className="dataItem">
              <label>
                <FormattedMessage id="orderNumber" />
              </label>
              <strong>{tradeNum && (tradeNum.get('orderCount') || 0)}</strong>
            </div>
            <div className="dataItem">
              <label>
                <FormattedMessage id="orderAmount" />
              </label>
              <strong>
                {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                {tradeNum ? (tradeNum.get('orderAmt') || 0).toFixed(2) : 0.0}
              </strong>
            </div>
          </div>
          <div className="dateBg">
            <div className="dataItem">
              <label>Payment orders</label>
              <strong>
                {tradeNum && (tradeNum.get('payOrderCount') || 0)}
              </strong>
            </div>
            <div className="dataItem">
              <label>
                <FormattedMessage id="paymentAmount" />
              </label>
              <strong>
                {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                {tradeNum ? (tradeNum.get('payOrderAmt') || 0).toFixed(2) : 0.0}
              </strong>
            </div>
          </div>
        </div>
        {/* </AuthWrapper>
        ) : null} */}
        {/* {customerOview ? (
          <AuthWrapper functionName="f_customer_watch_1"> */}
        <div className="homeItem todayData">
          <h3>
            <FormattedMessage id="consumerToday" />
          </h3>
          <div className="dateBg">
            <div className="dataItem">
              <label>
                <FormattedMessage id="totalcConsumerNumber" />
              </label>
              <strong>{customerNum.get('cusAllCount') || 0}</strong>
            </div>
          </div>
          <div className="dateBg">
            <div className="dataItem">
              <label>
                <FormattedMessage id="newConsumerNumber" />
              </label>
              <strong>{customerNum.get('cusDayGrowthCount') || 0}</strong>
            </div>
          </div>
        </div>
        {/* </AuthWrapper>
        ) : null} */}
        {/* {skuOview ? (
          <AuthWrapper functionName="f_goods_watch_1"> */}
        <div className="homeItem todayData">
          <h3>
            <FormattedMessage id="productToday" />
          </h3>
          <div className="align-items-center">
            <div className="dateBg1">
              <PieChart
                total={skuNum && (skuNum.get('total') || 0)}
                shelves={skuNum && (skuNum.get('addedTotal') || 0)}
              />
              {/*<div className="dataItem">
              <label>
                <FormattedMessage id="totalSKU" />
              </label>
              <strong>{skuNum && (skuNum.get('total') || 0)}</strong>
            </div>*/}
            </div>
            <div className="dateBg2">
              <div className="dataItem">
                <label>
                  <FormattedMessage id="productsOnShelvesNumber" />
                </label>
                <strong>{skuNum && (skuNum.get('addedTotal') || 0)}</strong>
              </div>
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
        {/* </AuthWrapper>
        ) : null} */}
        {/* {trafficReport ? (
          <AuthWrapper functionName="f_flow_watch_1"> */}
        <div className="homeItem lastTenData">
          <h3>
            <FormattedMessage id="visitsReportNearly10Days" />
          </h3>
          <Table
            dataSource={flowData.size > 0 ? flowData.toJS() : null}
            columns={trafficColumns}
            size="middle"
            pagination={false}
          />
        </div>
        {/* </AuthWrapper>
        ) : null} */}
        {/* {trafficTrends ? (
          <AuthWrapper functionName="f_flow_watch_1"> */}
        <div className="homeItem lastTenData">
          <h3>
            <FormattedMessage id="visitsTrendNearly10Days" />
          </h3>
          <FlowTrendsCharts />
        </div>
        {/* </AuthWrapper>
        ) : null} */}
        {/* {tradeReport ? (
          <AuthWrapper functionName="f_trade_watch_1"> */}
        <div className="homeItem lastTenData">
          <h3>
            <FormattedMessage id="transactionReportNearly10Days" />
          </h3>
          <Table
            dataSource={tradeData.size > 0 ? tradeData.toJS() : null}
            columns={tradeColumns}
            size="middle"
            pagination={false}
          />
        </div>
        {/* </AuthWrapper>
        ) : null} */}
        {/* {tradeTrends ? (
          <AuthWrapper functionName="f_trade_watch_1"> */}
        <div className="homeItem lastTenData">
          <h3>
            <FormattedMessage id="transactionTrendNearly10Days" />
          </h3>
          <TradeTrendsCharts />
        </div>
        {/* </AuthWrapper>
        ) : null} */}
        {/* {customerGrowthReport ? (
          <AuthWrapper functionName="f_customer_watch_1"> */}
        <div className="homeItem lastTenData">
          <h3>
            <FormattedMessage id="consumerReportNearly10Days" />
          </h3>
          <Table
            dataSource={customerData.size > 0 ? customerData.toJS() : null}
            columns={customerColumns}
            size="middle"
            pagination={false}
          />
        </div>
        {/* </AuthWrapper>
        ) : null} */}
        {/* {customerGrowthTrends ? (
          <AuthWrapper functionName="f_customer_watch_1"> */}
        <div className="homeItem lastTenData">
          <h3>
            <FormattedMessage id="consumerTrendNearly10Days" />
          </h3>
          <CustomerGrowTrendsCharts />
        </div>
        {/* </AuthWrapper>
        ) : null} */}
      </div>
    );
  }
}
