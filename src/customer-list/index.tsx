import React from 'react';
import { Breadcrumb, Table, Form, Button, Input, Divider, Select, Spin, message, Modal, Row, Col, Tooltip } from 'antd';
import { Headline, AuthWrapper, util, BreadCrumb, SelectGroup, Const } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import * as webapi from './webapi';

const { confirm } = Modal;
const FormItem = Form.Item;
const Option = Select.Option;

export default class Customer extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      columns: [
        {
          title: 'Consumer account',
          dataIndex: 'customerAccount',
          key: 'consumerAccount',
          width: '15%'
        },
        {
          title: 'Consumer name',
          dataIndex: 'customerName',
          key: 'consumerName',
          width: '15%',
          render: (text, record) => <p>{record.firstName + ' ' + record.lastName}</p>
        },
        {
          title: 'Consumer type',
          dataIndex: 'customerLevelName',
          key: 'consumerType',
          width: '15%'
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          width: '15%'
        },

        {
          title: 'Phone number',
          dataIndex: 'contactPhone',
          key: 'phoneNumber',
          width: '15%'
        },
        {
          title: 'Default prescriber name',
          dataIndex: 'defaultClinics',
          key: 'defaultClinics',
          width: '15%',
          render: (text, record) => <p>{record.defaultClinics ? record.defaultClinics.clinicsName : ''}</p>
        },
        // {
        //   title: 'Selected Prescriber ID',
        //   dataIndex: 'clinicsIds',
        //   key: 'clinicsIds',
        //   width: 200
        // },
        {
          title: 'Operation',
          key: 'operation',
          width: '10%',
          render: (text, record) => (
            <span>
              <Tooltip placement="top" title="Details">
                <Link to={'/customer-details/' + (record.customerLevelName ? record.customerLevelName : 'Guest') + '/' + record.customerId + '/' + record.customerAccount} className="iconfont iconDetails"></Link>
              </Tooltip>
              {/* <Divider type="vertical" />
              <a onClick={() => this.showConfirm(record.customerId)}>Delete</a> */}
            </span>
          )
        }
      ],
      searchList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      searchForm: {
        //客户名称
        customerName: '',
        //账号
        customerAccount: '',
        //客户类型
        customerType: '',
        customerTypeId: '',
        //邮箱
        email: '',
        //手机号
        phoneNumber: '',
        //选中的诊所
        selectedPrescriberId: '',
        defaultPrescriberName: ''
      },
      customerTypeArr: [
        {
          value: 'Member',
          name: 'Member',
          id: 234
        },
        {
          value: 'Guest',
          name: 'Guest',
          id: 233
        }
      ],
      loading: false
    };
    this.onFormChange = this.onFormChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  onFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };
  handleTableChange(pagination: any) {
    this.setState({
      pagination: pagination
    });
    this.init({ pageNum: pagination.current, pageSize: 10 });
  }

  init = ({ pageNum, pageSize } = { pageNum: 1, pageSize: 10 }) => {
    this.setState({
      loading: true
    });
    const query = this.state.searchForm;

    let params = {
      contactPhone: query.phoneNumber,
      customerAccount: query.customerAccount,
      customerLevelId: query.customerTypeId,
      customerName: query.customerName,
      email: query.email,
      clinicsId: query.selectedPrescriberId
      // defaultPrescriberName:query.defaultPrescriberName
    };
    pageNum = pageNum - 1;
    webapi
      .getCustomerList({
        ...params,
        pageNum,
        pageSize
      })
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          let pagination = this.state.pagination;
          let searchList = res.context.detailResponseList;
          if (searchList.length > 0) {
            pagination.total = res.context.total;
            pagination.current = res.context.currentPage + 1;
            this.setState({
              loading: false,
              pagination: pagination,
              searchList: searchList
            });
          } else if (searchList.length === 0 && res.context.total > 0) {
            pagination.current = res.context.currentPage;
            let params = {
              pageNum: res.context.currentPage,
              pageSize: pagination.pageSize
            };
            this.init(params);
          } else {
            pagination.total = res.context.total;
            pagination.current = res.context.currentPage + 1;
            this.setState({
              loading: false,
              pagination: pagination,
              searchList: searchList
            });
          }
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
  onSearch = () => {
    const { pagination } = this.state;
    pagination.pageNum = 1;
    this.setState({
      pagination: pagination
    });
    this.init({ pageNum: 1, pageSize: 10 });
  };
  // removeConsumer = (constomerId) => {
  //   this.setState({
  //     loading: true
  //   });
  //   let customerIds = [];
  //   customerIds.push(constomerId);
  //   let params = {
  //     customerIds: customerIds,
  //     userId: '10086'
  //   };
  //   webapi
  //     .delCustomer(params)
  //     .then((data) => {
  //       if (data.res.code === Const.SUCCESS_CODE) {
  //         message.success('Operate successfully');
  //         this.init({ pageNum: this.state.pagination.current, pageSize: 10 });
  //       } else {
  //         message.error(res.message||'Unsuccessful');
  //         this.setState({
  //           loading: true
  //         });
  //       }
  //     })
  //     .catch((err) => {
  //       message.error(res.message||'Unsuccessful');
  //       this.setState({
  //         loading: true
  //       });
  //     });
  // };

  // showConfirm(id) {
  //   const that = this;
  //   confirm({
  //     title: 'Are you sure to delete this item?',
  //     onOk() {
  //       return that.removeConsumer(id);
  //     },
  //     onCancel() {}
  //   });
  // }

  render() {
    const { customerTypeArr, columns } = this.state;
    return (
      <AuthWrapper functionName="f_customer_0">
        <div>
          <BreadCrumb />
          {/*导航面包屑*/}
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>客户</Breadcrumb.Item>
            <Breadcrumb.Item>客户管理</Breadcrumb.Item>
            <Breadcrumb.Item>客户列表</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container-search">
            <Headline title={<FormattedMessage id="consumerList" />} />
            <Form className="filter-content" layout="inline">
              <Row>
                <Col span={8}>
                  <FormItem>
                    <Input
                      addonBefore={
                        <p style={styles.label}>
                          <FormattedMessage id="consumerAccount" />
                        </p>
                      }
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'customerAccount',
                          value
                        });
                      }}
                    />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    <Input
                      addonBefore={
                        <p style={styles.label}>
                          <FormattedMessage id="consumerName" />
                        </p>
                      }
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'customerName',
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
                      label={<p style={styles.label}>Customer type</p>}
                      style={{ width: 80 }}
                      onChange={(value) => {
                        value = value === '' ? null : value;
                        this.onFormChange({
                          field: 'customerTypeId',
                          value
                        });
                      }}
                    >
                      <Option value="">All</Option>
                      {customerTypeArr.map((item) => (
                        <Option value={item.id} key={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </SelectGroup>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    <Input
                      addonBefore={
                        <p style={styles.label}>
                          <FormattedMessage id="email" />
                        </p>
                      }
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'email',
                          value
                        });
                      }}
                    />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    <Input
                      addonBefore={
                        <p style={styles.label}>
                          <FormattedMessage id="phoneNumber" />
                        </p>
                      }
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'phoneNumber',
                          value
                        });
                      }}
                    />
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

              {/* <FormItem>
                <Input
                  addonBefore={<FormattedMessage id="selectedPrescriberId" />}
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onFormChange({
                      field: 'selectedPrescriberId',
                      value
                    });
                  }}
                />
              </FormItem> */}
            </Form>
          </div>
          <div className="container">
            <Table
              columns={columns}
              rowKey="customerDetailId"
              dataSource={this.state.searchList}
              pagination={this.state.pagination}
              loading={{ spinning: this.state.loading, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" /> }}
              scroll={{ x: '100%' }}
              onChange={this.handleTableChange}
            />
          </div>
        </div>
      </AuthWrapper>
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
