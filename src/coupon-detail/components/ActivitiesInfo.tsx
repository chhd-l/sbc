import React, { Component } from 'react';
import { AuthWrapper, Const, noop } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Tooltip, Spin, Table } from 'antd';
import { Relax, IMap } from 'plume2';
import moment from 'moment';

@Relax
class ActivitiesInfo extends Component<any, any> {
  props: {
    relaxProps?: {
      total: number;
      pageNum: number;
      pageSize: number;
      init: Function;
      couponExport: Function;
      // 信息
      couponActivityConfigPage: IMap;
      loading: boolean;
    };
  };
  static relaxProps = {
    total: 'total',
    init: noop,
    couponExport: noop,
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    loading: 'loading',
    couponActivityConfigPage: 'couponActivityConfigPage'
  };

  render() {
    const {
      couponActivityConfigPage,
      loading,
      total,
      pageNum,
      pageSize,
      init,
      couponExport
    } = this.props.relaxProps;
    const {couponId} = this.props
    const { content } = couponActivityConfigPage;
    const columns = [
      {
        title: <FormattedMessage id="Marketing.ActivityName" />,
        render: (text, record) => {
          return record.couponActivity?.activityName;
        }
      },
      {
        title: <FormattedMessage id="Marketing.lssuanceTime" />,
        render: (text, record) => {
          return moment((record as any).couponActivity.createTime).format(Const.TIME_FORMAT).toString();
        }
      },
      {
        title: <FormattedMessage id="Marketing.validPeriod" />,
        render: (text, record) => {
          return (
            <div>
              <p>{moment((record as any).couponActivity.startTime).format(Const.TIME_FORMAT).toString()}</p>
              <p>
                {moment((record as any).couponActivity.endTime)
                  .format(Const.TIME_FORMAT)
                  .toString()}
              </p>
            </div>
          );
        }
      },
      {
        title: <FormattedMessage id="Marketing.totalNumber" />,
        dataIndex: 'totalCount'
      },
      {
        title: <FormattedMessage id="Marketing.status" />,
        render: (text, record) => {
          return Const.activityStatus[record.couponActivity?.marketingStatus];
        }
      },
      {
        title: <FormattedMessage id="Marketing.Operation" />,
        dataIndex: 'Operation',
        render: (text, record) => (
          <AuthWrapper functionName="f_interface_details">
            <a onClick={() => {
              couponExport((record as any).couponId,(record as any).activityId);
            }}>
              <Tooltip placement="top" title={<FormattedMessage id="Marketing.Export" />}>
                <span className="icon iconfont iconOffShelves" style={{ fontSize: 20 }}></span>
              </Tooltip>
            </a>
          </AuthWrapper>
        )
      }
    ];

    return (
      <Spin spinning={loading}>
        <Table
          dataSource={content}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            onChange: (pageNum, pageSize) => {
              init(couponId, { pageNum: pageNum-1, pageSize });
            }
          }}
          columns={columns}
          rowKey={(record) => record?.activityId}
        />
      </Spin>
    );
  }
}

export default ActivitiesInfo;
