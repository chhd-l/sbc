import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useInterval } from 'ahooks';
import { util, RCi18n, history } from 'qmkit';
import {finishCreateStore, queryStatus} from "../webapi";


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
    {title:'Contract Agreement', message: null, result: false},
    {title:'Legal Info', message: null, result: false},
    {title:'Store Details', message: null, result: true},
    {title:'Price Setting', message: null, result: false},
    {title:'Payment Info', message: null, result: false},
  ])
  let [count, setCount] = useState(0);
  let [loadingText, setLoadingText] = useState('Create');
  let [classText, setClassText] = useState('');
  let [errorIndex, setErrorIndex] = useState(9);
  const [interval, setInterval] = useState(null);

  const list = statusList.map((item,index) => ({ name: <FormattedMessage id={`Login.create_store_step${index+1}`}/>, top: -((index+1) * 31), result:item.result }));

  useEffect(()=>{
    getStatus()
  },[])

  useInterval(() => {
    if (count < (errorIndex*-32) || count < -160) {
      if(errorIndex == 9){
        setLoadingText('Success');
        setClassText('ok');
        // setInterval(null);
        finishCreateStore({
          email: userInfo.accountName,
          storeId: userInfo.storeId,
        }).then(res=>{
          if(res.code === 'K-000000'){
            history.push("/login")
          }
        })
      }else {
        setLoadingText('Error');
        setClassText('danger');
        setTimeout(()=>{
          setStep(errorIndex-1)
        },1000)
      }
      setInterval(null);
    } else {
      setCount(count - 1);
    }
  }, interval, { immediate: true });

  async function getStatus() {
    queryStatus(userInfo.accountName).then(res=>{
      for(let i in res.context){
        console.log(statusList[STATUS[i]])
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
      console.log(statusList)
      statusList.some((item,index)=>{
        if(!item.result){
          setErrorIndex(index+1)
        }
        return item.result === false
      })
      setStatusList(statusList)
      setInterval(30)
    })
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
                        count < item.top &&
                          (errorIndex === (_index+1) ?
                              (<span style={{ color: '#ff7875',paddingLeft:5 }}><Icon type="close" /></span>) :
                                  (<span style={{ color: '#3bff00',paddingLeft:5 }}><Icon type="check" /></span>)
                          )
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


