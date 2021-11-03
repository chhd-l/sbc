import React, { useContext } from 'react';
import { Button } from 'antd';
import { FormContext } from '../index';
export default function ButtonLayer({ step,toNext, }:any) {
  const { initForm,match,setStep } = useContext<any>(FormContext);
  const btnText = ()=>{
    if(step === 5){
      if(match.params.id){
        return 'Save'
      }else {
        return 'Create'
      }
    }else {
      return 'Next'
    }
  }

  return (
    <div className="button-layer">
      <Button size="large" onClick={()=>{setStep(step - 1)}}>Back</Button>
      <div>
        <Button size="large" onClick={()=>{
          initForm()
          setStep(0)
        }} style={{marginRight:20}}>Cancel</Button>
        <Button type="primary" size="large" onClick={()=>toNext()}>
          { btnText() }
        </Button>
      </div>
    </div>
  );
}