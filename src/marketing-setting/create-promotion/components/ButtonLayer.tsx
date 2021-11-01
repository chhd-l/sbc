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
  const { changeFormData,formData,setDetail,cancelOperate,match,setFormData } = useContext<any>(FormContext);
  const toNext = ()=>{
    if(step === 5){
      createPromotion()
    }else {
      validateFields((err, values) => {
        if (!err) {
          let obj = {...values}
          switch (step) {
            case 2:
              obj = {...obj,publicStatus: publicStatus ? 1 : 0,isNotLimit:isNotLimit ? 0 : 1}
              break;
            case 3:
              obj = {...obj,isSuperimposeSubscription:isSuperimposeSubscription ? 0 : 1}
              if(formData.PromotionType.typeOfPromotion === 1 && formData.Conditions.CartLimit === 2){
                formData.Advantage.couponPromotionType = 3
                setFormData({...formData})
              }
              break;
            case 4:
              obj = {...obj,fullGiftLevelList,scopeIds}
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
        storeCateIds: formData.Advantage.scopeType === 2 ? getAttributeValue(formData.Advantage.storeCateIds) : [],//改版用到的字段
        couponJoinLevel: formData.Advantage.joinLevel,
        segmentIds:  formData.Advantage.joinLevel === -3 ? [formData.Advantage.segmentIds] : [],//改版用到的字段
        rangeDayType: 0,
        denomination: formData.Advantage.couponPromotionType === 0 ? formData.Advantage.denomination : null,
        fullBuyType: formData.Conditions.CartLimit,
        scopeType: switchFile(formData.Advantage.scopeType),//改版用到的字段
        couponDesc: "",
        couponPromotionType: formData.Advantage.couponPromotionType,//改版用到的字段
        couponDiscount: formData.Advantage.couponPromotionType === 1 ? formData.Advantage.couponDiscount : 0,
        attributeValueIds: formData.Advantage.scopeType === 3 ? getAttributeValue(formData.Advantage.attributeValueIds) : null,//改版用到的字段
        couponPurchaseType: formData.Conditions.promotionType,
        isSuperimposeSubscription: formData.Conditions.isSuperimposeSubscription,//改版用到的字段
        limitAmount: formData.Advantage.couponPromotionType === 1 ? formData.Advantage.limitAmount : null,
        customProductsType: formData.Advantage.scopeType === 1 ? formData.Advantage.customProductsType : 0,
        startTime: formData?.BasicSetting?.time[0]?.format('YYYY-MM-DD HH:mm:ss'),//改版用到的字段
        endTime: formData?.BasicSetting?.time[1]?.format('YYYY-MM-DD HH:mm:ss'),//改版用到的字段
        fullBuyPrice: formData.Conditions.CartLimit === 1 ? formData.Conditions.fullMoney : null,
        fullbuyCount: formData.Conditions.CartLimit === 2 ? formData.Conditions.fullItem : null,
        scopeIds: formData.Advantage.scopeType === 1 ? formData.Conditions.scopeIds : []
      })
      setDetail(detail.res.context.couponInfoVO)
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
        let params = {
          marketingType: 0,//满减金额时固定为0
          beginTime: formData?.BasicSetting?.time[0]?.format('YYYY-MM-DD HH:mm:ss'),
          endTime: formData?.BasicSetting?.time[1]?.format('YYYY-MM-DD HH:mm:ss'),
          fullReductionLevelList: [{
            key: makeRandom(),
            fullAmount: formData.Conditions.promotionType !== 1 && formData.Conditions.promotionType !== 2 && formData.Conditions.CartLimit === 1 ? formData.Conditions.fullMoney : null,
            fullCount: formData.Conditions.promotionType !== 1 && formData.Conditions.promotionType !== 2 && (formData.Conditions.CartLimit === 2 || formData.Conditions.CartLimit === 0) ? formData.Conditions.fullItem || '1' : null,
            reduction: formData.Advantage.couponPromotionType === 0 ? formData.Advantage.denomination : null,
          }],
          isSuperimposeSubscription: formData.Conditions.isSuperimposeSubscription,
          joinLevel: formData.Advantage.joinLevel === 0 ? -1 : formData.Advantage.joinLevel,//coupon Promotion兼容处理
          marketingName: formData?.BasicSetting?.marketingName,
          marketingUseLimit: {perCustomer: formData.PromotionType.perCustomer, isNotLimit: formData.PromotionType.isNotLimit},
          promotionCode: formData.PromotionType.promotionCode,
          promotionType: formData.Conditions.promotionType,
          publicStatus: formData.PromotionType.publicStatus,
          scopeType: formData.Advantage.scopeType,
          subType: subType,
          segmentIds: formData.Advantage.joinLevel === -3 ? [formData.Advantage.segmentIds] : [],
          storeCateIds: formData.Advantage.scopeType === 2 ? getAttributeValue(formData.Advantage.storeCateIds) : [],

          attributeValueIds: formData.Advantage.scopeType === 3 ? getAttributeValue(formData.Advantage.attributeValueIds) : [],
          emailSuffixList: formData.Advantage.joinLevel === -4 ? [formData.Advantage.emailSuffixList] : [],
          customProductsType: formData.Advantage.customProductsType,
          skuIds: formData.Advantage.scopeType === 1 ? formData.Advantage.scopeIds : [],

          marketingSubscriptionReduction: {
            firstSubscriptionOrderReduction:formData.Advantage.firstSubscriptionOrderReduction,
            restSubscriptionOrderReduction:formData.Advantage.restSubscriptionOrderReduction,
          },//订阅打折
          firstSubscriptionOrderReduction:formData.Advantage.firstSubscriptionOrderReduction,
          restSubscriptionOrderReduction:formData.Advantage.restSubscriptionOrderReduction,
          isClub: false,//未用到
        }
        if(match.params.id){
          detail = await webapi.updateFullReduction({...params,marketingId:match.params.id})
        }else {
          detail = await webapi.addFullReduction(params)
        }
      }
      if(formData.Advantage.couponPromotionType === 3){
        if(formData.Conditions.CartLimit === 1){
          subType = 10
        }else {
          subType = 11
        }
        let params = {
          marketingType: 3,//免运费时固定为3
          beginTime: formData?.BasicSetting?.time[0]?.format('YYYY-MM-DD HH:mm:ss'),
          endTime: formData?.BasicSetting?.time[1]?.format('YYYY-MM-DD HH:mm:ss'),
          marketingFreeShippingLevel: {
            fullAmount: formData.Conditions.CartLimit === 1 ? formData.Conditions.fullMoney : null,
            fullCount: (formData.Conditions.CartLimit === 2 || formData.Conditions.CartLimit === 0) ? formData.Conditions.fullItem || '1' : null,
          },
          isSuperimposeSubscription: formData.Conditions.isSuperimposeSubscription,
          joinLevel: formData.Advantage.joinLevel === 0 ? -1 : formData.Advantage.joinLevel,//coupon Promotion兼容处理
          marketingName: formData?.BasicSetting?.marketingName,
          marketingUseLimit: {perCustomer: formData.PromotionType.perCustomer, isNotLimit: formData.PromotionType.isNotLimit},
          promotionCode: formData.PromotionType.promotionCode,
          promotionType: formData.Conditions.promotionType,
          publicStatus: formData.PromotionType.publicStatus,
          scopeType: formData.Advantage.scopeType,
          subType: subType,
          segmentIds: formData.Advantage.joinLevel === -3 ? [formData.Advantage.segmentIds] : [],
          storeCateIds: formData.Advantage.scopeType === 2 ? getAttributeValue(formData.Advantage.storeCateIds) : [],

          attributeValueIds: formData.Advantage.scopeType === 3 ? getAttributeValue(formData.Advantage.attributeValueIds) : [],
          emailSuffixList: formData.Advantage.joinLevel === -4 ? [formData.Advantage.emailSuffixList] : [],
          customProductsType: formData.Advantage.customProductsType,
          skuIds: formData.Advantage.scopeType === 1 ? formData.Advantage.scopeIds : [],

          marketingSubscriptionReduction: {},//未知 有什么作用

          isClub: false,//未用到
        }
        if(match.params.id){
          detail =  await webapi.updateFreeShipping({...params,marketingId:match.params.id})
        }else {
          detail = await webapi.addFreeShipping(params)
        }

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
        let params = {
          marketingType: 1,//满折固定为3
          beginTime: formData?.BasicSetting?.time[0]?.format('YYYY-MM-DD HH:mm:ss'),
          endTime: formData?.BasicSetting?.time[1]?.format('YYYY-MM-DD HH:mm:ss'),
          fullDiscountLevelList: [{
            key: makeRandom(),
            fullAmount:  formData.Conditions.promotionType !== 1 && formData.Conditions.promotionType !== 2 && formData.Conditions.CartLimit === 1 ? formData.Conditions.fullMoney : null,
            fullCount:  formData.Conditions.promotionType !== 1 && formData.Conditions.promotionType !== 2 && (formData.Conditions.CartLimit === 2 || formData.Conditions.CartLimit === 0) ? formData.Conditions.fullItem || '1' : null,
            discount: parseInt(formData.Advantage.couponDiscount)/100,
            limitAmount:formData.Advantage.limitAmount,
          }],
          isSuperimposeSubscription: formData.Conditions.isSuperimposeSubscription,
          joinLevel: formData.Advantage.joinLevel === 0 ? -1 : formData.Advantage.joinLevel,//coupon Promotion兼容处理
          marketingName: formData?.BasicSetting?.marketingName,
          marketingUseLimit: {perCustomer: formData.PromotionType.perCustomer, isNotLimit: formData.PromotionType.isNotLimit},
          promotionCode: formData.PromotionType.promotionCode,
          promotionType: formData.Conditions.promotionType,
          publicStatus: formData.PromotionType.publicStatus,
          scopeType: formData.Advantage.scopeType,
          subType: subType,
          segmentIds: formData.Advantage.joinLevel === -3 ? [formData.Advantage.segmentIds] : [],
          storeCateIds: formData.Advantage.scopeType === 2 ? getAttributeValue(formData.Advantage.storeCateIds) : [],

          attributeValueIds: formData.Advantage.scopeType === 3 ? getAttributeValue(formData.Advantage.attributeValueIds) : [],
          emailSuffixList: formData.Advantage.joinLevel === -4 ? [formData.Advantage.emailSuffixList] : [],
          customProductsType: formData.Advantage.customProductsType,
          skuIds: formData.Advantage.scopeType === 1 ? formData.Conditions.scopeIds : [],

          marketingSubscriptionDiscount: {
            firstSubscriptionLimitAmount: formData.Advantage.firstSubscriptionLimitAmount,
            firstSubscriptionOrderDiscount: parseInt(formData.Advantage.firstSubscriptionOrderDiscount)/100 ,
            restSubscriptionLimitAmount: formData.Advantage.restSubscriptionLimitAmount,
            restSubscriptionOrderDiscount: parseInt(formData.Advantage.restSubscriptionOrderDiscount)/100,
          },

          isClub: false,//未用到
        }
        if(match.params.id){
          detail = await webapi.updateFullDiscount({...params,marketingId:match.params.id})
        }else {
          detail = await webapi.addFullDiscount(params)
        }
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
        let params =  {
          marketingType: 2,//送礼固定为2
          fullGiftLevelList: fullGiftLevelList,
          attributeValueIds: formData.Advantage.scopeType === 3 ? getAttributeValue(formData.Advantage.attributeValueIds) : [],
          beginTime: formData?.BasicSetting?.time[0]?.format('YYYY-MM-DD HH:mm:ss'),
          endTime: formData?.BasicSetting?.time[1]?.format('YYYY-MM-DD HH:mm:ss'),
          marketingName: formData?.BasicSetting?.marketingName,
          emailSuffixList: formData.Advantage.joinLevel === -4 ? [formData.Advantage.emailSuffixList] : [],
          isSuperimposeSubscription: formData.Conditions.isSuperimposeSubscription,
          joinLevel: formData.Advantage.joinLevel === 0 ? -1 : formData.Advantage.joinLevel,//coupon Promotion兼容处理
          promotionCode: formData.PromotionType.promotionCode,
          promotionType: formData.Conditions.promotionType,
          publicStatus: formData.PromotionType.publicStatus,
          customProductsType: formData.Advantage.customProductsType,
          scopeType: formData.Advantage.scopeType,
          segmentIds: formData.Advantage.joinLevel === -3 ? [formData.Advantage.segmentIds] : [],
          storeCateIds: formData.Advantage.scopeType === 2 ? getAttributeValue(formData.Advantage.storeCateIds) : [],
          subType: subType,
          skuIds: formData.Advantage.scopeType === 1 ? formData.Conditions.scopeIds : [],

          marketingUseLimit: {perCustomer: formData.PromotionType.perCustomer, isNotLimit: formData.PromotionType.isNotLimit},
          isClub: false,
        }
        if(match.params.id){
          detail = await webapi.updateFullGift({...params,marketingId:match.params.id})
        }else {
          detail = await webapi.addFullGift(params)
        }
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

  const btnText = ()=>{
    if(step === 5){
      if(match.params.id){
        return 'Save'
      }else {
        return 'Create'
      }
    }else {
      return 'Next'
    }
  }

  return (
    <div className="button-layer">
      <Button size="large" onClick={()=>{setStep(step - 1)}}>Back</Button>
      <div>
        <Button size="large" onClick={()=>cancelOperate()} style={{marginRight:20}}>Cancel</Button>
        <Button type="primary" size="large" onClick={toNext}>
          { btnText() }
        </Button>
      </div>
    </div>
  );
}