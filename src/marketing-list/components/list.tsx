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
  0: 'Full amount minus',
  1: 'Full quantity minus',
  2: 'Full amount discount',
  3: 'Full quantity discount'
  // 4: '满金额赠',
  // 5: '满数量赠'
};

//默认每页展示的数量
const MARKETING_STATUS = {
  0: 'All',
  1: 'In process',
  2: 'Pause',
  3: 'No start',
  4: 'End'
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
    onStart: noop
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
      onStart
    } = this.props.relaxProps;
    return (
      <DataGrid
        loading={loading}
        rowKey="Campaign name"
        isScroll={false}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
        dataSource={dataList.toJS()}
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
          /*render={(subType) => {
            return SUB_TYPE[subType];
          }}*/
        />
        <Column
          title="Campaign type"
          key="marketingType"
          dataIndex="marketingType"
          /*render={(subType) => {
            return SUB_TYPE[subType];
          }}*/
        />
        <Column
          title="Promotion type"
          key="marketing_promotion_type"
          dataIndex="marketing_promotion_type"
          /*render={(subType) => {
            return SUB_TYPE[subType];
          }}*/
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

        <Column
          title="Campaign status"
          width="15%"
          key="joinLevel"
          dataIndex="joinLevel"
          render={(joinLevel) => {
            if (joinLevel == '-1') {
              return 'Full platform consumer';
            } else if (joinLevel == '0') {
              return 'All Leave';
            } else if (joinLevel != '') {
              return (
                <Tooltip
                  title={joinLevel
                    .split(',')
                    .map((info) =>
                      customerLevels
                        .filter((v) => v.get('customerLevelId') == info)
                        .getIn([0, 'customerLevelName'])
                    )
                    .filter((v) => v)
                    .join('，')}
                >
                  <div className="line-two">
                    {joinLevel
                      .split(',')
                      .map((info) =>
                        customerLevels
                          .filter((v) => v.get('customerLevelId') == info)
                          .getIn([0, 'customerLevelName'])
                      )
                      .filter((v) => v)
                      .join('，')}
                  </div>
                </Tooltip>
              );
            }
          }}
        />

        {/*<Column
          title="Activity Status"
          width="10%"
          key="marketingStatus"
          dataIndex="marketingStatus"
          render={(marketingStatus) => {
            return <span>{MARKETING_STATUS[marketingStatus]}</span>;
          }}
        />

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
                  <a
                    style={{ marginRight: 5 }}
                    href="javascript:void(0)"
                    onClick={() =>
                      history.push({
                        pathname: `/marketing-details/${rowInfo['marketingId']}`
                      })
                    }
                  >
                    View
                  </a>
                </AuthWrapper>
                <AuthWrapper functionName="f_marketing_operate">
                  {rowInfo['marketingStatus'] == 3 && (
                    <a
                      href="javascript:void(0)"
                      style={{ marginRight: 5 }}
                      onClick={() =>
                        history.push({
                          pathname: url
                        })
                      }
                    >
                      Edit
                    </a>
                  )}
                  {rowInfo['marketingStatus'] == 2 && (
                    <a
                      href="javascript:void(0);"
                      style={{ marginRight: 5 }}
                      onClick={() => onStart(rowInfo['marketingId'])}
                    >
                      Open
                    </a>
                  )}
                  {rowInfo['marketingStatus'] == 1 && (
                    <a
                      href="javascript:void(0);"
                      style={{ marginRight: 5 }}
                      onClick={() => onPause(rowInfo['marketingId'])}
                    >
                      Stop
                    </a>
                  )}
                  {rowInfo['marketingStatus'] == 3 && (
                    <Popconfirm
                      title="Are you sure to delete the activity?"
                      onConfirm={() => onDelete(rowInfo['marketingId'])}
                      okText="Confirm"
                      cancelText="Cancel"
                    >
                      <a href="javascript:void(0);" style={{ marginRight: 5 }}>
                        Delete
                      </a>
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
