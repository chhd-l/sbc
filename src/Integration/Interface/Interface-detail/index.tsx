import React, { Component } from 'react';
import { AuthWrapper, BreadCrumb, Const, Headline, RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Breadcrumb, Button, Input, Modal, Spin, Tabs, Tooltip } from 'antd';
import Information from './components/Information';
import Tab from '@/Integration/components/tab';
import Statistics from './components/Statistics';
import '@/Integration/components/index.less';
import { Link } from 'react-router-dom';
import * as webapi from './webapi'
import ReactJson from 'react-json-view';

const { TabPane } = Tabs;
const { Search } = Input;

export default class InterfaceView extends Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      interfaceId: null,
      detailsTabsKey: 'information',
      tableTabsKey: 'all',
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
  };
  componentDidMount() {
    this.init()
  }
  init = () => {
    const interfaceId = this.props.match.params.id
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
    if (this.props.location.query && this.props.location.query.type) {
      this.setState({
        detailsTabsKey: this.props.location.query.type
      })
    }

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
    const { loading, detailsTabsKey, tableTabsKey, detailInfo, visible, title, showJson, pagination, logList, interfaceId } = this.state
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
      {
        title: RCi18n({ id: 'Log.ClientName' }),
        dataIndex: 'clientName',
        key: 'clientName',
      },
      {
        title: '',
        dataIndex: 'detail',
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
      <AuthWrapper functionName="f_interface_details">
        <Spin spinning={loading} indicator={<img className="spinner"
          src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif"
          style={{ width: '90px', height: '90px' }} alt="" />}>


          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>{detailInfo.name}</Breadcrumb.Item>
          </BreadCrumb>
          <div className="container-info">
            <Headline title={detailInfo.name} />
            <Tabs activeKey={detailsTabsKey} onChange={(key) => this.onDetailTabsChange(key)}>
              {/* Information */}
              <TabPane tab={<FormattedMessage id="Interface.Information" />} key="information">
                <Information detailInfo={detailInfo} />
              </TabPane>
              {/* Statistics */}
              <TabPane tab={<FormattedMessage id="Interface.Statistics" />} key="statistics">
                <Statistics interfaceId={interfaceId} />
              </TabPane>
            </Tabs>
          </div>
          {
            detailsTabsKey === 'information' ? (
              <div className="container">
                <Tabs defaultActiveKey={tableTabsKey} onChange={(key) => this.onTableTabsChange(key)}>
                  {/* All */}
                  <TabPane tab={<FormattedMessage id="Interface.AllRequests" />} key="all" />
                  {/* Error */}
                  <TabPane tab={<FormattedMessage id="Interface.Error" />} key="error" />
                </Tabs>
                {/* 表格 */}
                <Search
                  placeholder="keywords"
                  onSearch={value => this.searchRequest(value)}
                  style={{ width: 200, marginBottom: 20 }}
                />
                <Tab
                  rowKey="requestId"
                  dataSource={logList}
                  pagination={pagination}
                  onChange={this.handlePageChange}
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
            ) : null
          }
        </Spin>
      </AuthWrapper>
    );
  }
}
