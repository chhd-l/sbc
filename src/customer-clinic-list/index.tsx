import React from 'react';
import { Breadcrumb, Table, Form, Button, Input, Divider, Select, Spin, message, Row, Col, Tooltip } from 'antd';
import { Headline, AuthWrapper, util, BreadCrumb, SelectGroup, Const, RCi18n } from 'qmkit';
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
          title: RCi18n({id:"PetOwner.ConsumerAccount"}),
          dataIndex: 'customerAccount',
          key: 'consumerAccount'
        },
        {
          title: RCi18n({id:"PetOwner.ConsumerName"}),
          dataIndex: 'customerName',
          key: 'consumerName'
        },
        {
          title: RCi18n({id:"PetOwner.ConsumerType"}),
          dataIndex: 'customerLevelName',
          key: 'consumerType'
        },
        {
          title: RCi18n({id:"PetOwner.Email"}),
          dataIndex: 'email',
          key: 'email'
        },
        {
          title: RCi18n({id:"PetOwner.Operation"}),
          key: 'operation',
          width: '8%',
          render: (text, record) => (
            <span>
              <Tooltip placement="top" title={RCi18n({id:'PetOwner.Details'})}>
              <Link to={record.customerLevelId !== 233 ? `/petowner-details/${record.customerId}/${record.customerAccountOriginal}` : `/customer-details/Guest/${record.customerId}/${record.customerAccountOriginal}`} className="iconfont iconDetails"></Link>
              </Tooltip>
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
          value: 'Normal Member',
          name: RCi18n({id:'PetOwner.NormalMember'}),
          id: 234
        },
        {
          value: 'Club Member',
          name: RCi18n({id:'PetOwner.ClubMember'}),
          id: 235
        },
        {
          value: 'Guest',
          name: RCi18n({ id: 'PetOwner.Guest' }),
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
    let employeeData = JSON.parse(sessionStorage.getItem('s2b-employee@data'));

    const prescriberId = employeeData.clinicsIds != null && Array.isArray(employeeData.clinicsIds) && employeeData.clinicsIds.length > 0 ? JSON.parse(sessionStorage.getItem('PrescriberType')).value : null;

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
      prescriberId
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
        if (res.code === Const.SUCCESS_CODE) {
          let pagination = this.state.pagination;
          let searchList = res.context ? res.context.detailResponseList : [];
          pagination.total = res.context ? res.context.total : 0;
          this.setState({
            pagination: pagination,
            searchList: searchList,
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
      userId: sessionStorage.getItem('employeeId') ? sessionStorage.getItem('employeeId') : ''
    };
    webapi
      .delCustomer(params)
      .then((data) => {
        if (data.res.code === Const.SUCCESS_CODE) {
          message.success(data.res.message || 'Delete success');
          this.init({ pageNum: this.state.pagination.current, pageSize: 10 });
        } else {
          this.setState({
            loading: true
          });
        }
      })
      .catch((err) => {
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
          <div className="container-search">
            <Headline title={<FormattedMessage id="Menu.Pet owner list(Prescriber)" />} />
            <Form className="filter-content" layout="inline">

              <Row>
                <Col span={8}>
                  <FormItem>
                    <Input
                      addonBefore={
                        <p style={styles.label} title={RCi18n({id:"PetOwner.ConsumerName"})}>
                          <FormattedMessage id="PetOwner.ConsumerName" />
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
                <Col span={8} id="tree-select-props-width">
                  <FormItem>
                    <SelectGroup
                      label={<p style={styles.label} title={RCi18n({id:"PetOwner.ConsumerType"})}><FormattedMessage id="PetOwner.ConsumerType" /></p>}
                      // style={{ width: 80 }}
                      onChange={(value) => {
                        value = value === '' ? null : value;
                        this.onFormChange({
                          field: 'customerTypeId',
                          value
                        });
                      }}
                    >
                      <Option value="">{RCi18n({ id: 'PetOwner.All' })}</Option>
                      {customerTypeArr.map((item) => (
                        <Option title={item.name} value={item.id} key={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </SelectGroup>
                  </FormItem>
                </Col>
                <Col span={8}>
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
                        <FormattedMessage id="PetOwner.search" />
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
    // width: 157
  }
} as any;
