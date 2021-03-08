import React, { Component } from 'react';
import { BreadCrumb, SelectGroup, Const, Headline } from 'qmkit';
import { Form, Row, Col, Select, Input, Button, message, Tooltip, Table, Switch } from 'antd';
import * as webapi from './webapi';
import { getSubscriptionTypes } from './../subscription-plan-update/webapi';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;

export default class Subscription extends Component<any, any> {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      title: <FormattedMessage id="Subscription.Subscription" />,
      subscriptionForm: {},
      typeList: [],
      SubscriptionList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      loading: false
    };

    // this.handleTableChange = this.handleTableChange.bind(this);
    // this.getSubscriptionList = this.getSubscriptionList.bind(this);
  }

  componentDidMount() {
    this.getSubscriptionList();
    getSubscriptionTypes()
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            typeList: res.context.sysDictionaryVOS
          });
        } else {
          message.error(<FormattedMessage id="Subscription.GetPlanFailed" />);
        }
      })
      .catch(() => {
        message.error(<FormattedMessage id="Subscription.GetPlanFailed" />);
      });
  }

  onFormChange = ({ field, value }) => {
    let data = this.state.subscriptionForm;
    data[field] = value;
    this.setState({
      subscriptionForm: data
    });
  };
  handleTableChange = (pagination: any) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.getSubscriptionList()
    );
  };
  onSearch = () => {
    this.setState(
      {
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        }
      },
      () => this.getSubscriptionList()
    );
  };
  getSubscriptionList = () => {
    const { subscriptionForm, pagination } = this.state;
    let params = Object.assign(subscriptionForm, {
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize
    });
    this.setState({
      loading: true
    });
    webapi
      .getSubscriptionList(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          pagination.total = res.context.total;
          this.setState({
            SubscriptionList: res.context.SubscriptionResponses || [],
            pagination: pagination,
            loading: false
          });
        } else {
          message.error(res.message || <FormattedMessage id="Subscription.GetDataFailed" />);
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        message.error(err || <FormattedMessage id="Subscription.GetDataFailed" />);
        this.setState({
          loading: false
        });
      });
  };

  setSubscriptionEnableFlag = (id, enableFlag) => {
    const { SubscriptionList } = this.state;
    this.setState({ loading: true });
    webapi
      .setSubscriptionEnableFlag(id, enableFlag)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          SubscriptionList.forEach((plan) => {
            if (plan.id === id) {
              plan.enableFlag = enableFlag;
            }
          });
          this.setState({
            SubscriptionList,
            loading: false
          });
        } else {
          message.error(res.message || <FormattedMessage id="Subscription.UpdateDataFailed" />);
          this.setState({ loading: false });
        }
      })
      .catch((err) => {
        message.error(err || <FormattedMessage id="Subscription.UpdateDataFailed" />);
        this.setState({
          loading: false
        });
      });
  };

  render() {
    const { title, typeList, SubscriptionList } = this.state;
    const columns = [
      {
        title: <FormattedMessage id="Subscription.Table.SubscriptionID" />,
        dataIndex: 'planId',
        key: 'planId',
        width: '18%'
      },
      {
        title: <FormattedMessage id="Subscription.Table.SubscriptionName" />,
        dataIndex: 'planName',
        key: 'planName',
        width: '18%'
      },
      {
        title: <FormattedMessage id="Subscription.Table.SubscriptionType" />,
        dataIndex: 'planType',
        key: 'planType',
        width: '12%'
      },
      {
        title: <FormattedMessage id="Subscription.Table.Quantity" />,
        dataIndex: 'quantity',
        key: 'quantity',
        width: '8%'
      },
      {
        title: <FormattedMessage id="Subscription.Table.OfferTimePeriod" />,
        key: 'timePeriod',
        width: '13%',
        render: (text, record) => moment(record.startDate).format('YYYY.MM.DD') + '-' + moment(record.endDate).format('YYYY.MM.DD')
      },
      {
        title: <FormattedMessage id="Subscription.Table.NumberofDelivery" />,
        dataIndex: 'deliveryTimes',
        key: 'deliveryTimes',
        width: '10%'
      },
      {
        title: <FormattedMessage id="Subscription.Table.Status" />,
        dataIndex: 'status',
        key: 'status',
        width: '7%',
        render: (text) => (text === 0 ? 'Draft' : 'Publish')
      },
      {
        title: <FormattedMessage id="Subscription.Table.Enable" />,
        dataIndex: 'enableFlag',
        key: 'enable',
        width: '8%',
        render: (text, record) => (
          <div>
            <Switch
              checked={text}
              onChange={(value) => {
                this.setSubscriptionEnableFlag(record.id, value);
              }}
            />
          </div>
        )
      },
      {
        title: <FormattedMessage id="Subscription.Table.Operation" />,
        key: 'operation',
        width: '8%',
        render: (text, record) =>
          record.status === 0 ? (
            <div>
              <Tooltip placement="top" title={<FormattedMessage id="Subscription.Detail" />}>
                <Link to={'/subscription-plan-detail/' + record.id} className="iconfont iconDetails" style={{ paddingRight: 10 }}></Link>
              </Tooltip>
              <Tooltip placement="top" title={<FormattedMessage id="Subscription.Edit" />}>
                <Link to={'/subscription-plan-update/' + record.id} className="iconfont iconEdit"></Link>
              </Tooltip>
            </div>
          ) : null
      }
    ];
    return (
      <div>
        <BreadCrumb />
        <div className="container-search">
          <Headline title={title} />
          <Form className="filter-content" layout="inline">
            <Row>
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={
                      <p style={styles.label}>
                        <FormattedMessage id="Subscription.SubscriptionName" />
                      </p>
                    }
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'planName',
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
                        <FormattedMessage id="Subscription.SubscriptionID" />
                      </p>
                    }
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'planId',
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
                      <p style={styles.label}>
                        <FormattedMessage id="Subscription.SubscriptionType" />
                      </p>
                    }
                    style={{ width: 195 }}
                    onChange={(value) => {
                      value = value === '' ? null : value;
                      this.onFormChange({
                        field: 'planType',
                        value
                      });
                    }}
                  >
                    <Option value="">
                      <FormattedMessage id="Subscription.all" />
                    </Option>
                    {typeList &&
                      typeList.map((item, index) => (
                        <Option value={item.name} key={index}>
                          {item.name}
                        </Option>
                      ))}
                  </SelectGroup>
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
                      <FormattedMessage id="Subscription.search" />
                    </span>
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="container">
          <Button type="primary" htmlType="submit" style={{ marginBottom: '20px' }}>
            <Link to={{ pathname: '/subscription-plan-add' }}>
              <FormattedMessage id="Subscription.AddNewPlan" />
            </Link>
          </Button>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={SubscriptionList}
            pagination={this.state.pagination}
            loading={{ spinning: this.state.loading, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" /> }}
            scroll={{ x: '100%' }}
            onChange={this.handleTableChange}
          />
        </div>
      </div>
    );
  }
}

const styles = {
  label: {
    width: 143,
    textAlign: 'center'
  },
  wrapper: {
    width: 157
  }
} as any;
