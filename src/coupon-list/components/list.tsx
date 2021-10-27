import React from 'react';
import { Link } from 'react-router-dom';
import { Relax } from 'plume2';
import { AuthWrapper, noop, history, cache, RCi18n } from 'qmkit';
import { IList } from 'typings/globalType';
import { Popconfirm, Table as DataGrid, Tooltip } from 'antd';
import '../index.less';
import { FormattedMessage } from 'react-intl';
import CouponModal from '@/coupon-list/components/couponModal';

const PROMOTION_TYPE = {
  0: RCi18n({ id: 'Marketing.All' }),
  1: RCi18n({ id: 'Marketing.Autoship' }),
  2: RCi18n({ id: 'Marketing.Clubpromotion' }),
  3: RCi18n({ id: 'Marketing.Singlepurchase' })
};
@Relax
export default class List extends React.Component<any, any> {
  props: {
    relaxProps?: {
      total: number;
      couponId: string;
      pageNum: number;
      pageSize: number;
      couponList: IList;
      deleteCoupon: Function;
      init: Function;
      copyCoupon: Function;
      couponExport: Function;
      handleAdd: Function;
      setModalVisible: Function;
      loading: boolean;
      isModalVisible: boolean;
    };
  };
  static relaxProps = {
    total: 'total',
    couponId: 'couponId',
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    couponList: 'couponList',
    deleteCoupon: noop,
    init: noop,
    copyCoupon: noop,
    couponExport: noop,
    handleAdd: noop,
    setModalVisible: noop,
    loading: 'loading',
    isModalVisible: 'isModalVisible',
  };
  render() {
    const {
      total,
      pageNum,
      pageSize,
      couponList,
      deleteCoupon,
      init,
      copyCoupon,
      couponExport,
      handleAdd,
      loading,
      isModalVisible,
      setModalVisible,
      couponId
    } = this.props.relaxProps;
    return (
      <>
        <CouponModal
          isModalVisible={isModalVisible}
          setVisible={setModalVisible}
          couponId={couponId}/>
        <DataGrid
          loading={loading}
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
          <DataGrid.Column className="max-td" title={<FormattedMessage id="Marketing.CouponName" />}
                           dataIndex="couponName" key="couponName" />
          <DataGrid.Column className="max-td" title={<FormattedMessage id="Marketing.PromotionType" />}
                           dataIndex="couponPurchaseType" key="couponPurchaseType"
                           render={(couponPurchaseType) => {
                             return PROMOTION_TYPE[couponPurchaseType];
                           }}
          />
          <DataGrid.Column title={`Face value(${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)})`}
                           dataIndex="denominationStr" key="denominationStr" />
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
          <DataGrid.Column title={<FormattedMessage id="Marketing.Status" />} dataIndex="couponStatusStr"
                           key="couponStatusStr" />
          <DataGrid.Column
            title={<FormattedMessage id="Marketing.Operation" />}
            key="operate"
            className={'operation-th'}
            dataIndex="isFree"
            render={(text, record) => {
              return (
                <div className="operation-box">
                  {(record as any).couponStatus == 1 && ( //0 有活动
                    <span
                      className="link"
                      onClick={() => {
                        handleAdd((record as any).couponId);
                      }}
                      style={{ marginRight: 10 }}
                    >
                         <Tooltip placement="top" title={<FormattedMessage id="Marketing.generate" />}>
                        <span className="icon iconfont iconcontactAdd" style={{ fontSize: 20 }}></span>
                      </Tooltip>
                      </span>
                  )}
                  <AuthWrapper functionName={'f_coupon_detail'}>
                    {text == 0 && ( //0 有活动
                      <span
                        className="link"
                        onClick={() => {
                          couponExport((record as any).couponId);
                        }}
                        style={{ marginRight: 10 }}
                      >
                         <Tooltip placement="top" title={<FormattedMessage id="Marketing.Export" />}>
                        <span className="icon iconfont iconOffShelves" style={{ fontSize: 20 }}></span>
                      </Tooltip>
                      </span>
                    )}
                  </AuthWrapper>
                  <AuthWrapper functionName={'f_coupon_detail'}>
                    <Link to={`/coupon-detail/${(record as any).couponId}/1`} style={{ marginRight: 10, paddingLeft: 0 }}>
                      <Tooltip placement="top" title={<FormattedMessage id="Marketing.View" />}>
                        <span className="icon iconfont iconView" style={{ fontSize: 20 }}></span>
                      </Tooltip>
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
                        <Tooltip placement="top" title={<FormattedMessage id="Marketing.Edit" />}>
                            <span className="icon iconfont iconEdit" style={{ fontSize: 20 }}></span>
                        </Tooltip>
                      </span>
                    )}

                  </AuthWrapper>

                  <AuthWrapper functionName={'f_coupon_copy'}>
                    <span
                      className="link"
                      onClick={() => {
                        copyCoupon((record as any).couponId);
                      }}
                    >
                        <Tooltip placement="top" title={<FormattedMessage id="Marketing.Copy" />}>
                            <span className="icon iconfont iconbtn-addsubvisionsaddcategory"
                                  style={{ fontSize: 20 }}></span>
                        </Tooltip>
                    </span>
                  </AuthWrapper>

                  <AuthWrapper functionName={'f_delete_coupon'}>
                    {text == 1 && (
                      <Popconfirm title={<FormattedMessage id="Marketing.deleteThisCoupon" />}
                                  onConfirm={() => deleteCoupon((record as any).couponId)} okText="Yes"
                                  cancelText="Cancel">
                        <Tooltip placement="top" title={<FormattedMessage id="Marketing.Delete" />}>
                          <a>
                            <span className="icon iconfont iconDelete" style={{ fontSize: 20 }}></span>
                          </a>
                        </Tooltip>
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
