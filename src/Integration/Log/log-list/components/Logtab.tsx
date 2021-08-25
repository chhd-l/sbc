import React, { Component } from 'react';
import { Button, Modal, Tabs, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { RCi18n } from 'qmkit'
import Tab from '@/Integration/components/tab';
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
          <Button type="link" onClick={() => { this.openJsonPage(RCi18n({ id: 'Log.Header' }), record.param.header||{}) }}>{RCi18n({ id: 'Log.Header' })}</Button>
        )
      },
      {
        title: RCi18n({ id: 'Log.Payload' }),
        key: 'payload',
        render: (text, record) => (
          <Button type="link" onClick={() => { this.openJsonPage(RCi18n({ id: 'Log.Payload' }), JSON.parse(record.param.payload)||{}) }}>{RCi18n({ id: 'Log.Payload' })}</Button>
        )
      },
      {
        title: RCi18n({ id: 'Log.Response' }),
        key: 'response',
        render: (text, record) => (
          <Button type="link" onClick={() => { this.openJsonPage(RCi18n({ id: 'Log.Response' }), JSON.parse(record.result.content)||{}) }}>{RCi18n({ id: 'Log.Response' })}</Button>
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
            <Tooltip placement="top" title={RCi18n({id:"Product.Details"})}>
              <Link to={`/log-detail/${record.requestId}`} className="iconfont iconDetails" />
            </Tooltip>
          </div>
        )
      }
    ]
    return (
      <div>
        <Tabs activeKey={this.props.currentTabKey} onChange={(key) => this.onTabChange(key)} >
          <TabPane tab={RCi18n({ id: 'Log.AllLog' })} key="all" />
          <TabPane tab={RCi18n({ id: 'Log.Error' })} key="error" />
        </Tabs>
        <Tab
          rowKey="requestId"
          dataSource={this.props.logList}
          pagination={this.props.pagination}
          onChange={this.handleTableChange}
          columns={columns}
        />
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
      </div>
    )
  }
}
