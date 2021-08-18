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
  Table, Tooltip, Divider
} from 'antd';
import { BreadCrumb, Const, Headline, RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import * as webapi from './webapi';
import { Link } from 'react-router-dom';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'taskId',
    width: '10%'
  },
  {
    title: 'Template Id',
    dataIndex: 'templateId',
    key: 'objectType',
    width: '10%',
    ellipsis: true
  },
  {
    title: 'Template Name',
    dataIndex: 'emailTemplate',
    key: 'objectNo',
    width: '10%'
  },
  {
    title: 'Template Type',
    dataIndex: 'sendCategory',
    key: 'objectType',
    width: '10%',
    ellipsis: true
  },
  {
    title: 'Created Date',
    dataIndex: 'createTime',
    key: 'objectNo',
    width: '10%'
  },
  {
    title: 'Operation',
    dataIndex: 'objectNo',
    key: 'objectNo',
    width: '10%',
    render: (text, record) => (
      <div>
          <div>

            <Tooltip placement="top" title={<FormattedMessage id="Marketing.Details" />}>
              <Link to={'/message-detail/' + record.id} className="iconfont iconDetails"></Link>
            </Tooltip>

            <Divider type="vertical" />
            <Tooltip placement="top" title={RCi18n({id:'edit'})}>
              <Link to={'/message-edit/' + record.id} className="iconfont iconEdit"></Link>
            </Tooltip>

            <Divider type="vertical" />

            <Popconfirm placement="topLeft" title={<FormattedMessage id="Marketing.AreYouSureToDeleteThisItem" />} onConfirm={() => this.deleteTask(record.id)} okText="Confirm" cancelText="Cancel">
              <Tooltip placement="top" title={RCi18n({id:'delete'})}>
                <a type="link" className="iconfont iconDelete"></a>
              </Tooltip>
            </Popconfirm>
          </div>
      </div>
    )

  },
]

const TemplateData=[

  {
    id: 19136,
    templateId: 'T202108180219382336',
    emailTemplate: 'Prescriber creation',
    sendCategory:1,
    createTime:'2021-08-18 02:20:20.000',
  },
  {
    id: 19137,
    templateId: 'T202108180219382336',
    emailTemplate: 'Prescriber creation',
    sendCategory:1,
    createTime:'2021-08-18 02:20:20.000',
  },
  {
    id: 19138,
    templateId: 'T202108180219382336',
    emailTemplate: 'Prescriber creation',
    sendCategory:1,
    createTime:'2021-08-18 02:20:20.000',
  },
  {
    id: 19139,
    templateId: 'T202108180219382336',
    emailTemplate: 'Prescriber creation',
    sendCategory:1,
    createTime:'2021-08-18 02:20:20.000',
  },
  {
    id: 191340,
    templateId: 'T202108180219382336',
    emailTemplate: 'Prescriber creation',
    sendCategory:1,
    createTime:'2021-08-18 02:20:20.000',
  },
  {
    id: 19141,
    templateId: 'T202108180219382336',
    emailTemplate: 'Prescriber creation',
    sendCategory:1,
    createTime:'2021-08-18 02:20:20.000',
  },
  {
    id: 19142,
    templateId: 'T202108180219382336',
    emailTemplate: 'Prescriber creation',
    sendCategory:1,
    createTime:'2021-08-18 02:20:20.000',
  },
  {
    id: 19143,
    templateId: 'T202108180219382336',
    emailTemplate: 'Prescriber creation',
    sendCategory:1,
    createTime:'2021-08-18 02:20:20.000',
  },
  {
    id: 19144,
    templateId: 'T202108180219382336',
    emailTemplate: 'Prescriber creation',
    sendCategory:1,
    createTime:'2021-08-18 02:20:20.000',
  },
  {
    id: 19145,
    templateId: 'T202108180219382336',
    emailTemplate: 'Prescriber creation',
    sendCategory:1,
    createTime:'2021-08-18 02:20:20.000',
  },
  {
    id: 19146,
    templateId: 'T202108180219382336',
    emailTemplate: 'Prescriber creation',
    sendCategory:1,
    createTime:'2021-08-18 02:20:20.000',
  },
  {
    id: 19147,
    templateId: 'T202108180219382336',
    emailTemplate: 'Prescriber creation',
    sendCategory:1,
    createTime:'2021-08-18 02:20:20.000',
  },

]


const MessageTemplateConfiguration=()=>{


  const [emailTemplateList,setEmailTemplateList]=useState([]);
  const [templateListData,setTemplateListData]=useState([]);


  const getEmailTemplateList=()=>{
    webapi.getEmailTemplateList().then((data) => {
      const {res} =data;
      if(res.code===Const.SUCCESS_CODE){
        //上方搜索框展示模板名
        setEmailTemplateList(res.context.emailTemplateResponseList);

        //下方展示展示所有模板
        setTemplateListData(res.context.emailTemplateResponseList);
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
            <Col span={8}>
              <FormItem>
                <InputGroup compact style={styles.formItemStyle}>
                  <Input style={styles.label} disabled defaultValue={'Template type'} />
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
                    {/*{emailTemplateList &&*/}
                    {/*emailTemplateList.map((item, index) => (*/}
                    {/*  <Option value={item.templateId} key={index}>*/}
                    {/*    {item.emailTemplate}*/}
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
        {console.log(templateListData,'🐱')}
        <Table
          rowKey="id"
          columns={columns}
          dataSource={templateListData}
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
  wrapper: {
    width: 160
  }
} as any;

export default MessageTemplateConfiguration