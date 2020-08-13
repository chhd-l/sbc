import React, { Component } from 'react';
import {
  Breadcrumb,
  Button,
  Form,
  Input,
  DatePicker,
  Select,
  Menu,
  Dropdown,
  Icon,
  Tabs,
  message,
  Spin
} from 'antd';
import './index.less';
import { AuthWrapper, BreadCrumb, Headline, SelectGroup } from 'qmkit';
import List from './components/list-new';
import { FormattedMessage } from 'react-intl';
import * as webapi from './webapi';

const FormItem = Form.Item;
const Option = Select.Option;

export default class SubscriptionList extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      searchForm: {
        subscriptionOption: 'Subscription Number',
        number: '',
        consumerOption: 'Consumer Name',
        consumer: '',
        productOption: 'Product Name',
        product: '',
        frequency: '',
        recipientOption: 'Receiver',
        recipient: '',
        prescriberOption: 'Prescriber Name',
        prescriber: ''
      },
      subscriptionOption: ['Subscription Number', 'Order Number'],

      consumerOption: ['Consumer Name', 'Consumer Account'],
      productOption: ['Product Name', 'SKU Code'],
      recipientOption: ['Receiver', 'Receiver Phone'],
      prescriberOption: ['Prescriber Name', 'Prescriber ID'],
      frequencyList: [],
      activeKey: 'all',
      subscriptionList: [],
      searchParams: {},
      loading: true,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      isPrescriber: false,
      prescriberList: [],
      prescriberIds: []
    };
  }

  componentDidMount() {
    this.querySysDictionary('Frequency_week');
    if (sessionStorage.getItem('s2b-supplier@employee')) {
      let employee = JSON.parse(
        sessionStorage.getItem('s2b-supplier@employee')
      );
      if (employee.roleName && employee.roleName.indexOf('Prescriber') !== -1) {
        const { searchForm } = this.state;
        let prescriberList = employee.prescribers;
        let isPrescriber = true;
        let prescriberIds = [];
        for (let i = 0; i < prescriberList.length; i++) {
          if (prescriberList[i].id) {
            prescriberIds.push(prescriberList[i].id);
          }
        }
        searchForm.prescriberOption = 'Prescriber ID';
        searchForm.prescriber = 'all';
        this.setState(
          {
            searchForm: searchForm,
            prescriberList: prescriberList,
            isPrescriber: isPrescriber,
            prescriberIds: prescriberIds
          },
          () => {
            this.onSearch();
          }
        );
      } else {
        this.onSearch();
      }
    } else {
      this.onSearch();
    }
    //
  }

  onFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };

  onSearch = () => {
    const { searchForm, activeKey } = this.state;
    let param = {
      orderNumber:
        searchForm.subscriptionOption === 'Order Number'
          ? searchForm.number
          : '',
      subscriptionNumber:
        searchForm.subscriptionOption === 'Subscription Number'
          ? searchForm.number
          : '',
      consumerName:
        searchForm.consumerOption === 'Consumer Name'
          ? searchForm.consumer
          : '',
      consumerAccount:
        searchForm.consumerOption === 'Consumer Account'
          ? searchForm.consumer
          : '',
      productName:
        searchForm.productOption === 'Product Name' ? searchForm.product : '',
      skuCode:
        searchForm.productOption === 'SKU Code' ? searchForm.product : '',
      recipient:
        searchForm.recipientOption === 'Recipient' ? searchForm.recipient : '',
      recipientPhone:
        searchForm.recipientOption === 'Recipient Phone'
          ? searchForm.recipient
          : '',
      prescriberId:
        searchForm.prescriberOption === 'Prescriber ID'
          ? searchForm.prescriber
          : '',
      prescriberName:
        searchForm.prescriberOption === 'Prescriber Name'
          ? searchForm.prescriber
          : '',
      frequency: searchForm.frequency,
      status: activeKey
    };
    this.setState(
      () => {
        return {
          searchParams: {
            customerAccount: param.consumerAccount ? param.consumerAccount : '',
            customerName: param.consumerName ? param.consumerName : '',
            subscribeId: param.subscriptionNumber,
            // subscribeIds: param.subscriptionNumber
            //   ? [param.subscriptionNumber]
            //   : [],
            cycleTypeId: param.frequency,
            subscribeStatus: param.status === 'all' ? '' : param.status,
            consigneeName: param.recipient ? param.recipient : '',
            consigneeNumber: param.recipientPhone ? param.recipientPhone : '',
            orderCode: param.orderNumber ? param.orderNumber : '',
            skuNo: param.skuCode ? param.skuCode : '',
            goodsName: param.productName ? param.productName : '',
            prescriberId: param.prescriberId ? param.prescriberId : '',
            prescriberName: param.prescriberName ? param.prescriberName : ''
          }
        };
      },
      () => this.getSubscriptionList(this.state.searchParams)
    );
  };
  //查询frequency
  querySysDictionary = (type: String) => {
    webapi
      .querySysDictionary({ type: type })
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          if (type === 'Frequency_week') {
            let frequencyList = [...res.context.sysDictionaryVOS];
            this.setState(
              {
                frequencyList: frequencyList
              },
              () => this.querySysDictionary('Frequency_month')
            );
          }
          if (type === 'Frequency_month') {
            let frequencyList = [
              ...this.state.frequencyList,
              ...res.context.sysDictionaryVOS
            ];
            this.setState({
              frequencyList: frequencyList
            });
          }
        } else {
          message.error(res.message || 'Unsuccessful');
        }
      })
      .catch((err) => {
        message.error(err.message || 'Unsuccessful');
      });
  };
  //todo
  _handleBatchExport = () => {
    console.log('coding');
  };
  onTabChange = (key) => {
    this.setState(
      {
        activeKey: key
      },
      () => this.onSearch()
    );
  };
  getSubscriptionList = (param = {}) => {
    if (this.state.isPrescriber && param.prescriberId === 'all') {
      param.prescriberId = '';
      param.prescriberIds = this.state.prescriberIds;
    }
    let params = Object.assign({ pageSize: 10, pageNum: 0 }, param);

    this.setState({
      loading: true
    });
    webapi
      .getSubscriptionList(params)
      .then((data) => {
        let { res } = data;
        if (res.code === 'K-000000') {
          let pagination = {
            current: 1,
            pageSize: 10,
            total: res.context.total
          };
          this.setState(() => {
            return {
              subscriptionList: res.context.subscriptionResponses,
              loading: false,
              pagination: pagination
            };
          });
        } else {
          this.setState({
            loading: false
          });
          message.error(res.message || 'Unsuccessful');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.message || 'Unsuccessful');
      });
  };

  render() {
    const {
      searchForm,
      subscriptionOption,
      productOption,
      consumerOption,
      recipientOption,
      frequencyList,
      activeKey,
      prescriberOption,
      prescriberList
    } = this.state;
    const menu = (
      <Menu>
        <Menu.Item>
          <AuthWrapper functionName="f_subscription_export">
            <a href="javascript:;" onClick={() => this._handleBatchExport()}>
              <FormattedMessage id="order.batchExport" />
            </a>
          </AuthWrapper>
        </Menu.Item>
      </Menu>
    );

    return (
      <AuthWrapper functionName="f_subscription_list">
        <div className="order-con">
          <BreadCrumb />
          <div className="container">
            <Spin spinning={this.state.loading}>
              <Headline title={<FormattedMessage id="subscriptionList" />} />
              <Form className="filter-content" layout="inline">
                <FormItem>
                  <Input
                    addonBefore={
                      <Select
                        // style={{ width: auto }}
                        defaultValue={searchForm.subscriptionOption}
                        onChange={(value) => {
                          value = value === '' ? null : value;
                          this.onFormChange({
                            field: 'subscriptionOption',
                            value
                          });
                        }}
                      >
                        {subscriptionOption.map((item) => (
                          <Option value={item} key={item}>
                            {item}
                          </Option>
                        ))}
                      </Select>
                    }
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'number',
                        value
                      });
                    }}
                  />
                </FormItem>

                <FormItem>
                  <Input
                    addonBefore={
                      <Select
                        // style={{ width: 140 }}
                        defaultValue={searchForm.consumerOption}
                        onChange={(value) => {
                          value = value === '' ? null : value;
                          this.onFormChange({
                            field: 'consumerOption',
                            value
                          });
                        }}
                      >
                        {consumerOption.map((item) => (
                          <Option value={item} key={item}>
                            {item}
                          </Option>
                        ))}
                      </Select>
                    }
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'consumer',
                        value
                      });
                    }}
                  />
                </FormItem>

                <FormItem>
                  <Input
                    addonBefore={
                      <Select
                        // style={{ width: 140 }}
                        defaultValue={searchForm.productOption}
                        onChange={(value) => {
                          value = value === '' ? null : value;
                          this.onFormChange({
                            field: 'productOption',
                            value
                          });
                        }}
                      >
                        {productOption.map((item) => (
                          <Option value={item} key={item}>
                            {item}
                          </Option>
                        ))}
                      </Select>
                    }
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'product',
                        value
                      });
                    }}
                  />
                </FormItem>

                <FormItem>
                  <SelectGroup
                    defaultValue=""
                    label="Frequency"
                    onChange={(value) => {
                      value = value === '' ? null : value;
                      this.onFormChange({
                        field: 'frequency',
                        value
                      });
                    }}
                  >
                    <Option value="">
                      <FormattedMessage id="all" />
                    </Option>
                    {frequencyList &&
                      frequencyList.map((item, index) => (
                        <Option value={item.id} key={index}>
                          {item.name}
                        </Option>
                      ))}
                  </SelectGroup>
                </FormItem>

                {/* <FormItem>
                  <Input
                    addonBefore={
                      <Select
                        style={{ width: 140 }}
                        defaultValue={searchForm.recipientOption}
                        onChange={(value) => {
                          value = value === '' ? null : value;
                          this.onFormChange({
                            field: 'recipientOption',
                            value
                          });
                        }}
                      >
                        {recipientOption.map((item) => (
                          <Option value={item} key={item}>
                            {item}
                          </Option>
                        ))}
                      </Select>
                    }
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'recipient',
                        value
                      });
                    }}
                  />
                </FormItem> */}

                {this.state.isPrescriber ? (
                  <FormItem>
                    <SelectGroup
                      value={searchForm.prescriber}
                      label="Prescriber"
                      onChange={(value) => {
                        value = value === '' ? null : value;
                        this.onFormChange({
                          field: 'prescriber',
                          value
                        });
                      }}
                    >
                      <Option value="all">All</Option>
                      {prescriberList &&
                        prescriberList.map((item, index) => (
                          <Option value={item.id} key={index}>
                            {item.prescriberName}
                          </Option>
                        ))}
                    </SelectGroup>
                  </FormItem>
                ) : (
                  <FormItem>
                    <Input
                      addonBefore={
                        <Select
                          // style={{ width: 140 }}
                          defaultValue={searchForm.prescriberOption}
                          onChange={(value) => {
                            value = value === '' ? null : value;
                            this.onFormChange({
                              field: 'prescriberOption',
                              value
                            });
                          }}
                        >
                          {prescriberOption.map((item) => (
                            <Option value={item} key={item}>
                              {item}
                            </Option>
                          ))}
                        </Select>
                      }
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'prescriber',
                          value
                        });
                      }}
                    />
                  </FormItem>
                )}

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
              </Form>
              {/* 
              <div className="handle-bar">
                <Dropdown
                  overlay={menu}
                  placement="bottomLeft"
                  getPopupContainer={() =>
                    document.getElementById('page-content')
                  }
                >
                  <Button>
                    <FormattedMessage id="order.bulkOperations" />{' '}
                    <Icon type="down" />
                  </Button>
                </Dropdown>
              </div> */}

              {/* <SearchList /> */}

              <Tabs
                onChange={(key) => {
                  this.onTabChange(key);
                }}
                activeKey={activeKey}
              >
                <Tabs.TabPane tab={<FormattedMessage id="all" />} key="all">
                  <List
                    data={this.state.subscriptionList}
                    pagination={this.state.pagination}
                    searchParams={this.state.searchParams}
                  />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Active" key="0">
                  <List
                    data={this.state.subscriptionList}
                    pagination={this.state.pagination}
                    searchParams={this.state.searchParams}
                  />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Inactive" key="2">
                  <List
                    data={this.state.subscriptionList}
                    pagination={this.state.pagination}
                    searchParams={this.state.searchParams}
                  />
                </Tabs.TabPane>
              </Tabs>
            </Spin>
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
