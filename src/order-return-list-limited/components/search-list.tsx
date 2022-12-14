import React from 'react';
import { IMap, Relax } from 'plume2';
import { fromJS, List } from 'immutable';
import momnet from 'moment';
import { Link } from 'react-router-dom';
import { Checkbox, message, Modal, Pagination, Spin, Tooltip } from 'antd';
import { AuthWrapper, Const, noop, util } from 'qmkit';
import { DeliverModal, OnlineRefundModal, RefundModal, RejectModal } from 'biz';
import { allCheckedQL } from '../ql';
import { FormattedMessage, injectIntl } from 'react-intl';

const defaultImg = require('../img/none.png');

const confirm = Modal.confirm;
type TList = List<any>;

@Relax
export default class SearchList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      selected: TList;
      total: number;
      pageSize: number;
      currentPage: number;
      dataList: TList;
      //驳回／拒绝收货 modal状态
      rejectModalData: IMap;
      // 填写物流 modal状态
      deliverModalData: IMap;
      // 线下退款 modal状态
      refundModalData: IMap;
      init: Function;
      onCheckedAll: Function;
      onChecked: Function;
      onRejectModalChange: Function;
      onRejectModalHide: Function;
      onDeliverModalChange: Function;
      onDeliverModalHide: Function;
      onRefundModalChange: Function;
      onRefundModalHide: Function;
      onAudit: Function;
      onReject: Function;
      onDeliver: Function;
      onReceive: Function;
      onRejectReceive: Function;
      onOnlineRefund: Function;
      onOfflineRefund: Function;
      onRejectRefund: Function;
      checkRefundStatus: Function;
      onCheckFunAuth: Function;
      allChecked: boolean;
      onRefundOnlineModalChange: Function;
      onlineRefundModalData: IMap;
      onlineRefundModalHide: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    selected: 'selected',
    pageSize: 'pageSize',
    currentPage: 'currentPage',
    dataList: 'dataList',
    rejectModalData: 'rejectModalData',
    deliverModalData: 'deliverModalData',
    refundModalData: 'refundModalData',
    init: noop,
    onCheckedAll: noop,
    onChecked: noop,
    onRejectModalChange: noop,
    onRejectModalHide: noop,
    onDeliverModalChange: noop,
    onDeliverModalHide: noop,
    onRefundModalChange: noop,
    onRefundModalHide: noop,
    onAudit: noop,
    onReject: noop,
    onDeliver: noop,
    onReceive: noop,
    onRejectReceive: noop,
    onOnlineRefund: noop,
    onOfflineRefund: noop,
    onRejectRefund: noop,
    checkRefundStatus: noop,
    onCheckFunAuth: noop,
    allChecked: allCheckedQL,
    onRefundOnlineModalChange: noop,
    onlineRefundModalData: 'onlineRefundModalData',
    onlineRefundModalHide: noop
  };

  render() {
    const { loading, total, pageSize, currentPage, init, allChecked, dataList, onCheckedAll, rejectModalData, onRejectModalHide, deliverModalData, onDeliverModalHide, refundModalData, onRefundModalHide, onlineRefundModalData, onlineRefundModalHide } = this.props.relaxProps;

    return (
      <div>
        <div className="ant-table-wrapper">
          <div className="ant-table ant-table-large ant-table-scroll-position-left">
            <div className="ant-table-content">
              <div className="ant-table-body">
                <table style={{ borderCollapse: 'separate', borderSpacing: '0 1em' }}>
                  <thead className="ant-table-thead">
                    <tr>
                      <th style={{ width: '0.5%' }}>
                        <Checkbox
                          checked={allChecked}
                          onChange={(e) => {
                            const checked = (e.target as any).checked;
                            onCheckedAll(checked);
                          }}
                        />
                      </th>
                      <th>商品</th>
                      <th style={{ width: '10%' }}>订单号</th>
                      <th style={{ width: '98px' }}>退单时间</th>
                      <th style={{ width: '10%' }}>客户名称</th>
                      {/* <th style={{ width: '12%' }}>应退金额</th> */}
                      <th style={{ width: '10%' }}>应退积分</th>
                      <th style={{ width: '10%' }}>退单状态</th>
                      {/* <th style={{ width: '12%' }}>实退金额</th> */}
                      <th style={{ width: '10%', textAlign: 'right' }}>实退积分</th>
                    </tr>
                  </thead>
                  <tbody className="ant-table-tbody">{loading ? this._renderLoading() : this._renderContent(dataList)}</tbody>
                </table>
              </div>
              {total == 0 ? (
                <div className="ant-table-placeholder">
                  <span>
                    <i className="anticon anticon-frown-o" />
                    No data
                  </span>
                </div>
              ) : null}
            </div>
          </div>
          {total > 0 ? (
            <Pagination
              current={currentPage}
              total={total}
              pageSize={pageSize}
              onChange={(pageNum, pageSize) => {
                init({
                  pageNum: pageNum - 1,
                  pageSize: pageSize,
                  flushSelected: false
                });
              }}
            />
          ) : null}
        </div>
        <RejectModal data={rejectModalData} onHide={onRejectModalHide} handleOk={rejectModalData.get('onOk')} />
        <DeliverModal data={deliverModalData} onHide={onDeliverModalHide} handleOk={deliverModalData.get('onOk')} />
        <RefundModal data={refundModalData} onHide={onRefundModalHide} handleOk={refundModalData.get('onOk')} />
        <OnlineRefundModal data={onlineRefundModalData} onHide={onlineRefundModalHide} />
      </div>
    );
  }

  _renderLoading() {
    return (
      <tr style={styles.loading}>
        <td colSpan={10}>
          <Spin />
        </td>
      </tr>
    );
  }

  _renderContent(dataList) {
    const { onChecked, onAudit, onReject, onDeliver, onReceive, onRejectReceive, onOnlineRefund, onOfflineRefund, onRejectRefund } = this.props.relaxProps;
    return dataList.map((v, index) => {
      const rid = v.get('id');
      const customerId = v.getIn(['buyer', 'id']);
      // 支付方式 0在线 1线下
      const payType = v.get('payType') === 0 ? 0 : 1;
      // 退单类型 RETURN退货 REFUND退款
      const returnType = v.get('returnType') || 'RETURN';
      // 退单状态
      const returnFlowState = v.get('returnFlowState');

      //退单赠品
      const returnGifts = v.get('returnGifts') ? v.get('returnGifts') : fromJS([]);

      // 应退积分
      const applyPoints = v.getIn(['returnPoints', 'applyPoints']);
      // 实退积分
      const actualReturnPoints = v.getIn(['returnPoints', 'actualPoints']);

      // 总额
      const totalPrice = v.getIn(['returnPrice', 'totalPrice']);
      // 改价金额
      const applyPrice = v.getIn(['returnPrice', 'applyPrice']);

      const applyStatus = v.getIn(['returnPrice', 'applyStatus']);
      // 应退金额，如果对退单做了改价，使用applyPrice，否则，使用总额totalPrice
      const payPrice = totalPrice;
      const actualReturnPrice = applyStatus ? applyPrice : v.getIn(['returnPrice', 'actualReturnPrice']);

      const refundStatus = v.get('refundStatus');

      const enableReturn = (returnFlowState === 'RECEIVED' || (returnType == 'REFUND' && returnFlowState === 'AUDIT')) && refundStatus != null && refundStatus != 2 && refundStatus != 3;

      return (
        <tr className="ant-table-row  ant-table-row-level-0" key={Math.rdmValue()}>
          <td colSpan={10} style={{ padding: 0 }}>
            <table className="ant-table-self" style={{ border: '1px solid #ddd' }}>
              <thead>
                <tr>
                  <td
                    colSpan={10}
                    style={{
                      paddingBottom: 10,
                      color: '#999'
                    }}
                  >
                    <div
                      style={{
                        marginTop: 12,
                        borderBottom: '1px solid #f5f5f5',
                        height: 36
                      }}
                    >
                      <span style={{ marginLeft: '1%' }}>
                        <Checkbox
                          checked={v.get('checked')}
                          onChange={(e) => {
                            const checked = (e.target as any).checked;
                            onChecked(index, checked);
                          }}
                        />
                      </span>
                      <span style={{ marginLeft: 20, color: '#000' }}>
                        {rid} {v.get('platform') != 'CUSTOMER' && <span style={styles.platform}>Chargeback</span>}
                      </span>
                      <span style={{ marginRight: 0, float: 'right' }}>
                        {returnFlowState === 'INIT' && (
                          <AuthWrapper functionName="f_order_return_edit">
                            <Link style={{ marginLeft: 20 }} to={`/order-return-edit/${rid}`}>
                              修改
                            </Link>
                          </AuthWrapper>
                        )}
                        {returnFlowState === 'INIT' && (
                          <AuthWrapper functionName="rolf002">
                            <a href="javascript:void(0)" style={{ marginLeft: 20 }} onClick={() => this._showAudit(onAudit, rid)}>
                              审核
                            </a>
                          </AuthWrapper>
                        )}

                        {returnFlowState === 'INIT' && (
                          <AuthWrapper functionName="rolf002">
                            <a href="javascript:void(0)" style={{ marginLeft: 20 }} onClick={() => this._showReject(onReject, rid)}>
                              驳回
                            </a>
                          </AuthWrapper>
                        )}

                        {/*退货单的已审核状态*/}
                        {returnFlowState === 'AUDIT' && returnType == 'RETURN' && (
                          <AuthWrapper functionName="rolf003">
                            <a href="javascript:void(0)" style={{ marginLeft: 20 }} onClick={() => this._showDeliver(onDeliver, rid)}>
                            <FormattedMessage id="Order.fillLogistics" />
                            </a>
                          </AuthWrapper>
                        )}

                        {returnFlowState === 'DELIVERED' && (
                          <AuthWrapper functionName="rolf004">
                            <a href="javascript:void(0)" style={{ marginLeft: 20 }} onClick={() => this._showReceive(onReceive, rid)}>
                              收货
                            </a>
                          </AuthWrapper>
                        )}

                        {returnFlowState === 'DELIVERED' && (
                          <AuthWrapper functionName="rolf004">
                            <a href="javascript:void(0)" style={{ marginLeft: 20 }} onClick={() => this._showRejectReceive(onRejectReceive, rid)}>
                              拒绝收货
                            </a>
                          </AuthWrapper>
                        )}

                        {/*已收货状态 或者 退款单的已审核状态*/}
                        {/* {enableReturn && (
                          <AuthWrapper functionName="rolf005">
                            <a
                              href="javascript:void(0)"
                              style={{ marginLeft: 20 }}
                              onClick={() => {
                                if (payType == 0) {
                                  this._showOnlineRefund(
                                    onOnlineRefund,
                                    rid,
                                    customerId,
                                    payPrice,
                                    applyPoints
                                  );
                                } else {
                                  this._showOfflineRefund(
                                    onOfflineRefund,
                                    rid,
                                    customerId,
                                    payPrice,
                                    applyPoints
                                  );
                                }
                              }}
                            >
                              退款
                            </a>
                          </AuthWrapper>
                        )} */}
                        {/*已收货状态 或者 退款单的已审核状态*/}
                        {/* {enableReturn && (
                          <AuthWrapper functionName="rolf005">
                            <a
                              href="javascript:void(0)"
                              style={{ marginLeft: 20 }}
                              onClick={() =>
                                this._showRejectRefund(
                                  onRejectRefund,
                                  rid,
                                  0 == payType
                                )
                              }
                            >
                              拒绝退款
                            </a>
                          </AuthWrapper>
                        )} */}
                        {/* <AuthWrapper functionName="rodf001">
                          <Link
                            style={{ marginRight: 18, marginLeft: 20 }}
                            to={`/order-return-detail/${rid}`}
                          >
                            查看详情
                          </Link>
                        </AuthWrapper> */}
                      </span>
                    </div>
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ width: '3%' }} />
                  <td style={{ paddingTop: 14, paddingBottom: 16 }}>
                    {/*商品图片*/}
                    {v
                      .get('returnItems')
                      .concat(returnGifts)
                      .map((v, k) => {
                        const img = v.get('pic') ? util.optimizeImage(v.get('pic')) : defaultImg;
                        return k < 3 ? <img style={styles.listImages} src={img} title={v.get('skuName')} key={k} /> : null;
                      })}

                    {
                      /*第4张特殊处理*/
                      //@ts-ignore
                      v.get('returnItems').concat(returnGifts).size > 3 ? (
                        <div style={styles.imgBg}>
                          <img
                            //@ts-ignore
                            src={v.get('returnItems').concat(returnGifts).get(3).get('pic') ? util.optimizeImage(v.get('returnItems').concat(returnGifts).get(3).get('pic')) : defaultImg}
                            style={styles.imgFourth}
                          />
                          //@ts-ignore
                          <div style={styles.imgNum}>共{v.get('returnItems').concat(returnGifts).size}件</div>
                        </div>
                      ) : null
                    }
                  </td>
                  <td style={{ width: '10%' }}>
                    {/*订单编号*/}
                    {v.get('tid')}
                  </td>
                  <td style={{ width: '98px' }}>
                    {/*退单时间*/}
                    {v.get('createTime') ? momnet(v.get('createTime')).format(Const.TIME_FORMAT).toString() : ''}
                  </td>
                  <td style={{ width: '10%' }}>
                    {/*收件人姓名*/}
                    {v.get('buyer') ? v.getIn(['buyer', 'name']) : ''}
                  </td>
                  {/* <td style={{ width: '12%' }}>
                    {'￥' + parseFloat(payPrice).toFixed(2)}
                  </td> */}
                  {/*应退积分*/}
                  <td style={{ width: '10%' }}>{applyPoints}</td>
                  {/*状态*/}
                  <td style={{ width: '10%' }}>
                    {returnType == 'RETURN' ? Const.returnGoodsState[returnFlowState] : Const.returnMoneyState[returnFlowState] || ''}
                    {returnFlowState == 'REFUND_FAILED' && (
                      <Tooltip title={v.get('refundFailedReason')}>
                        <a style={{ display: 'block' }}>原因</a>
                      </Tooltip>
                    )}
                  </td>
                  {/*实退金额*/}
                  {/* <td style={{ width: '12%' }}>
                    {returnFlowState == 'COMPLETED'
                      ? '￥' + parseFloat(actualReturnPrice).toFixed(2)
                      : '-'}
                  </td> */}
                  {/*实退积分*/}
                  <td
                    style={{
                      width: '10%',
                      textAlign: 'right',
                      paddingRight: 18
                    }}
                  >
                    {returnFlowState == 'COMPLETED' ? actualReturnPoints : '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      );
    });
  }

  // 审核
  async _showAudit(onAudit: Function, rid: string) {
    confirm({
      title: '审核通过',
      content: '是否确认审核通过？',
      onOk() {
        return onAudit(rid);
      },
      onCancel() {}
    });
  }

  // 驳回
  _showReject(onReject: Function, rid: string) {
    this.props.relaxProps.onRejectModalChange({
      visible: true,
      type: '驳回',
      onOk: onReject,
      rid: rid
    });
  }

  // 填写物流
  _showDeliver(onDeliver: Function, rid: string) {
    this.props.relaxProps.onDeliverModalChange({
      visible: true,
      onOk: onDeliver,
      rid: rid
    });
  }

  // 收货
  _showReceive(onReceive: Function, rid: string) {
    confirm({
      title: '确认收货',
      content: '是否确认收货？',
      onOk() {
        return onReceive(rid);
      },
      onCancel() {}
    });
  }

  // 拒绝收货
  _showRejectReceive(onRejectReceive: Function, rid: string) {
    this.props.relaxProps.onRejectModalChange({
      visible: true,
      type: '拒绝收货',
      onOk: onRejectReceive,
      rid: rid
    });
  }

  // 在线退款
  async _showOnlineRefund(onOnlineRefund: Function, rid: string, customerId: string, refundAmount: number, applyPoints: number) {
    this.props.relaxProps.onRefundOnlineModalChange({
      visible: true,
      onOk: onOnlineRefund,
      rid: rid,
      customerId: customerId,
      refundAmount: refundAmount,
      applyPoints: applyPoints
    });
  }

  // 线下退款
  async _showOfflineRefund(onOfflineRefund: Function, rid: string, customerId: string, refundAmount: number, applyPoints: number) {
    this.props.relaxProps.onRefundModalChange({
      visible: true,
      onOk: onOfflineRefund,
      rid: rid,
      customerId: customerId,
      refundAmount: refundAmount,
      applyPoints: applyPoints
    });
  }

  // 拒绝退款
  async _showRejectRefund(onRejectRefund: Function, rid: string, online: boolean) {
    const { onCheckFunAuth } = this.props.relaxProps;
    const { res } = await onCheckFunAuth('/return/refund/*/reject', 'POST');
    if (res.context) {
      // 在线退款需要校验是否已在退款处理中
      if (online) {
        const { checkRefundStatus, init, currentPage, pageSize } = this.props.relaxProps;
        const { res } = await checkRefundStatus(rid);
        if (res.code !== Const.SUCCESS_CODE) {
          setTimeout(
            () =>
              init({
                pageNum: currentPage - 1 < 0 ? 0 : currentPage - 1,
                pageSize: pageSize
              }),
            2000
          );
          return;
        }
      }

      this.props.relaxProps.onRejectModalChange({
        visible: true,
        type: '拒绝退款',
        onOk: onRejectRefund,
        rid: rid
      });
    } else {
      message.error('此功能您没有权限访问');
      return;
    }
  }
}

const styles = {
  loading: {
    textAlign: 'center',
    height: 300
  },
  modalTextArea: {
    width: 250,
    height: 60
  },
  listImages: {
    width: 60,
    height: 60,
    float: 'left',
    padding: 5,
    background: '#fff',
    border: '1px solid #ddd',
    marginRight: 10,
    borderRadius: 3
  },
  imgFourth: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 60,
    height: 60,
    borderRadius: 3
  },
  imgBg: {
    position: 'relative',
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    float: 'left',
    marginRight: 10,
    borderRadius: 3
  },
  imgNum: {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    background: 'rgba(0,0,0,0.6)',
    borderRadius: 3,
    fontSize: 9,
    color: '#fff'
  },
  platform: {
    fontSize: 12,
    padding: '1px 3px',
    display: 'inline-block',
    marginLeft: 5,
    border: ' 1px solid #F56C1D',
    color: '#F56C15',
    borderRadius: 5
  }
} as any;
