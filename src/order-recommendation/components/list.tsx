import React from 'react';
import { Relax } from 'plume2';
import { Link } from 'react-router-dom';
import { Checkbox, Spin, Pagination, Modal, Form, Input } from 'antd';
import { List, fromJS } from 'immutable';
import { noop, Const, AuthWrapper, history } from 'qmkit';
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
        <FormItem>
          {getFieldDecorator('comment', {
            rules: [
              {
                required: true,
                message: <FormattedMessage id="order.rejectionReasonTip" />
              },
              { validator: this.checkComment }
            ]
          })(
            <FormattedMessage id="order.rejectionReasonTip">
              {(txt) => (
                <Input.TextArea
                  placeholder={txt.toString()}
                  autosize={{ minRows: 4, maxRows: 4 }}
                />
              )}
            </FormattedMessage>
          )}
        </FormItem>
      </Form>
    );
  }

  checkComment = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }

    if (value.length > 100) {
      callback(new Error('Please input less than 100 characters'));
      return;
    }
    callback();
  };
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
    const {
      loading,
      total,
      pageSize,
      dataList,
      onCheckedAll,
      allChecked,
      init,
      currentPage,
      orderRejectModalVisible
    } = this.props.relaxProps;

    return (
      <div>
        <div className="ant-table-wrapper">
          <div className="ant-table ant-table-large ant-table-scroll-position-left">
            <div className="ant-table-content">
              <div className="ant-table-body">
                <table
                  style={{ borderCollapse: 'separate', borderSpacing: '0 1em' }}
                >
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
                      <th style={{ width: '11%' }}>
                        <FormattedMessage id="productFirstLetterUpperCase" />
                      </th>
                      <th style={{ width: '13%' }}>
                        <FormattedMessage id="consumerName" />
                      </th>
                      <th style={{ width: '15%' }}>Consumer Account</th>
                      <th style={{ width: '11%' }}>Amount</th>
                      <th style={{ width: '11%' }}>Link status</th>
                      <th style={{ width: '11%' }}>Perscriber</th>
                      <th style={{ width: '11%' }}>Operation</th>
                    </tr>
                  </thead>
                  <tbody className="ant-table-tbody">
                    {loading
                      ? this._renderLoading()
                      : this._renderContent(dataList)}
                  </tbody>
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

          <Modal
            maskClosable={false}
            title={<FormattedMessage id="order.rejectionReasonTip" />}
            visible={orderRejectModalVisible}
            okText={<FormattedMessage id="save" />}
            onOk={() => this._handleOK()}
            onCancel={() => this._handleCancel()}
          >
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
        <td colSpan={9}>
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
            <td colSpan={9} style={{ padding: 0 }}>
              <table
                className="ant-table-self"
                style={{ border: '1px solid #ddd' }}
              >
                <thead>
                  <tr>
                    <td colSpan={9} style={{ padding: 0, color: '#999' }}>
                      <div
                        style={{
                          marginTop: 12,
                          borderBottom: '1px solid #F5F5F5',
                          height: 40
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
                            {v.get('isAutoSub') && (
                              <span style={styles.platform}>Subscription</span>
                            )}
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
                        .map((v, k) =>
                          k < 4 ? (
                            <img
                              src={v.get('pic') ? v.get('pic') : defaultImg}
                              className="img-item"
                              // style={styles.imgItem}
                              key={k}
                            />
                          ) : null
                        )}

                      {
                        /*最后一张特殊处理*/
                        //@ts-ignore
                        v.get('tradeItems').concat(gifts).size > 4 ? (
                          <div style={styles.imgBg}>
                            <img
                              //@ts-ignore
                              src={
                                v
                                  .get('tradeItems')
                                  .concat(gifts)
                                  .get(3)
                                  .get('pic')
                                  ? v
                                      .get('tradeItems')
                                      .concat(gifts)
                                      .get(3)
                                      .get('pic')
                                  : defaultImg
                              }
                              style={styles.imgFourth}
                            />
                            //@ts-ignore
                            <div style={styles.imgNum}>
                              <FormattedMessage id="total" />{' '}
                              {v.get('tradeItems').concat(gifts).size}
                              <FormattedMessage id="items" />
                            </div>
                          </div>
                        ) : null
                      }
                    </td>
                    <td style={{ width: '14.8%' }}>
                      {/*客户名称*/}
                      <p
                        title={v.getIn(['buyer', 'name'])}
                        className="line-ellipse"
                      >
                        {v.getIn(['buyer', 'name'])}
                      </p>
                    </td>
                    <td style={{ width: '16.5%' }}>
                      {/*收件人姓名*/}
                      {/* <FormattedMessage id="recipient" />： */}
                      <p
                        title={v.getIn(['consignee', 'name'])}
                        className="line-ellipse"
                      >
                        {v.getIn(['consignee', 'name'])}
                      </p>

                      {/* <br /> */}
                      {/*收件人手机号码*/}
                      {/* {v.getIn(['consignee', 'phone'])} */}
                    </td>
                    <td style={{ width: '13%' }}>
                      ${tradePrice.toFixed(2)}
                      <br />（{num} <FormattedMessage id="piece" />)
                    </td>
                    <td style={{ width: '12.5%' }}>
                      <p
                        title={v.getIn(['clinicsName', 'name'])}
                        className="line-ellipse"
                      >
                        {v.get('clinicsName')}
                      </p>
                    </td>
                    {/*发货状态*/}

                    {/*订单状态*/}
                    <td style={{ width: '12.5%' }}>
                      {flowState(v.getIn(['tradeState', 'flowState']))}
                    </td>
                    {/*支付状态*/}
                    <td
                      style={{ width: '12%', paddingRight: 22 }}
                      className="operation-td"
                    >
                      <div
                        style={{ color: '#e2001a', cursor: 'pointer' }}
                        onClick={(e) => {
                          history.push('/recomm-page-detail');
                        }}
                      >
                        Detail
                      </div>
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
    width: '40%',
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