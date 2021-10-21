import React, { useState } from 'react';
import { Button, Steps } from 'antd';
import { BreadCrumb } from 'qmkit';
import './index.less'
import Step1 from './components/Step1'
import Step2 from '@/marketing-setting/create-promotion/components/Step2';
import Step3 from '@/marketing-setting/create-promotion/components/Step3';
import Step4 from '@/marketing-setting/create-promotion/components/Step4';
import { FormattedMessage } from 'react-intl';

const { Step } = Steps;

export default function index() {
  const [step,setStep] = useState<number>(3)

  return (
    <div className="create-promotion">
      <BreadCrumb/>
      <div className="container-search marketing-container" style={{flex:1,position:'relative'}}>
        <Steps current={step} className="step-container">
          <Step title="Create promotion" />
          <Step title={<FormattedMessage id="Marketing.BasicSetting" />} />
          <Step title={<FormattedMessage id="Marketing.PromotionType" />} />
          <Step title={<FormattedMessage id="Marketing.Conditions" />} />
          <Step title="Advantage" />
          <Step title="Summary" />
        </Steps>

        <div>
          <div style={{display: step === 0 ? 'block' : 'none'}}>
            <Step1 setStep={setStep}/>
          </div>
          <div style={{display: step === 1 ? 'block' : 'none'}}>
            <Step2 setStep={setStep}/>
          </div>
          <div style={{display: step === 2 ? 'block' : 'none'}}>
            <Step3 setStep={setStep}/>
          </div>
          <div style={{display: step === 3 ? 'block' : 'none'}}>
            <Step4 setStep={setStep}/>
          </div>
        </div>

      </div>
    </div>

  );
}