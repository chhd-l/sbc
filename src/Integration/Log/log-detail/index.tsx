import React, { Component } from 'react'
import { AuthWrapper, BreadCrumb, Const, Headline, RCi18n } from 'qmkit'
import { Breadcrumb, Spin } from 'antd'
import RequestDetail from './components/RequesDetailt'
import ResponseList from './components/ResponseList'
import * as webapi from './webapi'
import '@/Integration/components/index.less'

class LogDetail extends Component<any, any>{
  constructor(props) {
    super(props);
    this.state = {
      detailInfo: {},
      requestId:null,
      responseJsonStr:null
    }
  }
  componentDidMount() {
    this.init()
  }
  init=()=>{
    const requestId = this.props.match.params.id
    this.setState({
      requestId
    })
    this.getLogDetail(requestId)
    
  }

  getLogDetail = (requestId) => {
    this.setState({
      loading: true
    })
    webapi.getLogDetail(requestId).then(data => {
      const { res } = data
      if (res.code === Const.SUCCESS_CODE) {
        let detailInfo = res.context
        let responseJsonStr = res.context.result.content
        this.setState({
          loading: false,
          detailInfo,
          responseJsonStr
        })
      }
      else{
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

  



  render() {
    const { detailInfo, requestId,loading,responseJsonStr } = this.state
    return (
      <AuthWrapper functionName="f_log_details">
        <Spin spinning={loading}>
          {/* 面包屑导航 */}
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>{RCi18n({ id: 'Log.RequestDetail' })}</Breadcrumb.Item>
          </BreadCrumb>
          <div className="container-search">
            <Headline title={RCi18n({ id: 'Log.RequestDetail' })} />
            {/* 跳转后的数据展示 */}
            <RequestDetail detailInfo={detailInfo} />
            <ResponseList  requestId={requestId} showJson={responseJsonStr?JSON.parse(responseJsonStr):{}}/>
          </div>
          
        </Spin>

      </AuthWrapper>
    )
  }
}

export default LogDetail;