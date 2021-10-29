import React, { useContext } from 'react';
import { Button } from 'antd';
import { FormContext } from '../index';
import { enumConst } from '../enum'
import * as webapi from '../../webapi';
export default function ButtonLayer({setStep,step,validateFields,setLoading,
                                      publicStatus,isNotLimit,
                                      isSuperimposeSubscription,scopeIds,
                                      fullGiftLevelList,
  }:any) {
  const { changeFormData,formData,setDetail } = useContext<any>(FormContext);
  const toNext = ()=>{
    if(step === 5){
      createPromotion()
    }else {
      validateFields((err, values) => {
        if (!err) {
          console.log(values)
          console.log(step)
          console.log(enumConst.stepEnum[step])
          let obj = {...values}
          switch (step) {
            case 2:
              obj = {...obj,publicStatus: publicStatus ? 1 : 0,isNotLimit:isNotLimit ? 0 : 1}
              break;
            case 3:
              obj = {...obj,isSuperimposeSubscription:isSuperimposeSubscription  ? 0 : 1,scopeIds}
              break;
            case 4:
              obj = {...obj,fullGiftLevelList}
              break;
          }
          console.log(obj)
          changeFormData(enumConst.stepEnum[step],obj)
          setStep(step + 1)
        }
      });
    }
  }
  /**
   *  此处应该要改版才对
   *  coupon和Promotion对应字段的不同
   *  JoinLevel : coupon: (0 - all   -3 - group) 暂用
   *              Promotion: (-1 - all   -3 - group  -4 - Byemail)
   *  ScopeType : coupon: (0 - all   4 - Custom  5 - Category  6 - Attribute)
   *              Promotion: (0 - all   1 - Custom  2 - Category  3 - Attribute) 暂用
   */
  const switchFile = (ScopeType)=>{
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
    }
  }
  /**
   * 取AttributeList的value集合
   * @param AttributeList
   */
  const getAttributeValue = (AttributeList)=>{
    let array = []
    AttributeList.forEach(item=>{
      array.push(item?.value)
    })
    return array
  }
  /**
   * SubType 0：满金额减 1：满数量减 2：满金额折 3：满数量折 4：满金额赠 5：满数量赠 6：Subscription减
   *         7：Subscription折 8：学生折扣 9：首单折 10：满金额免邮 11：满数量免邮 12：CONSUMPTION GIFT[club gift]
   *         13：WELCOME_BOX_GIFT
   */
  const createPromotion = async ()=>{
    //当选择coupon type
    let detail = null
    let subType = 0
    setLoading(true)
    if(formData?.PromotionType?.typeOfPromotion === 1){
      detail = await webapi.addCoupon({
        couponName: formData?.BasicSetting?.marketingName,//改版用到的字段
        couponType: '1',
        cateIds: [],
        storeCateIds: formData.Conditions.scopeType === 2 ? formData.Conditions.storeCateIds : [],//改版用到的字段
        couponJoinLevel: formData.Conditions.joinLevel,
        segmentIds:  formData.Conditions.joinLevel === -3 ? formData.Conditions.segmentIds : [],//改版用到的字段
        rangeDayType: 0,
        denomination: formData.Advantage.couponPromotionType === 0 ? formData.Advantage.denomination : null,
        fullBuyType: formData.Conditions.CartLimit,
        scopeType: switchFile(formData.Conditions.scopeType),//改版用到的字段
        couponDesc: "",
        couponPromotionType: formData.Advantage.couponPromotionType,//改版用到的字段
        couponDiscount: formData.Advantage.couponPromotionType === 1 ? formData.Advantage.couponDiscount : 0,
        attributeValueIds: formData.Conditions.scopeType === 3 ? getAttributeValue(formData.Conditions.attributeValueIds) : null,//改版用到的字段
        couponPurchaseType: formData.Conditions.promotionType,
        isSuperimposeSubscription: formData.Conditions.isSuperimposeSubscription,//改版用到的字段
        limitAmount: formData.Advantage.couponPromotionType === 1 ? formData.Advantage.limitAmount : null,
        customProductsType: formData.Conditions.scopeType === 1 ? formData.Conditions.customProductsType : 0,
        startTime: formData?.BasicSetting?.time[0]?.format('YYYY-MM-DD HH:mm:ss'),//改版用到的字段
        endTime: formData?.BasicSetting?.time[1]?.format('YYYY-MM-DD HH:mm:ss'),//改版用到的字段
        fullBuyPrice: formData.Conditions.CartLimit === 1 ? formData.Conditions.fullMoney : null,
        fullbuyCount: formData.Conditions.CartLimit === 2 ? formData.Conditions.fullItem : null,
        scopeIds: formData.Conditions.scopeType === 1 ? formData.Conditions.scopeIds : []
      })
    }else {
      if(formData.Advantage.couponPromotionType === 0){
        if(formData.Conditions.promotionType !== 1 && formData.Conditions.promotionType !== 2){
          if(formData.Conditions.CartLimit === 1){
            subType = 0
          }else {
            subType = 1
          }
        }else {
          subType = 6
        }
        detail = await webapi.addFullReduction({
          marketingType: 0,//满减金额时固定为0
          beginTime: formData?.BasicSetting?.time[0]?.format('YYYY-MM-DD HH:mm:ss'),
          endTime: formData?.BasicSetting?.time[1]?.format('YYYY-MM-DD HH:mm:ss'),
          fullReductionLevelList: [{
            key: makeRandom(),
            fullAmount: formData.Conditions.promotionType !== 1 && formData.Conditions.promotionType !== 2 && formData.Conditions.CartLimit === 1 ? formData.Conditions.fullMoney : null,
            fullCount: formData.Conditions.promotionType !== 1 && formData.Conditions.promotionType !== 2 && (formData.Conditions.CartLimit === 2 || formData.Conditions.CartLimit === 0) ? formData.Conditions.fullItem || 1 : null,
            reduction: formData.Advantage.couponPromotionType === 0 ? formData.Advantage.denomination : null,
          }],
          isSuperimposeSubscription: formData.Conditions.isSuperimposeSubscription,
          joinLevel: formData.Conditions.joinLevel === 0 ? -1 : formData.Conditions.joinLevel,//coupon Promotion兼容处理
          marketingName: formData?.BasicSetting?.marketingName,
          marketingUseLimit: {perCustomer: formData.PromotionType.perCustomer, isNotLimit: formData.PromotionType.isNotLimit},
          promotionCode: formData.PromotionType.promotionCode,
          promotionType: formData.Conditions.promotionType,
          publicStatus: formData.PromotionType.publicStatus,
          scopeType: formData.Conditions.scopeType,
          subType: subType,
          segmentIds: formData.Conditions.joinLevel === -3 ? formData.Conditions.segmentIds : [],
          storeCateIds: formData.Conditions.scopeType === 2 ? formData.Conditions.storeCateIds : [],

          attributeValueIds: formData.Conditions.scopeType === 3 ? getAttributeValue(formData.Conditions.attributeValueIds) : [],
          emailSuffixList: formData.Conditions.joinLevel === -4 ? [formData.Conditions.emailSuffixList] : [],
          customProductsType: formData.Conditions.customProductsType,
          skuIds: formData.Conditions.scopeType === 1 ? formData.Conditions.scopeIds : [],

          marketingSubscriptionReduction: {
            firstSubscriptionOrderReduction:formData.Advantage.firstSubscriptionOrderReduction,
            restSubscriptionOrderReduction:formData.Advantage.restSubscriptionOrderReduction,
          },//订阅打折
          firstSubscriptionOrderReduction:formData.Advantage.firstSubscriptionOrderReduction,
          restSubscriptionOrderReduction:formData.Advantage.restSubscriptionOrderReduction,
          isClub: false,//未用到
        })
        setDetail(detail.res.context.couponInfoVO)
      }
      if(formData.Advantage.couponPromotionType === 3){
        if(formData.Conditions.CartLimit === 1){
          subType = 10
        }else {
          subType = 11
        }
        detail = await webapi.addFreeShipping({
          marketingType: 3,//免运费时固定为3
          beginTime: formData?.BasicSetting?.time[0]?.format('YYYY-MM-DD HH:mm:ss'),
          endTime: formData?.BasicSetting?.time[1]?.format('YYYY-MM-DD HH:mm:ss'),
          fullReductionLevelList: [{
            fullAmount: formData.Conditions.CartLimit === 1 ? formData.Conditions.fullMoney : null,
            fullCount: (formData.Conditions.CartLimit === 2 || formData.Conditions.CartLimit === 0) ? formData.Conditions.fullItem || 1 : null,
          }],
          isSuperimposeSubscription: formData.Conditions.isSuperimposeSubscription,
          joinLevel: formData.Conditions.joinLevel === 0 ? -1 : formData.Conditions.joinLevel,//coupon Promotion兼容处理
          marketingName: formData?.BasicSetting?.marketingName,
          marketingUseLimit: {perCustomer: formData.PromotionType.perCustomer, isNotLimit: formData.PromotionType.isNotLimit},
          promotionCode: formData.PromotionType.promotionCode,
          promotionType: formData.Conditions.promotionType,
          publicStatus: formData.PromotionType.publicStatus,
          scopeType: formData.Conditions.scopeType,
          subType: subType,
          segmentIds: formData.Conditions.joinLevel === -3 ? formData.Conditions.segmentIds : [],
          storeCateIds: formData.Conditions.scopeType === 2 ? formData.Conditions.storeCateIds : [],

          attributeValueIds: formData.Conditions.scopeType === 3 ? getAttributeValue(formData.Conditions.attributeValueIds) : [],
          emailSuffixList: formData.Conditions.joinLevel === -4 ? [formData.Conditions.emailSuffixList] : [],
          customProductsType: formData.Conditions.customProductsType,
          skuIds: formData.Conditions.scopeType === 1 ? formData.Conditions.scopeIds : [],

          marketingSubscriptionReduction: {},//未知 有什么作用

          isClub: false,//未用到
        })
      }
      if(formData.Advantage.couponPromotionType === 1){
        if(formData.Conditions.promotionType !== 1 && formData.Conditions.promotionType !== 2){
          if(formData.Conditions.CartLimit === 1){
            subType = 2
          }else {
            subType = 3
          }
        }else {
          subType = 7
        }
        detail = await webapi.addFullDiscount({
          marketingType: 1,//满折固定为3
          beginTime: formData?.BasicSetting?.time[0]?.format('YYYY-MM-DD HH:mm:ss'),
          endTime: formData?.BasicSetting?.time[1]?.format('YYYY-MM-DD HH:mm:ss'),
          fullDiscountLevelList: [{
            key: makeRandom(),
            fullAmount:  formData.Conditions.promotionType !== 1 && formData.Conditions.promotionType !== 2 && formData.Conditions.CartLimit === 1 ? formData.Conditions.fullMoney : null,
            fullCount:  formData.Conditions.promotionType !== 1 && formData.Conditions.promotionType !== 2 && (formData.Conditions.CartLimit === 2 || formData.Conditions.CartLimit === 0) ? formData.Conditions.fullItem || 1 : null,
            discount: parseInt(formData.Advantage.couponDiscount)/100,
            limitAmount:formData.Advantage.limitAmount,
          }],
          isSuperimposeSubscription: formData.Conditions.isSuperimposeSubscription,
          joinLevel: formData.Conditions.joinLevel === 0 ? -1 : formData.Conditions.joinLevel,//coupon Promotion兼容处理
          marketingName: formData?.BasicSetting?.marketingName,
          marketingUseLimit: {perCustomer: formData.PromotionType.perCustomer, isNotLimit: formData.PromotionType.isNotLimit},
          promotionCode: formData.PromotionType.promotionCode,
          promotionType: formData.Conditions.promotionType,
          publicStatus: formData.PromotionType.publicStatus,
          scopeType: formData.Conditions.scopeType,
          subType: subType,
          segmentIds: formData.Conditions.joinLevel === -3 ? formData.Conditions.segmentIds : [],
          storeCateIds: formData.Conditions.scopeType === 2 ? formData.Conditions.storeCateIds : [],

          attributeValueIds: formData.Conditions.scopeType === 3 ? getAttributeValue(formData.Conditions.attributeValueIds) : [],
          emailSuffixList: formData.Conditions.joinLevel === -4 ? [formData.Conditions.emailSuffixList] : [],
          customProductsType: formData.Conditions.customProductsType,
          skuIds: formData.Conditions.scopeType === 1 ? formData.Conditions.scopeIds : [],

          marketingSubscriptionDiscount: {
            firstSubscriptionLimitAmount: formData.Advantage.firstSubscriptionLimitAmount,
            firstSubscriptionOrderDiscount: parseInt(formData.Advantage.firstSubscriptionOrderDiscount)/100 ,
            restSubscriptionLimitAmount: formData.Advantage.restSubscriptionLimitAmount,
            restSubscriptionOrderDiscount: parseInt(formData.Advantage.restSubscriptionOrderDiscount)/100,
          },

          isClub: false,//未用到
        })
      }
      if(formData.Advantage.couponPromotionType === 4){
        if(formData.Conditions.CartLimit === 1){
          subType = 4
        }else {
          subType = 5
        }
        let fullGiftLevelList = [...formData.Advantage.fullGiftLevelList]
        if(formData.Conditions.CartLimit === 0){
          fullGiftLevelList[0].fullCount = '1'
        }
        if(formData.Conditions.CartLimit === 1){
          fullGiftLevelList[0].fullAmount = formData.Conditions.fullMoney
        }
        if(formData.Conditions.CartLimit === 2){
          fullGiftLevelList[0].fullCount = formData.Conditions.fullItem
        }
        detail = await webapi.addFullGift({
          marketingType: 2,//送礼固定为2
          fullGiftLevelList: fullGiftLevelList,
          attributeValueIds: formData.Conditions.scopeType === 3 ? getAttributeValue(formData.Conditions.attributeValueIds) : [],
          beginTime: formData?.BasicSetting?.time[0]?.format('YYYY-MM-DD HH:mm:ss'),
          endTime: formData?.BasicSetting?.time[1]?.format('YYYY-MM-DD HH:mm:ss'),
          marketingName: formData?.BasicSetting?.marketingName,
          emailSuffixList: formData.Conditions.joinLevel === -4 ? [formData.Conditions.emailSuffixList] : [],
          isSuperimposeSubscription: formData.Conditions.isSuperimposeSubscription,
          joinLevel: formData.Conditions.joinLevel === 0 ? -1 : formData.Conditions.joinLevel,//coupon Promotion兼容处理
          promotionCode: formData.PromotionType.promotionCode,
          promotionType: formData.Conditions.promotionType,
          publicStatus: formData.PromotionType.publicStatus,
          customProductsType: formData.Conditions.customProductsType,
          scopeType: formData.Conditions.scopeType,
          segmentIds: formData.Conditions.joinLevel === -3 ? formData.Conditions.segmentIds : [],
          storeCateIds: formData.Conditions.scopeType === 2 ? formData.Conditions.storeCateIds : [],
          subType: subType,
          skuIds: formData.Conditions.scopeType === 1 ? formData.Conditions.scopeIds : [],


          isClub: false,

        })
      }
      setDetail(detail.res.context.marketingVO)
    }
    console.log(detail)
    setLoading(false)
    setStep(step + 1)
  }

  /**
   * 生成随机数，作为key值
   * @returns {string}
   */
  const makeRandom = () => {
    return 'key' + (Math.random() as any).toFixed(6) * 1000000;
  };


  return (
    <div className="button-layer">
      <Button size="large" onClick={()=>{setStep(step - 1)}}>Back</Button>
      <div>
        <Button size="large" onClick={()=>{
            setStep(0)
        }} style={{marginRight:20}}>Cancel</Button>
        <Button type="primary" size="large" onClick={toNext}>
          { step === 5 ? 'Create' : 'Next'}
        </Button>
      </div>
    </div>
  );
}