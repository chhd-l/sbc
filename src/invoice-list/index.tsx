import React, { Component } from 'react';
import { BreadCrumb, Headline, SelectGroup, history, Const, util, cache, RCi18n } from 'qmkit';
import { Form, Spin, Row, Col, Select, Input, Button, message, Tooltip, Divider, Table, Popconfirm, DatePicker, Dropdown, Menu, Icon, Modal } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import * as webapi from './webapi';
import { Link } from 'react-router-dom';
import moment from 'moment';
import './index.less';
import _ from 'lodash';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
const { RangePicker } = DatePicker;

const payOrderStatusDic = {
  0: 'Paid',
  1: 'Unpaid',
  2: 'To be confirmed',
  null: 'Unpaid'
};
class InvoiceList extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Invoice list',
      loading: false,
      searchForm: {
        orderNumber: '',
        customerName: '',
        startDate: '',
        endDate: '',
        invoiceStatus: '',
        consumerType: ''
      },
      modalName: 'Add to invoice list',
      visible: false,
      objectFetching: false,
      orderList: [],
      orderNumber: '',
      selectedOrder: {
        ordrAmount: '',
        customerName: '',
        paymentStatus: '',
        consumerEmail: '',
        billingAddress: ''
      },
      invoiceList: [],
      selectedRowKeys: [],
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
          name: 'NotInvoiced',
          value: 0
        }
      ],
      comsumerTypeList: [
        {
          value: 234,
          name: 'Member'
        },
        {
          value: 233,
          name: 'Guest'
        }
      ],
      confirmLoading: false,
      selectedRowList: []
    };
  }
  componentDidMount() {
    this.getInvoiceList();
  }

  onFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };
  onSearch = () => {
    this.setState(
      {
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        }
      },
      () => {
        this.emptySelected();
        this.getInvoiceList();
      }
    );
  };

  getInvoiceList = () => {
    const { searchForm, pagination } = this.state;
    let params = {
      beginTime: searchForm.startDate,
      endTime: searchForm.endDate,
      orderNo: searchForm.orderNumber,
      invoiceState: searchForm.invoiceStatus === 0 || searchForm.invoiceStatus === 1 ? searchForm.invoiceStatus : null,
      customerName: searchForm.customerName,
      consumerLevelId: searchForm.consumerType,
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize
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
            invoiceList: res.context.data,
            pagination: pagination,
            loading: false
          });
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
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
        if (res.code === Const.SUCCESS_CODE) {
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
    webapi
      .disableInvoice(id)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success('Operate successfully');
          this.getInvoiceList();
        }
      })
      .catch((err) => {});
  };
  onChangeDate = (date, dateString) => {
    const { searchForm } = this.state;
    searchForm.startDate = dateString[0] ? moment(dateString[0]).format('YYYY-MM-DD') : '';
    searchForm.endDate = dateString[1] ? moment(dateString[1]).format('YYYY-MM-DD') : '';
    this.setState({
      searchForm
    });
  };
  disabledDate(current) {
    return current && current > moment().endOf('day');
  }
  openAddPage = () => {
    const { form } = this.props;
    this.setState(
      {
        visible: true,
        orderNumber: '',
        selectedOrder: {
          ordrAmount: '',
          customerName: '',
          paymentStatus: '',
          consumerEmail: '',
          billingAddress: ''
        }
      },
      () => {
        form.setFieldsValue({
          orderNumber: ''
        });
      }
    );
  };
  batchInvoice = () => {
    const { selectedRowKeys, selectedRowList } = this.state;
    let valid = true;
    let id = '';
    if (selectedRowKeys.length < 1 || selectedRowList.length < 1) {
      message.error('Please choose order');
      return;
    }
    for (let i = 0; i < selectedRowList.length; i++) {
      if (selectedRowList[i].invoiceState === 1) {
        valid = false;
        id = selectedRowList[i].orderNo;
        break;
      }
    }
    if (!valid) {
      message.error('the order ' + id + ' already have invoiced');
      return;
    }
    let orderInvoiceIds = selectedRowKeys;
    let params = {
      orderInvoiceIds
    };
    this.orderInvoiceState(params);
  };
  batchDownload = () => {
    const { selectedRowKeys, selectedRowList } = this.state;
    let valid = true;
    let id = '';
    if (selectedRowKeys.length < 1 || selectedRowList.length < 1) {
      message.error('Please choose order');
      return;
    }
    for (let i = 0; i < selectedRowList.length; i++) {
      if (selectedRowList[i].invoiceState !== 1) {
        valid = false;
        id = selectedRowList[i].orderNo;
        break;
      }
    }
    if (!valid) {
      message.error('the order ' + id + ' is not invoiced');
      return;
    }
    let orderInvoiceIds = selectedRowKeys;
    let params = {
      orderInvoiceIds
    };
    this.onExport(params);
  };
  invoice = (id) => {
    let orderInvoiceIds = [];
    orderInvoiceIds.push(id);
    let params = {
      orderInvoiceIds
    };
    this.orderInvoiceState(params);
  };
  downloadInvoice = (id) => {
    let orderInvoiceIds = [];
    orderInvoiceIds.push(id);
    let params = {
      orderInvoiceIds
    };
    this.onExport(params);
  };
  handleSubmit = () => {
    const { orderNumber } = this.state;
    this.setState({
      confirmLoading: true
    });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params = {
          orderNo: orderNumber
        };
        this.addInvoice(params);
      }
    });
  };
  getOrderList = (value) => {
    let params = {
      id: value,
      pageSize: 30,
      pageNum: 0
    };
    webapi
      .getOrderList(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            orderList: res.context.content,
            objectFetching: false
          });
        }
      })
      .catch((err) => {});
  };
  orderInvoiceState = (params) => {
    webapi
      .orderInvoiceState(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success('Operate successfully');
          this.getInvoiceList();
          this.emptySelected();
        }
      })
      .catch((err) => {});
  };
  onExport = (params) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        let base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          let result = JSON.stringify({ ...params, token: token });
          let encrypted = base64.urlEncode(result);

          // ???????????????
          let exportHref = Const.HOST + `/account/orderInvoice/exportPDF/${encrypted}`;
          if (Const.SITE_NAME === 'MYVETRECO') {
            exportHref = Const.HOST + `/account/orderInvoice/myVetreco/exportPDF/${encrypted}`;
          }
          window.open(exportHref);
          this.emptySelected();
        } else {
          message.error('Unsuccessful');
        }
        resolve();
      }, 500);
    });
  };
  addInvoice = (params) => {
    webapi
      .addInvoice(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            confirmLoading: false,
            visible: false
          });
          message.success('Operate successfully');
          this.onSearch();
        } else {
          this.setState({
            confirmLoading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          confirmLoading: false
        });
      });
  };

  onChangeOrder = (item) => {
    const { selectedOrder } = this.state;
    (selectedOrder.ordrAmount = item.tradePrice.totalPrice), (selectedOrder.customerName = item.buyer.name), (selectedOrder.paymentStatus = item.tradeState.payState), (selectedOrder.consumerEmail = item.buyer.account), (selectedOrder.billingAddress = item.invoice.address);

    this.setState({
      orderNumber: item.id,
      selectedOrder
    });
  };
  onSelectChange = (selectedRowKeys, selectedRow) => {
    let { selectedRowList } = this.state;
    selectedRowList = selectedRowList.concat(selectedRow);
    selectedRowList = this.arrayFilter(selectedRowKeys, selectedRowList);

    this.setState({ selectedRowKeys, selectedRowList });
  };
  arrayFilter = (arrKey, arrList) => {
    let tempList = [];
    arrKey.map((item) => {
      tempList.push(arrList.find((el) => el.orderInvoiceId === item));
    });
    return tempList;
  };
  emptySelected = () => {
    this.setState({
      selectedRowKeys: [],
      selectedRowList: []
    });
  };

  render() {
    const { title, invoiceList, comsumerTypeList, invoiceStatusList, modalName, visible, objectFetching, orderList, selectedOrder, confirmLoading, selectedRowKeys } = this.state;

    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: 'InvoiceNumber',
        dataIndex: 'orderInvoiceNo',
        key: 'orderInvoiceNo',
        width: '8%',
        render: (text) => <p>{text ? text : '-'}</p>
      },
      {
        title: 'InvoiceDate',
        dataIndex: 'invoiceTime',
        key: 'invoiceTime',
        width: '8%',
        render: (text) => <p>{text ? moment(text).format('YYYY-MM-DD') : '-'}</p>
      },
      {
        title: 'InvoiceStatus',
        dataIndex: 'invoiceState',
        key: 'invoiceState',
        width: '8%',
        render: (text, row) => (
          <div>
            {text ? (
              <p>
                <span style={styles.successPoint}></span><FormattedMessage id="Finance.Invoiced" />
              </p>
            ) : (
              <p>
                <span style={styles.warningPoint}></span><FormattedMessage id="Finance.NotInvoiced" />
              </p>
            )}
          </div>
        )
      },
      {
        title: 'OrderDate',
        dataIndex: 'orderTime',
        key: 'orderTime',
        width: '8%',
        render: (text) => <p>{text ? moment(text).format('YYYY-MM-DD') : '-'}</p>
      },
      {
        title: (
          <div>
            <p><FormattedMessage id="Finance.OrderNumber" /></p>
            <p><FormattedMessage id="Finance.SubscriptionNumber" /></p>
          </div>
        ),
        dataIndex: 'orderNo',
        key: 'orderNo',
        width: '13%',
        render: (text, row) => (
          <div>
            <p>{row.orderNo ? row.orderNo : '-'}</p>
            <p>{row.subscriptionId ? row.subscriptionId : '-'}</p>
          </div>
        )
      },
      {
        title: 'orderAmount',
        dataIndex: 'invoiceAmount',
        key: 'invoiceAmount',
        width: '8%',
        render: (text) => <p>{text ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + text : '-'}</p>
      },
      {
        title: 'PaymentStatus',
        dataIndex: 'payOrderStatus',
        key: 'payOrderStatus',
        width: '8%',
        render: (text) => <p>{text}</p>
      },
      {
        title: 'ConsumerEmail',
        dataIndex: 'consumerEmail',
        key: 'consumerEmail',
        width: '8%',
        render: (text) => <p>{text ? text : '-'}</p>
      },
      {
        title: 'ConsumerType',
        dataIndex: 'consumerLevelId',
        key: 'consumerLevelId',
        width: '8%',
        render: (text) => <div>{+text === 233 ? <FormattedMessage id="Finance.Guest" /> : +text === 234 ? <FormattedMessage id="Finance.Member" /> : '-'}</div>
      },
      {
        title: 'ConsumerName',
        dataIndex: 'consumerName',
        key: 'consumerName',
        width: '8%',
        render: (text) => <p>{text ? text : '-'}</p>
      },

      {
        title: 'Operation',
        key: 'operation',
        width: '8%',
        render: (text, record) => (
          <>
            {+record.delFlag === 1 ? null : (
              <div>
                {record.invoiceState === 0 ? (
                  <>
                  {/* <Popconfirm placement="topLeft" title={<FormattedMessage id="Finance.doThis" />} onConfirm={() => this.invoice(record.orderInvoiceId)} okText={<FormattedMessage id="Finance.Confirm" />} cancelText={<FormattedMessage id="Finance.Cancel" />}>
                    <Tooltip placement="top" title={<FormattedMessage id="Finance.Invoice" />}>
                      <a className="iconfont iconkaipiao"></a>
                    </Tooltip>
                </Popconfirm> */}
                  </>
                ) : (
                  <>
                    {/* <Tooltip placement="top" title="Details">
                  <Link to={'/invoice-details/' + record.id} className="iconfont iconxiangqing" style={{ marginRight: 10 }}></Link>
                </Tooltip> */}
                    {/* <Popconfirm placement="topLeft" title={<FormattedMessage id="Finance.disableThisItem" />} onConfirm={() => this.disableInvoice(record.orderInvoiceId)} okText={<FormattedMessage id="Finance.Confirm" />} cancelText={<FormattedMessage id="Finance.Cancel" />}>
                      <Tooltip placement="top" title="Disable">
                        <a className="iconfont iconjinyong" style={{ marginRight: 10 }}></a>
                      </Tooltip>
                    </Popconfirm> */}
                    <Tooltip placement="top" title={<FormattedMessage id="Finance.Download" />}>
                      <Icon type="download" style={{ color: '#e2001a', fontSize: 16 }} onClick={() => this.downloadInvoice(record.orderInvoiceId)} />
                    </Tooltip>
                  </>
                )}
              </div>
            )}
          </>
        )
      }
    ];

    // ??????title
    columns.forEach(obj => {
      if(typeof obj.title === 'string'){
        (obj.title as any) = <FormattedMessage id={`Finance.${obj.title}`} />
      }
    });

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: (record) => ({
        disabled: +record.delFlag === 1
      })
    };
    const menu = (
      <Menu>
        {/* <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" onClick={() => this.batchInvoice()}>
            <FormattedMessage id="Finance.BatchInvoice" />
          </a>
        </Menu.Item> */}
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" onClick={() => this.batchDownload()}>
            <FormattedMessage id="Finance.BatchDownload" />
          </a>
        </Menu.Item>
      </Menu>
    );
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
        {/*???????????????*/}
        <div className="container-search">
          <Headline title={<FormattedMessage id="Finance.InvoiceList" />} />
          <Form className="filter-content" layout="inline">
            <Row>
              <Col span={8}>
                <FormItem>
                  <InputGroup compact style={styles.formItemStyle}>
                    <Input style={styles.label} disabled title={RCi18n({id:'Finance.OrderNumber'})} defaultValue={RCi18n({id:'Finance.OrderNumber'})} />
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
                  <InputGroup compact style={styles.formItemStyle}>
                    <Input style={styles.label} disabled title={RCi18n({id:'Finance.ConsumerType'})} defaultValue={RCi18n({id:'Finance.ConsumerType'})} />
                    <Select
                      style={styles.wrapper}
                      onChange={(value) => {
                        value = value === '' ? null : value;
                        this.onFormChange({
                          field: 'consumerType',
                          value
                        });
                      }}
                    >
                      <Option value="">
                        <FormattedMessage id="Finance.all" />
                      </Option>
                      {comsumerTypeList &&
                        comsumerTypeList.map((item, index) => (
                          <Option value={item.value} key={index}>
                            <FormattedMessage id={`Finance.${item.name}`} />
                          </Option>
                        ))}
                    </Select>
                  </InputGroup>
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem>
                  <InputGroup compact style={styles.formItemStyle}>
                    <Input style={styles.label} disabled title={RCi18n({id:'Finance.ConsumerName'})} defaultValue={RCi18n({id:'Finance.ConsumerName'})} />
                    <Input
                      style={styles.wrapper}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'customerName',
                          value
                        });
                      }}
                    />
                  </InputGroup>
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem>
                  <InputGroup compact style={styles.formItemStyle}>
                    <Input style={styles.label} disabled title={RCi18n({id:'Finance.InvoiceDate'})} defaultValue={RCi18n({id:'Finance.InvoiceDate'})} />
                    <RangePicker style={styles.wrapper} onChange={this.onChangeDate} disabledDate={this.disabledDate} format={'YYYY-MM-DD'} />
                  </InputGroup>
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem>
                  <InputGroup compact style={styles.formItemStyle}>
                    <Input style={styles.label} disabled title={RCi18n({id:'Finance.InvoiceStatus'})} defaultValue={RCi18n({id:'Finance.InvoiceStatus'})} />
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
                        <FormattedMessage id="Finance.all" />
                      </Option>
                      {invoiceStatusList &&
                        invoiceStatusList.map((item, index) => (
                          <Option value={item.value} key={index}>
                            <FormattedMessage id={`Finance.${item.name}`} />
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
                      <FormattedMessage id="Finance.Search" />
                    </span>
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="container">
          <Row>
            <Col span={12}>
              {/* <Button type="primary" style={{ margin: '10px 10px 10px 0' }} onClick={() => this.openAddPage()}>
                <span><FormattedMessage id="Finance.AddNew" /></span>
              </Button> */}
              <Dropdown overlay={menu} placement="bottomCenter" getPopupContainer={(trigger: any) => trigger.parentNode}>
                <Button style={{ margin: '0px 10px 10px 0' }}> 
                  <span className="icon iconfont iconBatchInvoicing" style={{marginRight:5}}></span> 
                  <FormattedMessage id="Finance.BatchOperation" />
                </Button>
              </Dropdown>
            </Col>
            <Col span={12} style={{textAlign:'right'}}>
              {Const.SITE_NAME === 'MYVETRECO' && <Link to="/invoice-setting"><FormattedMessage id="Finance.InvoiceSetting" /></Link>}
            </Col>
          </Row>
          <Table
            rowKey="orderInvoiceId"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={invoiceList}
            pagination={this.state.pagination}
            loading={this.state.loading}
            scroll={{ x: '100%' }}
            onChange={this.handleTableChange}
            rowClassName={(record, index) => {
              let className = 'normal-row';
              if (record.delFlag) className = 'disable-row';
              return className;
            }}
          />
        </div>
        <Modal
          width="1000px"
          title={modalName}
          visible={visible}
          confirmLoading={confirmLoading}
          onCancel={() =>
            this.setState({
              visible: false,
              selectedOrder: {
                ordrAmount: '',
                customerName: '',
                paymentStatus: '',
                consumerEmail: '',
                billingAddress: ''
              }
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
                      }
                    ]
                  })(
                    <Select
                      showSearch
                      placeholder="Select a Order number"
                      optionFilterProp="children"
                      onChange={(value) => {
                        this.onChangeOrder(value);
                      }}
                      notFoundContent={objectFetching ? <Spin size="small" /> : null}
                      onSearch={_.debounce(this.getOrderList, 500)}
                      filterOption={(input, option) => option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {orderList &&
                        orderList.map((item, index) => (
                          <Option value={item} key={index}>
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
                  <Input disabled value={selectedOrder.ordrAmount} />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="Pet owner name ">
                  <Input disabled value={selectedOrder.customerName} />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="Payment status">
                  <Input disabled value={selectedOrder.paymentStatus} />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="Consumer email">
                  <Input disabled value={selectedOrder.consumerEmail} />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="Billing address">
                  <Input disabled value={selectedOrder.billingAddress} />
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
  successPoint: {
    display: 'inline-block',
    width: 7,
    height: 7,
    margin: '0 5px 2px 0',
    background: '#008900',
    borderRadius: '50%'
  },
  warningPoint: {
    display: 'inline-block',
    width: 7,
    height: 7,
    margin: '0 5px 2px 0',
    background: '#EE8B00',
    borderRadius: '50%'
  }
} as any;

export default Form.create()(injectIntl(InvoiceList));
