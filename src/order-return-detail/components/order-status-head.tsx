import React from 'react';

import { Relax } from 'plume2';
import { Col, InputNumber, message, Modal, Popconfirm, Row, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { IMap } from 'typings/globalType';
import { AuthWrapper, cache, Const, noop, RCi18n } from 'qmkit';
import { DeliverModal, OnlineRefundModal, RefundModal, RejectModal } from 'biz';
import { fromJS } from 'immutable';
import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';

const confirm = Modal.confirm;

@Relax
class OrderStatusHead extends React.Component<any, any> {
  props: {
    relaxProps?: {
      detail: IMap;
      //驳回／拒绝收货 modal状态
      rejectModalData: IMap;
      // 填写物流 modal状态
      deliverModalData: IMap;
      // 线下退款 modal状态
      refundModalData: IMap;
      //线上支付退款
      onlineRefundModalData: IMap;
      init: Function;
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
      onlineRefundModalShow: Function;
      onlineRefundModalHide: Function;
      onRefundOnlineModalChange: Function;
      refundRecord: IMap;
      fetchRefundOrder: Function;
      changeRefundPrice: Function;
      onRealRefund: Function;
      pendingRefundConfig:IMap;
    };
  };

  static relaxProps = {
    detail: 'detail',
    rejectModalData: 'rejectModalData',
    deliverModalData: 'deliverModalData',
    refundModalData: 'refundModalData',
    onlineRefundModalData: 'onlineRefundModalData',
    init: noop,
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
    onlineRefundModalShow: noop,
    onlineRefundModalHide: noop,
    onRefundOnlineModalChange: noop,
    refundRecord: 'refundRecord',
    fetchRefundOrder: noop,
    changeRefundPrice: noop,
    onRealRefund: noop,
    pendingRefundConfig:'pendingRefundConfig'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      detail,
      onAudit,
      onReject,
      onDeliver,
      onReceive,
      onRejectReceive,
      onOnlineRefund,
      onOfflineRefund,
      onRejectRefund,
      rejectModalData,
      onRejectModalHide,
      deliverModalData,
      onDeliverModalHide,
      refundModalData,
      onRefundModalHide,
      onlineRefundModalData,
      onlineRefundModalHide,
      onRealRefund
    } = this.props.relaxProps;
    let { refundRecord } = this.props.relaxProps;

    const rid = detail.get('id');
    const customerId = detail.getIn(['buyer', 'id']);
    // 支付方式 0在线 1线下
    const payType = detail.get('payType') === 0 ? 0 : 1;

    // 退单类型 RETURN 退货, REFUND 退款
    const returnType = detail.get('returnType') || 'RETURN';
    const returnFlowState = detail.get('returnFlowState');
    // 总额
    const totalPrice = detail.getIn(['returnPrice', 'totalPrice']);
    // 改价金额
    const applyPrice = detail.getIn(['returnPrice', 'applyPrice']);
    // 应退金额，如果对退单做了改价，使用applyPrice，否则，使用总额totalPrice
    const payPrice = applyPrice || totalPrice;
    // 应退积分
    const applyPoints = detail.getIn(['returnPoints', 'applyPoints']) || 0;

    //退款单
    refundRecord = refundRecord || fromJS({});
    const enableReturn = (returnFlowState === 'RECEIVED' || (returnType == 'REFUND' && returnFlowState === 'AUDIT')) && refundRecord.get('refundStatus') != null && refundRecord.get('refundStatus') != 2 && refundRecord.get('refundStatus') != 3;

    const labelText = returnType == 'RETURN' ? Const.returnGoodsState[returnFlowState] : Const.returnMoneyState[returnFlowState] || '';
    return (
      <div>
        <div style={styles.container as any}>
          <div style={styles.row}>
            <div style={styles.orderPre}>
              <label style={styles.greenText}>
                <FormattedMessage id={`Order.${labelText}`} />
              </label>
            </div>
            <div style={styles.orderEnd}>
              {returnFlowState === 'PENDING_REVIEW' && (
                <AuthWrapper functionName="f_return_review">

                  <Tooltip placement="top" title={<FormattedMessage id="Order.Approve" />}>
                    <a style={{ marginLeft: 20 }} onClick={
                      () => {
                        this._showAudit(onAudit, rid);
                      }
                    }>
                      <FormattedMessage id="Order.Approve" />
                    </a>

                  </Tooltip>

                  <Tooltip placement="top" title={<FormattedMessage id="Order.Reject" />}>
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
                  <Popconfirm placement="topLeft" title={<FormattedMessage id="Order.skipLogisticsAlert" />} onConfirm={() => {
                    this._showDeliver(onDeliver, rid, false)
                  }} okText={<FormattedMessage id="Order.btnConfirm" />} cancelText={<FormattedMessage id="Order.cancel" />}>
                    <Tooltip placement="top" title={<FormattedMessage id="Order.skipLogistics" />}>
                      <a style={{ marginLeft: 20 }}>
                        <FormattedMessage id="Order.skipLogistics" />
                      </a>
                    </Tooltip>
                  </Popconfirm>
                  <Tooltip placement="top" title={<FormattedMessage id="Order.fillLogistics" />}>
                    <a href="javascript:void(0)" style={{ marginLeft: 20 }} onClick={() => this._showDeliver(onDeliver, rid, true)}>
                      <FormattedMessage id="Order.fillLogistics" />
                    </a>
                  </Tooltip>
                </AuthWrapper>
              )}

              {returnFlowState === 'TO_BE_RECEIVED' && (
                <AuthWrapper functionName="f_return_received">
                  <Tooltip placement="top" title={<FormattedMessage id="Order.RecipientAccepted" />}>
                    <a href="javascript:void(0)" style={{ marginLeft: 20 }} onClick={() => this._showReceive(onReceive, rid)}>
                      <FormattedMessage id="Order.RecipientAccepted" />
                    </a>
                  </Tooltip>
                  <Tooltip placement="top" title={<FormattedMessage id="Order.RecipientRejected" />}>
                    <a href="javascript:void(0)" style={{ marginLeft: 20 }} onClick={() => this._showRejectReceive(onRejectReceive, rid)}>
                      <FormattedMessage id="Order.RecipientRejected" />
                    </a>
                  </Tooltip>

                </AuthWrapper>
              )}
              {returnFlowState === 'PENDING_REFUND' &&this.showPendingRefundBtn(payType)? (
                <AuthWrapper functionName="f_return_refund">
                  <Tooltip placement="top" title={<FormattedMessage id="Order.refusedToRefund" />}>
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
                  <Tooltip placement="top" title={<FormattedMessage id="Order.RealRefund" />}>
                    <a
                      href="javascript:void(0)"
                      style={{ marginLeft: 20 }}
                      onClick={() => {
                        this._showRealRefund(onRealRefund, rid, applyPrice);
                      }}
                    >
                      <FormattedMessage id="Order.RealRefund" />
                    </a>
                  </Tooltip>
                </AuthWrapper>
              ):null}
            </div>
          </div>
          <Row>
            <Col span={8}>
              <p style={styles.darkText}>
                <FormattedMessage id="Order.ReturnOrderNumber" />：{detail.get('id')}{' '}
                {detail.get('platform') != 'CUSTOMER' && (
                  <span style={styles.platform}>
                    <FormattedMessage id="Order.Return" />
                  </span>
                )}
              </p>
              <p style={styles.darkText}>
                <FormattedMessage id="Order.applicationTime" />：{moment(detail.get('createTime')).format(Const.TIME_FORMAT)}
              </p>
              <p style={styles.darkText}>
                <FormattedMessage id="Order.orderNumber" />：{detail.get('tid')}
              </p>
              <p style={styles.darkText}>
                <FormattedMessage id="Order.payWay" />：{detail.get('payWay')}
              </p>
            </Col>
            <Col span={8}>
              <p style={styles.darkText}>
                <FormattedMessage id="Order.Petownername" />：{detail.getIn(['buyer', 'name'])}
              </p>
              <p style={styles.darkText}>
                <FormattedMessage id="Order.consumerAccount" />:{this._parsePhone(detail.getIn(['buyer', 'account']))}
              </p>

              {detail.getIn(['buyer', 'customerFlag']) && (
                <p style={styles.darkText}>
                  <FormattedMessage id="Order.consumerLevel" />:
                  {detail.getIn(['buyer', 'levelName'])}
                </p>
              )}
            </Col>
          </Row>
        </div>
        <RejectModal data={rejectModalData} onHide={onRejectModalHide} handleOk={rejectModalData.get('onOk')} />
        <DeliverModal data={deliverModalData} onHide={onDeliverModalHide} handleOk={deliverModalData.get('onOk')} />
        <RefundModal data={refundModalData} onHide={onRefundModalHide} handleOk={refundModalData.get('onOk')} />
        <OnlineRefundModal data={onlineRefundModalData} onHide={onlineRefundModalHide} />
      </div>
    );
  }

  // 审核
  async _showAudit(onAudit: Function, rid: string) {
    const content = RCi18n({ id: 'Order.approveAlert' });
    const title = RCi18n({ id: 'Order.Approve' });
    confirm({
      title: title,
      content: content,
      okText: RCi18n({ id: 'Order.OK' }),
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
      type: 'reject',
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
    const content = RCi18n({ id: 'Order.receiptAlert' });
    const title = RCi18n({ id: 'Order.ConfirmReceipt' });
    confirm({
      title: title,
      content: content,
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
      type: 'recipient rejected',
      onOk: onRejectReceive,
      rid: rid
    });
  }

  // 在线退款 这里不要奇怪，新的需求 线上线下走的是一个接口 才onOfflineRefund
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
  _showOfflineRefund(onOfflineRefund: Function, rid: string, customerId: string, refundAmount: number, applyPoints: number) {
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
    // 在线退款需要校验是否已在退款处理中
    if (online) {
      const { checkRefundStatus, init } = this.props.relaxProps;
      const { res } = await checkRefundStatus(rid);
      if (res.code !== Const.SUCCESS_CODE) {
        setTimeout(() => init(rid), 2000);
        return;
      }
    }

    this.props.relaxProps.onRejectModalChange({
      visible: true,
      type: 'refused to refund',
      onOk: onRejectRefund,
      rid: rid
    });
  }

  /**
   * 解析phone
   * @param phone
   */
  _parsePhone(phone: string) {
    if (phone && phone.length == 11) {
      return `${phone.substring(0, 3)}****` + `${phone.substring(7, 11)}`;
    } else {
      return phone;
    }
  }
  async _showRealRefund(onRealRefund: Function, rid: string, applyPrice: number) {
    const content = RCi18n({ id: 'Order.refundAlert1' });
    const content1 = RCi18n({ id: 'Order.refundAlert2' });
    const title = RCi18n({ id: 'Order.confirmRefund' });
    confirm({
      title: title,
      content: <div>
        <p>{content}</p>
        <p>{content1}</p>


        <InputNumber
          min={0}
          max={applyPrice}
          defaultValue={applyPrice}
          formatter={value => `${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) || '$'} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          onChange={this.changeRealRefund}
        />
      </div>,
      onOk() {
        return onRealRefund(rid, applyPrice);
      },
      onCancel() {
        this.setState({
          refundPrice: null
        })
      }
    });
  }
  changeRealRefund = (value) => {
    this.props.relaxProps.changeRefundPrice({
      refundPrice: value
    })
  }
  showPendingRefundBtn=(payType)=>{
    const {pendingRefundConfig}= this.props.relaxProps;
    if(payType===0){
      return pendingRefundConfig.get('online')
    }
    if(payType===1){
      return pendingRefundConfig.get('cashOnDelivery')
    }
    if(payType===2){
      return pendingRefundConfig.get('cash')
    }
    return 1
  }
}

export default injectIntl(OrderStatusHead);

const styles = {
  container: {
    //display: 'flex',
    //flexDirection: 'row',
    backgroundColor: '#FAFAFA',
    padding: 15
    //justifyContent: 'space-between',
    // alignItems: 'center',
  },
  greenText: {
    color: '#339966',
    fontSize: 12
  },
  geryText: {
    fontSize: 12,
    marginLeft: 20
  },
  orderPre: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 2
  },
  orderEnd: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'flex-end'
  },
  pr20: {
    paddingRight: 20
  },
  darkText: {
    color: '#333333',
    lineHeight: '24px'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  platform: {
    fontSize: 12,
    padding: '0px 5px',
    display: 'inline-block',
    marginLeft: 5,
    border: ' 1px solid #F56C1D',
    color: '#F56C15',
    borderRadius: 5
  }
} as any;
