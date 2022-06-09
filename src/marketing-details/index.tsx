import React from 'react';
import { Breadcrumb } from 'antd';
import { BreadCrumb, cache, RCi18n } from 'qmkit';
import { useParams } from 'react-router-dom';
import { useRequest } from 'ahooks';
import { fetchMarketingInfo } from './webapi';
import { FormattedMessage } from 'react-intl';
import { enumConst } from '@/marketing-setting/create-promotion/enum';
import './style.less';
import BarLine from './components/BarLine';
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
const MarketingDetails = (props: MarketingDetailsProps) => {
  const { marketingId } = useParams();
  const { data } = useRequest(async () => {
    const {
      res: { context }
    } = await fetchMarketingInfo(marketingId);
    return context;
  });
  const renderCartLimit = () => {
    if (!data) return null;
    const { fullReductionLevelList, fullDiscountLevelList, subType, marketingType, marketingFreeShippingLevel, fullGiftLevelList, fullLeafletLevelList } = data;
    let list;
    switch (marketingType) {
      case 0:
        list = fullReductionLevelList;
        break;
      case 1:
        list = fullDiscountLevelList;
        break;
      case 3:
        list = [marketingFreeShippingLevel];
        break;
      case 2:
        list = fullGiftLevelList;
        break;
      case 5:
        list = fullLeafletLevelList;
        break;
    }
    if (!list) return null;
    const level = list[0];
    const isAmount = Boolean(level.fullAmount) ? 1 : 2;
    return (
      <div className="step-summary-item-text">
        {enumConst.CartLimit[isAmount]}
        {isAmount === 1 &&
          '(' +
          level.fullAmount +
          sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) +
          ')'}
        {isAmount === 2 &&
          `(${level.fullCount}${(window as any).RCi18n({
            id: 'Marketing.items'
          })})`}
      </div>
    )
    // return (
    //   <div className="step-summary-item-text">
    //     {subType === 0 ? ( // full amount reduction
    //       <span className="rule-span">
    //         <FormattedMessage id="Marketing.Full" />{' '}
    //         {level.fullAmount == 0 || level.fullAmount ? level.fullAmount : level.fullCount}{' '}
    //         {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)} reduction{' '}
    //         {level.reduction ? level.reduction : 0}{' '}
    //         {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
    //       </span>
    //     ) : subType === 1 ? ( // full quantity reduction
    //       <span className="rule-span">
    //         <FormattedMessage id="Marketing.Full" />{' '}
    //         {level.fullAmount == 0 || level.fullAmount ? level.fullAmount : level.fullCount} items
    //         reduction {level.reduction ? level.reduction : 0}{' '}
    //         {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
    //       </span>
    //     ) : subType === 2 ? ( //full amount discount
    //       <div className="rule-span">
    //         <FormattedMessage id="Marketing.Full" />{' '}
    //         {level.fullAmount == 0 || level.fullAmount ? level.fullAmount : level.fullCount}{' '}
    //         {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)} discount {100 - level.discount * 100}{' '}
    //         % discount
    //       </div>
    //     ) : subType === 3 ? ( //full quantity discount
    //       <span className="rule-span">
    //         <FormattedMessage id="Marketing.Full" />{' '}
    //         {level.fullAmount == 0 || level.fullAmount ? level.fullAmount : level.fullCount} items
    //         discount {100 - level.discount * 100} % discount
    //       </span>
    //     ) : subType === 6 ? ( // subsctiption reduction
    //       <div className="rule-span">
    //         <div>
    //           <FormattedMessage id="Marketing.SubscriptionOrderReduction" />
    //           {level.firstSubscriptionOrderReduction || 0}{' '}
    //           {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
    //         </div>
    //         <div>
    //           <FormattedMessage id="Marketing.Fortherestsubscriptionorderreduction" />
    //           {level.restSubscriptionOrderReduction || 0}{' '}
    //           {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
    //         </div>
    //       </div>
    //     ) : subType === 7 ? ( // subsctiption discount
    //       <div className="rule-span">
    //         <div>
    //           <FormattedMessage id="Marketing.theFirstSubscriptionOrder" />
    //           {100 - level.firstSubscriptionOrderDiscount * 100} %{' '}
    //           <FormattedMessage id="Marketing.discount" />
    //           {level.firstSubscriptionLimitAmount && (
    //             <>
    //               , discount limit {level.firstSubscriptionLimitAmount}{' '}
    //               {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
    //             </>
    //           )}
    //         </div>
    //         <div>
    //           <FormattedMessage id="Marketing.Fortherestsubscriptionorder" />{' '}
    //           {100 - level.restSubscriptionOrderDiscount * 100}&nbsp;%{' '}
    //           <FormattedMessage id="Marketing.discount" />
    //           {level.restSubscriptionLimitAmount && (
    //             <>
    //               , discount limit {level.restSubscriptionLimitAmount}{' '}
    //               {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
    //             </>
    //           )}
    //         </div>
    //       </div>
    //     ) : null}
    //     {level.limitAmount && (
    //       <div className="display-inline-block">
    //         ,&nbsp;&nbsp;discount limit&nbsp;&nbsp;{level.limitAmount}
    //       </div>
    //     )}
    //   </div>
    // );
  };
  const getAdvantageValueList = () => {
    if (!data) return null;
    const { fullReductionLevelList, fullDiscountLevelList, subType, marketingType, marketingFreeShippingLevel, fullGiftLevelList, fullLeafletLevelList } = data;
    let list;
    switch (marketingType) {
      case 0:
        list = fullReductionLevelList;
        break;
      case 1:
        list = fullDiscountLevelList;
        break;
      case 3:
        list = [marketingFreeShippingLevel];
        break;
      case 2:
        list = fullGiftLevelList;
        break;
      case 5:
        list = fullLeafletLevelList;
        break;
    }
    if (!list) return null;
    const level = list[0];
    const TypeOfPurchase = data?.promotionType;
    if ([0, 3].includes(TypeOfPurchase)) {
      switch (marketingType) {
        case 0:
          return <div className="step-summary-item">
            <div className="step-summary-sub-title">
              <FormattedMessage id="Marketing.PromotionValue" />:
            </div>
            <div className="step-summary-item-text">
              {level?.reduction}{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
            </div>
          </div>
          break;
        //Percentage 显示value和discount两行
        case 1:
          return <>
            <div className="step-summary-item">
              <div className="step-summary-sub-title">
                <FormattedMessage id="Marketing.PromotionValue" />:
              </div>
              <div className="step-summary-item-text">
                {level?.discount ? ((1 - level?.discount) * 100).toFixed(0) + '%' : null}
              </div>
            </div>
            <div className="step-summary-item">
              <div className="step-summary-sub-title">
                <FormattedMessage id="Marketing.DiscountLimit" />:
              </div>
              <div className="step-summary-item-text">
                {level?.limitAmount}
                {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
              </div>
            </div>
          </>
          break;
        case 3:
          return <div className="step-summary-item">
            <div className="step-summary-sub-title">
              <FormattedMessage id="Marketing.PromotionValue" />:
            </div>
            <div className="step-summary-item-text">
              {level?.fullCount}{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
            </div>
          </div>
          break;
        case 2:
          return <div className="step-summary-item">
            <div className="step-summary-sub-title">
              <FormattedMessage id="Marketing.PromotionValue" />:
            </div>
            <div className="step-summary-item-text">
              {level?.fullGiftDetailList.map((item) => (item?.productName ? item?.productName + ' ' : null))}
            </div>
          </div>
          break;
        case 5:
          return <div className="step-summary-item">
            <div className="step-summary-sub-title">
              <FormattedMessage id="Marketing.PromotionValue" />:
            </div>
            <div className="step-summary-item-text">
              {level?.fullLeafletDetailList.map((item) => (item?.productName ? item?.productName + ' ' : null))}
            </div>
          </div>
          break;
          break;
      }
    } else if ([1, 2].includes(TypeOfPurchase)) {
      // 0: <FormattedMessage id="Marketing.Amount" />,
      // 1: <FormattedMessage id="Marketing.Percentage" />,
      // 3: <FormattedMessage id="Marketing.Freeshipping" />,
      // 4: <FormattedMessage id="Marketing.Gifts" />,
      // 5: <FormattedMessage id="Marketing.leaflet" />,
      switch (marketingType) {
        case 0:
          return <>
            <div className="step-summary-item">
              <div className="step-summary-sub-title">
                <FormattedMessage id="Marketing.FirstSubscriptionOrderDiscount" />:
              </div>
              <div className="step-summary-item-text">
                {level.firstSubscriptionOrderDiscount ? ((1 - level.firstSubscriptionOrderDiscount) * 100).toFixed(0) + '%' : null}
              </div>
            </div>
            {level.firstSubscriptionLimitAmount && (
              <div className="step-summary-item">
                <div className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.FirstSubscriptionLimitAmount" />:
                </div>
                <div className="step-summary-item-text">
                  {level.firstSubscriptionLimitAmount +
                    sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                </div>
              </div>
            )}

          </>
          break;
        case 1:
          return <>
            <div className="step-summary-item">
              <div className="step-summary-sub-title">
                <FormattedMessage id="Marketing.FirstSubscriptionOrderDiscount" />:
              </div>
              <div className="step-summary-item-text">
                {level.firstSubscriptionOrderDiscount ? ((1 - level.firstSubscriptionOrderDiscount) * 100).toFixed(0) + '%' : null}
              </div>
            </div>
            {level.firstSubscriptionLimitAmount && (
              <div className="step-summary-item">
                <div className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.FirstSubscriptionLimitAmount" />:
                </div>
                <div className="step-summary-item-text">
                  {level.firstSubscriptionLimitAmount +
                    sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                </div>
              </div>
            )}
            {level.restSubscriptionOrderDiscount && (
              <div className="step-summary-item">
                <div className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.RestSubscriptionOrderDiscount" />:
                </div>
                <div className="step-summary-item-text">
                  {level.restSubscriptionOrderDiscount ? ((1 - level.restSubscriptionOrderDiscount) * 100).toFixed(0) + '%' : null}
                </div>
              </div>
            )}
            {level.restSubscriptionLimitAmount && (
              <div className="step-summary-item">
                <div className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.RestSubscriptionLimitAmount" />:
                </div>
                <div className="step-summary-item-text">
                  {level.restSubscriptionLimitAmount +
                    sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                </div>
              </div>
            )}
          </>
          break;
        case 3:
          return <div className="step-summary-item">
            <div className="step-summary-sub-title">
              <FormattedMessage id="Marketing.PromotionValue" />:
            </div>
            <div className="step-summary-item-text">
              {level?.fullCount}{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
            </div>
          </div>
          break;
        case 2:
          return <div className="step-summary-item">
            <div className="step-summary-sub-title">
              <FormattedMessage id="Marketing.PromotionValue" />:
            </div>
            <div className="step-summary-item-text">
              {level?.fullGiftDetailList.map((item) => (item?.productName ? item?.productName + ' ' : null))}
            </div>
          </div>
          break;
        case 5:
          return <div className="step-summary-item">
            <div className="step-summary-sub-title">
              <FormattedMessage id="Marketing.PromotionValue" />:
            </div>
            <div className="step-summary-item-text">
              {level?.fullLeafletDetailList.map((item) => (item?.productName ? item?.productName + ' ' : null))}
            </div>
          </div>
          break;
      }
    }

  };
  return (
    <>
      <BreadCrumb thirdLevel={true}>
        <Breadcrumb.Item>
          <FormattedMessage id="Marketing.PromotionDetails" />
        </Breadcrumb.Item>
      </BreadCrumb>

      <div className="container  marketing-details">
        <div className="step-title">
          <FormattedMessage id="Marketing.PromotionDetails" />
        </div>
        <div className="step-summary">
          {/* 左边 */}
          <div>
            <div>
              <div className="step-summary-title">
                <FormattedMessage id="Marketing.BasicSetting" />
              </div>
              <div className="step-summary-item">
                <div className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.PromotionName" />:
                </div>
                <div className="step-summary-item-text">{data?.marketingName}</div>
              </div>
              <div className="step-summary-item">
                <div className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.StartAndEndTime" />:
                </div>
                <div className="step-summary-item-text">
                  {data?.beginTime.slice(0, data?.beginTime.indexOf('.'))} - {data?.endTime.slice(0, data?.endTime.indexOf('.'))}
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
                  {enumConst.promotionType[data?.promotionType]}
                </div>
              </div>
              <div className="step-summary-item">
                <div className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.DoesItCummulate" />:
                </div>
                <div className="step-summary-item-text">
                  {data?.isSuperimposeSubscription === 0 ? 'NO' : 'YES'}
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
          {/* 右边 */}
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
                  {/* 暂时写死 */}
                  <FormattedMessage id="Order.PromotionCode" />
                  {/* {enumConst.typeOfPromotion[data?.promotionType]} */}
                </div>
              </div>
              <div className="step-summary-item">
                <div className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.CodesName" />:
                </div>
                <div className="step-summary-item-text">{data?.promotionCode}</div>
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
                  {enumConst.couponPromotionType[data?.marketingType]}
                </div>
              </div>
              {/* <div className="step-summary-item">
                <div className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.PromotionValue" />:
                </div>
                <div className="step-summary-item-text"> */}
              {getAdvantageValueList()}

              {/* {data?.fullReductionLevelList?.[0].reduction} */}
              {/* </div> */}
              {/* </div> */}
            </div>
          </div>
        </div>
        <div style={{ paddingLeft: '19.5%' }}>
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
                    Start date
                  </div>
                </div>
                <div className="step-summary-item" style={{ marginRight: '4rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '15px', marginRight: '1rem' }}>
                    <FormattedMessage id="Marketing.EndDate" />:
                  </div>
                  <div className="step-summary-item-text">End date</div>
                </div>
                <div className="step-summary-item" style={{ marginRight: '4rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '15px', marginRight: '1rem' }}>
                    <FormattedMessage id="Marketing.TotalPropmtionsCode" />:
                  </div>
                  <div className="step-summary-item-text">Total order with Promotions code</div>
                </div>
              </div>
            </div>
            {/* 图表 */}
            <div style={{ width: '80%', height: '300px', position: 'relative', marginTop: '20px' }}>
              <div className='redline' style={{ position: 'absolute', top: '0px', left: '40px' }}>
                <FormattedMessage id="Marketing.promotionsEchartsTitle" />
              </div>
              <BarLine
                yName={{ y1: (window as any).RCi18n({ id: 'Home.Prescriberreward' }) }}
                nameTextStyle={{ y1: [0, 0, 0, 42] }}
                data={{
                  x: [21, 22, 23, 24],
                  y1: [2, 5, 8, 15],
                }}
              />
            </div>
          </div>

        </div>

        {/* <ButtonLayer step={5} toNext={toNext} /> */}
      </div>
    </>
  );
};
export default MarketingDetails;
