import React, { Component } from 'react'
import { Headline, BreadCrumb, RCi18n, Const, AuthWrapper } from 'qmkit';
import LogSearch from './components/LogSearch'
import LogTabs from './components/Logtab';
import * as webapi from './webapi'
import '@/Integration/components/index.less';
import { message, Spin } from 'antd';

export default class Loglist extends Component<any, any>{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      searchForm: {
        startDate: null,
        endDate: null,
        interface: null,
        requestId: null,
        system: null,
        keywords: null
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      currentTabKey: 'all',

      logList: [],

    };
  }
  componentDidMount() {
    this.init()
  }

  init = () => {
    if (this.props.location.query && this.props.location.query.type) {
      this.setState({
        currentTabKey: this.props.location.query.type === 'error' ? 'error' : 'all'
      }, () => {
        let params = {
          pageSize: 10,
          pageNum: 0,
          resultFlag: this.state.currentTabKey === 'all' ? null : 2,
        }
        this.getLogList(params)
      })
    }
    else{
      let params = {
        pageSize: 10,
        pageNum: 0,
        resultFlag: this.state.currentTabKey === 'all' ? null : 2,
      }
      this.getLogList(params)
    }
    
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

  searchLogList = (searchForm) => {
    const { currentTabKey } = this.state
    this.setState({
      searchForm
    })
    let params = {
      businessKeys: searchForm.keywords ? [searchForm.keywords] : [],
      interfaceIds: searchForm.interface ? [searchForm.interface] : [],
      requestIds: searchForm.requestId ? [searchForm.requestId] : [],
      systemIds: searchForm.system ? [searchForm.system] : [],
      startTime: searchForm.startDate ? searchForm.startDate + " 00:00:00" : null,
      endTime: searchForm.endDate ? searchForm.endDate + " 23:59:59" : null,
      resultFlag: currentTabKey === 'all' ? null : 2,
      pageSize: 10,
      pageNum: 0
    }
    this.getLogList(params)
  }
  handlePageChange = (pagination) => {
    const { searchForm, currentTabKey } = this.state
    this.setState({
      pagination
    })
    let params = {
      businessKeys: searchForm.keywords ? [searchForm.keywords] : [],
      interfaceIds: searchForm.interface ? [searchForm.interface] : [],
      requestIds: searchForm.requestId ? [searchForm.requestId] : [],
      systemIds: searchForm.system ? [searchForm.system] : [],
      startTime: searchForm.startDate ? searchForm.startDate + " 00:00:00" : null,
      endTime: searchForm.endDate ? searchForm.endDate + " 23:59:59" : null,
      resultFlag: currentTabKey === 'all' ? null : 2,
      pageSize: pagination.pageSize,
      pageNum: pagination.current - 1,

    }
    this.getLogList(params)
  }
  handleTabChange = (key) => {
    const { searchForm,pagination } = this.state
    this.setState({ currentTabKey: key })
    let params = {
      businessKeys: searchForm.keywords ? [searchForm.keywords] : [],
      interfaceIds: searchForm.interface ? [searchForm.interface] : [],
      requestIds: searchForm.requestId ? [searchForm.requestId] : [],
      systemIds: searchForm.system ? [searchForm.system] : [],
      startTime: searchForm.startDate ? searchForm.startDate + " 00:00:00" : null,
      endTime: searchForm.endDate ? searchForm.endDate + " 23:59:59" : null,
      resultFlag: key === 'all' ? null : 2,
      pageSize: pagination.pageSize,
      pageNum: pagination.current-1
    }
    this.getLogList(params)
  }


  render() {
    const { loading, logList, pagination, currentTabKey } = this.state
    return (
      <AuthWrapper functionName="f_log_list">
        <Spin spinning={loading}>
          <BreadCrumb thirdLevel={true} />
          <div className="container-search">
            <Headline title={RCi18n({ id: 'Log.LogSearch' })} />
            {/* ?????? */}
            <LogSearch searchLogList={this.searchLogList} />
          </div>
          <div className="container">
            {/* Log???Error?????? */}
            <LogTabs currentTabKey={currentTabKey}
              logList={logList}
              pagination={pagination}
              handlePageChange={this.handlePageChange}
              handleTabChange={this.handleTabChange} />
          </div>
        </Spin>

      </AuthWrapper>
    )
  }
}

const styles = {
  label: {
    width: 151,
    textAlign: 'center',
  }
} as any
