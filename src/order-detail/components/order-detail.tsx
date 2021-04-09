import React from 'react';
import { IMap, Relax } from 'plume2';
import { Button, Col, Form, Icon, Input, Modal, Popover, Row, Table, Tag, Tooltip } from 'antd';
import { AuthWrapper, Const, noop, cache, util, getOrderStatusValue } from 'qmkit';
import { fromJS, Map, List } from 'immutable';
import FormItem from 'antd/lib/form/FormItem';

import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';

import './style.less';

const orderTypeList = [
  { value: 'SINGLE_PURCHASE', name: 'Single purchase' },
  { value: 'SUBSCRIPTION', name: 'Subscription' }
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
              // { validator: this.checkComment }
            ]
          })(<Input.TextArea placeholder={this.props.intl.formatMessage({ id: 'Order.RejectionReasonTip' })} autosize={{ minRows: 4, maxRows: 4 }} />)}
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
      callback(new Error(this.props.intl.formatMessage({ id: 'Order.100charactersLimitTip' })));
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
    const { currentPetInfo, havePet } = this.state;
    const { detail, countryDict, orderRejectModalVisible } = this.props.relaxProps;
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
    const tradeItems = detail.get('tradeItems') ? detail.get('tradeItems').toJS() : [];
    //赠品信息
    let gifts = detail.get('gifts') ? detail.get('gifts') : fromJS([]);
    gifts = gifts.map((gift) => gift.set('skuName', '【赠品】' + gift.get('skuName')).set('levelPrice', 0)).toJS();
    const tradePrice = detail.get('tradePrice').toJS() as any;

    //收货人信息
    const consignee = detail.get('consignee').toJS() as {
      detailAddress: string;
      name: string;
      phone: string;
      countryId: string;
      city: string;
      province: string;
      cityId: number;
      address: string;
      detailAddress1: string;
      detailAddress2: string;
      rfc: string;
      postCode: string;
      firstName: string;
      lastName: string;
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
          address1: string;
          address2: string;
          contacts: string; //联系人
          phone: string; //联系方式
          provinceId: number;
          cityId: number;
          province: string;
          countryId: number;
          // city:string;
          // province:string;
          firstName: string;
          lastName: string;
          postCode: string;
          city: string;
        })
      : null;

    //附件信息
    const encloses = detail.get('encloses') ? detail.get('encloses').split(',') : [];
    //交易状态
    const tradeState = detail.get('tradeState');

    //满减、满折金额
    tradePrice.discountsPriceDetails = tradePrice.discountsPriceDetails || fromJS([]);
    const discount = tradePrice.discountsPriceDetails.find((item) => item.marketingType == 1);
    tradeItems.forEach((tradeItems) => {
      if (tradeItems.isFlashSaleGoods) {
        tradeItems.levelPrice = tradeItems.price;
      }
    });
    let firstTradeItems = tradeItems && tradeItems.length > 0 ? tradeItems[0] : {};
    const columns = [
      {
        title: <FormattedMessage id="Order.SKUcode" />,
        dataIndex: 'skuNo',
        key: 'skuNo',
        render: (text) => text
      },
      {
        title: <FormattedMessage id="Order.Productname" />,
        dataIndex: 'skuName',
        key: 'skuName',
        width: '50%'
      },
      {
        title: <FormattedMessage id="Order.Weight" />,
        dataIndex: 'specDetails',
        key: 'specDetails'
      },
      {
        title: <FormattedMessage id="Order.petCategory" />,
        dataIndex: 'petCategory',
        key: 'petCategory',
        width: '10%',
        render: (text, record) => <>{record.petsInfo && record.petsInfo.petsType ? <p>{record.petsInfo.petsType}</p> : null}</>
      },
      {
        title: <FormattedMessage id="Order.petName" />,
        dataIndex: 'petName',
        key: 'petName',
        width: '10%',
        render: (text, record) => <>{record.petsInfo && record.petsInfo.petsName ? <p>{record.petsInfo.petsName}</p> : null}</>
      },
      {
        title: <FormattedMessage id="Order.petDetails" />,
        dataIndex: 'petDetails',
        key: 'petDetails',
        width: '10%',
        render: (text, record) => (
          <>
            {record.petsInfo ? (
              <Button type="link" onClick={() => this._openPetDetails(record.petsInfo)}>
                <FormattedMessage id="Order.view" />
              </Button>
            ) : null}
          </>
        )
      },
      {
        title: <FormattedMessage id="Order.Quantity" />,
        dataIndex: 'num',
        key: 'num'
      },
      {
        title: <FormattedMessage id="Order.Price" />,
        dataIndex: 'originalPrice',
        key: 'originalPrice',
        render: (originalPrice, record) =>
          record.subscriptionPrice > 0 && record.subscriptionStatus === 1 ? (
            <div>
              <span>
                {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                {record.subscriptionPrice.toFixed(2)}
              </span>
              <span style={{ textDecoration: 'line-through', marginLeft: '8px' }}>
                {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                {originalPrice && originalPrice.toFixed(2)}
              </span>
            </div>
          ) : (
            <span>
              {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
              {originalPrice && originalPrice.toFixed(2)}
            </span>
          )
      },
      {
        title: <FormattedMessage id="Order.Subtotal" />,
        render: (row) => (
          <span>
            {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
            {(row.num * (row.subscriptionPrice > 0 ? row.subscriptionPrice : row.levelPrice)).toFixed(2)}
          </span>
        )
      }
    ];

    const columnsNoPet = [
      {
        title: <FormattedMessage id="Order.SKUcode" />,
        dataIndex: 'skuNo',
        key: 'skuNo',
        render: (text) => text
      },
      {
        title: <FormattedMessage id="Order.Productname" />,
        dataIndex: 'skuName',
        key: 'skuName',
        width: '20%'
      },
      {
        title: <FormattedMessage id="Order.Weight" />,
        dataIndex: 'specDetails',
        key: 'specDetails'
      },
      // {
      //   title: 'Price',
      //   dataIndex: 'levelPrice',
      //   key: 'levelPrice',
      //   render: (levelPrice) => (
      //     <span>
      //       {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
      //       {levelPrice && levelPrice.toFixed(2)}
      //     </span>
      //   )
      // },
      {
        title: <FormattedMessage id="Order.Quantity" />,
        dataIndex: 'num',
        key: 'num'
      },
      {
        title: <FormattedMessage id="Order.Price" />,
        dataIndex: 'originalPrice',
        key: 'originalPrice',
        render: (originalPrice, record) =>
          record.subscriptionPrice > 0 && record.subscriptionStatus === 1 ? (
            <div>
              <span>
                {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                {record.subscriptionPrice.toFixed(2)}
              </span>
              <span style={{ textDecoration: 'line-through', marginLeft: '8px' }}>
                {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                {originalPrice && originalPrice.toFixed(2)}
              </span>
            </div>
          ) : (
            <span>
              {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
              {originalPrice && originalPrice.toFixed(2)}
            </span>
          )
      },
      {
        title: <FormattedMessage id="Order.Subtotal" />,
        render: (row) => (
          <span>
            {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
            {row.price.toFixed(2)}
            {/*{(row.num * (row.subscriptionPrice > 0 ? row.subscriptionPrice : row.levelPrice)).toFixed(2)}*/}
          </span>
        )
      }
    ];

    let orderDetailType = orderTypeList.find((x) => x.value === detail.get('orderType'));
    return (
      <div className="orderDetail">
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginBottom: 20,
            justifyContent: 'space-between'
          }}
        >
          <label style={styles.greenText}>
            <FormattedMessage id={getOrderStatusValue('OrderStatus', detail.getIn(['tradeState', 'flowState']))} />
          </label>

          {this._renderBtnAction(tid)}
        </div>
        <Row gutter={30}>
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
                    title={<div>{detail.get('id')}</div>}
                  >
                    <p className="overFlowtext">
                      {<FormattedMessage id="Order.OrderNumber" />}: {detail.get('id')}
                    </p>
                  </Tooltip>
                  <p>
                    <FormattedMessage id="Order.ExternalOrderId" />: {detail.getIn(['tradeOms', 'orderNo'])}
                  </p>
                  <p>
                    <FormattedMessage id="Order.OrderStatus" />: <FormattedMessage id={getOrderStatusValue('OrderStatus', detail.getIn(['tradeState', 'flowState']))} />
                  </p>
                  <p>
                    <FormattedMessage id="Order.orderType" />: {orderDetailType ? orderDetailType.name : ''}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <FormattedMessage id="Order.OrderTime" />: {moment(tradeState.get('createTime')).format(Const.TIME_FORMAT)}
                  </p>
                  <p>
                    <FormattedMessage id="Order.orderSource" />: {detail.get('orderSource')}
                  </p>
                  <p>
                    <FormattedMessage id="Order.createBy" />: {detail.get('orderCreateBy')}
                  </p>
                </Col>
              </Row>
            </div>
          </Col>
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
                <FormattedMessage id="Order.Petowneraccount" />: {detail.getIn(['buyer', 'account'])}
              </p>
            </div>
          </Col>
        </Row>
        <Row gutter={30}>
          {detail.get('subscribeId') ? (
            <Col span={12}>
              <div className="headBox">
                <h4>
                  <FormattedMessage id="Order.subscription" />
                </h4>
                <p>
                  <FormattedMessage id="Order.Subscriptionumber" />: {detail.get('subscribeId')}
                </p>
                <p>
                  <FormattedMessage id="Order.subscriptionType" />: {detail.get('subscriptionTypeQuery')}
                </p>
                <p>
                  <FormattedMessage id="Order.subscriptionPlanType" />: {detail.get('subscriptionPlanType')}
                </p>
              </div>
            </Col>
          ) : null}

          {detail.get('clinicsId') || firstTradeItems.recommendationId ? (
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
                  <FormattedMessage id="Order.Recommenderid" />: {firstTradeItems.recommendationId}
                </p>
                <p>
                  <FormattedMessage id="Order.Recommendername" />: {firstTradeItems.recommendationName}
                </p>
              </div>
            </Col>
          ) : null}
        </Row>

        <div
          style={{
            display: 'flex',
            marginTop: 20,
            marginBottom: 20,
            flexDirection: 'column',
            wordBreak: 'break-word'
          }}
        >
          <Table rowKey={(_record, index) => index.toString()} columns={havePet ? columns : columnsNoPet} dataSource={tradeItems.concat(gifts)} pagination={false} bordered />

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
                <h3>
                  <FormattedMessage id="Order.specialNeeds" />
                </h3>
                {currentPetInfo.customerPetsPropRelations && currentPetInfo.customerPetsPropRelations.map((item) => <Tag style={{ marginBottom: 3 }}>{item.propName}</Tag>)}
              </Col>
            </Row>
          </Modal>

          <div style={styles.detailBox as any}>
            <div style={styles.inputBox as any} />

            <div style={styles.priceBox}>
              <label style={styles.priceItem as any}>
                <span style={styles.name}>{<FormattedMessage id="Order.Productamount" />}:</span>
                <strong>
                  {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                  {(tradePrice.goodsPrice || 0).toFixed(2)}
                </strong>
              </label>

              {/* {discount && (
                <label style={styles.priceItem as any}>
                  <span style={styles.name}>{<FormattedMessage id="promotionAmount" />}:</span>
                  <strong>
                    -{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                    {discount.discounts.toFixed(2)}
                  </strong>
                </label>
              )} */}

              {/* {tradePrice.firstOrderOnThePlatformDiscountPrice ? (
                <label style={styles.priceItem as any}>
                  <span style={styles.name}>First Order Discount:</span>
                  <strong>
                    -{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                    {tradePrice.firstOrderOnThePlatformDiscountPrice.toFixed(2)}
                  </strong>
                </label>
              ) : null} */}

              {tradePrice.promotionVOList && tradePrice.promotionVOList.length > 0
                ? tradePrice.promotionVOList.map((promotion) => (
                    <label style={styles.priceItem as any}>
                      <span style={styles.name}>{promotion.marketingName}</span>
                      <strong>
                        -{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                        {(promotion.discountPrice || 0).toFixed(2)}
                      </strong>
                    </label>
                  ))
                : null}

              {tradePrice.subscriptionDiscountPrice ? (
                <label style={styles.priceItem as any}>
                  <span style={styles.name}>
                    <FormattedMessage id="Order.autoshipDiscount" />:
                  </span>
                  <strong>
                    -{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                    {(tradePrice.subscriptionDiscountPrice || 0).toFixed(2)}
                  </strong>
                </label>
              ) : null}

              <label style={styles.priceItem as any}>
                <span style={styles.name}>{<FormattedMessage id="Order.shippingFees" />}: </span>
                <strong>
                  {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                  {(tradePrice.deliveryPrice || 0).toFixed(2)}
                </strong>
              </label>
              {+sessionStorage.getItem(cache.TAX_SWITCH) === 1 ? (
                <label style={styles.priceItem as any}>
                  <span style={styles.name}>{<FormattedMessage id="Order.Tax" />}: </span>
                  <strong>
                    {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                    {(tradePrice.taxFeePrice || 0).toFixed(2)}
                  </strong>
                </label>
              ) : null}

              <label style={styles.priceItem as any}>
                <span style={styles.name}>{<FormattedMessage id="Order.Total" />}: </span>
                <strong>
                  {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                  {(tradePrice.totalPrice || 0).toFixed(2)}
                </strong>
              </label>
            </div>
          </div>
        </div>

        <Row gutter={30}>
          <Col span={12}>
            <div className="headBox">
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
                      <FormattedMessage id="Order.FirstName" />: {consignee.lastName}
                    </p>
                  </Tooltip>
                  <Tooltip
                    overlayStyle={{
                      overflowY: 'auto'
                    }}
                    placement="bottomLeft"
                    title={<div>{consignee.detailAddress1}</div>}
                  >
                    <p className="overFlowtext">
                      <FormattedMessage id="Order.address1" />: {consignee.detailAddress1}
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
                    <FormattedMessage id="Order.country" />: {countryDict.find((c) => c.id == consignee.countryId) ? countryDict.find((c) => c.id == consignee.countryId).name : consignee.countryId}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <FormattedMessage id="Order.city" />: {consignee.city}
                  </p>
                  <p>
                    <FormattedMessage id="Order.Postalcode" />: {consignee.postCode}
                  </p>
                  <p>
                    <FormattedMessage id="Order.phoneNumber" />: {consignee.phone}
                  </p>
                  <p>
                    <FormattedMessage id="Order.state" />: {consignee.province}
                  </p>
                </Col>
                {detail.get('minDeliveryTime') && detail.get('maxDeliveryTime') ? (
                  <Col span={24}>
                    {detail.get('minDeliveryTime') !== detail.get('maxDeliveryTime') ? (
                      <p>
                        <FormattedMessage id="Order.estimatedDeliveryDate" />: <FormattedMessage id="Order.estimatedDeliveryDateDesc" values={{ minDay: detail.get('minDeliveryTime'), maxDay: detail.get('maxDeliveryTime') }} />
                      </p>
                    ) : (
                      <p>
                        <FormattedMessage id="Order.estimatedDeliveryDate" />: <FormattedMessage id="Order.estimatedDeliveryDateDescEqual" values={{ day: detail.get('minDeliveryTime') }} />
                      </p>
                    )}
                  </Col>
                ) : null}
              </Row>
            </div>
          </Col>
          <Col span={12}>
            <div className="headBox">
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
                      <FormattedMessage id="Order.FirstName" />: {invoice.lastName}
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
                  <p><FormattedMessage id="Order.country" />: {countryDict.find((c) => c.id == invoice.countryId) ? countryDict.find((c) => c.id == invoice.countryId).name : invoice.countryId}</p>
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
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        {firstTradeItems.petsName ? (
          <Row gutter={30}>
            <Col span={12}>
              <div className="headBox">
                <h4>
                  <FormattedMessage id="Order.pet" />
                </h4>
                <Row>
                  <Col span={12}>
                    <p>
                      <FormattedMessage id="Order.petName" />: {firstTradeItems.petsName}{' '}
                    </p>
                    <p>
                      <FormattedMessage id="Order.gender" />:{' '}
                    </p>
                    <p>
                      <FormattedMessage id="Order.birthday" />:{' '}
                    </p>
                    <p>
                      <FormattedMessage id="Order.breed" />{' '}
                    </p>
                    <p>
                      <FormattedMessage id="Order.sensitivities" />{' '}
                    </p>
                  </Col>
                  <Col span={12}>
                    <p>
                      <FormattedMessage id="Order.lifestyle" />:{' '}
                    </p>
                    <p>
                      <FormattedMessage id="Order.activity" />:{' '}
                    </p>
                    <p>
                      <FormattedMessage id="Order.Weight" />:{' '}
                    </p>
                    <p>
                      <FormattedMessage id="Order.sterilized" />:{' '}
                    </p>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        ) : null}

        <Modal maskClosable={false} title={<FormattedMessage id="Order.rejectionReasonTip" />} visible={orderRejectModalVisible} okText={<FormattedMessage id="Order.save" />} onOk={() => this._handleOK(tid)} onCancel={() => this._handleCancel()}>
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
    const { detail, verify, onDelivery } = this.props.relaxProps;
    const flowState = detail.getIn(['tradeState', 'flowState']);
    const payState = detail.getIn(['tradeState', 'payState']);
    const deliverStatus = detail.getIn(['tradeState', 'deliverStatus']);
    const paymentOrder = detail.get('paymentOrder');

    //修改状态的修改
    //创建订单状态
    if (flowState === 'INIT' || flowState === 'AUDIT') {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {payState === 'NOT_PAID' &&
            // <AuthWrapper functionName="edit_order_f_001">
            //   <Tooltip placement="top" title="Modify">
            //     <a
            //       style={styles.pr20}
            //       onClick={() => {
            //         verify(tid);
            //       }}
            //     >
            //       Modify
            //     </a>
            //   </Tooltip>
            // </AuthWrapper>
            null}
          {flowState === 'AUDIT' && (
            <div>
              {payState === 'PAID' || payState === 'UNCONFIRMED'
                ? null
                : // <AuthWrapper functionName="fOrderList002">
                  //   <Tooltip placement="top" title="Re-review">
                  //     <a
                  //       onClick={() => {
                  //         this._showRetrialConfirm(tid);
                  //       }}
                  //       href="javascript:void(0)"
                  //       style={styles.pr20}
                  //     >
                  //       Re-review
                  //     </a>
                  //   </Tooltip>
                  // </AuthWrapper>
                  null}
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
                    >
                      {/*{<FormattedMessage id="Order.ship" />}*/}
                    </a>
                  </Tooltip>
                </AuthWrapper>
              )}
            </div>
          )}
        </div>
      );
    } else if ((flowState === 'TO_BE_DELIVERED' || flowState === 'PARTIALLY_SHIPPED') && (deliverStatus == 'NOT_YET_SHIPPED' || deliverStatus === 'PART_SHIPPED') && payState === 'PAID') {
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
              >
                {/*{<FormattedMessage id="Order.ship" />}*/}
              </a>
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
    confirm({
      title: <FormattedMessage id="Order.Re-review" />,
      content: <FormattedMessage id="Order.Confirmtoreturntheselected" />,
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
      title: <FormattedMessage id="Order.confirmReceipt" />,
      content: <FormattedMessage id="Order.Confirmreceiptofallitems" />,
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
}

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
