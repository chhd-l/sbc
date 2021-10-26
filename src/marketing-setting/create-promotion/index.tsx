import React, { useState } from 'react';
import { Button, Steps } from 'antd';
import { BreadCrumb } from 'qmkit';
import './index.less'
import Step1 from './components/Step1'
import Step2 from '@/marketing-setting/create-promotion/components/Step2';
import Step3 from '@/marketing-setting/create-promotion/components/Step3';
import Step4 from '@/marketing-setting/create-promotion/components/Step4';
import Step5 from '@/marketing-setting/create-promotion/components/Step5';
import Step6 from '@/marketing-setting/create-promotion/components/Step6';
import { FormattedMessage } from 'react-intl';

const { Step } = Steps;
export const FormContext = React.createContext({});

export default function index() {
  const [step,setStep] = useState<number>(0)
  const [formData, setFormData] = useState<any>({});
  /**
   * 保存每一步的值
   * @param id
   * @param data
   */
  const changeFormData = (id, data) => {
    let obj = {}
    obj[id] = data;
    console.log({...formData,...obj})
    setFormData({...formData,...obj});
  };
  return (
    <FormContext.Provider
      value={{
        changeFormData: changeFormData,
        formData
      }}
    >
      <div className="create-promotion">
        <BreadCrumb/>
        <div className="container-search marketing-container" style={{flex:1,position:'relative'}}>
          <Steps current={step} className="step-container">
            <Step title="Create promotion" />
            <Step title={<FormattedMessage id="Marketing.BasicSetting" />} />
            <Step title={<FormattedMessage id="Marketing.PromotionType" />} />
            <Step title={<FormattedMessage id="Marketing.Conditions" />} />
            <Step title={<FormattedMessage id="Marketing.Advantage" />} />
            <Step title={<FormattedMessage id="Marketing.Summary" />} />
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
            <div style={{display: step === 4 ? 'block' : 'none'}}>
              <Step5 setStep={setStep}/>
            </div>
            <div style={{display: step === 5 ? 'block' : 'none'}}>
              <Step6 setStep={setStep}/>
            </div>
          </div>

        </div>
      </div>
    </FormContext.Provider>
  );
}