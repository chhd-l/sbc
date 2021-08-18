import React, { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Alert,
  Switch,
  Row,
  Col,
  Popconfirm,
  message,
  Spin,
  Radio,
  Select,
  Table
} from 'antd';
import { BreadCrumb, Const, Headline, RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import * as webapi from './webapi';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

const columns = [
  {
    title: 'Message Template Name',
    dataIndex: 'id',
    key: 'taskId',
    width: '10%'
  },
  {
    title: 'Message Template Type',
    dataIndex: 'template_id',
    key: 'objectType',
    width: '10%',
    ellipsis: true
  },
  {
    title: 'Created Date',
    dataIndex: 'template_name',
    key: 'objectNo',
    width: '10%'
  },
  {
    title: 'Message Template Type',
    dataIndex: 'template_id',
    key: 'objectType',
    width: '10%',
    ellipsis: true
  },
  {
    title: 'Created Date',
    dataIndex: 'template_name',
    key: 'objectNo',
    width: '10%'
  },
  {
    title: 'Operation',
    dataIndex: 'objectNo',
    key: 'objectNo',
    width: '10%'
  },
]

const TemplateData=[
  {
    'id': 19136,
    'template_id': 'T202108180219382336',
    'template_name': 'Prescriber creation',
    },
  {
    id: 19136,
    template_id: 'T202108180219382336',
    template_name: 'Prescriber creation',
  },
  {
    id: 19136,
    template_id: 'T202108180219382336',
    template_name: 'Prescriber creation',
  },
  {
    'id': 19136,
    'template_id': 'T202108180219382336',
    'template_name': 'Prescriber creation',
  },
  {
    id: 19136,
    template_id: 'T202108180219382336',
    template_name: 'Prescriber creation',
  },
  {
    id: 19136,
    template_id: 'T202108180219382336',
    template_name: 'Prescriber creation',
  },
  {
    'id': 19136,
    'template_id': 'T202108180219382336',
    'template_name': 'Prescriber creation',
  },
  {
    id: 19136,
    template_id: 'T202108180219382336',
    template_name: 'Prescriber creation',
  },
  {
    id: 19136,
    template_id: 'T202108180219382336',
    template_name: 'Prescriber creation',
  },
  {
    id: 19136,
    template_id: 'T202108180219382336',
    template_name: 'Prescriber creation',
  },
  {
    'id': 19136,
    'template_id': 'T202108180219382336',
    'template_name': 'Prescriber creation',
  },
  {
    id: 19136,
    template_id: 'T202108180219382336',
    template_name: 'Prescriber creation',
  },
  {
    id: 19136,
    template_id: 'T202108180219382336',
    template_name: 'Prescriber creation',
  },

]


const MessageTemplateConfiguration=()=>{


  const [emailTemplateList,setEmailTemplateList]=useState([]);

  const getEmailTemplateList=()=>{
    webapi.getEmailTemplateList().then((data) => {
      const {res} =data;
      console.log(res,'🐖')
      if(res.code===Const.SUCCESS_CODE){
        setEmailTemplateList(res.context.emailTemplateResponseList)
      }
    })
  }

  useEffect(()=>{
    getEmailTemplateList();
  },[])

  return(
    <div>
      <BreadCrumb />
      <div className="container-search">
        <Headline title="Template Settings"/>

        <Form className="filter-content" layout="inline">
          <Row>

            <Col span={8}>
              <FormItem>
                <InputGroup compact style={styles.formItemStyle}>
                  <Input style={styles.label} disabled defaultValue={RCi18n({id:'Marketing.EmailTemplate'})} />
                  <Select
                    style={styles.wrapper}
                    getPopupContainer={(trigger: any) => trigger.parentNode}
                    // onChange={(value) => {
                    //   value = value === '' ? null : value;
                    //   this.onFormChange({
                    //     field: 'templateId',
                    //     value
                    //   });
                    // }}
                  >
                    <Option value="">
                      <FormattedMessage id="all" />
                    </Option>
                    {emailTemplateList &&
                    emailTemplateList.map((item, index) => (
                      <Option value={item.templateId} key={index}>
                        {item.emailTemplate}
                      </Option>
                    ))}
                  </Select>
                </InputGroup>
              </FormItem>
            </Col>
            <Col span={2}></Col>
            <Col span={14}>
              <FormItem >
                <InputGroup compact style={styles.formItemStyle2}>
                  <Input style={styles.label1} disabled defaultValue={'Message Template Type'} />
                  <Select
                    style={styles.wrapper}
                    getPopupContainer={(trigger: any) => trigger.parentNode}
                    defaultValue=""
                    // onChange={(value) => {
                    //   value = value === '' ? null : value;
                    //   this.onFormChange({
                    //     field: 'objectType',
                    //     value
                    //   });
                    // }}
                  >
                    <Option value="">
                      <FormattedMessage id="all" />
                    </Option>
                    {/*{objectTypeList &&*/}
                    {/*objectTypeList.map((item, index) => (*/}
                    {/*  <Option value={item.value} key={index}>*/}
                    {/*    {item.name}*/}
                    {/*  </Option>*/}
                    {/*))}*/}
                  </Select>
                </InputGroup>
              </FormItem>
            </Col>


            <Col span={24} style={{ textAlign: 'center' ,marginTop:'30px'}}>
              <FormItem>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon="search"
                  shape="round"
                  // onClick={(e) => {
                  //   e.preventDefault();
                  //   this.onSearch();
                  // }}
                >
                    <span>
                      <FormattedMessage id="search" />
                    </span>
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>

      <div className="container">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={TemplateData}
          // pagination={this.state.pagination}
          // loading={this.state.loading}
          // scroll={{ x: '100%' }}
          // onChange={this.handleTableChange}
        />
      </div>
  </div>)
}
const styles = {
  formItemStyle: {
    width: 295
  },
  label: {
    width: 135,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.65)',
    backgroundColor: '#fff',
    cursor: 'text'
  },
  label1:{
    width: 180,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.65)',
    backgroundColor: '#fff',
    cursor: 'text'
  },
  wrapper: {
    width: 160
  },
  formItemStyle2:{
    width:340,
  }
} as any;

export default MessageTemplateConfiguration