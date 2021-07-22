import React, { Component } from 'react'
import { Headline, BreadCrumb, SelectGroup } from 'qmkit';
import MyDate from './components/MyDate'
import { Form, Row, Col, Input, Button, Select,Tabs,Tooltip } from 'antd'
import { FormattedMessage } from 'react-intl';
import Tab from "@/Integration/components/tab";

const {TabPane} = Tabs;


const {Option} = Select;

class Loglist extends Component<any, any>{
  constructor(props) {
    super(props);
    this.state={
      pagination: {
        current: 1,
        pageSize: 5,
        total: 0
      },
      columns:[
        {
          title:"Request ID",
          dataIndex:"requestid",
          key:"requestid"
        },
        {
          title:"Time",
          dataIndex:"time",
          key:"time"
        },
        {
          title:"Interface Name",
          dataIndex:"interfacename",
          key:"interfacename"
        },
        {
          title:"Header",
          dataIndex:"header",
          key:"header"
        },
        {
          title:"Payload",
          dataIndex:"payload",
          key:"payload"
        },
        {
          title:"Response",
          dataIndex:"response",
          key:"response"
        },
        {
          title:"Client Name",
          dataIndex:"clientname",
          key:"clientname",
          render:()=> (
            <div>
              <Tooltip placement="top" title='Detail'>
                <a onClick={() => this.openView()} className="iconfont iconDetails"/>
              </Tooltip>
            </div>
          )
        }
      ],
      list:[
        {
          requestid:1,
          id:1
        },
        {
          requestid:1,
          id:2
        },
        {
          requestid:1,
          id:3
        },
        {
          requestid:1,
          id:4
        },
        {
          requestid:1,
          id:5
        },
        {
          requestid:1,
          id:6
        },
      ]
    }
  }

  openView = () =>{
    location.href="integration-log-detail"
  }

  handleSubmit = () => {
    const value = this.props.form.getFieldsValue();
    let startDate = value.newdate?value.newdate.format('YYYY-MM-DD'):'';
    let endDate = value.enddate?value.enddate.format('YYYY-MM-DD'):'';
    let obj = {...value,enddate:endDate,newdate:startDate}
    console.log(obj);
    
  }
  onSearchPage = (pagination)=>{
    this.setState({
      pagination:pagination
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <BreadCrumb />
        <div className="container-search">
          <Headline title={<FormattedMessage id='Log.LogSearch' />} />
          <Form layout='inline' className="filter-content">
            <Row>
              <Col span={8}>
                <Form.Item>
                  {getFieldDecorator('requestId')(<Input style={{ width: 337 }} addonBefore={<p style={styles.label}>{<FormattedMessage id='Log.RequestID' />}</p>} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item>
                  {getFieldDecorator('system')(
                    <SelectGroup
                      style={{ width: 194 }}
                      label={<p style={styles.label}>{<FormattedMessage id='Log.System' />}</p>}>
                      <Option value="0">{<FormattedMessage id='Log.Datata' />}</Option>
                      <Option value="1">{<FormattedMessage id='Log.Fedex' />}</Option>
                      <Option value="2">{<FormattedMessage id='Log.Mulesoft' />}</Option>
                      <Option value="3">{<FormattedMessage id='Log.OKTACIAM' />}</Option>
                      <Option value="4">{<FormattedMessage id='Log.WEShare' />}</Option>
                    </SelectGroup>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item>
                  {getFieldDecorator('interface')(<SelectGroup
                    style={{ width: 194 }}
                    label={<p style={styles.label}>{<FormattedMessage id='Log.Interface' />}</p>}
                  >
                    <Option value="0">{<FormattedMessage id='Log.InventorySynchonization' />}</Option>
                    <Option value="1">{<FormattedMessage id='Log.OrderExport' />}</Option>
                    <Option value="2">{<FormattedMessage id='Log.PriceSynchronization' />}</Option>
                  </SelectGroup>)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item>
                  {getFieldDecorator("newdate")(<MyDate label={<FormattedMessage id='Log.NewDate' />} style={{ width: 194 }} placeholder=""></MyDate>)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item>
                  {getFieldDecorator("enddate")(<MyDate label={<FormattedMessage id='Log.EndDate' />} style={{ width: 194 }} placeholder=""></MyDate>)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <div style={{ margin: "auto", width: 100, padding: "30px 0px 0px" }}>
                  <Button type="primary" onClick={this.handleSubmit}>
                    Search
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="container">
          <Tabs defaultActiveKey='1' >
              <TabPane tab={<FormattedMessage id="Log.AllLog" />} key = "1">
                <Tab
              dataSource={this.state.list}
              pagination={this.state.pagination}
              onChange={this.onSearchPage}
              columns={this.state.columns}
            />
              </TabPane>
              <TabPane tab={<FormattedMessage id="Log.Error" />} key = "2">
                <Tab
                dataSource={this.state.list}
                pagination={this.state.pagination}
                onChange={this.onSearchPage}
                columns={this.state.columns}
              />
              </TabPane>
          </Tabs>
        
        </div>
      </div>
    )
  }
}

const styles = {
  label: {
    width: 120,
    textAlign: 'center',
  },
  buttoncenter:{
    textAlign:'center'
  }
} as any

export default Form.create()(Loglist)