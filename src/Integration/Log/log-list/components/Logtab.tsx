import React, { Component } from 'react';
import { Button, Modal, Table, Tabs, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { AuthWrapper, RCi18n } from 'qmkit'
import JsonModal from '@/Integration/components/JsonModal';
import ReactJson from 'react-json-view';

const { TabPane } = Tabs;
export default class LogTabs extends Component<any, any>{
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      title: "",
      showJson: ""
    }
  }

  // 切换分页
  handleTableChange = (pagination: any) => {
    this.props.handlePageChange(pagination)
  }

  // 切换表格，初始化分页，获取数据
  onTabChange = (key) => {
    this.props.handleTabChange(key)
  }

  openJsonPage = (title, showJson) => {
    this.setState({
      title,
      showJson,
      visible: true
    })
  }


  render() {
    const { visible, title, showJson } = this.state
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
        width:'10%'
      },
      {
        title: RCi18n({ id: 'Log.InterfaceName' }),
        dataIndex: 'interfaceName',
        key: 'interfaceName',
        width:'10%'
      },
      {
        title: RCi18n({ id: 'Interface.Provider' }),
        dataIndex: 'providerName',
        key: 'provider',
      },
      {
        title: RCi18n({ id: 'Log.URL' }),
        dataIndex: 'url',
        key: 'url',
        width:'15%'
      },
      {
        title: RCi18n({ id: 'Interface.Method' }),
        dataIndex: 'method',
        key: 'method',
      },

      {
        title: RCi18n({ id: 'Log.Header' }),
        key: 'header',
        render: (text, record) => (
          <Button type="link" style={{ padding: 0 }} onClick={() => {
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
          <Button type="link" style={{ padding: 0 }} onClick={() => {
            this.openJsonPage(RCi18n({ id: 'Log.Payload' }),
              record.param && record.param.payload ?
                JSON.parse(record.param.payload) : {})
          }}>
            {RCi18n({ id: 'Log.Payload' })}</Button>
        )
      },
      {
        title: RCi18n({ id: 'Log.Response' }),
        key: 'response',
        render: (text, record) => (
          <Button type="link" style={{ padding: 0 }} onClick={() => {
            this.openJsonPage(RCi18n({ id: 'Log.Response' }), record.result && record.result.content ?
              JSON.parse(record.result.content) : {})
          }}>
            {RCi18n({ id: 'Log.Response' })}</Button>
        )
      },
      // {
      //   title: RCi18n({ id: 'Log.ClientName' }),
      //   dataIndex: 'clientName',
      //   key: 'clientName',
      // },
      {
        title: '',
        dataIndex: 'detail',
        width: '6%',
        render: (text, record) => (
          <AuthWrapper functionName="f_log_details">
            <Tooltip placement="top" title={RCi18n({ id: "Product.Details" })}>
              <Link to={`/log-detail/${record.requestId}`} className="iconfont iconDetails" />
            </Tooltip>
          </AuthWrapper>
        )
      }
    ]
    return (
      <div>
        <Tabs activeKey={this.props.currentTabKey} onChange={(key) => this.onTabChange(key)} >
          <TabPane tab={RCi18n({ id: 'Log.AllLog' })} key="all" />
          <TabPane tab={RCi18n({ id: 'Log.Error' })} key="error" />
        </Tabs>
        <Table
          rowKey="requestId"
          dataSource={this.props.logList}
          pagination={this.props.pagination}
          onChange={this.handleTableChange}
          columns={columns}
        />

        <JsonModal
          visible={visible}
          title={title}
          showJson={showJson}
          modalCancel={() => this.setState({
            visible: false
          })} />
      </div>
    )
  }
}
