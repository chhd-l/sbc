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
import value from '*.json';
import TemplateDetail from '@/message-template-configuration/templateDetail';


const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;



//假数据
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

const MessageTemplateConfiguration=()=>{


  const [templateListData,setTemplateListData]=useState([]);
  const [searchForm,setSearchForm]=useState({
    messageTemplate: '',
    type: '',
  })
  const [showTab,setShowTab]=useState(false)
  const [detailId,setDetailId]=useState()

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
      key: 'templateId',
      width: '10%',
      ellipsis: true
    },
    {
      title: 'Template Name',
      dataIndex: 'messageTemplate',
      key: 'messageTemplate',
      width: '10%'
    },
    {
      title: 'Template Type',
      dataIndex: 'sendCategory',
      key: 'sendCategory',
      width: '10%',
      ellipsis: true
    },
    {
      title: 'Created Date',
      dataIndex: 'createTime',
      key: 'createTime',
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
              <a className="iconfont iconDetails" onClick={()=> {
                setShowTab(true);
                setDetailId(record.id);
              }}></a>
            </Tooltip>

            <Divider type="vertical" />
            <Tooltip placement="top" title={RCi18n({id:'edit'})}>
              <Link to={{pathname:'/template-edit/' + record.templateId,query:record.id}} className="iconfont iconEdit"></Link>
            </Tooltip>

            <Divider type="vertical" />

            <Popconfirm placement="topLeft" title={<FormattedMessage id="Marketing.AreYouSureToDeleteThisItem" />} onConfirm={()=>deleteTemplate(record.id)} okText="Confirm" cancelText="Cancel">
              <Tooltip placement="top" title={RCi18n({id:'delete'})}>
                <a type="link" className="iconfont iconDelete"></a>
              </Tooltip>
            </Popconfirm>
          </div>
        </div>
      )

    },
  ]

  const onFormChange = ({ field, value }) => {
    let data = searchForm;
    data[field] = value;
    setSearchForm(data)
    console.log(searchForm,'New')
  };


  const getEmailTemplateList=()=>{
    webapi.getEmailTemplateList(searchForm).then((data) => {
      const {res} =data;
      console.log(res.context,'hua')
      if(res.code===Const.SUCCESS_CODE){
        //下方展示展示所有模板
        setTemplateListData(res.context.messageTemplateResponseList);
      }
    })
  }


  const deleteTemplate=(id)=>{
    console.log(id,'id')
    const parmas={id:id}
    webapi
      .deleteTemplateList(parmas)
      .then((data)=>{
        const { res } =data;
        if(res.code ===Const.SUCCESS_CODE){
          message.success('Operate successfully')
          getEmailTemplateList();
        }
      })
      .catch((err)=>{
        console.log(err,'wrong')
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
                  <Input style={styles.label} disabled defaultValue={'Template Name'} />
                  <Input
                    style={styles.wrapper}
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      onFormChange({
                        field: 'messageTemplate',
                        value
                      });
                    }}
                  />
                </InputGroup>
              </FormItem>
            </Col>
            <Col span={2}></Col>
            <Col span={8}>
              <FormItem>
                <InputGroup compact style={styles.formItemStyle}>
                  <Input style={styles.label} disabled defaultValue={'Template Type'} />
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
                    <Option value="">
                      <FormattedMessage id="all" />
                    </Option>
                    {
                      statusList && statusList.map((item,index)=>(
                        <Option value={item.value} key={index}>
                          {item.name}
                        </Option>
                      ))
                    }
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
                  onClick={()=>getEmailTemplateList()}
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
      <TemplateDetail visibleTab={showTab} setVisibleTab={setShowTab} />
      <div className="container">
        <Button type="primary" style={{ margin: '10px 10px 10px 0' }}>
          <Link to={'/template-add'}><FormattedMessage id="add" /></Link>
        </Button>
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