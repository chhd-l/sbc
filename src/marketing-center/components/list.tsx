import * as React from 'react';
import { Col, message, Row } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { AuthWrapper, Headline, history, Const } from 'qmkit';

const images = {
  new_01: require('../images/new/01.png'),
  new_02: require('../images/new/02.png'),
  new_03: require('../images/new/03.png'),
  order_01: require('../images/order/01.png'),
  order_02: require('../images/order/02.png'),
  order_03: require('../images/order/03.png'),
  order_04: require('../images/order/04.png'),
  order_05: require('../images/order/05.png'),
  full_01: require('../images/full/01.png'),
  full_02: require('../images/full/02.png'),
  full_03: require('../images/full/03.png'),
  full_001: require('../images/full/001.png'),
  full_002: require('../images/full/002.png'),
  customer_01: require('../images/customer/01.png'),
  customer_02: require('../images/customer/02.png'),
  customer_03: require('../images/customer/03.png'),
  order_001: require('../images/order/001.png'),
  order_003: require('../images/order/003.png'),
  shipping_icon:require('../images/full/icon_Free shipping.png'),
  gift_icon:require('../images/full/icon_Gift.png'),
  first_order_icon:require('../images/full/icon_First order discount.png'),
  myvet_coupon_creation: require('../images/myvet/creation.png'),
  myvet_distribution: require('../images/myvet/distribution.png'),
  myvet_reduction: require('../images/myvet/reduction.png'),
  myvet_discount: require('../images/myvet/discount.png'),
};

const iconSpanStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center' };
const iconStyle = { width: 'initial', height: 'initial' };

export default class List extends React.Component<any, any> {
  render() {
    return (
      <div>
        <div className="container-search">
          <Headline title={<FormattedMessage id="Marketing.MarketingCenter" />} />
        </div>
        <div className="container">
          <div className="appsMain">
            {/*<h3>*/}
            {/*  获客拉新<span>全渠道新用户</span>*/}
            {/*</h3>*/}
            {/*<Row>*/}
            {/*  <Col span={6}>*/}
            {/*    <a*/}
            {/*      className="createMarket"*/}
            {/*      onClick={() => {*/}
            {/*        history.push('/groupon-add');*/}
            {/*      }}*/}
            {/*    >*/}
            {/*      <span className="left">*/}
            {/*        <img src={images.new_01} />*/}
            {/*      </span>*/}
            {/*      <div className="info">*/}
            {/*        <h5>拼团</h5>*/}
            {/*        <p>裂变传播拉新，邀请好友一起购买</p>*/}
            {/*      </div>*/}
            {/*    </a>*/}
            {/*  </Col>*/}

            {/*  <Col span={6}>*/}
            {/*    <a className="createMarket" onClick={() => history.push('/distribution-setting')}>*/}
            {/*      <span className="left">*/}
            {/*        <img src={images.new_02} />*/}
            {/*      </span>*/}
            {/*      <div className="info">*/}
            {/*        <h5>社交分销</h5>*/}
            {/*        <p>裂变传播，让分销员帮你卖货</p>*/}
            {/*      </div>*/}
            {/*      <span className="miniTags">推荐</span>*/}
            {/*    </a>*/}
            {/*  </Col>*/}
            {/*</Row>*/}

            <h3>
              <FormattedMessage id="Marketing.OrderConversion" />
              <span>
                <FormattedMessage id="Marketing.MoreOrdersAndSales" />
              </span>
            </h3>
            <Row>
              <AuthWrapper functionName={'f_create_coupon'}>
                <Col span={6}>
                  <a
                    className="createMarket"
                    onClick={() =>
                      history.push({
                        pathname: 'coupon-add',
                        state: {
                          couponType: '1',
                          source: 'marketCenter'
                        }
                      })
                    }
                  >
                    <span className="left" style={iconSpanStyle}>
                      <img src={Const.SITE_NAME === 'MYVETRECO' ? images.myvet_coupon_creation : images.order_001} style={iconStyle} />
                    </span>
                    <div className="info">
                      <h5>
                        <FormattedMessage id="Marketing.CouponCreation" />
                      </h5>
                      <p>
                        <FormattedMessage id="Marketing.CreateCouponMeetingSpecificConditions" />
                      </p>
                    </div>
                    {/*<span className="miniTags">推荐</span>
                    <span className="mini-tags">Optimum</span>*/}
                  </a>
                </Col>
              </AuthWrapper>

              {/*<AuthWrapper functionName={'f_create_all_coupon_activity'}>*/}
              {/*  <Col span={6}>*/}
              {/*    <a*/}
              {/*      className="createMarket"*/}
              {/*      onClick={() =>*/}
              {/*        history.push({*/}
              {/*          pathname: 'coupon-activity-all-present',*/}
              {/*          state: {*/}
              {/*            source: 'marketCenter'*/}
              {/*          }*/}
              {/*        })*/}
              {/*      }*/}
              {/*    >*/}
              {/*      <span className="left">*/}
              {/*        <img src={images.order_02} />*/}
              {/*      </span>*/}
              {/*      <div className="info">*/}
              {/*        <h5>全场赠券</h5>*/}
              {/*        <p>全场发券活动，领券中心全员领券</p>*/}
              {/*      </div>*/}
              {/*      <span className="miniTags">推荐</span>*/}
              {/*    </a>*/}
              {/*  </Col>*/}
              {/*</AuthWrapper>*/}

              <AuthWrapper functionName={'f_create_all_coupon_activity'}>
                <Col span={6}>
                  <a
                    className="createMarket"
                    onClick={() =>
                      history.push({
                        pathname: 'coupon-activity-specify',
                        state: {
                          source: 'marketCenter'
                        }
                      })
                    }
                  >
                    <span className="left" style={iconSpanStyle}>
                      <img src={Const.SITE_NAME === 'MYVETRECO' ? images.myvet_distribution : images.order_003} style={iconStyle} />
                    </span>
                    <div className="info">
                      <h5>
                        <FormattedMessage id="Marketing.CouponDistribution" />
                      </h5>
                      <p>
                        <FormattedMessage id="Marketing.DistributeCoupon" />
                      </p>
                    </div>
                  </a>
                </Col>
              </AuthWrapper>

              {/*<AuthWrapper functionName={'f_create_all_coupon_activity'}>*/}
              {/*  <Col span={6}>*/}
              {/*    <a*/}
              {/*      className="createMarket"*/}
              {/*      onClick={() =>*/}
              {/*        history.push({*/}
              {/*          pathname: 'coupon-activity-store',*/}
              {/*          state: {*/}
              {/*            source: 'marketCenter'*/}
              {/*          }*/}
              {/*        })*/}
              {/*      }*/}
              {/*    >*/}
              {/*      <span className="left">*/}
              {/*        <img src={images.order_04} />*/}
              {/*      </span>*/}
              {/*      <div className="info">*/}
              {/*        <h5>进店赠券</h5>*/}
              {/*        <p>进店发放券礼包，促进转化</p>*/}
              {/*      </div>*/}
              {/*    </a>*/}
              {/*  </Col>*/}
              {/*</AuthWrapper>*/}
            </Row>
            {/*<Row>*/}
            {/*  <Col span={6}>*/}
            {/*    <a*/}
            {/*      className="createMarket"*/}
            {/*      onClick={() => {*/}
            {/*        history.push('/flash-sale-list');*/}
            {/*      }}*/}
            {/*    >*/}
            {/*      <span className="left">*/}
            {/*        <img src={images.order_05} />*/}
            {/*      </span>*/}
            {/*      <div className="info">*/}
            {/*        <h5>秒杀</h5>*/}
            {/*        <p>限时特价促销，刺激消费</p>*/}
            {/*      </div>*/}
            {/*    </a>*/}
            {/*  </Col>*/}
            {/*</Row>*/}

            <h3>
              <FormattedMessage id="Marketing.ImproveConsumerBill" />
              <span>
                <FormattedMessage id="Marketing.HigherSalesAndProfits" />
              </span>
            </h3>
            <Row>
              <AuthWrapper functionName="f_marketing_reduction_add">
                <Col span={6}>
                  <a
                    className="createMarket"
                    onClick={() =>
                      history.push({
                        pathname: '/marketing-full-reduction',
                        state: {
                          source: 'marketCenter'
                        }
                      })
                    }
                  >
                    <span className="left" style={iconSpanStyle}>
                      <img src={Const.SITE_NAME === 'MYVETRECO' ? images.myvet_reduction : images.full_001} style={iconStyle} />
                    </span>
                    <div className="info">
                      <h5>
                        <FormattedMessage id="Marketing.Reduction" />
                      </h5>
                      <p>
                        <FormattedMessage id="Marketing.MeetTheSpecified" />
                      </p>
                    </div>
                  </a>
                </Col>
              </AuthWrapper>

              <AuthWrapper functionName="f_marketing_discount_add">
                <Col span={6}>
                  <a
                    className="createMarket"
                    onClick={() =>
                      history.push({
                        pathname: '/marketing-full-discount',
                        state: {
                          source: 'marketCenter'
                        }
                      })
                    }
                  >
                    <span className="left" style={iconSpanStyle}>
                      <img src={Const.SITE_NAME === 'MYVETRECO' ? images.myvet_discount : images.full_002} style={iconStyle} />
                    </span>
                    <div className="info">
                      <h5>
                        <FormattedMessage id="Marketing.Discount" />
                      </h5>
                      <p>
                        <FormattedMessage id="Marketing.DiscountAtSpecifiedConditions" />
                      </p>
                    </div>
                  </a>
                </Col>
              </AuthWrapper>
            </Row>
            <Row>
              {/*<AuthWrapper functionName="f_marketing_gift_add">*/}
              {/*  <Col span={6}>*/}
              {/*    <a*/}
              {/*      className="createMarket"*/}
              {/*      onClick={() =>*/}
              {/*        history.push({*/}
              {/*          pathname: './marketing-first-order-discount',*/}
              {/*          state: {*/}
              {/*            source: 'marketCenter'*/}
              {/*          }*/}
              {/*        })*/}
              {/*      }*/}
              {/*    >*/}
              {/*      <span className="left left2">*/}
              {/*        <img src={images.first_order_icon} />*/}
              {/*      </span>*/}
              {/*      <div className="info">*/}
              {/*        <h5><FormattedMessage id="Marketing.Firstorderdiscount" /></h5>*/}
              {/*        <p><FormattedMessage id="Marketing.Creatediscountforfirstorder" /></p>*/}
              {/*      </div>*/}
              {/*    </a>*/}
              {/*  </Col>*/}
              {/*</AuthWrapper>*/}

              {Const.SITE_NAME !== 'MYVETRECO' && <AuthWrapper functionName="f_marketing_gift_add">
                <Col span={6}>
                  <a
                    className="createMarket"
                    onClick={() =>
                      history.push({
                        pathname: '/marketing-full-gift',
                        state: {
                          source: 'marketCenter'
                        }
                      })
                    }
                  >
                    <span className="left left2">
                      <img src={images.gift_icon} />
                    </span>
                    <div className="info">
                      <h5><FormattedMessage id="Marketing.Gift" /></h5>
                      <p><FormattedMessage id="Marketing.Definemainproductandgift" /></p>
                    </div>
                  </a>
                </Col>
              </AuthWrapper>}
            </Row>
            <Row>
              {/*<AuthWrapper functionName="f_marketing_gift_add">*/}
              {/*  <Col span={6}>*/}
              {/*    <a*/}
              {/*      className="createMarket"*/}
              {/*      onClick={() =>*/}
              {/*        history.push({*/}
              {/*          pathname: '/marketing-free-shipping',*/}
              {/*          state: {*/}
              {/*            source: 'marketCenter'*/}
              {/*          }*/}
              {/*        })*/}
              {/*      }*/}
              {/*    >*/}
              {/*      <span className="left left2">*/}
              {/*        <img src={images.shipping_icon} />*/}
              {/*      </span>*/}
              {/*      <div className="info">*/}
              {/*        <h5><FormattedMessage id="Marketing.Freeshipping" /></h5>*/}
              {/*        /!*<p><FormattedMessage id="Marketing.Freeshippingwhenorder" /></p>*!/*/}
              {/*      </div>*/}
              {/*    </a>*/}
              {/*  </Col>*/}
              {/*</AuthWrapper>*/}

              {/*<AuthWrapper functionName="f_marketing_gift_add">*/}
              {/*  <Col span={6}>*/}
              {/*    <a*/}
              {/*      className="createMarket"*/}
              {/*      onClick={() =>*/}
              {/*        history.push({*/}
              {/*          pathname: '/marketing-fixed-price',*/}
              {/*          state: {*/}
              {/*            source: 'marketCenter'*/}
              {/*          }*/}
              {/*        })*/}
              {/*      }*/}
              {/*    >*/}
              {/*      <span className="left">*/}
              {/*        <img src={images.full_001} />*/}
              {/*      </span>*/}
              {/*      <div className="info">*/}
              {/*        <h5>Fixed price</h5>*/}
              {/*        <p>Set fixed price for products</p>*/}
              {/*      </div>*/}
              {/*    </a>*/}
              {/*  </Col>*/}
              {/*</AuthWrapper>*/}
            </Row>
            {/*<h3>*/}
            {/*  Increase Repeat purchase<span>Improve consumer loyalty</span>*/}
            {/*</h3>*/}
            {/*<Row>*/}
            {/*  <AuthWrapper functionName="f_subscription_promotion">*/}
            {/*    <Col span={6}>*/}
            {/*      <a className="createMarket" onClick={() => history.push('/customer-level')}>*/}
            {/*        <span className="left">*/}
            {/*          <img src={images.order_02} />*/}
            {/*        </span>*/}
            {/*        <div className="info">*/}
            {/*          <h5>Subscription Promotion</h5>*/}
            {/*          <p>Enjoy easy repeat deliveries and saving on each order</p>*/}
            {/*        </div>*/}
            {/*      </a>*/}
            {/*    </Col>*/}
            {/*  </AuthWrapper>*/}
            {/*</Row>*/}

            {/*<h3>*/}
            {/*  留存复购<span>维护老客不流失</span>*/}
            {/*</h3>*/}
            {/*<Row>*/}
            {/*  <Col span={6}>*/}
            {/*    <a className="createMarket" onClick={() => history.push('/customer-level')}>*/}
            {/*      <span className="left">*/}
            {/*        <img src={images.customer_01} />*/}
            {/*      </span>*/}
            {/*      <div className="info">*/}
            {/*        <h5>店铺会员等级</h5>*/}
            {/*        <p>店铺内会员体系管理，差异化服务</p>*/}
            {/*      </div>*/}
            {/*    </a>*/}
            {/*  </Col>*/}

            {/*  <Col span={6}>*/}
            {/*    <a className="createMarket" onClick={() => history.push('/points-order-list')}>*/}
            {/*      <span className="left">*/}
            {/*        <img src={images.customer_02} />*/}
            {/*      </span>*/}
            {/*      <div className="info">*/}
            {/*        <h5>积分商城</h5>*/}
            {/*        <p>小积分大价值，礼品随心兑</p>*/}
            {/*      </div>*/}
            {/*      <span className="miniTags">推荐</span>*/}
            {/*    </a>*/}
            {/*  </Col>*/}
            {/*</Row>*/}
          </div>
        </div>
      </div>
    );
  }

  _pleaseWait = () => {
    message.success('即将上线，敬请期待');
  };
}
