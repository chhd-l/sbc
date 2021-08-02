import React, { Component } from 'react';
import { Tabs, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { RCi18n } from 'qmkit'
import Tab from '@/Integration/components/tab';
import MyTooltip from '@/Integration/components/myTooltip';
import * as webapi from '../webapi'

const { TabPane } = Tabs;
export default class LogTabs extends Component<any, any>{
  constructor(props) {
    super(props);
    this.state = {
      activeTableKey: '1',
      // 分页相关信息
      pagination: {
        current: 1,
        pageNum: 0,
        pageSize: 10,
        total: 0
      },
      searchForm: {
        prescriberId: '',
        prescriberName: '',
        phone: '',
        primaryCity: '',
        primaryZip: '',
        prescriberType: '',
        prescriberCode: ''
      },
      // 界面初始数据
      list: [
        {
          id: 0,
          requestid: 1,
          time: '2021-05-18 10:35:54.293',
          intername: 'Price Synchronization',
          header: 'Header',
          headerTip: {

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
          },
          payload: 'JSON',
          response: 'R',
          payloadTip: {

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
          },
          responseTip: {

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
          },
          clientname: 'MuleSoft'
        },
        {
          id: 1,
          requestid: 2,
          paylod: 'JSON',
          response: 'R',
          payloadTip: {

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
          },
          responseTip: {

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
          },
        },
        {
          id: 2,
          requestid: 2,
          paylod: 'JSON',
          response: 'R',
          payloadTip: {

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
          },
          responseTip: {

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
          },
        },
        {
          id: 3,
          requestid: 2,
          paylod: 'JSON',
          response: 'R',
          payloadTip: {

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
          },
          responseTip: {

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
          },
        },
        {
          id: 4,
          requestid: 2,
          paylod: 'JSON',
          response: 'R',
          payloadTip: {

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
          },
          responseTip: {

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
          },
        },
      ],
      // 表头
      columns: [
        {
          title: RCi18n({ id: 'Log.RequestID' }),
          dataIndex: 'prescriberId',
        },
        {
          title: RCi18n({ id: 'Log.Time' }),
          dataIndex: 'prescriberName',
        },
        {
          title: RCi18n({ id: 'Log.InterfaceName' }),
          dataIndex: 'phone',
        },
        {
          title: RCi18n({ id: 'Log.Header' }),
          dataIndex: 'primaryCity',
          render: (text, record) => (
            <MyTooltip content={record.headerTip} text={text} />
          )
        },
        {
          title: RCi18n({ id: 'Log.Payload' }),
          dataIndex: 'primaryZip',
          render: (text, record) => (
            <MyTooltip content={record.payloadTip} text={text} />
          )
        },
        {
          title: RCi18n({ id: 'Log.Response' }),
          dataIndex: 'prescriberType',
          render: (text, record) => (
            <MyTooltip content={record.responseTip} text={text} />
          )
        },
        {
          title: RCi18n({ id: 'Log.ClientName' }),
          dataIndex: 'prescriberCode',
        },
        {
          title: '',
          dataIndex: 'detail',
          render: () => (
            <div>
              <Tooltip placement="top" title="Detail">
                <Link to={'/log-detail/' + this.state.activeTableKey + '/1'} className="iconfont iconDetails" />
              </Tooltip>
            </div>
          )
        }
      ],
    }
    this.getlist(0);
  }

  // 切换分页
  handleTableChange = (pagination: any) => {
    this.setState({
      pagination: pagination
    }, () => {
      this.getlist(0)
    });
  }

  // 切换表格，初始化分页，获取数据
  onTableChange = (key) => {
    this.setState({
      activeTableKey: key,
    }, () => {
      this.getlist(1)
    });
  }

  // 初始化分页
  initPage = () => {
    let obj = {
      current: 1,
      pageNum: 0,
      pageSize: 10
    }
    this.setState({
      pagination: Object.assign(this.state.pagination, obj)
    });
  };

  //分页跳转
  onSearchPage = (pagination) => {
    this.getlist(1)
  }

  // 初始化分页,获取数据
  getlist = (val) => {
    if (val === 1) {
      this.initPage()
    }
    if (this.state.activeTableKey === '1') {
      this.initLog()
    } else {
      this.initError()
    }
  }

  // 获取Log表格数据
  initLog = async () => {
    const { res } = await webapi.fetchLogList({
      ...this.state.searchForm,
      ...this.state.pagination
    });
    let newPagination = Object.assign({}, this.state.pagination);
    let currentLogList = res.context.content || [];
    newPagination.total = res.context.total || 0;
    this.setState({
      pagination: newPagination,
      list: currentLogList
    })
  };

  // 获取Error表格数据
  initError = () => {
    const objx = {
      total: 0,
    }
    this.setState({
      pagination: Object.assign(this.state.pagination, objx),
    })
    this.setState({
      list: [],
    })
  }

  render() {
    return (
      <div>
        <Tabs activeKey={this.state.activeTableKey} onChange={(key) => this.onTableChange(key)} >
          <TabPane tab={RCi18n({ id: 'Log.AllLog' })} key="1" />
          <TabPane tab={RCi18n({ id: 'Log.Error' })} key="2" />
        </Tabs>
        <Tab
          rowKey={({ id }) => id}
          dataSource={this.state.list}
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
          columns={this.state.columns}
        />
      </div>
    )
  }
}
