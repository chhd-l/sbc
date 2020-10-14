import React from 'react';
import { Relax } from 'plume2';
import { Link } from 'react-router-dom';
import { Checkbox, Spin, Pagination, Modal, Form, Input, Tooltip } from 'antd';
import { List, fromJS } from 'immutable';
import { noop, Const, AuthWrapper } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import Moment from 'moment';
import { allCheckedQL } from '../ql';
import FormItem from 'antd/lib/form/FormItem';
const defaultImg = require('../../goods-list/img/none.png');

const deliverStatus = (status) => {
  if (status == 'NOT_YET_SHIPPED') {
    return <FormattedMessage id="order.notShipped" />;
  } else if (status == 'SHIPPED') {
    return <FormattedMessage id="order.allShipments" />;
  } else if (status == 'PART_SHIPPED') {
    return <FormattedMessage id="order.partialShipment" />;
  } else if (status == 'VOID') {
    return <FormattedMessage id="order.invalid" />;
  } else {
    return <FormattedMessage id="order.unknown" />;
  }
};

const payStatus = (status) => {
  if (status == 'NOT_PAID') {
    return <FormattedMessage id="order.unpaid" />;
  } else if (status == 'UNCONFIRMED') {
    return <FormattedMessage id="order.toBeConfirmed" />;
  } else if (status == 'PAID') {
    return <FormattedMessage id="order.paid" />;
  } else if (status == 'REFUND') {
    return <FormattedMessage id="Refund" />;
  } else {
    return <FormattedMessage id="order.unknown" />;
  }
};

const flowState = (status) => {
  if (status == 'INIT') {
    return <FormattedMessage id="order.pendingReview" />;
  } else if (status == 'GROUPON') {
    return <FormattedMessage id="order.toBeFormed" />;
  } else if (status == 'AUDIT' || status == 'DELIVERED_PART') {
    return <FormattedMessage id="order.toBeDelivered" />;
  } else if (status == 'DELIVERED') {
    return <FormattedMessage id="order.toBeReceived" />;
  } else if (status == 'CONFIRMED') {
    return <FormattedMessage id="order.received" />;
  } else if (status == 'COMPLETED') {
    return <FormattedMessage id="order.completed" />;
  } else if (status == 'VOID') {
    return <FormattedMessage id="order.outOfDate" />;
  }
};

type TList = List<any>;

class RejectForm extends React.Component<any, any> {
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form>
        <FormItem style={{ marginBottom: 0 }}>
          {getFieldDecorator('comment', {
            rules: [
              {
                required: true,
                message: <FormattedMessage id="order.rejectionReasonTip" />
              },
              {
                max: 100,
                message: 'Please input less than 100 characters'
              }
            ]
          })(
            <div>
              <Input.TextArea placeholder="comment" autosize={{ minRows: 4, maxRows: 4 }} />
              <p>
                <span
                  style={{
                    color: 'red',
                    fontFamily: 'SimSun',
                    marginRight: '4px',
                    fontSize: '12px'
                  }}
                >
                  *
                </span>
                Once rejected, we will return the payment for this order to the consumer
              </p>
            </div>
          )}
        </FormItem>
      </Form>
    );
  }

  // checkComment = (_rule, value, callback) => {
  //   if (!value) {
  //     callback();
  //     return;
  //   }

  //   if (value.length > 100) {
  //     callback(new Error('Please input less than 100 characters'));
  //     return;
  //   }
  //   callback();
  // };
}

const WrappedRejectForm = Form.create({})(RejectForm);

@Relax
export default class ListView extends React.Component<any, any> {
  _rejectForm;

  state: {
    selectedOrderId: null;
  };

  props: {
    histroy?: Object;
    relaxProps?: {
      loading: boolean;
      orderRejectModalVisible: boolean;
      total: number;
      pageSize: number;
      currentPage: number;
      dataList: TList;
      needAudit: boolean;

      onChecked: Function;
      onCheckedAll: Function;
      allChecked: boolean;
      onAudit: Function;
      init: Function;
      onRetrial: Function;
      onConfirm: Function;
      onCheckReturn: Function;
      verify: Function;
      hideRejectModal: Function;
      showRejectModal: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    //当前的数据总数
    total: 'total',
    //当前的分页条数
    pageSize: 'pageSize',

    currentPage: 'currentPage',
    //当前的客户列表
    dataList: 'dataList',
    needAudit: 'needAudit',

    onChecked: noop,
    onCheckedAll: noop,
    allChecked: allCheckedQL,
    onAudit: noop,
    init: noop,
    onRetrial: noop,
    onConfirm: noop,
    onCheckReturn: noop,
    verify: noop,
    orderRejectModalVisible: 'orderRejectModalVisible',
    hideRejectModal: noop,
    showRejectModal: noop
  };

  render() {
    const { loading, total, pageSize, dataList, onCheckedAll, allChecked, init, currentPage, orderRejectModalVisible } = this.props.relaxProps;

    return (
      <div>
        <div className="ant-table-wrapper">
          <div className="ant-table ant-table-large ant-table-scroll-position-left">
            <div className="ant-table-content">
              <div className="ant-table-body">
                <table style={{ borderCollapse: 'separate', borderSpacing: '0 1em' }}>
                  <thead className="ant-table-thead">
                    <tr>
                      <th style={{ width: '5%' }}>
                        <Checkbox
                          style={{ borderSpacing: 0 }}
                          checked={allChecked}
                          onChange={(e) => {
                            const checked = (e.target as any).checked;
                            onCheckedAll(checked);
                          }}
                        />
                      </th>
                      <th>
                        <FormattedMessage id="productFirstLetterUpperCase" />
                      </th>
                      <th style={{ width: '14%' }}>
                        <FormattedMessage id="consumerName" />
                      </th>
                      <th style={{ width: '17%' }}>
                        <FormattedMessage id="recipient" />
                      </th>
                      <th style={{ width: '10%' }}>
                        <FormattedMessage id="amount" />
                        <br />
                        <FormattedMessage id="quantity" />
                      </th>
                      {/* <th style={{ width: '5%' }}>postCode</th> */}
                      {/* <th style={{ width: '5%' }}>rfc</th> */}
                      <th style={{ width: '12%' }}>
                        <FormattedMessage id="order.shippingStatus" />
                      </th>
                      <th style={{ width: '12%' }}>
                        <FormattedMessage id="order.orderStatus" />
                      </th>
                      <th className="operation-th" style={{ width: '12%' }}>
                        <FormattedMessage id="order.paymentStatus" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="ant-table-tbody">{loading ? this._renderLoading() : this._renderContent(dataList)}</tbody>
                </table>
              </div>
              {!loading && total == 0 ? (
                <div className="ant-table-placeholder">
                  <span>
                    <i className="anticon anticon-frown-o" />
                    <FormattedMessage id="noData" />
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
                init({ pageNum: pageNum - 1, pageSize });
              }}
            />
          ) : null}

          <Modal maskClosable={false} title={<FormattedMessage id="order.rejectionReasonTip" />} visible={orderRejectModalVisible} okText={<FormattedMessage id="save" />} onOk={() => this._handleOK()} onCancel={() => this._handleCancel()}>
            <WrappedRejectForm
              ref={(form) => {
                this._rejectForm = form;
              }}
            />
          </Modal>
        </div>
      </div>
    );
  }

  _renderLoading() {
    return (
      <tr style={styles.loading}>
        <td colSpan={8}>
          <Spin />
        </td>
      </tr>
    );
  }

  _renderContent(dataList) {
    const { onChecked, onAudit, verify, needAudit } = this.props.relaxProps;

    return (
      dataList &&
      dataList.map((v, index) => {
        const id = v.get('id');
        const tradePrice = v.getIn(['tradePrice', 'totalPrice']) || 0;
        const gifts = v.get('gifts') ? v.get('gifts') : fromJS([]);
        const num =
          v
            .get('tradeItems')
            .concat(gifts)
            .map((v) => v.get('num'))
            .reduce((a, b) => {
              a = a + b;
              return a;
            }, 0) || 0;
        const buyerId = v.getIn(['buyer', 'id']);

        const orderSource = v.get('orderSource');
        let orderType = '';
        if (orderSource == 'WECHAT') {
          orderType = 'H5 order';
        } else if (orderSource == 'APP') {
          orderType = 'APP order';
        } else if (orderSource == 'PC') {
          orderType = 'PC order';
        } else if (orderSource == 'LITTLEPROGRAM') {
          orderType = 'Mini Program order';
        }
        return (
          <tr className="ant-table-row  ant-table-row-level-0" key={id}>
            <td colSpan={8} style={{ padding: 0 }}>
              <table className="ant-table-self" style={{ border: '1px solid #ddd' }}>
                <thead>
                  <tr>
                    <td colSpan={8} style={{ padding: 0, color: '#999' }}>
                      <div
                        style={{
                          marginTop: 12,
                          borderBottom: '1px solid #F5F5F5',
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

                        <div style={{ width: 310, display: 'inline-block' }}>
                          <span
                            style={{
                              marginLeft: 20,
                              color: '#000',
                              display: 'inline-block',
                              position: 'relative'
                            }}
                          >
                            {id}{' '}
                            {v.get('platform') != 'CUSTOMER' && (
                              <span style={styles.platform}>
                                <FormattedMessage id="order.valetOrder" />
                              </span>
                            )}
                            {/* {orderType != '' && (
                              <span style={styles.platform}>{orderType}</span>
                            )} */}
                            {v.get('grouponFlag') && (
                              <span style={styles.platform}>
                                <FormattedMessage id="order.fightTogether" />
                              </span>
                            )}
                            {v.get('isAutoSub') && <span style={styles.platform}>S</span>}
                            {v.get('isAutoSub') ? (
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '0',
                                  top: '20px'
                                }}
                              >
                                {v.get('subscribeId')}
                              </span>
                            ) : (
                              ''
                            )}
                          </span>
                        </div>

                        <span style={{ marginLeft: 60 }}>
                          <FormattedMessage id="orderTime" />：
                          {v.getIn(['tradeState', 'createTime'])
                            ? Moment(v.getIn(['tradeState', 'createTime']))
                                .format(Const.TIME_FORMAT)
                                .toString()
                            : ''}
                        </span>
                        <span style={{ marginRight: 0, float: 'right' }}>
                          {/*只有未审核状态才显示修改*/}
                          {(v.getIn(['tradeState', 'flowState']) === 'INIT' || v.getIn(['tradeState', 'flowState']) === 'AUDIT') && v.getIn(['tradeState', 'payState']) === 'NOT_PAID' && v.get('tradeItems') && !v.get('tradeItems').get(0).get('isFlashSaleGoods') && (
                            <AuthWrapper functionName="edit_order_f_001_prescriber">
                              <Tooltip placement="top" title="Edit">
                                <a
                                  style={{ marginLeft: 20 }}
                                  onClick={() => {
                                    verify(id, buyerId);
                                  }}
                                  className="iconfont iconEdit"
                                >
                                  {/*<FormattedMessage id="edit" />*/}
                                </a>
                              </Tooltip>
                            </AuthWrapper>
                          )}
                          {v.getIn(['tradeState', 'flowState']) === 'INIT' && v.getIn(['tradeState', 'auditState']) === 'NON_CHECKED' && (
                            <AuthWrapper functionName="fOrderList002_prescriber">
                              <Tooltip placement="top" title="Audit">
                                <a
                                  onClick={() => {
                                    // onAudit(id, 'CHECKED');
                                    this._showAuditConfirm(id);
                                  }}
                                  href="javascript:void(0)"
                                  style={{ marginLeft: 20 }}
                                  className="iconfont iconaudit"
                                >
                                  {/*<FormattedMessage id="order.audit" />*/}
                                </a>
                              </Tooltip>
                            </AuthWrapper>
                          )}
                          {v.getIn(['tradeState', 'flowState']) === 'INIT' && v.getIn(['tradeState', 'auditState']) === 'NON_CHECKED' && v.getIn(['tradeState', 'payState']) != 'PAID' && (
                            <AuthWrapper functionName="fOrderList002_prescriber">
                              <Tooltip placement="top" title="Reject">
                                <a onClick={() => this._showRejectedConfirm(id)} href="javascript:void(0)" style={{ marginLeft: 20 }} className="iconfont iconbtn-cancelall">
                                  {/*<FormattedMessage id="order.turnDown" />*/}
                                </a>
                              </Tooltip>
                            </AuthWrapper>
                          )}
                          {/*待发货状态显示*/}
                          {needAudit && v.getIn(['tradeState', 'flowState']) === 'AUDIT' && v.getIn(['tradeState', 'deliverStatus']) === 'NOT_YET_SHIPPED' && v.getIn(['tradeState', 'payState']) === 'NOT_PAID' && (
                            <AuthWrapper functionName="fOrderList002_prescriber">
                              <Tooltip placement="top" title="Review">
                                <a
                                  style={{ marginLeft: 20 }}
                                  onClick={() => {
                                    this._showRetrialConfirm(id);
                                  }}
                                  href="javascript:void(0)"
                                  className="iconfont iconbtn-review"
                                >
                                  {/*<FormattedMessage id="order.review" />*/}
                                </a>
                              </Tooltip>
                            </AuthWrapper>
                          )}
                          {/* {v.getIn(['tradeState', 'flowState']) === 'AUDIT' &&
                            v.getIn(['tradeState', 'deliverStatus']) ===
                            'NOT_YET_SHIPPED' &&
                            !(
                              v.get('paymentOrder') == 'PAY_FIRST' &&
                              v.getIn(['tradeState', 'payState']) != 'PAID'
                            ) && (
                              <AuthWrapper functionName="fOrderDetail002">
                                <a
                                  onClick={() => this._toDeliveryForm(id)}
                                  style={{ marginLeft: 20 }}
                                >
                                  <FormattedMessage id="order.ship" />
                                </a>
                              </AuthWrapper>
                            )} */}
                          {/*部分发货状态显示*/}
                          {/* {v.getIn(['tradeState', 'flowState']) ===
                            'DELIVERED_PART' &&
                            v.getIn(['tradeState', 'deliverStatus']) ===
                            'PART_SHIPPED' &&
                            !(
                              v.get('paymentOrder') == 'PAY_FIRST' &&
                              v.getIn(['tradeState', 'payState']) != 'PAID'
                            ) && (
                              <AuthWrapper functionName="fOrderDetail002">
                                <a onClick={() => this._toDeliveryForm(id)}>
                                  <FormattedMessage id="order.ship" />
                                </a>
                              </AuthWrapper>
                            )} */}
                          {/*待收货状态显示*/}
                          {v.getIn(['tradeState', 'flowState']) === 'DELIVERED' && (
                            <AuthWrapper functionName="fOrderList003_prescriber">
                              <Tooltip placement="top" title="Confirm receipt">
                                <a
                                  onClick={() => {
                                    this._showConfirm(id);
                                  }}
                                  href="javascript:void(0)"
                                >
                                  <FormattedMessage id="order.confirmReceipt" />
                                </a>
                              </Tooltip>
                            </AuthWrapper>
                          )}
                          <AuthWrapper functionName="fOrderDetail001_prescriber">
                            <Tooltip placement="top" title="See details">
                              <Link style={{ marginLeft: 20, marginRight: 20 }} to={`/order-detail-prescriber/${id}`} className="iconfont iconDetails">
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
                    <td style={{ width: '3%' }} />
                    <td
                      style={{
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'flex-end',
                        flexWrap: 'wrap',
                        padding: '16px 0',
                        width: '100'
                      }}
                    >
                      {/*商品图片*/}
                      {v
                        .get('tradeItems')
                        .concat(gifts)
                        .map((v, k) => (k < 4 ? <img src={v.get('pic') ? v.get('pic') : defaultImg} className="img-item" key={k} /> : null))}

                      {
                        /*第4张特殊处理*/
                        //@ts-ignore
                        v.get('tradeItems').concat(gifts).size > 4 ? (
                          <div style={styles.imgBg}>
                            <img
                              //@ts-ignore
                              src={v.get('tradeItems').concat(gifts).get(3).get('pic') ? v.get('tradeItems').concat(gifts).get(3).get('pic') : defaultImg}
                              style={styles.imgFourth}
                            />
                            //@ts-ignore
                            <div style={styles.imgNum}>
                              <FormattedMessage id="total" />
                              {v.get('tradeItems').concat(gifts).size} <FormattedMessage id="items" />
                            </div>
                          </div>
                        ) : null
                      }
                    </td>
                    <td style={{ width: '14%' }}>
                      {/*客户名称*/}
                      <p title={v.getIn(['buyer', 'name'])} className="line-ellipse">
                        {v.getIn(['buyer', 'name'])}
                      </p>
                    </td>
                    <td style={{ width: '17%' }}>
                      {/*收件人姓名*/}
                      {/* <FormattedMessage id="recipient" />： */}
                      <p title={v.getIn(['consignee', 'name'])} className="line-ellipse">
                        {v.getIn(['consignee', 'name'])}
                      </p>

                      {/* <br /> */}
                      {/*收件人手机号码*/}
                      {/* {v.getIn(['consignee', 'phone'])} */}
                    </td>
                    <td style={{ width: '10%' }}>
                      ${tradePrice.toFixed(2)}
                      <br />（{num} <FormattedMessage id="piece" />)
                    </td>
                    {/* <td style={{ width: '5%' }}> */}
                    {/* 1{v.getIn(['invoice', 'postCode'])} */}
                    {/* </td> */}
                    {/* <td style={{ width: '5%' }}> */}
                    {/* 1{v.getIn(['invoice', 'rfc'])} */}
                    {/* </td> */}
                    {/*发货状态*/}
                    <td style={{ width: '12%' }}>{deliverStatus(v.getIn(['tradeState', 'deliverStatus']))}</td>
                    {/*订单状态*/}
                    <td style={{ width: '12%' }}>{flowState(v.getIn(['tradeState', 'flowState']))}</td>
                    {/*支付状态*/}
                    <td style={{ width: '12%', paddingRight: 22 }} className="operation-td">
                      {payStatus(v.getIn(['tradeState', 'payState']))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        );
      })
    );
  }

  /**
   * 驳回订单确认提示
   * @private
   */
  _showRejectedConfirm = (tdId: string) => {
    const { showRejectModal } = this.props.relaxProps;
    this.setState({ selectedOrderId: tdId }, showRejectModal());
  };

  /**
   * 回审订单确认提示
   * @param tdId
   * @private
   */
  _showRetrialConfirm = (tdId: string) => {
    const { onRetrial } = this.props.relaxProps;

    const confirm = Modal.confirm;
    confirm({
      title: <FormattedMessage id="order.review" />,
      content: <FormattedMessage id="order.confirmReview" />,
      onOk() {
        onRetrial(tdId);
      },
      onCancel() {}
    });
  };

  /**
   * 发货前 验证订单是否存在售后申请 跳转发货页面
   * @param tdId
   * @private
   */
  _toDeliveryForm = (tdId: string) => {
    const { onCheckReturn } = this.props.relaxProps;
    onCheckReturn(tdId);
  };

  /**
   * 确认审核提示
   * @param tid
   */
  _showAuditConfirm = (tid: string) => {
    const { onAudit } = this.props.relaxProps;

    const confirmModal = Modal.confirm;
    confirmModal({
      content: 'Do you confirm that the order has been approved?',
      onOk() {
        onAudit(tid, 'CHECKED');
      },
      onCancel() {}
    });
  };

  /**
   * 确认收货确认提示
   * @param tdId
   * @private
   */
  _showConfirm = (tdId: string) => {
    const { onConfirm } = this.props.relaxProps;

    const confirm = Modal.confirm;
    confirm({
      title: 'Confirm receipt',
      content: 'Confirm that all products have been received?',
      onOk() {
        onConfirm(tdId);
      },
      onCancel() {}
    });
  };

  /**
   * 处理成功
   */
  _handleOK = () => {
    const { onAudit } = this.props.relaxProps;
    this._rejectForm.validateFields(null, (errs, values) => {
      //如果校验通过
      if (!errs) {
        onAudit(this.state.selectedOrderId, 'REJECTED', values.comment);
        this._rejectForm.setFieldsValue({ comment: '' });
      }
    });
  };

  /**
   * 处理取消
   */
  _handleCancel = () => {
    const { hideRejectModal } = this.props.relaxProps;
    hideRejectModal();
    this._rejectForm.setFieldsValue({ comment: '' });
  };
}

const styles = {
  loading: {
    textAlign: 'center',
    height: 300
  },
  imgItem: {
    width: '30%',
    height: 'auto',
    padding: 5,
    border: '1px solid #ddd',
    float: 'left',
    marginRight: 5,
    marginBottom: 5,
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
