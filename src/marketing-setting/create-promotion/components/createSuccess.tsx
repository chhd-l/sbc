import React, { useContext } from 'react';
import { Button, Icon } from 'antd';
import { FormContext } from '@/marketing-setting/create-promotion';

export default function createSuccess({setStep}) {
  const { formData } = useContext<any>(FormContext);
  return (
    <div style={{textAlign:'center',margin:'30px 0'}}>
      <Icon type="notification" className="success-icon"/>
      <div className="success-title">
        {
          formData.PromotionType.typeOfPromotion === 0 ? 'Your Coupon template is created!' : 'Your promotion is created!'
        }
      </div>
      <div className="success-a">Export your promotion</div>
      {
        formData.PromotionType.typeOfPromotion === 1 && <div className="success-a">Generate coupon codes</div>
      }
      <Button type="primary" style={{margin:'30px 0'}} onClick={()=>setStep(0)}>create a new promotion</Button>
    </div>
  );
}