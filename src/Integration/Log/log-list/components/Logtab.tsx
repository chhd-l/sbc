import React, { Component } from 'react';
import { Popover, Tabs, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
import Tab from '@/Integration/components/tab';
import { Link } from 'react-router-dom';
import ReactJson from 'react-json-view';

const { TabPane } = Tabs;

export default class LogTabs extends Component<any, any>{
  constructor(props) {
    super(props);
    this.state = {
      activeTableKey: '1',
      pagination: {
        current: 1,
        pageSize: 5,
        total: 0
      },
      list: [
        {
          id: 0,
          requestid: 1,
          time: '2021-05-18 10:35:54.293',
          intername: 'Price Synchronization',
          header: 'header1',
          payload: {

            'id': '70989930191138816',

            'sn': '70989929016733696',

            'countryCode': 'RU',

            'storeId': 123457907,

            'clientId': 'RHlmpGgZNFe4bfxq',

            'clientName': 'admin',

            'resultFlag': 2,

            'utl': 'POST /v1/products/inventory',

            'payloadMessage': '{"countryCode":"RU","goodsInfoStockDTOS":[{"goodsInfoNo":"25220227HA","stock":10}],"operator":{"account":"admin","adminId":"1053","clientId":"RHlmpGgZNFe4bfxq","clientName":"admin","companyInfoId":1051,"companyType":"NO","ip":"118.143.211.83","name":"admin","platform":"INTEGRATION","services":[],"storeId":"123457907","userId":"RHlmpGgZNFe4bfxq"},"sn":"70989929016733696","storeId":123457907}',

            'resultMessage': 'sku:25220227HA,non-existent',

            'createTime': '2021-06-21 06:45:27.944',

            'ustl': 'POST /v1/products/inventory',

            'payloadsMessage': '{"countryCode":"RU","goodsInfoStockDTOS":[{"goodsInfoNo":"25220227HA","stock":10}],"operator":{"account":"admin","adminId":"1053","clientId":"RHlmpGgZNFe4bfxq","clientName":"admin","companyInfoId":1051,"companyType":"NO","ip":"118.143.211.83","name":"admin","platform":"INTEGRATION","services":[],"storeId":"123457907","userId":"RHlmpGgZNFe4bfxq"},"sn":"70989929016733696","storeId":123457907}',

            'resultMsessage': 'sku:25220227HA,non-existent',

            'createsTime': '2021-06-21 06:45:27.944',

          },
          response: {

            'id': '70989930191138816',

            'sn': '70989929016733696',

            'countryCode': 'RU',

            'storeId': 123457907,

            'clientId': 'RHlmpGgZNFe4bfxq',

            'clientName': 'admin',

            'resultFlag': 2,

            'utl': 'POST /v1/products/inventory',

            'payloadMessage': '{"countryCode":"RU","goodsInfoStockDTOS":[{"goodsInfoNo":"25220227HA","stock":10}],"operator":{"account":"admin","adminId":"1053","clientId":"RHlmpGgZNFe4bfxq","clientName":"admin","companyInfoId":1051,"companyType":"NO","ip":"118.143.211.83","name":"admin","platform":"INTEGRATION","services":[],"storeId":"123457907","userId":"RHlmpGgZNFe4bfxq"},"sn":"70989929016733696","storeId":123457907}',

            'resultMessage': 'sku:25220227HA,non-existent',

            'createTime': '2021-06-21 06:45:27.944',

            'ustl': 'POST /v1/products/inventory',

            'payloadsMessage': '{"countryCode":"RU","goodsInfoStockDTOS":[{"goodsInfoNo":"25220227HA","stock":10}],"operator":{"account":"admin","adminId":"1053","clientId":"RHlmpGgZNFe4bfxq","clientName":"admin","companyInfoId":1051,"companyType":"NO","ip":"118.143.211.83","name":"admin","platform":"INTEGRATION","services":[],"storeId":"123457907","userId":"RHlmpGgZNFe4bfxq"},"sn":"70989929016733696","storeId":123457907}',

            'resultMsessage': 'sku:25220227HA,non-existent',

            'createsTime': '2021-06-21 06:45:27.944',

          },
          clientname: 'MuleSoft'
        },
        {
          id: 1,
          requestid: 2,
          payload: {

            'id': '70989930191138816',

            'sn': '70989929016733696',

            'countryCode': 'RU',

            'storeId': 123457907,

            'clientId': 'RHlmpGgZNFe4bfxq',

            'clientName': 'admin',

            'resultFlag': 2,

            'utl': 'POST /v1/products/inventory',

            'payloadMessage': '{"countryCode":"RU","goodsInfoStockDTOS":[{"goodsInfoNo":"25220227HA","stock":10}],"operator":{"account":"admin","adminId":"1053","clientId":"RHlmpGgZNFe4bfxq","clientName":"admin","companyInfoId":1051,"companyType":"NO","ip":"118.143.211.83","name":"admin","platform":"INTEGRATION","services":[],"storeId":"123457907","userId":"RHlmpGgZNFe4bfxq"},"sn":"70989929016733696","storeId":123457907}',

            'resultMessage': 'sku:25220227HA,non-existent',

            'createTime': '2021-06-21 06:45:27.944',

            'id1': '70989930191138816',

            'sn1': '70989929016733696',

            'cou1ntryCode': 'RU',

            'stor1eId': 123457907,

            'clien1tId': 'RHlmpGgZNFe4bfxq',

            'client1Name': 'admin',

            'resultF1lag': 2,

            'ut1l': 'POST /v1/products/inventory',

            'pay1loadMessage': '{"countryCode":"RU","goodsInfoStockDTOS":[{"goodsInfoNo":"25220227HA","stock":10}],"operator":{"account":"admin","adminId":"1053","clientId":"RHlmpGgZNFe4bfxq","clientName":"admin","companyInfoId":1051,"companyType":"NO","ip":"118.143.211.83","name":"admin","platform":"INTEGRATION","services":[],"storeId":"123457907","userId":"RHlmpGgZNFe4bfxq"},"sn":"70989929016733696","storeId":123457907}',

            'resu1ltMessage': 'sku:25220227HA,non-existent',

            'creat1eTime': '2021-06-21 06:45:27.944',

          },
          response: '{' +

            '\"id\": \"00000000000000000\"' + ',' +

            '\"sn\": \"70989929016733696\"' + ',' +

            '\"countryCode\": \"RU\"' +
            '}'
        }
      ],

      columns: [
        {
          title: <FormattedMessage id="Log.RequestID" />,
          dataIndex: 'requestid',
          key: 'requestid'
        },
        {
          title: <FormattedMessage id="Log.Time" />,
          dataIndex: 'time',
          key: 'time'
        },
        {
          title: <FormattedMessage id="Log.InterfaceName" />,
          dataIndex: 'interfacename',
          key: 'interfacename'
        },
        {
          title: <FormattedMessage id="Log.Header" />,
          dataIndex: 'header',
          key: 'header',

        },
        {
          title: <FormattedMessage id="Log.Payload" />,
          dataIndex: 'payload',
          key: 'payload',
          render: (text, record) => (
            <div className="tabsWarp">
              <Tooltip placement="bottom" trigger="click" overlayClassName="myToolTip" arrowPointAtCenter={true} title={
                <div>
                  <ReactJson
                    src={record.payload}
                    name={false}
                    style={{ fontFamily: 'Sans-Serif' }}
                    displayDataTypes={false}
                    displayObjectSize={false}
                    enableClipboard={false}
                    collapseStringsAfterLength={50} />
                </div>}
              >
                <a>payload</a>
              </Tooltip>
            </div>
          )
        },
        {
          title: <FormattedMessage id="Log.Response" />,
          dataIndex: 'response',
          key: 'response',
          render: (text, record) => (
            <div>
              <Tooltip placement="bottom" title={
                <ReactJson
                  src={record.response}
                  name={false}
                  style={{ fontFamily: 'Sans-Serif' }}
                  displayDataTypes={false}
                  displayObjectSize={false}
                  enableClipboard={false}
                  collapseStringsAfterLength={180} />}>
                <a>R</a>
              </Tooltip>
            </div>
          )
        },
        {
          title: <FormattedMessage id="Log.ClientName" />,
          dataIndex: 'clientname',
          key: 'clientname',
        },
        {
          title: '',
          dataIndex: 'detail',
          render: () => (
            <div>
              <Tooltip placement="top" title="Detail">
                <Link to={'/log-detail/'+ this.state.activeTableKey +'/1'} className="iconfont iconDetails" />
              </Tooltip>
            </div>
          )
        }
      ],
    }
  }

  onTableChange = (key) => {
    this.initPage()
    this.setState({
      activeTableKey: key,
    });
    if (key == '1') {
      this.getAllLog();
    } else {
      this.getError();
    };

  }

  //获取Alllog表格数据
  getAllLog = () => {
    const data = [
      {
        id: 1,
        requestid: 1,
        time: '2021-05-18 10:35:54.293',
        intername: 'Price Synchronization',
        header: 'header1',
        payload: 'payload',
        response: 'asd',
        clientname: 'MuleSoft',
      },
    ];
    this.setState({
      list: JSON.parse(JSON.stringify(data))
    })
  }

  // 获取Error表格数据
  getError = () => {
    const data = [
      {
        id: 2,
        requestid: 222,
        time: '2021-05-18 10:35:54.293',
        intername: 'Price Synchronization',
        header: 'header1',
        payload: 'dasd',
        response: 'dalkshdl',
        clientname: 'MuleSoft',
      }
    ];
    // 处理JSON数据
    this.setState({
      list: JSON.parse(JSON.stringify(data))
    })
  }

  // 初始化分页
  initPage = () => {
    this.setState({
      pagination: {
        current: 1,
        pageSize: 10
      }
    });
  };

  onSearchPage = (pagination) => {
    this.setState({
      pagination: pagination
    })
  }

  render() {
    return (
      <div>
        <Tabs defaultActiveKey={this.state.activeTableKey} onChange={(key) => this.onTableChange(key)} >
          <TabPane tab={<FormattedMessage id="Log.AllLog" />} key="1" />
          <TabPane tab={<FormattedMessage id="Log.Error" />} key="2" />
        </Tabs>
        <Tab
          rowKey={({ id }) => id}
          dataSource={this.state.list}
          pagination={this.state.pagination}
          onChange={this.onSearchPage}
          columns={this.state.columns}
        />
      </div>
    )
  }
}

const styles = {

} as any;
