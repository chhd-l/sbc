import React, { useContext } from 'react';
import { Button } from 'antd';
import { FormContext } from '../index';
import { RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';

export default function ButtonLayer({ step,toNext, }:any) {
  const { initForm,match,setStep } = useContext<any>(FormContext);
  const btnText = ()=>{
    if(step === 5){
      if(match.params.id){
        return RCi18n({id:'Marketing.Save'})
      }else {
        return RCi18n({id:'Marketing.Create'})
      }
    }else {
      return RCi18n({id:'Setting.Next'})
    }
  }

  return (
    <div className="button-layer">
      <Button size="large" onClick={()=>{setStep(step - 1)}}><FormattedMessage id="Marketing.back"/></Button>
      <div>
        <Button size="large" onClick={()=>{
          initForm()
          setStep(0)
        }} style={{marginRight:20}}><FormattedMessage id="Marketing.Cancel"/></Button>
        <Button type="primary" size="large" onClick={()=>toNext()}>
          { btnText() }
        </Button>
      </div>
    </div>
  );
}