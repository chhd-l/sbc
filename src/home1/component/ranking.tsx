import React from 'react';
import { Relax } from 'plume2';
import { IList } from 'typings/globalType';
import { AuthWrapper, util, cache } from 'qmkit';

import { skuRankingQL } from '../ql';
import { Table } from 'antd';

const skuSalesColumns = [
  {
    title: 'serial number',
    dataIndex: 'serialNumber',
    key: 'serialNumber'
  },
  {
    title: 'Product information',
    dataIndex: 'skuName',
    key: 'skuName',
    width: 400,
    render: (_text, record) => (
      <div className="proDetails">
        <p>{record.skuName}</p>
        <span>{record.skuDetailName}</span>
      </div>
    )
  },
  {
    title: 'SKU coding',
    dataIndex: 'skuNo',
    key: 'skuNo'
  },
  {
    title: 'Order number',
    dataIndex: 'skuOrderCount',
    key: 'skuOrderCount'
  },
  {
    title: 'Order amount',
    dataIndex: 'skuOrderAmt',
    key: 'skuOrderAmt',
    render: (_text, record) => sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + (record.skuOrderAmt || 0).toFixed(2)
  },
  {
    title: 'The quantity of order',
    dataIndex: 'skuOrderNum',
    key: 'skuOrderNum'
  }
];

const customerOrderColumns = [
  {
    title: 'serial number',
    dataIndex: 'serialNumber',
    key: 'serialNumber'
  },
  {
    title: 'Customer name',
    dataIndex: 'customerName',
    key: 'customerName'
  },
  {
    title: 'Order number',
    dataIndex: 'tradeNum',
    key: 'tradeNum'
  },
  {
    title: 'Order amount',
    dataIndex: 'tradeAmount',
    key: 'tradeAmount',
    render: (_text, record) => sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + (record.tradeAmount || 0).toFixed(2)
  }
];

const employeeSaleColumns = [
  {
    title: '序号',
    dataIndex: 'serialNumber',
    key: 'serialNumber'
  },
  {
    title: '业务员',
    dataIndex: 'employeeName',
    key: 'employeeName'
  },
  {
    title: '下单笔数',
    dataIndex: 'orderCount',
    orderCount: 'orderCount'
  },
  {
    title: '下单金额',
    dataIndex: 'amount',
    key: 'amount',
    render: (_text, record) => sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + (record.amount || 0).toFixed(2)
  },
  {
    title: '付款订单数',
    dataIndex: 'payCount',
    key: 'payCount'
  },
  {
    title: '付款金额',
    dataIndex: 'payAmount',
    key: 'payAmount',
    render: (_text, record) => sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + (record.payAmount || 0).toFixed(2)
  }
];

@Relax
export default class Ranking extends React.Component<any, any> {
  props: {
    relaxProps?: {
      skuSaleRanking: boolean;
      customerOrderRanking: boolean;
      employeeAchieve: boolean;
      skuRanking: any;
      customerRanking: any;
      employeeRanking: IList;
    };
  };

  static relaxProps = {
    skuSaleRanking: 'skuSaleRanking',
    customerOrderRanking: 'customerOrderRanking',
    employeeAchieve: 'employeeAchieve',
    skuRanking: skuRankingQL,
    customerRanking: 'customerRanking',
    employeeRanking: 'employeeRanking'
  };

  render() {
    const { skuSaleRanking, customerOrderRanking, employeeAchieve, skuRanking, customerRanking, employeeRanking } = this.props.relaxProps;

    return (
      <div>
        {skuSaleRanking ? (
          <AuthWrapper functionName="f_goods_watch_1">
            <div className="flowBox">
              <div className="homeItem" style={{ flex: 1 }}>
                <h3>Top10 products by sales</h3>
                <Table dataSource={skuRanking ? skuRanking : null} columns={skuSalesColumns} size="middle" pagination={false} />
              </div>
            </div>
          </AuthWrapper>
        ) : null}
        <div className="flowBox">
          {customerOrderRanking ? (
            <AuthWrapper functionName="f_customer_watch_1">
              <div className="homeItem" style={{ flex: 1 }}>
                <h3>Customer order Top10</h3>
                <Table dataSource={customerRanking.toJS()} columns={customerOrderColumns} size="middle" pagination={false} />
              </div>
            </AuthWrapper>
          ) : null}
          {employeeAchieve && util.isThirdStore() ? (
            <AuthWrapper functionName="f_employee_watch_1">
              <div className="homeItem" style={{ flex: 1, marginLeft: 10 }}>
                <h3>业务员业绩排行Top10</h3>
                <Table dataSource={employeeRanking.toJS()} columns={employeeSaleColumns} size="middle" pagination={false} />
              </div>
            </AuthWrapper>
          ) : null}
        </div>
      </div>
    );
  }
}
