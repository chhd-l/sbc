// 退款对账明细
import React from 'react';
import { Relax } from 'plume2';
import { DataGrid, noop } from 'qmkit';
import moment from 'moment';
import { Table } from 'antd';

const Column = Table.Column;

@Relax
export default class RefundList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      payWaysObj: any;
      refundDetail: any;
      total: number;
      pageNum: number;
      onPagination: Function;
      pageSize: number;
    };
  };

  static relaxProps = {
    payWaysObj: 'payWaysObj',
    refundDetail: 'refundDetail',
    total: 'total',
    pageNum: 'pageNum',
    onPagination: noop,
    pageSize: 'pageSize'
  };

  render() {
    const {
      refundDetail,
      total,
      pageNum,
      pageSize,
      payWaysObj
    } = this.props.relaxProps;

    return (
      <div>
        <DataGrid
          dataSource={refundDetail.toJS().length > 0 ? refundDetail.toJS() : []}
          rowKey={(record) => record.index}
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
            title="Return Order time"
            dataIndex="orderTime"
            key="orderTime"
            width="11%"
            render={(text, _rowData: any) => {
              return <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
            }}
          />
          <Column
            title="Return Order number"
            dataIndex="returnOrderCode"
            key="returnOrderCode"
            width="12%"
          />
          <Column title="Order number" dataIndex="orderCode" key="orderCode" />
          <Column
            title="Order refund"
            dataIndex="orderRefund"
            key="orderRefund"
          />
          <Column
            title="Trasaction serial number"
            width="15%"
            dataIndex="tradeNo"
            key="tradeNo"
          />

          <Column
            title="Customer name"
            dataIndex="customerName"
            key="customerName"
          />
          <Column
            title="Refund time"
            dataIndex="tradeTime"
            key="tradeTime"
            render={(text, _rowData: any) => {
              return <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
            }}
          />
          <Column title="Payment type" dataIndex="payWay" key="payWay" />
          <Column
            title="Payment method"
            dataIndex="vendor"
            key="vendor"
            render={(_text, rowData: any) => {
              return <span>{payWaysObj.toJS()[rowData.payWay]}</span>;
            }}
          />

          <Column
            title="Real Refund"
            dataIndex="paymentOSActualReturnPrice"
            key="paymentOSActualReturnPrice"
            render={(text, rowData: any) => {
              return text ? <span>{text}</span> : '--';
            }}
          />
        </DataGrid>
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
