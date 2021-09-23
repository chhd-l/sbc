import { left } from '@antv/x6/lib/registry/port-layout/line';
import { Button, Col, DatePicker, Form, Input, message, Modal, Popconfirm, Row, Select, Spin, Table, Tooltip } from 'antd';
import moment from 'moment';
import { AuthWrapper, BreadCrumb, Const, Headline, RCi18n, util } from 'qmkit';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as webapi from './../webapi'



const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group
const { RangePicker } = DatePicker;

export default class OrderMonitorList extends Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      searchForm: {
        orderNumber: '',
        startDate: null,
        endDate: null,
        exceptionType: null,
        orderExportStatus: null
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      exceptionTypeList: [],
      monitorList: [],
      currentSearchForm: {},
      visible: false,
      pushVerifyCode: '',
      currentOrderNumber: '',
      confirmLoading: false
    }
  }
  componentDidMount() {
    this.init()
  }

  init = () => {
    let params = {
      pageSize: 10,
      pageNum: 0,
    }
    this.getOrderMonitorList(params)
    this.getExceptionType()
  }

  onFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };
  onChangeDate = (date, dateString) => {
    const { searchForm } = this.state;
    searchForm.startDate = dateString[0] ? moment(dateString[0]).format('YYYY-MM-DD') : '';
    searchForm.endDate = dateString[1] ? moment(dateString[1]).format('YYYY-MM-DD') : '';
    this.setState({
      searchForm
    });
  };

  getExceptionType = () => {
    webapi.getExceptionType().then(data => {
      const { res } = data
      let exceptionTypeList = []
      if (res.code === Const.SUCCESS_CODE) {
        exceptionTypeList = res.context.exceptionTypes
      }
      this.setState({
        exceptionTypeList
      })
    })
  }

  getOrderMonitorList = (params) => {
    this.setState({
      loading: true
    })
    webapi.fetchOrderMonitorList(params).then(data => {
      const { res } = data
      if (res.code === Const.SUCCESS_CODE) {
        const { pagination } = this.state
        let monitorList = res.context.content

        pagination.total = res.context.total
        pagination.current = res.context.number + 1
        this.setState({
          monitorList,
          loading: false,
          pagination
        })
      } else {
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

  onSearch = () => {
    const { searchForm } = this.state
    let params = {
      pageSize: 10,
      pageNum: 0,
      beginTime: searchForm.startDate ? searchForm.startDate + " 00:00:00" : null,
      endTime: searchForm.endDate ? searchForm.endDate + " 23:59:59" : null,
      exceptionType: searchForm.exceptionType,
      orderNumber: searchForm.orderNumber,
      orderExportStatus: searchForm.orderExportStatus
    }
    this.setState({
      currentSearchForm: searchForm
    })
    this.getOrderMonitorList(params)
  }
  handleTableChange = (pagination) => {
    const { currentSearchForm } = this.state
    let params = {
      pageSize: pagination.pagesize,
      pageNum: pagination.current - 1,
      beginTime: currentSearchForm.startDate ? currentSearchForm.startDate + " 00:00:00" : null,
      endTime: currentSearchForm.endDate ? currentSearchForm.endDate + " 23:59:59" : null,
      exceptionType: currentSearchForm.exceptionType,
      orderNumber: currentSearchForm.orderNumber,
      orderExportStatus: currentSearchForm.orderExportStatus
    }
    this.getOrderMonitorList(params)
  }
  onRefresh = () => {
    const { currentSearchForm, pagination } = this.state
    let params = {
      pageSize: pagination.pagesize,
      pageNum: pagination.current - 1,
      beginTime: currentSearchForm.startDate ? currentSearchForm.startDate + " 00:00:00" : null,
      endTime: currentSearchForm.endDate ? currentSearchForm.endDate + " 23:59:59" : null,
      exceptionType: currentSearchForm.exceptionType,
      orderNumber: currentSearchForm.orderNumber,
      orderExportStatus: currentSearchForm.orderExportStatus
    }
    this.getOrderMonitorList(params)
  }
  handleDownload = () => {
    const { currentSearchForm } = this.state;
    let params = {
      beginTime: currentSearchForm.startDate ? currentSearchForm.startDate + " 00:00:00" : null,
      endTime: currentSearchForm.endDate ? currentSearchForm.endDate + " 23:59:59" : null,
      exceptionType: currentSearchForm.exceptionType,
      orderNumber: currentSearchForm.orderNumber,
      orderExportStatus: currentSearchForm.orderExportStatus
    };
    util.onExport(params, '/orderMonitor/exports');
  }
  handleConfirm = (orderNumber) => {
    this.setState({
      visible: true,
      pushVerifyCode: '',
      currentOrderNumber: orderNumber
    })
  }
  handleOk = () => {
    const { currentOrderNumber, pushVerifyCode } = this.state
    const base64 = new util.Base64();
    let params = {
      orderNumber: currentOrderNumber,
      passWord: base64.urlEncode(pushVerifyCode)
    }
    this.setState({
      confirmLoading: true
    })
    webapi.toPushDownStream(params).then(data => {
      const { res } = data
      if (res.code === Const.SUCCESS_CODE) {
        this.setState({
          visible: false,
          confirmLoading: false
        }, () => {
          message.success(res.message)
          setTimeout(() => {
            this.onRefresh()
          }, 3000);

        })

      }
      else {
        this.setState({
          visible: false,
          confirmLoading: false
        })
        message.error(res.message)
      }

    }).catch(err => {
      this.setState({
        visible: false,
        confirmLoading: false
      })
    })


  }
  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  pushVerifyCodeChange = (e) => {
    this.setState({
      pushVerifyCode: e.target.value
    })
  }

  render() {
    const { loading, pagination, exceptionTypeList, monitorList, visible, pushVerifyCode, confirmLoading } = this.state
    const orderExportStatusList = [
      {
        value: 0,
        name: 'PENDING'
      },
      {
        value: 1,
        name: 'SUCCESS'
      },
      {
        value: 2,
        name: 'FAILED'
      }
    ]
    const columns = [
      {
        title: RCi18n({ id: 'Finance.OrderDate' }),
        dataIndex: 'orderDate',
        key: 'orderDate',
        render: (text) => (<p>{text ? moment(text).format('YYYY-MM-DD') : null}</p>)
      },
      {
        title: RCi18n({ id: 'Order.OrderNumber' }),
        dataIndex: 'orderNumber',
        key: 'orderNumber',
      },
      {
        title: RCi18n({ id: 'Order.OrderSource' }),
        dataIndex: 'orderSource',
        key: 'orderSource',
        width: '10%'
      },

      {
        title: RCi18n({ id: 'Order.OrderStatus' }),
        dataIndex: 'orderStatus',
        key: 'orderStatus',
      },
      {
        title: RCi18n({ id: 'Order.paymentStatus' }),
        dataIndex: 'orderPaymentStatus',
        key: 'paymentStatus',
      },
      {
        title: RCi18n({ id: 'Order.PSP' }) + ' ' + RCi18n({ id: 'Order.paymentStatus' }),
        dataIndex: 'outpaymentStatus',
        key: 'pspPaymentStatus',
      },
      {
        title: RCi18n({ id: 'OrderMonitor.OrderExportStatus' }),
        dataIndex: 'orderExportStatus',
        key: 'orderExportStatus',
        render: (text) => (
          <p>{
            text === 0 ? 'PENDING' : text === 1 ? 'SUCCESS' : text === 2 ? 'FAILED' : ''
          }</p>
        )
      },

      {
        title: RCi18n({ id: 'OrderMonitor.ExceptionType' }),
        dataIndex: 'exceptionType',
        key: 'exceptionType',
      },
      {
        title: '',
        dataIndex: 'detail',
        width: '10%',
        render: (text, record) => (
          <AuthWrapper functionName="f_order_monitor_details">

            <Tooltip placement="top" title={RCi18n({ id: "OrderMonitor.PushAgain" })}>
              <Popconfirm placement="topLeft" title='Are you sure push again'
                onConfirm={() => this.handleConfirm(record.orderNumber)}
                okText={RCi18n({ id: 'Subscription.Confirm' })} cancelText={RCi18n({ id: "Subscription.Cancel" })}>
                <Button type="link">
                  <i className="iconfont iconReset" />
                </Button>
              </Popconfirm>

            </Tooltip>

            <Tooltip placement="top" title={RCi18n({ id: "Product.Details" })}>
              <Link to={`/order-monitor-details/${record.id}`} className="iconfont iconDetails" />
            </Tooltip>
          </AuthWrapper>
        )
      }
    ]
    return (
      <AuthWrapper functionName="f_order_monitor_list">
        <Spin spinning={loading}>
          <BreadCrumb />
          <div className="container-search">
            <Headline title={RCi18n({ id: 'OrderMonitor.OrderMonitor' })} />
            {/*搜索*/}
            <Form className="filter-content" layout="inline">
              <Row>
                {/* OrderNumber */}
                <Col span={8}>
                  <FormItem>
                    <InputGroup compact style={styles.formItemStyle}>
                      <Input style={styles.label} disabled defaultValue={RCi18n({ id: 'Order.OrderNumber' })} />
                      <Input
                        style={styles.wrapper}
                        onChange={(e) => {
                          const value = (e.target as any).value;
                          this.onFormChange({
                            field: 'orderNumber',
                            value
                          });
                        }}
                      />
                    </InputGroup>
                  </FormItem>
                </Col>

                {/* OrderDate */}
                <Col span={8}>
                  <FormItem>
                    <InputGroup compact style={styles.formItemStyle}>
                      <Input style={styles.label} disabled defaultValue={(window as any).RCi18n({ id: 'Finance.OrderDate' })} />
                      <RangePicker style={styles.wrapper} onChange={this.onChangeDate} format={'YYYY-MM-DD'} />
                    </InputGroup>
                  </FormItem>
                </Col>
                {/* ExceptionType */}
                <Col span={8}>
                  <FormItem>
                    <InputGroup compact style={styles.formItemStyle}>
                      <Input style={styles.label} disabled defaultValue={RCi18n({ id: 'OrderMonitor.ExceptionType' })} />
                      <Select
                        style={styles.wrapper}
                        getPopupContainer={(trigger: any) => trigger.parentNode}
                        allowClear
                        onChange={(value) => {
                          value = value === '' ? null : value;
                          this.onFormChange({
                            field: 'exceptionType',
                            value
                          });
                        }}
                      >
                        {
                          exceptionTypeList && exceptionTypeList.map((item, index) => (
                            <Option value={item} key={index}>{item}</Option>
                          ))
                        }
                      </Select>
                    </InputGroup>
                  </FormItem>

                </Col>

                {/* ExceptionType */}
                <Col span={8}>
                  <FormItem>
                    <InputGroup compact style={styles.formItemStyle}>
                      <Input style={styles.label} disabled defaultValue={RCi18n({ id: 'OrderMonitor.ExportStatus' })} />
                      <Select
                        style={styles.wrapper}
                        getPopupContainer={(trigger: any) => trigger.parentNode}
                        allowClear
                        onChange={(value) => {
                          value = value === '' ? null : value;
                          this.onFormChange({
                            field: 'orderExportStatus',
                            value
                          });
                        }}
                      >
                        {
                          orderExportStatusList && orderExportStatusList.map((item, index) => (
                            <Option value={item.value} key={index}>{item.name}</Option>
                          ))
                        }
                      </Select>
                    </InputGroup>
                  </FormItem>

                </Col>
              </Row>


              <Row>
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon="search"
                      shape="round" onClick={this.onSearch}>
                      {RCi18n({ id: 'Log.Search' })}
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          <div className="container">
            <Row>
              <Col span={12} style={{ textAlign: 'left' }}>
                <h3 style={{ marginTop: 15 }}>{RCi18n({ id: 'Subscription.Total' })}:
                  <span style={{ fontWeight: 600 }}>{pagination.total}</span>
                </h3>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Button icon="download" size="large"
                  style={{ margin: '10px 20px 10px' }}
                  onClick={this.handleDownload} >
                  {RCi18n({ id: 'Finance.Download' })}
                </Button>
              </Col>
            </Row>

            <Table style={{ paddingRight: 20 }}
              rowKey="id"
              columns={columns}
              dataSource={monitorList}
              pagination={pagination}
              scroll={{ x: '100%' }}
              onChange={this.handleTableChange} />

            <Modal
              title={RCi18n({ id: "OrderMonitor.PushAgain" })}
              visible={visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              maskClosable={false}
              confirmLoading={confirmLoading}
              okText={RCi18n({ id: "Product.Submit" })} cancelText={RCi18n({ id: "Subscription.Cancel" })}
            >
              <Input.Password placeholder={RCi18n({ id: 'OrderMonitor.PushVerifyCode' })} value={pushVerifyCode} onChange={this.pushVerifyCodeChange} />
            </Modal>
          </div>
        </Spin>
      </AuthWrapper>
    )
  }
}
const styles = {
  formItemStyle: {
    width: 335
  },
  label: {
    width: 135,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.65)',
    backgroundColor: '#fff',
    cursor: 'text'
  },
  wrapper: {
    width: 200
  },
} as any