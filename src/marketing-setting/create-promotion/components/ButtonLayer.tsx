import React from 'react'
import { Button } from 'antd';
export default function ButtonLayer({setStep,step,validateFields}) {
  const toNext = ()=>{
    validateFields((err, values) => {
      if (!err) {
        console.log(values)
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