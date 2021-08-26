import React, { Component } from 'react'
import { Input, Collapse, Tabs, Button, Modal } from 'antd';
import { AuthWrapper, Const, RCi18n } from 'qmkit';
import ReactJson from 'react-json-view';
import Tab from '@/Integration/components/tab'
import * as webapi from '../webapi'


const { Panel } = Collapse;
const { TabPane } = Tabs;
const { Search } = Input;

export default class ResponseList extends Component<any, any>{
  constructor(props) {
    super(props);
    this.state = {
      // 分页数据
      visible: false,
      title: "",
      showJson: "",
      responseList: [],
      currentTabKey: 'all',
      pagination: {
        current: 1,
        pageSize: 5,
        total: 0
      },
      keywords: '',
    }
  }
  componentDidMount() {
    let params = {
      requestId: this.props.requestId,
      pageSize: 5,
      pageNum: 0
    }

    this.getResponseList(params)
  }

  getResponseList = (params) => {
    this.setState({
      loading: true
    })
    webapi.fetchResponseList(params).then(data => {
      const { res } = data
      if (res.code === Const.SUCCESS_CODE) {
        const { pagination } = this.state
        pagination.total = res.context.total
        pagination.current = res.context.currentPage+1
        let responseList = res.context.responseLogList
        this.setState({
          loading: false,
          responseList,
          pagination
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

  // 切换分页
  handleTableChange = (pagination: any) => {
    const { currentTabKey, keywords } = this.state
    this.setState({
      pagination
    })
    let params = {
      requestId: this.props.requestId,
      keys: keywords ? [keywords] : [],
      resultFlag: currentTabKey === 'all' ? null : 2,
      pageSize: pagination.pageSize,
      pageNum: pagination.pageNum,
    }
    this.getResponseList(params)
  }

  // 切换表格，初始化分页，获取数据
  onTabChange = (key) => {
    const { pagination, keywords } = this.state
    this.setState({
      currentTabKey: key
    })
    let params = {
      requestId: this.props.requestId,
      keys: keywords ? [keywords] : [],
      resultFlag: key === 'all' ? null : 2,
      pageSize: pagination.pageSize,
      pageNum: 0,
    }
    this.getResponseList(params)
  }

  openJsonPage = (title, showJson) => {
    this.setState({
      currentTabKey: 'all',
      title,
      showJson,
      visible: true
    })
  }
  searchResponse = (value) => {
    const { currentTabKey } = this.state
    this.setState({
      keywords: value
    })
    let params = {
      requestId: this.props.requestId,
      keys: value ? [value] : [],
      resultFlag: currentTabKey === 'all' ? null : 2,
      pageSize: 5,
      pageNum: 0,
    }
    this.getResponseList(params)
  }
  render() {
    const { visible, title, showJson, currentTabKey, pagination, responseList } = this.state


    const columns = [
      {
        title: RCi18n({ id: 'Log.Time' }),
        dataIndex: 'createdTime',
        key: 'createdTime',
      },
      {
        title: RCi18n({ id: 'Log.ClientName' }),
        dataIndex: 'clientName',
        key: 'clientName',
      },
      {
        title: RCi18n({ id: 'Log.ClientID' }),
        dataIndex: 'clientId',
        key: 'clientId',
      },
      {
        title: RCi18n({ id: 'Log.URL' }),
        dataIndex: 'utl',
        key: 'url',
      },
      {
        title: RCi18n({ id: 'Log.ResultFlag' }),
        dataIndex: 'resultFlag',
        key: 'resultFlag',
        render: (text, record) => (
          <p>
            {
              +text === 1 ? RCi18n({ id: 'Log.Success' }) : RCi18n({ id: 'Log.Fail' })
            }
          </p>
        )

      },
      {
        title: RCi18n({ id: 'Log.ResultMessage' }),
        dataIndex: 'error',
        render: (text, record) => (
          <Button type="link"
            onClick={() => {
              this.openJsonPage(RCi18n({ id: 'Log.ResultMessage' }),
              record.resultMessage? JSON.parse(record.resultMessage):{})
            }}>
            {RCi18n({ id: 'Log.ResultMessage' })}</Button>

        )
      },
      {
        title: RCi18n({ id: 'Log.Log' }),
        dataIndex: 'log',
        key: 'log',
        render: (text, record) => (
          <Button type="link"
            onClick={() => {
              this.openJsonPage(RCi18n({ id: 'Log.Log' }),
              record.resultMessage?JSON.parse(record.payloadMessage):{})
            }}>
            {RCi18n({ id: 'Log.Log' })}</Button>
        )
      }
    ]
    return (
      <AuthWrapper functionName="f_pet_owner_tagging">
      {/* <AuthWrapper functionName="f_log_detail_response"> */}
        <div style={styles.info}>
          <Collapse bordered={false} expandIconPosition="right" style={styles.ghost} defaultActiveKey={['0']} >
            <Panel header={<h3 style={{ fontSize: 18 }}>{RCi18n({ id: 'Log.ResponseList' })}</h3>} key="0" style={styles.panelStyle}>
              <div className="container">
                <Search
                  placeholder="keywords"
                  onSearch={value => this.searchResponse(value)}
                  style={{ width: 200, marginBottom: 20 }}
                />

                <Tabs defaultActiveKey={currentTabKey} onChange={this.onTabChange}>
                  <TabPane tab={RCi18n({ id: 'Log.AllResponse' })} key="all" />
                  <TabPane tab={RCi18n({ id: 'Log.Error' })} key="error" />
                </Tabs>
                <Tab
                  rowKey={({ id }) => id}
                  dataSource={responseList}
                  pagination={pagination}
                  onChange={this.handleTableChange}
                  columns={columns}
                />
              </div>
            </Panel>
          </Collapse>
        </div>

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

      </AuthWrapper>

    )
  }
}

const styles = {
  label: {
    width: 151,
    textAlign: 'center'
  }
} as any