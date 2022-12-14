// 收入对账明细
import React from 'react';
import { Relax } from 'plume2';
import { DataGrid, noop, cache, util, Const } from 'qmkit';
import moment from 'moment';
import { Table, message, Button } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

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
      exportIncomeDetail: Function;
    };
  };

  static relaxProps = {
    payWaysObj: 'payWaysObj',
    incomeDetail: 'incomeDetail',
    total: 'total',
    pageNum: 'pageNum',
    onPagination: noop,
    pageSize: 'pageSize',
    loading: 'loading',
    exportIncomeDetail: noop
  };

  render() {
    const { incomeDetail, payWaysObj, loading, total, pageSize, pageNum, exportIncomeDetail } = this.props.relaxProps;
    return (
      <div>
        <div style={{ marginBottom: '20px' }}>
          <Button
            className="exportBtn"
            type="primary"
            onClick={(e) => {
              e.preventDefault();
              exportIncomeDetail();
            }}
          >
            <FormattedMessage id="Finance.Export" />
          </Button>
        </div>
        <DataGrid
          loading={loading}
          dataSource={incomeDetail.toJS().length > 0 ? incomeDetail.toJS() : []}
          rowKey={(_record, index) => index.toString()}
          pagination={{
            pageSize,
            total,
            current: pageNum + 1
          }}
          onChange={(pagination, filters, sorter) => this._getData(pagination, filters, sorter)}
        >
          <Column
            title={<FormattedMessage id="Finance.NO" />}
            dataIndex="index"
            key="index"
            width="5%"
            render={(_text, _rowData: any, index) => {
              return pageNum * pageSize + index + 1;
            }}
          />
          <Column
            title={<FormattedMessage id="Finance.orderTime" />}
            dataIndex="orderTime"
            key="orderTime"
            render={(text, _rowData: any, _index) => {
              return <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
            }}
          />
          <Column title={<FormattedMessage id="Finance.OrderNumber" />} dataIndex="orderCode" key="orderCode" width="12%" />

          {/*<Column
            title="Transaction serial number"
            dataIndex="tradeNo"
            width="15%"
            key="tradeNo"
          />*/}
          <Column title={<FormattedMessage id="Finance.ConsumerName" />} dataIndex="customerName" key="customerName" />
          <Column
            title="Order Revenue"
            dataIndex="amount"
            key="amount"
            render={(text, _rowData: any) => {
              return <span>{text ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + text : '--'}</span>;
            }}
          />
          <Column
            title={<FormattedMessage id="Finance.RealRevenue" />}
            dataIndex="paymentOSActualPrice"
            key="paymentOSActualPrice"
            render={(text, _rowData: any) => {
              return <span>{text ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + text : '--'}</span>;
            }}
          />
          <Column
            title={<FormattedMessage id="Finance.PaymentTime" />}
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
          <Column title={<FormattedMessage id="Finance.TransactionId" />} dataIndex="transactionId" key="transactionId" />
          <Column title={<FormattedMessage id="Finance.PaymentType" />} dataIndex="payWay" key="payWay" />
          {/*<Column title="Payment method" dataIndex="vendor" key="vendor" />*/}
          <Column title={<FormattedMessage id="Finance.SynStatus" />} dataIndex="syncPayStatus" key="syncPayStatus" width="7%" />
          <Column title={<FormattedMessage id="Finance.CreditStatus" />} dataIndex="payStatus" key="payStatus" width="8%" />
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
