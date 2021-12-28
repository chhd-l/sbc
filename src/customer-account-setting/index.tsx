import React, { Component, useEffect, useState } from 'react';

import { Headline, BreadCrumb, DragTable, Const, RCi18n } from 'qmkit';
import { Row, Col, Button, message, Tooltip, Divider, Popconfirm, Switch, Form, Modal, Spin, Radio } from 'antd';
import { Link } from 'react-router-dom';

import { FormattedMessage, injectIntl } from 'react-intl';
// import TextArea from 'antd/es/input/TextArea';
import TextArea from 'antd/lib/input/TextArea';
import { editDeliveryOption } from '@/shipping-fee-setting/webapi';
import * as webapi from './webapi';
// import Foot from './components/foot';

const index = () => {
  const [editDisable,setDisable] = useState(true)
  const [roleChoice,setRoleChoice] = useState(1)
  const [list,setList] = useState({
    configKey: '',
    configName: '',
    configType: '',
    context: roleChoice,
    delFlag: 0,
    id: 571,
    remark: '',
    status: 1,
    userId: ''
    })

  useEffect(()=>{
    webapi
      .getListSystemAccountConfigUsing().then(({ res }) =>{
        if (res.code == Const.SUCCESS_CODE){
          if (res.context[0].status == '1' ){
            setDisable(false)
          } else {
            setDisable(true)
          }
          setRoleChoice(res.context[0].context);
          let data = JSON.parse(JSON.stringify(res.context[0]))
          // console.log('2222'+JSON.stringify(data))
          setList(data)
        }else {
          console.log('ERROR')
          message.error('error')
        }
    })
  },[])

  function saveAccountSet() {
    let data = JSON.parse(JSON.stringify(list))
    // console.log('ccc'+roleChoice)
    data.context = roleChoice

    // setList(data)
    // console.log(JSON.stringify(list));

    webapi
      .editCustomAccountSetting(data).then(({ res }) => {
          if (res.code == Const.SUCCESS_CODE){
            // console.log('OK')
            message.success('Operation successful');
          }else {
            message.error('error')
          }
      });
  };

  function radioChange(e: any){
    setRoleChoice(e.target.value)
    // console.log(roleChoice,'role')
  }

  return (
    <div>
      <BreadCrumb />
      <div
        className="container"
        style={{ minHeight: '100vh', background: '#fafafa' }}
      >
        <div style={{padding:10,width:'90%'}}>
          <Row style={{marginLeft:20}}>
            <Col span={12}>
              <strong>Custom Account</strong>
            </Col>
            <Col span={24}>
              <p>
                Choose if you want to prompt your customer to create an account when they check out</p>
            </Col>
          </Row>
          <div style={{padding:'30px 20px 0 20px',margin:'20px 20px 0 20px',background: '#fff',borderRadius:'10px'}}>
            {/*<Radio.Group onChange={this.handleCategoryChange} value={paymentCategory}>*/}
            <Radio.Group value={roleChoice} >
              {/*<Radio.Group disabled={editDisable} value={roleChoice} >*/}
              <Radio  value="2" onClick={radioChange}>
                <a style={{color:'#222'}}>Accounts are optional</a>
                <p>Customers will be able to check out with a customer account or as a guest.</p>
              </Radio>
              <br/>
              <Radio value="1" onClick={radioChange}>
                <a style={{color:'#222'}}>Accounts are required</a>
                <p>Customers will only be able to check out if they have a customer account.</p>
              </Radio>
            </Radio.Group>
          </div>
        </div>
      </div>
      {/*<Foot />*/}
      <div className="bar-button">
        {/*<AuthWrapper key="001" functionName={this.props.goodsFuncName}>*/}
        <Button type="primary" onClick={saveAccountSet}>
          <FormattedMessage id="Setting.Save" />
        </Button>
      </div>
    </div>
    )
}

export default index;