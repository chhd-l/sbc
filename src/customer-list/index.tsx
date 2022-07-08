import React from 'react';
import { Breadcrumb, Table, Form, Button, Input, Divider, Select, Spin, message, Modal, Row, Col, Tooltip, TreeSelect } from 'antd';
import { Headline, AuthWrapper, util, BreadCrumb, SelectGroup, TreeSelectGroup, RCi18n, cache } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import IMask from 'imask';
import * as webapi from './webapi';

const { confirm } = Modal;
const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;

export default class Customer extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      columns: [
        {
          title: RCi18n({ id: 'PetOwner.ConsumerAccount' }),
          dataIndex: 'customerAccount',
          key: 'consumerAccount',
          width: '15%'
        },
        {
          title: RCi18n({ id: 'PetOwner.ConsumerName' }),
          dataIndex: 'customerName',
          key: 'consumerName',
          width: '15%',
          render: (text, record) => <p>{record.customerName}</p>
        },
        {
          title: RCi18n({ id: 'PetOwner.ConsumerType' }),
          dataIndex: 'customerLevelId',
          key: 'consumerType',
          width: '15%',
          render: (text, record) => <p>{text === 233 ? RCi18n({ id: 'PetOwner.Guest' }) : record.customerClubFlag === 1 ? RCi18n({ id: 'PetOwner.ClubMember' }) : RCi18n({ id: 'PetOwner.NormalMember' })}</p>
        },
        {
          title: RCi18n({ id: 'PetOwner.Email' }),
          dataIndex: 'email',
          key: 'email',
          width: '15%'
        },

        {
          title: RCi18n({ id: 'PetOwner.PhoneNumber' }),
          dataIndex: 'contactPhone',
          key: 'phoneNumber',
          width: '15%'
        },
        {
          title: RCi18n({ id: 'PetOwner.City' }),
          dataIndex: 'city',
          key: 'city',
          width: '15%'
        },
        // {
        //   title: RCi18n({ id: 'PetOwner.DefaultPrescriberName' }),
        //   dataIndex: 'defaultClinics',
        //   key: 'defaultClinics',
        //   width: '15%',
        //   render: (text, record) => <p>{record.defaultClinics ? record.defaultClinics.clinicsName : ''}</p>
        // },
        // {
        //   title: 'Selected Prescriber ID',
        //   dataIndex: 'clinicsIds',
        //   key: 'clinicsIds',
        //   width: 200
        // },
        {
          title: RCi18n({ id: 'PetOwner.Operation' }),
          key: 'operation',
          width: '10%',
          render: (text, record) => (
            <span>
              <Tooltip placement="top" title={RCi18n({ id: 'PetOwner.Details' })}>
                <Link to={record.customerLevelId !== 233 ? `/petowner-details/${record.customerId}/${record.customerAccount}` : `/customer-details/Guest/${record.customerId}/${record.customerAccount}`} className="iconfont iconDetails"></Link>
              </Tooltip>
              {record.customerLevelId !== 233 ? (
                <span>
                  <Divider type="vertical" />
                  <Tooltip placement="top" title={RCi18n({ id: 'PetOwner.Activity' })}>
                    <Link to={'/pet-owner-activity/' + record.customerId} className="iconfont iconhuanjie"></Link>
                  </Tooltip>
                </span>
              ) : null}
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
        defaultPrescriberName: '',
        subscriptionType: '',
        // city
        city: '',
      },
      customerTypeArr: [
        {
          value: 'Normal Member',
          name: RCi18n({ id: 'PetOwner.NormalMember' }),
          id: 234
        },
        {
          value: 'Club Member',
          name: RCi18n({ id: 'PetOwner.ClubMember' }),
          id: 235
        },
        {
          value: 'Guest',
          name: RCi18n({ id: 'PetOwner.Guest' }),
          id: 233
        }
      ],
      subscriptionTypeList: [],
      loading: false,
      phoneReg: []
    };
    this.onFormChange = this.onFormChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
  }

  componentDidMount() {
    this.init();
    //this.getSubscriptionTypeList();
    this.getPhoneNumberDefaultFormat();
  }

  getSubscriptionTypeList = () => {
    webapi.getSubscriptionPlanTypes().then((data) => {
      this.setState({
        subscriptionTypeList: data.res.context.sysDictionaryVOS
      });
    });
  };

  onFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };

  getPhoneNumberDefaultFormat = () => {
    webapi.getPhoneNumberFormat().then((data) => {
      const phoneFormat = data.res.context.configVOList?.[0]?.context || "00000000000";
      const phoneNumberFormat = phoneFormat?.split(",");
      const phoneReg = phoneNumberFormat.map((item: string) => {
        return { mask: item }
      })
      this.setState({
        phoneReg
      }, () => {
        this.setPhoneNumberReg();
      })
    })
  }
  // 设置手机号输入限制
  setPhoneNumberReg = () => {
    let element = document.getElementById('petOwnerPhoneNumber');
    // 静态前端维护的电话格式改成接口获取
    // let phoneReg = [];
    // let country = (window as any).countryEnum[JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || "{}")['storeId'] || '123457910']
    // switch (country) {
    //   case 'fr':
    //     phoneReg = [
    //       { mask: '(+33) 0 00 00 00 00' },
    //       { mask: '(+33) 00 00 00 00 00' }
    //     ];
    //     break;
    //   case 'us':
    //     phoneReg = [{ mask: '000-000-0000' }];
    //     break;
    //   case 'ru':
    //     phoneReg = [{ mask: '+{7} (000) 000-00-00' }];
    //     break;
    //   case 'mx':
    //     phoneReg = [{ mask: '+(52) 000 000 0000' }];
    //     break;
    //   case 'tr':
    //     phoneReg = [{ mask: '{0} (000) 000-00-00' }];
    //     break;
    //   default:
    //     phoneReg = [{ mask: '00000000000' }];
    //     break;
    // }
    let maskOptions = {
      mask: this.state.phoneReg
    };
    IMask(element, maskOptions);
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
      city: query.city,
      subscriptionType: query.subscriptionType,
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
  //       if (data.res.code === 'K-000000') {
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
    const { customerTypeArr, columns, subscriptionTypeList } = this.state;
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
            <Headline title={RCi18n({ id: 'PetOwner.PetownerList' })} />
            <Form className="filter-content" layout="inline">
              <Row>
                <Col span={8}>
                  <FormItem>
                    <Input
                      addonBefore={<p style={styles.label} title={RCi18n({ id: 'PetOwner.ConsumerAccount' })}>{RCi18n({ id: 'PetOwner.ConsumerAccount' })}</p>}
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
                      addonBefore={<p style={styles.label} title={RCi18n({ id: 'PetOwner.ConsumerName' })}>{RCi18n({ id: 'PetOwner.ConsumerName' })}</p>}
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
                      label={<p style={styles.label} title={RCi18n({ id: 'PetOwner.ConsumerType' })}>{RCi18n({ id: 'PetOwner.ConsumerType' })}</p>}
                      style={{ width: 177 }}
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
                        <p style={styles.label} title={RCi18n({ id: 'PetOwner.Email' })}>
                          <FormattedMessage id="PetOwner.Email" />
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
                        <p style={styles.label} title={RCi18n({ id: 'PetOwner.PhoneNumber' })}>
                          <FormattedMessage id="PetOwner.PhoneNumber" />
                        </p>
                      }
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'phoneNumber',
                          value
                        });
                      }}
                      id="petOwnerPhoneNumber"
                    />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    <TreeSelectGroup
                      allowClear
                      getPopupContainer={() => document.getElementById('page-content')}
                      label={<p style={styles.label} title={RCi18n({ id: 'PetOwner.subscriptionType' })}>{RCi18n({ id: 'PetOwner.subscriptionType' })}</p>}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto', minWidth: 200 }}
                      treeDefaultExpandAll
                      onChange={(value) => {
                        this.onFormChange({ field: 'subscriptionType', value });
                      }}
                    >
                      <TreeNode value="club" title={RCi18n({ id: 'PetOwner.Club' })} key="club">
                        <TreeNode value="cat" title={RCi18n({ id: 'PetOwner.Cat' })} key="cat" />
                        <TreeNode value="dog" title={RCi18n({ id: 'PetOwner.Dog' })} key="dog" />
                      </TreeNode>
                      <TreeNode value="Product" title={RCi18n({ id: 'PetOwner.Product' })} key="product">
                        <TreeNode value="food dispenser" title={RCi18n({ id: 'PetOwner.FoodDispenser' })} key="food" />
                      </TreeNode>
                      <TreeNode value="autoship" title={RCi18n({ id: 'PetOwner.Autoship' })} key="autoship" />
                    </TreeSelectGroup>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    <Input
                      addonBefore={
                        <p style={styles.label} title={RCi18n({ id: 'PetOwner.City' })}>
                          <FormattedMessage id="PetOwner.City" />
                        </p>
                      }
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'city',
                          value
                        });
                      }}
                    />
                  </FormItem>
                </Col>

              </Row>
              <Row>
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
                        <FormattedMessage id="PetOwner.search" />
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

const styles = {
  label: {
    width: 120,
    textAlign: 'center'
  },
  wrapper: {
    width: 157
  }
} as any;
