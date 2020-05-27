import React from 'react';
import { Breadcrumb, Table, Form, Button, Input, Divider, Select } from 'antd';
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
          title: 'Consumer Account',
          dataIndex: 'consumerAccount',
          key: 'consumerAccount'
        },
        {
          title: 'Consumer Name',
          dataIndex: 'consumerName',
          key: 'consumerName'
        },
        {
          title: 'Consumer Type',
          dataIndex: 'consumerType',
          key: 'consumerType'
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email'
        },

        {
          title: 'Phone Number',
          dataIndex: 'phoneNumber',
          key: 'phoneNumber'
        },
        {
          title: 'Operation',
          key: 'operation',
          render: (text, record) => (
            <span>
              <Link to={'/customer-details/' + record.consumerAccount}>
                Details
              </Link>
              <Divider type="vertical" />
              <a onClick={() => this.removeConsumer(record.consumerAccount)}>
                Delete
              </a>
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
        //邮箱
        email: '',
        //手机号
        phoneNumber: ''
      },
      customerTypeArr: [
        {
          value: 'Member',
          name: 'Member',
          id: 1
        },
        {
          value: 'Visitor',
          name: 'Visitor',
          id: 1
        }
      ],
      loading: false
    };
    this.onFormChange = this.onFormChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
  }

  componentDidMount() {}

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

  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    const query = this.state.searchForm;
    const { res } = await webapi.fetchCustomerList({
      ...query,
      pageNum,
      pageSize
    });
    if (res.code === 'K-000000') {
      let pagination = this.state.pagination;
      let searchList = res.context.content;
      pagination.total = res.context.total;
      this.setState({
        pagination: pagination,
        searchList: searchList
      });
    }
  };
  onSearch = () => {
    this.init({ pageNum: 0, pageSize: 10 });
  };
  removeConsumer = (consumerAccount) => {};

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
          <div className="container customer">
            <Headline title={<FormattedMessage id="consumerList" />} />
            <Form className="filter-content" layout="inline">
              <FormItem>
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
              </FormItem>

              <FormItem>
                <Input
                  addonBefore={<FormattedMessage id="consumerName" />}
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onFormChange({
                      field: 'customerName',
                      value
                    });
                  }}
                />
              </FormItem>
              <FormItem>
                <SelectGroup
                  label="Customer Type"
                  style={{ width: 80 }}
                  onChange={(value) => {
                    value = value === '' ? null : value;
                    this.onFormChange({
                      field: 'customerType',
                      value
                    });
                  }}
                >
                  <Option value="">All</Option>
                  {customerTypeArr.map((item) => (
                    <Option value={item.value} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </SelectGroup>
              </FormItem>
              <FormItem>
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
                <Button
                  type="primary"
                  htmlType="submit"
                  icon="search"
                  onClick={(e) => {
                    e.preventDefault();
                    this.onSearch();
                  }}
                >
                  <FormattedMessage id="search" />
                </Button>
              </FormItem>
            </Form>
            <Table
              columns={columns}
              rowKey={(record) => record.id}
              dataSource={this.state.typeList}
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
