import React from 'react';

import { Relax } from 'plume2';
import { DataGrid, Const, noop, history, util, AuthWrapper } from 'qmkit';
import moment from 'moment';

import { IMap } from 'typings/globalType';
import { FormattedMessage } from 'react-intl';

import { Table } from 'antd';

const Column = Table.Column;

@Relax
export default class List extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      settlePage: IMap;
      setCheckedSettleIds: Function;
      changeSettleStatus: Function;
      checkedSettleIds: any;
      queryParams: IMap;
      fetchSettleList: Function;
      selected: any;
      onSelect: Function;
      onSelectChange: Function;
    };
  };

  static relaxProps = {
    settlePage: 'settlePage',
    loading: 'loading',
    selected: 'selected',
    setCheckedSettleIds: noop,
    changeSettleStatus: noop,
    checkedSettleIds: 'checkedSettleIds',
    queryParams: 'queryParams',
    fetchSettleList: noop,
    onSelect: noop
  };

  render() {
    const {
      loading,
      settlePage,
      selected,
      checkedSettleIds,
      fetchSettleList,
      queryParams,
      onSelect,
      setCheckedSettleIds,
      changeSettleStatus
    } = this.props.relaxProps;
    return (
      <DataGrid
        loading={loading}
        rowKey="settleId"
        dataSource={
          settlePage.get('content') ? settlePage.get('content').toJS() : []
        }
        rowSelection={
          queryParams.get('settleStatus').toString() == 0
            ? {
                type: 'checkbox',
                selectedRowKeys: checkedSettleIds.toJS(),
                onChange: (selectedRowKeys, i) => {
                  setCheckedSettleIds(selectedRowKeys, i);
                }
              }
            : ''
        }
        pagination={{
          total: settlePage.get('totalElements'),
          pageSize: settlePage.get('size'),
          current: settlePage.get('number') + 1
        }}
      >
        {queryParams.get('settleStatus') == 1 && (
          <Column
            title={<FormattedMessage id="statementTime" />}
            key="settleTime"
            dataIndex="settleTime"
            render={(value) => {
              return moment(value).format(Const.DAY_FORMAT).toString();
            }}
          />
        )}

        <Column
          title={<FormattedMessage id="SettlementStatementTime" />}
          key="createTime"
          dataIndex="createTime"
          render={(value) => {
            return moment(value).format(Const.DAY_FORMAT).toString();
          }}
        />

        <Column
          title={<FormattedMessage id="statementNumber" />}
          key="statementNo"
          dataIndex="settlementCode"
        />

        <Column
          title={<FormattedMessage id="statementPeriod" />}
          key="statementTime"
          render={(row) => {
            return `${row.startTime}～${row.endTime}`;
          }}
        />

        <Column
          title={<FormattedMessage id="storeName" />}
          key="storeName"
          dataIndex="storeName"
        />

        <Column
          title={<FormattedMessage id="Paymentamount" />}
          key="splitPayPrice"
          dataIndex="splitPayPrice"
          render={(value) => {
            return util.FORMAT_YUAN(value);
          }}
        />

        {/* <Column
          title={<FormattedMessage id="totalFreight" />}
          key="deliveryPrice"
          dataIndex="deliveryPrice"
          render={(value) => {
            return util.FORMAT_YUAN(value);
          }}
        />*/}

        {/* <Column
          title="通用券优惠总额"
          key="commonCouponPrice"
          dataIndex="commonCouponPrice"
          render={(value) => {
            return util.FORMAT_YUAN(value);
          }}
        />

        <Column
          title="积分抵扣总额"
          key="pointPrice"
          dataIndex="pointPrice"
          render={(value) => {
            return util.FORMAT_YUAN(value);
          }}
        />

        <Column
          title="平台佣金总额"
          key="platformPrice"
          dataIndex="platformPrice"
          render={(value) => {
            return util.FORMAT_YUAN((Math.floor(value * 100) / 100).toFixed(2));
          }}
        />

        <Column
          title="分销佣金总额"
          key="commissionPrice"
          dataIndex="commissionPrice"
          render={(value) => {
            return util.FORMAT_YUAN(value);
          }}
        />

        <Column
          title="店铺应收总额"
          key="storePrice"
          dataIndex="storePrice"
          render={(value) => {
            return util.FORMAT_YUAN((Math.floor(value * 100) / 100).toFixed(2));
          }}
        /> */}

        <Column
          title={<FormattedMessage id="operation" />}
          key="operation"
          render={(row) => {
            return (
              <AuthWrapper functionName="f_billing_details">
                <a
                  onClick={() =>
                    history.push({
                      pathname: `/billing-details/${row.settleId}`,
                      state: {
                        settlementType:
                          queryParams.get('settleStatus').toString() == 0
                            ? 'UnSettlement details'
                            : 'Settlement details'
                      }
                    })
                  }
                >
                  {<FormattedMessage id="inquiryDetails" />}
                </a>
              </AuthWrapper>
            );
          }}
        />
      </DataGrid>
    );
  }

  /**
   * 批量操作
   * @param status
   * @private
   */
  _handleBatchOption = (settleId, status) => {
    const { changeSettleStatus } = this.props.relaxProps;
    console.log(settleId);
    changeSettleStatus([settleId], status);
  };
}
