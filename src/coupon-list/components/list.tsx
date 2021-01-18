import React from 'react';
import { Link } from 'react-router-dom';
import { Relax } from 'plume2';
import { AuthWrapper, DataGrid, noop, history, cache } from 'qmkit';
import { IList } from 'typings/globalType';
import { Popconfirm } from 'antd';

@Relax
export default class List extends React.Component<any, any> {
  props: {
    relaxProps?: {
      total: number;
      pageNum: number;
      pageSize: number;
      couponList: IList;
      deleteCoupon: Function;
      init: Function;
      copyCoupon: Function;
      couponExport: Function;
      loading: boolean;
    };
  };

  static relaxProps = {
    total: 'total',
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    couponList: 'couponList',
    deleteCoupon: noop,
    init: noop,
    copyCoupon: noop,
    couponExport: noop,
    loading: 'loading'
  };

  render() {
    const { total, pageNum, pageSize, couponList, deleteCoupon, init, copyCoupon, couponExport, loading } = this.props.relaxProps;
    return (
      <DataGrid
        loading={{ spinning: loading, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" /> }}
        rowKey={(record) => record.couponId}
        dataSource={couponList.toJS()}
        pagination={{
          current: pageNum,
          pageSize,
          total,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
      >
        <DataGrid.Column title="Coupon name" dataIndex="couponName" key="couponName" />
        <DataGrid.Column title={`Face value(${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)})`} dataIndex="denominationStr" key="denominationStr" />
        <DataGrid.Column title="Valid period" dataIndex="validity" key="validity" />
        {/* <DataGrid.Column
          title="优惠券分类"
          dataIndex="cateNamesStr"
          key="cateNamesStr"
          render={(value) =>
            value.length > 12 ? `${value.substring(0, 12)}...` : value
          }
        /> */}
        {/* <DataGrid.Column title="Use range" dataIndex="scopeNamesStr" key="scopeNamesStr" render={(value) => (value.length > 12 ? `${value.substring(0, 12)}...` : value)} /> */}
        <DataGrid.Column title="Status" dataIndex="couponStatusStr" key="couponStatusStr" />
        <DataGrid.Column
          title="Operation"
          key="operate"
          className={'operation-th'}
          dataIndex="isFree"
          render={(text, record) => {
            return (
              <div className="operation-box">
                <AuthWrapper functionName={'f_coupon_detail'}>
                  <Link
                    onClick={() => {
                      couponExport((record as any).couponId);
                    }}
                    style={{ marginRight: 10 }}
                  >
                    Export
                  </Link>
                </AuthWrapper>
                <AuthWrapper functionName={'f_coupon_detail'}>
                  <Link to={`/coupon-detail/${(record as any).couponId}`} style={{ marginRight: 10 }}>
                    View
                  </Link>
                </AuthWrapper>
                <AuthWrapper functionName={'f_coupon_editor'}>
                  {text == 1 && (
                    <a
                      className="createMarket"
                      onClick={() =>
                        history.push({
                          pathname: `/coupon-edit/${(record as any).couponId}`,
                          state: {
                            couponType: '1'
                          }
                        })
                      }
                    >
                      Edit &nbsp;&nbsp;
                    </a>
                  )}

                  <a
                    href="javascript:void(0);"
                    onClick={() => {
                      copyCoupon((record as any).couponId);
                    }}
                  >
                    Copy
                  </a>

                  {text == 1 && (
                    <Popconfirm title="Are you sure to delete this coupon?" onConfirm={() => deleteCoupon((record as any).couponId)} okText="Yes" cancelText="Cancel">
                      <a href="javascript:void(0);">Delete</a>
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
