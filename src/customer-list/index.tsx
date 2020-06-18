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
  Modal
} from 'antd';
import { Headline, AuthWrapper, util, BreadCrumb, SelectGroup } from 'qmkit';
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
          title: 'Consumer Account',
          dataIndex: 'customerAccount',
          key: 'consumerAccount',
          width: 160
        },
        {
          title: 'Consumer Name',
          dataIndex: 'customerName',
          key: 'consumerName',
          width: 200
          // render: (text, record) => (
          //   <p>{record.customerLevelName !== 'Guest' ? text : ''}</p>
          // )
        },
        {
          title: 'Consumer Type',
          dataIndex: 'customerLevelName',
          key: 'consumerType',
          width: 120
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          width: 160
        },

        {
          title: 'Phone Number',
          dataIndex: 'contactPhone',
          key: 'phoneNumber',
          width: 160
        },
        {
          title: 'Default Prescriber ID',
          dataIndex: 'defaultClinics',
          key: 'defaultClinics',
          width: 160,
          render: (text, record) => (
            <p>
              {record.defaultClinics ? record.defaultClinics.clinicsId : ''}
            </p>
          )
        },
        {
          title: 'Selected Prescriber ID',
          dataIndex: 'clinicsIds',
          key: 'clinicsIds',
          width: 200
        },
        {
          title: 'Operation',
          key: 'operation',
          width: 200,
          render: (text, record) => (
            <span>
              <Link
                to={
                  '/customer-details/' +
                  (record.customerLevelName
                    ? record.customerLevelName
                    : 'Guest') +
                  '/' +
                  record.customerId +
                  '/' +
                  record.customerAccount
                }
              >
                Details
              </Link>
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
        if (res.code === 'K-000000') {
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
          message.error('Unsuccessful');
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        message.error('Unsuccessful');

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
  //       if (data.res.code === 'K-000000') {
  //         message.success('Successful');
  //         this.init({ pageNum: this.state.pagination.current, pageSize: 10 });
  //       } else {
  //         message.error('Unsuccessful');
  //         this.setState({
  //           loading: true
  //         });
  //       }
  //     })
  //     .catch((err) => {
  //       message.error('Unsuccessful');
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
          <div className="container customer">
            <Headline title={<FormattedMessage id="consumerList" />} />
            <Form className="filter-content" layout="inline">
              <FormItem>
                <Input
                  addonBefore={<FormattedMessage id="consumerAccount" />}
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
                  defaultValue=""
                  label="Customer Type"
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
              rowKey={(record) => record.customerDetailId}
              dataSource={this.state.searchList}
              pagination={this.state.pagination}
              loading={this.state.loading}
              scroll={{ x: '100%' }}
              onChange={this.handleTableChange}
            />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
