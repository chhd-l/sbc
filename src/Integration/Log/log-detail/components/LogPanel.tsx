import React, { Component } from 'react'
import { Collapse, Tabs, Tooltip } from 'antd'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import ReactJson from 'react-json-view';

import Tab from '@/Integration/components/tab'
import MyTooltip from '@/Integration/components/myTooltip'

const { Panel } = Collapse;
const { TabPane } = Tabs;

// 获取父组件数据源
interface IProps {
  dataList: any,
}


export default class LogPanel extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      activeTableKey: '',
      pagination: {
        current: 1,
        pageSize: 2,
        total: 0
      },
      // 表头
      columns: [
        {
          title: <FormattedMessage id="Log.Time" />,
          dataIndex: 'time',
        },
        {
          title: <FormattedMessage id="Log.ClientName" />,
          dataIndex: 'clientname',
        },
        {
          title: <FormattedMessage id="Log.ClientID" />,
          dataIndex: 'clientid',
        },
        {
          title: <FormattedMessage id="Log.URL" />,
          dataIndex: 'url',
        },
        {
          title: <FormattedMessage id="Log.ResultFlag" />,
          dataIndex: 'resultflag',
        },
        {
          title: <FormattedMessage id="Log.Error" />,
          dataIndex: 'error',
          render: (text, record) => (
            <MyTooltip content={record.errorTip} text={text} />
          )
        },
        {
          title: <FormattedMessage id="Log.Log" />,
          dataIndex: 'log',
          key: 'log',
          render: () => (
            <div>
              <Tooltip placement="top" title="Detail">
                <Link to="/log-response/1">Check</Link>
              </Tooltip>
            </div>
          )
        }
      ],
      // 数据
      list: [
        {
          id: 1,
          time: '2021-06-21 06:45:27.944',
          error: 'Error',
          errorTip: {
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



          }
        },
        {
          id: 2,
          time: '2021-06-21 06:45:27.944',
          error: 'Error',
          errorTip: {
            'code': 'K-050102',

            'message': 'order status has changed, please refresh the page',

            'errorData': null,

            'context': null,

            'defaultLocalDateTime': '2021-05-18 11:35:54.291',

            'i18nParams': null

          }
        }
      ]
    }
  }

  //获取url中的默认显示表格 
  UNSAFE_componentWillMount() {
    this.setState({
      activeTableKey: this.props.activeTableKey,
    })
  }

  //变更表格数据
  onTableChange = (key) => {
    this.initPage()
    this.setState({
      activeTableKey: key,
    });
    if (key == '1') {
      this.getAllResponse();
    } else {
      this.getError();
    };
  }

  //获取Response表格数据
  getAllResponse = () => {
    const data = [
      {
        id: 1,
        time: '2021-05-18 10:35:54.293',
        clientname: 'MuleSoft',
        clientid: 11,
        URl: 'POST /v1/products/inventory',
        resultflag: 'Fail',
        error: 'Error',
        errorTip: {
          'code': 'K-050102',

          'message': 'order status has changed, please refresh the page',

          'errorData': null,

          'context': null,

          'defaultLocalDateTime': '2021-05-18 11:35:54.291',

          'i18nParams': null

        }
      },
    ];
    this.setState({
      list: data
    })
  }

  // 获取Error表格数据
  getError = () => {
    const data = [
      {
        id: 1,
        time: '2021-05-18 10:35:54.293',
        clientname: 'MuleSoft',
        clientid: 1,
        URl: 'POST /v1/products/inventory',
        resultflag: 'Fail',
        error: 'Error',
        errorTip: {
          'code': 'K-050102',

          'message': 'order status has changed, please refresh the page',

          'errorData': null,

          'context': null,

          'defaultLocalDateTime': '2021-05-18 11:35:54.291',

          'i18nParams': null

        }
      },
    ];
    // 处理JSON数据
    this.setState({
      list: data
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

  // 分页
  onSearchPage = (pagination) => {
    this.setState({
      pagination: pagination
    })
  }

  render() {
    const { dataList } = this.props
    return (
      <div>
        <div style={styles.infofirst}>
          <Collapse bordered={false} expandIconPosition="right" style={styles.ghost}>
            <Panel header={<h3 style={{ fontSize: 18 }}>{<FormattedMessage id="Log.LogHeader" />}</h3>} key="0" style={styles.panelStyle}>
              <ReactJson
                src={dataList.header}
                name={false}
                style={{ fontFamily: 'Sans-Serif' }}
                displayDataTypes={false}
                displayObjectSize={false}
                enableClipboard={false}
                collapseStringsAfterLength={180}
              />
            </Panel>
          </Collapse>
        </div>
        <div style={styles.info}>
          <Collapse bordered={false} expandIconPosition="right" style={styles.ghost}>
            <Panel header={<h3 style={{ fontSize: 18 }}>{<FormattedMessage id="Log.LogPayload" />}</h3>} key="0" style={styles.panelStyle}>
              <ReactJson
                src={dataList.payload}
                name={false}
                style={{ fontFamily: 'Sans-Serif' }}
                displayDataTypes={false}
                displayObjectSize={false}
                enableClipboard={false}
                collapseStringsAfterLength={180}
              />
            </Panel>
          </Collapse>
        </div>
        <div style={styles.info}>
          <Collapse bordered={false} expandIconPosition="right" style={styles.ghost} defaultActiveKey={['0']} >
            <Panel header={<h3 style={{ fontSize: 18 }}>{<FormattedMessage id="Log.ResponseList" />}</h3>} key="0" style={styles.panelStyle}>
              <div className="container">
                <Tabs defaultActiveKey={this.state.activeTableKey} onChange={this.onTableChange}>
                  <TabPane tab={<FormattedMessage id="Log.AllResponse" />} key="1" />
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
            </Panel>
          </Collapse>
        </div>
      </div>
    )
  }
}

const styles = {
  panelStyle: {
    borderRadius: 4,
    marginBottom: 24,
    border: 0,
    overflow: 'hidden',
  },
  ghost: {
    backgroundColor: 'transparent',
    paddingLeft: 12,
    paddingRight: 12,
    margin: 0,
    border: 0
  },
  infofirst: {
    backgroundColor: '#fff',
    margin: 12,
  },
  info: {
    backgroundColor: '#fff',
    margin: 12,
    marginTop: -12
  }
} as any