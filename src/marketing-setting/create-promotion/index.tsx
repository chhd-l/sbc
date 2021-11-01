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

export default function index({...props}) {
  console.log(props)
  const [step,setStep] = useState<number>(0)
  const [loading,setLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<any>({
    PromotionType:{ publicStatus: 1,isNotLimit: 1,typeOfPromotion: 0, },
    Conditions:{
      promotionType:0,
      joinLevel:0,
      scopeType:0,
      CartLimit:0,

      isSuperimposeSubscription:1,
      segmentIds:[],
      storeCateIds:[],
    },
    Advantage:{},
  })
  const [detail,setDetail] = useState<any>({})//创建完成过后保存当前优惠卷数据

  useEffect(()=>{
    getDetail()
  },[])
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

  const getDetail = async ()=>{
    let result:any  = {}
    if(props.match.params.type == 'promotion'){
      result = await webapi.getMarketingInfo(props.match.params.id)
      let detail = result.res.context
      setFormData({
        PromotionType:{
          typeOfPromotion: 0,
          promotionCode: detail.promotionCode,
          publicStatus: parseInt(detail.publicStatus),
          isNotLimit: detail?.marketingUseLimit?.isNotLimit,
          perCustomer: detail?.marketingUseLimit?.perCustomer
        },
        Conditions:{
          promotionType: detail.promotionType,
          joinLevel: detail.joinLevel == -1 ? 0 : parseInt(detail.joinLevel),
          scopeType: detail.scopeType,
          CartLimit: switchCartLimit(detail.subType),

          isSuperimposeSubscription: detail.isSuperimposeSubscription,
          segmentIds:detail.segmentIds || [],
          storeCateIds:detail.storeCateIds || [],
          emailSuffixList:detail.emailSuffixList || [],
          customProductsType:detail.customProductsType,

          skuIds:detail.goodsInfoIdList,
          selectedRows:detail.goodsList?.goodsInfoPage?.content,
          attributeValueIds:detail.attributeValueIds,

          fullMoney:switchFullMoney(detail),
          fullItem:switchFullItem(detail),
        },
        Advantage:{
          couponPromotionType:switchCouponPromotionType(detail),
          denomination: (detail.subType === 0 || detail.subType === 1) ? detail.fullReductionLevelList?.[0]?.reduction : '',
          couponDiscount: (detail.subType === 2 || detail.subType === 3) ? detail.fullDiscountLevelList?.[0].discount : '',
          limitAmount: (detail.subType === 2 || detail.subType === 3) ? detail.fullDiscountLevelList?.[0].limitAmount : '',
          firstSubscriptionOrderReduction:detail.subType === 6 ? detail.fullReductionLevelList[0].firstSubscriptionOrderReduction :'',
          restSubscriptionOrderReduction:detail.subType === 6 ? detail.fullReductionLevelList[0].restSubscriptionOrderReduction :'',
          firstSubscriptionLimitAmount:detail.subType === 7 ? detail.fullDiscountLevelList[0].firstSubscriptionLimitAmount :'',
          firstSubscriptionOrderDiscount:detail.subType === 7 ? detail.fullDiscountLevelList[0].firstSubscriptionOrderDiscount :'',
          restSubscriptionLimitAmount:detail.subType === 7 ? detail.fullDiscountLevelList[0].restSubscriptionLimitAmount :'',
          restSubscriptionOrderDiscount:detail.subType === 7 ? detail.fullDiscountLevelList[0].restSubscriptionOrderDiscount :'',
          fullGiftLevelList: (detail.subType === 4 || detail.subType === 5) ? detail.fullGiftLevelList : {},
          selectedRows:detail.goodsList?.goodsInfoPage?.content,
        },
        BasicSetting: {
          marketingName: detail.marketingName,
          time:[moment(detail.beginTime),moment(detail.endTime)]
        },
        subType:detail.subType,
      })
    }
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
        changeFormData: changeFormData,
        formData,
        detail:detail,
        setDetail:setDetail
      }}
    >
      <Spin spinning={loading}>
        <div className="create-promotion">
          <BreadCrumb/>
          <div className="container-search marketing-container" style={{flex:1,position:'relative',paddingBottom: 70}}>
            <Steps current={step} className="step-container">
              <Step title="Create promotion" />
              <Step title={<FormattedMessage id="Marketing.BasicSetting" />} />
              <Step title={<FormattedMessage id="Marketing.PromotionType" />} />
              <Step title={<FormattedMessage id="Marketing.Conditions" />} />
              <Step title={<FormattedMessage id="Marketing.Advantage" />} />
              <Step title={<FormattedMessage id="Marketing.Summary" />} />
            </Steps>

            <div style={{display: step === 0 ? 'block' : 'none'}}>
              <Step1 setStep={setStep}/>
            </div>
            <div>
              {
                (step !== 6 && step !== 0) && (
                  <>
                    <div style={{display: step === 1 ? 'block' : 'none'}}>
                      <Step2 setStep={setStep}/>
                    </div>
                    <div style={{display: step === 2 ? 'block' : 'none'}}>
                      <Step3 setStep={setStep}/>
                    </div>
                    <div style={{display: step === 3 ? 'block' : 'none'}}>
                      <Step4 setStep={setStep} match={props.match}/>
                    </div>
                    <div style={{display: step === 4 ? 'block' : 'none'}}>
                      <Step5 setStep={setStep} match={props.match}/>
                    </div>
                  </>
                )
              }
              {
                step === 5 && <Step6 setStep={setStep} setLoading={setLoading} match={props.match}/>
              }
              {
                step === 6 && <CreateSuccess setStep={setStep}/>
              }
            </div>

          </div>
        </div>
      </Spin>
    </FormContext.Provider>
  );
}