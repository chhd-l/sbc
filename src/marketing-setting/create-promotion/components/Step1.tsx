import React, { useContext,memo } from 'react';
import { Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import { FormContext } from '@/marketing-setting/create-promotion';
function Step1() {
  const Context:any = useContext(FormContext);
  const { setStep } = Context
  return (
    <div className="step1">
      <div className="step-title"><FormattedMessage id="Marketing.CreateANewPromotion" /></div>
      <div className="step-subtitle"><FormattedMessage id="Marketing.ToCreateMarketingActivityConsumers" /></div>
      <Button type="primary"
              shape="round"
              size="large"
              style={{marginTop:100,fontSize:22}}
              onClick={()=>{setStep(1)}}
      ><FormattedMessage id="Marketing.start" /></Button>
    </div>
  );
}
export default memo(Step1)