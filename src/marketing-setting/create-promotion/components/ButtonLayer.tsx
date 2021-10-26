import React, { useContext } from 'react';
import { Button } from 'antd';
import { FormContext } from '../index';
import { enumConst } from '../enum'
export default function ButtonLayer({setStep,step,validateFields,noForm=false}:any) {
  const { changeFormData } = useContext<any>(FormContext);
  const toNext = ()=>{
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