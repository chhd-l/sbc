import React from 'react';
import { IMap, Relax } from 'plume2';
import { Col, Form, Input, Modal, Row, Table, Tooltip } from 'antd';
import {
  AuthWrapper,
  Const,
  noop,
  cache,
  getFelineOrderStatusValue,
  getFormatDeliveryDateStr,
  RCi18n
} from 'qmkit';
import { fromJS, List } from 'immutable';
import FormItem from 'antd/lib/form/FormItem';
import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
import PetItem from '@/customer-details/component/pet-item';
import OrderMoreFields from './order_more_field';
import './style.less';
import { Consignee, Invoice } from '@/order-detail/components/type';

const orderTypeList = [
  { value: 'SINGLE_PURCHASE', name: 'Single purchase' },
  { value: 'SINGLE', name: 'Single purchase' },
  { value: 'SUBSCRIPTION', name: 'Subscription' },
  { value: 'MIXED_ORDER', name: 'Mixed Order' }
];

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
    tableLoading: false
  };

  render() {
    const { currentPet } = this.state;
    const { detail, countryDict, orderRejectModalVisible } = this.props.relaxProps;
    const appointInfo = detail.get('settingVO') ? detail.get('settingVO').toJS() : null;
    const storeId = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).storeId || '';
    //当前的订单号
    const tid = detail.get('id');
    const tradeItems = detail.get('tradeItems') ? detail.get('tradeItems').toJS() : [];
    const tradePrice = detail.get('tradePrice') ? (detail.get('tradePrice').toJS() as any) : {};
    //收货人信息
    const consignee = detail.get('consignee')
      ? (detail.get('consignee').toJS() as Consignee | null)
      : null;
    //发票信息
    const invoice = detail.get('invoice') ? (detail.get('invoice').toJS() as Invoice | null) : null;
    //交易状态
    const tradeState = detail.get('tradeState');
    //满减、满折金额
    tradePrice.discountsPriceDetails = tradePrice.discountsPriceDetails || fromJS([]);
    tradeItems.forEach((tradeItems) => {
      if (tradeItems.isFlashSaleGoods) {
        tradeItems.levelPrice = tradeItems.price;
      }
    });
    const installmentPrice = tradePrice.installmentPrice;
    const deliverWay = detail.get('deliverWay');
    const deliveryMethod =
      deliverWay === 1 ? 'Home Delivery' : deliverWay === 2 ? 'Pickup Delivery' : '';
    const addressHour =
      deliverWay === 1 ? consignee.timeSlot : deliverWay === 2 ? consignee.workTime : '';
    const address1 = consignee?.detailAddress1 + ' ' + (addressHour || '');
    let orderDetailType = orderTypeList.find((x) => x.value === detail.get('orderCategory'));

    const columns = [
      {
        title: <FormattedMessage id="Order.LineItemNo" />,
        dataIndex: 'lineItemNo',
        key: 'lineItemNo',
        render: (text) => text,
        width: '7%'
      },
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
          return (
            <Tooltip
              overlayStyle={{
                overflowY: 'auto'
              }}
              placement="bottomLeft"
              title={<div>{text}</div>}
            >
              <p className="overFlowtext" style={{ width: 100 }}>
                {text}
              </p>
            </Tooltip>
          );
        }
      },
      {
        title: <FormattedMessage id="Order.Specification" />,
        dataIndex: 'specDetails',
        key: 'specDetails',
        width: '9%'
      },
      {
        title: <FormattedMessage id="Order.Quantity" />,
        dataIndex: 'num',
        key: 'num',
        width: '6%',
        render: (text, record) => text
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
            <div>
              <span>{this._handlePriceFormat(record.subscriptionPrice)}</span>
              <br />
              <span style={{ textDecoration: 'line-through' }}>
                {this._handlePriceFormat(originalPrice)}
              </span>
            </div>
          ) : (
            <span>{this._handlePriceFormat(originalPrice)}</span>
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

    return (
      <div className="orderDetail">
        <div className="display-flex direction-row justify-between mb-20">
          <label className="green-text">
            <FormattedMessage
              id={getFelineOrderStatusValue(
                'OrderStatus',
                detail.getIn(['tradeState', 'flowState'])
              )}
            />
          </label>
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
                    title={<div>{tid}</div>}
                  >
                    <p className="overFlowtext">
                      {<FormattedMessage id="Order.OrderNumber" />}: {tid}
                    </p>
                  </Tooltip>
                  <p>
                    <FormattedMessage id="Order.OrderStatus" />:{' '}
                    <FormattedMessage
                      id={getFelineOrderStatusValue(
                        'OrderStatus',
                        detail.getIn(['tradeState', 'flowState'])
                      )}
                    />
                  </p>
                  <p>
                    <FormattedMessage id="Order.orderType" />:{' '}
                    {orderDetailType ? orderDetailType.name : ''}
                  </p>
                  <p>
                    <FormattedMessage id="Order.paymentMethod" />:{' '}
                    {detail.get('paymentMethodNickName')}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <FormattedMessage id="Order.OrderTime" />:{' '}
                    {moment(tradeState.get('createTime')).format(Const.TIME_FORMAT)}
                  </p>
                  <p>
                    <FormattedMessage id="Order.orderSource" />:{' '}
                    <FormattedMessage id="Order.orderSource felin" />
                  </p>
                  <p>
                    <FormattedMessage id="Order.createBy" />: {detail.get('orderCreateBy')}
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
              <p>
                <FormattedMessage id="Order.petOwnerType" />: {detail.getIn(['buyer', 'levelName'])}
              </p>
              <p>
                <FormattedMessage id="Order.Petowneraccount" />:{' '}
                {detail.getIn(['buyer', 'account'])}
              </p>
            </div>
          </Col>
        </Row>

        <Row gutter={30}>
          {/*Appointment panel*/}
          {appointInfo ? (
            <Col span={12}>
              <Row>
                <div className="headBox">
                  <h4>
                    <FormattedMessage id="Order.appointment" />
                  </h4>
                  <Col span={12}>
                    <Tooltip
                      overlayStyle={{
                        overflowY: 'auto'
                      }}
                      placement="bottomLeft"
                      title={<div>{appointInfo?.apptNo}</div>}
                    >
                      <p className="overFlowtext">
                        <FormattedMessage id="Order.appointmentNumber" />:{appointInfo?.apptNo}
                      </p>
                    </Tooltip>
                    <p>
                      <FormattedMessage id="Order.appointmentStatus" />:{' '}
                      {appointInfo?.status === 0
                        ? 'Booked'
                        : appointInfo?.status === 1
                        ? 'Arrived'
                        : 'Cancel'}
                    </p>
                    <Tooltip
                      overlayStyle={{
                        overflowY: 'auto'
                      }}
                      placement="bottomLeft"
                      title={
                        <div>
                          {this._handleFelinAppointTime(detail.get('appointmentDate')).showTime}
                        </div>
                      }
                    >
                      <p className="overFlowtext">
                        <FormattedMessage id="Order.appointmentTime" />:{' '}
                        <div>
                          {this._handleFelinAppointTime(detail.get('appointmentDate')).showTime}
                        </div>
                      </p>
                    </Tooltip>
                    <p>
                      <FormattedMessage id="Order.expertType" />: {detail.get('specialistType')}
                    </p>
                  </Col>

                  <Col span={12}>
                    <p>
                      <FormattedMessage id="Order.bookingTime" />: {appointInfo?.createTime}
                    </p>
                    <p>
                      <FormattedMessage id="Order.appointmentType" />:{' '}
                      {detail.get('appointmentType')}
                    </p>
                    <p>
                      <FormattedMessage id="Order.appointmentLocation" />:
                    </p>
                    <p>
                      <FormattedMessage id="Order.expertName" />: {appointInfo.expertNames}
                    </p>
                  </Col>
                </div>
              </Row>
            </Col>
          ) : null}
        </Row>

        <div className="display-flex mb-20 mt-20 direction-column word-break-break">
          <Table
            rowKey={(_record, index) => index.toString()}
            columns={columns}
            dataSource={tradeItems}
            pagination={false}
            bordered
            rowClassName={() => 'order-detail-row'}
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
          <div className="detailBox">
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
          {consignee ? (
            <Col span={12}>
              <div className="headBox order_detail_delivery_address" style={{ height: 250 }}>
                <h4>
                  <FormattedMessage id="Order.deliveryAddress" />
                </h4>
                <Row>
                  <Col span={12}>
                    <Tooltip
                      overlayStyle={{
                        overflowY: 'auto'
                      }}
                      placement="bottomLeft"
                      title={<div>{consignee.firstName}</div>}
                    >
                      <p className="overFlowtext">
                        <FormattedMessage id="Order.FirstName" />: {consignee.firstName}
                      </p>
                    </Tooltip>
                    <Tooltip
                      overlayStyle={{
                        overflowY: 'auto'
                      }}
                      placement="bottomLeft"
                      title={<div>{consignee.lastName}</div>}
                    >
                      <p className="overFlowtext">
                        <FormattedMessage id="Order.LastName" />: {consignee.lastName}
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
                    <p>
                      <FormattedMessage id="Order.timeSlot" />: {consignee.timeSlot}
                    </p>
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
              </div>
            </Col>
          ) : null}

          {/*billingAddress panel*/}
          {storeId !== 123457907 && invoice ? (
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

  _handlePriceFormat(price, num = 2) {
    return sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + (price || 0).toFixed(num);
  }

  _renderBtnAction(tid: string) {
    const { detail, onDelivery } = this.props.relaxProps;
    const flowState = detail.getIn(['tradeState', 'flowState']);
    const payState = detail.getIn(['tradeState', 'payState']);
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
                      onClick={() => {
                        onDelivery();
                      }}
                      className="iconfont iconbtn-shipping pr-20"
                    />
                  </Tooltip>
                </AuthWrapper>
              )}
            </div>
          )}
        </div>
      );
    }
    if (flowState === 'DELIVERED') {
      return (
        <div>
          <AuthWrapper functionName="fOrderList003">
            <Tooltip placement="top" title={<FormattedMessage id="Order.confirmReceipt" />}>
              <a
                onClick={() => {
                  this._showConfirm(tid);
                }}
                href="javascript:void(0)"
                className="pr-20"
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
      onCancel() {}
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

  //处理预约信息里面的预约时间
  _handleFelinAppointTime(appointTime) {
    if (!appointTime) {
      return {showTime: ''};
    }
    const apptTime = appointTime.split('#');
    const appointStartTime =
      apptTime.length > 0
        ? moment(apptTime[0].split(' ')[0]).format('YYYY-MM-DD') + ' ' + apptTime[0].split(' ')[1]
        : '';
    const appointEndTime =
      apptTime.length > 1
        ? moment(apptTime[1].split(' ')[0]).format('YYYY-MM-DD') + ' ' + apptTime[1].split(' ')[1]
        : '';
    const endTime = appointEndTime
      ? moment(new Date(new Date(appointEndTime).valueOf() - 15 * 60 * 1000)).format(
          'YYYY-MM-DD HH:mm'
        )
      : appointEndTime;
    const showTime =
      appointStartTime && endTime.split(' ').length > 1
        ? appointStartTime + '-' + endTime.split(' ')[1]
        : '';
    return {
      appointStartTime,
      appointEndTime,
      showTime
    };
  }
}

export default injectIntl(OrderDetailTab);

const styles = {
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
  }
} as any;
