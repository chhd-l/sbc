import React from 'react';
import { IMap, Relax } from 'plume2';
import {
  Button,
  Col,
  Form,
  Icon,
  Input,
  Modal,
  Popover,
  Row,
  Table
} from 'antd';
import { AuthWrapper, Const, noop, util } from 'qmkit';
import { fromJS, Map } from 'immutable';
import FormItem from 'antd/lib/form/FormItem';

import moment from 'moment';
import { FormattedMessage } from 'react-intl';

const columns = [
  {
    title: 'SKU Code',
    dataIndex: 'skuNo',
    key: 'skuNo',
    render: (text) => text
  },
  {
    title: 'Product Name',
    dataIndex: 'skuName',
    key: 'skuName'
  },
  {
    title: 'Weight',
    dataIndex: 'specDetails',
    key: 'specDetails'
  },
  {
    title: 'Price',
    dataIndex: 'levelPrice',
    key: 'levelPrice',
    render: (levelPrice) => <span>￥{levelPrice.toFixed(2)}</span>
  },
  {
    title: 'Quantity',
    dataIndex: 'num',
    key: 'num'
  },
  {
    title: 'Subtotal',
    render: (row) => <span>￥{(row.num * row.levelPrice).toFixed(2)}</span>
  }
];

const invoiceContent = (invoice) => {
  let invoiceContent = '';

  if (invoice.type == '0') {
    invoiceContent += 'general invoice';
  } else if (invoice.type == '1') {
    invoiceContent += '增值税专用发票';
  } else if (invoice.type == '-1') {
    invoiceContent += '不需要发票';
    return invoiceContent;
  }

  invoiceContent += ' ' + (invoice.projectName || '');

  if (invoice.type == 0 && invoice.generalInvoice.flag) {
    invoiceContent += ' ' + (invoice.generalInvoice.title || '');
    invoiceContent += ' ' + invoice.generalInvoice.identification;
  } else if (invoice.type == 1 && invoice.specialInvoice) {
    invoiceContent += ' ' + invoice.specialInvoice.companyName;
    invoiceContent += ' ' + invoice.specialInvoice.identification;
  }
  return invoiceContent;
};

const flowState = (status) => {
  if (status == 'INIT') {
    return 'Pending review';
  } else if (status == 'GROUPON') {
    return 'To be formed';
  } else if (status == 'AUDIT' || status == 'DELIVERED_PART') {
    return 'to be delivered';
  } else if (status == 'DELIVERED') {
    return 'To be received';
  } else if (status == 'CONFIRMED') {
    return 'Received';
  } else if (status == 'COMPLETED') {
    return 'Completed';
  } else if (status == 'VOID') {
    return 'Out of date';
  }
};

/**
 * 拒绝表单，只为校验体验
 */
class RejectForm extends React.Component<any, any> {
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form>
        <FormItem>
          {getFieldDecorator('comment', {
            rules: [
              { required: true, message: '请填写驳回原因' },
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

const WrappedRejectForm = Form.create()(RejectForm);

/**
 * 订单详情
 */
@Relax
export default class OrderDetailTab extends React.Component<any, any> {
  onAudit: any;
  _rejectForm;

  props: {
    relaxProps?: {
      detail: IMap;
      onAudit: Function;
      confirm: Function;
      retrial: Function;
      sellerRemarkVisible: boolean;
      needAudit: boolean;
      setSellerRemarkVisible: Function;
      remedySellerRemark: Function;
      setSellerRemark: Function;
      verify: Function;
      onDelivery: Function;
      orderRejectModalVisible: boolean;
      showRejectModal: Function;
      hideRejectModal: Function;
    };
  };

  static relaxProps = {
    detail: 'detail',
    onAudit: noop,
    confirm: noop,
    retrial: noop,
    sellerRemarkVisible: 'sellerRemarkVisible',
    needAudit: 'needAudit',
    orderRejectModalVisible: 'orderRejectModalVisible',
    setSellerRemarkVisible: noop,
    remedySellerRemark: noop,
    setSellerRemark: noop,
    verify: noop,
    onDelivery: noop,
    showRejectModal: noop,
    hideRejectModal: noop
  };

  render() {
    const {
      detail,
      sellerRemarkVisible,
      setSellerRemarkVisible,
      remedySellerRemark,
      setSellerRemark,
      orderRejectModalVisible
    } = this.props.relaxProps;
    //当前的订单号
    const tid = detail.get('id');

    let orderSource = detail.get('orderSource');
    let orderType = '';
    if (orderSource == 'WECHAT') {
      orderType = 'H5 Order';
    } else if (orderSource == 'APP') {
      orderType = 'APP Order';
    } else if (orderSource == 'PC') {
      orderType = 'PC Order';
    } else if (orderSource == 'LITTLEPROGRAM') {
      orderType = '小程序订单';
    } else {
      orderType = '代客下单';
    }

    const tradeItems = detail.get('tradeItems').toJS();
    //赠品信息
    let gifts = detail.get('gifts') ? detail.get('gifts') : fromJS([]);
    gifts = gifts
      .map((gift) =>
        gift
          .set('skuName', '【赠品】' + gift.get('skuName'))
          .set('levelPrice', 0)
      )
      .toJS();
    const tradePrice = detail.get('tradePrice').toJS() as any;

    //收货人信息
    const consignee = detail.get('consignee').toJS() as {
      detailAddress: string;
      name: string;
      phone: string;
    };

    //发票信息
    const invoice = detail.get('invoice')
      ? (detail.get('invoice').toJS() as {
          open: boolean; //是否需要开发票
          type: number; //发票类型
          title: string; //发票抬头
          projectName: string; //开票项目名称
          generalInvoice: IMap; //普通发票
          specialInvoice: IMap; //增值税专用发票
          address: string;
          contacts: string; //联系人
          phone: string; //联系方式
          provinceId: number;
          cityId: number;
          areaId: number;
        })
      : null;

    //附件信息
    const encloses = detail.get('encloses')
      ? detail.get('encloses').split(',')
      : [];
    const enclo = fromJS(
      encloses.map((url, index) =>
        Map({
          uid: index,
          name: index,
          size: 1,
          status: 'done',
          url: url
        })
      )
    );
    //交易状态
    const tradeState = detail.get('tradeState');

    //满减、满折金额
    tradePrice.discountsPriceDetails =
      tradePrice.discountsPriceDetails || fromJS([]);
    const reduction = tradePrice.discountsPriceDetails.find(
      (item) => item.marketingType == 0
    );
    const discount = tradePrice.discountsPriceDetails.find(
      (item) => item.marketingType == 1
    );
    tradeItems.forEach((tradeItems) => {
      if (tradeItems.isFlashSaleGoods) {
        tradeItems.levelPrice = tradeItems.price;
      }
    });
    return (
      <div>
        <div style={styles.headBox as any}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <label style={styles.greenText}>
              {flowState(detail.getIn(['tradeState', 'flowState']))}
            </label>

            {this._renderBtnAction(tid)}
          </div>
          <Row>
            <Col span={8}>
              <p style={styles.darkText}>
                {<FormattedMessage id="orderNumber" />}:{detail.get('id')}{' '}
                {/*{detail.get('platform') != 'CUSTOMER' && (*/}
                {/*<span style={styles.platform}>代下单</span>*/}
                <span style={styles.platform}>{orderType}</span>
                {detail.get('grouponFlag') && (
                  <span style={styles.platform}>拼团</span>
                )}
                {/*)}*/}
              </p>
              <p style={styles.darkText}>
                {<FormattedMessage id="orderTime" />}:
                {moment(tradeState.get('createTime')).format(Const.TIME_FORMAT)}
              </p>
            </Col>
            <Col span={8}>
              <p style={styles.darkText}>
                {<FormattedMessage id="consumer" />}:
                {detail.getIn(['buyer', 'name'])}
              </p>
              <p style={styles.darkText}>
                {<FormattedMessage id="consumerAccount" />}:
                {detail.getIn(['buyer', 'account'])}
              </p>
              {detail.getIn(['buyer', 'customerFlag']) && (
                <p style={styles.darkText}>
                  {(util.isThirdStore()
                    ? 'Consumer Level:  '
                    : 'Platform Level:  ') +
                    detail.getIn(['buyer', 'levelName'])}
                </p>
              )}
            </Col>
          </Row>
        </div>

        <div
          style={{ display: 'flex', marginTop: 20, flexDirection: 'column' }}
        >
          <Table
            rowKey={(_record, index) => index.toString()}
            columns={columns}
            dataSource={tradeItems.concat(gifts)}
            pagination={false}
            bordered
          />

          <div style={styles.detailBox as any}>
            <div style={styles.inputBox as any} />

            <div style={styles.priceBox}>
              <label style={styles.priceItem as any}>
                <span style={styles.name}>
                  {<FormattedMessage id="productAmount" />}:
                </span>
                <strong>￥{(tradePrice.goodsPrice || 0).toFixed(2)}</strong>
              </label>
              <label style={styles.priceItem as any}>
                <span style={styles.name}>
                  {<FormattedMessage id="pointsDeduction" />}:
                </span>
                <strong>-￥{(tradePrice.pointsPrice || 0).toFixed(2)}</strong>
              </label>
              {/* {reduction && (
                <label style={styles.priceItem as any}>
                  <span style={styles.name}>满减优惠: </span>
                  <strong>-￥{reduction.discounts.toFixed(2)}</strong>
                </label>
              )}

              {discount && (
                <label style={styles.priceItem as any}>
                  <span style={styles.name}>满折优惠: </span>
                  <strong>-￥{discount.discounts.toFixed(2)}</strong>
                </label>
              )}

              {tradePrice.couponPrice ? (
                <div>
                  <label style={styles.priceItem as any}>
                    <span style={styles.name}>优惠券: </span>
                    <strong>
                      -￥{(tradePrice.couponPrice || 0).toFixed(2)}
                    </strong>
                  </label>
                </div>
              ) : null}

              {tradePrice.special ? (
                <div>
                  <label style={styles.priceItem as any}>
                    <span style={styles.name}>订单改价: </span>
                    <strong>
                      ￥{(tradePrice.privilegePrice || 0).toFixed(2)}
                    </strong>
                  </label>
                </div>
              ) : null} */}

              <label style={styles.priceItem as any}>
                <span style={styles.name}>
                  {<FormattedMessage id="shippingFees" />}:{' '}
                </span>
                <strong>￥{(tradePrice.deliveryPrice || 0).toFixed(2)}</strong>
              </label>

              <label style={styles.priceItem as any}>
                <span style={styles.name}>
                  {<FormattedMessage id="totalPayable" />}:{' '}
                </span>
                <strong>￥{(tradePrice.totalPrice || 0).toFixed(2)}</strong>
              </label>
            </div>
          </div>
        </div>

        <div
          style={{ display: 'flex', flexDirection: 'column', marginBottom: 10 }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              paddingTop: 10,
              marginLeft: 20
            }}
          >
            {<FormattedMessage id="sellerNotes" />}:
            {sellerRemarkVisible == true && (
              <a onClick={() => setSellerRemarkVisible(false)}>
                <Icon type="edit" />
                {detail.get('sellerRemark') || 'none'}
              </a>
            )}
            {sellerRemarkVisible == false && (
              <div
                style={{ width: 400, display: 'flex', flexDirection: 'row' }}
              >
                <Input
                  style={{ width: 300, marginRight: 20 }}
                  onChange={(e) => {
                    setSellerRemark((e.target as any).value);
                  }}
                  placeholder={detail.get('sellerRemark')}
                  size="small"
                  defaultValue={detail.get('sellerRemark')}
                />

                <a style={styles.pr20} onClick={() => remedySellerRemark()}>
                  {<FormattedMessage id="confirm" />}
                </a>
                <a onClick={() => setSellerRemarkVisible(true)}>
                  {<FormattedMessage id="cancel" />}
                </a>
              </div>
            )}
          </div>
          <label style={styles.inforItem}>
            {<FormattedMessage id="buyerNotes" />}:{' '}
            {detail.get('buyerRemark') || 'none'}
          </label>
          <label style={styles.inforItem}>
            {<FormattedMessage id="orderAttachment" />}:{' '}
            {this._renderEncloses(enclo)}
          </label>

          <label style={styles.inforItem}>
            {<FormattedMessage id="paymentMethod" />}:{' '}
            {detail.getIn(['payInfo', 'desc']) || 'none'}
          </label>
          {
            <label style={styles.inforItem}>
              {<FormattedMessage id="invoiceInformation" />}:{' '}
              {invoice ? invoiceContent(invoice) || '' : 'none'}
            </label>
          }
          {invoice.address && (
            <label style={styles.inforItem}>
              {<FormattedMessage id="invoiceReceivingAddress" />}:{' '}
              {invoice && invoice.type == -1
                ? 'none'
                : `${invoice.contacts} ${invoice.phone}
                ${invoice.address || 'none'}`}
            </label>
          )}
          <label style={styles.inforItem}>
            {<FormattedMessage id="deliveryMethod" />}:{' '}
            {<FormattedMessage id="expressDelivery" />}
          </label>
          <label style={styles.inforItem}>
            {<FormattedMessage id="deliveryInformation" />}:{consignee.name}{' '}
            {consignee.phone} {consignee.detailAddress}
          </label>

          {tradeState.get('obsoleteReason') && (
            <label style={styles.inforItem}>
              驳回原因：{tradeState.get('obsoleteReason')}
            </label>
          )}
        </div>
        <Modal
          maskClosable={false}
          title="请输入驳回原因"
          visible={orderRejectModalVisible}
          okText="保存"
          onOk={() => this._handleOK(tid)}
          onCancel={() => this._handleCancel()}
        >
          <WrappedRejectForm
            ref={(form) => {
              this._rejectForm = form;
            }}
          />
        </Modal>
      </div>
    );
  }

  //附件
  _renderEncloses(encloses) {
    if (encloses.size == 0 || encloses[0] === '') {
      return <span>{<FormattedMessage id="none" />}</span>;
    }

    return encloses.map((v, k) => {
      return (
        <Popover
          key={'pp-' + k}
          placement="topRight"
          title={''}
          trigger="click"
          content={
            <img
              key={'p-' + k}
              style={styles.attachmentView}
              src={v.get('url')}
            />
          }
        >
          <a href="javascript:;">
            <img key={k} style={styles.attachment} src={v.get('url')} />
          </a>
        </Popover>
      );
    });
  }

  _renderBtnAction(tid: string) {
    const {
      detail,
      onAudit,
      verify,
      needAudit,
      onDelivery,
      showRejectModal
    } = this.props.relaxProps;
    const flowState = detail.getIn(['tradeState', 'flowState']);
    const payState = detail.getIn(['tradeState', 'payState']);
    const paymentOrder = detail.get('paymentOrder');

    //修改状态的修改
    //创建订单状态
    if (flowState === 'INIT' || flowState === 'AUDIT') {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {payState === 'NOT_PAID' && (
            <AuthWrapper functionName="edit_order_f_001">
              <a
                style={styles.pr20}
                onClick={() => {
                  verify(tid);
                }}
              >
                修改
              </a>
            </AuthWrapper>
          )}
          {payState === 'PAID'
            ? null
            : flowState === 'INIT' && (
                <AuthWrapper functionName="fOrderList002">
                  <a
                    onClick={() => showRejectModal()}
                    href="javascript:void(0)"
                    style={styles.pr20}
                  >
                    驳回
                  </a>
                </AuthWrapper>
              )}
          {/*已审核处理的*/}
          {flowState === 'AUDIT' && (
            <div>
              {!needAudit ||
              payState === 'PAID' ||
              payState === 'UNCONFIRMED' ? null : (
                <AuthWrapper functionName="fOrderList002">
                  <a
                    onClick={() => {
                      this._showRetrialConfirm(tid);
                    }}
                    href="javascript:void(0)"
                    style={styles.pr20}
                  >
                    回审
                  </a>
                </AuthWrapper>
              )}
              {!(paymentOrder == 'PAY_FIRST' && payState != 'PAID') && (
                <AuthWrapper functionName="fOrderDetail002">
                  <a
                    href="javascript:void(0);"
                    style={styles.pr20}
                    onClick={() => {
                      onDelivery();
                    }}
                  >
                    {<FormattedMessage id="ship" />}
                  </a>
                </AuthWrapper>
              )}
            </div>
          )}
          {/*未审核需要处理的*/}
          {flowState === 'INIT' && (
            <AuthWrapper functionName="fOrderList002">
              <Button
                onClick={() => {
                  onAudit(tid, 'CHECKED');
                }}
                style={{ fontSize: 14 }}
              >
                审核
              </Button>
            </AuthWrapper>
          )}
        </div>
      );
    } else if (flowState === 'DELIVERED_PART') {
      return (
        <div>
          <AuthWrapper functionName="fOrderDetail002">
            <a
              href="javascript:void(0);"
              style={styles.pr20}
              onClick={() => {
                onDelivery();
              }}
            >
              {<FormattedMessage id="ship" />}
            </a>
          </AuthWrapper>
        </div>
      );
    } else if (flowState === 'DELIVERED') {
      return (
        <div>
          <AuthWrapper functionName="fOrderList003">
            <a
              onClick={() => {
                this._showConfirm(tid);
              }}
              href="javascript:void(0)"
              style={styles.pr20}
            >
              确认收货
            </a>
          </AuthWrapper>
        </div>
      );
    }

    return null;
  }

  /**
   * 处理成功
   */
  _handleOK = (tdId) => {
    const { onAudit } = this.props.relaxProps;
    this._rejectForm.validateFields(null, (errs, values) => {
      //如果校验通过
      if (!errs) {
        onAudit(tdId, 'REJECTED', values.comment);
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

  /**
   * 回审订单确认提示
   * @param tdId
   * @private
   */
  _showRetrialConfirm = (tdId: string) => {
    const { retrial } = this.props.relaxProps;

    const confirm = Modal.confirm;
    confirm({
      title: '回审',
      content: '确认将选中的订单退回重新审核?',
      onOk() {
        retrial(tdId);
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
    const { confirm } = this.props.relaxProps;

    const confirmModal = Modal.confirm;
    confirmModal({
      title: '确认收货',
      content: '确认已收到全部货品?',
      onOk() {
        confirm(tdId);
      },
      onCancel() {}
    });
  };
}

const styles = {
  headBox: {
    padding: 15,
    backgroundColor: '#FAFAFA'
  },
  greenText: {
    color: '#339966'
  },
  greyText: {
    marginLeft: 20
  },
  pr20: {
    paddingRight: 20
  },
  detailBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    border: '1px solid #e9e9e9',
    borderTop: 0,
    marginTop: -4,
    borderRadius: 4
  },
  priceBox: {
    display: 'flex',
    flexDirection: 'column'
  },
  name: {
    width: 80,
    textAlign: 'right',
    display: 'inline-block'
  },
  priceItem: {
    width: 240,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10
  },
  inputBox: {
    display: 'flex',
    flexDirection: 'column',
    height: 70,
    justifyContent: 'space-between'
  },
  inforItem: {
    paddingTop: 10,
    marginLeft: 20
  } as any,

  imgItem: {
    width: 40,
    height: 40,
    border: '1px solid #ddd',
    display: 'inline-block',
    marginRight: 10,
    background: '#fff'
  },
  attachment: {
    maxWidth: 40,
    maxHeight: 40,
    marginRight: 5
  },
  attachmentView: {
    maxWidth: 400,
    maxHeight: 400
  },
  platform: {
    fontSize: 12,
    color: '#fff',
    padding: '1px 3px',
    background: '#F56C1D',
    display: 'inline-block',
    marginLeft: 5
  }
} as any;
