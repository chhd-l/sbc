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

            'createTime': '2021-06-21 06:45:27.944'

        },
          response:  '{' +

          '\"id\": \"70989930191138816\"' + ',' +

          '\"sn\": \"70989929016733696\"' + ',' +

          '\"countryCode\": \"RU\"' +
          '}',
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

            'createTime': '2021-06-21 06:45:27.944'

        },
          response:  '{' +

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
            <div>
              <Popover placement="bottom" title={
                <ReactJson
                  src={record.payload}
                  name={false}
                  style={{ fontFamily: 'Sans-Serif'}}
                  displayDataTypes={false}
                  displayObjectSize={false}
                  enableClipboard={false}
                  collapseStringsAfterLength={180} />}>
                <a>payload</a>
              </Popover>
            </div>
          )
        },
        {
          title: <FormattedMessage id="Log.Response" />,
          dataIndex: 'response',
          key: 'response',
          render: (text, record) => (
            <div>
              <Popover placement="bottom" title={
                <ReactJson
                  src={JSON.parse(record.response)}
                  name={false}
                  style={{ fontFamily: 'Sans-Serif' }}
                  displayDataTypes={false}
                  displayObjectSize={false}
                  enableClipboard={false}
                  collapseStringsAfterLength={180} />}>
                <a>R</a>
              </Popover>
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
                <Link to={'/log-detail/2/1'} className="iconfont iconDetails" />
              </Tooltip>
            </div>
          )
        }
      ],
    }
  }

  onSearchPage = (pagination) => {
    this.setState({
      pagination: pagination
    })
  }

  render() {
    return (
      <Tabs defaultActiveKey="1" >
        <TabPane tab={<FormattedMessage id="Log.AllLog" />} key="1">
          <Tab
            dataSource={this.state.list}
            pagination={this.state.pagination}
            onChange={this.onSearchPage}
            columns={this.state.columns}
          />
        </TabPane>
      </Tabs>
    )
  }
}

const styles = {

} as any;
