import React from 'react';
import { Action, IMap, Relax, Store } from 'plume2';
import { Const, DataGrid, noop, AuthWrapper, checkAuth, history } from 'qmkit';
import { List } from 'immutable';
import { Link } from 'react-router-dom';
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
  _store: Store;
  props: {
    relaxProps?: {
      loading: boolean;
      selected: TList;
      ccccccc: 'String';
      total: number;
      pageSize: number;
      dataList: TList;
      onSelect: any;
      onDestory: Function;
      onConfirm: Function;
      init: Function;
      onSearchByInvoiceId: Function;
      current: number;
      getPrescriberId: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    selected: 'selected',
    pageSize: 'pageSize',
    dataList: 'dataList',
    ccccccc: 'ccccccc',
    onDestory: noop,
    onSelect: noop,
    init: noop,
    onConfirm: noop,
    onSearchByInvoiceId: noop,
    getPrescriberId: noop,
    current: 'current',
    searchForm: 'searchForm'
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
    //console.log(this.props.relaxProps.searchForm.toJS(),'--------===');

    return (
      <DataGrid
        loading={loading}
        /*rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selected.toJS(),
          onChange: (selectedRowKeys) => {
            onSelect(selectedRowKeys);
          }
        }}*/
        rowKey="orderInvoiceId"
        pagination={{
          pageSize,
          total,
          fitColumns: true,
          current: current,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
        dataSource={dataList.toJS()}
        /*dataSource = {[
          { id: '1', firstName: 'John', lastName: 'Bobson'},
          { id: '2', firstName: 'Bob', lastName: 'Mclaren'}
        ]}*/
      >
        <Column
          title={<FormattedMessage id="PrescriberType" />}
          key="prescriberType"
          width="12%"
          dataIndex="prescriberType"
          /*render={(invoiceTime) => (
            <span>
              {invoiceTime
                ? momnet(invoiceTime).format(Const.TIME_FORMAT).toString()
                : '-'}
            </span>
          )}*/
        />
        <Column
          title={<FormattedMessage id="PrescriberID" />}
          key="prescriberId"
          dataIndex="prescriberId"
          width="11%"
        />
        <Column
          title={<FormattedMessage id="PrescriberName" />}
          key="prescriberName"
          dataIndex="prescriberName"
          width="22%"
        />
        <Column
          title={<FormattedMessage id="OrderQuantity" />}
          key="orderQuantity"
          dataIndex="orderQuantity"
          width="11%"
        />
        <Column
          title={<FormattedMessage id="OrderAmount" />}
          dataIndex="orderAmount"
          width="11%"
          key="orderAmount"
          render={(orderPrice) => (
            <span>{orderPrice != null ? `${orderPrice.toFixed(2)}` : '-'}</span>
          )}
          /* render={(payOrderStatus) => (
            <span> {payOrderStatusDic[payOrderStatus]} </span>
          )}*/
        />

        <Column
          title={<FormattedMessage id="RewardType" />}
          dataIndex="rewardType"
          key="rewardType"
          width="11%"
          //render={(invoiceType) => <span>{invoiceTypeDic[invoiceType]}</span>}
        />
        <Column
          title={<FormattedMessage id="RewardAmount" />}
          dataIndex="rewardAmount"
          key="rewardAmount"
          width="11%"
          render={(rewardAmount) => (
            <span>
              {rewardAmount != null ? `$${rewardAmount.toFixed(2)}` : '-'}
            </span>
          )}
        />

        <Column
          title={<FormattedMessage id="operation" />}
          width="8%"
          render={(text, record: any, i) => {
            return (
              <a
                href="javascript:void(0)"
                onClick={() => this._renderOperate(text)}
              >
                Details
              </a>
            );
          }}
          // render={(rowInfo) => this._renderOperate(rowInfo)}
        />
      </DataGrid>
    );
  }

  _renderOperate(rowInfo) {
    const { getPrescriberId } = this.props.relaxProps;

    getPrescriberId({ prescriberId: rowInfo });
    //console.log(this.props.relaxProps.ccccccc);
    history.push({
      pathname: '/finance-reward-details',
      params: {
        prescriberId: rowInfo.prescriberId,
        prescriberName: rowInfo.prescriberName
      }
    });

    /*setTimeout(()=>{
      console.log(this.props.relaxProps.ccccccc);

    },300)*/
    //return (<Link to={{pathname :'/finance-reward-details', state : { name : rowInfo }}}>Details</Link>)

    /*const { invoiceState, orderInvoiceId } = rowInfo;

    //待确认
    return checkAuth('fetchOrderInovices') ||
      checkAuth('destoryOpenOrderInvoice')
      ? this._renderMenu(orderInvoiceId, invoiceState)
      : '-';*/
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
            title={
              invoiceState == 0
                ? 'Do you confirm to bill？'
                : 'Do you confirm to cancel bill record？'
            }
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
