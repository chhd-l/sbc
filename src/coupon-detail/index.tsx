import React, { useEffect } from 'react';
import { Breadcrumb } from 'antd';
import { BreadCrumb, cache, RCi18n } from 'qmkit';
import { useParams } from 'react-router-dom';
import { useRequest } from 'ahooks';
import { getAactivity } from './webapi';
import { FormattedMessage } from 'react-intl';
import { enumConst } from '@/marketing-setting/create-promotion/enum';
import './index.less';
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
  const { cid } = useParams();
  const { data } = useRequest(async () => {
    const {
      res: {
        context: { couponInfo }
      }
    } = await getAactivity({ couponId: cid, pageNum: 0, pageSize: 10 });
    return couponInfo;
  });
  const renderCartLimit = () => {
    if (!data) return null;
    const { fullReductionLevelList, fullDiscountLevelList, subType, marketingType } = data;
    const list = marketingType == 1 ? fullDiscountLevelList : fullReductionLevelList;
    if (!list) return null;
    const level = list[0];
    return (
      <div className="step-summary-item-text">
        {subType === 0 ? ( // full amount reduction
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
        )}
      </div>
    );
  };
  return (
    <>
      <BreadCrumb thirdLevel={true}>
        <Breadcrumb.Item>
          <FormattedMessage id="Marketing.PromotionDetails" />
        </Breadcrumb.Item>
      </BreadCrumb>

      <div className="container  coupon-details">
        <div className="step-title">
          <FormattedMessage id="Marketing.PromotionDetails" />
        </div>
        <div className="step-summary">
          <div>
            <div>
              <div className="step-summary-title">
                <FormattedMessage id="Marketing.BasicSetting" />
              </div>
              <div className="step-summary-item">
                <div className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.PromotionName" />:
                </div>
                <div className="step-summary-item-text">{data?.couponName}</div>
              </div>
              <div className="step-summary-item">
                <div className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.StartAndEndTime" />:
                </div>
                <div className="step-summary-item-text">
                  {data?.startTime} - {data?.endTime}
                </div>
              </div>
            </div>

            <div>
              <div className="step-summary-title">
                <FormattedMessage id="Marketing.Conditions" />
              </div>
              <div className="step-summary-item">
                <div className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.TypeOfPurchase" />:
                </div>
                <div className="step-summary-item-text">
                  {enumConst.promotionType[data?.couponPromotionType]}
                </div>
              </div>

              <div className="step-summary-item">
                <div className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.GroupOfCustomer" />:
                </div>
                <div className="step-summary-item-text">{enumConst.joinLevel[data?.joinLevel]}</div>
              </div>

              <div className="step-summary-item">
                <div className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.ProductsInTheCart" />:
                </div>
                <div className="step-summary-item-text">{enumConst.scopeType[data?.scopeType]}</div>
              </div>
              <div className="step-summary-item">
                <div className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.CartLimit" />:
                </div>
                {renderCartLimit()}
              </div>
            </div>
          </div>
          <div>
            <div>
              <div className="step-summary-title">
                <FormattedMessage id="Marketing.PromotionType" />
              </div>
              <div className="step-summary-item">
                <div className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.TypeOfPromotion" />:
                </div>
                <div className="step-summary-item-text">
                  {enumConst.typeOfPromotion[data?.couponPromotionType]}
                </div>
              </div>
              <div className="step-summary-item">
                <div className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.Prefix" />:
                </div>
                <div className="step-summary-item-text">{data?.couponCodePrefix}</div>
              </div>
            </div>

            <div>
              <div className="step-summary-title">
                <FormattedMessage id="Marketing.Advantage" />
              </div>
              <div className="step-summary-item">
                <div className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.AdvantageType" />:
                </div>
                <div className="step-summary-item-text">
                  {enumConst.couponPromotionType[data?.couponPromotionType]}
                </div>
              </div>
              <div className="step-summary-item">
                <div className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.CouponValue" />:
                </div>
                <div className="step-summary-item-text">
                  {data?.fullReductionLevelList?.[0].reduction}
                </div>
              </div>
              <div className="step-summary-item">
                <div className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.DiscountLimit" />:
                </div>
                <div className="step-summary-item-text">{data?.limitAmount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CouponDetails;
