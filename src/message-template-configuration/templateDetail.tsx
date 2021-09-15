import React, { useEffect, useState } from 'react';
import { Icon, Table, Tooltip, Divider, Switch, Modal, Button, Form, Input, Row, Col, message, Select, Spin } from 'antd';
import * as webapi from './webapi'
import { BreadCrumb, Headline, Const } from 'qmkit';

const TemplateDetail=({visibleTab,setVisibleTab,detailId})=>{
  const [visible,setVisible]=useState(false)
  const [loading,setLoading]=useState(true)
  const [previewHtml,setPreviewHtml]=useState('')
  const [templateName,setTemplateName]=useState('')


  useEffect(()=>{
    setVisible(visibleTab)
  },[visibleTab])

  const closeTab=()=>{
    setVisibleTab(false)
  }
  const params={
    templateId:detailId
  }

  const getEmailTemlateById=()=>{
    setLoading(true)
    webapi
      .getEmailTemplateById(params)
      .then((data)=>{
        const {res} =data;
        if(res.code === Const.SUCCESS_CODE){
          const templateData =res.context;
          setLoading(false);
          setPreviewHtml(templateData.emailTemplateHtml)
          setTemplateName(templateData.messageTemplate)
        }
      })
  }


  useEffect(()=>{
    if(visible){
      getEmailTemlateById()
    }
  },[visible])

  return(
    <>
      <Modal
        width="800px"
        title={templateName}
        visible={visible}
        onCancel={()=>closeTab()}
        footer={[
          <Button key="back" shape="round" onClick={()=>closeTab()}>
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

export default TemplateDetail
