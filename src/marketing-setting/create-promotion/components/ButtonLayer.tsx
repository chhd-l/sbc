import React, { useContext } from 'react';
import { Button } from 'antd';
import { FormContext } from '../index';
import { enumConst } from '../enum'
import * as webapi from '../../webapi';
export default function ButtonLayer({setStep,step,validateFields,noForm=false}:any) {
  const { changeFormData,formData } = useContext<any>(FormContext);
  const toNext = ()=>{
    if(step === 5){

    }else {
      validateFields((err, values) => {
        if (!err) {
          console.log(values)
          console.log(step)
          console.log(enumConst.stepEnum[step])
          changeFormData(enumConst.stepEnum[step],values)
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
  const createPromotion = async ()=>{
    //当选择coupon type
    if(formData?.PromotionType?.typeOfPromotion === 1){
      await webapi.addCoupon({
        couponName: formData?.BasicSetting?.marketingName,//改版用到的字段
        couponType: "1",
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
        fullBuyPrice: formData.Conditions.CartLimit === 2 ? formData.Conditions.fullMoney : null,
        fullbuyCount: formData.Conditions.CartLimit === 1 ? formData.Conditions.fullMoney : null,
        scopeIds: formData.Conditions.scopeType === 1 ? formData.Conditions.scopeIds : []
      })
    }else {
      if(formData.Advantage.couponPromotionType === 0){
        await webapi.addFullReduction({
          marketingType: 0,//满减金额时固定为0
          beginTime: formData?.BasicSetting?.time[0]?.format('YYYY-MM-DD HH:mm:ss'),
          endTime: formData?.BasicSetting?.time[1]?.format('YYYY-MM-DD HH:mm:ss'),
          fullReductionLevelList: [{
            key: makeRandom(),
            fullAmount: formData.Conditions.CartLimit === 2 ? formData.Advantage.fullItem : null,
            fullCount: formData.Conditions.CartLimit === 2 ? formData.Advantage.fullMoney : null,
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
          subType: formData.Conditions.CartLimit === 1 ? 0 : 1,
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
      if(formData.Advantage.couponPromotionType === 3){
        await webapi.addFreeShipping({
          marketingType: 3,//免运费时固定为3
          beginTime: formData?.BasicSetting?.time[0]?.format('YYYY-MM-DD HH:mm:ss'),
          endTime: formData?.BasicSetting?.time[1]?.format('YYYY-MM-DD HH:mm:ss'),
          fullReductionLevelList: [{
            fullAmount: formData.Conditions.CartLimit === 2 ? formData.Advantage.fullItem : null,
            fullCount: formData.Conditions.CartLimit === 2 ? formData.Advantage.fullMoney : null,
          }],
          isSuperimposeSubscription: formData.Conditions.isSuperimposeSubscription,
          joinLevel: formData.Conditions.joinLevel === 0 ? -1 : formData.Conditions.joinLevel,//coupon Promotion兼容处理
          marketingName: formData?.BasicSetting?.marketingName,
          marketingUseLimit: {perCustomer: formData.PromotionType.perCustomer, isNotLimit: formData.PromotionType.isNotLimit},
          promotionCode: formData.PromotionType.promotionCode,
          promotionType: formData.Conditions.promotionType,
          publicStatus: formData.PromotionType.publicStatus,
          scopeType: formData.Conditions.scopeType,
          subType: formData.Conditions.CartLimit === 1 ? 0 : 1,
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
        await webapi.addFullDiscount({
          marketingType: 1,//满折固定为3
          beginTime: formData?.BasicSetting?.time[0]?.format('YYYY-MM-DD HH:mm:ss'),
          endTime: formData?.BasicSetting?.time[1]?.format('YYYY-MM-DD HH:mm:ss'),
          fullDiscountLevelList: [{
            key: makeRandom(),
            fullAmount: formData.Conditions.CartLimit === 2 ? formData.Advantage.fullItem : null,
            fullCount: formData.Conditions.CartLimit === 2 ? formData.Advantage.fullMoney : null,
            discount: formData.Advantage.couponDiscount/100,
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
          subType: formData.Conditions.CartLimit === 1 ? 0 : 1,
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
      if(formData.Advantage.couponPromotionType === 4){
        await webapi.addFullDiscount({
          beginTime: "2021-10-27 02:52:00",
          customProductsType: 0,
          endTime: "2021-11-30 02:52:00",
          fullGiftLevelList: formData.Advantage.fullGiftLevelList,
          isClub: false,
          isSuperimposeSubscription: 1,
          joinLevel: -1,
          marketingName: "123",
          marketingType: 2,
          promotionCode: "dlio1tr85256337373",
          promotionType: 0,
          publicStatus: 1,
          scopeType: 0,
          subType: 5,
        })
      }
    }
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
        <Button size="large" onClick={()=>{setStep(0)}} style={{marginRight:20}}>Cancel</Button>
        <Button type="primary" size="large" onClick={toNext}>
          { step === 5 ? 'Create' : 'Next'}
        </Button>
      </div>
    </div>
  );
}