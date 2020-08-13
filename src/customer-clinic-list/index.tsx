import React from 'react';
import {
  Breadcrumb,
  Table,
  Form,
  Button,
  Input,
  Divider,
  Select,
  Spin,
  message,
  Row,
  Col
} from 'antd';
import { Headline, AuthWrapper, util, BreadCrumb, SelectGroup } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import * as webapi from './webapi';

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
          key: 'consumerAccount'
        },
        {
          title: 'Consumer name',
          dataIndex: 'customerName',
          key: 'consumerName'
        },
        {
          title: 'Consumer type',
          dataIndex: 'customerLevelName',
          key: 'consumerType'
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email'
        },

        // {
        //   title: 'Phone Number',
        //   dataIndex: 'contactPhone',
        //   key: 'phoneNumber'
        // },
        // {
        //   title: 'Selected Prescriber ID',
        //   dataIndex: 'selectedPrescriber',
        //   key: 'selectedPrescriber'
        // },
        {
          title: 'Operation',
          key: 'operation',
          render: (text, record) => (
            <span>
              <Link
                to={
                  '/customer-clinic-details/' +
                  (record.customerLevelName
                    ? record.customerLevelName
                    : 'Visitor') +
                  '/' +
                  record.customerId +
                  '/' +
                  record.customerAccount
                }
              >
                Details
              </Link>
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
        selectedPrescriberId: ''
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
      email: query.email
    };
    pageNum = pageNum - 1;
    webapi
      .getCustomerList({
        ...params,
        pageNum,
        pageSize
      })
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          let pagination = this.state.pagination;
          let searchList = res.context ? res.context.detailResponseList : [];
          pagination.total = res.context ? res.context.total : 0;
          this.setState({
            pagination: pagination,
            searchList: searchList,
            loading: false
          });
        } else {
          message.error(res.message || 'get data filed');
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        message.error('get data filed');

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
  removeConsumer = (constomerId) => {
    this.setState({
      loading: true
    });
    let customerIds = [];
    customerIds.push(constomerId);
    let params = {
      customerIds: customerIds,
      userId: sessionStorage.getItem('employeeId')
        ? sessionStorage.getItem('employeeId')
        : ''
    };
    webapi
      .delCustomer(params)
      .then((data) => {
        if (data.res.code === 'K-000000') {
          message.success(data.res.message || 'Delete success');
          this.init({ pageNum: this.state.pagination.current, pageSize: 10 });
        } else {
          message.error(data.res.message || 'Delete failed');
          this.setState({
            loading: true
          });
        }
      })
      .catch((err) => {
        message.error('Delete failed');
        this.setState({
          loading: true
        });
      });
  };

  render() {
    const { customerTypeArr, columns } = this.state;
    return (
      <AuthWrapper functionName="f_customer_0_prescriber">
        <div>
          <BreadCrumb />
          {/*导航面包屑*/}
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>客户</Breadcrumb.Item>
            <Breadcrumb.Item>客户管理</Breadcrumb.Item>
            <Breadcrumb.Item>客户列表</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container-search">
            <Headline title={<FormattedMessage id="consumerClinicList" />} />
            <Form className="filter-content" layout="inline">
              {/* <FormItem>
                <Input
                  addonBefore={<FormattedMessage id="customerAccount" />}
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onFormChange({
                      field: 'customerAccount',
                      value
                    });
                  }}
                />
              </FormItem> */}

              <Row>
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
                  addonBefore={<FormattedMessage id="email" />}
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onFormChange({
                      field: 'email',
                      value
                    });
                  }}
                />
              </FormItem>

              <FormItem>
                <Input
                  addonBefore={<FormattedMessage id="phoneNumber" />}
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onFormChange({
                      field: 'phoneNumber',
                      value
                    });
                  }}
                />
              </FormItem>

              <FormItem>
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
              rowKey="id"
              dataSource={this.state.searchList}
              pagination={this.state.pagination}
              loading={this.state.loading}
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
