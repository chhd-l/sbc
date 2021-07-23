import React, { Component } from 'react'
import { BreadCrumb, Headline } from 'qmkit'
import { FormattedMessage } from 'react-intl'
import { Form, Input, Row, Col, Collapse, Tooltip, Tabs } from 'antd'
import Tab from '@/Integration/components/tab'
import { Link } from 'react-router-dom'
import '@/Integration/components/index.less'
const { Panel } = Collapse;
const { TabPane } = Tabs;

class LogDetail extends Component<any, any>{
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: <FormattedMessage id="Log.Time" />,
          dataIndex: 'time',
          key: 'time'
        },
        {
          title: <FormattedMessage id="Log.ClientName" />,
          dataIndex: 'clientname',
          key: 'clientname'
        },
        {
          title: <FormattedMessage id="Log.ClientID" />,
          dataIndex: 'clientid',
          key: 'clientid'
        },
        {
          title: <FormattedMessage id="Log.URL" />,
          dataIndex: 'url',
          key: 'url'
        },
        {
          title: <FormattedMessage id="Log.ResultFlag" />,
          dataIndex: 'resultflag',
          key: 'resultflag'
        },
        {
          title: <FormattedMessage id="Log.Error" />,
          dataIndex: 'error',
          key: 'error'
        },
        {
          title: <FormattedMessage id="Log.Log" />,
          dataIndex: 'log',
          key: 'log',
          render: () => (
            <div>
              <Tooltip placement="top" title="Detail">
                <Link to="/log-response">Check</Link>
              </Tooltip>
            </div>
          )
        }
      ],
      list: [
        {
          id: 1,
          time: '2021-06-21 06:45:27.944',
          error:'error'
        }
      ]
    }
  }

  
  toDate = (arr) => {
    for(let i = 0;i<arr.length;i++){
      const error = arr[i].error;
      error?arr[i].error = <Tooltip placement="top" title={error}><Link to="#">Error</Link></Tooltip>:arr[i].error = <Tooltip placement="top" title=""><Link to="#">Error</Link></Tooltip>;
    }
    return arr;
  }

  onSearchPage = (pagination) => {
    this.setState({
      pagination: pagination
    })
  }

  render() {
    return (
      <div>
        <BreadCrumb />
        <div className="container-search">
          <Headline title={<FormattedMessage id="Log.RequestDetail" />} />
          <Form className="filter-content myform">
            <Row gutter={24}>
              <Col span={8}>
                <Input addonBefore={<p style={styles.label}>{<FormattedMessage id="Log.RequestID" />}</p>} defaultValue="123" disabled />
              </Col>
              <Col span={8}>
                <Input addonBefore={<p style={styles.label}>{<FormattedMessage id="Log.Time" />}</p>} defaultValue="123456" disabled />
              </Col>
              <Col span={8}>
                <Input addonBefore={<p style={styles.label}>{<FormattedMessage id="Log.Interface" />}</p>} defaultValue="123456" disabled />
              </Col>
            </Row>
          </Form>
        </div>

        <div style={styles.infofirst}>
          <Collapse expandIconPosition="right" style={styles.ghost}>
            <Panel header={<h3 style={{ fontSize: 18 }}>{<FormattedMessage id="Log.LogHeader" />}</h3>} key="0" style={styles.panelStyle}>

            </Panel>
          </Collapse>
        </div>
        <div style={styles.info}>
          <Collapse expandIconPosition="right" style={styles.ghost}>
            <Panel header={<h3 style={{ fontSize: 18 }}>{<FormattedMessage id="Log.LogPayload" />}</h3>} key="0" style={styles.panelStyle}>

            </Panel>
          </Collapse>
        </div>
        <div style={styles.info}>
          <Collapse expandIconPosition="right" style={styles.ghost} defaultActiveKey={['0']}>
            <Panel header={<h3 style={{ fontSize: 18 }}>{<FormattedMessage id="Log.ResponseList" />}</h3>} key="0" style={styles.panelStyle}>
              <Tabs defaultActiveKey={this.props.match.params.id}>
                <TabPane tab={<FormattedMessage id="Log.AllResponse" />} key="1">
                  <Tab
                    dataSource={this.toDate(this.state.list)}
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
            </Panel>
          </Collapse>
        </div>
      </div>
    )
  }
}

const styles = {
  label: {
    width: 151,
    textAlign: 'center'
  },
  panelStyle: {
    borderRadius: 4,
    marginBottom: 24,
    border: 0,
    overflow: 'hidden',
  },
  ghost: {
    backgroundColor: 'transparent',
    paddingLeft: 12,
    paddingRight: 12,
    margin: 0,
    border: 0
  },
  infofirst: {
    backgroundColor: '#fff',
    margin: 12,
  },
  info: {
    backgroundColor: '#fff',
    margin: 12,
    marginTop: -12
  }
} as any

export default LogDetail;