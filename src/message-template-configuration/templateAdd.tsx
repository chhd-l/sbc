import React, { useState } from 'react';
import { BreadCrumb, Const, Headline, history,RCi18n } from 'qmkit';
import { Breadcrumb, Button, Col, Form, Input, message, Row, Select, Spin } from 'antd';
import { FormattedMessage } from 'react-intl';
import { addTemplateList } from '@/message-template-configuration/webapi';
import * as webapi from './webapi';
import { Link } from 'react-router-dom';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

const statusList = [
  {
    value:'0',
    name:'Email'
  },
  {
    value:'1',
    name:'Text'
  }
]

const TemplateAdd=()=>{

  const [addForm,setAddForm]=useState({
    templateId: '',
    type: '',
  })

  const addTemplate=()=>{
    webapi
      .addTemplateList(addForm)
      .then((data)=>{
        const {res} =data;
        if(res.code===Const.SUCCESS_CODE){
          message.success('Operate successfully')
          history.push('/message-template-configuration')
        }
      })
      .catch((err)=>{
        console.log(err)
      })
  }

  const onFormChange = ({ field, value }) => {
    let data = addForm;
    data[field] = value;
    setAddForm(data)
    console.log(addForm)
  };

  return(
    <div>
    <div >
      <BreadCrumb thirdLevel={true}>
        <Breadcrumb.Item>
          <FormattedMessage id="Marketing.EmailTemplateAddTitle" />
        </Breadcrumb.Item>
      </BreadCrumb>

      <Spin spinning={false}>
        <div className="container-search">
          <Headline title={RCi18n({id:'Marketing.EmailTemplateAddTitle'})} />

          <div>
            <div style={styles.title}>
              <span style={styles.titleText}><FormattedMessage id="Marketing.EmailTemplateInformation"/></span>
              {/*{emailStatus === 'Draft' ? <Tag>{emailStatus}</Tag> : null}*/}
              {/*{emailStatus === 'Finish' ? <Tag color="#87d068">{emailStatus}</Tag> : null}*/}
              {/*{emailStatus === 'To do' ? <Tag color="#108ee9">{emailStatus}</Tag> : null}*/}
            </div>
            <Form layout="horizontal" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} labelAlign="right">
              <Row style={{ marginTop: 20 }}>
                <Col span={8}>
                </Col>
              </Row>
            </Form>
          </div>

          <Form layout="horizontal" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} labelAlign="right">
            <Row style={{ marginTop: 20 }}>
              <Col span={8}>
                <FormItem label={RCi18n({id:'Marketing.EmailTemplateId'})}>
                  <Input
                    // disabled={detailForm.consumerType === 'Member' || this.state.isDetail}
                    // // onChange={(e) => {
                    // //   const value = (e.target as any).value;
                    // //   this.onDetailsFormChange({
                    // //     field: 'email',
                    // //     value
                    // //   });
                    // // }}
                    onChange={(e)=>{
                      const value =(e.target as any).value;
                      onFormChange({
                        field:'templateId',
                        value
                      })
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={2}></Col>
              <Col span={8}>
                <FormItem label={RCi18n({id:'EmailTemplateType'})}>
                  <Select
                    style={styles.wrapper}
                    getPopupContainer={(trigger: any) => trigger.parentNode}
                    defaultValue=""
                    onChange={(value)=>{
                      value = value === '' ? null : value;
                      onFormChange({
                        field:'type',
                        value
                      })
                    }}
                  >
                    {
                      statusList && statusList.map((item,index)=>(
                        <Option value={item.value} key={index}>
                          {item.name}
                        </Option>
                      ))
                    }
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </Spin>



      <div className="bar-button">
        <Button type="primary" style={{ marginRight: 10 }} onClick={()=>addTemplate()} >
          {<FormattedMessage id="save" />}
        </Button>
        <Button onClick={() => (history as any).go(-1)} style={{ marginRight: 10 }}>
          {<FormattedMessage id="back" />}
        </Button>
      </div>
    </div>
  </div>)
}

const styles = {
  title: {
    borderBottom: 'solid 1px #cccccc',
    paddingBottom: 10
  },
  titleText: {
    color: '#e2001a',
    marginRight: 10,
    fontWeigh: 500
  },
  label: {
    width: 100
  },
  warpper: {}
} as any;

export default TemplateAdd