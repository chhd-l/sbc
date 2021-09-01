import { Breadcrumb, Button, Descriptions, Spin, Table } from 'antd'
import { AuthWrapper, BreadCrumb, Const, Headline, RCi18n } from 'qmkit'
import React, { Component } from 'react'
import * as webapi from './../webapi'

export default class OrderMonitorDetails extends Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      detailInfo: {},
      pspDetailList: [],
      exportDetailList: []

    }
  }

  componentDidMount() {
    this.init()
  }
  init = () => {
    const currentId = this.props.match.params.id
    this.setState({
      currentId
    })
    this.getOrderMonitorDetails(currentId)

  }

  getOrderMonitorDetails = (currentId) => {
    this.setState({
      loading: true
    })
    webapi.fetchOrderMonitorDetails({ id: currentId }).then(data => {
      const { res } = data
      if (res.code === Const.SUCCESS_CODE) {
        let detailInfo = res.context
        let pspDetailList = detailInfo.paymentDetails
        let exportDetailList = detailInfo.exportDetails
        this.setState({
          loading: false,
          detailInfo,
          pspDetailList,
          exportDetailList
        })
      }
      else {
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

  openJsonPage = (title, showJson) => {
    this.setState({
      title,
      showJson,
      visible: true
    })
  }

  render() {
    const { detailInfo, loading, pspDetailList, exportDetailList } = this.state
    const PSP_columns = [
      {
        title: RCi18n({ id: 'Order.Time' }),
        dataIndex: 'transactionCreateTime',
        key: 'orderTime',
      },
      {
        title: RCi18n({ id: 'Order.OrderNumber' }),
        dataIndex: 'orderNumber',
        key: 'orderNumber',
      },
      {
        title: RCi18n({ id: 'OrderMonitor.PlatformType' }),
        dataIndex: 'platformType',
        key: 'platformType',
      },
      {
        title: RCi18n({ id: 'Order.paymentStatus' }),
        dataIndex: 'paymentStatus',
        key: 'paymentStatus',
      },
      {
        title: RCi18n({ id: 'Finance.Paymentamount' }),
        dataIndex: 'paymentamount',
        key: 'paymentamount',
      },
      {
        title: RCi18n({ id: 'Setting.currency' }),
        dataIndex: 'currency',
        key: 'currency',
      },
      {
        title: RCi18n({ id: 'OrderMonitor.DisplayTimezone' }),
        dataIndex: 'displayTimezone',
        key: 'displayTimezone',
      },
      {
        title: RCi18n({ id: 'Order.paymentMethod' }),
        dataIndex: 'paymentMethod',
        key: 'paymentMethod',
      },
      {
        title: RCi18n({ id: 'Order.cardType' }),
        dataIndex: 'cardType',
        key: 'cardType',
      },
    ]


    const Export_columns = [
      {
        title: RCi18n({ id: 'Order.Time' }),
        dataIndex: 'exportTime',
        key: 'orderTime',
      },
      {
        title: RCi18n({ id: 'Order.OrderNumber' }),
        dataIndex: 'orderNumber',
        key: 'orderNumber',
      },
      {
        title: RCi18n({ id: 'OrderMonitor.RequestBody' }),
        key: 'requestBody',
        render: (text, record) => (
          <Button type="link" style={{ padding: 0 }} onClick={() => {
            this.openJsonPage(RCi18n({ id: 'OrderMonitor.RequestBody' }), record.requestBody ? record.requestBody : {})
          }}>
            {RCi18n({ id: 'OrderMonitor.RequestBody' })}</Button>
        )
      },
      {
        title: RCi18n({ id: 'OrderMonitor.ResponseBody' }),
        key: 'responseBody',
        render: (text, record) => (
          <Button type="link" style={{ padding: 0 }} onClick={() => {
            this.openJsonPage(RCi18n({ id: 'OrderMonitor.ResponseBody' }), record.responseBody ? record.responseBody : {})
          }}>
            {RCi18n({ id: 'OrderMonitor.ResponseBody' })}</Button>
        )
      },
      {
        title: RCi18n({ id: 'Order.result' }),
        dataIndex: 'resultFlag',
        key: 'result',
      },


    ]
    return (
      <AuthWrapper functionName="f_order_monitor_details">
        <Spin spinning={loading}>
          {/* 面包屑导航 */}
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>{RCi18n({ id: 'OrderMonitor.OrderMonitorDetails' })}</Breadcrumb.Item>
          </BreadCrumb>
          <div className="container-search">
            <Headline title={RCi18n({ id: 'OrderMonitor.OrderMonitorDetails' })} />
            {/* 跳转后的数据展示 */}
            <Descriptions>
              <Descriptions.Item label={RCi18n({ id: 'Order.OrderNumber' })}>
                {detailInfo.orderNumber || ''}
              </Descriptions.Item>
              <Descriptions.Item label={RCi18n({ id: 'Order.OrderStatus' })}>
                {detailInfo.orderStatus || ''}
              </Descriptions.Item>

              <Descriptions.Item label={RCi18n({ id: 'Order.OrderTime' })}>
                {detailInfo.orderDate || ''}
              </Descriptions.Item>
              <Descriptions.Item label={RCi18n({ id: 'Order.paymentStatus' })}>
                {detailInfo.orderPaymentStatus || ''}
              </Descriptions.Item>

              <Descriptions.Item label={RCi18n({ id: 'Order.OrderSource' })}>
                {detailInfo.orderSource || ''}
              </Descriptions.Item>
              <Descriptions.Item label={RCi18n({ id: 'Order.OrderType' })}>
                {detailInfo.orderType || ''}
              </Descriptions.Item>

              <Descriptions.Item label={RCi18n({ id: 'Order.subscriptionType' })}>
                {detailInfo.subscriptionType || ''}
              </Descriptions.Item>
              <Descriptions.Item label={RCi18n({ id: 'Order.paymentMethod' })}>
                {detailInfo.paymentMethod || ''}
              </Descriptions.Item>
            </Descriptions>

          </div>
          <div className="container-search">
            <Headline title={RCi18n({ id: 'Order.PSP' }) + ' ' + RCi18n({ id: 'Order.paymentStatus' })} />
            <Table style={{ paddingRight: 20 }} rowKey="id"
              columns={PSP_columns}
              dataSource={pspDetailList}
              pagination={false}
              scroll={{ x: '100%' }} />
          </div>
          <div className="container-search">
            <Headline title={RCi18n({ id: 'OrderMonitor.ExportDetailList' })} />
            <Table style={{ paddingRight: 20 }} rowKey="id"
              columns={Export_columns}
              dataSource={exportDetailList}
              pagination={false}
              scroll={{ x: '100%' }} />
          </div>

        </Spin>

      </AuthWrapper>
    )
  }
}