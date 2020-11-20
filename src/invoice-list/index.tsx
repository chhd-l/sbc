import React, { Component } from 'react';
import { BreadCrumb, Headline, SelectGroup, history, Const } from 'qmkit';
import { Form, Spin, Row, Col, Select, Input, Button, message, Tooltip, Divider, Table, Popconfirm, DatePicker, Dropdown, Menu, Icon, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import * as webapi from './webapi';
import { Link } from 'react-router-dom';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
const { RangePicker } = DatePicker;
class InvoiceList extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Invoice list',
      loading: false,
      searchForm: {
        orderNumber: '',
        consumerName: '',
        startDate: '',
        endDate: '',
        invoiceStatus: '',
        consumerType: '',
      },
      modalName: 'Add to invoice list',
      visible: false,
      objectFetching: false,
      orderList: [],
      orderNumber: '',
      selectedOrder:{},
      invoiceList: [
        {
          id:1,
          invoiceNumber: 'test123',
          invoiceTime: '2013-12-12',
          invoiceStatus: 0,
          orderNumber: '1234',
          orderAmount: '$123',
          paymentStatus: 'Paid',
          subscriptionNumber: '12345',
          consumerType: 'Guest',
          consumerName: 'test12',
        },
        {
          id:2,
          invoiceNumber: 'test223',
          invoiceTime: '2018-12-12',
          invoiceStatus: 1,
          orderNumber: '1234',
          orderAmount: '$123',
          paymentStatus: 'Paid',
          subscriptionNumber: '12345',
          consumerType: 'Member',
          consumerName: 'test12',
        },

      ],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      invoiceStatusList: [
        {
          name: 'Invoiced',
          value: 1
        },
        {
          name: 'Not invoiced',
          value: 0
        }
      ],
      comsumerTypeList: [
        {
          value: 234,
          name: 'Member',
        },
        {
          value: 233,
          name: 'Guest',
        }
      ],
    };
  }
  componentDidMount() {
    // this.querySysDictionary('objectType');
  }

  onFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };
  onSearch = () => {
    this.setState({
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    }, () => this.getInvoiceList())

  };
  getInvoiceList = () => {
    const { searchForm, pagination } = this.state;
    let params = {
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize,
    };
    this.setState({
      loading: true
    });
    webapi
      .getInvoiceList(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          pagination.total = res.context.total;
          this.setState({
            taskList: res.context.content,
            pagination: pagination,
            loading: false
          });
        } else {
          message.error(res.message || 'Operation failure');
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'Operation failure');
        this.setState({
          loading: false
        });
      });
  };
  querySysDictionary = (type) => {
    webapi
      .querySysDictionary({ type: type })
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          console.log(res.context.sysDictionaryVOS);

        } else {
          message.error(res.message || 'Operation failure');
        }
      })
      .catch((err) => {
        message.error(err.message || 'Operation failure');
      });
  };
  handleTableChange = (pagination: any) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.getInvoiceList()
    );
  };

  disableInvoice = (id) => {
    this.setState({
      loading: true
    });
    webapi
      .disableInvoice(id)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(res.message || 'Operation successful');
          this.getInvoiceList();
        } else {
          message.error(res.message || 'Operation failure');
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        message.error(err || 'Operation failure');
        this.setState({
          loading: false
        });
      });
  };
  onChangeDate = (date, dateString) => {
    const { searchForm } = this.state
    searchForm.startDate = moment(dateString[0]).format('YYYY-MM-DD');
    searchForm.endDate = moment(dateString[1]).format('YYYY-MM-DD');
    searchForm
    this.setState(
      {
        searchForm
      }
    );
  };
  disabledDate(current) {
    return current && current > moment().endOf('day');
  }
  openAddPage = () => {
    const { form } = this.props;
    this.setState({
      visible: true,
      orderNumber: ''
    }, () => {
      form.setFieldsValue({
        orderNumber: '',
      });
    })
  }
  batchInvoice = () => {

  }
  batchDownload = () => {

  }
  invoice = (id) => {

  }
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          visible:false
        })
      }
    })
  }
  getOrderList = (value) => {
    let params = {
      id: value,
      pageSize: 30,
      pageNum: 0
    };
    webapi.getOrderList(params).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        this.setState({
          orderList: res.context.content,
          objectFetching: false
        });
      }
    });
  }


  render() {
    const { title, invoiceList, comsumerTypeList, invoiceStatusList, modalName, visible, objectFetching, orderList,selectedOrder } = this.state;

    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: 'Invoice number',
        dataIndex: 'invoiceNumber',
        key: 'invoiceNumber',
        width: '8%'
      },
      {
        title: 'Invoice Time',
        dataIndex: 'invoiceTime',
        key: 'invoiceTime',
        width: '8%',
        ellipsis: true
      },
      {
        title: 'Invoice status',
        dataIndex: 'invoiceStatus',
        key: 'invoiceStatus',
        width: '8%'
      },
      {
        title: 'Order number',
        dataIndex: 'orderNumber',
        key: 'orderNumber',
        width: '8%'
      },
      {
        title: 'Order amount',
        dataIndex: 'orderAmount',
        key: 'orderAmount',
        width: '8%'
      },
      {
        title: 'Payment status',
        dataIndex: 'paymentStatus',
        key: 'paymentStatus',
        width: '8%',
      },
      {
        title: 'Subscription number',
        dataIndex: 'subscriptionNumber',
        key: 'subscriptionNumber',
        width: '8%'
      },
      {
        title: 'Consumer type',
        dataIndex: 'consumerType',
        key: 'consumerType',
        width: '8%'
      },
      {
        title: 'Consumer Name',
        dataIndex: 'consumerName',
        key: 'consumerName',
        width: '8%'
      },

      {
        title: 'Operation',
        key: 'operation',
        width: '8%',
        render: (text, record) => (
          <div>
            {
              record.invoiceStatus ? (
                <Popconfirm placement="topLeft" title="Are you sure to do this?" onConfirm={() => this.invoice(record.id)} okText="Confirm" cancelText="Cancel">
                  <Tooltip placement="top" title="Invoice">
                    <a className="iconfont iconkaipiao" ></a>
                  </Tooltip>
                </Popconfirm>
              ) : (<>
                <Tooltip placement="top" title="Details">
                  <Link to={'/invoice-details/' + record.id} className="iconfont iconxiangqing" style={{ marginRight: 10 }}></Link>
                </Tooltip>
                <Popconfirm placement="topLeft" title="Are you sure to disable this item?" onConfirm={() => this.disableInvoice(record.id)} okText="Confirm" cancelText="Cancel">
                  <Tooltip placement="top" title="Disable">
                    <a className="iconfont iconjinyong" style={{ marginRight: 10 }}></a>
                  </Tooltip>
                </Popconfirm>
                <Tooltip placement="top" title="Download">
                  <Icon type="download" style={{ color: '#e2001a' }} />
                </Tooltip>
              </>
                )
            }


          </div>
        )
      }
    ];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
    };
    const menu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" onClick={() => this.batchInvoice}>
            Batch invoice
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" onClick={() => this.batchDownload}>
            Batch download
          </a>
        </Menu.Item>
      </Menu>
    )
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search">
          <Headline title={title} />
          <Form className="filter-content" layout="inline">
            <Row>
              <Col span={8}>
                <FormItem>
                  <InputGroup compact>
                    <Input
                      style={styles.label}
                      disabled
                      defaultValue="Order number"
                    />
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

              <Col span={8}>
                <FormItem>
                  <InputGroup compact>
                    <Input
                      style={styles.label}
                      disabled
                      defaultValue="Consumer type"
                    />
                    <Select
                      style={styles.wrapper}
                      onChange={(value) => {
                        value = value === '' ? null : value;
                        this.onFormChange({
                          field: 'comsumerType',
                          value
                        });
                      }}
                    >
                      <Option value="">
                        <FormattedMessage id="all" />
                      </Option>
                      {comsumerTypeList &&
                        comsumerTypeList.map((item, index) => (
                          <Option value={item.value} key={index}>
                            {item.name}
                          </Option>
                        ))}
                    </Select>
                  </InputGroup>
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem>
                  <InputGroup compact>
                    <Input
                      style={styles.label}
                      disabled
                      defaultValue="Comsumer name"
                    />
                    <Input
                      style={styles.wrapper}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'comsumerName',
                          value
                        });
                      }}
                    />
                  </InputGroup>
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem>
                  <InputGroup compact>
                    <Input
                      style={styles.label}
                      disabled
                      defaultValue="Period"
                    />
                    <RangePicker style={styles.wrapper} onChange={this.onChangeDate} disabledDate={this.disabledDate} format={'YYYY-MM-DD'} />
                  </InputGroup>
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem>
                  <InputGroup compact>
                    <Input
                      style={styles.label}
                      disabled
                      defaultValue="Invoice status"
                    />
                    <Select

                      defaultValue=""
                      style={styles.wrapper}
                      onChange={(value) => {
                        value = value === '' ? null : value;
                        this.onFormChange({
                          field: 'invoiceStatus',
                          value
                        });
                      }}
                    >
                      <Option value="">
                        <FormattedMessage id="all" />
                      </Option>
                      {invoiceStatusList &&
                        invoiceStatusList.map((item, index) => (
                          <Option value={item.value} key={index}>
                            {item.name}
                          </Option>
                        ))}
                    </Select>
                  </InputGroup>
                </FormItem>
              </Col>
              <Col span={24} style={{ textAlign: 'center' }}>
                <FormItem>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon="search"
                    shape="round"
                    onClick={(e) => {
                      e.preventDefault();
                      this.onSearch();
                    }}
                  >
                    <span>
                      <FormattedMessage id="search" />
                    </span>
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="container">
          <Button type="primary" style={{ margin: '10px 10px 10px 0' }} onClick={() => this.openAddPage()}>
            <span>Add new</span>
          </Button>
          <Dropdown overlay={menu} placement="bottomCenter">
            <Button><span className="icon iconfont iconBatchInvoicing" style={{ marginRight: 5 }}></span> Batch operation</Button>
          </Dropdown>
          <Table rowKey="id"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={invoiceList}
            pagination={this.state.pagination}
            loading={this.state.loading}
            scroll={{ x: '100%' }}
            onChange={this.handleTableChange} />
        </div>
        <Modal
          width="1000px"
          title={modalName}
          visible={visible}
          onCancel={() =>
            this.setState({
              visible: false
            })
          }
          footer={[
            <Button
              key="back"
              onClick={() => {
                this.setState({
                  visible: false
                });
              }}
            >
              Close
            </Button>,
            <Button key="submit" type="primary" onClick={() => this.handleSubmit()}>
              Comfirm
            </Button>
          ]}
        >
          <Form {...formItemLayout}>
            <Row>
              <Col span={12}>
                <FormItem label="Order number">
                  {getFieldDecorator('orderNumber', {
                    rules: [
                      {
                        required: true,
                        message: 'Please Select orderNumber!'
                      },
                      {
                        max: 50,
                        message: 'orderNumber exceed the maximum length!'
                      }
                    ]
                  })(
                    <Select
                      showSearch
                      placeholder="Select a Order number"
                      optionFilterProp="children"
                      onChange={(value) => {
                        this.setState({
                          orderNumber: value
                        })
                      }}
                      notFoundContent={objectFetching ? <Spin size="small" /> : null}
                      onSearch={this.getOrderList}
                      filterOption={(input, option) => option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {orderList &&
                        orderList.map((item, index) => (
                          <Option value={item.id} key={index}>
                            {item.id}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="Order amount">
                  <Input disabled value={selectedOrder.ordrAmount}/>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="Consumer name">
                  <Input disabled value={selectedOrder.consumerName}/>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="Payment status">
                  <Input disabled value={selectedOrder.paymentStatus}/>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="Consumer email">
                  <Input disabled value={selectedOrder.consumerEmail}/>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="Billion address">
                  <Input disabled value={selectedOrder.billionAddress}/>
                </FormItem>
              </Col>
            </Row>


          </Form>
        </Modal>
      </div>
    );
  }
}
const styles = {
  label: {
    width: 145,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.65)',
    backgroundColor: '#fff',
    cursor: 'text'
  },
  wrapper: {
    width: 220
  },
} as any;

export default Form.create()(InvoiceList);
