import React from 'react';
import { Breadcrumb, Tabs, Row, Col, Button } from 'antd';
import { Select, message, Table, Collapse, Spin, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import FeedBack from './component/feedback';
import { Headline, Const, cache, AuthWrapper, getOrderStatusValue, history, util } from 'qmkit';
import { FormattedMessage, injectIntl } from 'react-intl';
import { PostalCodeMsg } from 'biz';
import './index.less';
import * as webapi from './webapi';
import { GetDelivery } from '../delivery-date/webapi';
import moment from 'moment';
import {
  getCountrySubFrequency,
  getAutoSubFrequency,
  getClubSubFrequency,
  getIndividualSubFrequency
} from '../task-manage-all-subscription/module/querySysDictionary';

const { Option } = Select;
const { TabPane } = Tabs;
const Panel = Collapse.Panel;

/**
 * 订阅详情
 */
class SubscriptionDetail extends React.Component<any, any> {
  props: {
    intl;
    match: any;
  };
  constructor(props) {
    super(props);
    this.state = {
      subscriptionId: null,
      loading: true,
      subscriptionInfo: {},
      goodsInfo: [],
      petsId: '',
      petsInfo: {},
      paymentInfo: {},
      deliveryAddressId: '',
      deliveryAddressInfo: {},
      billingAddressId: '',
      billingAddressInfo: {},
      countryArr: [],
      operationLog: [],
      promotionCode: '',
      deliveryPrice: '',
      taxFeePrice: '',
      discountsPrice: '',
      freeShippingFlag: false,
      freeShippingDiscountPrice: 0,
      subscriptionDiscountPrice: 0,
      serviceFeePrice: 0,
      promotionVOList: [],
      frequencyList: [],
      promotionDesc: 'Promotion',
      noStartOrder: [],
      completedOrder: [],
      billingCityName: '',
      deliveryCityName: '',
      currencySymbol: '',
      isActive: false,
      paymentMethod: '',
      deliverDateStatus: 0
    };
  }

  componentDidMount() {
    this.setState(
      {
        subscriptionId: this.props.match?.params?.subId || null,
        loading: true,
        currencySymbol: sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) || ''
      },
      () => {
        this.getSubscriptionDetail();
        this.getDeliveryDateStatus();
        this.getOperationLogBySubscribeId();
      }
    );
  }

  componentWillUnmount() {
    sessionStorage.removeItem('fromTaskToSubDetail');
  }

  // 获取 deliveryState 状态
  getDeliveryDateStatus = () => {
    GetDelivery().then((data) => {
      this.setState({
        deliverDateStatus: data.res?.context?.systemConfigVO?.scon.status || 0
      });
    });
  };

  getSubscriptionDetail = () => {
    this.setState({
      loading: true
    });
    webapi
      .getSubscriptionDetail(this.state.subscriptionId)
      .then(async (data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let subscriptionDetail = res.context;
          let subscriptionInfo = Object.assign({}, subscriptionDetail, {
            subscriptionStatus:
              subscriptionDetail.subscribeStatus === '0' ? (
                <FormattedMessage id="Subscription.Active" />
              ) : subscriptionDetail.subscribeStatus === '1' ? (
                <FormattedMessage id="Subscription.Pause" />
              ) : (
                <FormattedMessage id="Subscription.Inactive" />
              ),
            nextDeliveryTime: moment(new Date(subscriptionDetail.nextDeliveryTime)).format(
              'MMMM Do YYYY'
            ),
            frequency: subscriptionDetail.cycleTypeId
          });
          const countryArr = await getCountrySubFrequency();
          const frequencyList =
            subscriptionDetail.subscriptionType == 'Individual'
              ? await getIndividualSubFrequency()
              : subscriptionDetail.subscriptionType == 'Club'
                ? await getClubSubFrequency()
                : await getAutoSubFrequency();
          this.setState({
            countryArr: countryArr,
            frequencyList: frequencyList
          });

          let goodsInfo = subscriptionDetail.goodsInfo;
          let paymentInfo = subscriptionDetail.payPaymentInfo;
          let paymentMethod = subscriptionDetail.paymentMethod;

          this.setState(
            {
              subscriptionInfo: subscriptionInfo,
              goodsInfo: goodsInfo,
              paymentInfo: paymentInfo,
              petsId: subscriptionDetail.petsId,
              deliveryAddressId: subscriptionDetail.deliveryAddressId,
              deliveryAddressInfo: subscriptionDetail.consignee,
              billingAddressId: subscriptionDetail.billingAddressId,
              billingAddressInfo: subscriptionDetail.invoice,
              promotionCode: subscriptionDetail.promotionCode,
              noStartOrder: subscriptionDetail.noStartTradeList,
              completedOrder: subscriptionDetail.completedTradeList,
              isActive: subscriptionDetail.subscribeStatus === '0',
              paymentMethod: paymentMethod,
              serviceFeePrice: subscriptionInfo.serviceFeePrice ?? 0
            },
            () => {
              this.applyPromotionCode(this.state.promotionCode);
            }
          );
        }
      })
      .catch((err) => { })
      .finally(() => {
        this.setState({
          loading: false
        });
      });
  };

  addressById = (id: String, type: String) => {
    webapi.addressById(id).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        if (type === 'delivery') {
          let info = res.context;
          let deliveryAddressInfo = {
            countryId: info.countryId,
            cityId: info.cityId,
            address1: info.address1,
            address2: info.address2
          };
          setTimeout(() => {
            this.setState(
              {
                deliveryAddressInfo: deliveryAddressInfo
              },
              () => {
                if (this.state.deliveryAddressId === this.state.billingAddressId) {
                  this.setState({
                    billingAddressInfo: deliveryAddressInfo
                  });
                } else {
                  this.addressById(this.state.billingAddressId, 'billing');
                }
              }
            );
          }, 100);
        }
        if (type === 'billing') {
          let info = res.context;
          let billingAddressInfo = {
            countryId: info.countryId,
            cityId: info.cityId,
            address1: info.address1,
            address2: info.address2
          };
          setTimeout(() => {
            this.setState({
              billingAddressInfo: billingAddressInfo
            });
          }, 100);
        }
      }
    });
  };

  getDictValue = (list, id) => {
    let tempId = id;
    if (list && list.length > 0) {
      let item = list.find((item) => {
        return item.id === id;
      });
      if (item) {
        tempId = item.name;
      }
    }
    return tempId;
  };

  getOperationLogBySubscribeId = () => {
    webapi.getBySubscribeId({ subscribeId: this.state.subscriptionId }).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        let operationLog = res.context.subscriptionLogsVOS;
        this.setState({
          operationLog: operationLog
        });
      }
    });
  };

  subTotal = () => {
    const { goodsInfo } = this.state;
    let sum = 0;
    for (let i = 0; i < (goodsInfo ? goodsInfo.length : 0); i++) {
      if (goodsInfo[i].subscribeNum && goodsInfo[i].originalPrice) {
        sum += +goodsInfo[i].subscribeNum * +goodsInfo[i].originalPrice;
      }
    }
    return sum;
  };

  applyPromotionCode = (promotionCode?: String) => {
    const { goodsInfo, subscriptionInfo } = this.state;
    let goodsInfoList = [];
    for (let i = 0; i < (goodsInfo ? goodsInfo.length : 0); i++) {
      let goods = {
        goodsInfoId: goodsInfo[i].skuId,
        buyCount: goodsInfo[i].subscribeNum,
        goodsInfoFlag: 1
      };
      goodsInfoList.push(goods);
    }
    let params = {
      goodsInfoList: goodsInfoList,
      promotionCode: promotionCode,
      isAutoSub: true,
      deliveryAddressId: this.state.deliveryAddressId,
      customerAccount: subscriptionInfo.consumerAccount,
      paymentCode: subscriptionInfo.paymentMethod,
      totalPrice: this.getSubscriptionPrice(
        this.subTotal() -
        +this.state.discountsPrice +
        +this.state.deliveryPrice +
        +this.state.taxFeePrice -
        +this.state.freeShippingDiscountPrice,
        'total'
      )
    };
    console.log(
      'this.subTotal()this.subTotal()',
      this.subTotal(),
      this.state.discountsPrice,
      +this.state.discountsPrice +
      +this.state.deliveryPrice +
      +this.state.taxFeePrice -
      +this.state.freeShippingDiscountPrice
    );
    webapi.getPromotionPrice(params).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        this.setState({
          deliveryPrice: res.context.deliveryPrice,
          discountsPrice: res.context.discountsPrice,
          promotionCodeShow: res.context.promotionCode,
          promotionDesc: res.context.promotionDesc,
          taxFeePrice: res.context.taxFeePrice ? res.context.taxFeePrice : 0,
          freeShippingFlag: res.context.freeShippingFlag ?? false,
          freeShippingDiscountPrice: res.context.freeShippingDiscountPrice ?? 0,
          subscriptionDiscountPrice: res.context.subscriptionDiscountPrice ?? 0,
          promotionVOList: res.context.promotionVOList ?? []
        });
      }
    });
  };

  tabChange = (key) => { };

  // 设置价格长度
  getSubscriptionPrice = (num: any, type?: any) => {
    const { subscriptionInfo } = this.state;
    if (num > 0) {
      let nlen = num.toString().split('.')[1]?.length;
      // subscriptionInfo.subscriptionType == 'Individualization' ? nlen = 4 : nlen = 2;
      // isNaN(nlen) ? 2 : nlen;
      nlen = nlen > 4 ? 4 : nlen;
      if (subscriptionInfo.subscriptionType === 'Club') {
        nlen = 2;
      }
      return num.toFixed(nlen);
    } else {
      return num;
    }
  };

  render() {
    const {
      subscriptionId,
      subscriptionInfo,
      goodsInfo,
      paymentInfo,
      deliveryAddressInfo,
      billingAddressInfo,
      countryArr,
      operationLog,
      frequencyList,
      noStartOrder,
      completedOrder,
      currencySymbol,
      isActive,
      paymentMethod,
      deliverDateStatus
    } = this.state;

    const columns = [
      {
        title: (
          <span className="subscription_product" style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.Product" />
          </span>
        ),
        key: 'Product',
        width: '40%',
        render: (text, record) => (
          <div style={{ display: 'flex' }}>
            <img
              src={util.optimizeImage(record.goodsPic)}
              className="img-item"
              style={styles.imgItem}
              alt=""
            />
            <span style={{ margin: 'auto 10px' }}>
              {record.goodsName === 'individualization'
                ? record.petsName + "'s personalized subscription"
                : record.goodsName}
            </span>
          </div>
        )
      },
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.Price" />
          </span>
        ),
        key: 'Price',
        width: '10%',
        render: (text, record) => (
          <div>
            {subscriptionInfo.subscriptionType == 'Individualization' ? null : (
              <>
                {storeId === 123457919 &&
                  this.getSubscriptionPrice(record.originalPrice) ===
                  this.getSubscriptionPrice(+record.subscribePrice) ? null : (
                  <p style={{ textDecoration: 'line-through' }}>
                    {currencySymbol + this.getSubscriptionPrice(record.originalPrice)}
                  </p>
                )}
              </>
            )}
            <p>
              {currencySymbol + ' '}
              {this.getSubscriptionPrice(+record.subscribePrice)}
            </p>
          </div>
        )
      },
      {
        title: (
          <span className="subscription_quantity" style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.Quantity" />
          </span>
        ),
        dataIndex: 'subscribeNum',
        key: 'subscribeNum',
        width: '10%',
        render: (text: any) => (
          <>{subscriptionInfo.subscriptionType == 'Individualization' ? 1 : text}</>
        )
      },
      subscriptionInfo.subscribeStatus === '0' || subscriptionInfo.subscribeStatus === '1'
        ? {
          title: (
            <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
              <FormattedMessage id="subscription.realtimeStock" />
            </span>
          ),
          dataIndex: 'stock',
          key: 'realtime',
          width: '10%',
          render: (text, record) => <span>{record?.goodsInfoVO?.stock}</span>
        }
        : { title: '' },
      {
        title: (
          <span
            className="subscription_delivery_frequency"
            style={{ color: '#8E8E8E', fontWeight: 500 }}
          >
            <FormattedMessage id="Subscription.DeliveryFrequency" />
          </span>
        ),
        dataIndex: 'frequency',
        key: 'frequency',
        width: '15%',
        render: (text, record) => (
          <div className="subscription_delivery_frequency">
            <Select style={{ width: '70%' }} value={record.periodTypeId} disabled>
              {frequencyList.map((item: any) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </div>
        )
      },
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.Total" />
          </span>
        ),
        dataIndex: 'Total',
        key: 'Total',
        width: '15%',
        render: (text, record) => (
          <div>
            <span>
              {currencySymbol +
                this.getSubscriptionPrice(+record.subscribeNum * +record.subscribePrice)}
            </span>
          </div>
        )
      }
    ];

    const operatorColumns = [
      {
        title: (window as any).RCi18n({ id: 'Order.OperatorType' }),
        dataIndex: 'operatorType',
        key: 'operatorType'
      },
      {
        title: (window as any).RCi18n({ id: 'Order.Operator' }),
        dataIndex: 'operator',
        key: 'operator'
      },
      {
        title: (window as any).RCi18n({ id: 'Order.Time' }),
        dataIndex: 'time',
        key: 'time',
        render: (time: any) => time && moment(time).format(Const.TIME_FORMAT).toString()
      },
      {
        title: (window as any).RCi18n({
          id: 'Order.OperationCategory'
        }),
        dataIndex: 'operationCategory',
        key: 'operationCategory'
      },
      {
        title: (window as any).RCi18n({
          id: 'Order.OperationLog'
        }),
        dataIndex: 'operationLog',
        key: 'operationLog',
        width: '50%',
        render: (text: any, record: any) => <div>{text}</div>
      }
    ];

    // 翻译title
    operatorColumns.forEach((obj) => {
      (obj.title as any) = <FormattedMessage id={`Order.${obj.title}`} />;
    });

    const columns_completed = [
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.Product" />
          </span>
        ),
        key: 'Product',
        width: '30%',
        render: (text, record) => (
          <div>
            {record.tradeItems &&
              record.tradeItems.map((item, index) => (
                <div style={{ display: 'flex' }} key={index}>
                  <img
                    src={util.optimizeImage(item.pic)}
                    style={styles.imgItem}
                    className="img-item"
                    alt=""
                  />
                  <div style={{ margin: 'auto 10px' }}>
                    <p>
                      {item.skuName === 'individualization'
                        ? item.petsName + "'s personalized subscription"
                        : item.skuName}
                    </p>
                    <p>{item.specDetails}</p>
                  </div>
                </div>
              ))}
          </div>
        )
      },
      {
        title: (
          <span className="subscription_quantity2" style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.Quantity" />
          </span>
        ),
        key: 'subscribeNum',
        width: '10%',
        render: (text, record) => (
          <div>
            {subscriptionInfo.subscriptionType == 'Individualization'
              ? 1
              : record.tradeItems &&
              record.tradeItems.map((item, index) => (
                <div style={{ height: 80 }} key={index}>
                  <p style={{ paddingTop: 30 }}>X {item.num}</p>
                </div>
              ))}
          </div>
        )
      },
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.EnjoyDiscount" />
          </span>
        ),
        key: 'discount',
        width: '10%',
        render: (text, record) => (
          <div style={{ color: '#e2001a' }}>
            {record.tradePrice && record.tradePrice.discountsPrice
              ? currencySymbol + ' ' + '-' + record.tradePrice.discountsPrice
              : '-'}
          </div>
        )
      },
      {
        title: (
          <span style={{ fontWeight: 500 }}>
            <FormattedMessage id="Subscription.Amount" />
          </span>
        ),
        key: 'amount',
        width: '10%',
        render: (text, record) => (
          <div>
            {record.tradePrice && record.tradePrice.totalPrice
              ? currencySymbol + ' ' + record.tradePrice.totalPrice
              : '-'}
          </div>
        )
      },
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="order.orderId" />
          </span>
        ),
        key: 'id',
        width: '10%',
        dataIndex: 'id'
      },
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Order.OrderTime" />
          </span>
        ),
        key: 'shipmentDate',
        dataIndex: 'shipmentDate',
        width: '10%',
        render: (text, record) => (
          <div>
            {record.tradeState && record.tradeState.createTime
              ? moment(record.tradeState.createTime).format('YYYY-MM-DD')
              : '-'}
          </div>
        )
      },
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.OrderStatus" />
          </span>
        ),
        key: 'shipmentStatus',
        dataIndex: 'shipmentStatus',
        width: '10%',
        render: (text, record) => (
          <div>
            {!record.id ? (
              'Autoship skiped'
            ) : record.tradeState && record.tradeState.flowState ? (
              <FormattedMessage
                id={getOrderStatusValue('OrderStatus', record.tradeState.flowState)}
              />
            ) : (
              '-'
            )}
          </div>
        )
      },
      {
        title: <FormattedMessage id="Subscription.Operation" />,
        dataIndex: '',
        key: 'x',
        width: '10%',
        render: (text, record) => (
          <>
            {record.id ? (
              <Link to={'/order-detail/' + record.id}>
                <Tooltip placement="top" title={<FormattedMessage id="Subscription.Detail" />}>
                  <a style={styles.edit} className="iconfont iconDetails" />
                </Tooltip>
              </Link>
            ) : null}
          </>
        )
      }
    ];

    const columns_foodDispenser_no_start = [
      {
        title: <FormattedMessage id="Subscription.noStar.DeliveryDate" />,
        key: 'shipmentDate',
        dataIndex: 'shipmentDate',
        render: (text, record) => (
          <div>
            {record.tradeItems &&
              record.tradeItems.length > 0 &&
              record.tradeItems[0]['nextDeliveryTime']
              ? moment(record.tradeItems[0]['nextDeliveryTime']).format('YYYY-MM-DD')
              : '-'}
          </div>
        )
      },
      {
        title: <FormattedMessage id="Subscription.noStar.Product" />,
        key: 'Product',
        render: (text, record) => (
          <div>
            {record.tradeItems &&
              record.tradeItems.map((item, index) => (
                <div style={{ display: 'flex' }} key={index}>
                  <img
                    src={util.optimizeImage(item.pic)}
                    style={{ width: 60, height: 80 }}
                    alt=""
                  />
                  <div style={{ margin: 'auto 10px' }}>
                    <p>
                      {item.skuName === 'individualization'
                        ? item.petsName + "'s personalized subscription"
                        : item.skuName}
                    </p>
                    <p>{item.specDetails}</p>
                  </div>
                </div>
              ))}
          </div>
        )
      },
      {
        title: ' ' // cover last th text align right
      }
    ];

    const styles = {
      backItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 10,
        marginBottom: 20
      }
    } as any;

    const storeId = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}').storeId || '';

    return (
      <div>
        {/*从task跳到subscription detail显示不同的面包屑*/}
        {sessionStorage.getItem('fromTaskToSubDetail') ? (
          <Breadcrumb>
            <Breadcrumb.Item>
              <a href="/">
                <FormattedMessage id="Menu.Home" />
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="/tasks">
                <FormattedMessage id="task.TaskBoard" />
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href={`/edit-task/${sessionStorage.getItem('taskId')}`}>
                <FormattedMessage id="task.Taskedition" />
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{<FormattedMessage id="Subscription.detail" />}</Breadcrumb.Item>
          </Breadcrumb>
        ) : (
          <Breadcrumb>
            <Breadcrumb.Item>
              <a href="/subscription-list">
                <FormattedMessage id="Subscription.Subscription" />
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="/subscription-list">
                <FormattedMessage id="Subscription.SubscriptionList" />
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{<FormattedMessage id="Subscription.detail" />}</Breadcrumb.Item>
          </Breadcrumb>
        )}

        <Spin spinning={this.state.loading}>
          <div className="container-search">
            <Headline
              style={{ display: 'flex', justifyContent: 'space-between' }}
              title={<FormattedMessage id="Subscription.detail" />}
            >
              {/* {sessionStorage.getItem('fromTaskToSubDetail') &&
              storeId === 123457907 &&
              sessionStorage.getItem('taskEventTriggerName') === '3DaysBeforeNextRefillOrder' ? (
                <a
                  style={{ textAlign: 'right' }}
                  onClick={() => {
                    sessionStorage.setItem('subscriptionNo', subscriptionId);
                    history.push('/task/manage-all-subscription');
                  }}
                >
                  <FormattedMessage id="task.editAllSubLink" />
                </a>
              ) : null} */}
              {/* ru需要editAllSubscription */}
              {subscriptionInfo.editAllSubscriptionFlag && storeId === 123457907 ? (
                <Button
                  style={{ textAlign: 'right' }}
                  onClick={() => {
                    sessionStorage.setItem('subscriptionNo', subscriptionId);
                    //subscriptionInfo.customerAccount
                    sessionStorage.setItem(
                      'taskCustomerAccount',
                      subscriptionInfo?.customerAccount
                    );
                    history.push('/task/manage-all-subscription');
                  }}
                >
                  <FormattedMessage id="task.editAllSubLink" />
                </Button>
              ) : null}
            </Headline>
            <Row className="subscription-basic-info">
              <Col span={24}>
                <span style={{ fontSize: '16px', color: '#3DB014' }}>
                  {subscriptionInfo?.subscriptionStatus}
                </span>
              </Col>
              <Col span={11} className="basic-info">
                <p>
                  <FormattedMessage id="Subscription.SubscriptionNumber" /> :{' '}
                  <span>{subscriptionInfo?.subscribeId}</span>
                  {subscriptionInfo?.subscribeSource === 'SUPPLIER' ? (
                    <span>
                      [<FormattedMessage id="Order.goodwillOrder" />]
                    </span>
                  ) : null}
                </p>
                <p>
                  <FormattedMessage id="Subscription.SubscriptionDate" /> :
                  <span>
                    {moment(new Date(subscriptionInfo.createTime)).format('YYYY-MM-DD HH:mm:ss')}
                  </span>
                </p>
                <p>
                  <FormattedMessage id="Subscription.AuditorID" /> :{' '}
                  <span>{subscriptionInfo.prescriberId}</span>
                </p>
                <p>
                  <FormattedMessage id="Subscription.AuditorName" /> :{' '}
                  <span>{subscriptionInfo.presciberName}</span>
                </p>
                <p>
                  <FormattedMessage id="Order.subscriptionType" /> :{' '}
                  <span>{subscriptionInfo.subscriptionType}</span>
                </p>
                <p>
                  <FormattedMessage id="Order.subscriptionPlanType" /> :{' '}
                  <span>{subscriptionInfo.subscriptionPlanType}</span>
                </p>
              </Col>
              <Col span={11} className="basic-info">
                <p>
                  <FormattedMessage id="Subscription.PetOwnerName" /> :{' '}
                  <span>{subscriptionInfo.customerName}</span>
                </p>
                {storeId === 123457919 ? (
                  <p>
                    <FormattedMessage id="PetOwner.PetOwnerName katakana" /> :{' '}
                    <span>
                      {subscriptionInfo.firstNameKatakana} {subscriptionInfo.lastNameKatakana}
                    </span>
                  </p>
                ) : null}
                <p>
                  <FormattedMessage id="Subscription.ConsumerAccount" /> :{' '}
                  <span>{subscriptionInfo.customerAccount}</span>
                </p>
                <p>
                  <FormattedMessage id="Subscription.ConsumerType" /> :{' '}
                  <span>{subscriptionInfo.customerType}</span>
                </p>
                <p>
                  <FormattedMessage id="Subscription.PhoneNumber" /> :{' '}
                  <span>{subscriptionInfo.customerPhone}</span>
                </p>
              </Col>
            </Row>
            {/* subscription 和 total */}
            <Row style={{ marginTop: 20 }} gutter={16}>
              <Col span={24}>
                <Table
                  rowKey={(record, index) => index.toString()}
                  columns={columns}
                  dataSource={goodsInfo}
                  pagination={false}
                  key={Math.rdmValue()}
                />
              </Col>

              <Col span={8} offset={16}>
                <div className="flex-between">
                  <span>
                    <FormattedMessage id="Subscription.Subtotal" />
                  </span>
                  <span style={styles.priceStyle}>
                    {currencySymbol + this.getSubscriptionPrice(this.subTotal())}
                  </span>
                </div>

                {goodsInfo[0]?.originalPrice !== goodsInfo[0]?.subscribePrice && (
                  <div className="flex-between">
                    {/* <span>{this.state.promotionDesc ? this.state.promotionDesc : 'Promotion'}</span> */}
                    <span>
                      <FormattedMessage id="Order.subscriptionDiscount" />
                    </span>
                    <span style={styles.priceStyle}>
                      {currencySymbol +
                        '-' +
                        this.getSubscriptionPrice(
                          this.state.subscriptionDiscountPrice
                            ? this.state.subscriptionDiscountPrice
                            : 0
                        )}
                    </span>
                  </div>
                )}

                {this.state.promotionVOList.map((pvo, idx) => (
                  <div key={idx} className="flex-between">
                    <span>{pvo.marketingName}</span>
                    <span style={styles.priceStyle}>
                      {currencySymbol +
                        ' -' +
                        this.getSubscriptionPrice(pvo.discountPrice ? pvo.discountPrice : 0)}
                    </span>
                  </div>
                ))}

                {storeId === 123457919 && this.state.taxFeePrice > 0 && (
                  <div className="flex-between">
                    <span>
                      <FormattedMessage id="Order.consumptionTax" />
                    </span>
                    <span style={styles.priceStyle}>
                      {currencySymbol +
                        ' -' +
                        this.getSubscriptionPrice(
                          this.state.taxFeePrice ? this.state.taxFeePrice : 0
                        )}
                    </span>
                  </div>
                )}

                <div className="flex-between">
                  <span>
                    <FormattedMessage id="Subscription.Shipping" />
                  </span>
                  <span style={styles.priceStyle}>
                    {currencySymbol +
                      this.getSubscriptionPrice(
                        this.state.deliveryPrice ? this.state.deliveryPrice : 0
                      )}
                  </span>
                </div>
                {this.state.freeShippingFlag && (
                  <div className="flex-between">
                    <span>
                      <FormattedMessage id="Order.shippingFeesDiscount" />
                    </span>
                    <span style={styles.priceStyle}>
                      {currencySymbol +
                        ' -' +
                        this.getSubscriptionPrice(
                          this.state.freeShippingDiscountPrice
                            ? this.state.freeShippingDiscountPrice
                            : 0
                        )}
                    </span>
                  </div>
                )}
                {+sessionStorage.getItem(cache.TAX_SWITCH) === 1 ? (
                  <div className="flex-between">
                    <span>
                      <FormattedMessage id="Subscription.Tax" />
                    </span>
                    <span style={styles.priceStyle}>
                      {currencySymbol +
                        this.getSubscriptionPrice(
                          this.state.taxFeePrice ? this.state.taxFeePrice : 0
                        )}
                    </span>
                  </div>
                ) : null}

                {this.state.serviceFeePrice > 0 && (
                  <div className="flex-between">
                    <span>
                      <FormattedMessage id="Order.serviceFeePrice" />
                    </span>
                    <span style={styles.priceStyle}>
                      {currencySymbol +
                        this.getSubscriptionPrice(
                          this.state.serviceFeePrice ? this.state.serviceFeePrice : 0
                        )}
                    </span>
                  </div>
                )}
                <div className="flex-between">
                  <span>
                    <span>
                      <FormattedMessage id="Subscription.Total" />
                    </span>{' '}
                    (<FormattedMessage id="Subscription.IVAInclude" />
                    ):
                  </span>
                  <span className="total-iva-include" style={styles.priceStyle}>
                    {currencySymbol +
                      this.getSubscriptionPrice(
                        this.subTotal() -
                        +this.state.discountsPrice +
                        +this.state.deliveryPrice +
                        +this.state.taxFeePrice -
                        +this.state.freeShippingDiscountPrice +
                        +this.state.serviceFeePrice,
                        'total'
                      )}
                  </span>
                </div>
              </Col>
            </Row>
            <Row className="consumer-info" style={{ marginTop: 20 }}>
              <Col span={8}>
                <Row>
                  <Col span={12}>
                    <label className="info-title info_title_detail_delivery_address">
                      {deliveryAddressInfo.receiveType === 'PICK_UP' ? (
                        <FormattedMessage id="Subscription.PickupAddress" />
                      ) : (
                        <FormattedMessage id="Subscription.DeliveryAddress" />
                      )}
                    </label>
                  </Col>

                  {storeId === 123457919 ? (
                    <>
                      <Col span={24}>
                        <p style={{ width: 210 }}>
                          <FormattedMessage id="Subscription.Name" />:{' '}
                        </p>
                        <p>
                          {deliveryAddressInfo
                            ? deliveryAddressInfo.lastName + ' ' + deliveryAddressInfo.firstName
                            : ''}
                        </p>
                      </Col>
                      <Col span={24}>
                        <p style={{ width: 210 }}>
                          <FormattedMessage id="Subscription.Name katakana" />:{' '}
                        </p>
                        <p>
                          {deliveryAddressInfo
                            ? deliveryAddressInfo.lastNameKatakana +
                            ' ' +
                            deliveryAddressInfo.firstNameKatakana
                            : ''}
                        </p>
                      </Col>
                      <Col span={24}>
                        <p style={{ width: 210 }}>
                          <FormattedMessage id="PetOwner.AddressForm.Postal code" />:{' '}
                        </p>
                        <p>{deliveryAddressInfo.postCode}</p>
                      </Col>
                      <Col span={24}>
                        <p style={{ width: 210 }}>
                          <FormattedMessage id="PetOwner.AddressForm.State" />:{' '}
                        </p>
                        <p>{deliveryAddressInfo.province}</p>
                      </Col>
                      <Col span={24}>
                        <p style={{ width: 210 }}>
                          <FormattedMessage id="PetOwner.AddressForm.City" />:{' '}
                        </p>
                        <p>{deliveryAddressInfo.city}</p>
                      </Col>
                      <Col span={24}>
                        <p style={{ width: 210 }}>
                          <FormattedMessage id="PetOwner.AddressForm.Region" />:{' '}
                        </p>
                        <p>{deliveryAddressInfo.area}</p>
                      </Col>
                      <Col span={24}>
                        <p style={{ width: 210 }}>
                          <FormattedMessage id="PetOwner.AddressForm.Address1" />:{' '}
                        </p>
                        <p>{deliveryAddressInfo.address1}</p>
                      </Col>
                      <Col span={24}>
                        <p style={{ width: 210 }}>
                          <FormattedMessage id="PetOwner.AddressForm.Phone number" />:{' '}
                        </p>
                        <p>{deliveryAddressInfo.consigneeNumber}</p>
                      </Col>
                    </>
                  ) : (
                    <>
                      <Col span={24}>
                        <p style={{ width: 140 }}>
                          <FormattedMessage id="Subscription.Name" />:{' '}
                        </p>
                        <p>
                          {deliveryAddressInfo
                            ? deliveryAddressInfo.firstName + ' ' + deliveryAddressInfo.lastName
                            : ''}
                        </p>
                      </Col>
                      <Col span={24}>
                        <p style={{ width: 140 }}>
                          <FormattedMessage id="Subscription.City" />:{' '}
                        </p>
                        <p>{deliveryAddressInfo.city}</p>
                      </Col>
                      {deliveryAddressInfo.province ? (
                        <Col span={24}>
                          <p style={{ width: 140 }}>
                            <FormattedMessage id="Subscription.State" />:{' '}
                          </p>
                          <p>{deliveryAddressInfo.province}</p>
                        </Col>
                      ) : null}

                      <Col span={24}>
                        <p style={{ width: 140 }}>
                          <FormattedMessage id="Subscription.Country" />:{' '}
                        </p>
                        <p>
                          {deliveryAddressInfo.countryId
                            ? this.getDictValue(countryArr, deliveryAddressInfo.countryId)
                            : deliveryAddressInfo.country}
                        </p>
                      </Col>
                      <Col span={24}>
                        <p style={{ width: 140 }}>
                          <FormattedMessage id="Subscription.Address1" />:{' '}
                        </p>
                        <p>{deliveryAddressInfo ? deliveryAddressInfo.address1 : ''}</p>
                      </Col>

                      <Col span={24}>
                        <p style={{ width: 140 }}>
                          <FormattedMessage id="Subscription.Address2" />:{' '}
                        </p>
                        <p className="delivery_detail_address2">
                          {deliveryAddressInfo ? deliveryAddressInfo.address2 : ''}
                        </p>
                      </Col>

                      {deliveryAddressInfo?.county ? (
                        <Col span={24}>
                          <p style={{ width: 140 }}>
                            <FormattedMessage id="Subscription.County" />:{' '}
                          </p>
                          <p>{deliveryAddressInfo ? deliveryAddressInfo.county : ''}</p>
                        </Col>
                      ) : null}

                      {deliveryAddressInfo.receiveType === 'PICK_UP' ? (
                        <Col span={24}>
                          <p style={{ width: 140 }}>
                            <FormattedMessage id="Subscription.WorkTime" />:{' '}
                          </p>
                          <p>{deliveryAddressInfo ? deliveryAddressInfo.workTime : ''}</p>
                        </Col>
                      ) : null}

                      {/*根据地址是否属于黑名单进而决定是否显示*/}
                      <Col span={24}>
                        {!deliveryAddressInfo.validFlag
                          ? deliveryAddressInfo.alert && (
                            <PostalCodeMsg text={deliveryAddressInfo.alert} />
                          )
                          : null}
                      </Col>
                    </>
                  )}
                </Row>
              </Col>
              {/* 如果是俄罗斯or日本 如果是HOME_DELIVERY（并且timeslot存在） 显示 timeSlot 信息,如果是PICK_UP 显示pickup 状态
              如果是美国不显示内容 其他国家显示billingAddress */}
              {/* deliverDateStatus要从 data.res?.context?.systemConfigVO?.status */}
              <Col span={8}>
                {storeId === 123457907 || storeId === 123457919 ? (
                  <Row>
                    {deliveryAddressInfo.receiveType === 'HOME_DELIVERY' ? (
                      <>
                        {deliveryAddressInfo.timeSlot && deliverDateStatus === 1 ? (
                          <>
                            <Col span={12}>
                              <label className="info-title">
                                <FormattedMessage id="Setting.timeSlot" />
                              </label>
                            </Col>
                            <Col span={24}>
                              <p>{deliveryAddressInfo.deliveryDate}</p>
                            </Col>
                            <Col span={24}>
                              <p>{deliveryAddressInfo.timeSlot}</p>
                            </Col>
                          </>
                        ) : null}
                      </>
                    ) : deliveryAddressInfo.receiveType === 'PICK_UP' ? (
                      <>
                        <Col span={12}>
                          <p />
                        </Col>
                        <Col span={24}>
                          {deliveryAddressInfo.pickupPointState ? (
                            <p>
                              <FormattedMessage id="Subscription.TabPane.Active" />
                              <span className="successPoint" />
                            </p>
                          ) : (
                            <p>
                              <FormattedMessage id="Subscription.TabPane.Inactive" />
                              <span className="failedPoint" />
                            </p>
                          )}
                        </Col>
                      </>
                    ) : null}
                  </Row>
                ) : storeId === 123457910 ? null : (
                  <Row>
                    <Col span={12}>
                      <label className="info-title info_title_detail_billing_address">
                        <FormattedMessage id="Subscription.BillingAddress" />
                      </label>
                    </Col>

                    <Col span={24}>
                      <p style={{ width: 140 }}>
                        <FormattedMessage id="Subscription.Name" />:{' '}
                      </p>
                      <p>
                        {billingAddressInfo
                          ? billingAddressInfo.firstName + ' ' + billingAddressInfo.lastName
                          : ''}
                      </p>
                    </Col>
                    <Col span={24}>
                      <p style={{ width: 140 }}>
                        <FormattedMessage id="Subscription.City" />:{' '}
                      </p>
                      <p>{billingAddressInfo.city}</p>
                    </Col>
                    {billingAddressInfo.province ? (
                      <Col span={24}>
                        <p style={{ width: 140 }}>
                          <FormattedMessage id="Subscription.State" />:{' '}
                        </p>
                        <p>{billingAddressInfo.province}</p>
                      </Col>
                    ) : null}

                    <Col span={24}>
                      <p style={{ width: 140 }}>
                        <FormattedMessage id="Subscription.Country" />:{' '}
                      </p>
                      <p>
                        {billingAddressInfo.countryId
                          ? this.getDictValue(countryArr, billingAddressInfo.countryId)
                          : billingAddressInfo.country}
                      </p>
                    </Col>

                    <Col span={24}>
                      <p style={{ width: 140 }}>
                        <FormattedMessage id="Subscription.Address1" />:{' '}
                      </p>
                      <p>{billingAddressInfo ? billingAddressInfo.address1 : ''}</p>
                    </Col>

                    <Col span={24}>
                      <p style={{ width: 140 }}>
                        <FormattedMessage id="Subscription.Address2" />:{' '}
                      </p>
                      <p className="billing_detail_address2">
                        {billingAddressInfo ? billingAddressInfo.address2 : ''}
                      </p>
                    </Col>

                    {billingAddressInfo?.county ? (
                      <Col span={24}>
                        <p style={{ width: 140 }}>
                          <FormattedMessage id="Subscription.County" />:{' '}
                        </p>
                        <p>{billingAddressInfo ? billingAddressInfo.county : ''}</p>
                      </Col>
                    ) : null}
                  </Row>
                )}
              </Col>
              <Col span={8}>
                <Row>
                  <Col span={24}>
                    <label className="info-title">
                      <FormattedMessage id="Subscription.PaymentMethod" />
                    </label>
                  </Col>
                  {/* 如果有paymentInfo 显示 paymentInfo,否则判断是否是cod,不是cod 不显示 */}
                  {paymentInfo ? (
                    <>
                      <Col span={24}>
                        <p style={{ width: 140 }}>
                          <FormattedMessage id="Subscription.PaymentMethod" />:{' '}
                        </p>
                        <p>
                          {paymentInfo && paymentInfo.paymentVendor ? (
                            paymentInfo?.paymentItem?.toLowerCase() === 'adyen_moto' ? (
                              <FormattedMessage id="Subscription.Moto" />
                            ) : (
                              paymentInfo.paymentVendor
                            )
                          ) : paymentInfo?.paymentItem?.toLowerCase() === 'adyen_paypal' ? (
                            <FormattedMessage id="Subscription.Paypal" />
                          ) : paymentInfo?.paymentItem?.toLowerCase() === 'adyen_ideal' ? (
                            <FormattedMessage id="Subscription.Ideal" />
                          ) : (
                            ''
                          )}
                        </p>
                      </Col>
                      {paymentInfo?.paymentItem?.toLowerCase() !== 'adyen_paypal' &&
                        paymentInfo?.paymentItem?.toLowerCase() !== 'adyen_moto' && paymentInfo?.paymentItem?.toLowerCase() !== 'adyen_ideal' ? (
                        <Col span={24}>
                          <p style={{ width: 140 }}>
                            <FormattedMessage id="Subscription.CardNumber" />:{' '}
                          </p>
                          <p>
                            {paymentInfo && paymentInfo.lastFourDigits
                              ? '**** **** **** ' + paymentInfo.lastFourDigits
                              : ''}
                          </p>
                        </Col>
                      ) : null}
                    </>
                  ) : paymentMethod.indexOf('COD') !== -1 ? (
                    <Col span={24}>
                      <p style={{ width: 140 }}>
                        <FormattedMessage id="Subscription.PaymentMethod" />:{' '}
                      </p>
                      <p>
                        <FormattedMessage id="Subscription.CashOnDelivery" />
                      </p>
                    </Col>
                  ) : paymentMethod.indexOf('ADYEN_PAYPAL') !== -1 ? (
                    <Col span={24}>
                      <p style={{ width: 140 }}>
                        <FormattedMessage id="Subscription.PaymentMethod" />:{' '}
                      </p>
                      <p>
                        <FormattedMessage id="Subscription.Paypal" />
                      </p>
                    </Col>
                  ) : null}
                </Row>
              </Col>
            </Row>
          </div>
          <div className="container-search">
            <Headline title={<FormattedMessage id="Subscription.AutoshipOrder" />} />
            <Tabs defaultActiveKey="1" onChange={this.tabChange}>
              <TabPane tab={<FormattedMessage id="Subscription.NoStart" />} key="noStart">
                <Table
                  rowKey={(record, index) => index.toString()}
                  columns={columns_foodDispenser_no_start}
                  dataSource={noStartOrder}
                  pagination={false}
                />
              </TabPane>
              <TabPane tab={<FormattedMessage id="Subscription.Completed" />} key="completed">
                <Table
                  rowKey={(record, index) => index.toString()}
                  rowClassName={(record, index) => {
                    let className = 'normal-row';
                    if (!record.id) className = 'disable-row';
                    return className;
                  }}
                  columns={columns_completed}
                  dataSource={completedOrder}
                  pagination={false}
                />
              </TabPane>
            </Tabs>
            <Row style={styles.backItem}>
              <Collapse>
                <Panel
                  header={<FormattedMessage id="Subscription.operationLog" />}
                  key="1"
                  style={{ paddingRight: 10 }}
                >
                  <Row>
                    <Col span={24}>
                      <Table
                        rowKey={(record, index) => index.toString()}
                        columns={operatorColumns}
                        dataSource={operationLog}
                        bordered
                        pagination={false}
                      />
                    </Col>
                  </Row>
                </Panel>
              </Collapse>
            </Row>
          </div>
          <AuthWrapper functionName="f_subscription_feedback">
            {this.state.subscriptionId ? (
              <FeedBack subscriptionId={this.state.subscriptionId} />
            ) : null}
          </AuthWrapper>
        </Spin>
        <div className="bar-button">
          {isActive ? (
            <Button type="primary" style={{ marginRight: 10 }}>
              <Link to={'/subscription-edit/' + this.state.subscriptionId}>
                {<FormattedMessage id="Subscription.Edit" />}
              </Link>
            </Button>
          ) : null}

          <Button onClick={() => (history as any).go(-1)}>
            {<FormattedMessage id="Subscription.back" />}
          </Button>
        </div>
      </div>
    );
  }
}
export default injectIntl(SubscriptionDetail);
const styles = {
  priceStyle: {
    marginRight: 15
  },
  edit: {
    paddingRight: 10
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
  }
};
