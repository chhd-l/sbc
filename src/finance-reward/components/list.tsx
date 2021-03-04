import React from 'react';
import { Relax, Store } from 'plume2';
import { DataGrid, noop, AuthWrapper, cache, history } from 'qmkit';
import { List } from 'immutable';
//import { Link } from 'react-router-dom';
import { Popconfirm, Tooltip } from 'antd';
//import momnet from 'moment';
import { FormattedMessage } from 'react-intl';

type TList = List<any>;
const Column = DataGrid;

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
    const { loading, total, pageSize, selected, dataList, onSelect, init, current } = this.props.relaxProps;
    //console.log(this.props.relaxProps.searchForm.toJS(),'--------===');

    return (
      <DataGrid
        loading={{ spinning: loading, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" /> }}
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
      >
        <Column title={<FormattedMessage id="FinanceManageReward.PrescriberType" />} key="prescriberType" width="12%" dataIndex="prescriberType" />
        <Column title={<FormattedMessage id="FinanceManageReward.PrescriberID" />} key="prescriberId" dataIndex="prescriberId" width="11%" />
        <Column title={<FormattedMessage id="FinanceManageReward.PrescriberName" />} key="prescriberName" dataIndex="prescriberName" width="20%" />
        <Column title={<FormattedMessage id="FinanceManageReward.OrderQuantity" />} key="orderQuantity" dataIndex="orderQuantity" width="10%" />
        <Column
          title={<FormattedMessage id="FinanceManageReward.OrderAmount" />}
          dataIndex="orderAmount"
          width="11%"
          key="orderAmount"
          render={(orderPrice) => <span>{orderPrice != null ? `${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + orderPrice.toFixed(2)}` : '-'}</span>}
        />

        <Column title={<FormattedMessage id="FinanceManageReward.RewardType" />} dataIndex="rewardType" key="rewardType" width="11%" />
        <Column
          title={<FormattedMessage id="FinanceManageReward.RewardAmount" />}
          dataIndex="rewardAmount"
          key="rewardAmount"
          width="11%"
          render={(rewardAmount) => <span>{rewardAmount != null ? `${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + rewardAmount.toFixed(2)}` : '-'}</span>}
        />

        <Column
          title={<FormattedMessage id="FinanceManageReward.operation" />}
          width="10%"
          render={(text, record: any, i) => {
            return (
              <Tooltip placement="top" title={<FormattedMessage id="FinanceManageReward.Details" />}>
                <a href="javascript:void(0)" onClick={() => this._renderOperate(text)} className="iconfont iconDetails"></a>
              </Tooltip>
            );
          }}
        />
      </DataGrid>
    );
  }

  _renderOperate(rowInfo) {
    const { getPrescriberId } = this.props.relaxProps;

    getPrescriberId({ prescriberId: rowInfo });
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
            {<FormattedMessage id="FinanceManageReward.view" />}
          </a>
        </AuthWrapper>

        <AuthWrapper functionName="destoryOpenOrderInvoice">
          <Popconfirm
            title={invoiceState == 0 ? <FormattedMessage id="FinanceManageReward.ConfirmToBill" /> : <FormattedMessage id="FinanceManageReward.CancelBillRecord" />}
            onConfirm={() => {
              invoiceState == 0 ? onConfirm(id) : onDestory(id);
            }}
            okText={<FormattedMessage id="FinanceManageReward.Confirm" />}
            cancelText={<FormattedMessage id="FinanceManageReward.Cancel" />}
          >
            <a href="javascript:void(0);">{invoiceState == 0 ? 'Billing' : 'Cancellation'}</a>
          </Popconfirm>
        </AuthWrapper>
      </div>
    );
  };
}
