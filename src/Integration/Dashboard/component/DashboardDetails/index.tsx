import React, { Component } from 'react';
import { BreadCrumb, Const, Headline, RCi18n, history } from 'qmkit';
import { Button, Input, Modal, Spin, Table, Tabs, Tooltip } from 'antd';
import Information from './components/information';
import Statistics from './components/statistics';
import ReactJson from 'react-json-view';
import * as webapi from '@/Integration/Interface/Interface-detail/webapi'

const { TabPane } = Tabs
const { Search } = Input;

export default class DashboardDetails extends Component<any, any> {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      interfaceId: null,
      detailsTabsKey: 'info',
      visible: false,
      title: '',
      showJson: null,
      logList: [],
      detailInfo: {
      },
    }
  }

  componentDidMount() {
    this.init()
  }
  init = () => {
    const interfaceId = this.props.id
    this.setState({
      interfaceId: +interfaceId
    })
    this.getInterfaceDetail(+interfaceId)
  }
  getInterfaceDetail = (interfaceId) => {
    this.setState({
      loading: true
    })
    let params = {
      interfaceId: interfaceId
    }
    webapi.getInterfaceDetail(params).then(data => {
      const { res } = data
      if (res.code === Const.SUCCESS_CODE) {
        let detailInfo = res.context || {}
        this.setState({
          loading: false,
          detailInfo
        })
      }
      else {
        this.setState({
          loading: false
        })
      }
    }).catch(err => {
      this.setState({
        loading: false
      })
    })
  }


  onDetailTabsChange = (key) => {
    this.setState({ detailsTabsKey: key }, () => {
      if (key === 'log' || key === 'error') {
        let params = {
          interfaceId: +this.state.interfaceId,
          resultFlag: key === 'log' ? null : 2,
          pageSize: 5,
          pageNum: 0,
        }
        this.getLogList(params)
      }
    })
  }


  getLogList = (params) => {
    this.setState({
      loading: true
    })
    webapi.fetchLogList(params).then(data => {
      const { res } = data
      if (res.code === Const.SUCCESS_CODE) {
        let logList = res.context.logList
        this.setState({
          logList,
          loading: false,
        })
      } else {
        this.setState({
          loading: false
        })
      }
    }).catch(err => {
      this.setState({
        loading: false
      })
    })
  }

  openJsonPage = (title, showJson) => {
    this.setState({
      currentTabKey: 'log',
      title,
      showJson,
      visible: true
    })
  }
  openLogDetail = (requestId) => {
    history.push({ pathname: `/log-detail/${requestId}` })
  }
  openLogList = (type) => {
    history.push({ pathname: `/integration-log`, query: { type: type } })
  }

  render() {
    const { loading, interfaceId, detailInfo, detailsTabsKey, logList, showJson, title, visible } = this.state
    const columns = [
      {
        title: RCi18n({ id: 'Log.RequestID' }),
        dataIndex: 'requestId',
        key: 'requestId',
      },
      {
        title: RCi18n({ id: 'Log.Time' }),
        dataIndex: 'invokeTime',
        key: 'invokeTime',
      },
      {
        title: RCi18n({ id: 'Log.InterfaceName' }),
        dataIndex: 'interfaceName',
        key: 'interfaceName',
      },
      {
        title: RCi18n({ id: 'Log.Header' }),
        key: 'header',
        render: (text, record) => (
          <Button type="link" onClick={() => {
            this.openJsonPage(RCi18n({ id: 'Log.Header' }),
              record.param && record.param.header ? record.param.header : {})
          }}>
            {RCi18n({ id: 'Log.Header' })}
          </Button>
        )
      },
      {
        title: RCi18n({ id: 'Log.Payload' }),
        key: 'payload',
        render: (text, record) => (
          <Button type="link" onClick={() => {
            this.openJsonPage(RCi18n({ id: 'Log.Payload' }),
              record.param && record.param.payload ?
                JSON.parse(record.param.payload) : {})
          }}>
            {RCi18n({ id: 'Log.Payload' })}
          </Button>
        )
      },
      {
        title: RCi18n({ id: 'Log.Response' }),
        key: 'response',
        render: (text, record) => (
          <Button type="link" onClick={() => {
            this.openJsonPage(RCi18n({ id: 'Log.Response' }), record.result && record.result.content ?
              JSON.parse(record.result.content) : {})
          }}>
            {RCi18n({ id: 'Log.Response' })}
          </Button>
        )
      },
      {
        title: RCi18n({ id: 'Log.ClientName' }),
        dataIndex: 'clientName',
        key: 'clientName',
      },
      {
        title: '',
        dataIndex: 'detail',
        render: (text, record) => (
          <div>
            <Tooltip placement="top" title={RCi18n({ id: "Product.Details" })}>
              <Button type="link" onClick={() => this.openLogDetail(record.requestId)}>
                <i className="iconfont iconDetails" ></i>
              </Button>

            </Tooltip>
          </div>
        )
      }
    ]
    return (

      <div className="container-info">
        <Spin spinning={loading}>
          <Headline title={detailInfo.name} />
          <Tabs activeKey={detailsTabsKey} onChange={(key) => this.onDetailTabsChange(key)}>
            {/* Information */}
            <TabPane tab={RCi18n({ id: 'Interface.Info' })} key="info">
              <Information detailInfo={detailInfo} />
            </TabPane>
            {/* Statistics */}
            <TabPane tab={RCi18n({ id: "Interface.Statistics" })} key="statistics">
              <Statistics interfaceId={interfaceId} />
            </TabPane>

            {/* All */}
            <TabPane tab={RCi18n({ id: "Interface.Log" })} key="log" >
              <Table
                key="log"
                rowKey="requestId"
                dataSource={logList}
                pagination={false}
                columns={columns}
              />
              <Button type="link"
                onClick={() => this.openLogList('log')}
                style={{ float: 'right', marginTop: 20 }}>{
                  RCi18n({ id: 'Dashboard.Check More' })
                }</Button>
            </TabPane>
            {/* Error */}
            <TabPane tab={RCi18n({ id: "Interface.Error" })} key="error" >
              <Table
                key="error"
                rowKey="requestId"
                pagination={false}
                dataSource={logList}
                columns={columns}
              />
              <Button type="link"
                onClick={() => this.openLogList('error')}
                style={{ float: 'right', marginTop: 20 }}>{
                  RCi18n({ id: 'Dashboard.Check More' })
                }</Button>
            </TabPane>
          </Tabs>
          {/* 表格 */}

          <Modal
            visible={visible}
            width={1050}
            title={title}
            footer={null}
            onCancel={() => this.setState({
              visible: false
            })}
          >

            <ReactJson src={showJson} enableClipboard={false} displayObjectSize={false} displayDataTypes={false} style={{ wordBreak: 'break-all' }} />

          </Modal>
        </Spin>
      </div >


    )
  }
}
