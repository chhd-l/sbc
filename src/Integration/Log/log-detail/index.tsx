import React, { Component } from 'react'
import { BreadCrumb, Headline } from 'qmkit'
import { FormattedMessage } from 'react-intl'
import { Breadcrumb, Popover, Collapse, Tooltip, Tabs } from 'antd'
import ReactJson from 'react-json-view'
import Tab from '@/Integration/components/tab'
import { Link } from 'react-router-dom'
import '@/Integration/components/index.less'
import RequestDetail from './components/RequesDetailt'
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
          key: 'error',
          render: (text, record) => (
            <Popover placement="bottom" content={<ReactJson src={JSON.parse(record.error)}
              name={false}
              style={{ fontFamily: 'Sans-Serif' }}
              displayDataTypes={false}
              displayObjectSize={false}
              enableClipboard={false}
              collapseStringsAfterLength={180} />}>
              <a>Error</a>
            </Popover>
          )
        },
        {
          title: <FormattedMessage id="Log.Log" />,
          dataIndex: 'log',
          key: 'log',
          render: () => (
            <div>
              <Tooltip placement="top" title="Detail">
                <Link to="/log-response/1">Check</Link>
              </Tooltip>
            </div>
          )
        }
      ],
      list: [
        {
          id: 1,
          time: '2021-06-21 06:45:27.944',
          error: '{' +

            '\"id\": \"70989930191138816\"' + ',' +

            '\"sn\": \"70989929016733696\"' + ',' +

            '\"countryCode\": \"RU\"' +
            '}'
        },
        {
          id: 2,
          time: '2021-06-21 06:45:27.944',
          error: '{' +

            '\"id\": \"0000000000000000\"' + ',' +

            '\"sn\": \"70989929016733696\"' + ',' +

            '\"countryCode\": \"RU\"' +
            '}'
        }
      ]
    }
  }


  onSearchPage = (pagination) => {
    this.setState({
      pagination: pagination
    })
  }

  render() {
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{<FormattedMessage id="Log.RequestDetail" />}</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container-search">
          <Headline title={<FormattedMessage id="Log.RequestDetail" />} />
          <RequestDetail />
        </div>

        <div style={styles.infofirst}>
          <Collapse bordered={false} expandIconPosition="right" style={styles.ghost}>
            <Panel header={<h3 style={{ fontSize: 18 }}>{<FormattedMessage id="Log.LogHeader" />}</h3>} key="0" style={styles.panelStyle}>

            </Panel>
          </Collapse>
        </div>
        <div style={styles.info}>
          <Collapse bordered={false} expandIconPosition="right" style={styles.ghost}>
            <Panel header={<h3 style={{ fontSize: 18 }}>{<FormattedMessage id="Log.LogPayload" />}</h3>} key="0" style={styles.panelStyle}>

            </Panel>
          </Collapse>
        </div>
        <div style={styles.info}>
          <Collapse bordered={false} expandIconPosition="right" style={styles.ghost} defaultActiveKey={['0']}>
            <Panel header={<h3 style={{ fontSize: 18 }}>{<FormattedMessage id="Log.ResponseList" />}</h3>} key="0" style={styles.panelStyle}>
              <Tabs defaultActiveKey={this.props.match.params.tablelist}>
                <TabPane tab={<FormattedMessage id="Log.AllResponse" />} key="1">
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