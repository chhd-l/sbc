import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import ButtonLayer from '@/marketing-setting/create-promotion/components/ButtonLayer';
import { FormContext } from '../index';
import { enumConst } from '../enum';
import { cache, Const } from 'qmkit';
import * as webapi from '@/marketing-setting/webapi';
import { message } from 'antd';

export default function Step6({ setLoading }) {
  const { formData, setStep, setDetail, match } = useContext<any>(FormContext);
  const toNext = () => {
    createPromotion();
  };
  /**
   *  此处应该要改版才对
   *  coupon和Promotion对应字段的不同
   *  JoinLevel : coupon: (0 - all   -3 - group) 暂用
   *              Promotion: (-1 - all   -3 - group  -4 - Byemail)
   *  ScopeType : coupon: (0 - all   4 - Custom  5 - Category  6 - Attribute)
   *              Promotion: (0 - all   1 - Custom  2 - Category  3 - Attribute) 暂用
   */
  const switchFile = (ScopeType) => {
    //Promotion ScopeType  to  coupon ScopeType
    switch (ScopeType) {
      case 0:
        return 0;
      case 1:
        return 4;
      case 2:
        return 5;
      case 3:
        return 6;
      default:
        return 0;
    }
  };
  /**
   * 取AttributeList的value集合
   * @param AttributeList
   */
  const getAttributeValue = (AttributeList) => {
    let array = [];
    AttributeList.forEach((item) => {
      array.push(item?.value);
    });
    return array;
  };
  /**
   * SubType 0：满金额减 1：满数量减 2：满金额折 3：满数量折 4：满金额赠 5：满数量赠 6：Subscription减
   *         7：Subscription折 8：学生折扣 9：首单折 10：满金额免邮 11：满数量免邮 12：CONSUMPTION GIFT[club gift]
   *         13：WELCOME_BOX_GIFT
   */
  const createPromotion = async () => {
    //当选择coupon type
    let detail = null;
    let subType = 0;
    setLoading(true);
    if (formData?.PromotionType?.typeOfPromotion === 1) {
      //当coupon 选择无门槛免邮时 变换成为 1件商品免邮
      if (formData.Advantage.couponPromotionType === 3 && formData.Conditions.CartLimit === 0) {
        formData.Conditions.fullItem = '1';
        formData.Conditions.CartLimit = 2;
      }
      let params = {
        /**
         * 第二步
         */
        couponName: formData.BasicSetting.marketingName, //改版用到的字段
        startTime: formData.BasicSetting.time[0]?.format('YYYY-MM-DD HH:mm:ss'), //改版用到的字段
        endTime: formData.BasicSetting.time[1]?.format('YYYY-MM-DD HH:mm:ss'), //改版用到的字段
        /**
         * 第三步
         */
        couponCodePrefix: formData.PromotionType.couponCodePrefix,
        /**
         * 第四步
         */
        couponPurchaseType: formData.Conditions.promotionType,
        fullBuyType: formData.Conditions.CartLimit,
        isSuperimposeSubscription: formData.Conditions.isSuperimposeSubscription, //改版用到的字段
        fullBuyPrice: formData.Conditions.CartLimit === 1 ? formData.Conditions.fullMoney : null,
        fullbuyCount: formData.Conditions.CartLimit === 2 ? formData.Conditions.fullItem : null,
        couponJoinLevel: formData.Conditions.joinLevel,
        segmentIds: formData.Conditions.joinLevel === -3 ? [formData.Conditions.segmentIds] : [], //改版用到的字段
        emailSuffixList:
          formData.Conditions.joinLevel === -4 ? [formData.Conditions.emailSuffixList] : [],

        scopeType: switchFile(formData.Conditions.scopeType), //改版用到的字段
        storeCateIds:
          formData.Conditions.scopeType === 2
            ? getAttributeValue(formData.Conditions.storeCateIds)
            : [], //改版用到的字段
        customProductsType:
          formData.Conditions.scopeType === 1 ? formData.Conditions.customProductsType : 0,
        customProductsIncludeType: formData.Conditions.scopeType === 1 ? formData.Conditions.customProductsIncludeType : 0,
        attributeValueIds:
          formData.Conditions.scopeType === 3
            ? getAttributeValue(formData.Conditions.attributeValueIds)
            : null, //改版用到的字段
        scopeIds: formData.Conditions.scopeType === 1 ? formData.Conditions.scopeIds : [],
        scopeNumber: formData.Conditions.scopeType === 1 ? formData.Conditions.scopeNumber : {},
        /**
         * 第五步
         */
        couponPromotionType:
          formData.Advantage.couponPromotionType === 4 ? 2 : formData.Advantage.couponPromotionType, //gift字段为2
        denomination:
          formData.Advantage.couponPromotionType === 0 ? formData.Advantage.denomination : null,
        couponDiscount:
          formData.Advantage.couponPromotionType === 1
            ? 1 - parseInt(formData.Advantage.couponDiscount) / 100
            : 0,
        appliesType: formData.Advantage.couponPromotionType === 1 ? formData.Advantage.appliesType : null,
        limitAmount:
          formData.Advantage.couponPromotionType === 1 ? formData.Advantage.limitAmount : null,
        fullGiftDetailList:
          formData.Advantage.couponPromotionType === 4
            ? formData.Advantage.fullGiftLevelList[0].fullGiftDetailList
            : [],
        /**
         * 未用到
         */
        couponType: '1',
        cateIds: [],
        rangeDayType: 0,
        couponDesc: ''
      };

      if (match.params.id && match.params.type === 'coupon') {
        detail = await webapi.editCoupon({
          ...params,
          couponId: match.params.id,
          storeId: formData.storeId
        });
      } else {
        if (match.params.type === 'promotion') {
          await webapi.deleteMarketing(match.params.id);
        }
        detail = await webapi.addCoupon(params);
      }
    } else {
      let commonParams = {
        BasicSetting: {
          marketingName: formData.BasicSetting.marketingName,
          beginTime: formData.BasicSetting.time[0]?.format('YYYY-MM-DD HH:mm:ss'),
          endTime: formData.BasicSetting.time[1]?.format('YYYY-MM-DD HH:mm:ss')
        },
        PromotionType: {
          marketingUseLimit: {
            perCustomer: formData.PromotionType.perCustomer,
            isNotLimit: formData.PromotionType.isNotLimit
          },
          promotionCode: formData.PromotionType.promotionCode,
          publicStatus: formData.PromotionType.publicStatus
        },
        Conditions: {
          promotionType: formData.Conditions.promotionType,
          isSuperimposeSubscription: formData.Conditions.isSuperimposeSubscription,
          joinLevel: formData.Conditions.joinLevel === 0 ? -1 : formData.Conditions.joinLevel, //coupon Promotion兼容处理
          scopeType: formData.Conditions.scopeType,
          segmentIds: formData.Conditions.joinLevel === -3 ? [formData.Conditions.segmentIds] : [],
          storeCateIds:
            formData.Conditions.scopeType === 2
              ? getAttributeValue(formData.Conditions.storeCateIds)
              : [],
          attributeValueIds:
            formData.Conditions.scopeType === 3
              ? getAttributeValue(formData.Conditions.attributeValueIds)
              : [],
          emailSuffixList:
            formData.Conditions.joinLevel === -4 ? [formData.Conditions.emailSuffixList] : [],
          customProductsType: formData.Conditions.customProductsType,
          customProductsIncludeType: formData.Conditions.customProductsIncludeType,
          skuIds: formData.Conditions.scopeType === 1 ? formData.Conditions.scopeIds : [],
          skuNumbers: formData.Conditions.scopeType === 1 ? formData.Conditions.scopeNumber : {}
        }
      };


      if (formData.Advantage.couponPromotionType === 0) {
        if (formData.Conditions.promotionType !== 1 && formData.Conditions.promotionType !== 2) {
          if (formData.Conditions.CartLimit === 1) {
            subType = 0;
          } else {
            subType = 1;
          }
        } else {
          subType = 6;
        }
        let params = {
          marketingType: 0, //满减金额时固定为0
          /**
           * 第二步
           */
          ...commonParams.BasicSetting,
          /**
           * 第三步
           */
          ...commonParams.PromotionType,
          /**
           * 第四步
           */
          ...commonParams.Conditions,

          fullReductionLevelList: [
            {
              key: makeRandom(),
              fullAmount:
                formData.Conditions.CartLimit === 1 ? formData.Conditions.fullMoney : null,
              fullCount:
                formData.Conditions.CartLimit === 2 || formData.Conditions.CartLimit === 0
                  ? formData.Conditions.fullItem || '1'
                  : null,
              reduction:
                formData.Advantage.couponPromotionType === 0
                  ? formData.Advantage.denomination
                  : null
            }
          ],
          /**
           * 第五步
           */
          marketingSubscriptionReduction: {
            fullAmount: formData.Conditions.CartLimit === 1 ? formData.Conditions.fullMoney : null,
            fullCount:
              formData.Conditions.CartLimit === 2 || formData.Conditions.CartLimit === 0
                ? formData.Conditions.fullItem || '1'
                : null,
            firstSubscriptionOrderReduction: formData.Advantage.firstSubscriptionOrderReduction,
            restSubscriptionOrderReduction: formData.Advantage.restSubscriptionOrderReduction
          }, //订阅打折
          firstSubscriptionOrderReduction: formData.Advantage.firstSubscriptionOrderReduction,
          restSubscriptionOrderReduction: formData.Advantage.restSubscriptionOrderReduction,
          /**
           * 其他
           */
          subType: subType,
          isClub: false //未用到
        };
        if (match.params.id && match.params.type === 'promotion') {
          detail = await webapi.updateFullReduction({
            ...params,
            marketingId: match.params.id,
            storeId: formData.storeId
          });
        } else {
          if (match.params.type === 'coupon') {
            await webapi.deleteCoupon(match.params.id);
          }
          detail = await webapi.addFullReduction(params);
        }
      }
      if (formData.Advantage.couponPromotionType === 3) {
        if (formData.Conditions.CartLimit === 1) {
          subType = 10;
        } else {
          subType = 11;
        }
        let params = {
          marketingType: 3, //免运费时固定为3
          /**
           * 第二步
           */
          ...commonParams.BasicSetting,
          /**
           * 第三步
           */
          ...commonParams.PromotionType,
          /**
           * 第四步
           */
          ...commonParams.Conditions,

          marketingFreeShippingLevel: {
            fullAmount: formData.Conditions.CartLimit === 1 ? formData.Conditions.fullMoney : null,
            fullCount:
              formData.Conditions.CartLimit === 2 || formData.Conditions.CartLimit === 0
                ? formData.Conditions.fullItem || '1'
                : null
          },
          /**
           * 第五步
           */
          subType: subType,

          marketingSubscriptionReduction: {}, //未知 有什么作用
          isClub: false //未用到
        };
        if (match.params.id && match.params.type === 'promotion') {
          detail = await webapi.updateFreeShipping({
            ...params,
            marketingId: match.params.id,
            storeId: formData.storeId
          });
        } else {
          if (match.params.type === 'coupon') {
            await webapi.deleteCoupon(match.params.id);
          }
          detail = await webapi.addFreeShipping(params);
        }
      }
      if (formData.Advantage.couponPromotionType === 1) {
        if (formData.Conditions.promotionType !== 1 && formData.Conditions.promotionType !== 2) {
          if (formData.Conditions.CartLimit === 1) {
            subType = 2;
          } else {
            subType = 3;
          }
        } else {
          subType = 7;
        }
        let params = {
          marketingType: 1, //满折固定为1
          /**
           * 第二步
           */
          ...commonParams.BasicSetting,
          /**
           * 第三步
           */
          ...commonParams.PromotionType,
          /**
           * 第四步
           */
          ...commonParams.Conditions,

          fullDiscountLevelList: [
            {
              key: makeRandom(),
              fullAmount:
                formData.Conditions.CartLimit === 1 ? formData.Conditions.fullMoney : null,
              fullCount:
                formData.Conditions.CartLimit === 2 || formData.Conditions.CartLimit === 0
                  ? formData.Conditions.fullItem || '1'
                  : null,
              discount: 1 - parseInt(formData.Advantage.couponDiscount) / 100,
              limitAmount: formData.Advantage.limitAmount
            }
          ],
          /**
           * 第五步
           */
          marketingSubscriptionDiscount: {
            fullAmount: formData.Conditions.CartLimit === 1 ? formData.Conditions.fullMoney : null,
            fullCount:
              formData.Conditions.CartLimit === 2 || formData.Conditions.CartLimit === 0
                ? formData.Conditions.fullItem || '1'
                : null,
            firstSubscriptionLimitAmount: formData.Advantage.firstSubscriptionLimitAmount,
            firstSubscriptionOrderDiscount:
              1 - parseInt(formData.Advantage.firstSubscriptionOrderDiscount) / 100,
            restSubscriptionLimitAmount: formData.Advantage.restSubscriptionLimitAmount,
            restSubscriptionOrderDiscount:
              1 - parseInt(formData.Advantage.restSubscriptionOrderDiscount) / 100
          },
          firstSubscriptionLimitAmount: formData.Advantage.firstSubscriptionLimitAmount,
          firstSubscriptionOrderDiscount: formData.Advantage.firstSubscriptionOrderDiscount,
          restSubscriptionLimitAmount: formData.Advantage.restSubscriptionLimitAmount,
          restSubscriptionOrderDiscount: formData.Advantage.restSubscriptionOrderDiscount,
          subType: subType,
          subscriptionRefillLimit: formData.Advantage.subscriptionRefillLimit,
          appliesType: formData.Advantage.appliesType,
          isClub: false //未用到
        };
        if (match.params.id && match.params.type === 'promotion') {
          detail = await webapi.updateFullDiscount({
            ...params,
            marketingId: match.params.id,
            storeId: formData.storeId
          });
        } else {
          if (match.params.type === 'coupon') {
            await webapi.deleteCoupon(match.params.id);
          }
          detail = await webapi.addFullDiscount(params);
        }
      }
      if (formData.Advantage.couponPromotionType === 4) {
        if (formData.Conditions.CartLimit === 1) {
          subType = 4;
        } else {
          subType = 5;
        }
        let fullGiftLevelList = [...formData.Advantage.fullGiftLevelList];
        if (formData.Conditions.CartLimit === 0) {
          fullGiftLevelList[0].fullCount = '1';
        }
        if (formData.Conditions.CartLimit === 1) {
          fullGiftLevelList[0].fullAmount = formData.Conditions.fullMoney;
        }
        if (formData.Conditions.CartLimit === 2) {
          fullGiftLevelList[0].fullCount = formData.Conditions.fullItem;
        }
        let params = {
          marketingType: 2, //送礼固定为2
          /**
           * 第二步
           */
          ...commonParams.BasicSetting,
          /**
           * 第三步
           */
          ...commonParams.PromotionType,
          /**
           * 第四步
           */
          ...commonParams.Conditions,
          /**
           * 其他
           */
          fullGiftLevelList: fullGiftLevelList,
          subType: subType,
          isClub: false
        };
        if (match.params.id && match.params.type === 'promotion') {
          detail = await webapi.updateFullGift({
            ...params,
            marketingId: match.params.id,
            storeId: formData.storeId
          });
        } else {
          if (match.params.type === 'coupon') {
            await webapi.deleteCoupon(match.params.id);
          }
          detail = await webapi.addFullGift(params);
        }
      }
      if (formData.Advantage.couponPromotionType === 5) {
        if (formData.Conditions.CartLimit === 1) {
          subType = 15;
        } else {
          subType = 14;
        }
        let fullLeafletLevelList = [...formData.Advantage.fullLeafletLevelList];
        if (formData.Conditions.CartLimit === 0) {
          fullLeafletLevelList[0].fullCount = '1';
        }
        if (formData.Conditions.CartLimit === 1) {
          fullLeafletLevelList[0].fullAmount = formData.Conditions.fullMoney;
        }
        if (formData.Conditions.CartLimit === 2) {
          fullLeafletLevelList[0].fullCount = formData.Conditions.fullItem;
        }
        fullLeafletLevelList[0]['fullLeafletDetailList'] =
          fullLeafletLevelList[0]['fullGiftDetailList'];
        let params = {
          marketingType: 4,
          /**
           * 第二步
           */
          ...commonParams.BasicSetting,
          /**
           * 第三步
           */
          ...commonParams.PromotionType,
          /**
           * 第四步
           */
          ...commonParams.Conditions,
          /**
           * 其他
           */
          fullLeafletLevelList: fullLeafletLevelList,
          subType: subType,
          isClub: false
        };
        if (match.params.id && match.params.type === 'promotion') {
          detail = await webapi.updateFullLeaflet({
            ...params,
            marketingId: match.params.id,
            storeId: formData.storeId
          });
        } else {
          if (match.params.type === 'coupon') {
            await webapi.deleteCoupon(match.params.id);
          }
          detail = await webapi.addFullLeaflet(params);
        }
      }
    }
    setLoading(false);
    if (detail.res && detail.res.code === Const.SUCCESS_CODE) {
      //把返回值保存下来
      if (formData?.PromotionType?.typeOfPromotion === 1) {
        setDetail(detail?.res?.context?.couponInfoVO);
      } else {
        setDetail(detail?.res?.context?.marketingVO);
      }
      message.success(
        (window as any).RCi18n({
          id: 'Marketing.OperateSuccessfully'
        })
      );
      setStep(6);
    } else if (detail.res && detail.res.code === 'K-080217') {
      message.error(
        (window as any).RCi18n({
          id: 'Marketing.PomotionCodehasexited'
        })
      );
    } else {
      message.error(detail.res.message);
    }
  };

  /**
   * 生成随机数，作为key值
   * @returns {string}
   */
  const makeRandom = () => {
    return 'key' + (Math.random() as any).toFixed(6) * 1000000;
  };
  return (
    <div>
      <div className="step-title">
        <FormattedMessage id="Marketing.Summary" />
      </div>
      <div className="step-summary">
        <div>
          <div>
            <div className="step-summary-title" onClick={() => setStep(1)}>
              <FormattedMessage id="Marketing.BasicSetting" />
            </div>
            <div className="step-summary-item">
              <div className="step-summary-sub-title">
                {/*  PromotionName */}
                <FormattedMessage id="Marketing.CampaignName" />:
              </div>
              <div className="step-summary-item-text">{formData.BasicSetting.marketingName}</div>
            </div>
            <div className="step-summary-item">
              <div className="step-summary-sub-title">
                <FormattedMessage id="Marketing.StartAndEndTime" />:
              </div>
              <div className="step-summary-item-text">
                {formData.BasicSetting.time?.[0]?.format('YYYY-MM-DD HH:mm')} -{' '}
                {formData.BasicSetting.time?.[1]?.format('YYYY-MM-DD HH:mm')}
              </div>
            </div>
          </div>

          <div>
            <div className="step-summary-title" onClick={() => setStep(3)}>
              <FormattedMessage id="Marketing.Conditions" />
            </div>
            <div className="step-summary-item">
              <div className="step-summary-sub-title">
                <FormattedMessage id="Marketing.TypeOfPurchase" />:
              </div>
              <div className="step-summary-item-text">
                {enumConst.promotionType[formData.Conditions.promotionType]}
              </div>
            </div>
            {formData.Conditions.promotionType !== 3 && (
              <div className="step-summary-item">
                <div className="step-summary-sub-title">
                  <FormattedMessage id="Marketing.DoesItCummulate" />:
                </div>
                <div className="step-summary-item-text">
                  {formData.Conditions.isSuperimposeSubscription === 0 ? 'No' : 'Yes'}
                </div>
              </div>
            )}

            <div className="step-summary-item">
              <div className="step-summary-sub-title">
                <FormattedMessage id="Marketing.GroupOfCustomer" />:
              </div>
              <div className="step-summary-item-text">
                {enumConst.joinLevel[formData.Conditions.joinLevel]}
              </div>
            </div>

            <div className="step-summary-item">
              <div className="step-summary-sub-title">
                <FormattedMessage id="Marketing.ProductsInTheCart" />:
              </div>
              <div className="step-summary-item-text">
                {enumConst.scopeType[formData.Conditions.scopeType]}
              </div>
            </div>

            <div className="step-summary-item">
              <div className="step-summary-sub-title">
                <FormattedMessage id="Marketing.CartLimit" />:
              </div>
              <div className="step-summary-item-text">
                {enumConst.CartLimit[formData.Conditions.CartLimit]}
                {formData.Conditions.CartLimit === 1 &&
                  '(' +
                  formData.Conditions.fullMoney +
                  sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) +
                  ')'}
                {formData.Conditions.CartLimit === 2 &&
                  `(${formData.Conditions.fullItem}${(window as any).RCi18n({
                    id: 'Marketing.items'
                  })})`}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div>
            <div className="step-summary-title" onClick={() => setStep(2)}>
              <FormattedMessage id="Marketing.PromotionType" />
            </div>
            <div className="step-summary-item">
              <div className="step-summary-sub-title">
                <FormattedMessage id="Marketing.TypeOfPromotion" />:
              </div>
              <div className="step-summary-item-text">
                {enumConst.typeOfPromotion[formData.PromotionType.typeOfPromotion]}
              </div>
            </div>
            {formData.PromotionType.typeOfPromotion === 0 && (
              <>
                <div className="step-summary-item">
                  <div className="step-summary-sub-title">
                    <FormattedMessage id="Marketing.CodesName" />:
                  </div>
                  <div className="step-summary-item-text">
                    {formData.PromotionType.promotionCode}
                  </div>
                </div>
                {formData.PromotionType.isNotLimit === 0 && (
                  <div className="step-summary-item">
                    <div className="step-summary-sub-title">
                      <FormattedMessage id="Marketing.NumberOfUse" />:
                    </div>
                    <div className="step-summary-item-text">
                      {formData.PromotionType.perCustomer}
                    </div>
                  </div>
                )}
              </>
            )}
            {formData.PromotionType.typeOfPromotion === 1 && (
              <>
                <div className="step-summary-item">
                  <div className="step-summary-sub-title">
                    <FormattedMessage id="Marketing.Prefix" />:
                  </div>
                  <div className="step-summary-item-text">
                    {formData.PromotionType.couponCodePrefix}
                  </div>
                </div>
              </>
            )}
          </div>

          <div>
            <div className="step-summary-title" onClick={() => setStep(4)}>
              <FormattedMessage id="Marketing.Advantage" />
            </div>
            <div className="step-summary-item">
              <div className="step-summary-sub-title">
                <FormattedMessage id="Marketing.AdvantageType" />:
              </div>
              <div className="step-summary-item-text">
                {enumConst.create_couponPromotionType[formData.Advantage.couponPromotionType]}
              </div>
            </div>

            {formData.PromotionType.typeOfPromotion === 0 &&
              (formData.Conditions.promotionType === 1 || formData.Conditions.promotionType === 2) ? (
              <>
                {formData.Advantage.couponPromotionType === 0 && (
                  <>
                    <div className="step-summary-item">
                      <div className="step-summary-sub-title">
                        <FormattedMessage id="Marketing.FirstSubRec" />:
                      </div>
                      <div className="step-summary-item-text">
                        {formData.Advantage.firstSubscriptionOrderReduction +
                          sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                      </div>
                    </div>
                    {formData.Advantage.restSubscriptionOrderReduction && (
                      <div className="step-summary-item">
                        <div className="step-summary-sub-title">
                          <FormattedMessage id="Marketing.RestSubRec" />:
                        </div>
                        <div className="step-summary-item-text">
                          {formData.Advantage.restSubscriptionOrderReduction +
                            sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                        </div>
                      </div>
                    )}
                  </>
                )}
                {formData.Advantage.couponPromotionType === 1 && (
                  <>
                    <div className="step-summary-item">
                      <div className="step-summary-sub-title">
                        <FormattedMessage id="Marketing.FirstSubscriptionOrderDiscount" />:
                      </div>
                      <div className="step-summary-item-text">
                        {formData.Advantage.firstSubscriptionOrderDiscount + '%'}
                      </div>
                    </div>
                    {formData.Advantage.firstSubscriptionLimitAmount && (
                      <div className="step-summary-item">
                        <div className="step-summary-sub-title">
                          <FormattedMessage id="Marketing.FirstSubscriptionLimitAmount" />:
                        </div>
                        <div className="step-summary-item-text">
                          {formData.Advantage.firstSubscriptionLimitAmount +
                            sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                        </div>
                      </div>
                    )}
                    {formData.Advantage.restSubscriptionOrderDiscount && (
                      <div className="step-summary-item">
                        <div className="step-summary-sub-title">
                          <FormattedMessage id="Marketing.RestSubscriptionOrderDiscount" />:
                        </div>
                        <div className="step-summary-item-text">
                          {formData.Advantage.restSubscriptionOrderDiscount + '%'}
                        </div>
                      </div>
                    )}
                    {formData.Advantage.restSubscriptionLimitAmount && (
                      <div className="step-summary-item">
                        <div className="step-summary-sub-title">
                          <FormattedMessage id="Marketing.RestSubscriptionLimitAmount" />:
                        </div>
                        <div className="step-summary-item-text">
                          {formData.Advantage.restSubscriptionLimitAmount +
                            sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                        </div>
                      </div>
                    )}

                    {formData.Advantage.appliesType !== null && formData.Advantage.appliesType !== undefined && (
                      <div className="step-summary-item">
                        <div className="step-summary-sub-title">
                          <FormattedMessage id="Marketing.appliesType" />:
                        </div>
                        <div className="step-summary-item-text">
                          {enumConst.appliesType[formData.Advantage.appliesType]}
                        </div>
                      </div>
                    )}
                    {formData.Advantage.subscriptionRefillLimit && (
                      <div className="step-summary-item">
                        <div className="step-summary-sub-title">
                          <FormattedMessage id="Marketing.subscriptionRefillLimit" />:
                        </div>
                        <div className="step-summary-item-text">
                          {formData.Advantage.subscriptionRefillLimit} <FormattedMessage id="Marketing.refills" />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                {formData.Advantage.couponPromotionType !== 4 &&
                  formData.Advantage.couponPromotionType !== 5 ? (
                  <div className="step-summary-item">
                    <div className="step-summary-sub-title">
                      {formData.PromotionType.typeOfPromotion === 1 ? (
                        <FormattedMessage id="Marketing.CouponValue" />
                      ) : (
                        <FormattedMessage id="Marketing.PromotionValue" />
                      )}
                      :
                    </div>
                    <div className="step-summary-item-text">
                      {formData.Advantage.couponPromotionType === 0 &&
                        formData.Advantage.denomination +
                        sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                      {formData.Advantage.couponPromotionType === 1 &&
                        formData.Advantage.couponDiscount + '%'}
                      {formData.Advantage.couponPromotionType === 3 &&
                        formData.Conditions.fullItem &&
                        `${formData.Conditions.fullItem}${(window as any).RCi18n({
                          id: 'Marketing.items'
                        })}`}
                      {formData.Advantage.couponPromotionType === 3 &&
                        formData.Conditions.CartLimit === 0 &&
                        `1${(window as any).RCi18n({ id: 'Marketing.items' })}`}
                      {formData.Advantage.couponPromotionType === 3 &&
                        formData.Conditions.fullMoney &&
                        formData.Conditions.fullMoney +
                        sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                    </div>
                  </div>
                ) : null}
                {formData.Advantage.couponPromotionType === 1 && (
                  <div className="step-summary-item">
                    <div className="step-summary-sub-title">
                      <FormattedMessage id="Marketing.DiscountLimit" />:
                    </div>
                    <div className="step-summary-item-text">
                      {formData.Advantage.limitAmount}
                      {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                    </div>
                  </div>
                )}
                {formData.Advantage.couponPromotionType === 1 && (
                  <div className="step-summary-item">
                    <div className="step-summary-sub-title">
                      <FormattedMessage id="Marketing.appliesType" />:
                    </div>
                    <div className="step-summary-item-text">
                      {enumConst.appliesType[formData.Advantage.appliesType]}
                    </div>
                  </div>
                )}
              </>
            )}
            {formData.Advantage.couponPromotionType === 4 ||
              formData.Advantage.couponPromotionType === 5 ? (
              <div className="step-summary-item">
                <div className="step-summary-sub-title">
                  {formData.PromotionType.typeOfPromotion === 1 ? (
                    <FormattedMessage id="Marketing.CouponValue" />
                  ) : (
                    <FormattedMessage id="Marketing.PromotionValue" />
                  )}
                  :
                </div>
                <div className="step-summary-item-text">
                  <>
                    {(
                      (formData.Advantage.couponPromotionType === 4
                        ? formData.Advantage.selectedGiftRows
                        : formData.Advantage.selectedLeafletRows) || []
                    ).map((item) => (
                      <span style={{ paddingRight: 6 }}>{item.goodsInfoName}</span>
                    ))}
                  </>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <ButtonLayer step={5} toNext={toNext} />
    </div>
  );
}
