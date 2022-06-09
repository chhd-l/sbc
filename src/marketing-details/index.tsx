import React, { useState } from 'react';
import { Breadcrumb, Col, Row, Spin } from 'antd';
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
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const { marketingId } = useParams();
  const { data } = useRequest(async () => {
    const {
      res: { context }
    } = await fetchMarketingInfo(marketingId);
    if (context) {
      setLoading(false)
    } else {
      let ti = setTimeout(() => {
        setLoading(false)
        clearTimeout(ti)
      }, 1000);
    }
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
      case 4:
        list = fullLeafletLevelList;
        break;
      case 5:
        list = fullLeafletLevelList;
        break;
    }
    if (!list) return null;
    const level = list[0];
    const isAmount = Boolean(level.fullAmount) ? 1 : 2;
    return (
      <Col className="step-summary-item-text">
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
      </Col>
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
      case 4:
        list = fullLeafletLevelList;
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
          return <Row className="step-summary-item">
            <Col className="step-summary-sub-title">
              <FormattedMessage id="Marketing.PromotionValue" />:
            </Col>
            <Col className="step-summary-item-text">
              {level?.reduction}{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
            </Col>
          </Row>
          break;
        //Percentage 显示value和discount两行
        case 1:
          return <>
            <Row className="step-summary-item">
              <Col className="step-summary-sub-title">
                <FormattedMessage id="Marketing.PromotionValue" />:
              </Col>
              <Col className="step-summary-item-text">
                {level?.discount ? ((1 - level?.discount) * 100).toFixed(0) + '%' : null}
              </Col>
            </Row>
            <Row className="step-summary-item">
              <Col className="step-summary-sub-title">
                <FormattedMessage id="Marketing.DiscountLimit" />:
              </Col>
              <Col className="step-summary-item-text">
                {level?.limitAmount}
                {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
              </Col>
            </Row>
          </>
          break;
        case 3:
          return <Row className="step-summary-item">
            <Col className="step-summary-sub-title">
              <FormattedMessage id="Marketing.PromotionValue" />:
            </Col>
            <Col className="step-summary-item-text">
              {level?.fullCount}{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
            </Col>
          </Row>
          break;
        case 2:
          return <Row className="step-summary-item">
            <Col className="step-summary-sub-title">
              <FormattedMessage id="Marketing.PromotionValue" />:
            </Col>
            <Col className="step-summary-item-text">
              {level?.fullGiftDetailList.map((item) => (item?.productName ? item?.productName + ' ' : null))}
            </Col>
          </Row>
          break;
        case 4:
          return <Row className="step-summary-item">
            <Col className="step-summary-sub-title">
              <FormattedMessage id="Marketing.PromotionValue" />:
            </Col>
            <Col className="step-summary-item-text">
              {level?.fullLeafletDetailList.map((item) => (item?.productName ? item?.productName + ' ' : null))}
            </Col>
          </Row>
          break;
        case 5:
          return <Row className="step-summary-item">
            <Col className="step-summary-sub-title">
              <FormattedMessage id="Marketing.PromotionValue" />:
            </Col>
            <Col className="step-summary-item-text">
              {level?.fullLeafletDetailList.map((item) => (item?.productName ? item?.productName + ' ' : null))}
            </Col>
          </Row>
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
            <Row className="step-summary-item">
              <Col className="step-summary-sub-title">
                <FormattedMessage id="Marketing.FirstSubscriptionOrderDiscount" />:
              </Col>
              <Col className="step-summary-item-text">
                {level.firstSubscriptionOrderDiscount ? ((1 - level.firstSubscriptionOrderDiscount) * 100).toFixed(0) + '%' : null}
              </Col>
            </Row>
            {level.firstSubscriptionLimitAmount && (
              <Row className="step-summary-item">
                <Col className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.FirstSubscriptionLimitAmount" />:
                </Col>
                <Col className="step-summary-item-text">
                  {level.firstSubscriptionLimitAmount +
                    sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                </Col>
              </Row>
            )}

          </>
          break;
        case 1:
          return <>
            <Row className="step-summary-item">
              <Col className="step-summary-sub-title">
                <FormattedMessage id="Marketing.FirstSubscriptionOrderDiscount" />:
              </Col>
              <Col className="step-summary-item-text">
                {level.firstSubscriptionOrderDiscount ? ((1 - level.firstSubscriptionOrderDiscount) * 100).toFixed(0) + '%' : null}
              </Col>
            </Row>
            {level.firstSubscriptionLimitAmount && (
              <Row className="step-summary-item">
                <Col className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.FirstSubscriptionLimitAmount" />:
                </Col>
                <Col className="step-summary-item-text">
                  {level.firstSubscriptionLimitAmount +
                    sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                </Col>
              </Row>
            )}
            {level.restSubscriptionOrderDiscount && (
              <Row className="step-summary-item">
                <Col className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.RestSubscriptionOrderDiscount" />:
                </Col>
                <Col className="step-summary-item-text">
                  {level.restSubscriptionOrderDiscount ? ((1 - level.restSubscriptionOrderDiscount) * 100).toFixed(0) + '%' : null}
                </Col>
              </Row>
            )}
            {level.restSubscriptionLimitAmount && (
              <Row className="step-summary-item">
                <Col className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.RestSubscriptionLimitAmount" />:
                </Col>
                <Col className="step-summary-item-text">
                  {level.restSubscriptionLimitAmount +
                    sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                </Col>
              </Row>
            )}
          </>
          break;
        case 3:
          return <Row className="step-summary-item">
            <Col className="step-summary-sub-title">
              <FormattedMessage id="Marketing.PromotionValue" />:
            </Col>
            <Col className="step-summary-item-text">
              {level?.fullCount}{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
            </Col>
          </Row>
          break;
        case 2:
          return <Row className="step-summary-item">
            <Col className="step-summary-sub-title">
              <FormattedMessage id="Marketing.PromotionValue" />:
            </Col>
            <Col className="step-summary-item-text">
              {level?.fullGiftDetailList.map((item) => (item?.productName ? item?.productName + ' ' : null))}
            </Col>
          </Row>
          break;
        case 4:
          return <Row className="step-summary-item">
            <Col className="step-summary-sub-title">
              <FormattedMessage id="Marketing.PromotionValue" />:
            </Col>
            <Col className="step-summary-item-text">
              {level?.fullLeafletDetailList.map((item) => (item?.productName ? item?.productName + ' ' : null))}
            </Col>
          </Row>
          break;
        case 5:
          return <Row className="step-summary-item">
            <Col className="step-summary-sub-title">
              <FormattedMessage id="Marketing.PromotionValue" />:
            </Col>
            <Col className="step-summary-item-text">
              {level?.fullLeafletDetailList.map((item) => (item?.productName ? item?.productName + ' ' : null))}
            </Col>
          </Row>
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

      <Spin spinning={loading} >
        <div className="container  marketing-details">
          <div className="step-title">
            <FormattedMessage id="Marketing.PromotionDetails" />
          </div>
          <div style={{ display: 'flex', paddingLeft: '10%' }}>
            {/* 左边 */}
            <div style={{ marginRight: '150px', flexShrink: 0 }}>
              <div>
                <div className="step-summary-title">
                  <FormattedMessage id="Marketing.BasicSetting" />
                </div>
                <Row className="step-summary-item">
                  <Col className="step-summary-sub-title">
                    <FormattedMessage id="Marketing.PromotionName" />:
                  </Col>
                  <Col className="step-summary-item-text">{data?.marketingName}</Col>
                </Row>
                <Row className="step-summary-item">
                  <Col className="step-summary-sub-title">
                    <FormattedMessage id="Marketing.StartAndEndTime" />:
                  </Col>
                  <Col className="step-summary-item-text">
                    {data?.beginTime.slice(0, data?.beginTime.indexOf('.'))} - {data?.endTime.slice(0, data?.endTime.indexOf('.'))}
                  </Col>
                </Row>
                <Row className="step-summary-item">
                  <Col className="step-summary-sub-title">
                    <FormattedMessage id="Marketing.CreateBy" />:
                  </Col>
                  <Col className="step-summary-item-text">
                    {data?.createName}
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
                    {enumConst.promotionType[data?.promotionType]}
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
                  <Col className="step-summary-item-text">{enumConst.joinLevel[data?.joinLevel]}</Col>
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
                    {/* 暂时写死 */}
                    <FormattedMessage id="Order.PromotionCode" />
                    {/* {enumConst.typeOfPromotion[data?.promotionType]} */}
                  </Col>
                </Row>
                <Row className="step-summary-item">
                  <Col className="step-summary-sub-title">
                    <FormattedMessage id="Marketing.CodesName" />:
                  </Col>
                  <Col className="step-summary-item-text">{data?.promotionCode}</Col>
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
                    {enumConst.couponPromotionType[data?.marketingType]}
                  </Col>
                </Row>
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
                      {data?.beginTime.split(' ')[0]}
                    </div>
                  </div>
                  <div className="step-summary-item" style={{ marginRight: '4rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '15px', marginRight: '1rem' }}>
                      <FormattedMessage id="Marketing.EndDate" />:
                    </div>
                    <div className="step-summary-item-text">{data?.endTime.split(' ')[0]}</div>
                  </div>
                  <div className="step-summary-item" style={{ marginRight: '4rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '15px', marginRight: '1rem' }}>
                      <FormattedMessage id="Marketing.TotalPropmtionsCode" />:
                    </div>
                    <div className="step-summary-item-text">{total}</div>
                  </div>
                </div>
              </div>
              {/* 图表 */}
              <div style={{ width: '80%', height: '300px', position: 'relative', marginTop: '20px' }}>
                <div className='redline' style={{ position: 'absolute', top: '0px', left: '40px' }}>
                  <FormattedMessage id="Marketing.promotionsEchartsTitle" />
                </div>
                {data?.beginTime && data?.endTime && (
                  <BarLine
                    yName={{ y1: (window as any).RCi18n({ id: 'Home.Prescriberreward' }) }}
                    nameTextStyle={{ y1: [0, 0, 0, 42] }}
                    data={{
                      x: [21, 22, 23, 24],
                      y1: [2, 5, 8, 15],
                    }}
                    pageType={'promotion'}
                    cid={marketingId}
                    startDate={data?.beginTime.split(' ')[0]}
                    endDate={data?.endTime.split(' ')[0]}
                    setTotal={setTotal}
                  />
                )}

              </div>
            </div>

          </div>

          {/* <ButtonLayer step={5} toNext={toNext} /> */}
        </div>
      </Spin>
    </>
  );
};
export default MarketingDetails;
