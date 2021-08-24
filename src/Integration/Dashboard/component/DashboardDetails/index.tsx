import React, { Component } from 'react';
import { BreadCrumb, Const, Headline, RCi18n } from 'qmkit';
import { Button, Input, Modal, Spin, Table, Tabs, Tooltip } from 'antd';
import Information from './components/information';
import Statistics from './components/statistics';
import ReactJson from 'react-json-view';
import * as webapi from '@/Integration/Interface/Interface-detail/webapi'
import { Link } from 'react-router-dom';

const { TabPane } = Tabs
const { Search } = Input;

export default class DashboardDetails extends Component<any, any> {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      interfaceId: null,
      detailsTabsKey: 'info',
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
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
    let params = {
      interfaceId: +interfaceId,
      pageSize: 5,
      pageNum: 0,
    }
    this.getLogList(params)
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
    this.setState({ detailsTabsKey: key })
  }


  getLogList = (params) => {
    this.setState({
      loading: true
    })
    webapi.fetchLogList(params).then(data => {
      const { res } = data
      if (res.code === Const.SUCCESS_CODE) {
        const { pagination } = this.state
        let logList = res.context.logList

        pagination.total = res.context.total
        pagination.current = res.context.currentPage + 1
        this.setState({
          logList,
          loading: false,
          pagination
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



  searchRequest = (value) => {
    const { tableTabsKey, interfaceId } = this.state
    this.setState({
      keywords: value
    })
    let params = {
      interfaceId: interfaceId,
      keys: value ? [value] : [],
      resultFlag: tableTabsKey === 'all' ? null : 2,
      pageSize: 5,
      pageNum: 0,
    }
    this.getLogList(params)
  }
  handlePageChange = (pagination) => {
    const { keywords, tableTabsKey, interfaceId } = this.state
    this.setState({
      pagination
    })
    let params = {
      businessKeys: keywords ? [keywords] : [],
      interfaceId: interfaceId,
      resultFlag: tableTabsKey === 'all' ? null : 2,
      pageSize: pagination.pageSize,
      pageNum: pagination.pageNum,

    }
    this.getLogList(params)
  }
  onTableTabsChange = (key) => {
    const { keywords, interfaceId } = this.state
    this.setState({ tableTabsKey: key })
    let params = {
      businessKeys: keywords ? [keywords] : [],
      interfaceId: interfaceId,
      resultFlag: key === 'all' ? null : 2,
      pageSize: 5,
      pageNum: 0
    }
    this.getLogList(params)
  }

  openJsonPage = (title, showJson) => {
    this.setState({
      currentTabKey: 'all',
      title,
      showJson,
      visible: true
    })
  }

  render() {
    const { loading, interfaceId, detailInfo, detailsTabsKey, pagination, logList, showJson, title, visible } = this.state
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
          <Button type="link" onClick={() => { this.openJsonPage(RCi18n({ id: 'Log.Header' }), record.param.header) }}>{RCi18n({ id: 'Log.Header' })}</Button>
        )
      },
      {
        title: RCi18n({ id: 'Log.Payload' }),
        key: 'payload',
        render: (text, record) => (
          <Button type="link" onClick={() => { this.openJsonPage(RCi18n({ id: 'Log.Payload' }), JSON.parse(record.param.payload)) }}>{RCi18n({ id: 'Log.Payload' })}</Button>
        )
      },
      {
        title: RCi18n({ id: 'Log.Response' }),
        key: 'response',
        render: (text, record) => (
          <Button type="link" onClick={() => { this.openJsonPage(RCi18n({ id: 'Log.Response' }), JSON.parse(record.result.content)) }}>{RCi18n({ id: 'Log.Response' })}</Button>
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
              1
              {/* <Link to={`/log-detail/${record.requestId}`} className="iconfont iconDetails" /> */}
            </Tooltip>
          </div>
        )
      }
    ]
    return (

      <div className="container-info">
        <Spin spinning={loading}>
          <Headline title={detailInfo.name} />
          <Tabs defaultActiveKey={detailsTabsKey} onChange={(key) => this.onDetailTabsChange(key)}>
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
              <Search
                placeholder="keywords"
                onSearch={value => this.searchRequest(value)}
                style={{ width: 200, marginBottom: 20 }}
              />
              <Table
                key="log"
                rowKey="id"
                dataSource={logList}
                pagination={pagination}
                onChange={this.handlePageChange}
                columns={columns}
              />
            </TabPane>
            {/* Error */}
            <TabPane tab={RCi18n({ id: "Interface.Error" })} key="error" >
              <Search
                placeholder="keywords"
                onSearch={value => this.searchRequest(value)}
                style={{ width: 200, marginBottom: 20 }}
              />
              <Table
                key="error"
                rowKey="id"
                dataSource={logList}
                pagination={pagination}
                onChange={this.handlePageChange}
                columns={columns}
              />
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
