import React, { useEffect, useState } from 'react';
import { Icon, Table, Tooltip, Divider, Switch, Modal, Button, Form, Input, Row, Col, message, Select, Spin } from 'antd';
import * as webapi from './webapi'

const TemplateDetail=({visibleTab,setVisibleTab})=>{
  const [visible,setVisible]=useState(false)


  useEffect(()=>{
    setVisible(visibleTab)
  },[visibleTab])

  const closeTab=()=>{
    setVisibleTab(false)
  }

  const getEmailTemlateById=()=>{
    console.log()
  }

  return(
    <>
      <Modal
        width="800px"
        title={'Template Detail'}
        visible={visible}
        footer={[
          <Button key="back" shape="round" onClick={()=>closeTab()}>
            Cancel
          </Button>,
          <Button key="submit" shape="round" type="primary">
            Confirm
          </Button>
        ]}
      >

      </Modal>
    </>
  )
}

export default TemplateDetail
