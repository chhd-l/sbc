import React from 'react';
import { Link } from 'react-router-dom';
import { Relax } from 'plume2';
import { AuthWrapper, noop, history, cache } from 'qmkit';
import { IList } from 'typings/globalType';
import { Popconfirm, Table as DataGrid } from 'antd';
import '../index.less';
import { FormattedMessage } from 'react-intl';
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
      <>
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
          <DataGrid.Column className="max-td" title={<FormattedMessage id="Marketing.CouponName" />} dataIndex="couponName" key="couponName" />
          <DataGrid.Column title={`Face value(${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)})`} dataIndex="denominationStr" key="denominationStr" />
          <DataGrid.Column title={<FormattedMessage id="Marketing.ValidPerio" />} dataIndex="validity" key="validity" />
          {/* <DataGrid.Column
          title="优惠券分类"
          dataIndex="cateNamesStr"
          key="cateNamesStr"
          render={(value) =>
            value.length > 12 ? `${value.substring(0, 12)}...` : value
          }
        /> */}
          {/* <DataGrid.Column title="Use range" dataIndex="scopeNamesStr" key="scopeNamesStr" render={(value) => (value.length > 12 ? `${value.substring(0, 12)}...` : value)} /> */}
          <DataGrid.Column title={<FormattedMessage id="Marketing.Status" />} dataIndex="couponStatusStr" key="couponStatusStr" />
          <DataGrid.Column
            title={<FormattedMessage id="Marketing.Operation" />}
            key="operate"
            className={'operation-th'}
            dataIndex="isFree"
            render={(text, record) => {
              return (
                <div className="operation-box">
                  <AuthWrapper functionName={'f_coupon_detail'}>
                    {text == 0 && ( //0 有活动
                      <span
                        className="link"
                        onClick={() => {
                          couponExport((record as any).couponId);
                        }}
                        style={{ marginRight: 10 }}
                      >
                        <FormattedMessage id="Marketing.Export" />
                      </span>
                    )}
                  </AuthWrapper>
                  <AuthWrapper functionName={'f_coupon_detail'}>
                    <Link to={`/coupon-detail/${(record as any).couponId}`} style={{ marginRight: 10, paddingLeft: 0 }}>
                      <FormattedMessage id="Marketing.View" />
                    </Link>
                  </AuthWrapper>
                  <AuthWrapper functionName={'f_coupon_editor'}>
                    {text == 1 && (
                      <span
                        className="createMarket link"
                        onClick={() =>
                          history.push({
                            pathname: `/coupon-edit/${(record as any).couponId}`,
                            state: {
                              couponType: '1'
                            }
                          })
                        }
                      >
                        <FormattedMessage id="Marketing.Edit" />
                      </span>
                    )}

                    <span
                      className="link"
                      onClick={() => {
                        copyCoupon((record as any).couponId);
                      }}
                    >
                      <FormattedMessage id="Marketing.Copy" />
                    </span>

                    {text == 1 && (
                      <Popconfirm title={<FormattedMessage id="Marketing.deleteThisCoupon" />} onConfirm={() => deleteCoupon((record as any).couponId)} okText="Yes" cancelText="Cancel">
                        <span className="link">
                          <FormattedMessage id="Marketing.Delete" />
                        </span>
                      </Popconfirm>
                    )}
                  </AuthWrapper>
                </div>
              );
            }}
          />
        </DataGrid>
      </>
    );
  }
}
