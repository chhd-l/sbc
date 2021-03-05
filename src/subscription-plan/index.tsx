import React, { Component } from 'react';
import { BreadCrumb, SelectGroup, Const, Headline } from 'qmkit';
import { Form, Row, Col, Select, Input, Button, message, Tooltip, Table, Switch } from 'antd';
import * as webapi from './webapi';
import { getSubscriptionPlanTypes } from './../subscription-plan-update/webapi';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;

export default class SubscriptionPlan extends Component<any, any> {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      title: <FormattedMessage id="Subscription.SubscriptionPlan" />,
      subscriptionForm: {},
      typeList: [],
      subscriptionPlanList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      loading: false
    };

    // this.handleTableChange = this.handleTableChange.bind(this);
    // this.getSubscriptionPlanList = this.getSubscriptionPlanList.bind(this);
  }

  componentDidMount() {
    this.getSubscriptionPlanList();
    getSubscriptionPlanTypes()
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            typeList: res.context.sysDictionaryVOS
          });
        } else {
          message.error(<FormattedMessage id="SubscriptionPlan.GetPlanFailed" />);
        }
      })
      .catch(() => {
        message.error(<FormattedMessage id="SubscriptionPlan.GetPlanFailed" />);
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
      () => this.getSubscriptionPlanList()
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
      () => this.getSubscriptionPlanList()
    );
  };
  getSubscriptionPlanList = () => {
    const { subscriptionForm, pagination } = this.state;
    let params = Object.assign(subscriptionForm, {
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize
    });
    this.setState({
      loading: true
    });
    webapi
      .getSubscriptionPlanList(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          pagination.total = res.context.total;
          this.setState({
            subscriptionPlanList: res.context.subscriptionPlanResponses || [],
            pagination: pagination,
            loading: false
          });
        } else {
          message.error(res.message || <FormattedMessage id="SubscriptionPlan.GetDataFailed" />);
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        message.error(err || <FormattedMessage id="SubscriptionPlan.GetDataFailed" />);
        this.setState({
          loading: false
        });
      });
  };

  setSubscriptionPlanEnableFlag = (id, enableFlag) => {
    const { subscriptionPlanList } = this.state;
    this.setState({ loading: true });
    webapi
      .setSubscriptionPlanEnableFlag(id, enableFlag)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          subscriptionPlanList.forEach((plan) => {
            if (plan.id === id) {
              plan.enableFlag = enableFlag;
            }
          });
          this.setState({
            subscriptionPlanList,
            loading: false
          });
        } else {
          message.error(res.message || <FormattedMessage id="SubscriptionPlan.UpdateDataFailed" />);
          this.setState({ loading: false });
        }
      })
      .catch((err) => {
        message.error(err || <FormattedMessage id="SubscriptionPlan.UpdateDataFailed" />);
        this.setState({
          loading: false
        });
      });
  };

  render() {
    const { title, typeList, subscriptionPlanList } = this.state;
    const columns = [
      {
        title: <FormattedMessage id="SubscriptionPlan.Table.SubscriptionPlanID" />,
        dataIndex: 'planId',
        key: 'planId',
        width: '18%'
      },
      {
        title: <FormattedMessage id="SubscriptionPlan.Table.SubscriptionPlanName" />,
        dataIndex: 'planName',
        key: 'planName',
        width: '18%'
      },
      {
        title: <FormattedMessage id="SubscriptionPlan.Table.SubscriptionPlanType" />,
        dataIndex: 'planType',
        key: 'planType',
        width: '12%'
      },
      {
        title: <FormattedMessage id="SubscriptionPlan.Table.Quantity" />,
        dataIndex: 'quantity',
        key: 'quantity',
        width: '8%'
      },
      {
        title: <FormattedMessage id="SubscriptionPlan.Table.OfferTimePeriod" />,
        key: 'timePeriod',
        width: '13%',
        render: (text, record) => moment(record.startDate).format('YYYY.MM.DD') + '-' + moment(record.endDate).format('YYYY.MM.DD')
      },
      {
        title: <FormattedMessage id="SubscriptionPlan.Table.NumberofDelivery" />,
        dataIndex: 'deliveryTimes',
        key: 'deliveryTimes',
        width: '10%'
      },
      {
        title: <FormattedMessage id="SubscriptionPlan.Table.Status" />,
        dataIndex: 'status',
        key: 'status',
        width: '7%',
        render: (text) => (text === 0 ? 'Draft' : 'Publish')
      },
      {
        title: <FormattedMessage id="SubscriptionPlan.Table.Enable" />,
        dataIndex: 'enableFlag',
        key: 'enable',
        width: '8%',
        render: (text, record) => (
          <div>
            <Switch
              checked={text}
              onChange={(value) => {
                this.setSubscriptionPlanEnableFlag(record.id, value);
              }}
            />
          </div>
        )
      },
      {
        title: <FormattedMessage id="SubscriptionPlan.Table.Operation" />,
        key: 'operation',
        width: '8%',
        render: (text, record) =>
          record.status === 0 ? (
            <div>
              <Tooltip placement="top" title={<FormattedMessage id="SubscriptionPlan.Detail" />}>
                <Link to={'/subscription-plan-detail/' + record.id} className="iconfont iconDetails" style={{ paddingRight: 10 }}></Link>
              </Tooltip>
              <Tooltip placement="top" title={<FormattedMessage id="SubscriptionPlan.Edit" />}>
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
                        <FormattedMessage id="SubscriptionPlan.SubscriptionPlanName" />
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
                        <FormattedMessage id="SubscriptionPlan.SubscriptionPlanID" />
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
                        <FormattedMessage id="SubscriptionPlan.SubscriptionPlanType" />
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
                      <FormattedMessage id="SubscriptionPlan.all" />
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
                      <FormattedMessage id="SubscriptionPlan.search" />
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
              <FormattedMessage id="SubscriptionPlan.AddNewPlan" />
            </Link>
          </Button>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={subscriptionPlanList}
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
