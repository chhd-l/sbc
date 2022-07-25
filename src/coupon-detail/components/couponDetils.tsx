import React, { useEffect, useState } from 'react';
import { Breadcrumb, Col, Row, Spin } from 'antd';
import { BreadCrumb, cache, RCi18n } from 'qmkit';
import { useParams } from 'react-router-dom';
import { useRequest } from 'ahooks';
import { getAactivity } from '../webapi';
import { FormattedMessage } from 'react-intl';
import { enumConst } from '@/marketing-setting/create-promotion/enum';
import '../index.less';
import BarLine from '@/marketing-details/components/BarLine';
import { isNumber } from 'lodash';
import TextArea from 'antd/lib/input/TextArea';
type MarketingDetailsProps = {};
const MAK_TYPE = {
  0: 'Promotion details',
  1: `Full discount ${RCi18n({
    id: 'Marketing.Activitydetails'
  })}`,
  2: `Gift ${RCi18n({
    id: 'Marketing.Activitydetails'
  })}`,
  3: `Free shipping ${RCi18n({
    id: 'Marketing.Activitydetails'
  })}`,
  4: `Leaflet ${RCi18n({
    id: 'Marketing.Activitydetails'
  })}`
};
const CouponDetails = (props: MarketingDetailsProps) => {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const { cid } = useParams();
  const { data } = useRequest(async () => {
    const {
      res: {
        context: { couponInfo }
      }
    } = await getAactivity({ couponId: cid, pageNum: 0, pageSize: 10 });
    if (couponInfo) {
      setLoading(false)
    } else {
      let ti = setTimeout(() => {
        setLoading(false)
        clearTimeout(ti)
      }, 1000);
    }
    return couponInfo;
  });
  const renderCartLimit = () => {
    if (!data) return null;
    const { fullReductionLevelList, fullDiscountLevelList, subType, marketingType } = data;
    // const list = marketingType == 1 ? fullDiscountLevelList : fullReductionLevelList;
    // if (!list) return null;
    // const level = list[0];
    let isAmount;
    if (data?.fullbuyCount != null || data.fullBuyPrice != null) {
      isAmount = Boolean(data?.fullbuyCount) ? 2 : 1;
    } else {
      isAmount = 3
    }
    return (
      <Col className="step-summary-item-text">
        {enumConst.CartLimit[isAmount]}
        {isAmount === 1 &&
          `(${data.fullBuyPrice}${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)})`
        }
        {isAmount === 2 &&
          '(' +
          data.fullbuyCount +
          (window as any).RCi18n({
            id: 'Marketing.items'
          }) +
          ')'
        }
        {isAmount === 3 && 'None'}
        {/* {subType === 0 ? ( // full amount reduction
          <span className="rule-span">
            <FormattedMessage id="Marketing.Full" />{' '}
            {level.fullAmount == 0 || level.fullAmount ? level.fullAmount : level.fullCount}{' '}
            {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)} reduction{' '}
            {level.reduction ? level.reduction : 0}{' '}
            {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
          </span>
        ) : subType === 1 ? ( // full quantity reduction
          <span className="rule-span">
            <FormattedMessage id="Marketing.Full" />{' '}
            {level.fullAmount == 0 || level.fullAmount ? level.fullAmount : level.fullCount} items
            reduction {level.reduction ? level.reduction : 0}{' '}
            {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
          </span>
        ) : subType === 2 ? ( //full amount discount
          <div className="rule-span">
            <FormattedMessage id="Marketing.Full" />{' '}
            {level.fullAmount == 0 || level.fullAmount ? level.fullAmount : level.fullCount}{' '}
            {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)} discount {100 - level.discount * 100}{' '}
            % discount
          </div>
        ) : subType === 3 ? ( //full quantity discount
          <span className="rule-span">
            <FormattedMessage id="Marketing.Full" />{' '}
            {level.fullAmount == 0 || level.fullAmount ? level.fullAmount : level.fullCount} items
            discount {100 - level.discount * 100} % discount
          </span>
        ) : subType === 6 ? ( // subsctiption reduction
          <div className="rule-span">
            <div>
              <FormattedMessage id="Marketing.SubscriptionOrderReduction" />
              {level.firstSubscriptionOrderReduction || 0}{' '}
              {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
            </div>
            <div>
              <FormattedMessage id="Marketing.Fortherestsubscriptionorderreduction" />
              {level.restSubscriptionOrderReduction || 0}{' '}
              {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
            </div>
          </div>
        ) : subType === 7 ? ( // subsctiption discount
          <div className="rule-span">
            <div>
              <FormattedMessage id="Marketing.theFirstSubscriptionOrder" />
              {100 - level.firstSubscriptionOrderDiscount * 100} %{' '}
              <FormattedMessage id="Marketing.discount" />
              {level.firstSubscriptionLimitAmount && (
                <>
                  , discount limit {level.firstSubscriptionLimitAmount}{' '}
                  {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                </>
              )}
            </div>
            <div>
              <FormattedMessage id="Marketing.Fortherestsubscriptionorder" />{' '}
              {100 - level.restSubscriptionOrderDiscount * 100}&nbsp;%{' '}
              <FormattedMessage id="Marketing.discount" />
              {level.restSubscriptionLimitAmount && (
                <>
                  , discount limit {level.restSubscriptionLimitAmount}{' '}
                  {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                </>
              )}
            </div>
          </div>
        ) : null}
        {level.limitAmount && (
          <div className="display-inline-block">
            ,&nbsp;&nbsp;discount limit&nbsp;&nbsp;{level.limitAmount}
          </div>
        )} */}
      </Col>
    );
  };
  const renderCouponValueOrDiscountLimit = () => {
    if (!data) return null;
    const { fullReductionLevelList, fullDiscountLevelList, subType, marketingType, couponPromotionType } = data;
    switch (couponPromotionType) {
      case 0:
        return (<>
          <Row className="step-summary-item">
            <Col className="step-summary-sub-title">
              <FormattedMessage id="Marketing.CouponValue" />:
            </Col>
            <Col className="step-summary-item-text">
              {data?.denomination ? data?.denomination + sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) : null}
            </Col>
          </Row>

        </>)
        break;
      case 1:
        return (<>
          <Row className="step-summary-item">
            <Col className="step-summary-sub-title">
              <FormattedMessage id="Marketing.CouponValue" />:
            </Col>
            <Col className="step-summary-item-text">
              {isNumber(data?.couponDiscount) ? ((1 - data?.couponDiscount) * 100).toFixed(0) + '%' : null}
            </Col>
          </Row>
          <Row className="step-summary-item">
            <Col className="step-summary-sub-title">
              <FormattedMessage id="Marketing.DiscountLimit" />:
            </Col>
            <Col className="step-summary-item-text">{data?.limitAmount}{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}</Col>
          </Row>
          <Row className="step-summary-item">
            <Col className="step-summary-sub-title">
              <FormattedMessage id="Marketing.appliesType" />:
            </Col>
            <Col className="step-summary-item-text">{enumConst.appliesType[data?.appliesType]}</Col>
          </Row>

        </>)
        break;
      case 2:
        return <Row className="step-summary-item">
          <Col className="step-summary-sub-title">
            <FormattedMessage id="Marketing.PromotionValue" />:
          </Col>
          <Col className="step-summary-item-text">
            {data?.fullGiftDetailList.map((item) => (item?.productName ? item?.productName + ' ' : null))}
          </Col>
        </Row>
        break;
      case 3:

        break;
      case 4:
        return <Row className="step-summary-item">
          <Col className="step-summary-sub-title">
            <FormattedMessage id="Marketing.PromotionValue" />:
          </Col>
          <Col className="step-summary-item-text">
            {data?.fullGiftDetailList.map((item) => (item?.productName ? item?.productName + ' ' : null))}
          </Col>
        </Row>
        break;
      default:
        return (<>
          <Row className="step-summary-item">
            <Col className="step-summary-sub-title">
              <FormattedMessage id="Marketing.CouponValue" />:
            </Col>
            <Col className="step-summary-item-text">
              {isNumber(data?.couponDiscount) ? ((1 - data?.couponDiscount) * 100).toFixed(0) + '%' : null}
            </Col>
          </Row>

        </>)
        break;
    }


  }

  return (
    <Spin spinning={loading}>
      <div className="container  coupon-details">
        {/* <div className="step-title">
          <FormattedMessage id="Marketing.CouponDetail" />
        </div> */}
        <div className="step-summary" style={{ paddingLeft: '10%' }}>
          {/* 左边 */}
          <div style={{ flexShrink: 0, marginRight: '150px' }}>
            <div>
              <div className="step-summary-title">
                <FormattedMessage id="Marketing.BasicSetting" />
              </div>
              <Row className="step-summary-item">
                <Col className="step-summary-sub-title">
                  {/*  Marketing.PromotionName */}
                  <FormattedMessage id="Marketing.CampaignName" />:
                </Col>
                <Col className="step-summary-item-text">{data?.couponName}</Col>
              </Row>
              <Row className="step-summary-item">
                <Col className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.StartAndEndTime" />:
                </Col>
                <Col className="step-summary-item-text">
                  {data?.startTime.slice(0, data?.startTime.indexOf('.'))} - {data?.endTime.slice(0, data?.endTime.indexOf('.'))}
                </Col>
              </Row>
              <Row className="step-summary-item">
                <Col className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.createName" />:
                </Col>
                <Col className="step-summary-item-text">
                  {data?.createName}
                </Col>
              </Row>
              <Row className="step-summary-item">
                <Col className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.Description" />:
                </Col>
                <Col className="step-summary-item-text">
                  {data?.couponDescription && (
                    <TextArea
                      rows={5}
                      // autoSize={{ minRows: 5, maxRows: 50 }}
                      value={data?.couponDescription}
                      // style={{ width: '100%' }}
                      readOnly
                    />
                  )}

                </Col>
              </Row>
            </div>

            <div>
              <div className="step-summary-title">
                <FormattedMessage id="Marketing.Conditions" />
              </div>
              <Row className="step-summary-item">
                <Col className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.TypeOfPurchase" />:
                </Col>
                <Col className="step-summary-item-text">
                  {enumConst.promotionType[data?.couponPurchaseType]}
                </Col>
              </Row>
              <Row className="step-summary-item">
                <Col className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.DoesItCummulate" />:
                </Col>
                <Col className="step-summary-item-text">
                  {data?.isSuperimposeSubscription === 0 ? 'NO' : 'YES'}
                </Col>
              </Row>

              <Row className="step-summary-item">
                <Col className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.GroupOfCustomer" />:
                </Col>
                <Col className="step-summary-item-text">{enumConst.joinLevel[data?.couponJoinLevel]}</Col>
              </Row>

              <Row className="step-summary-item">
                <Col className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.ProductsInTheCart" />:
                </Col>
                <Col className="step-summary-item-text">{enumConst.scopeType[data?.scopeType]}</Col>
              </Row>
              <Row className="step-summary-item">
                <Col className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.CartLimit" />:
                </Col>
                {renderCartLimit()}
                {/* {data?.fullbuyCount ? data?.fullbuyCount + sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) : data?.fullBuyPrice} */}
              </Row>
            </div>
          </div>
          {/* 右边 */}
          <div style={{ flexGrow: 2 }}>
            <div>
              <div className="step-summary-title">
                <FormattedMessage id="Marketing.PromotionType" />
              </div>
              <Row className="step-summary-item">
                <Col className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.TypeOfPromotion" />:
                </Col>
                <Col className="step-summary-item-text">
                  {enumConst.typeOfPromotion[data?.couponPromotionType]}
                </Col>
              </Row>
              <Row className="step-summary-item">
                <Col className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.Prefix" />:
                </Col>
                <Col className="step-summary-item-text">{data?.couponCodePrefix}</Col>
              </Row>
            </div>

            <div>
              <div className="step-summary-title">
                <FormattedMessage id="Marketing.Advantage" />
              </div>
              <Row className="step-summary-item">
                <Col className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.AdvantageType" />:
                </Col>
                <Col className="step-summary-item-text">
                  {enumConst.couponPromotionType[data?.couponPromotionType]}
                </Col>
              </Row>
              {renderCouponValueOrDiscountLimit()}

            </div>
          </div>
        </div>
        <div style={{ paddingLeft: '10%' }}>
          <div className='step-chrats'>
            <div>
              <div className="step-summary-title">
                <FormattedMessage id="Marketing.PromotionOverview" />
              </div>
              <div style={{ display: 'flex' }}>
                <div className="step-summary-item" style={{ marginRight: '4rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '15px', marginRight: '1rem' }}>
                    <FormattedMessage id="Marketing.StartDate" />:
                  </div>
                  <div className="step-summary-item-text">
                    {data?.startTime.split(' ')[0].split('-').reverse().join('/')}
                  </div>
                </div>
                <div className="step-summary-item" style={{ marginRight: '4rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '15px', marginRight: '1rem' }}>
                    <FormattedMessage id="Marketing.EndDate" />:
                  </div>
                  <div className="step-summary-item-text">{data?.endTime.split(' ')[0].split('-').reverse().join('/')}</div>
                </div>
                <div className="step-summary-item" style={{ marginRight: '4rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '15px', marginRight: '1rem' }}>
                    <FormattedMessage id="Marketing.TotalcouponCode" />:
                  </div>
                  <div className="step-summary-item-text">{total}</div>
                </div>
              </div>
            </div>
            {/* 图表 */}
            <div style={{ width: '80%', height: '300px', position: 'relative', marginTop: '20px' }}>
              <div className='redline' style={{ position: 'absolute', top: '0px', left: '40px' }}>
                <FormattedMessage id="Marketing.couponEchartsTitle" />
              </div>
              {data?.startTime && data?.endTime && (
                <BarLine
                  yName={{ y1: (window as any).RCi18n({ id: 'Home.Prescriberreward' }) }}
                  nameTextStyle={{ y1: [0, 0, 0, 42] }}
                  data={{
                    x: [21, 22, 23, 24],
                    y1: [2, 5, 8, 15],
                  }}
                  pageType={'coupon'}
                  cid={cid}
                  startDate={data?.startTime.split(' ')[0]}
                  endDate={data?.endTime.split(' ')[0]}
                  setTotal={setTotal}
                />)}
            </div>
          </div>

        </div>
      </div>
    </Spin>
  );
};
export default CouponDetails;
