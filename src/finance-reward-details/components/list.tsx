import React from 'react';
import { Action, IMap, Relax, Store } from 'plume2';
import { Const, DataGrid, noop, AuthWrapper, checkAuth, history, cache } from 'qmkit';
import { List } from 'immutable';
import { Link } from 'react-router-dom';
import { Dropdown, Icon, Menu, Popconfirm, Tooltip } from 'antd';
import momnet from 'moment';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

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
const OptionDiv = styled.div`
  width: 100%;
  text-align: left;
  display: block;
  /*position: absolute;
  right: 40px;
  top: 90px;*/
`;
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
    onDestory: noop,
    onSelect: noop,
    init: noop,
    onConfirm: noop,
    onSearchByInvoiceId: noop,
    getPrescriberId: noop,
    current: 'current',
    searchForm: 'searchForm'
  };
  componentDidMount() {}
  render() {
    const { loading, total, pageSize, selected, dataList, onSelect, init, current } = this.props.relaxProps;

    return (
      <DataGrid
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
        dataSource={dataList}
        /*dataSource = {[
          { id: '1', firstName: 'John', lastName: 'Bobson'},
          { id: '2', firstName: 'Bob', lastName: 'Mclaren'}
        ]}*/
      >
        <Column title={<FormattedMessage id="Finance.orderTime" />} key="tradeState" width="12%" dataIndex="tradeState.createTime" render={(v, i) => <span>{this._newDate(v)}</span>} />
        <Column title={<FormattedMessage id="Finance.orderNumber" />} key="id" dataIndex="id" width="18%" />
        <Column title={<FormattedMessage id="Finance.OrderAmount" />} key="tradePrice" dataIndex="tradePrice.totalPrice" width="11%" render={(OrderAmount) => <span>{OrderAmount != null ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + OrderAmount : '-'}</span>} />
        <Column title={<FormattedMessage id="Finance.RewardRate" />} key="orderRewardRate" dataIndex="orderRewardRate" width="11%" render={(orderRewardRate) => <span>{orderRewardRate != null ? `${orderRewardRate.toFixed(2)}%` : '-'}</span>} />
        <Column
          title={<FormattedMessage id="Finance.RewardRemark" />}
          dataIndex="firstOrderFlag"
          width="11%"
          key="firstOrderFlag"
          render={(firstOrderFlag, record: any, i) => (
            <span style={{ color: '#db0202' }}>
              <OptionDiv style={{ width: '100%' }}>
                <Tooltip
                  overlayStyle={{
                    overflowY: 'auto'
                    //height: 100
                  }}
                  placement="bottomLeft"
                  title={
                    <div>
                      <FormattedMessage id="Finance.FirstOrder" />：{record.prescriberReward ? record.prescriberReward.rewardRateFirst + '%' : '--'}
                      <br />
                      <FormattedMessage id="Finance.RepeatOrder" />：{record.prescriberReward ? record.prescriberReward.rewardRateMore + '%' : '--'}
                    </div>
                  }
                >
                  <span style={{ fontSize: 14 }}>{firstOrderFlag == 0 ? 'First' : 'Repeat'}</span>
                </Tooltip>
              </OptionDiv>
            </span>
          )}
        />

        <Column
          title={<FormattedMessage id="Finance.RewardAmount" />}
          dataIndex="orderRewardAmount"
          key="orderRewardAmount"
          width="11%"
          render={(orderRewardRate) => <span>{orderRewardRate != null ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + orderRewardRate : '-'}</span>}
          //render={(invoiceType) => <span>{invoiceTypeDic[invoiceType]}</span>}
        />
        <Column
          title=""
          dataIndex=""
          key=""
          width="1%"

          //render={(invoiceType) => <span>{invoiceTypeDic[invoiceType]}</span>}
        />
        {/*<Column
          title={<FormattedMessage id="RewardAmount" />}
          dataIndex="rewardAmount"
          key="rewardAmount"
          width="11%"
          render={(rewardAmount) => (
            <span>
              {rewardAmount != null ? `$${rewardAmount.toFixed(2)}` : '-'}
            </span>
          )}
        />*/}
      </DataGrid>
    );
  }

  _newDate(value) {
    return /\d{4}-\d{1,2}-\d{1,2}/g.exec(value);
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
            {<FormattedMessage id="Finance.view" />}
          </a>
        </AuthWrapper>

        <AuthWrapper functionName="destoryOpenOrderInvoice">
          <Popconfirm
            title={invoiceState == 0 ? <FormattedMessage id="Finance.ConfirmToBill" /> : <FormattedMessage id="Finance.CancelBillRecord" />}
            onConfirm={() => {
              invoiceState == 0 ? onConfirm(id) : onDestory(id);
            }}
            okText={<FormattedMessage id="Finance.Confirm" />}
            cancelText={<FormattedMessage id="Finance.Cancel" />}
          >
            <a href="javascript:void(0);">{invoiceState == 0 ? 'Billing' : 'Cancellation'}</a>
          </Popconfirm>
        </AuthWrapper>
      </div>
    );
  };
}
