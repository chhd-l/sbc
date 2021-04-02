import React from 'react';
import { Link } from 'react-router-dom';
import { Relax } from 'plume2';
import moment from 'moment';
import { AuthWrapper, Const, DataGrid, noop, util } from 'qmkit';
import { IList } from 'typings/globalType';
import { Popconfirm } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
@Relax
export default class List extends React.Component<any, any> {
  props: {
    relaxProps?: {
      total: number;
      pageNum: number;
      pageSize: number;
      couponActivityList: IList;
      levelList: IList;

      deleteActivity: Function;
      init: Function;
      pauseActivity: Function;
      startActivity: Function;
      loading: boolean;
    };
  };

  static relaxProps = {
    total: 'total',
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    couponActivityList: 'couponActivityList',
    levelList: 'levelList',

    deleteActivity: noop,
    init: noop,
    pauseActivity: noop,
    startActivity: noop,
    loading: 'loading'
  };

  render() {
    const { total, pageNum, pageSize, couponActivityList, init, loading } = this.props.relaxProps;
    return (
      <DataGrid
        loading={{ spinning: loading, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" /> }}
        rowKey={(record) => record.activityId}
        dataSource={couponActivityList.toJS()}
        pagination={{
          current: pageNum,
          pageSize,
          total,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
      >
        <DataGrid.Column title={<FormattedMessage id="Marketing.ActivityName" />} dataIndex="activityName" key="activityName" />
        {/* <DataGrid.Column
          title="Activity type"
          dataIndex="couponActivityType"
          key="couponActivityType"
          render={(text) => {
            return Const.couponActivityType[text];
          }}
        /> */}
        <DataGrid.Column
          title={
            <p>
              <FormattedMessage id="Marketing.StartTime" />
              <br />
              <FormattedMessage id="Marketing.EndTime" />
            </p>
          }
          dataIndex="startTime"
          key="startTime"
          render={(text, record) => {
            return (
              <div>
                <p>{moment(text).format(Const.TIME_FORMAT).toString()}</p>
                <p>
                  {moment((record as any).endTime)
                    .format(Const.TIME_FORMAT)
                    .toString()}
                </p>
              </div>
            );
          }}
        />
        {/* <DataGrid.Column
          title="Target customers"
          dataIndex="joinLevel"
          key="joinLevel"
          render={(text) => {
            return this.showTargetCustomer(text);
          }}
        /> */}
        <DataGrid.Column
          title={<FormattedMessage id="Marketing.Status" />}
          dataIndex="marketingStatus"
          key="marketingStatus"
          render={(text) => {
            return Const.activityStatus[text];
          }}
        />
        {/*pauseFlag*/}
        <DataGrid.Column
          title={<FormattedMessage id="Marketing.Operation" />}
          key="operate"
          className={'operation-th'}
          dataIndex="marketingStatus"
          render={(text, record) => {
            return this.operator(text, record);
          }}
        />
      </DataGrid>
    );
  }

  /**
   * 展示目标客户
   */
  showTargetCustomer(text) {
    const { levelList } = this.props.relaxProps;
    if (text == null) {
      return;
    }
    if (-1 == text) {
      return util.isThirdStore() ? '全部客户' : '全平台客户';
    } else if (0 == text) {
      return '全部等级';
    } else if (-2 == text) {
      return '指定客户';
    } else {
      let str = '';
      text.split(',').forEach((item) => {
        const level = levelList.find((i) => i.get('key') == item);
        if (level == null) {
          return;
        }
        str = str + level.get('value') + ',';
      });
      str = str.substring(0, str.length - 1);
      if (str == '') {
        str = '-';
      }
      return str;
    }
  }

  /**
   * 操作按钮
   * @param record
   * @returns {any}
   */
  private operator(text, record: any) {
    const { startActivity, pauseActivity, deleteActivity } = this.props.relaxProps;
    let activityType = 'all-present';
    if (record.couponActivityType == 1) {
      activityType = 'specify';
    } else if (record.couponActivityType == 2) {
      activityType = 'store';
    }
    const url = `/coupon-activity-${activityType}/${(record as any).activityId}`;
    return (
      <div className="operation-box">
        <AuthWrapper functionName={'f_coupon_activity_detail'}>
          <Link to={`/coupon-activity-detail/${record.activityId}/${record.couponActivityType}`}>View</Link>
        </AuthWrapper>
        {/*<AuthWrapper functionName={'f_coupon_activity_editor'}>*/}
        {/*  {activityType != 'specify' && text == 1 && (*/}
        {/*    <a*/}
        {/*      href="javascript:void(0);"*/}
        {/*      onClick={() => {*/}
        {/*        pauseActivity(record.activityId);*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      Pause*/}
        {/*    </a>*/}
        {/*  )}*/}
        {/*  {activityType != 'specify' && text == 2 && (*/}
        {/*    <a*/}
        {/*      href="javascript:void(0);"*/}
        {/*      onClick={() => {*/}
        {/*        startActivity(record.activityId);*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      Start*/}
        {/*    </a>*/}
        {/*  )}*/}
        {/*  {text == 3 && <Link to={url}>Edit</Link>}*/}
        {/*  {text == 3 && (*/}
        {/*    <Popconfirm title="Are you sure to delete this activity?" onConfirm={() => deleteActivity(record.activityId)} okText="Yes" cancelText="Cancel">*/}
        {/*      <a href="javascript:void(0);">Delete</a>*/}
        {/*    </Popconfirm>*/}
        {/*  )}*/}
        {/*</AuthWrapper>*/}
      </div>
    );
  }
}
