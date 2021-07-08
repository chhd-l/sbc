import React, { Component } from 'react';
import { Button, Col, Input, Popconfirm, Row, Table, Tooltip, Modal, Radio, Form, message } from 'antd';
import { FormattedMessage } from 'react-intl';
import { history, RCi18n } from 'qmkit';
import * as webapi from './webapi';
export default class SynonymsTable extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      pageNum: 0,
      pageSize: 10,
      total:0,

      dataSource:[],
    };
  }
  componentDidMount() {
    this.getList()
  }

  /**
   * 获取同义词列表
   */
  getList=async ()=>{
    let result:any = await webapi.getSynonList({
      pageNum: this.state.pageNum,
      pageSize: this.state.pageSize,
      keyword:'',
    })
    console.log(result)
    this.setState({
      dataSource:result.res.context.content,
      total:result.res.context.total,
    })
  }
  async delSynonyms(id){
    await webapi.delSynon({
      id,
    })
    message.success(RCi18n({id:'Product.OperateSuccessfully'}));
    this.getList()
  }
  render() {
    const { dataSource,pageSize,pageNum,total } =this.state
    const columns = [
      {
        title: <FormattedMessage id="Product.SearchPhrase" />,
        dataIndex: 'phrase',
        key: 'phrase',
      },
      {
        title: <FormattedMessage id="Product.Synonyms(asf)" />,
        dataIndex: 'synonyms',
        key: 'synonyms',
        render: synonyms => (
          synonyms.join(',')
        )
      },
      {
        title: <FormattedMessage id="Product.Operation" />,
        render: (tags,record) => (
          <span>
            <Tooltip placement="top" title={<FormattedMessage id="Product.Edit" />}>
               <a style={{ marginRight: 10 }} onClick={()=>{
                 history.push({pathname:'/addSynonyms',state:{
                   id:record.id
                   }})
                 }}>
                <span className="icon iconfont iconEdit" style={{ fontSize: 20 }}></span>
              </a>
            </Tooltip>
            <Popconfirm placement="topLeft"
                        title={<FormattedMessage id="Product.sureDeleteThisItem" />}
                        okText={<FormattedMessage id="Product.Confirm" />}
                        cancelText={<FormattedMessage id="Product.Cancel" />}
                        onConfirm={()=>this.delSynonyms(record.id)}>
              <Tooltip placement="top" title={<FormattedMessage id="Product.Delete" />}>
                <a>
                  <span className="icon iconfont iconDelete" style={{ fontSize: 20 }}></span>
                </a>
              </Tooltip>
            </Popconfirm>

          </span>
        ),
      },
    ];
    return(
      <>
        <Row style={{ marginBottom: 10 }} type="flex" justify="space-between">
          <Col>
            <div style={{display:'flex'}}>

              <Input style={{marginRight:10}}/>
              <Button
                type="primary"
                icon="search"
                shape="round"
              >
                <span>
                  <FormattedMessage id="Product.search" />
                </span>
              </Button>
            </div>
          </Col>
          <Col>
            <Button type="primary" onClick={()=>{
              history.push('/addSynonyms')
            }}>
              <FormattedMessage id="Product.AddSynonyms" />
            </Button>
          </Col>
        </Row>
        <Table dataSource={dataSource}
               columns={columns}
               pagination={{pageSize,current:pageNum,total}}
               rowKey={record=>record.id}
        />
      </>
    )
  }
}