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
   *  JoinLevel : coupon: (0 - all   -3 - group)
   *              Promotion: (-1 - all   -3 - group  -4 - Byemail)
   *  ScopeType : coupon: (0 - all   4 - Custom  5 - Category  6 - Attribute)
   *              Promotion: (0 - all   1 - Custom  2 - Category  3 - Attribute)
   */
  const createPromotion = async ()=>{
    //当选择coupon type
    if(formData?.PromotionType?.typeOfPromotion === 1){
      await webapi.addCoupon({
        couponName: formData?.BasicSetting?.marketingName,//改版用到的字段
        couponType: "1",
        cateIds: [],
        storeCateIds: formData.Conditions.scopeType === 2 ? formData.Conditions.storeCateIds : [],//改版用到的字段
        couponJoinLevel: formData.Conditions.joinLevel,
        segmentIds:  formData.Conditions.joinLevel === 0 ? formData.Conditions.segmentIds : [],//改版用到的字段
        rangeDayType: 0,
        denomination: "11",
        fullBuyType: formData.Conditions.CartLimit,
        scopeType: formData.Conditions.scopeType,//改版用到的字段
        couponDesc: "",
        couponPromotionType: formData.Conditions.promotionType,//改版用到的字段
        couponDiscount: 0,
        attributeValueIds: formData.Conditions.scopeType === 3 ? formData.Conditions.attributeValueIds : null,//改版用到的字段
        couponPurchaseType: 0,
        isSuperimposeSubscription: formData.Conditions.isSuperimposeSubscription,//改版用到的字段
        limitAmount: null,
        customProductsType: formData.Conditions.scopeType === 1 ? formData.Conditions.customProductsType : 0,
        startTime: formData?.BasicSetting?.time[0]?.format('YYYY-MM-DD HH:mm:ss'),//改版用到的字段
        endTime: formData?.BasicSetting?.time[1]?.format('YYYY-MM-DD HH:mm:ss'),//改版用到的字段
        fullBuyPrice: formData.Conditions.CartLimit === 2 ? formData.Conditions.fullMoney : null,
        fullbuyCount: formData.Conditions.CartLimit === 1 ? formData.Conditions.fullMoney : null,
        scopeIds: formData.Conditions.scopeType === 1 ? formData.Conditions.scopeIds : []
      })
    }else {

    }
  }
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