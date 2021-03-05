import React, { Component } from 'react';
import { Breadcrumb, Button, Form, Input, DatePicker, Select, Menu, Dropdown, Icon, Tabs, message, Spin, Row, Col } from 'antd';
import './index.less';
import { AuthWrapper, BreadCrumb, Headline, SelectGroup, Const } from 'qmkit';
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
        subscriptionOption: <FormattedMessage id="Subscription.searchForm.SubscriptionNumber" />,
        number: '',
        consumerOption: <FormattedMessage id="Subscription.searchForm.ConsumerName" />,
        consumer: '',
        productOption: <FormattedMessage id="Subscription.searchForm.ProductName" />,
        product: '',
        frequency: '',
        recipientOption: <FormattedMessage id="Subscription.searchForm.Receiver" />,
        recipient: '',
        prescriberOption: <FormattedMessage id="Subscription.searchForm.AuditorName" />,
        prescriber: ''
      },
      subscriptionOption: [<FormattedMessage id="Subscription.subscriptionOption.SubscriptionNumber" />, <FormattedMessage id="Subscription.subscriptionOption.OrderNumber" />],
      consumerOption: ['Consumer Name', 'Consumer Account'],
      productOption: ['Product Name', 'SKU Code'],
      recipientOption: ['Receiver', 'Receiver Phone'],
      prescriberOption: ['Auditor Name', 'Auditor ID'],
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
    this.querySysDictionary('Frequency_day');
    if (sessionStorage.getItem('s2b-supplier@employee')) {
      let employee = JSON.parse(sessionStorage.getItem('s2b-supplier@employee'));
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
        searchForm.prescriberOption = 'Auditor ID';
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
    let prescriberType = JSON.parse(sessionStorage.getItem('PrescriberType')) ? JSON.parse(sessionStorage.getItem('PrescriberType')).value : null;
    let param = {
      orderNumber: searchForm.subscriptionOption === 'Order Number' ? searchForm.number : '',
      subscriptionNumber: searchForm.subscriptionOption === 'Subscription Number' ? searchForm.number : '',
      consumerName: searchForm.consumerOption === 'Consumer Name' ? searchForm.consumer : '',
      consumerAccount: searchForm.consumerOption === 'Consumer Account' ? searchForm.consumer : '',
      productName: searchForm.productOption === 'Product Name' ? searchForm.product : '',
      skuCode: searchForm.productOption === 'SKU Code' ? searchForm.product : '',
      recipient: searchForm.recipientOption === 'Recipient' ? searchForm.recipient : '',
      recipientPhone: searchForm.recipientOption === 'Recipient Phone' ? searchForm.recipient : '',
      prescriberId:
        // searchForm.prescriberOption === 'Prescriber ID'
        //   ? searchForm.prescriber
        //   : '',
        JSON.parse(sessionStorage.getItem('s2b-employee@data')).clinicsIds != null ? prescriberType : searchForm.prescriberOption === 'Auditor ID' ? searchForm.prescriber : '',
      prescriberName: searchForm.prescriberOption === 'Auditor Name' ? searchForm.prescriber : '',
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
      .querySysDictionary({
        type: type
      })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          if (type === 'Frequency_day') {
            let frequencyList = [...res.context.sysDictionaryVOS];
            this.setState(
              {
                frequencyList: frequencyList
              },
              () => this.querySysDictionary('Frequency_week')
            );
          }
          if (type === 'Frequency_week') {
            let frequencyList = [...this.state.frequencyList, ...res.context.sysDictionaryVOS];
            this.setState(
              {
                frequencyList: frequencyList
              },
              () => this.querySysDictionary('Frequency_month')
            );
          }
          if (type === 'Frequency_month') {
            let frequencyList = [...this.state.frequencyList, ...res.context.sysDictionaryVOS];
            this.setState({
              frequencyList: frequencyList
            });
          }
        }
      })
      .catch((err) => {});
  };
  //todo
  _handleBatchExport = () => {};
  onTabChange = (key) => {
    this.setState(
      {
        activeKey: key
      },
      () => this.onSearch()
    );
  };
  getSubscriptionList = (param?) => {
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
        if (res.code === Const.SUCCESS_CODE) {
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
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };

  render() {
    const { searchForm, subscriptionOption, productOption, consumerOption, recipientOption, frequencyList, activeKey, prescriberOption, prescriberList } = this.state;
    const menu = (
      <Menu>
        <Menu.Item>
          <AuthWrapper functionName="f_subscription_export">
            <a href="javascript:;" onClick={() => this._handleBatchExport()}>
              <FormattedMessage id="Subscription.batchExport" />
            </a>
          </AuthWrapper>
        </Menu.Item>
      </Menu>
    );
    let prescriberType = JSON.parse(sessionStorage.getItem('PrescriberType')) ? JSON.parse(sessionStorage.getItem('PrescriberType')).value : null;

    const clinicsIds = JSON.parse(sessionStorage.getItem('s2b-employee@data')) ? JSON.parse(sessionStorage.getItem('s2b-employee@data')).clinicsIds : null;

    return (
      <AuthWrapper functionName="f_subscription_list">
        <div className="order-con">
          <BreadCrumb />
          <div className="container-search">
            <Headline title={<FormattedMessage id="Subscription.SubscriptionList" />} />
            <Form className="filter-content" layout="inline">
              <Row>
                <Col span={8}>
                  <FormItem>
                    <Input
                      addonBefore={
                        <Select
                          style={{ width: 170 }}
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
                </Col>

                <Col span={8}>
                  <FormItem>
                    <Input
                      addonBefore={
                        <Select
                          style={styles.label}
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
                </Col>
                <Col span={8}>
                  <FormItem>
                    <SelectGroup
                      defaultValue=""
                      label={
                        <p style={{ width: 110 }}>
                          <FormattedMessage id="Subscription.Frequency" />
                        </p>
                      }
                      style={{ width: 180 }}
                      onChange={(value) => {
                        value = value === '' ? null : value;
                        this.onFormChange({
                          field: 'frequency',
                          value
                        });
                      }}
                    >
                      <Option value="">
                        <FormattedMessage id="Subscription.all" />
                      </Option>
                      {frequencyList &&
                        frequencyList.map((item, index) => (
                          <Option value={item.id} key={index}>
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
                        <Select
                          style={{ width: 170 }}
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
                </Col>
                <Col span={8}>
                  {/* todo */}
                  {this.state.isPrescriber ? (
                    <FormItem>
                      <SelectGroup
                        disabled={JSON.parse(sessionStorage.getItem('s2b-employee@data')).clinicsIds ? true : false}
                        value={clinicsIds ? prescriberType : searchForm.prescriber}
                        // value={searchForm.prescriber}
                        label={
                          <p style={styles.label}>
                            <FormattedMessage id="Subscription.Prescriber" />
                          </p>
                        }
                        onChange={(value) => {
                          value = value === '' ? null : value;
                          this.onFormChange({
                            field: 'prescriber',
                            value
                          });
                        }}
                      >
                        <Option value="all">
                          <FormattedMessage id="Subscription.all" />
                        </Option>
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
                            style={styles.label}
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
                        <FormattedMessage id="Subscription.search" />
                      </span>
                    </Button>
                  </FormItem>
                </Col>
              </Row>

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
            </Form>
          </div>
          <div className="container">
            {/* 
            <Spin spinning={this.state.loading}>
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
              <Tabs.TabPane tab={<FormattedMessage id="Subscription.TabPane.all" />} key="all">
                <List data={this.state.subscriptionList} pagination={this.state.pagination} searchParams={this.state.searchParams} />
              </Tabs.TabPane>
              <Tabs.TabPane tab={<FormattedMessage id="Subscription.TabPane.Active" />} key="0">
                <List data={this.state.subscriptionList} pagination={this.state.pagination} searchParams={this.state.searchParams} />
              </Tabs.TabPane>
              <Tabs.TabPane tab={<FormattedMessage id="Subscription.TabPane.Inactive" />} key="2">
                <List data={this.state.subscriptionList} pagination={this.state.pagination} searchParams={this.state.searchParams} />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
const styles = {
  label: {
    width: 150,
    textAlign: 'center'
  },
  wrapper: {
    width: 157
  }
} as any;
