import React, { Component } from 'react'
import { BreadCrumb, Headline } from 'qmkit'
import { FormattedMessage } from 'react-intl'
import { Breadcrumb} from 'antd'
import RequestDetail from './components/RequesDetailt'
import LogPanel from './components/LogPanel'

import '@/Integration/components/index.less'
import './index.less'


class LogDetail extends Component<any, any>{
  constructor(props) {
    super(props);
  }

  getTablelist(value){
    this.setState({
      activeTableList:value,
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
          {/* 跳转后的数据展示 */}
          <RequestDetail />
        </div>
        {/* Logpanel及表格 */}
        <LogPanel activeTableKey = {this.props.match.params.tablekey} />
      </div>
    )
  }
}

export default LogDetail;