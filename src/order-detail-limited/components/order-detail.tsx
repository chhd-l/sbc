import React from 'react';
import { IMap, Relax } from 'plume2';
import { Button, Col, Form, Icon, Input, Modal, Popover, Row, Table, Tooltip } from 'antd';
import { AuthWrapper, Const, noop, util, getOrderStatusValue } from 'qmkit';
import { fromJS, Map, List } from 'immutable';
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
    key: 'skuName',
    width: '50%'
  },
  {
    title: 'Weight',
    dataIndex: 'specDetails',
    key: 'specDetails'
  },
  // {
  //   title: 'Price',
  //   dataIndex: 'levelPrice',
  //   key: 'levelPrice',
  //   render: (levelPrice) => <span>${levelPrice.toFixed(2)}</span>
  // },
  {
    title: 'Quantity',
    dataIndex: 'num',
    key: 'num'
  }
  // {
  //   title: 'Subtotal',
  //   render: (row) => <span>${(row.num * row.levelPrice).toFixed(2)}</span>
  // }
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
              {
                required: true,
                message: <FormattedMessage id="order.rejectionReasonTip" />
              },
              {
                max: 100,
                message: 'Please input less than 100 characters'
              }
              // { validator: this.checkComment }
            ]
          })(<Input.TextArea placeholder="Please enter the reason for rejection" autosize={{ minRows: 4, maxRows: 4 }} />)}
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
      callback(new Error('Enter up to 100 characters'));
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
      countryDict: List<any>;
      cityDict: List<any>;
      onAudit: Function;
      confirm: Function;
      retrial: Function;
      sellerRemarkVisible: boolean;
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
    countryDict: 'countryDict',
    cityDict: 'cityDict',
    onAudit: noop,
    confirm: noop,
    retrial: noop,
    sellerRemarkVisible: 'sellerRemarkVisible',
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
    const { detail, countryDict, cityDict, sellerRemarkVisible, setSellerRemarkVisible, remedySellerRemark, setSellerRemark, orderRejectModalVisible } = this.props.relaxProps;
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
    gifts = gifts.map((gift) => gift.set('skuName', (window as any).RCi18n({ id: 'Order.Giveaway' }) + gift.get('skuName')).set('levelPrice', 0)).toJS();
    const tradePrice = detail.get('tradePrice').toJS() as any;

    //收货人信息
    const consignee = detail.get('consignee').toJS() as {
      detailAddress: string;
      name: string;
      phone: string;
      countryId: string;
      cityId: number;
      city: string;
      province: string;
      address: string;
      detailAddress1: string;
      detailAddress2: string;
      rfc: string;
      postCode: string;
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
          countryId: number;
        })
      : null;

    //附件信息
    const encloses = detail.get('encloses') ? detail.get('encloses').split(',') : [];
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
    tradePrice.discountsPriceDetails = tradePrice.discountsPriceDetails || fromJS([]);
    const reduction = tradePrice.discountsPriceDetails.find((item) => item.marketingType == 0);
    const discount = tradePrice.discountsPriceDetails.find((item) => item.marketingType == 1);
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
            <label style={styles.greenText}><FormattedMessage id={getOrderStatusValue('OrderStatus', detail.getIn(['tradeState', 'flowState']))} /></label>

            {this._renderBtnAction(tid)}
          </div>
          <Row>
            <Col span={8}>
              <p style={styles.darkText}>
                {<FormattedMessage id="orderNumber" />}: {detail.get('id')} {/*{detail.get('platform') != 'CUSTOMER' && (*/}
                {/*<span style={styles.platform}>代下单</span>*/}
                {/* <span style={styles.platform}>{orderType}</span> */}
                {detail.get('grouponFlag') && <span style={styles.platform}>拼团</span>}
                {/*)}*/}
              </p>
              <p style={styles.darkText}>
                {<FormattedMessage id="orderTime" />}: {moment(tradeState.get('createTime')).format(Const.TIME_FORMAT)}
              </p>
              {detail.get('isAutoSub') ? (
                <p style={styles.darkText}>
                  <FormattedMessage id="order.subscriptionNumber" /> : {detail.get('subscribeId')}
                </p>
              ) : (
                ''
              )}
            </Col>
            <Col span={8}>
              <p style={styles.darkText}>
                {<FormattedMessage id="consumer" />}: {detail.getIn(['buyer', 'name'])}
              </p>
              <p style={styles.darkText}>
                {<FormattedMessage id="consumerAccount" />}: {detail.getIn(['buyer', 'account'])}
              </p>
              {detail.getIn(['buyer', 'customerFlag']) && (
                <p style={styles.darkText}>
                  {/* {(util.isThirdStore()
                    ? 'Consumer Level:  '
                    : 'Platform Level:  ') +
                    detail.getIn(['buyer', 'levelName'])} */}
                  {'Pet owner type:  ' + detail.getIn(['buyer', 'levelName'])}
                </p>
              )}
              <p style={styles.darkText}>
                {<FormattedMessage id="phoneNumber" />}: {detail.getIn(['consignee', 'phone'])}
              </p>
            </Col>
          </Row>
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 20,
            flexDirection: 'column',
            wordBreak: 'break-word'
          }}
        >
          <Table rowKey={(_record, index) => index.toString()} columns={columns} dataSource={tradeItems.concat(gifts)} pagination={false} bordered />
        </div>

        <Row>
          <Col span={8}>
            <p style={styles.inforItem}>
              {<FormattedMessage id="deliveryCountry" />}: {countryDict.find((c) => c.id == consignee.countryId) ? countryDict.find((c) => c.id == consignee.countryId).name : consignee.countryId}
            </p>
            {consignee.province ? (
              <p style={styles.inforItem}>
                {<FormattedMessage id="deliveryState" />}: {consignee.province}
              </p>
            ) : null}
            <p style={styles.inforItem}>
              {<FormattedMessage id="deliveryCity" />}: {consignee.city}
            </p>
            <p style={styles.inforItem}>
              {<FormattedMessage id="deliveryAddress1" />}: {consignee.detailAddress1}
            </p>
            <p style={styles.inforItem}>
              {<FormattedMessage id="deliveryAddress2" />}: {consignee.detailAddress2}
            </p>
            <p style={styles.inforItem}>
              {<FormattedMessage id="postalCode" />}: {consignee.postCode}
            </p>
            <p style={styles.inforItem}>
              {<FormattedMessage id="reference" />}: {consignee.rfc}
            </p>
            <p style={styles.inforItem}>
              {<FormattedMessage id="deliveryComment" />}: {detail.get('buyerRemark')}
            </p>
          </Col>
        </Row>

        <Modal maskClosable={false} title={<FormattedMessage id="order.rejectionReasonTip" />} visible={orderRejectModalVisible} okText={<FormattedMessage id="save" />} onOk={() => this._handleOK(tid)} onCancel={() => this._handleCancel()}>
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
        <Popover key={'pp-' + k} placement="topRight" title={''} trigger="click" content={<img key={'p-' + k} style={styles.attachmentView} src={v.get('url')} />}>
          <a href="#">
            <img key={k} style={styles.attachment} src={v.get('url')} />
          </a>
        </Popover>
      );
    });
  }

  _renderBtnAction(tid: string) {
    const { detail, onAudit, verify, onDelivery, showRejectModal } = this.props.relaxProps;
    const flowState = detail.getIn(['tradeState', 'flowState']);
    const payState = detail.getIn(['tradeState', 'payState']);
    const deliverStatus = detail.getIn(['tradeState', 'deliverStatus']);
    const paymentOrder = detail.get('paymentOrder');

    //修改状态的修改
    //创建订单状态
    if (flowState === 'INIT' || flowState === 'AUDIT') {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {payState === 'NOT_PAID' && (
            <AuthWrapper functionName="edit_order_f_001">
              <Tooltip placement="top" title="Modify">
                <a
                  style={styles.pr20}
                  onClick={() => {
                    verify(tid);
                  }}
                >
                  Modify
                </a>
              </Tooltip>
            </AuthWrapper>
          )}
          {
            // payState === 'PAID'
            //   ? null
            //   : flowState === 'INIT' && (
            //       <AuthWrapper functionName="fOrderList002">
            //         <Tooltip placement="top" title="Turn down">
            //           <a onClick={() => showRejectModal()} href="javascript:void(0)" style={styles.pr20} className="iconfont iconbtn-turndown">
            //             {/*<FormattedMessage id="order.turnDown" />*/}
            //           </a>
            //         </Tooltip>
            //       </AuthWrapper>
            //     )
          }
          {/*已审核处理的*/}
          {flowState === 'AUDIT' && (
            <div>
              {payState === 'PAID' || payState === 'UNCONFIRMED' ? null : (
                <AuthWrapper functionName="fOrderList002">
                  <Tooltip placement="top" title="Re-review">
                    <a
                      onClick={() => {
                        this._showRetrialConfirm(tid);
                      }}
                      href="javascript:void(0)"
                      style={styles.pr20}
                    >
                      Re-review
                    </a>
                  </Tooltip>
                </AuthWrapper>
              )}
              {!(paymentOrder == 'PAY_FIRST' && payState != 'PAID') && (
                <AuthWrapper functionName="fOrderDetail002_3pl">
                  <Tooltip placement="top" title="Ship">
                    <a
                      href="javascript:void(0);"
                      style={styles.pr20}
                      onClick={() => {
                        onDelivery();
                      }}
                      className="iconfont iconbtn-shipping"
                    >
                      {/*{<FormattedMessage id="ship" />}*/}
                    </a>
                  </Tooltip>
                </AuthWrapper>
              )}
            </div>
          )}
          {/*未审核需要处理的*/}
          {
            // flowState === 'INIT' && (
            //   <AuthWrapper functionName="fOrderList002">
            //     <Tooltip placement="top" title="Review">
            //       <a
            //         onClick={() => {
            //           onAudit(tid, 'CHECKED');
            //         }}
            //         style={{ fontSize: 14 }}
            //         className="iconfont iconbtn-review"
            //       >
            //         {/*Review*/}
            //       </a>
            //     </Tooltip>
            //   </AuthWrapper>
            // )
          }
        </div>
      );
    } else if (((flowState === 'TO_BE_DELIVERED' || flowState === 'PARTIALLY_SHIPPED') && (deliverStatus == 'NOT_YET_SHIPPED' || deliverStatus === 'PART_SHIPPED') && (payState === 'PAID'))) {
      return (
        <div>
          <AuthWrapper functionName="fOrderDetail002_3pl">
            <Tooltip placement="top" title="Ship">
              <a
                href="javascript:void(0);"
                style={styles.pr20}
                onClick={() => {
                  onDelivery();
                }}
                className="iconfont iconbtn-shipping"
              >
                {/* {<FormattedMessage id="ship" />}*/}
              </a>
            </Tooltip>
          </AuthWrapper>
        </div>
      );
    } else if (flowState === 'DELIVERED') {
      return (
        <div>
          <AuthWrapper functionName="fOrderList003">
            <Tooltip placement="top" title="Confirm Receipt">
              <a
                onClick={() => {
                  this._showConfirm(tid);
                }}
                href="javascript:void(0)"
                style={styles.pr20}
              >
                Confirm Receipt
              </a>
            </Tooltip>
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
      title: 'Re-review',
      content: 'Confirm to return the selected order for re approval ?',
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
      title: 'Confirm receipt',
      content: 'Confirm receipt of all items?',
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
    width: 140,
    textAlign: 'right',
    display: 'inline-block'
  },
  priceItem: {
    width: 300,
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
