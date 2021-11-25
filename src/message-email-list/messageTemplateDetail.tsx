import React, { useEffect, useState } from 'react';
import {  Modal, Button, Form, Input, Row, Col, message, Select, Spin } from 'antd';
import * as webapi from './webapi'
import { Const } from 'qmkit';
import Handlebars from 'handlebars'

const MessageTemplateDetail=({visibleTemplate,setVisibleTemplate,taskId})=>{

    const [loading,setLoading]=useState(true)
    const [previewHtml,setPreviewHtml]=useState('')
    const [templateTaskId,setTemplateTaskId]=useState('')
    const [paramsData,setParamsData]=useState()
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
    const template = Handlebars.compile(previewHtml);

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
                setPreviewHtml(templateDate.messageTemplateContent)
                setTemplateTaskId(templateDate.messageTaskId)
                const data=JSON.parse(templateDate.messageSendParams)
                const trueData = data.templateData
                setParamsData(trueData)
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
            {previewHtml?<div dangerouslySetInnerHTML={{__html:template(paramsData)}} style={{zoom:'0.5'}}></div>:null}
          </Spin>
        </Modal>
      </>
    )
}

export default MessageTemplateDetail