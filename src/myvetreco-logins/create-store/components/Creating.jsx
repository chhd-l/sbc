import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useInterval } from 'ahooks';
import { util, RCi18n, history } from 'qmkit';
import {finishCreateStore, queryStatus} from "../webapi";
import { Icon, message } from 'antd';


const STATUS = {
  CONTRACT_AGREEMENT:0,
  LEGAL_INFO:1,
  STORE_DETAIL:2,
  PRICE_SETTING:3,
  PAYMENT_INFO:4,
  SETTING_INIT:5,
}
export default function Creating({userInfo,setStep}) {
  let [statusList,setStatusList] = useState([
    {title:'Contract Agreement', message: null, result: 'pending'},
    {title:'Legal Info', message: null, result: 'pending'},
    {title:'Store Details', message: null, result: 'pending'},
    {title:'Price Setting', message: null, result: 'pending'},
    {title:'Payment Info', message: null, result: 'pending'},
  ])
  let [count, setCount] = useState(0);
  let [loadingText, setLoadingText] = useState('Create');
  let [isPending, setIsPending] = useState(false);//是否有步骤在pending状态
  let [classText, setClassText] = useState('');
  let [errorIndex, setErrorIndex] = useState(9);
  const [interval, setInterval] = useState(null);
  const [requestInterval, setRequestInterval] = useState(6000);

  const list = statusList.map((item,index) => ({ name: <FormattedMessage id={`Login.create_store_step${index+1}`}/>, top: -((index+1) * 31), result:item.result }));


  useInterval(() => {
    if (count < (errorIndex*-32) || count < -160) {
      if(errorIndex == 9){
        setLoadingText('Success');
        setClassText('ok');
        setInterval(null);
        setRequestInterval(null)
        finishCreateStore({
          email: userInfo.accountName,
          storeId: userInfo.storeId,
        }).then(({res})=>{
          if(res.code === 'K-000000'){
            setStep(6);
          }
        })
      }else if(isPending){
        setInterval(null);
      }else {
        setLoadingText('Error');
        setClassText('danger');
        setTimeout(()=>{
          setStep(errorIndex-1);
          message.error(statusList[errorIndex-1].message);
        },1000)
      }
      setInterval(null);
    } else {
      setCount(count - 1);
    }
  }, interval, { immediate: true });


  function getStatus() {
    queryStatus(userInfo.accountName).then(({res})=>{
      
      for(let i in res.context){
        if(statusList[STATUS[i]]){
          //用两个值来判断 STORE_DETAIL 是否初始化成功
          if(STATUS[i] === 'STORE_DETAIL' || STATUS[i] === 'SETTING_INIT'){
            statusList[2].result = res.context[i].result
            statusList[2].message = res.context[i].message
          }else {
            statusList[STATUS[i]].result = res.context[i].result
            statusList[STATUS[i]].message = res.context[i].message
          }
        }
      }
      //轮询时初始值都为成功
      setErrorIndex(9)
      setIsPending(false)
      statusList.some((item,index)=>{
        if(!item.result || item.result === 'pending'){
          setErrorIndex(index+1)
        }
        if(item.result === 'pending'){
          setIsPending(true)
        }
        return !item.result || item.result === 'pending'
      })
      setStatusList(statusList)
      setInterval(30)
    })
  }

  useInterval(()=>{getStatus()},requestInterval,{ immediate: true })

  const statusIcon = (status)=>{
    switch (status){
      case 'pending':
        return <span style={{ color: 'var(--primary-color)',paddingLeft:5 }}><Icon type="loading" /></span>
      case false:
        return <span style={{ color: '#ff7875',paddingLeft:5 }}><Icon type="close" /></span>
      case true:
        return <span style={{ color: '#3bff00',paddingLeft:5 }}><Icon type="check" /></span>
    }
  }
  return (

    <div className="create-transition">
      <div className={"loading " + classText}>{loadingText}</div>
      <div className="step-list">
        <h1 style={{ color: '#30465a',minWidth: 400 }}>
          {
            classText === '' ? <FormattedMessage id={`Login.create_store_ing`}/> : (
              classText === 'ok' ? 'Success! You are ready to go' : 'Store creation failed. Please try again'
            )
          }
          {/*{*/}
          {/*  intl.get(`Login.create_store_ing`)*/}
          {/*}*/}

        </h1>
        <div className="up-list">
          <ul style={{ marginTop: count,padding:0 }}>
            {list.map((item, _index) =>
                (
                    <li key={_index}>
                      {_index + 1} of 5:{item.name}
                      {
                        count < item.top && statusIcon(item.result)
                      }
                    </li>
                )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}


