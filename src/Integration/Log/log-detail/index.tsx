import React, { Component } from 'react'
import { BreadCrumb, Headline, RCi18n } from 'qmkit'
import { Breadcrumb } from 'antd'
import RequestDetail from './components/RequesDetailt'
import LogPanel from './components/LogPanel'
import '@/Integration/components/index.less'

class LogDetail extends Component<any, any>{
  constructor(props) {
    super(props);
    this.state = {
      // 传至子组件的初始数据源
      logList: {
        requestId: 123,
        time: 12345,
        interface: 1234567,
        header: {
          'code': 'K-050102',

          'message': 'order status has changed, please refresh the page',

          'errorData': null,

          'context': null,

          'defaultLocalDateTime': '2021-05-18 11:35:54.291',

          'i18nParams': null,
          'co1de': 'K-050102',

          'mess1age': 'order status has changed, please refresh the page',

          'error1Data': null,

          'cont1ext': null,

          'defau1ltLocalDateTime': '2021-05-18 11:35:54.291',

          'i18nP1arams': null,

          'co3de': 'K-050102',

          'me2ssage': 'order status has changed, please refresh the page',

          'err2orData': null,

          'cont2ext': null,

          'defau2ltLocalDateTime': '2021-05-18 11:35:54.291',

          'i18nwParams': null
        },
        payload: {
          'mess1age': 'order status has changed, please refresh the page',

          'error1Data': null,

          'cont1ext': null,

          'defau1ltLocalDateTime': '2021-05-18 11:35:54.291',

          'i18nP1arams': null,

          'co3de': 'K-050102',

          'me2ssage': 'order status has changed, please refresh the page',

          'err2orData': null,

          'cont2ext': null,

          'defau2ltLocalDateTime': '2021-05-18 11:35:54.291',

          'i18nwParams': null
        }
      }
    }
  }

  render() {
    return (
      <div>
        {/* 面包屑导航 */}
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{RCi18n({id:'Log.RequestDetail'})}</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container-search">
          <Headline title={RCi18n({id:'Log.RequestDetail'})} />
          {/* 跳转后的数据展示 */}
          <RequestDetail datalist={this.state.logList} />
        </div>
        {/* Logpanel及表格展示 */}
        <LogPanel activeTableKey={this.props.match.params.tablekey} dataList={this.state.logList} />
      </div>
    )
  }
}

export default LogDetail;