import React from 'react';
import { Relax } from 'plume2';
import { Const, DataGrid, noop, AuthWrapper, checkAuth } from 'qmkit';
import { List } from 'immutable';
import { Dropdown, Icon, Menu, Popconfirm } from 'antd';
import momnet from 'moment';
import { FormattedMessage } from 'react-intl';

type TList = List<any>;
const Column = DataGrid;

const invoiceStateDic = {
  0: 'To be invoiced',
  1: '已开票'
};

const invoiceTypeDic = {
  0: 'Ordinary Invoice',
  1: 'Vat Special Invoice'
};
const payOrderStatusDic = {
  0: '已付款',
  1: '未付款',
  2: '待确认',
  null: '未付款'
};

/**
 * 订单收款单列表
 */
@Relax
export default class OrderInvoiceList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      selected: TList;
      total: number;
      pageSize: number;
      dataList: TList;
      onSelect: Function;
      onDestory: Function;
      onConfirm: Function;
      init: Function;
      onSearchByInvoiceId: Function;
      current: number;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    selected: 'selected',
    pageSize: 'pageSize',
    dataList: 'dataList',
    onDestory: noop,
    onSelect: noop,
    init: noop,
    onConfirm: noop,
    onSearchByInvoiceId: noop,
    current: 'current'
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      selected,
      dataList,
      onSelect,
      init,
      current
    } = this.props.relaxProps;
    return (
      <DataGrid
        loading={loading}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selected.toJS(),
          onChange: (selectedRowKeys) => {
            onSelect(selectedRowKeys);
          }
        }}
        rowKey="orderInvoiceId"
        pagination={{
          pageSize,
          total,
          current: current,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
        dataSource={dataList.toJS()}
      >
        <Column
          title={<FormattedMessage id="PrescriberType" />}
          key="invoiceTime"
          dataIndex="invoiceTime"
          render={(invoiceTime) => (
            <span>
              {invoiceTime
                ? momnet(invoiceTime).format(Const.TIME_FORMAT).toString()
                : '-'}
            </span>
          )}
        />
        <Column
          title={<FormattedMessage id="PrescriberID" />}
          key="orderNo"
          dataIndex="orderNo"
        />
        <Column
          title={<FormattedMessage id="PrescriberName" />}
          key="customerName"
          dataIndex="customerName"
        />
        <Column
          title={<FormattedMessage id="OrderQuantity" />}
          key="orderPrice"
          dataIndex="orderPrice"
          render={(orderPrice) => (
            <span>
              {orderPrice != null ? `￥${orderPrice.toFixed(2)}` : '-'}
            </span>
          )}
        />
        <Column
          title={<FormattedMessage id="OrderAmount" />}
          dataIndex="payOrderStatus"
          key="payOrderStatus"
          render={(payOrderStatus) => (
            <span> {payOrderStatusDic[payOrderStatus]} </span>
          )}
        />

        <Column
          title={<FormattedMessage id="RewardType" />}
          dataIndex="invoiceType"
          key="invoiceType"
          render={(invoiceType) => <span>{invoiceTypeDic[invoiceType]}</span>}
        />


        <Column
          title={<FormattedMessage id="operation" />}
          render={(rowInfo) => this._renderOperate(rowInfo)}
        />
        {/*<Column
          title="操作"
          dataIndex="operation"
          key="operation"
          render={(text, record: any, i) => {
            return (
              <a href="javascript:void(0)" onClick={() => onSearchByInvoiceId(record.orderInvoiceId)} >查看</a>
            )
          }}
        />*/}
      </DataGrid>
    );
  }

  _renderOperate(rowInfo) {
    const { invoiceState, orderInvoiceId } = rowInfo;

    //待确认
    return checkAuth('fetchOrderInovices') ||
      checkAuth('destoryOpenOrderInvoice')
      ? this._renderMenu(orderInvoiceId, invoiceState)
      : '-';
  }

  _renderMenu = (id: string, invoiceState: number) => {
    const { onDestory, onConfirm, onSearchByInvoiceId } = this.props.relaxProps;

    return (
      <div className="operation-box">
        <AuthWrapper functionName="fetchOrderInovices">
          <a href="javascript:void(0);" onClick={() => onSearchByInvoiceId(id)}>
            {<FormattedMessage id="view" />}
          </a>
        </AuthWrapper>

        <AuthWrapper functionName="destoryOpenOrderInvoice">
          <Popconfirm
            title={invoiceState == 0 ? '确定已开票？' : '确定作废开票记录？'}
            onConfirm={() => {
              invoiceState == 0 ? onConfirm(id) : onDestory(id);
            }}
            okText="Confirm"
            cancelText="Cancel"
          >
            <a href="javascript:void(0);">
              {invoiceState == 0 ? 'Billing' : 'Cancellation'}
            </a>
          </Popconfirm>
        </AuthWrapper>
      </div>
    );
  };
}
