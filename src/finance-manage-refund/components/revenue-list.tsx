// 收入对账明细
import React from 'react';
import { Relax } from 'plume2';
import { DataGrid, noop, cache } from 'qmkit';
import moment from 'moment';
import { Table } from 'antd';

const Column = Table.Column;

@Relax
export default class RevenueList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      payWaysObj: any;
      incomeDetail: any;
      kind: string;
      total: number;
      pageNum: number;
      onPagination: Function;
      pageSize: number;
      loading: boolean;
    };
  };

  static relaxProps = {
    payWaysObj: 'payWaysObj',
    incomeDetail: 'incomeDetail',
    total: 'total',
    pageNum: 'pageNum',
    onPagination: noop,
    pageSize: 'pageSize',
    loading: 'loading'
  };

  render() {
    const {
      incomeDetail,
      payWaysObj,
      loading,
      total,
      pageSize,
      pageNum
    } = this.props.relaxProps;
    return (
      <div>
        <DataGrid
          loading={loading}
          dataSource={incomeDetail.toJS().length > 0 ? incomeDetail.toJS() : []}
          rowKey={(_record, index) => index.toString()}
          pagination={{
            pageSize,
            total,
            current: pageNum + 1
          }}
          onChange={(pagination, filters, sorter) =>
            this._getData(pagination, filters, sorter)
          }
        >
          <Column
            title="No"
            dataIndex="index"
            key="index"
            width="5%"
            render={(_text, _rowData: any, index) => {
              return pageNum * pageSize + index + 1;
            }}
          />
          <Column
            title="Order time"
            dataIndex="orderTime"
            key="orderTime"
            render={(text, _rowData: any, _index) => {
              return <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
            }}
          />
          <Column
            title="Order number"
            dataIndex="orderCode"
            key="orderCode"
            width="12%"
          />
          <Column
            title="Order Revenue"
            dataIndex="amount"
            key="amount"
            render={(text, _rowData: any) => {
              return (
                <span>
                  {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + text}
                </span>
              );
            }}
          />

          {/*<Column
            title="Transaction serial number"
            dataIndex="tradeNo"
            width="15%"
            key="tradeNo"
          />*/}
          <Column
            title="Consumer name"
            dataIndex="customerName"
            key="customerName"
          />
          <Column
            title="Payment time"
            dataIndex="tradeTime"
            key="tradeTime"
            render={(text, _rowData: any) => {
              return <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
            }}
          />
          {/*<Column
            title="Payment type"
            dataIndex="paymentMethod"
            key="paymentMethod"
            render={(text, rowData: any) => {
              return text ? (
                <span>{payWaysObj.toJS()[rowData.payWay]}</span>
              ) : (
                '--'
              );
            }}
          />*/}

          {/*<Column*/}
          {/*title='优惠金额'*/}
          {/*dataIndex='discounts'*/}
          {/*key='discounts'*/}
          {/*render={(text, rowData: any, index) => {*/}
          {/*return text ?*/}
          {/*<span>{text}</span> :'￥0.00'*/}
          {/*}}/>*/}
          {/*/>*/}
          <Column title="Payment type" dataIndex="payWay" key="payWay" />
          <Column title="Payment method" dataIndex="vendor" key="vendor" />
          <Column
            title="Real Revenue"
            dataIndex="paymentOSActualPrice"
            key="paymentOSActualPrice"
            render={(text, rowData: any) => {
              return text ? <span>{text}</span> : '--';
            }}
          />
        </DataGrid>
        {/*<Table columns={columns} dataSource={data} />*/}
      </div>
    );
  }

  /**
   * 分页查询
   * @param pageNum
   * @param pageSize
   * @private
   */
  _getData = (pagination, _filter, _sorter) => {
    const { onPagination } = this.props.relaxProps;
    onPagination(pagination.current, pagination.pageSize);
  };
}
