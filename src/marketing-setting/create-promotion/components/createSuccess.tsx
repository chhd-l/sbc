import React, { useContext, useState } from 'react';
import { Button, Icon, message } from 'antd';
import { FormContext } from '@/marketing-setting/create-promotion';
import { Const, util } from 'qmkit';
import CouponModal from '@/coupon-list/components/couponModal';

export default function createSuccess({setStep}) {
  const { formData,detail } = useContext<any>(FormContext);
  const [isModalVisible,setIsModalVisible] = useState<boolean>(false)
  const downloadPromotion = async () => {
    const base64 = new util.Base64();
    const token = (window as any).token;
    if (token) {
      const result = JSON.stringify({
        marketingId:detail.marketingId,
        token
      });
      const encrypted = base64.urlEncode(result);
      const exportHref = Const.HOST + `/marketing/marketing-used-record/export/${encrypted}`;
      window.open(exportHref);
    }
    message.success('download successful');
  };
  // const couponExport = async () => {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       const base64 = new util.Base64();
  //       const token = (window as any).token;
  //       if (token) {
  //         const result = JSON.stringify({
  //           couponId: detail.couponId,
  //           token: token
  //         });
  //         const encrypted = base64.urlEncode(result);
  //         const exportHref = Const.HOST + `/coupon-info/coupon-code/export/${encrypted}`;
  //         window.open(exportHref);
  //       } else {
  //         message.error('请登录');
  //       }
  //       resolve();
  //     }, 500);
  //   });
  // };
  return (
    <div style={{textAlign:'center',margin:'30px 0'}}>
      <Icon type="notification" className="success-icon"/>
      <div className="success-title">
        {
          formData.PromotionType.typeOfPromotion === 1 ? 'Your Coupon template is created!' : 'Your promotion is created!'
        }
      </div>
      {
        formData.PromotionType.typeOfPromotion === 0 && <div className="success-a" onClick={downloadPromotion}>Export your promotion</div>
      }
      {
        formData.PromotionType.typeOfPromotion === 1 && (
          <>
            {/*<div className="success-a" onClick={couponExport}>Export your coupon</div>*/}
            <div className="success-a" onClick={()=>setIsModalVisible(true)}>Generate coupon codes</div>
          </>

        )
      }
      <Button type="primary" style={{margin:'30px 0'}} onClick={()=>setStep(0)}>create a new promotion</Button>
      <CouponModal
        isModalVisible={isModalVisible}
        setVisible={()=>setIsModalVisible(false)}
        couponId={detail.couponId}/>
    </div>
  );
}