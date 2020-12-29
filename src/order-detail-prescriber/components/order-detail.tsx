import React from 'react';
import { IMap, Relax } from 'plume2';
import { Button, Col, Form, Icon, Input, Modal, Popover, Row, Table, Tag, Tooltip } from 'antd';
import { AuthWrapper, cache, Const, noop, util } from 'qmkit';
import { fromJS, Map, List } from 'immutable';
import FormItem from 'antd/lib/form/FormItem';

import moment from 'moment';
import { FormattedMessage } from 'react-intl';

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
  //     callback(new Error('Enter up to 100 characters'));
  //     return;
  //   }
  //   callback();
  // };
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
    countryDict: 'countryDict',
    cityDict: 'cityDict',
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

  state = {
    visiblePetDetails: false,
    havePet: false,
    currentPetInfo: {
      petsName: '',
      birthOfPets: '',
      petsBreed: '',
      petsSex: 0,
      petsType: '',
      petsSizeValueName: '',
      customerPetsPropRelations: []
    }
  };

  render() {
    const { detail, orderRejectModalVisible } = this.props.relaxProps;
    const { currentPetInfo, havePet } = this.state;
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
    gifts = gifts.map((gift) => gift.set('skuName', '【赠品】' + gift.get('skuName')).set('levelPrice', 0)).toJS();
    const tradePrice = detail.get('tradePrice').toJS() as any;

    //收货人信息
    const consignee = detail.get('consignee').toJS() as {
      detailAddress: string;
      name: string;
      phone: string;
      areaId: string;
      cityId: number;
      address: string;
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
          areaId: number;
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
        width: '20%'
      },
      {
        title: 'Weight',
        dataIndex: 'specDetails',
        key: 'specDetails'
      },
      {
        title: 'Pet category',
        dataIndex: 'petCategory',
        key: 'petCategory',
        width: '10%',
        render: (text, record) => <>{record.petsInfo && record.petsInfo.petsType ? <p>{record.petsInfo.petsType}</p> : null}</>
      },
      {
        title: 'Pet name',
        dataIndex: 'petName',
        key: 'petName',
        width: '10%',
        render: (text, record) => <>{record.petsInfo && record.petsInfo.petsName ? <p>{record.petsInfo.petsName}</p> : null}</>
      },
      {
        title: 'Pet details',
        dataIndex: 'petDetails',
        key: 'petDetails',
        width: '10%',
        render: (text, record) => (
          <>
            {record.petsInfo ? (
              <Button type="link" onClick={() => this._openPetDetails(record.petsInfo)}>
                view
              </Button>
            ) : null}
          </>
        )
      },
      {
        title: 'Price',
        dataIndex: 'levelPrice',
        key: 'levelPrice',
        render: (levelPrice) => (
          <span>
            {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
            {levelPrice && levelPrice.toFixed(2)}
          </span>
        )
      },
      {
        title: 'Quantity',
        dataIndex: 'num',
        key: 'num'
      },
      {
        title: 'Subtotal',
        render: (row) => (
          <span>
            {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
            {row && (row.num * row.levelPrice).toFixed(2)}
          </span>
        )
      }
    ];

    const columnsNoPet = [
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
        width: '20%'
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
        render: (levelPrice) => (
          <span>
            {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
            {levelPrice && levelPrice.toFixed(2)}
          </span>
        )
      },
      {
        title: 'Quantity',
        dataIndex: 'num',
        key: 'num'
      },
      {
        title: 'Subtotal',
        render: (row) => (
          <span>
            {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
            {row && (row.num * row.levelPrice).toFixed(2)}
          </span>
        )
      }
    ];

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
            <label style={styles.greenText}>{flowState(detail.getIn(['tradeState', 'flowState']))}</label>

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
                  <FormattedMessage id="order.subscriptioNumber" /> : {detail.get('subscribeId')}
                </p>
              ) : (
                ''
              )}
              <p style={styles.darkText}>
                {<FormattedMessage id="clinicID" />}: {detail.get('clinicsId')}
              </p>
              <p style={styles.darkText}>
                {<FormattedMessage id="clinicName" />}: {detail.get('clinicsName')}
              </p>
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
                  {'Consumer type:  ' + detail.getIn(['buyer', 'levelName'])}
                </p>
              )}
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
          <Table rowKey={(_record, index) => index.toString()} columns={havePet ? columns : columnsNoPet} dataSource={tradeItems.concat(gifts)} pagination={false} bordered />

          <div style={styles.detailBox as any}>
            <div style={styles.inputBox as any} />

            <div style={styles.priceBox}>
              <label style={styles.priceItem as any}>
                <span style={styles.name}>{<FormattedMessage id="productAmount" />}:</span>
                <strong>
                  {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                  {(tradePrice.goodsPrice || 0).toFixed(2)}
                </strong>
              </label>
              {/* <label style={styles.priceItem as any}>
                <span style={styles.name}>
                  {<FormattedMessage id="pointsDeduction" />}:
                </span>
                <strong>-${(tradePrice.pointsPrice || 0).toFixed(2)}</strong>
              </label> */}
              {/* {reduction && (
                <label style={styles.priceItem as any}>
                  <span style={styles.name}>满减优惠: </span>
                  <strong>-${reduction.discounts.toFixed(2)}</strong>
                </label>
              )} */}

              {discount && (
                <label style={styles.priceItem as any}>
                  <span style={styles.name}>{<FormattedMessage id="promotionAmount" />}:</span>
                  <strong>-${discount.discounts.toFixed(2)}</strong>
                </label>
              )}

              {/* {tradePrice.couponPrice ? (
                <div>
                  <label style={styles.priceItem as any}>
                    <span style={styles.name}>优惠券: </span>
                    <strong>
                      -${(tradePrice.couponPrice || 0).toFixed(2)}
                    </strong>
                  </label>
                </div>
              ) : null}

              {tradePrice.special ? (
                <div>
                  <label style={styles.priceItem as any}>
                    <span style={styles.name}>订单改价: </span>
                    <strong>
                      ${(tradePrice.privilegePrice || 0).toFixed(2)}
                    </strong>
                  </label>
                </div>
              ) : null} */}

              <label style={styles.priceItem as any}>
                <span style={styles.name}>{tradePrice.promotionDesc ? tradePrice.promotionDesc : 'Promotion'}: </span>
                <strong>
                  {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                  {(tradePrice.discountsPrice || 0).toFixed(2)}
                </strong>
              </label>

              <label style={styles.priceItem as any}>
                <span style={styles.name}>{<FormattedMessage id="shippingFees" />}: </span>
                <strong>
                  {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                  {(tradePrice.deliveryPrice || 0).toFixed(2)}
                </strong>
              </label>

              <label style={styles.priceItem as any}>
                <span style={styles.name}>{<FormattedMessage id="total" />}: </span>
                <strong>
                  {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                  {(tradePrice.totalPrice || 0).toFixed(2)}
                </strong>
              </label>
            </div>
          </div>
        </div>

        {/* <Row>
          <Col span={8}>
            <p style={styles.inforItem}>
              {<FormattedMessage id="petCategory" />}:{' '}
            </p>
            <p style={styles.inforItem}>{<FormattedMessage id="gender" />}: </p>
            <p style={styles.inforItem}>{<FormattedMessage id="weight" />}: </p>
            <p style={styles.inforItem}>
              {<FormattedMessage id="birthday" />}:{' '}
            </p>
          </Col>
          <Col span={8}>
            <p style={styles.inforItem}>
              {<FormattedMessage id="petName" />}:{' '}
            </p>
            <p style={styles.inforItem}>{<FormattedMessage id="breed" />}: </p>
            <p style={styles.inforItem}>
              {<FormattedMessage id="sterilizedStatus" />}:{' '}
            </p>
            <p style={styles.inforItem}>
              {<FormattedMessage id="specialNeeds" />}:{' '}
            </p>
          </Col>
        </Row> */}
        {/* <div
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
         */}
        <Modal maskClosable={false} title={<FormattedMessage id="order.rejectionReasonTip" />} visible={orderRejectModalVisible} okText={<FormattedMessage id="save" />} onOk={() => this._handleOK(tid)} onCancel={() => this._handleCancel()}>
          <WrappedRejectForm
            ref={(form) => {
              this._rejectForm = form;
            }}
          />
        </Modal>

        <Modal
          title={currentPetInfo.petsName}
          visible={this.state.visiblePetDetails}
          onOk={() => {
            this.setState({
              visiblePetDetails: false
            });
          }}
          onCancel={() => {
            this.setState({
              visiblePetDetails: false
            });
          }}
        >
          <Row>
            <Col span={12}>
              <p>
                {currentPetInfo.petsType === 'dog' ? <i className="iconfont icondog" style={styles.iconRight}></i> : <i className="iconfont iconcat" style={styles.iconRight}></i>}
                {currentPetInfo.petsBreed}
              </p>
              <p>
                <i className="iconfont iconbirthday" style={styles.iconRight}></i>
                {currentPetInfo.birthOfPets}
              </p>
              <p>
                {currentPetInfo.petsSex === 0 ? <i className="iconfont iconman" style={styles.iconRight}></i> : <i className="iconfont iconwoman" style={styles.iconRight}></i>}
                {currentPetInfo.petsSex === 0 ? 'male' : 'female'}
              </p>
              {currentPetInfo.petsSizeValueName ? (
                <p>
                  <i className="iconfont iconweight" style={styles.iconRight}></i>
                  {currentPetInfo.petsSizeValueName}
                </p>
              ) : null}
            </Col>
            <Col span={12}>
              <h3>special Needs</h3>
              {currentPetInfo.customerPetsPropRelations && currentPetInfo.customerPetsPropRelations.map((item) => <Tag style={{ marginBottom: 3 }}>{item.propName}</Tag>)}
            </Col>
          </Row>
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
    const { detail, onAudit, verify, needAudit, onDelivery, showRejectModal } = this.props.relaxProps;
    const flowState = detail.getIn(['tradeState', 'flowState']);
    const payState = detail.getIn(['tradeState', 'payState']);
    const auditState = detail.getIn(['tradeState', 'auditState']);
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
                  onClick={() => {
                    verify(tid);
                  }}
                  href="javascript:void(0)"
                  style={styles.pr20}
                  className="iconfont iconEdit"
                ></a>
                {/* <a
                  style={styles.pr20}
                  onClick={() => {
                    verify(tid);
                  }}
                >
                  Modify
                </a> */}
              </Tooltip>
            </AuthWrapper>
          )}

          {/*已审核处理的*/}
          {flowState === 'AUDIT' && (
            <div>
              {!needAudit || payState === 'PAID' || payState === 'UNCONFIRMED' ? null : (
                <AuthWrapper functionName="fOrderList002_prescriber">
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
              {/* {!(paymentOrder == 'PAY_FIRST' && payState != 'PAID') && (
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
              )} */}
            </div>
          )}
          {/*未审核需要处理的*/}
          {flowState === 'INIT' && payState === 'PAID' && auditState === 'NON_CHECKED' && this.isPrescriber() && (
            <AuthWrapper functionName="fOrderList002_prescriber">
              <Tooltip placement="top" title="Audit">
                <a
                  // onClick={() => {
                  //   onAudit(tid, 'CHECKED');
                  // }}
                  onClick={() => {
                    this._showAuditConfirm(tid);
                  }}
                  href="javascript:void(0)"
                  style={styles.pr20}
                  className="iconfont iconaudit"
                >
                  {/*<FormattedMessage id="order.audit" />*/}
                </a>
              </Tooltip>
            </AuthWrapper>
          )}
          {/*驳回*/}
          {flowState === 'INIT' && payState === 'PAID' && auditState === 'NON_CHECKED' && this.isPrescriber() && (
            <AuthWrapper functionName="fOrderList002_prescriber">
              <Tooltip placement="top" title="Reject">
                <a onClick={() => showRejectModal()} href="javascript:void(0)" style={styles.pr20} className="iconfont iconbtn-cancelall">
                  {/*<FormattedMessage id="order.turnDown" />*/}
                </a>
              </Tooltip>
            </AuthWrapper>
          )}
        </div>
      );
    } else if (flowState === 'DELIVERED_PART') {
      return (
        <div>
          {/* <AuthWrapper functionName="fOrderDetail002">
            <a
              href="javascript:void(0);"
              style={styles.pr20}
              onClick={() => {
                onDelivery();
              }}
            >
              {<FormattedMessage id="ship" />}
            </a>
          </AuthWrapper> */}
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
      title: '回审',
      content: '确认将选中的订单退回重新审核?',
      onOk() {
        retrial(tdId);
      },
      onCancel() {}
    });
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

  _openPetDetails = (petInfo) => {
    this.setState({
      visiblePetDetails: true,
      currentPetInfo: petInfo
    });
  };
  // 是否是Prescriber
  isPrescriber = () => {
    let employee = JSON.parse(sessionStorage.getItem(cache.EMPLOYEE_DATA));
    let roleName = employee.roleName;
    if (roleName.indexOf('Prescriber') !== -1) {
      return true;
    } else {
      return false;
    }
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
  },
  iconRight: {
    marginRight: 5
  }
} as any;
