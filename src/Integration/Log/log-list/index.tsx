import React, { Component } from 'react'
import { Headline, BreadCrumb, SelectGroup } from 'qmkit';
import MyDate from './components/MyDate'
import { Form, Row, Col, Input, Button, Select, Tabs, Tooltip } from 'antd'
import { FormattedMessage } from 'react-intl';
import Tab from '@/Integration/components/tab';
import { Link } from 'react-router-dom'

const { TabPane } = Tabs;


const { Option } = Select;

class Loglist extends Component<any, any>{
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        current: 1,
        pageSize: 5,
        total: 0
      },
      columns: [
        {
          title: <FormattedMessage id="Log.RequestID" />,
          dataIndex: 'requestid',
          key: 'requestid'
        },
        {
          title: <FormattedMessage id="Log.Time" />,
          dataIndex: 'time',
          key: 'time'
        },
        {
          title: <FormattedMessage id="Log.InterfaceName" />,
          dataIndex: 'interfacename',
          key: 'interfacename'
        },
        {
          title: <FormattedMessage id="Log.Header" />,
          dataIndex: 'header',
          key: 'header'
        },
        {
          title: <FormattedMessage id="Log.Payload" />,
          dataIndex: 'payload',
          key: 'payload'
        },
        {
          title: <FormattedMessage id="Log.Response" />,
          dataIndex: 'response',
          key: 'response'
        },
        {
          title: <FormattedMessage id="Log.ClientName" />,
          dataIndex: 'clientname',
          key: 'clientname',
          render: () => (
            <div>
              <Tooltip placement="top" title="Detail">
                <Link to="/integration-log-detail" className="iconfont iconDetails" />
              </Tooltip>
            </div>
          )
        }
      ],
      list: [
        {
          requestid: 1,
          id: 1
        },
        {
          requestid: 1,
          id: 2
        },
        {
          requestid: 1,
          id: 3
        },
        {
          requestid: 1,
          id: 4
        },
        {
          requestid: 1,
          id: 5
        },
        {
          requestid: 1,
          id: 6
        },
      ]
    }
  }

  openView = () => {
    location.href = 'integration-log-detail'
  }

  handleSubmit = () => {
    const value = this.props.form.getFieldsValue();
    let startDate = value.newdate ? value.newdate.format('YYYY-MM-DD') : '';
    let endDate = value.enddate ? value.enddate.format('YYYY-MM-DD') : '';
    let obj = { ...value, enddate: endDate, newdate: startDate };

  }
  onSearchPage = (pagination) => {
    this.setState({
      pagination: pagination
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <BreadCrumb />
        <div className="container-search">
          <Headline title={<FormattedMessage id="Log.LogSearch" />} />
          <Form layout="inline" className="filter-content">
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item>
                  {getFieldDecorator('requestId')(<Input addonBefore={<p style={styles.label}>{<FormattedMessage id="Log.RequestID" />}</p>} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item>
                  {getFieldDecorator('system')(
                    <SelectGroup
                      style={styles.selectWidth}
                      label={<p style={styles.label}>{<FormattedMessage id="Log.System" />}</p>}>
                      <Option value="0">{<FormattedMessage id="Log.Datata" />}</Option>
                      <Option value="1">{<FormattedMessage id="Log.Fedex" />}</Option>
                      <Option value="2">{<FormattedMessage id="Log.Mulesoft" />}</Option>
                      <Option value="3">{<FormattedMessage id="Log.OKTACIAM" />}</Option>
                      <Option value="4">{<FormattedMessage id="Log.WEShare" />}</Option>
                    </SelectGroup>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item>
                  {getFieldDecorator('interface')
                    (<SelectGroup
                      style={styles.selectWidth}
                      label={<p style={styles.label}>{<FormattedMessage id="Log.Interface" />}</p>}>
                      <Option value="0">{<FormattedMessage id="Log.InventorySynchonization" />}</Option>
                      <Option value="1">{<FormattedMessage id="Log.OrderExport" />}</Option>
                      <Option value="2">{<FormattedMessage id="Log.PriceSynchronization" />}</Option>
                    </SelectGroup>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item>
                  {getFieldDecorator('newdate')(<MyDate label={<p style={styles.label}><FormattedMessage id="Log.NewDate" /></p>} placeholder=""></MyDate>)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item>
                  {getFieldDecorator('enddate')(<MyDate label={<p style={styles.label}><FormattedMessage id="Log.EndDate" /></p>} placeholder=""></MyDate>)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon="search"
                  shape="round" onClick={this.handleSubmit}>
                  Search
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="container">
          <Tabs defaultActiveKey="1" >
            <TabPane tab={<FormattedMessage id="Log.AllLog" />} key="1">
              <Tab
                dataSource={this.state.list}
                pagination={this.state.pagination}
                onChange={this.onSearchPage}
                columns={this.state.columns}
              />
            </TabPane>
            <TabPane tab={<FormattedMessage id="Log.Error" />} key="2">
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
    width: 151,
    textAlign: 'center',
  },
  selectWidth: {
    width: 194
  }
} as any

export default Form.create()(Loglist)