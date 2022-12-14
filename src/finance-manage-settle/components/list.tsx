import React from 'react';

import { Relax } from 'plume2';
import { DataGrid, Const, noop, history, util, AuthWrapper } from 'qmkit';
import moment from 'moment';

import { IMap } from 'typings/globalType';
import { FormattedMessage } from 'react-intl';

import { Table, Tooltip } from 'antd';

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
    const { loading, settlePage, selected, checkedSettleIds, fetchSettleList, queryParams, onSelect, setCheckedSettleIds, changeSettleStatus } = this.props.relaxProps;
    return (
      <DataGrid
        loading={loading}
        rowKey="settleId"
        dataSource={settlePage.get('content') ? settlePage.get('content').toJS() : []}
        rowSelection={
          queryParams.get('settleStatus').toString() == 0
            ? {
                type: 'checkbox',
                selectedRowKeys: checkedSettleIds.toJS(),
                onChange: (selectedRowKeys, i) => {
                  setCheckedSettleIds(selectedRowKeys, i);
                }
              }
            : undefined
        }
        pagination={{
          total: settlePage.get('totalElements'),
          pageSize: settlePage.get('size'),
          current: settlePage.get('number') + 1,
          onChange: (pageNum, pageSize) => {
            fetchSettleList(pageNum - 1, pageSize);
          }
        }}
      >
        {queryParams.get('settleStatus') == 1 && (
          <Column
            title={<FormattedMessage id="Finance.statementTime" />}
            key="settleTime"
            dataIndex="settleTime"
            render={(value) => {
              return moment(value).format(Const.DAY_FORMAT).toString();
            }}
          />
        )}

        <Column
          title={<FormattedMessage id="Finance.SettlementStatementTime" />}
          key="createTime"
          dataIndex="createTime"
          render={(value) => {
            return moment(value).format(Const.DAY_FORMAT).toString();
          }}
        />

        <Column title={<FormattedMessage id="Finance.statementNumber" />} key="statementNo" dataIndex="settlementCode" />

        <Column
          title={<FormattedMessage id="Finance.statementPeriod" />}
          key="statementTime"
          render={(row) => {
            return `${row.startTime}???${row.endTime}`;
          }}
        />

        <Column title={<FormattedMessage id="Finance.storeName" />} key="storeName" dataIndex="storeName" />

        <Column
          title={<FormattedMessage id="Finance.Paymentamount" />}
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
          title="?????????????????????"
          key="commonCouponPrice"
          dataIndex="commonCouponPrice"
          render={(value) => {
            return util.FORMAT_YUAN(value);
          }}
        />

        <Column
          title="??????????????????"
          key="pointPrice"
          dataIndex="pointPrice"
          render={(value) => {
            return util.FORMAT_YUAN(value);
          }}
        />

        <Column
          title="??????????????????"
          key="platformPrice"
          dataIndex="platformPrice"
          render={(value) => {
            return util.FORMAT_YUAN((Math.floor(value * 100) / 100).toFixed(2));
          }}
        />

        <Column
          title="??????????????????"
          key="commissionPrice"
          dataIndex="commissionPrice"
          render={(value) => {
            return util.FORMAT_YUAN(value);
          }}
        />

        <Column
          title="??????????????????"
          key="storePrice"
          dataIndex="storePrice"
          render={(value) => {
            return util.FORMAT_YUAN((Math.floor(value * 100) / 100).toFixed(2));
          }}
        /> */}

        <Column
          title={<FormattedMessage id="Finance.operation" />}
          key="operation"
          render={(row) => {
            return (
              <AuthWrapper functionName="f_billing_details">
                <Tooltip placement="top" title={<FormattedMessage id="Finance.Details" />}>
                  <a
                    onClick={() =>
                      history.push({
                        pathname: `/billing-details/${row.settleId}`,
                        state: {
                          settlementType: queryParams.get('settleStatus').toString() == 0 ? 'UnSettlement details' : 'Settlement details'
                        }
                      })
                    }
                    className="iconfont iconDetails"
                  ></a>
                </Tooltip>
              </AuthWrapper>
            );
          }}
        />
      </DataGrid>
    );
  }

  /**
   * ????????????
   * @param status
   * @private
   */
  _handleBatchOption = (settleId, status) => {
    const { changeSettleStatus } = this.props.relaxProps;
    changeSettleStatus([settleId], status);
  };
}
