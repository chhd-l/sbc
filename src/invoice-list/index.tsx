import React, { Component } from 'react';
import { BreadCrumb, Headline, SelectGroup, history, Const } from 'qmkit';
import { Form, Spin, Row, Col, Select, Input, Button, message, Tooltip, Divider, Table, Popconfirm, DatePicker } from 'antd';
import { FormattedMessage } from 'react-intl';
import * as webapi from './webapi';
import { Link } from 'react-router-dom';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
const { RangePicker } = DatePicker;

export default class InvoiceList extends Component<any, any> {
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
      invoiceList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      invoiceStatusList:[]
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
    },()=>this.getInvoiceList())
    
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
  querySysDictionary = (type: String) => {
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

  disableInvoice = (id: string) => {
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

  render() {
    const { title,invoiceList,comsumerTypeList,invoiceStatusList} = this.state;

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
{/*             
              <div>
                <Tooltip placement="top" title="Edit">
                  <Link to={'/message-edit/' + record.id} className="iconfont iconEdit"></Link>
                </Tooltip>

                <Divider type="vertical" />

                <Popconfirm placement="topLeft" title="Are you sure to delete this item?" onConfirm={() => this.deleteTask(record.id)} okText="Confirm" cancelText="Cancel">
                  <Tooltip placement="top" title="Delete">
                    <a type="link" className="iconfont iconDelete"></a>
                  </Tooltip>
                </Popconfirm>
              </div>
            {+record.status === 1 ? (
              <div>
                <Tooltip placement="top" title="Details">
                  <Link to={'/message-detail/' + record.id} className="iconfont iconDetails"></Link>
                </Tooltip>

                <Divider type="vertical" />

                <Popconfirm placement="topLeft" title="Are you sure to delete this item?" onConfirm={() => this.deleteTask(record.id)} okText="Confirm" cancelText="Cancel">
                  <Tooltip placement="top" title="Delete">
                    <a type="link" className="iconfont iconDelete"></a>
                  </Tooltip>
                </Popconfirm>
              </div>
            ) : null}
            {+record.status === 2 ? (
              <div>
                <Tooltip placement="top" title="Details">
                  <Link to={'/message-detail/' + record.id} className="iconfont iconDetails"></Link>
                </Tooltip>
              </div>
            ) : null} */}
          </div>
        )
      }
    ];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
    };
    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search">
          <Headline title={title}/>
          <Form className="filter-content" layout="inline">
            <Row>
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={<p style={styles.label}>Order number</p>}
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'orderNumber',
                        value
                      });
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <SelectGroup
                    defaultValue=""
                    label={<p style={styles.label}>Consumer type</p>}
                    style={{ width: 200 }}
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
                        <Option value={item.valueEn} key={index}>
                          {item.name}
                        </Option>
                      ))}
                  </SelectGroup>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={<p style={styles.label}>comsumer name</p>}
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'comsumerName',
                        value
                      });
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <InputGroup compact>
                  <Input
                      style={{
                        width: 145,
                        textAlign: 'center',
                        color: 'rgba(0, 0, 0, 0.65)',
                        backgroundColor: '#fff'
                      }}
                      disabled
                      defaultValue="Period"
                    />
                    <RangePicker style={{ width: 200 }} onChange={this.onChangeDate} disabledDate={this.disabledDate} format={'YYYY-MM-DD'} />
                  </InputGroup>
                </FormItem>
              </Col>

              
              <Col span={8}>
                <FormItem>
                  <SelectGroup
                    defaultValue=""
                    label={<p style={styles.label}>Invoice status</p>}
                    style={{ width: 200 }}
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
                        <Option value={item.valueEn} key={index}>
                          {item.name}
                        </Option>
                      ))}
                  </SelectGroup>
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
          <Button type="primary" style={{ margin: '10px 0 10px 0' }} onClick={() => this.openAddPage()}>
            <span>Add new</span>
          </Button>
          <Table rowKey="id" 
          rowSelection={rowSelection}
          columns={columns} 
          dataSource={invoiceList} 
          pagination={this.state.pagination} 
          loading={this.state.loading} 
          scroll={{ x: '100%' }} 
          onChange={this.handleTableChange} />
        </div>
      </div>
    );
  }
}
const styles = {
  label: {
    width: 120,
    textAlign: 'center'
  },
  wrapper: {
    width: 157
  }
} as any;
