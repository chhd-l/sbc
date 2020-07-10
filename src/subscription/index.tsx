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
  message
} from 'antd';
import './index.less';
import { AuthWrapper, BreadCrumb, Headline, SelectGroup } from 'qmkit';
import List from './components/list-new';
import { FormattedMessage } from 'react-intl';
import * as webapi from './webapi';

import subscriptionData from './subscriptionData';

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
        recipientOption: 'Recipient',
        recipient: ''
      },
      subscriptionOption: ['Subscription Number', 'Order Number'],

      consumerOption: ['Consumer Name', 'Consumer Account'],
      productOption: ['Product Name', 'SKU Code'],
      recipientOption: ['Recipient', 'Recipient Phone'],
      frequencyList: [],
      activeKey: 'all',
      subscriptionList: []
    };
  }

  componentDidMount() {
    this.querySysDictionary('Frequency');

    this.getSubscriptionList();
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
    let params = {
      pageSize: 10,
      pageNum: 0,
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
      frequency: searchForm.frequency,
      status: activeKey
    };
    console.log(params);
  };
  //查询frequency
  querySysDictionary = (type: String) => {
    webapi
      .querySysDictionary({ type: type })
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          this.setState({
            frequencyList: res.context.sysDictionaryVOS
          });
        } else {
          message.error('Unsuccessful');
        }
      })
      .catch((err) => {
        message.error('Unsuccessful');
      });
  };
  //todo
  _handleBatchExport = () => {
    console.log('coding');
  };
  onTabChange = (key) => {
    this.setState({
      activeKey: key
    });
    console.log(key);
  };
  getSubscriptionList = () => {
    // webapi
    //   .getSubscriptionList({pageSize:10,pageNum:0}).then(data=>{
    //     console.log(data);
    //   })
    let res = subscriptionData;
    if (res === 'K-000000') {
      this.setState(() => {
        return { subscriptionList: res.context.subscriptionResponses };
      });
    }
  };

  render() {
    const {
      searchForm,
      subscriptionOption,
      productOption,
      consumerOption,
      recipientOption,
      frequencyList,
      activeKey
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
            <Headline title={<FormattedMessage id="subscriptionList" />} />
            <Form className="filter-content" layout="inline">
              <FormItem>
                <Input
                  addonBefore={
                    <Select
                      style={{ width: 140 }}
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
                      style={{ width: 140 }}
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
                      style={{ width: 140 }}
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
                  style={{ width: 80 }}
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
                  {frequencyList.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </SelectGroup>
              </FormItem>

              <FormItem>
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
            </div>

            {/* <SearchList /> */}

            <Tabs
              onChange={(key) => {
                this.onTabChange(key);
              }}
              activeKey={activeKey}
            >
              <Tabs.TabPane tab={<FormattedMessage id="all" />} key="all">
                <List />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Active" key="active">
                <List />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Inactive" key="inactive">
                <List />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
