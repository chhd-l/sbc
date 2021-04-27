import React from 'react';
import { IMap, Relax } from 'plume2';
import { fromJS, List } from 'immutable';
import momnet from 'moment';
import { Link } from 'react-router-dom';
import { Checkbox, Input, InputNumber, message, Modal, Pagination, Popconfirm, Spin, Tooltip } from 'antd';
import { AuthWrapper, Const, getOrderStatusValue, noop } from 'qmkit';
import { DeliverModal, OnlineRefundModal, RefundModal, RejectModal } from 'biz';
import { allCheckedQL } from '../ql';
import { FormattedMessage, injectIntl } from 'react-intl';
import { cache, RCi18n } from 'qmkit';
const defaultImg = require('../img/none.png');

const confirm = Modal.confirm;
type TList = List<any>;

@Relax
class SearchList extends React.Component<any, any> {
  props: {
    intl?: any;
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
      onRealRefund: Function;
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
      changeRefundPrice: Function;
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
    onRealRefund: noop,
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
    onlineRefundModalHide: noop,
    changeRefundPrice: noop
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
                      {/* <th style={{ width: '0.5%' }}>
                        <Checkbox
                          checked={allChecked}
                          onChange={(e) => {
                            const checked = (e.target as any).checked;
                            onCheckedAll(checked);
                          }}
                        />
                      </th> */}
                      <th>
                        <FormattedMessage id="Order.product" />
                      </th>
                      <th style={{ width: '10%' }}>
                        <FormattedMessage id="Order.orderNumber" />
                      </th>
                      <th style={{ width: '12%' }}>
                        <FormattedMessage id="Order.refundTime" />
                      </th>
                      <th style={{ width: '10%' }}>
                        <FormattedMessage id="Order.consumerName" />
                      </th>
                      <th style={{ width: '12%' }}>
                        <FormattedMessage id="Order.refundableAmount" />
                      </th>
                      {/* <th style={{ width: '10%' }}>
                        <FormattedMessage id="pointsRefundable" />
                      </th> */}
                      <th style={{ width: '12%' }}>
                        <FormattedMessage id="Order.returnOrderStatus" />
                      </th>
                      <th style={{ width: '12%' }}>
                        <FormattedMessage id="Order.actualRefundAmount" />
                      </th>
                      <th style={{ width: '10%', textAlign: 'right' }}>
                        <FormattedMessage id="Order.remark" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="ant-table-tbody">{loading ? this._renderLoading() : this._renderContent(dataList)}</tbody>
                </table>
              </div>
              {total == 0 ? (
                <div className="ant-table-placeholder">
                  <span>
                    <i className="anticon anticon-frown-o" />
                    <FormattedMessage id="Order.noData"/>
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
          <Spin indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />} />
        </td>
      </tr>
    );
  }

  _renderContent(dataList) {
    const { onChecked, onAudit, onRealRefund, onReject, onDeliver, onReceive, onRejectReceive, onOnlineRefund, onOfflineRefund, onRejectRefund } = this.props.relaxProps;

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

      // // 应退积分
      // const applyPoints = v.getIn(['returnPoints', 'applyPoints']);
      // // 实退积分
      // const actualReturnPoints = v.getIn(['returnPoints', 'actualPoints']);

      // 总额
      const totalPrice = v.getIn(['returnPrice', 'totalPrice']);
      // 改价金额
      const applyPrice = v.getIn(['returnPrice', 'applyPrice']);

      const applyStatus = v.getIn(['returnPrice', 'applyStatus']);
      // 应退金额，如果对退单做了改价，使用applyPrice，否则，使用总额totalPrice
      const payPrice = totalPrice;
      const actualReturnPrice = v.getIn(['returnPrice', 'actualReturnPrice']);

      const refundStatus = v.get('refundStatus');

      const enableReturn = (returnFlowState === 'RECEIVED' || (returnType == 'REFUND' && returnFlowState === 'AUDIT')) && refundStatus != null && refundStatus != 2 && refundStatus != 3;

      return (
        <tr className="ant-table-row  ant-table-row-level-0" key={Math.random()}>
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
                      {/* <span style={{ marginLeft: '1%' }}>
                        <Checkbox
                          checked={v.get('checked')}
                          onChange={(e) => {
                            const checked = (e.target as any).checked;
                            onChecked(index, checked);
                          }}
                        />
                      </span> */}
                      <span style={{ marginLeft: 20, color: '#000' }}>
                        {rid} {v.get('platform') != 'CUSTOMER' && <span style={styles.platform}><FormattedMessage id="Order.Return" /></span>}
                      </span>
                      <span style={{ marginRight: 0, float: 'right' }}>
                        {returnFlowState === 'PENDING_REVIEW' && (
                          <AuthWrapper functionName="f_return_review">

                            <Tooltip placement="top" title={(window as any).RCi18n({id:'Order.Approve'})}>
                              <a style={{ marginLeft: 20 }} onClick={
                                () => {
                                  this._showAudit(onAudit, rid);
                                }
                              }>
                                <FormattedMessage id="Order.Approve" />
                                </a>

                            </Tooltip>

                            <Tooltip placement="top" title={(window as any).RCi18n({id:'Order.Reject'})}>
                              <a style={{ marginLeft: 20 }} onClick={
                                () => {
                                  this._showReject(onReject, rid);
                                }
                              }>
                                <FormattedMessage id="Order.Reject" />
                                </a>
                            </Tooltip>
                          </AuthWrapper>
                        )}

                        {returnFlowState === 'TO_BE_DELIVERED' && (
                          <AuthWrapper functionName="f_return_delivered">
                            <Popconfirm placement="topLeft" title={<FormattedMessage id="Order.skipLogisticsAlert"/>} onConfirm={() => {
                              this._showDeliver(onDeliver, rid, false)
                            }} okText={<FormattedMessage id="Order.btnConfirm"/>} cancelText={<FormattedMessage id="Order.btnCancel"/>}>
                              <Tooltip placement="top" title={(window as any).RCi18n({id:'Order.skipLogistics'})}>
                                <a style={{ marginLeft: 20 }}>
                                  <FormattedMessage id="Order.skipLogistics"/>
                                </a>
                              </Tooltip>
                            </Popconfirm>
                            <Tooltip placement="top" title={(window as any).RCi18n({id:'Order.fillLogistics'})}>
                              <a href="javascript:void(0)" style={{ marginLeft: 20 }} onClick={() => this._showDeliver(onDeliver, rid, true)}>
                                <FormattedMessage id="Order.fillLogistics"/>
                              </a>
                            </Tooltip>
                          </AuthWrapper>
                        )}

                        {returnFlowState === 'TO_BE_RECEIVED' && (
                          <AuthWrapper functionName="f_return_received">
                            <Tooltip placement="top" title={(window as any).RCi18n({id:'Order.RecipientAccepted'})}>
                              <a href="javascript:void(0)" style={{ marginLeft: 20 }} onClick={() => this._showReceive(onReceive, rid)}>
                                <FormattedMessage id="Order.RecipientAccepted"/>
                              </a>
                            </Tooltip>
                            <Tooltip placement="top" title={(window as any).RCi18n({id:'Order.RecipientRejected'})}>
                              <a href="javascript:void(0)" style={{ marginLeft: 20 }} onClick={() => this._showRejectReceive(onRejectReceive, rid)}>
                                <FormattedMessage id="Order.RecipientRejected"/>
                              </a>
                            </Tooltip>

                          </AuthWrapper>
                        )}
                        {returnFlowState === 'PENDING_REFUND' && (
                          <AuthWrapper functionName="f_return_refund">
                            <Tooltip placement="top" title={(window as any).RCi18n({id:'Order.refusedToRefund'})}>
                              <a
                                href="javascript:void(0)"
                                style={{ marginLeft: 20 }}
                                onClick={() => {
                                  // console.log(onRejectRefund, 'onRejectRefund');
                                  this._showRejectRefund(onRejectRefund, rid, 0 == payType);
                                }}
                              >
                                <FormattedMessage id="Order.refusedToRefund" />
                              </a>
                            </Tooltip>
                            <Tooltip placement="top" title={(window as any).RCi18n({id:'Order.RealRefund'})}>
                              <a
                                href="javascript:void(0)"
                                style={{ marginLeft: 20 }}
                                onClick={() => {
                                  this._showRealRefund(onRealRefund, rid, returnType == 'REFUND' ? applyPrice : totalPrice);
                                }}
                              >
                                <FormattedMessage id="Order.RealRefund" />
                              </a>
                            </Tooltip>
                          </AuthWrapper>
                        )}

                        <AuthWrapper functionName="f_retrun_detail">
                          <Tooltip placement="top" title={(window as any).RCi18n({id:'Order.detail'})}>
                            <Link style={{ marginRight: 18, marginLeft: 20 }} to={`/order-return-detail/${rid}`} className="iconfont iconDetails">
                              {/*<FormattedMessage id="order.seeDetails" />*/}
                            </Link>
                          </Tooltip>
                        </AuthWrapper>
                      </span>
                    </div>
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {/* <td style={{ width: '3%' }} /> */}
                  <td style={{ paddingTop: 14, paddingBottom: 16 }}>
                    {/*商品图片*/}
                    {v
                      .get('returnItems')
                      .concat(returnGifts)
                      .map((v, k) => {
                        const img = v.get('pic') ? v.get('pic') : defaultImg;
                        return k < 3 ? <img style={styles.imgItem} src={img} title={v.get('skuName')} key={k} /> : null;
                      })}

                    {
                      /*第4张特殊处理*/
                      //@ts-ignore
                      v.get('returnItems').concat(returnGifts).size > 3 ? (
                        <div style={styles.imgBg}>
                          <img
                            //@ts-ignore
                            src={v.get('returnItems').concat(returnGifts).get(3).get('pic') ? v.get('returnItems').concat(returnGifts).get(3).get('pic') : defaultImg}
                            style={styles.imgFourth}
                          />
                          //@ts-ignore
                          <div style={styles.imgNum}><FormattedMessage id="Order.Total"/> {v.get('returnItems').concat(returnGifts).size}</div>
                        </div>
                      ) : null
                    }
                  </td>
                  <td style={{ width: '12%' }}>
                    {/*订单编号*/}
                    {v.get('tid')}
                  </td>
                  <td style={{ width: '12%' }}>
                    {/*退单时间*/}
                    {v.get('createTime') ? momnet(v.get('createTime')).format(Const.TIME_FORMAT).toString() : ''}
                  </td>
                  <td style={{ width: '12%' }}>
                    {/*收件人姓名*/}
                    {v.get('buyer') ? v.getIn(['buyer', 'name']) : ''}
                  </td>
                  <td style={{ width: '12%' }}>{
                    returnType === 'REFUND' ?
                      (applyPrice || applyPrice === 0 ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + parseFloat(applyPrice).toFixed(2) : '-') :
                      (totalPrice || totalPrice === 0 ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + parseFloat(totalPrice).toFixed(2) : '-')}</td>
                  {/*应退积分*/}
                  {/* <td style={{ width: '10%' }}>{applyPoints}</td> */}
                  {/*状态*/}
                  <td style={{ width: '12%' }}>
                    <FormattedMessage id={getOrderStatusValue('ReturnOrderStatus', returnFlowState)} />
                    {/* {returnFlowState == 'REFUND_FAILED' && (
                      <Tooltip title={v.get('refundFailedReason')}>
                        <a style={{ display: 'block' }}>原因</a>
                      </Tooltip>
                    )} */}
                  </td>
                  {/*实退金额*/}
                  <td style={{ width: '12%' }}>{returnFlowState == 'COMPLETED' ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + parseFloat(actualReturnPrice).toFixed(2) : '-'}</td>
                  {/*实退积分*/}
                  {/* <td
                    style={{
                      width: '10%',
                      textAlign: 'right',
                      paddingRight: 18
                    }}
                  >
                    {returnFlowState == 'COMPLETED' ? actualReturnPoints : '-'}
                  </td> */}
                  <td style={{ width: '10%' }}>
                    {/*订单编号*/}
                    {v.get('rejectReason') ? v.get('rejectReason') : '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      );
    });
  }

  async _showRealRefund(onRealRefund: Function, rid: string, applyPrice: number) {
    const title = (window as any).RCi18n({id:'Order.confirmRefund'});
    const alert1 = (window as any).RCi18n({id:'Order.refundAlert1'});
    const alert2 = (window as any).RCi18n({id:'Order.refundAlert2'});
    confirm({
      title: title,
      okText: (window as any).RCi18n({id:'Order.OK'}),
      content: <div>
        <p>{alert1}</p>
        <p>{alert2}</p>


        <InputNumber
          min={0}
          max={applyPrice}
          defaultValue={applyPrice}
          formatter={value => `${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)} ${value}`}
          parser={value => {
            let currentSymbol = sessionStorage.getItem(cache.SYSTEM_GET_CONFIG).trim()
            value = value.replace(currentSymbol, '');
            value = value.replace(/\s?|(,*)/g, '');
            return value;
          }
          }
          onChange={this.changeRealRefund}
        />
      </div>,
      onOk() {
        return onRealRefund(rid, applyPrice);
      },
      onCancel() {

      }
    });
  }

  // 审核
  async _showAudit(onAudit: Function, rid: string) {
    const alert = (window as any).RCi18n({id:'Order.approveAlert'});
    const title = (window as any).RCi18n({id:'Order.Approve'});
    confirm({
      title: title,
      content: alert,
      onOk() {
        return onAudit(rid);
      },
      onCancel() { }
    });
  }

  // 驳回
  _showReject(onReject: Function, rid: string) {
    this.props.relaxProps.onRejectModalChange({
      visible: true,
      type: 'Reject',
      onOk: onReject,
      rid: rid
    });
  }

  // 填写物流
  _showDeliver(onDeliver: Function, rid: string, isSkip: boolean) {
    if (isSkip) {
      this.props.relaxProps.onDeliverModalChange({
        visible: true,
        onOk: onDeliver,
        rid: rid
      });
    } else {
      onDeliver(rid, false)
    }



  }

  // 收货
  _showReceive(onReceive: Function, rid: string) {
    const title = (window as any).RCi18n({id:'Order.ConfirmReceipt'});
    const alert = (window as any).RCi18n({id:'Order.receiptAlert'});
    confirm({
      title: title,
      content: alert,
      onOk() {
        return onReceive(rid);
      },
      onCancel() { }
    });
  }

  // 拒绝收货
  _showRejectReceive(onRejectReceive: Function, rid: string) {
    this.props.relaxProps.onRejectModalChange({
      visible: true,
      type: 'Reject receive',
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
    // const { onCheckFunAuth } = this.props.relaxProps;
    // const { res } = await onCheckFunAuth('/return/refund/*/reject', 'POST');
    // if (res.context) {
    // 在线退款需要校验是否已在退款处理中
    // if (online) {
    const { checkRefundStatus, init, currentPage, pageSize } = this.props.relaxProps;
    const { res } = await checkRefundStatus(rid);
    // if (res.code !== Const.SUCCESS_CODE) {
    //   setTimeout(
    //     () =>
    //       init({
    //         pageNum: currentPage - 1 < 0 ? 0 : currentPage - 1,
    //         pageSize: pageSize
    //       }),
    //     2000
    //   );
    //   return;
    // }
    // }
    if (res.code === Const.SUCCESS_CODE) {
      this.props.relaxProps.onRejectModalChange({
        visible: true,
        type: 'refusing refund',
        onOk: onRejectRefund,
        rid: rid
      });
    }


    // } else {
    //   message.error('此功能您没有权限访问');
    //   return;
    // }
  }
  changeRealRefund = (value) => {
    console.log(value);
    
    this.props.relaxProps.changeRefundPrice({
      refundPrice: value
    })
  }
}

export default injectIntl(SearchList);

const styles = {
  loading: {
    textAlign: 'center',
    height: 300
  },
  modalTextArea: {
    width: 250,
    height: 60
  },
  imgItem: {
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    float: 'left',
    marginRight: 10,
    background: '#fff',
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
