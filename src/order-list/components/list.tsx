import React from 'react';
import { Relax } from 'plume2';
import { Link } from 'react-router-dom';
import { Checkbox, Spin, Pagination, Modal, Form, Input } from 'antd';
import { List, fromJS } from 'immutable';
import { noop, Const, AuthWrapper } from 'qmkit';
import Moment from 'moment';
import { allCheckedQL } from '../ql';
import FormItem from 'antd/lib/form/FormItem';
const defaultImg = require('../../goods-list/img/none.png');

const deliverStatus = (status) => {
  if (status == 'NOT_YET_SHIPPED') {
    return '未发货';
  } else if (status == 'SHIPPED') {
    return '全部发货';
  } else if (status == 'PART_SHIPPED') {
    return '部分发货';
  } else if (status == 'VOID') {
    return '作废';
  } else {
    return '未知';
  }
};

const payStatus = (status) => {
  if (status == 'NOT_PAID') {
    return '未付款';
  } else if (status == 'UNCONFIRMED') {
    return '待确认';
  } else if (status == 'PAID') {
    return '已付款';
  } else {
    return '未知';
  }
};

const flowState = (status) => {
  if (status == 'INIT') {
    return '待审核';
  } else if (status == 'GROUPON') {
    return '待成团';
  } else if (status == 'AUDIT' || status == 'DELIVERED_PART') {
    return '待发货';
  } else if (status == 'DELIVERED') {
    return '待收货';
  } else if (status == 'CONFIRMED') {
    return '已收货';
  } else if (status == 'COMPLETED') {
    return '已完成';
  } else if (status == 'VOID') {
    return '已作废';
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
              { required: true, message: '请输入驳回原因' },
              { validator: this.checkComment }
            ]
          })(
            <Input.TextArea
              placeholder="请输入驳回原因"
              autosize={{ minRows: 4, maxRows: 4 }}
            />
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
      callback(new Error('备注请填写小于100字符'));
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
                          checked={allChecked}
                          onChange={(e) => {
                            const checked = (e.target as any).checked;
                            onCheckedAll(checked);
                          }}
                        />
                      </th>
                      <th style={{ width: '300' }}>商品</th>
                      <th style={{ width: '10%' }}>客户名称</th>
                      <th style={{ width: '15%' }}>收件人</th>
                      <th style={{ width: '10%' }}>
                        金额<br />数量
                      </th>
                      <th style={{ width: '10%' }}>发货状态</th>
                      <th style={{ width: '10%' }}>订单状态</th>
                      <th className="operation-th" style={{ width: '10%' }}>
                        付款状态
                      </th>
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
                    <i className="anticon anticon-frown-o" />暂无数据
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
            title="请输入驳回原因"
            visible={orderRejectModalVisible}
            okText="保存"
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
          orderType = 'H5订单';
        } else if (orderSource == 'APP') {
          orderType = 'APP订单';
        } else if (orderSource == 'PC') {
          orderType = 'PC订单';
        } else if (orderSource == 'LITTLEPROGRAM') {
          orderType = '小程序订单';
        }
        return (
          <tr className="ant-table-row  ant-table-row-level-0" key={id}>
            <td colSpan={8} style={{ padding: 0 }}>
              <table
                className="ant-table-self"
                style={{ border: '1px solid #ddd' }}
              >
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
                          <span style={{ marginLeft: 20, color: '#000' }}>
                            {id}{' '}
                            {v.get('platform') != 'CUSTOMER' && (
                              <span style={styles.platform}>代客下单</span>
                            )}
                            {orderType != '' && (
                              <span style={styles.platform}>{orderType}</span>
                            )}
                            {v.get('grouponFlag') && (
                              <span style={styles.platform}>拼团</span>
                            )}
                          </span>
                        </div>

                        <span style={{ marginLeft: 60 }}>
                          下单时间：{v.getIn(['tradeState', 'createTime'])
                            ? Moment(v.getIn(['tradeState', 'createTime']))
                                .format(Const.TIME_FORMAT)
                                .toString()
                            : ''}
                        </span>
                        <span style={{ marginRight: 0, float: 'right' }}>
                          {/*只有未审核状态才显示修改*/}
                          {(v.getIn(['tradeState', 'flowState']) === 'INIT' ||
                            v.getIn(['tradeState', 'flowState']) === 'AUDIT') &&
                            v.getIn(['tradeState', 'payState']) ===
                              'NOT_PAID' &&
                            v.get('tradeItems') &&
                            !v
                              .get('tradeItems')
                              .get(0)
                              .get('isFlashSaleGoods') && (
                              <AuthWrapper functionName="edit_order_f_001">
                                <a
                                  style={{ marginLeft: 20 }}
                                  onClick={() => {
                                    verify(id, buyerId);
                                  }}
                                >
                                  修改
                                </a>
                              </AuthWrapper>
                            )}
                          {v.getIn(['tradeState', 'flowState']) === 'INIT' &&
                            v.getIn(['tradeState', 'auditState']) ===
                              'NON_CHECKED' && (
                              <AuthWrapper functionName="fOrderList002">
                                <a
                                  onClick={() => {
                                    onAudit(id, 'CHECKED');
                                  }}
                                  href="javascript:void(0)"
                                  style={{ marginLeft: 20 }}
                                >
                                  审核
                                </a>
                              </AuthWrapper>
                            )}
                          {v.getIn(['tradeState', 'flowState']) === 'INIT' &&
                            v.getIn(['tradeState', 'auditState']) ===
                              'NON_CHECKED' &&
                            v.getIn(['tradeState', 'payState']) != 'PAID' && (
                              <AuthWrapper functionName="fOrderList002">
                                <a
                                  onClick={() => this._showRejectedConfirm(id)}
                                  href="javascript:void(0)"
                                  style={{ marginLeft: 20 }}
                                >
                                  驳回
                                </a>
                              </AuthWrapper>
                            )}
                          {/*待发货状态显示*/}
                          {needAudit &&
                            v.getIn(['tradeState', 'flowState']) === 'AUDIT' &&
                            v.getIn(['tradeState', 'deliverStatus']) ===
                              'NOT_YET_SHIPPED' &&
                            v.getIn(['tradeState', 'payState']) ===
                              'NOT_PAID' && (
                              <AuthWrapper functionName="fOrderList002">
                                <a
                                  style={{ marginLeft: 20 }}
                                  onClick={() => {
                                    this._showRetrialConfirm(id);
                                  }}
                                  href="javascript:void(0)"
                                >
                                  回审
                                </a>
                              </AuthWrapper>
                            )}
                          {v.getIn(['tradeState', 'flowState']) === 'AUDIT' &&
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
                                  发货
                                </a>
                              </AuthWrapper>
                            )}
                          {/*部分发货状态显示*/}
                          {v.getIn(['tradeState', 'flowState']) ===
                            'DELIVERED_PART' &&
                            v.getIn(['tradeState', 'deliverStatus']) ===
                              'PART_SHIPPED' &&
                            !(
                              v.get('paymentOrder') == 'PAY_FIRST' &&
                              v.getIn(['tradeState', 'payState']) != 'PAID'
                            ) && (
                              <AuthWrapper functionName="fOrderDetail002">
                                <a onClick={() => this._toDeliveryForm(id)}>
                                  发货
                                </a>
                              </AuthWrapper>
                            )}
                          {/*待收货状态显示*/}
                          {v.getIn(['tradeState', 'flowState']) ===
                            'DELIVERED' && (
                            <AuthWrapper functionName="fOrderList003">
                              <a
                                onClick={() => {
                                  this._showConfirm(id);
                                }}
                                href="javascript:void(0)"
                              >
                                确认收货
                              </a>
                            </AuthWrapper>
                          )}
                          <AuthWrapper functionName="fOrderDetail001">
                            <Link
                              style={{ marginLeft: 20, marginRight: 20 }}
                              to={`/order-detail/${id}`}
                            >
                              查看详情
                            </Link>
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
                        padding: '16px 0',
                        width: '300'
                      }}
                    >
                      {/*商品图片*/}
                      {v
                        .get('tradeItems')
                        .concat(gifts)
                        .map(
                          (v, k) =>
                            k < 4 ? (
                              <img
                                src={v.get('pic') ? v.get('pic') : defaultImg}
                                style={styles.imgItem}
                                key={k}
                              />
                            ) : null
                        )}

                      {/*第4张特殊处理*/
                      //@ts-ignore
                      v.get('tradeItems').concat(gifts).size > 3 ? (
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
                            共{v.get('tradeItems').concat(gifts).size}件
                          </div>
                        </div>
                      ) : null}
                    </td>
                    <td style={{ width: '10%' }}>
                      {/*客户名称*/}
                      {v.getIn(['buyer', 'name'])}
                    </td>
                    <td style={{ width: '15%' }}>
                      {/*收件人姓名*/}
                      收件人：{v.getIn(['consignee', 'name'])}
                      <br />
                      {/*收件人手机号码*/}
                      {v.getIn(['consignee', 'phone'])}
                    </td>
                    <td style={{ width: '10%' }}>
                      ￥{tradePrice.toFixed(2)}
                      <br />
                      （{num}件)
                    </td>
                    {/*发货状态*/}
                    <td style={{ width: '10%' }}>
                      {deliverStatus(v.getIn(['tradeState', 'deliverStatus']))}
                    </td>
                    {/*订单状态*/}
                    <td style={{ width: '10%' }}>
                      {flowState(v.getIn(['tradeState', 'flowState']))}
                    </td>
                    {/*支付状态*/}
                    <td
                      style={{ width: '10%', paddingRight: 22 }}
                      className="operation-td"
                    >
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
      title: '回审',
      content: '确认将选中的订单退回重新审核?',
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
      title: '确认收货',
      content: '确认已收到全部货品?',
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
