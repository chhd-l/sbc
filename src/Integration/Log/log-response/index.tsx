import React, { Component } from 'react'
import { BreadCrumb, Headline, RCi18n } from 'qmkit'
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom'
import ReactJson from 'react-json-view';

export default class Response extends Component<any, any>{
  constructor(props) {
    super(props);
    this.state = {
      // 数据展示（测试）
      list: [
        {
          id: 1,
          time: '2021-06-21 06:45:27.944',
          error:{

            'time': {

              'x-request-id': 'dc0306ca7ac6582b0ca8560bcdda115a',

              'content-length': '176',

              'country': 'RU',

              'clientid': 'IceROxHgyg0riyVq',

              'x-forwarded-proto': 'https,http',

              'clientsecret': '1lehSUJ8i65rSfY5vSFXjPsqpQB9BJ9X',

              'x-forwarded-port': '443,443',

              'x-correlation-id': 'd232f500-b7c4-11eb-a8fe-0a0b7caf7557',

              'x-forwarded-for': '10.240.2.11,10.240.3.18',

              'forwarded': 'proto=http;host="open.royalcanin.com:443";for="10.240.3.18:50552"',

              'accept': '*/*',

              'x-real-ip': '10.240.2.11',

              'x-forwarded-host': 'open.royalcanin.com:443,open.royalcanin.com:443',

              'host': '10.240.2.21:8690',

              'content-type': 'application/json; charset=UTF-8; skipnullon="everywhere"',

              'x-scheme': 'https',

              'user-agent': 'AHC/1.0'
            }
          }
        }
      ]
    }
  }
  render() {
    return (
      // 面包屑导航
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item><Link to="/log-detail/1/2">{RCi18n({ id: 'Log.RequestDetail' })}</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{RCi18n({ id: 'Log.ResponseLog' })}</Breadcrumb.Item>
        </BreadCrumb>
        {/* Response Log */}
        <div className="container-info">
          <Headline title={RCi18n({ id: 'Log.ResponseLog' })} />
          <div className="container">
            {/* ReactJson插件展示JSON数据 */}
            <ReactJson
              src={this.state.list[0].error}
              name={false}
              style={{ fontFamily: 'Sans-Serif' }}
              displayDataTypes={false}
              displayObjectSize={false}
              enableClipboard={false}
              collapseStringsAfterLength={180}
            />
          </div>
        </div>
      </div>
    )
  }
}