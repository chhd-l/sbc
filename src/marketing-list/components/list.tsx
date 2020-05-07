import * as React from 'react';
import { Relax } from 'plume2';
import { List } from 'immutable';
import { Popconfirm, Tooltip } from 'antd';
import moment from 'moment';
import { withRouter } from 'react-router';
import { DataGrid, noop, history, AuthWrapper, Const } from 'qmkit';
import { IList, IMap } from 'typings/globalType';

type TList = List<IMap>;

const { Column } = DataGrid;

//默认每页展示的数量
const SUB_TYPE = {
  0: '满金额减',
  1: '满数量减',
  2: '满金额折',
  3: '满数量折',
  4: '满金额赠',
  5: '满数量赠'
};

//默认每页展示的数量
const MARKETING_STATUS = {
  0: '全部',
  1: '进行中',
  2: '暂停中',
  3: '未开始',
  4: '已结束'
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
        rowKey="marketingId"
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
        <Column
          title="活动名称"
          width="20%"
          key="marketingName"
          dataIndex="marketingName"
          render={marketingName => {
            return marketingName ? (
              <div className="line-two">{marketingName}</div>
            ) : (
              <span>-</span>
            );
          }}
        />

        <Column
          title="活动类型"
          key="subType"
          width="10%"
          dataIndex="subType"
          render={subType => {
            return SUB_TYPE[subType];
          }}
        />

        <Column
          title={<p>开始<br/>结束时间</p>}
          width="20%"
          render={rowData => {
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
          title="目标客户"
          width="25%"
          key="joinLevel"
          dataIndex="joinLevel"
          render={joinLevel => {
            if (joinLevel == '-1') {
              return '全平台客户';
            } else if (joinLevel == '0') {
              return '全部等级';
            } else if (joinLevel != '') {
              return (
                <Tooltip
                  title={joinLevel
                    .split(',')
                    .map(info =>
                      customerLevels
                        .filter(v => v.get('customerLevelId') == info)
                        .getIn([0, 'customerLevelName'])
                    )
                    .filter(v => v)
                    .join('，')}
                >
                  <div className="line-two">
                    {joinLevel
                      .split(',')
                      .map(info =>
                        customerLevels
                          .filter(v => v.get('customerLevelId') == info)
                          .getIn([0, 'customerLevelName'])
                      )
                      .filter(v => v)
                      .join('，')}
                  </div>
                </Tooltip>
              );
            }
          }}
        />

        <Column
          title="活动状态"
          width="10%"
          key="marketingStatus"
          dataIndex="marketingStatus"
          render={marketingStatus => {
            return <span>{MARKETING_STATUS[marketingStatus]}</span>;
          }}
        />

        <Column
          title="操作"
          width="15%"
          className={'operation-th'}
          render={rowInfo => {
            let url = '';
            if (rowInfo['subType'] === 0 || rowInfo['subType'] === 1) {
              url = `/marketing-full-reduction/${rowInfo['marketingId']}`;
            } else if (rowInfo['subType'] === 2 || rowInfo['subType'] === 3) {
              url = `/marketing-full-discount/${rowInfo['marketingId']}`;
            } else if (rowInfo['subType'] === 4 || rowInfo['subType'] === 5) {
              url = `/marketing-full-gift/${rowInfo['marketingId']}`;
            }

            return (
              <div className="operation-box">
                <AuthWrapper functionName="f_marketing_view">
                  <a
                    href="javascript:void(0)"
                    onClick={() =>
                      history.push({
                        pathname: `/marketing-details/${rowInfo['marketingId']}`
                      })
                    }
                  >
                    查看
                  </a>
                </AuthWrapper>
                <AuthWrapper functionName="f_marketing_operate">
                  {rowInfo['marketingStatus'] == 3 && (
                    <a
                      href="javascript:void(0)"
                      onClick={() =>
                        history.push({
                          pathname: url
                        })
                      }
                    >
                      编辑
                    </a>
                  )}
                  {rowInfo['marketingStatus'] == 2 && (
                    <a
                      href="javascript:void(0);"
                      onClick={() => onStart(rowInfo['marketingId'])}
                    >
                      开启
                    </a>
                  )}
                  {rowInfo['marketingStatus'] == 1 && (
                    <a
                      href="javascript:void(0);"
                      onClick={() => onPause(rowInfo['marketingId'])}
                    >
                      暂停
                    </a>
                  )}
                  {rowInfo['marketingStatus'] == 3 && (
                    <Popconfirm
                      title="确定删除该活动？"
                      onConfirm={() => onDelete(rowInfo['marketingId'])}
                      okText="确定"
                      cancelText="取消"
                    >
                      <a href="javascript:void(0);">删除</a>
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
