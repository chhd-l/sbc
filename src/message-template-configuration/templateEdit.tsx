import React, { useEffect, useState } from 'react';
import { BreadCrumb, Headline, Const, history, RCi18n } from 'qmkit';
import { Breadcrumb, Button, Col, DatePicker, Form, Icon, Input, Radio, Row, Select, Spin, Tag, Tooltip } from 'antd';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
import * as webapi from './webapi';
import { Link } from 'react-router-dom';

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

const TemplateEdit=(props)=>{

  useEffect(()=>{
    console.log(props.location.query,'xin');
  },[])

  const [editForm,setEditForm]=useState({
    id:props.location.query.recordId,
    templateId: props.location.query.recordTemplateId,
    type: props.location.query.recordType,
  })

  const onFormChange = ({ field, value }) => {
    let data = editForm;
    data[field] = value;
    setEditForm(data)
    console.log(editForm)
  };


  const editTemplate=()=>{
    console.log(editForm,'params')
    webapi
      .editTemplateList(editForm)
      .then((data)=>{
        const {res}=data;
        if(res.code===Const.SUCCESS_CODE){
          console.log(res,'edit')
        }
      })
  }

  return(
    <div >
      <BreadCrumb thirdLevel={true}>
        <Breadcrumb.Item>
          Template Edit
        </Breadcrumb.Item>
      </BreadCrumb>

      <Spin spinning={false}>
        <div className="container-search">
          <Headline title={'Template Edit'} />

          <div>
            <div style={styles.title}>
              <span style={styles.titleText}>Template Information</span>
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
                <FormItem label={'Template ID'}>
                    <Input
                      // disabled={detailForm.consumerType === 'Member' || this.state.isDetail}
                      placeholder={editForm.templateId}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        onFormChange({
                          field: 'templateId',
                          value
                        });
                      }}
                    />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={'Template Type'}>
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
          <Button type="primary" style={{ marginRight: 10 }} onClick={()=>editTemplate()}>
            <Link to={'/message-template-configuration'}>
            {<FormattedMessage id="save" />}
            </Link>
          </Button>
        <Button onClick={() => (history as any).go(-1)} style={{ marginRight: 10 }}>
          {<FormattedMessage id="back" />}
        </Button>
      </div>
    </div>
  )
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

export default TemplateEdit