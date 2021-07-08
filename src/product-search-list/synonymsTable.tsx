import React, { Component } from 'react';
import { Button, Col, Input, Popconfirm, Row, Table, Tooltip, Modal, Radio, Form, message } from 'antd';
import { FormattedMessage } from 'react-intl';
import { history, RCi18n } from 'qmkit';
import * as webapi from './webapi';
class SynonymsTable extends Component<any, any> {
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
  onChange(val){

  }
  /**
   * 获取同义词列表
   */
  getList=async (keyword='')=>{
    let result:any = await webapi.getSynonList({
      pageNum: this.state.pageNum,
      pageSize: this.state.pageSize,
      keyword:keyword,
    })
    this.setState({
      dataSource:result.res.context.content,
      total:result.res.context.total,
    })
  }

  /**
   * 删除
   * @param id
   */
  async delSynonyms(id){
    await webapi.delSynon({
      id,
    })
    message.success(RCi18n({id:'Product.OperateSuccessfully'}));
    this.getList()
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          pageNum:0,
        },()=>{
          this.getList(values.keyword)
        })
      }
    });
  };
  render() {
    const { dataSource,pageSize,pageNum,total } =this.state
    const { getFieldDecorator } = this.props.form;
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
              <Form layout="inline" onSubmit={this.handleSubmit}>
                <Form.Item >
                  {getFieldDecorator('keyword')(
                    <Input style={{marginRight:10}} allowClear/>
                  )}
                </Form.Item>
                <Form.Item >
                  <Button
                    type="primary"
                    icon="search"
                    shape="round"
                    htmlType="submit"
                  >
                <span>
                  <FormattedMessage id="Product.search" />
                </span>
                  </Button>
                </Form.Item>
              </Form>
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
export default Form.create()(SynonymsTable);