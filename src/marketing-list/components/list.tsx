import * as React from 'react';
import { Relax } from 'plume2';
import { List } from 'immutable';
import { Popconfirm, Tooltip } from 'antd';
import moment from 'moment';
import { withRouter } from 'react-router';
import { DataGrid, noop, history, AuthWrapper, Const } from 'qmkit';
import { IList, IMap } from 'typings/globalType';
import { Table } from 'antd';

type TList = List<IMap>;

const Column = Table.Column;

//默认每页展示的数量
const SUB_TYPE = {
  0: 'Full amount reduction',
  1: 'Full quantity reduction',
  2: 'Full amount discount',
  3: 'Full quantity discount',
  6: '',
  7: ''
  // 4: '满金额赠',
  // 5: '满数量赠'
};
const PROMOTION_TYPE = {
  0: 'Normal promotion',
  1: 'Subscription promotion'
};

//默认每页展示的数量
const MARKETING_STATUS = {
  0: 'All',
  1: 'In process',
  2: 'Pause',
  3: 'Not start',
  4: 'Completed'
};

@withRouter
@Relax
export default class MarketingList extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      loading: boolean;
      dataList: IList;
      total: number;
      pageSize: number;
      currentPage: number;
      onDelete: Function;
      init: Function;
      form: any;
      onPause: Function;
      customerLevels: TList;
      onStart: Function;
      close: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    currentPage: 'currentPage',
    dataList: 'dataList',
    onDelete: noop,
    init: noop,
    form: 'form',
    onPause: noop,
    customerLevels: ['customerLevels'],
    onStart: noop,
    close: noop
  };

  render() {
    const {
      loading,
      dataList,
      pageSize,
      total,
      currentPage,
      init,
      onDelete,
      customerLevels,
      onPause,
      close,
      onStart
    } = this.props.relaxProps;
    return (
      <DataGrid
        loading={loading}
        rowKey={(record) => record.marketingId}
        isScroll={false}
        dataSource={dataList.toJS()}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
      >
        {/*<Column
          title="Campaign type"
          width="15%"
          key="marketingName"
          dataIndex="marketingName"
          ellipsis
          render={(marketingName) => {
            return marketingName ? (
              <div className="line-two">{marketingName}</div>
            ) : (
              <span>-</span>
            );
          }}
        />*/}
        <Column
          title="Campaign name"
          key="marketingName"
          dataIndex="marketingName"
        />
        <Column
          title="Promotion type"
          key="promotionType"
          dataIndex="promotionType"
          render={(promotionType) => {
            return PROMOTION_TYPE[promotionType];
          }}
        />
        <Column
          title="Campaign type"
          key="subType"
          dataIndex="subType"
          render={(subType) => {
            return SUB_TYPE[subType];
          }}
        />
        <Column
          title="Time"
          width="15%"
          render={(rowData) => {
            return (
              <div>
                {moment(rowData['beginTime'])
                  .format(Const.TIME_FORMAT)
                  .toString()}
                <br />
                {moment(rowData['endTime'])
                  .format(Const.TIME_FORMAT)
                  .toString()}
              </div>
            );
          }}
        />

        {/*<Column*/}
        {/*  title="Campaign status"*/}
        {/*  width="15%"*/}
        {/*  key="joinLevel"*/}
        {/*  dataIndex="joinLevel"*/}
        {/*  render={(joinLevel) => {*/}
        {/*    if (joinLevel == '-1') {*/}
        {/*      return 'Full platform consumer';*/}
        {/*    } else if (joinLevel == '0') {*/}
        {/*      return 'All Leave';*/}
        {/*    } else if (joinLevel != '') {*/}
        {/*      return (*/}
        {/*        <Tooltip*/}
        {/*          title={joinLevel*/}
        {/*            .split(',')*/}
        {/*            .map((info) =>*/}
        {/*              customerLevels*/}
        {/*                .filter((v) => v.get('customerLevelId') == info)*/}
        {/*                .getIn([0, 'customerLevelName'])*/}
        {/*            )*/}
        {/*            .filter((v) => v)*/}
        {/*            .join('，')}*/}
        {/*        >*/}
        {/*          <div className="line-two">*/}
        {/*            {joinLevel*/}
        {/*              .split(',')*/}
        {/*              .map((info) =>*/}
        {/*                customerLevels*/}
        {/*                  .filter((v) => v.get('customerLevelId') == info)*/}
        {/*                  .getIn([0, 'customerLevelName'])*/}
        {/*              )*/}
        {/*              .filter((v) => v)*/}
        {/*              .join('，')}*/}
        {/*          </div>*/}
        {/*        </Tooltip>*/}
        {/*      );*/}
        {/*    }*/}
        {/*  }}*/}
        {/*/>*/}

        <Column
          title="Campaign Status"
          width="10%"
          key="marketingStatus"
          dataIndex="marketingStatus"
          render={(marketingStatus) => {
            return <span>{MARKETING_STATUS[marketingStatus]}</span>;
          }}
        />
        {/*
        <Column
          title="Promotion Code"
          key="promotionCode"
          width="10%"
          dataIndex="promotionCode"
        />*/}

        <Column
          title="Operation"
          width="15%"
          className={'operation-th'}
          render={(rowInfo) => {
            let url = '';
            if (
              rowInfo['subType'] === 0 ||
              rowInfo['subType'] === 1 ||
              rowInfo['subType'] === 6
            ) {
              url = `/marketing-full-reduction/${rowInfo['marketingId']}`;
            } else if (
              rowInfo['subType'] === 2 ||
              rowInfo['subType'] === 3 ||
              rowInfo['subType'] === 7
            ) {
              url = `/marketing-full-discount/${rowInfo['marketingId']}`;
            } else if (rowInfo['subType'] === 4 || rowInfo['subType'] === 5) {
              url = `/marketing-full-gift/${rowInfo['marketingId']}`;
            }

            return (
              <div className="operation-box">
                <AuthWrapper functionName="f_marketing_view">
                  <Tooltip placement="top" title="View">
                    <a
                      style={{ marginRight: 5 }}
                      href="javascript:void(0)"
                      onClick={() =>
                        history.push({
                          pathname: `/marketing-details/${rowInfo['marketingId']}`
                        })
                      }
                      className="iconfont iconView"
                    ></a>
                  </Tooltip>
                </AuthWrapper>
                <AuthWrapper functionName="f_marketing_operate">
                  {rowInfo['marketingStatus'] == 3 && (
                    <Tooltip placement="top" title="Edit">
                      <a
                        href="javascript:void(0)"
                        style={{ marginRight: 5 }}
                        onClick={() =>
                          history.push({
                            pathname: url
                          })
                        }
                        className="iconfont iconEdit"
                      ></a>
                    </Tooltip>
                  )}
                  {rowInfo['marketingStatus'] == 2 && (
                    <Tooltip placement="top" title="Open">
                      <a
                        href="javascript:void(0);"
                        style={{ marginRight: 5 }}
                        onClick={() => onStart(rowInfo['marketingId'])}
                        className="iconfont iconbtn-open"
                      ></a>
                    </Tooltip>
                  )}
                  {rowInfo['marketingStatus'] == 1 && (
                    <Tooltip placement="top" title="Stop">
                      <a
                        href="javascript:void(0);"
                        style={{ marginRight: 5 }}
                        onClick={() => onPause(rowInfo['marketingId'])}
                        className="iconfont iconbtn-stop"
                      ></a>
                    </Tooltip>
                  )}
                  {rowInfo['marketingStatus'] == 1 && (
                    <Tooltip placement="top" title="Close">
                      <a
                        style={{ marginRight: 5 }}
                        onClick={() => close(rowInfo['marketingId'])}
                        className="iconfont iconbtn-cancelall"
                      ></a>
                    </Tooltip>
                  )}
                  {rowInfo['marketingStatus'] == 3 && (
                    <Popconfirm
                      title="Are you sure to delete the activity?"
                      onConfirm={() => onDelete(rowInfo['marketingId'])}
                      okText="Confirm"
                      cancelText="Cancel"
                    >
                      <Tooltip placement="top" title="Delete">
                        <a
                          href="javascript:void(0);"
                          style={{ marginRight: 5 }}
                          className="iconfont iconDelete"
                        ></a>
                      </Tooltip>
                    </Popconfirm>
                  )}
                </AuthWrapper>
              </div>
            );
          }}
        />
      </DataGrid>
    );
  }
}
