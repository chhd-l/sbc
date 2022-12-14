import React from 'react';
import { IMap, Relax } from 'plume2';
import { Col, Form, Input, Modal, Row, Table, Tooltip } from 'antd';
import {
  AuthWrapper,
  Const,
  noop,
  cache,
  getOrderStatusValue,
  getFormatDeliveryDateStr,
  RCi18n,
  checkAuth,
  util
} from 'qmkit';
import { fromJS, List } from 'immutable';
import FormItem from 'antd/lib/form/FormItem';
import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
import PetItem from '@/customer-details/component/pet-item';
import OrderMoreFields from './order_more_field';
import './style.less';
import { Consignee, Invoice } from '@/order-detail/components/type';
import * as webapi from '../webapi';

const orderTypeList = [
  { value: 'SINGLE_PURCHASE', name: 'Single purchase' },
  { value: 'SUBSCRIPTION', name: 'Subscription' },
  { value: 'MIXED_ORDER', name: 'Mixed Order' }
];

const showRealStock = true; //增加变量控制要不要显示商品实时库存 是否有f_order_show_realtime_stock权限(checkAuth('f_order_show_realtime_stock'))
const showRealStockBtn = false;

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
                message: <FormattedMessage id="Order.rejectionReasonTip" />
              },
              {
                max: 100,
                message: <FormattedMessage id="Order.100charactersLimitTip" />
              }
            ]
          })(
            <Input.TextArea
              placeholder={(window as any).RCi18n({ id: 'Order.RejectionReasonTip' })}
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
      callback(new Error((window as any).RCi18n({ id: 'Order.100charactersLimitTip' })));
      return;
    }
    callback();
  };
}

const WrappedRejectForm = Form.create()(injectIntl(RejectForm));

/**
 * 订单详情
 */
@Relax
class OrderDetailTab extends React.Component<any, any> {
  onAudit: any;
  _rejectForm;

  props: {
    intl?: any;
    relaxProps?: {
      detail: IMap;
      countryDict: List<any>;
      onAudit: Function;
      confirm: Function;
      retrial: Function;
      remedySellerRemark: Function;
      setSellerRemark: Function;
      verify: Function;
      onDelivery: Function;
      orderRejectModalVisible: boolean;
      showRejectModal: Function;
      hideRejectModal: Function;
      refreshGoodsRealtimeStock: Function;
    };
  };

  static relaxProps = {
    detail: 'detail',
    countryDict: 'countryDict',
    onAudit: noop,
    confirm: noop,
    retrial: noop,
    orderRejectModalVisible: 'orderRejectModalVisible',
    remedySellerRemark: noop,
    setSellerRemark: noop,
    verify: noop,
    onDelivery: noop,
    showRejectModal: noop,
    hideRejectModal: noop,
    refreshGoodsRealtimeStock: noop
  };
  state = {
    visiblePetDetails: false,
    moreData: [],
    visibleMoreFields: false,
    currentPet: {},
    tableLoading: false,
    switchSerficeFee: false,
    switchSerficeFeeCalculation: false
  };

  render() {
    const { currentPet } = this.state;
    const { detail, countryDict, orderRejectModalVisible } = this.props.relaxProps;

    const storeId = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).storeId || '';
    //当前的订单号
    const tid = detail.get('id');
    const tradeItems = detail.get('tradeItems') ? detail.get('tradeItems').toJS() : [];

    //订阅赠品信息
    let giftList = detail.get('subscriptionPlanGiftList')
      ? detail.get('subscriptionPlanGiftList').toJS()
      : [];
    giftList = giftList.map((gift) => {
      let tempGift = {
        skuNo: gift.goodsInfoNo,
        skuName: gift.goodsInfoName,
        num: gift.quantity,
        originalPrice: 0,
        price: 0,
        isGift: true,
        quantityAndRealtimestock: gift?.quantityAndRealtimestock
      };
      return tempGift;
    });

    //满赠赠品信息
    let gifts = detail.get('gifts') ? detail.get('gifts') : fromJS([]);

    gifts = gifts
      .map((gift) => {
        return !gift.get('isHidden')
          ? gift.set('skuName', '[' + RCi18n({ id: 'Order.gift' }) + ']' + gift.get('skuName'))
          : gift.set('skuName', gift.get('skuName'));
      })
      .toJS();

    const tradePrice = detail.get('tradePrice') ? (detail.get('tradePrice').toJS() as any) : {};

    //收货人信息
    const consignee = detail.get('consignee')
      ? (detail.get('consignee').toJS() as Consignee | null)
      : {
        detailAddress: '',
        name: '',
        phone: '',
        countryId: '',
        country: '',
        city: '',
        province: '',
        county: '',
        cityId: '',
        address: '',
        detailAddress1: '',
        detailAddress2: '',
        rfc: '',
        postCode: '',
        firstName: '',
        lastName: '',
        comment: '',
        entrance: '',
        apartment: '',
        area: '',
        timeSlot: '',
        deliveryDate: '',
        workTime: '',
        firstNameKatakana: '',
        lastNameKatakana: ''
      };

    //发票信息
    const invoice = detail.get('invoice')
      ? (detail.get('invoice').toJS() as Invoice | null)
      : {
        open: '',
        type: '',
        title: '',
        projectName: '',
        address: '',
        address1: '',
        address2: '',
        contacts: '',
        phone: '',
        provinceId: '',
        cityId: '',
        province: '',
        county: '',
        countryId: '',
        country: '',
        firstName: '',
        lastName: '',
        postCode: '',
        city: '',
        comment: '',
        entrance: '',
        apartment: '',
        area: ''
      };

    //交易状态
    const tradeState = detail.get('tradeState');
    //是否能下载发票
    const canDownInvoice =
      (tradeState.get('deliverStatus') === 'SHIPPED' ||
        tradeState.get('deliverStatus') === 'DELIVERED') &&
      tradeState.get('invoiceState') === 1;

    //满减、满折金额
    tradePrice.discountsPriceDetails = tradePrice.discountsPriceDetails || fromJS([]);
    tradeItems.forEach((tradeItems) => {
      if (tradeItems.isFlashSaleGoods) {
        tradeItems.levelPrice = tradeItems.price;
      }
    });
    let firstTradeItems = {};
    if (tradeItems && tradeItems.length > 0) {
      if (tradeItems.length === 1) {
        firstTradeItems = tradeItems[0];
      } else {
        let recommendationId = tradeItems.find((item) => (item?.recommendationId))?.recommendationId;
        let recommendationName = tradeItems.find((item) => (item?.recommendationName))?.recommendationName;
        firstTradeItems = {
          ...tradeItems[0],
          recommendationId,
          recommendationName
        }
      }
    }
    // firstTradeItems = tradeItems && tradeItems.length > 0 ? tradeItems[0] : {};
    const installmentPrice = tradePrice.installmentPrice;

    const deliverWay = detail.get('deliverWay');
    const deliveryMethod =
      deliverWay === 1 ? 'Home Delivery' : deliverWay === 2 ? 'Pickup Delivery' : '';
    const addressHour =
      deliverWay === 1 ? consignee.timeSlot : deliverWay === 2 ? consignee.workTime : '';
    const address1 = consignee.detailAddress1 + ' ' + (addressHour || '');
    const columns = [
      {
        title: <FormattedMessage id="Order.SKUcode" />,
        dataIndex: 'skuNo',
        key: 'skuNo',
        render: (text) => text,
        width: '9%'
      },
      {
        title: <FormattedMessage id="Order.externalSKuCode" />,
        dataIndex: 'externalSkuNo',
        key: 'externalSkuNo',
        render: (text) => text,
        width: '9%'
      },
      {
        title: <FormattedMessage id="Order.Productname" />,
        dataIndex: 'skuName',
        key: 'skuName',
        width: '9%',
        render: (text, record) => {
          const productName = text === 'individualization' ? record.petsName + "'s" + text : text;
          return (
            <Tooltip
              overlayStyle={{
                overflowY: 'auto'
              }}
              placement="bottomLeft"
              title={<div>{productName}</div>}
            >
              <p className="overFlowtext" style={{ width: 100 }}>
                {productName}
              </p>
            </Tooltip>
          );
        }
      },
      {
        title:
          storeId === 123457934 ? (
            <FormattedMessage id="Order.Specification" />
          ) : (
            <FormattedMessage id="Order.Weight" />
          ),
        dataIndex: 'specDetails',
        key: 'specDetails',
        width: '8%'
      },
      {
        title: showRealStock ? (
          <FormattedMessage id="Order.realTimeQuantity" values={{ br: <br /> }} />
        ) : (
          <FormattedMessage id="Order.Quantity" />
        ),
        dataIndex: 'num',
        key: 'num',
        width: '7%',
        render: (text, record) => (showRealStock ? record.quantityAndRealtimestock : text)
      },
      {
        title: <FormattedMessage id="Order.Price" />,
        dataIndex: 'originalPrice',
        key: 'originalPrice',
        width: '8%',
        render: (originalPrice, record) =>
          record.subscriptionPrice > 0 &&
            record.subscriptionStatus === 1 &&
            record.isSuperimposeSubscription === 1 ? (
            <>
              {originalPrice === record.subscriptionPrice ? (
                <div>
                  <span>
                    {this._handlePriceFormat(
                      originalPrice,
                      detail.get('subscriptionType') === 'Individualization' ? 4 : 2
                    )}
                  </span>
                </div>
              ) : (
                <div>
                  <span>
                    {this._handlePriceFormat(
                      record.subscriptionPrice,
                      detail.get('subscriptionType') === 'Individualization' ? 4 : 2
                    )}
                  </span>
                  <br />
                  <span style={{ textDecoration: 'line-through' }}>
                    {this._handlePriceFormat(
                      originalPrice,
                      detail.get('subscriptionType') === 'Individualization' ? 4 : 2
                    )}
                  </span>
                </div>
              )}
            </>
          ) : (
            <span>
              {this._handlePriceFormat(
                originalPrice,
                detail.get('subscriptionType') === 'Individualization' ? 4 : 2
              )}
            </span>
          )
      },
      {
        title: <FormattedMessage id="Order.Subtotal" />,
        width: '8%',
        render: (row) => (
          <span>
            {this._handlePriceFormat(storeId === 123457907 ? row.adaptedSubtotalPrice : row.price)}
          </span>
        )
      },
      {
        title: <FormattedMessage id="Order.purchaseType" />,
        dataIndex: 'goodsInfoFlag',
        key: 'goodsInfoFlag',
        width: '7%',
        render: (text) => {
          switch (text) {
            case 0:
              return <FormattedMessage id="Order.SinglePurchase" />;
            case 1:
              return <FormattedMessage id="Order.autoship" />;
            case 2:
              return <FormattedMessage id="Order.club" />;
            case 3:
              return <FormattedMessage id="Order.Individualization" />;
            case 4:
              return <FormattedMessage id="Order.peawee" />;
          }
        }
      },
      {
        title: <FormattedMessage id="Order.Subscriptionumber" />,
        dataIndex: 'subscriptionSourceList',
        key: 'subscriptionSourceList',
        width: '9%',
        render: (text, record) =>
          record.subscriptionSourceList && record.subscriptionSourceList.length > 0
            ? record.subscriptionSourceList.map((x) => x.subscribeId).join(',')
            : null
      },
      {
        title: <FormattedMessage id="Order.petName" />,
        dataIndex: 'petsName',
        key: 'petsName',
        width: '6%',
        render: (text, record) => (
          <a onClick={() => this._openPetDetails(record.petsInfo)}>
            {record.petsInfo ? record.petsInfo.petsName : ''}
          </a>
        )
      },
      {
        title: '',
        width: '8%',
        render: (text, record) => {
          return record.isGift ? null : (
            <a onClick={() => this._openMoreFields(record)}>
              {' '}
              <FormattedMessage id="more" />
            </a>
          );
        }
      }
    ];
    //ru
    if (storeId !== 123457934) {
      columns.splice(
        7,
        0,
        {
          title: <FormattedMessage id="Order.RegulationDiscount" />,
          width: '8%',
          render: (row) => (
            <span>
              {storeId === 123457907 ? this._handlePriceFormat(row.regulationDiscount) : ''}
            </span>
          )
        },
        {
          title: <FormattedMessage id="Order.RealSubtotal" />,
          width: '7%',
          render: (row) => (
            <span>{storeId === 123457907 ? this._handlePriceFormat(row.price) : ''}</span>
          )
        }
      );
    }

    let orderDetailType = orderTypeList.find((x) => x.value === detail.get('orderType'));

    return (
      <div className="orderDetail">
        <div className="display-flex direction-row justify-between mb-20">
          <div>
            <label style={styles.greenText}>
              <FormattedMessage
                id={getOrderStatusValue('OrderStatus', detail.getIn(['tradeState', 'flowState']))}
              />
            </label>
            {canDownInvoice ? (
              <a
                className="ml-20"
                onClick={() => {
                  this._handleDownInvoice(detail);
                }}
              >
                <FormattedMessage id="Download invoice" />
              </a>
            ) : null}
          </div>
          {this._renderBtnAction(tid)}
        </div>
        <Row gutter={30}>
          {/*order panel*/}
          <Col span={12}>
            <div className="headBox">
              <h4>
                <FormattedMessage id="Order.delivery.Order" />
              </h4>
              <Row>
                <Col span={12}>
                  <Tooltip
                    overlayStyle={{
                      overflowY: 'auto'
                    }}
                    placement="bottomLeft"
                    title={
                      <div>
                        {detail.get('id')}
                        {detail.get('goodWillFlag') === 1 ? (
                          <span>
                            [<FormattedMessage id="Order.goodwillOrder" />]
                          </span>
                        ) : (
                          ''
                        )}
                      </div>
                    }
                  >
                    <p className="overFlowtext">
                      {<FormattedMessage id="Order.OrderNumber" />}: {detail.get('id')}
                      {detail.get('goodWillFlag') === 1 && (
                        <span>
                          [<FormattedMessage id="Order.goodwillOrder" />]
                        </span>
                      )}
                    </p>
                  </Tooltip>
                  <p>
                    <FormattedMessage id="Order.ExternalOrderId" />:{' '}
                    {detail.getIn(['tradeOms', 'orderNo'])}
                  </p>
                  <p>
                    <FormattedMessage id="Order.OrderStatus" />:{' '}
                    <FormattedMessage
                      id={getOrderStatusValue(
                        'OrderStatus',
                        detail.getIn(['tradeState', 'flowState'])
                      )}
                    />
                  </p>
                  <p>
                    <FormattedMessage id="Order.orderType" />:{' '}
                    {orderDetailType ? orderDetailType.name : ''}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <FormattedMessage id="Order.OrderTime" />:{' '}
                    {moment(tradeState.get('createTime')).format(Const.TIME_FORMAT)}
                  </p>
                  <p>
                    <FormattedMessage id="Order.orderSource" />: {detail.get('orderSource')}
                  </p>
                  <p>
                    <FormattedMessage id="Order.createBy" />: {detail.get('orderCreateBy')}
                  </p>
                  <p>
                    <FormattedMessage id="Order.paymentMethod" />:{' '}
                    {detail.get('paymentMethodNickName')}
                  </p>
                </Col>
              </Row>
            </div>
          </Col>
          {/*PetOwner panel*/}
          <Col span={12}>
            <div className="headBox">
              <h4>
                <FormattedMessage id="Order.PetOwner" />
              </h4>
              <p>
                <FormattedMessage id="Order.Petownername" />: {detail.getIn(['buyer', 'name'])}
              </p>
              {storeId === 123457919 ? (
                <p>
                  <FormattedMessage id="PetOwner.PetOwnerName katakana" />:{' '}
                  {detail.getIn(['buyer', 'firstNameKatakana'], '')}{' '}
                  {detail.getIn(['buyer', 'lastNameKatakana'], '')}
                </p>
              ) : null}
              <p>
                <FormattedMessage id="Order.petOwnerType" />: {detail.getIn(['buyer', 'levelName'])}
              </p>
              <p>
                <FormattedMessage id="Order.Petowneraccount" />: {detail.getIn(['buyer', 'email'])}
              </p>
            </div>
          </Col>
        </Row>

        {/*Subscription panel*/}
        {detail.get('subscribeId') ||
          detail.get('clinicsId') ||
          firstTradeItems?.recommendationId ? (
          <Row gutter={30} style={{ display: 'flex', alignItems: 'flex-end' }}>
            {detail.get('subscribeId') ? (
              <Col span={12} style={{ alignSelf: 'flex-start' }}>
                <div className="headBox" style={{ height: 120 }}>
                  <h4>
                    <FormattedMessage id="Order.subscription" />
                  </h4>
                  <p>
                    <FormattedMessage id="Order.subscriptionType" />:{' '}
                    {detail.get('subscriptionTypeQuery')
                      ? detail.get('subscriptionTypeQuery').replace('_', ' & ')
                      : ''}
                  </p>
                  <p>
                    <FormattedMessage id="Order.subscriptionPlanType" />:{' '}
                    {detail.get('subscriptionPlanType')}
                  </p>
                </div>
              </Col>
            ) : null}

            {detail.get('clinicsId') || firstTradeItems?.recommendationId ? (
              <Col span={12}>
                <div className="headBox">
                  <h4>
                    <FormattedMessage id="Order.partner" />
                  </h4>
                  <p>
                    <FormattedMessage id="Order.Auditorname" />: {detail.get('clinicsName')}
                  </p>
                  <p>
                    <FormattedMessage id="Order.Auditorid" />: {detail.get('clinicsId')}
                  </p>
                  <p>

                    <FormattedMessage id="Order.Recommenderid" />:{' '}
                    {firstTradeItems?.recommendationId}
                    {/* {firstTradeItems.recommenderId} */}
                  </p>
                  <p>
                    <FormattedMessage id="Order.Recommendername" />:{' '}
                    {firstTradeItems?.recommendationName}
                  </p>
                </div>
              </Col>
            ) : null}

            {((detail.get('subscribeId') &&
              !(detail.get('clinicsId') || firstTradeItems?.recommendationId)) ||
              (!detail.get('subscribeId') &&
                (detail.get('clinicsId') || firstTradeItems?.recommendationId))) &&
              showRealStockBtn ? (
              <Col span={12}>
                <AuthWrapper functionName="fOrderDetail001">
                  <div
                    style={{
                      color: '#E1021A',
                      display: 'flex',
                      justifyContent: 'flex-end',
                      textDecoration: 'underline',
                      cursor: 'pointer'
                    }}
                    onClick={() => this._refreshRealtimeStock(tid)}
                  >
                    <FormattedMessage id="Order.RealTimeStock" />
                  </div>
                </AuthWrapper>
              </Col>
            ) : null}
          </Row>
        ) : null}

        {((detail.get('subscribeId') &&
          (detail.get('clinicsId') || firstTradeItems?.recommendationId)) ||
          (!detail.get('subscribeId') &&
            !(detail.get('clinicsId') || firstTradeItems?.recommendationId))) &&
          showRealStockBtn ? (
          <Row gutter={30} style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Col span={24}>
              <AuthWrapper functionName="fOrderDetail001">
                <div
                  style={{
                    color: '#E1021A',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                  onClick={() => this._refreshRealtimeStock(tid)}
                >
                  Real-time stock
                </div>
              </AuthWrapper>
            </Col>
          </Row>
        ) : null}

        <div className="display-flex mb-20 mt-20 direction-column word-break-break">
          <Table
            rowKey={(_record, index) => index.toString()}
            columns={columns}
            dataSource={tradeItems.concat(gifts, giftList)}
            pagination={false}
            bordered
            rowClassName={() => 'order-detail-row'}
            key={Math.rdmValue()}
          />

          <Modal
            title={<FormattedMessage id="Order.moreFields" />}
            width={600}
            visible={this.state.visibleMoreFields}
            onOk={() => {
              this.setState({
                visibleMoreFields: false
              });
            }}
            onCancel={() => {
              this.setState({
                visibleMoreFields: false
              });
            }}
          >
            <Row>
              <OrderMoreFields data={this.state.moreData} />
            </Row>
          </Modal>

          <Modal
            title={<FormattedMessage id="PetOwner.PetInformation" />}
            width={1100}
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
              <PetItem petsInfo={currentPet} />
            </Row>
          </Modal>

          {/*订单相关价格 panel*/}
          <div style={styles.detailBox as any}>
            <div style={styles.inputBox as any} />
            <div style={styles.priceBox}>
              <label style={styles.priceItem as any}>
                <span style={styles.name}>{<FormattedMessage id="Order.Productamount" />}:</span>
                <strong>{this._handlePriceFormat(tradePrice.goodsPrice)}</strong>
              </label>

              {tradePrice.promotionVOList && tradePrice.promotionVOList.length > 0
                ? tradePrice.promotionVOList.map((promotion) => (
                  <label style={styles.priceItem as any}>
                    <span style={styles.name}>{promotion.marketingName}</span>
                    <strong>-{this._handlePriceFormat(promotion.discountPrice)}</strong>
                  </label>
                ))
                : null}

              {storeId === 123457919 && tradePrice.taxFeePrice > 0 ? (
                <label style={styles.priceItem as any}>
                  <span style={styles.name}>
                    <FormattedMessage id="Order.consumptionTax" />:
                  </span>
                  <strong>{this._handlePriceFormat(tradePrice.taxFeePrice)}</strong>
                </label>
              ) : null}

              {tradePrice.subscriptionDiscountPrice ? (
                <label style={styles.priceItem as any}>
                  <span style={styles.name}>
                    <FormattedMessage id="Order.subscriptionDiscount" />:
                  </span>
                  <strong>-{this._handlePriceFormat(tradePrice.subscriptionDiscountPrice)}</strong>
                </label>
              ) : null}

              <label style={styles.priceItem as any}>
                <span style={styles.name}>{<FormattedMessage id="Order.shippingFees" />}: </span>
                <strong>{this._handlePriceFormat(tradePrice.deliveryPrice)}</strong>
              </label>

              {tradePrice.freeShippingFlag ? (
                <label style={styles.priceItem as any}>
                  <span style={styles.name}>
                    {<FormattedMessage id="Order.shippingFeesDiscount" />}:{' '}
                  </span>
                  <strong>-{this._handlePriceFormat(tradePrice.freeShippingDiscountPrice)}</strong>
                </label>
              ) : null}

              {+sessionStorage.getItem(cache.TAX_SWITCH) === 1 ? (
                <label style={styles.priceItem as any}>
                  <span style={styles.name}>{<FormattedMessage id="Order.Tax" />}: </span>
                  <strong>{this._handlePriceFormat(tradePrice.taxFeePrice)}</strong>
                </label>
              ) : null}

              {storeId === 123457919 &&
                this.state.switchSerficeFee &&
                tradePrice.serviceFeePrice !== '' ? (
                <label style={styles.priceItem as any}>
                  <span style={styles.name}>
                    <FormattedMessage id="Order.serviceFeePrice" />:
                  </span>
                  <strong>{this._handlePriceFormat(tradePrice.serviceFeePrice)}</strong>
                </label>
              ) : null}

              {tradePrice.loyaltyPoints ? (
                <label style={styles.priceItem as any}>
                  <span style={styles.name}>
                    <FormattedMessage id="Order.loyaltyPoints" />:
                  </span>
                  <strong>-{this._handlePriceFormat(tradePrice.loyaltyPoints)}</strong>
                </label>
              ) : null}

              <label style={styles.priceItem as any}>
                <span style={styles.name}>{<FormattedMessage id="Order.Total" />}: </span>
                <strong>
                  {this._handlePriceFormat(tradePrice.totalPrice)}
                  {installmentPrice && installmentPrice.additionalFee
                    ? ' +(' + this._handlePriceFormat(installmentPrice.additionalFee) + ')'
                    : null}
                </strong>
              </label>
            </div>
          </div>
        </div>

        <Row gutter={30}>
          {/*deliveryAddress panel*/}
          <Col span={12}>
            <div className="headBox order_detail_delivery_address" style={{ height: 'auto' }}>
              <h4>
                <FormattedMessage id="Order.deliveryAddress" />
              </h4>
              {storeId === 123457919 ? (
                <Row>
                  <Col span={10}>
                    <FormattedMessage id="Subscription.Name" />:
                  </Col>
                  <Col span={14}>
                    {consignee.lastName && consignee.firstName ? (
                      `${consignee.lastName} ${consignee.firstName}`
                    ) : (
                      <br />
                    )}
                  </Col>
                  <Col span={10}>
                    <FormattedMessage id="Subscription.Name katakana" />:
                  </Col>
                  <Col span={14}>
                    {consignee.lastNameKatakana && consignee.firstNameKatakana ? (
                      `${consignee.lastNameKatakana} ${consignee.firstNameKatakana}`
                    ) : (
                      <br />
                    )}
                  </Col>
                  <Col span={10}>
                    <FormattedMessage id="PetOwner.AddressForm.Postal code" />:
                  </Col>
                  <Col span={14}>{consignee.postCode ? consignee.postCode : <br />}</Col>
                  <Col span={10}>
                    <FormattedMessage id="PetOwner.AddressForm.State" />:
                  </Col>
                  <Col span={14}>{consignee.province ? consignee.province : <br />}</Col>
                  <Col span={10}>
                    <FormattedMessage id="PetOwner.AddressForm.City" />:
                  </Col>
                  <Col span={14}>{consignee.city ? consignee.city : <br />}</Col>
                  <Col span={10}>
                    <FormattedMessage id="PetOwner.AddressForm.Region" />:
                  </Col>
                  <Col span={14}>{consignee.area ? consignee.area : <br />}</Col>
                  <Col span={10}>
                    <FormattedMessage id="PetOwner.AddressForm.Address1" />:
                  </Col>
                  <Col span={14}>
                    {consignee.detailAddress1 ? consignee.detailAddress1 : <br />}
                  </Col>
                  <Col span={10}>
                    <FormattedMessage id="PetOwner.AddressForm.Phone number" />:
                  </Col>
                  <Col span={14}>{consignee.phone ? consignee.phone : <br />}</Col>
                  {/* Selected delivery date */}
                  <Col span={10}>
                    <FormattedMessage id="PetOwner.AddressForm.Selected delivery date" />:
                  </Col>
                  <Col span={14}>
                    {consignee.deliveryDate ? (
                      consignee.deliveryDate === 'Unspecified' ? (
                        RCi18n({ id: 'Unspecified' })
                      ) : (
                        consignee.deliveryDate
                      )
                    ) : (
                      <br />
                    )}
                  </Col>
                  {/* Selected delivery time */}
                  <Col span={10}>
                    <FormattedMessage id="PetOwner.AddressForm.Selected delivery time" />:
                  </Col>
                  <Col span={14}>
                    {consignee.timeSlot ? (
                      consignee.timeSlot === 'Unspecified' ? (
                        RCi18n({ id: 'Unspecified' })
                      ) : (
                        consignee.timeSlot
                      )
                    ) : (
                      <br />
                    )}
                  </Col>
                </Row>
              ) : (
                <Row>
                  <Col span={12}>
                    <Tooltip
                      overlayStyle={{
                        overflowY: 'auto'
                      }}
                      placement="bottomLeft"
                      title={<div>{consignee?.firstName}</div>}
                    >
                      <p className="overFlowtext">
                        <FormattedMessage id="Order.FirstName" />: {consignee?.firstName}
                      </p>
                    </Tooltip>
                    <Tooltip
                      overlayStyle={{
                        overflowY: 'auto'
                      }}
                      placement="bottomLeft"
                      title={<div>{consignee?.lastName}</div>}
                    >
                      <p className="overFlowtext">
                        <FormattedMessage id="Order.LastName" />: {consignee?.lastName}
                      </p>
                    </Tooltip>
                    <Tooltip
                      overlayStyle={{
                        overflowY: 'auto'
                      }}
                      placement="bottomLeft"
                      title={<div>{address1}</div>}
                    >
                      <p className="overFlowtext">
                        <FormattedMessage id="Order.address1" />: {address1}
                      </p>
                    </Tooltip>
                    <Tooltip
                      overlayStyle={{
                        overflowY: 'auto'
                      }}
                      placement="bottomLeft"
                      title={<div>{consignee.detailAddress2}</div>}
                    >
                      <p className="overFlowtext">
                        <FormattedMessage id="Order.address2" />: {consignee.detailAddress2}
                      </p>
                    </Tooltip>
                    <p>
                      <FormattedMessage id="Order.country" />:{' '}
                      {consignee.countryId ? (
                        <>
                          {countryDict
                            ? countryDict.find((c) => c.id == consignee.countryId)
                              ? countryDict.find((c) => c.id == consignee.countryId).name
                              : consignee.countryId
                            : ''}
                        </>
                      ) : (
                        consignee.country
                      )}
                    </p>
                    {consignee?.county ? (
                      <p>
                        <FormattedMessage id="Order.county" />: {consignee.county}
                      </p>
                    ) : null}
                    <p>
                      <FormattedMessage id="Order.Entrance" />: {consignee.entrance}
                    </p>
                    {
                      (storeId === 123457919 || storeId === 123457907) ? (
                        <p>
                          <FormattedMessage id="Order.timeSlot" />: {consignee.timeSlot}
                        </p>
                      ) : null
                    }
                    <Tooltip
                      overlayStyle={{
                        overflowY: 'auto'
                      }}
                      placement="bottomLeft"
                      title={<div>{consignee.comment}</div>}
                    >
                      <p className="overFlowtext">
                        <FormattedMessage id="Order.Comment" />: {consignee.comment}
                      </p>
                    </Tooltip>
                  </Col>

                  <Col span={12}>
                    <Tooltip
                      overlayStyle={{
                        overflowY: 'auto'
                      }}
                      placement="bottomLeft"
                      title={<div>{consignee.city}</div>}
                    >
                      <p className="overFlowtext">
                        <FormattedMessage id="Order.city" />: {consignee.city}
                      </p>
                    </Tooltip>
                    <p>
                      <FormattedMessage id="Order.Postalcode" />: {consignee.postCode}
                    </p>
                    <p>
                      <FormattedMessage id="Order.phoneNumber" />: {consignee.phone}
                    </p>
                    <p>
                      <FormattedMessage id="Order.state" />: {consignee.province}
                    </p>
                    <p>
                      <FormattedMessage id="Order.region" />: {consignee.area}
                    </p>
                    <p>
                      <FormattedMessage id="Order.Apartment" />: {consignee.apartment}
                    </p>
                    {
                      (storeId === 123457907 || storeId == 123457919) ? (
                        <Tooltip
                          overlayStyle={{
                            overflowY: 'auto'
                          }}
                          placement="bottomLeft"
                          title={<div>{getFormatDeliveryDateStr(consignee.deliveryDate)}</div>}
                        >
                          <p className="overFlowtext">
                            <FormattedMessage id="Order.deliveryDate" />:{' '}
                            {getFormatDeliveryDateStr(consignee.deliveryDate)}
                          </p>
                        </Tooltip>
                      ) : null
                    }

                    {storeId === 123457907 && (
                      <Tooltip
                        overlayStyle={{
                          overflowY: 'auto'
                        }}
                        placement="bottomLeft"
                        title={<div>{deliveryMethod}</div>}
                      >
                        <p className="overFlowtext">
                          <FormattedMessage id="Order.chosenDeliveryMethods" />: {deliveryMethod}
                        </p>
                      </Tooltip>
                    )}
                  </Col>
                  {storeId === 123457907 ? (
                    <Col span={24}>
                      <p>
                        <FormattedMessage id="Order.estimatedDeliveryDate" />:
                        {detail.get('minDeliveryTime') && detail.get('maxDeliveryTime') ? (
                          detail.get('minDeliveryTime') !== detail.get('maxDeliveryTime') ? (
                            <FormattedMessage
                              id="Order.estimatedDeliveryDateDesc"
                              values={{
                                minDay: detail.get('minDeliveryTime'),
                                maxDay: detail.get('maxDeliveryTime')
                              }}
                            />
                          ) : (
                            <FormattedMessage
                              id="Order.estimatedDeliveryDateDescEqual"
                              values={{ day: detail.get('minDeliveryTime') }}
                            />
                          )
                        ) : null}
                      </p>
                    </Col>
                  ) : null}
                </Row>
              )}
            </div>
          </Col>
          {/*billingAddress panel*/}
          {storeId !== 123457907 && storeId !== 123457919 ? (
            <Col span={12}>
              <div className="headBox order_detail_billing_address" style={{ height: 220 }}>
                <h4>
                  <FormattedMessage id="Order.billingAddress" />
                </h4>
                <Row>
                  <Col span={12}>
                    <Tooltip
                      overlayStyle={{
                        overflowY: 'auto'
                      }}
                      placement="bottomLeft"
                      title={<div>{invoice.firstName}</div>}
                    >
                      <p className="overFlowtext">
                        <FormattedMessage id="Order.FirstName" />: {invoice.firstName}
                      </p>
                    </Tooltip>
                    <Tooltip
                      overlayStyle={{
                        overflowY: 'auto'
                      }}
                      placement="bottomLeft"
                      title={<div>{invoice.lastName}</div>}
                    >
                      <p className="overFlowtext">
                        <FormattedMessage id="Order.LastName" />: {invoice.lastName}
                      </p>
                    </Tooltip>
                    <Tooltip
                      overlayStyle={{
                        overflowY: 'auto'
                      }}
                      placement="bottomLeft"
                      title={<div>{invoice.address1}</div>}
                    >
                      <p className="overFlowtext">
                        <FormattedMessage id="Order.address1" />: {invoice.address1}
                      </p>
                    </Tooltip>
                    <Tooltip
                      overlayStyle={{
                        overflowY: 'auto'
                      }}
                      placement="bottomLeft"
                      title={<div>{invoice.address2}</div>}
                    >
                      <p className="overFlowtext">
                        <FormattedMessage id="Order.address2" />: {invoice.address2}
                      </p>
                    </Tooltip>
                    <p>
                      <FormattedMessage id="Order.country" />:{' '}
                      {invoice.countryId ? (
                        <>
                          {countryDict.find((c) => c.id == invoice.countryId)
                            ? countryDict.find((c) => c.id == invoice.countryId).name
                            : invoice.countryId}
                        </>
                      ) : (
                        invoice.country
                      )}
                    </p>
                    {invoice?.county ? (
                      <p>
                        <FormattedMessage id="Order.county" />: {invoice.county}
                      </p>
                    ) : null}
                    <p>
                      <FormattedMessage id="Order.Entrance" />: {invoice.entrance}
                    </p>
                  </Col>
                  <Col span={12}>
                    <p>
                      <FormattedMessage id="Order.city" />: {invoice.city}
                    </p>
                    <p>
                      <FormattedMessage id="Order.Postalcode" />: {invoice.postCode}
                    </p>
                    <p>
                      <FormattedMessage id="Order.phoneNumber" />: {invoice.phone}
                    </p>
                    <p>
                      <FormattedMessage id="Order.state" />: {invoice.province}
                    </p>
                    <p>
                      <FormattedMessage id="Order.region" />: {invoice.area}
                    </p>
                    <p>
                      <FormattedMessage id="Order.Apartment" />: {invoice.apartment}
                    </p>
                  </Col>
                  <Col span={24}>
                    <Tooltip
                      overlayStyle={{
                        overflowY: 'auto'
                      }}
                      placement="bottomLeft"
                      title={<div>{invoice.comment}</div>}
                    >
                      <p className="overFlowtext">
                        <FormattedMessage id="Order.Comment" />: {invoice.comment}
                      </p>
                    </Tooltip>
                  </Col>
                </Row>
              </div>
            </Col>
          ) : null}
        </Row>

        <Modal
          maskClosable={false}
          title={<FormattedMessage id="Order.rejectionReasonTip" />}
          visible={orderRejectModalVisible}
          okText={<FormattedMessage id="Order.save" />}
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

  componentDidMount() {
    webapi.fetchServiceFeeConf().then((res) => {
      const config = res?.res?.context || [];
      this.setState({
        switchSerficeFee: !!config.find((c) => c.configType === 'order_service_fee_all')?.status,
        switchSerficeFeeCalculation: !!config.find((c) => c.configType === 'order_service_fee_fgs')
          ?.status
      });
    });
  }

  _handlePriceFormat(price, num = 2) {
    return sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + (price || 0).toFixed(num);
  }

  //刷新商品实时库存
  _refreshRealtimeStock = async (tid: string) => {
    const { refreshGoodsRealtimeStock } = this.props.relaxProps;
    await refreshGoodsRealtimeStock(tid);
    this.setState({ tableLoading: false });
  };

  //下载发票 download invoice
  _handleDownInvoice(detail) {
    let orderInvoiceIdList = detail.getIn(['invoice', 'orderInvoiceIdList']).toJS();
    let params = {
      orderInvoiceIds: orderInvoiceIdList
    };
    const token = (window as any).token;
    let result = JSON.stringify({ ...params, token: token });
    let base64 = new util.Base64();
    const exportHref =
      Const.SITE_NAME === 'MYVETRECO'
        ? `${Const.HOST}/account/orderInvoice/myVetreco/exportPDF/${base64.urlEncode(result)}`
        : `${Const.HOST}/account/orderInvoice/exportPDF/${base64.urlEncode(result)}`;
    window.open(exportHref);
  }

  _renderBtnAction(tid: string) {
    const { detail, onDelivery } = this.props.relaxProps;
    const flowState = detail.getIn(['tradeState', 'flowState']);
    const payState = detail.getIn(['tradeState', 'payState']);
    const deliverStatus = detail.getIn(['tradeState', 'deliverStatus']);
    const paymentOrder = detail.get('paymentOrder');

    //修改状态的修改
    //创建订单状态
    if (Const.SITE_NAME !== 'MYVETRECO' && (flowState === 'INIT' || flowState === 'AUDIT')) {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {flowState === 'AUDIT' && (
            <div>
              {!(paymentOrder == 'PAY_FIRST' && payState != 'PAID') && (
                <AuthWrapper functionName="fOrderDetail002">
                  <Tooltip placement="top" title={<FormattedMessage id="Order.ship" />}>
                    <a
                      href="javascript:void(0);"
                      style={styles.pr20}
                      onClick={() => {
                        onDelivery();
                      }}
                      className="iconfont iconbtn-shipping"
                    />
                  </Tooltip>
                </AuthWrapper>
              )}
            </div>
          )}
        </div>
      );
    } else if (
      Const.SITE_NAME !== 'MYVETRECO' &&
      (flowState === 'TO_BE_DELIVERED' || flowState === 'PARTIALLY_SHIPPED') &&
      (deliverStatus == 'NOT_YET_SHIPPED' || deliverStatus === 'PART_SHIPPED') &&
      payState === 'PAID'
    ) {
      return (
        <div>
          <AuthWrapper functionName="fOrderDetail002">
            <Tooltip placement="top" title={<FormattedMessage id="Order.ship" />}>
              <a
                href="javascript:void(0);"
                style={styles.pr20}
                onClick={() => {
                  onDelivery();
                }}
                className="iconfont iconbtn-shipping"
              />
            </Tooltip>
          </AuthWrapper>
        </div>
      );
    } else if (flowState === 'DELIVERED') {
      return (
        <div>
          <AuthWrapper functionName="fOrderList003">
            <Tooltip placement="top" title={<FormattedMessage id="Order.confirmReceipt" />}>
              <a
                onClick={() => {
                  this._showConfirm(tid);
                }}
                href="javascript:void(0)"
                style={styles.pr20}
              >
                <FormattedMessage id="Order.confirmReceipt" />
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
    const title = (window as any).RCi18n({ id: 'Order.Re-review' });
    const content = (window as any).RCi18n({ id: 'Order.Confirmtoreturntheselected' });
    confirm({
      title: title,
      content: content,
      onOk() {
        retrial(tdId);
      },
      onCancel() { }
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
    const title = (window as any).RCi18n({ id: 'Order.ConfirmReceipt' });
    const content = (window as any).RCi18n({ id: 'Order.ConfirmThatAllProducts' });
    confirmModal({
      title: title,
      content: content,
      onOk() {
        confirm(tdId);
      },
      onCancel() { }
    });
  };
  _openPetDetails = (petsInfo) => {
    this.setState({
      visiblePetDetails: true,
      currentPet: petsInfo ? petsInfo : {}
    });
  };

  _openMoreFields = (recored) => {
    const data = [{ ...recored }];
    this.setState({
      visibleMoreFields: true,
      moreData: data
    });
  };
}

export default injectIntl(OrderDetailTab);

const styles = {
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
