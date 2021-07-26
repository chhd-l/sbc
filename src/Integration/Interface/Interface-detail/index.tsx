import React, { Component } from 'react';
import { BreadCrumb, Headline } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Breadcrumb, Tabs, Tooltip } from 'antd';
import Information from '@/Integration/components/Information';
import Tab from '@/Integration/components/tab';
import Statistics from '@/Integration/components/Statistics';
import '@/Integration/components/index.less';
import { Link } from 'react-router-dom';

const { TabPane } = Tabs;
import ReactJson from 'react-json-view';

export default class InterfaceView extends Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      activeKey: '1',
      activeTableKey: '0',
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      dataSource: [{
        RequestID: 1,
        id: 1,
        Header: 'Header',
        Payload: 'Payload',
        Response: 'Response'
      }],
      a: {

        'header': {

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
      b: '{\n' +
        '\n' +
        '                "id": "70989930191138816",\n' +
        '\n' +
        '                "sn": "70989929016733696",\n' +
        '\n' +
        '                "countryCode": "RU",\n' +
        '\n' +
        '                "storeId": 123457907,\n' +
        '\n' +
        '                "clientId": "RHlmpGgZNFe4bfxq",\n' +
        '\n' +
        '                "clientName": "admin",\n' +
        '\n' +
        '                "resultFlag": 2,\n' +
        '\n' +
        '                "utl": "POST /v1/products/inventory",\n' +
        '\n' +
        '                "payloadMessage": "{\\"countryCode\\":\\"RU\\",\\"goodsInfoStockDTOS\\":[{\\"goodsInfoNo\\":\\"25220227HA\\",\\"stock\\":10}],\\"operator\\":{\\"account\\":\\"admin\\",\\"adminId\\":\\"1053\\",\\"clientId\\":\\"RHlmpGgZNFe4bfxq\\",\\"clientName\\":\\"admin\\",\\"companyInfoId\\":1051,\\"companyType\\":\\"NO\\",\\"ip\\":\\"118.143.211.83\\",\\"name\\":\\"admin\\",\\"platform\\":\\"INTEGRATION\\",\\"services\\":[],\\"storeId\\":\\"123457907\\",\\"userId\\":\\"RHlmpGgZNFe4bfxq\\"},\\"sn\\":\\"70989929016733696\\",\\"storeId\\":123457907}",\n' +
        '\n' +
        '                "resultMessage": "sku:25220227HA,non-existent",\n' +
        '\n' +
        '                "createTime": "2021-06-21 06:45:27.944"\n' +
        '\n' +
        '            }',
      infoList: {
        InterfaceID: 10001,
        URL: '/v1/products/price',
        System: 'Navision',
        MiddleLayer: 'MuleSoft',
        Method: 'POST',
        Type: 'asycn',
        Provider: 'FGS',
        Invoker: 'Navision',
        DataFlow: 'Navision to FGS',
        Function: 'Batch product price sychronization',
        Uptime: 'Uptime'
      },
      columns: [
        {
          title: <FormattedMessage id="Interface.RequestID" />,
          dataIndex: 'RequestID'
        },
        {
          title: <FormattedMessage id="Interface.Time" />,
          dataIndex: 'Time'
        },
        {
          title: <FormattedMessage id="Interface.Header" />,
          dataIndex: 'Header',
          render: (text, record) => (
            <div>
              <Tooltip placement="top" title={<FormattedMessage id="Interface.search" />}>
                <a>{text}</a>
              </Tooltip>
            </div>
          )
        },
        {
          title: <FormattedMessage id="Interface.Payload" />,
          dataIndex: 'Payload',
          render: (text, record) => (
            <div>
              <Tooltip placement="top" title={record.text}>
                <a>{text}</a>
              </Tooltip>
            </div>
          )
        },
        {
          title: <FormattedMessage id="Interface.Response" />,
          dataIndex: 'Response',
          render: (text, record) => (
            <div>
              <Tooltip placement="top" title={<FormattedMessage id="Interface.search" />}>
                <a>{text}</a>
              </Tooltip>
            </div>
          )
        },
        {
          title: <FormattedMessage id="Interface.ClientName" />,
          dataIndex: 'ClientName'
        },
        {
          title: '',
          dataIndex: '',
          render: (text, record) => (
            <div>
              <Tooltip placement="top" title={<FormattedMessage id="Interface.search" />}>
                <Link to="/interface-detail" className="iconfont iconaudit" />
              </Tooltip>
            </div>
          )
        }

      ]
    };
  }

  componentDidMount() {
    console.log(this.props.location.state);
  }


  // 点击切换info/stack
  onStateTabChange = (key) => {
    this.setState({
      activeKey: key
    });
  };
  // 点击切换表格数据
  onStateTableChange = (key) => {
    this.initPage();
    this.setState({
      activeTableKey: key
    });
    if (key === '0') { // All Requests
      this.getAllRequests();
    } else { // error
      this.getError();
    }
  };
  // 获取AllRequests列表
  getAllRequests = () => {

  };
  // 获取error列表
  getError = () => {

  };
  /**
   * 点击分页
   * @param pagination
   */
  onSearchPage = (pagination) => {
    this.setState({
      pagination
    });
  };
  // 初始化分页
  initPage = () => {
    this.setState({
      pagination: {
        current: 1,
        pageSize: 10
      }
    });
  };

  render() {
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{<FormattedMessage id="Interface.PriceSynchronization" />}</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container-info">
          <Headline title={<FormattedMessage id="Interface.PriceSynchronization" />} />
          <Tabs defaultActiveKey={this.state.activeKey} onChange={(key) => this.onStateTabChange(key)}>
            {/* Information */}
            <TabPane tab={<FormattedMessage id="Interface.Information" />} key="0">
              <Information infoList={this.state.infoList} />
            </TabPane>
            {/* Statistics */}
            <TabPane tab={<FormattedMessage id="Interface.Statistics" />} key="1">
              <Statistics />
            </TabPane>
          </Tabs>
        </div>
        {
          this.state.activeKey === '0' ? (
            <div className="container">
              <Tabs defaultActiveKey={this.state.activeTableKey} onChange={(key) => this.onStateTableChange(key)}>
                {/* Information */}
                <TabPane tab={<FormattedMessage id="Interface.AllRequests" />} key="0" />
                {/* Statistics */}
                <TabPane tab={<FormattedMessage id="Interface.Error" />} key="1" />
              </Tabs>
              {/* 表格 */}
              <Tab
                rowKey={({ id }) => id}
                dataSource={this.state.dataSource}
                pagination={this.state.pagination}
                onChange={this.onSearchPage}
                columns={this.state.columns}
              />
            </div>
          ) : null
        }
      </div>
    );
  }
}
