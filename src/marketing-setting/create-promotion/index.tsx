import React, { useEffect, useState } from 'react';
import { Button, Spin, Steps } from 'antd';
import moment from 'moment';
import { BreadCrumb } from 'qmkit';
import './index.less'
import Step1 from './components/Step1'
import Step2 from '@/marketing-setting/create-promotion/components/Step2';
import Step3 from '@/marketing-setting/create-promotion/components/Step3';
import Step4 from '@/marketing-setting/create-promotion/components/Step4';
import Step5 from '@/marketing-setting/create-promotion/components/Step5';
import Step6 from '@/marketing-setting/create-promotion/components/Step6';
import CreateSuccess from '@/marketing-setting/create-promotion/components/createSuccess';
import { FormattedMessage } from 'react-intl';
import * as webapi from '../webapi';


const { Step } = Steps;
export const FormContext = React.createContext({});
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
export default function index({...props}) {
  const InitFormData = {
    /**
     * 第二步
     */
    BasicSetting:{
      marketingName: '',
      time:[],
    },
    /**
     * 第三步
     */
    PromotionType:{
      typeOfPromotion: 0,//0:promotion 1: coupon
      publicStatus: 1,
      isNotLimit: 1,
      perCustomer:1,
    },
    /**
     * 第四步
     */
    Conditions:{
      promotionType:0,
      CartLimit:0,
      fullItem:'',
      fullMoney:'',
      isSuperimposeSubscription:1,
      joinLevel:0,
      segmentIds:[],
      emailSuffixList:[],
      attributeValueIds:[],
      scopeType:0,
      storeCateIds:[],
      customProductsType:0,
      skuIds:[],//custom product id集合
      selectedRows:[],//custom product 所有数据集合
    },

    /**
     * 第四步
     */
    Advantage:{
      couponPromotionType:0,
      denomination:'',
      couponDiscount:'',
      limitAmount:'',
      firstSubscriptionOrderReduction:'',
      restSubscriptionOrderReduction:'',
      firstSubscriptionOrderDiscount:'',
      firstSubscriptionLimitAmount:'',
      restSubscriptionOrderDiscount:'',
      restSubscriptionLimitAmount:'',
    },
  }

  const [step,setStep] = useState<number>(3)
  const [loading,setLoading] = useState<boolean>(true)
  const [formData, setFormData] = useState<any>(InitFormData) //编辑或创建时候的数组
  const [detail,setDetail] = useState<any>({})//创建完成过后保存当前优惠卷数据
  useEffect(()=>{
    if(props.match.params.id){
      getDetail()
      setStep(1)
    }else {
      setLoading(false)
    }
  },[])

  const initForm = ()=>{
    setFormData({...InitFormData})
  }
  /**
   * 通过subType判断CartLimit
   * SubType 0：满金额减 1：满数量减 2：满金额折 3：满数量折 4：满金额赠 5：满数量赠 6：Subscription减
   *         7：Subscription折 8：学生折扣 9：首单折 10：满金额免邮 11：满数量免邮 12：CONSUMPTION GIFT[club gift]
   *         13：WELCOME_BOX_GIFT
   * @param subType
   */
  const switchCartLimit = (subType)=>{
    switch (subType) {
      case 0:
        return 1;
      case 1:
        return 2;
      case 2:
        return 1;
      case 3:
        return 2;
      case 4:
        return 1;
      case 5:
        return 2;
      case 6:
        return 0;
      case 7:
        return 0;
      case 10:
        return 1;
      case 11:
        return 2;
    }
  }
  const switchFullMoney = (detail:any)=>{
    switch (detail.subType) {
      case 0:
        return detail.fullReductionLevelList?.[0]?.fullAmount;
      case 2:
        return detail.fullDiscountLevelList?.[0].fullAmount;
      case 4:
        return detail.fullGiftLevelList?.[0].fullAmount;
      case 10:
        return detail.marketingFreeShippingLevel?.fullAmount;
      default :
        return ''
    }
  }
  const switchFullItem = (detail:any)=>{
    switch (detail.subType) {
      case 1:
        return detail.fullReductionLevelList?.[0]?.fullCount;
      case 3:
        return detail.fullDiscountLevelList?.[0].fullCount;
      case 5:
        return detail.fullGiftLevelList?.[0].fullCount;
      case 11:
        return detail.marketingFreeShippingLevel?.fullCount;
      default :
        return ''
    }
  }
  const switchCouponPromotionType = (detail:any)=>{
    switch (detail.subType) {
      case 0:
        return 0;
      case 1:
        return 0;
      case 2:
        return 1;
      case 3:
        return 1;
      case 4:
        return 4;
      case 5:
        return 4;
      case 6:
        return 0;
      case 7:
        return 1;
      case 10:
        return 3;
      case 11:
        return 3;
    }
  }
  const switchScopeType = (ScopeType)=>{
    //coupon ScopeType  to Promotion ScopeType
    switch (ScopeType) {
      case 0:
        return 0;
      case 4:
        return 1;
      case 5:
        return 2;
      case 6:
        return 3;
    }
  }

  const getDetail = async ()=>{
    let result:any  = {}
    if(props.match.params.type == 'promotion'){
      result = await webapi.getMarketingInfo(props.match.params.id)
      let detail = result.res.context
      let giftIds = [] //gift product id 集合
      let customIds = [] //custom product id 集合
      let customRowList = [] //custom product 集合
      //当为gift时 去筛选custom和gift的product
      if(detail.subType === 4 || detail.subType === 5){
        detail?.fullGiftLevelList?.[0].fullGiftDetailList.forEach(item=>{
          giftIds.push(item.productId)
        })
        customIds = detail.goodsInfoIdList.filter(item=>{
          return !giftIds.includes(item)
        })
        customRowList = detail.goodsList?.goodsInfoPage?.content.filter(item=>{
          return customIds.includes(item.goodsInfoId)
        })
      }else {
        customIds = detail.goodsInfoIdList
        customRowList = detail.goodsList?.goodsInfoPage?.content
      }
      setFormData({
        /**
         * 第二步
         */
        BasicSetting:{
          marketingName: detail.marketingName,
          time:[moment(detail.beginTime),moment(detail.endTime)],
        },
        /**
         * 第三步
         */
        PromotionType:{
          typeOfPromotion: 0,
          promotionCode: detail.promotionCode,
          publicStatus: parseInt(detail.publicStatus),
          isNotLimit: detail?.marketingUseLimit?.isNotLimit,
          perCustomer: detail?.marketingUseLimit?.perCustomer,
        },
        /**
         * 第四步
         */
        Conditions:{
          promotionType: detail.promotionType,
          CartLimit: switchCartLimit(detail.subType),
          isSuperimposeSubscription: detail.isSuperimposeSubscription,
          fullMoney:switchFullMoney(detail),
          fullItem:switchFullItem(detail),
          joinLevel: detail.joinLevel == -1 ? 0 : parseInt(detail.joinLevel),
          segmentIds:detail.segmentIds || [],
          emailSuffixList:detail.emailSuffixList || [],
          scopeType: detail.scopeType,
          customProductsType:detail.customProductsType || 0 ,
          storeCateIds:ReStoreCateIds(detail.storeCateIds || []),
          attributeValueIds:ReStoreCateIds(detail.attributeValueIds || []),
          skuIds:customIds,//custom product id集合
          selectedRows: customRowList,//custom product 所有数据集合
        },
        /**
         * 第四步
         */
        Advantage:{
          couponPromotionType:switchCouponPromotionType(detail),
          denomination: (detail.subType === 0 || detail.subType === 1) ? detail.fullReductionLevelList?.[0]?.reduction : '',
          couponDiscount: (detail.subType === 2 || detail.subType === 3) ? (detail.fullDiscountLevelList?.[0].discount && detail.fullDiscountLevelList?.[0].discount*100) : '',
          limitAmount: (detail.subType === 2 || detail.subType === 3) ? detail.fullDiscountLevelList?.[0].limitAmount : '',
          firstSubscriptionOrderReduction:detail.subType === 6 ? detail.fullReductionLevelList[0].firstSubscriptionOrderReduction :'',
          restSubscriptionOrderReduction:detail.subType === 6 ? detail.fullReductionLevelList[0].restSubscriptionOrderReduction :'',
          firstSubscriptionLimitAmount:detail.subType === 7 ? detail.fullDiscountLevelList[0].firstSubscriptionLimitAmount :'',
          firstSubscriptionOrderDiscount:detail.subType === 7 ? detail.fullDiscountLevelList[0].firstSubscriptionOrderDiscount :'',
          restSubscriptionLimitAmount:detail.subType === 7 ? detail.fullDiscountLevelList[0].restSubscriptionLimitAmount :'',
          restSubscriptionOrderDiscount:detail.subType === 7 ? detail.fullDiscountLevelList[0].restSubscriptionOrderDiscount :'',
          fullGiftLevelList: (detail.subType === 4 || detail.subType === 5) ? detail.fullGiftLevelList : [],
          selectedGiftRows:detail.goodsList?.goodsInfoPage?.content.filter(item=>{
            return giftIds.includes(item.goodsInfoId)
          }),
        },
        /**
         * 类型
         */
        subType:detail.subType,
        storeId:detail.storeId,
      })
    }else {
      result = await webapi.fetchCouponInfo(props.match.params.id)
      let detail = result.res.context.couponInfo
      let goodsList = result.res.context.goodsList
      setFormData({
        /**
         * 第二步
         */
        BasicSetting:{
          marketingName: detail.couponName,
          time:[moment(detail.startTime),moment(detail.endTime)],
        },
        /**
         * 第三步
         */
        PromotionType:{
          typeOfPromotion: 1,
        },
        /**
         * 第四步
         */
        Conditions:{
          promotionType: detail.couponPurchaseType,
          CartLimit: detail.fullBuyType,
          isSuperimposeSubscription: detail.isSuperimposeSubscription,
          fullMoney: detail.fullBuyPrice,
          fullItem: detail.fullbuyCount,
          joinLevel: parseInt(detail.couponJoinLevel),
          segmentIds:detail.segmentIds || [],
          scopeType: switchScopeType(detail.scopeType),
          customProductsType:detail.customProductsType || 0 ,
          storeCateIds:ReStoreCateIds(detail.storeCateIds || []),
          attributeValueIds:ReStoreCateIds(detail.attributeValueIds || []),
          skuIds:detail.scopeIds,
          selectedRows:goodsList?.goodsInfoPage?.content,
        },
        /**
         * 第五步
         */
        Advantage:{
          couponPromotionType: detail.couponPromotionType,
          denomination: detail.denomination,
          couponDiscount: detail.couponDiscount || '',
          limitAmount: detail.limitAmount,
        },
        storeId:detail.storeId,
      })
    }
    setLoading(false)
  }
  /**
   * 回显StoreCateIds
   * @param storeCateIds
   */
  const ReStoreCateIds = (storeCateIds)=>{
    let array = []
    storeCateIds.forEach(item=>{
      array.push({value:item})
    })
    return array
  }
  /**
   * 保存每一步的值
   * @param id
   * @param data
   */
  const changeFormData = (id, data) => {
    formData[id]= {...data}
    console.log(formData[id])
    console.log(formData)
    setFormData({...formData});
  };
  return (
    <FormContext.Provider
      value={{
        formItemLayout,
        changeFormData: changeFormData,
        formData,
        setFormData:setFormData,
        setStep:setStep,
        initForm: initForm,
        match:props.match,
        setDetail:setDetail,
        detail,
      }}
    >
      <Spin spinning={loading}>
        <div className="create-promotion">
          <BreadCrumb/>
          <div className="container-search marketing-container" style={{flex:1,position:'relative',paddingBottom: 70}}>
            <Steps current={step} className="step-container">
              <Step title={<FormattedMessage id="Marketing.Create" />} />
              <Step title={<FormattedMessage id="Marketing.BasicSetting" />} />
              <Step title={<FormattedMessage id="Marketing.PromotionType" />} />
              <Step title={<FormattedMessage id="Marketing.Conditions" />} />
              <Step title={<FormattedMessage id="Marketing.Advantage" />} />
              <Step title={<FormattedMessage id="Marketing.Summary" />} />
            </Steps>

            <div style={{display: step === 0 ? 'block' : 'none'}}>
              <Step1/>
            </div>
            <div>
              {
                (step !== 6 && step !== 0 && !loading) && (
                  <>
                    <div style={{display: step === 1 ? 'block' : 'none'}}>
                      <Step2/>
                    </div>
                    <div style={{display: step === 2 ? 'block' : 'none'}}>
                      <Step3/>
                    </div>
                    <div style={{display: step === 3 ? 'block' : 'none'}}>
                      <Step4/>
                    </div>
                    <div style={{display: step === 4 ? 'block' : 'none'}}>
                      <Step5/>
                    </div>
                    <div style={{display: step === 5 ? 'block' : 'none'}}>
                      <Step6 setLoading={setLoading}/>
                    </div>
                  </>
                )
              }
              {
                step === 6 && <CreateSuccess/>
              }
            </div>

          </div>
        </div>
      </Spin>
    </FormContext.Provider>
  );
}