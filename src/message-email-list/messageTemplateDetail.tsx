import React, { useEffect, useState } from 'react';
import {  Modal, Button, Form, Input, Row, Col, message, Select, Spin } from 'antd';
import * as webapi from './webapi'
import { cache, Const } from 'qmkit';
import Handlebars from 'handlebars'
import SendSay from '../../web_modules/qmkit/sendsay';

Handlebars.registerHelper('equals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
Handlebars.registerHelper('length', function(arg1,options) {
  return arg1.length;
});
Handlebars.registerHelper('greaterThan', function(arg1, arg2, options) {
  return (arg1 > arg2) ? options.fn(this) : options.inverse(this);
});
Handlebars.registerHelper('length', function(fn) {
  return ('');
});



const MessageTemplateDetail=({visibleTemplate,setVisibleTemplate,taskId})=>{

    const [loading,setLoading]=useState(true)
    const [previewHtml,setPreviewHtml]=useState('')
    const [templateTaskId,setTemplateTaskId]=useState('')
    const isCountryRu = (window as any).countryEnum[JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}').storeId ?? 0] == 'ru'
    console.log(isCountryRu,'Ru')

    const params={
        taskId:taskId
      }

    const getEmailTask=()=>{
        setLoading(true)
        webapi
          .viewEmailTask(params)
          .then((data)=>{
              const {res} =data;
              if(res.code === Const.SUCCESS_CODE){
                setLoading(false);
                const templateDate =res.context;
                const emailData = JSON.parse(templateDate.messageSendParams).templateData
                const emailTemp = templateDate.messageTemplateContent

                let template = null;

                if (isCountryRu) {
                  template = new SendSay(emailTemp, {anketa: {params: {...emailData}}}).getTemplate()
                } else {
                  template = Handlebars.compile(emailTemp)(emailData)
                }

                setTemplateTaskId(templateDate.messageTaskId)
                setPreviewHtml(template)


              }
          })
    }

    useEffect(()=>{
      if(visibleTemplate){
        getEmailTask()
      }
    },[visibleTemplate])

    return(
      <>
        <Modal
            width="800px"
            title={templateTaskId}
            onCancel={()=>setVisibleTemplate()}
            visible={visibleTemplate}
            footer={[
                <Button key="back" shape="round" onClick={()=>setVisibleTemplate()}>
                    Cancel
                </Button>
            ]}
        >
          <Spin spinning={loading}>
            {previewHtml?<div dangerouslySetInnerHTML={{__html:previewHtml}} style={{zoom:'0.5'}}></div>:null}
          </Spin>
        </Modal>
      </>
    )
}

export default MessageTemplateDetail