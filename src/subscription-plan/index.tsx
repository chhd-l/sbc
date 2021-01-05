import React, { Component } from 'react';
import { BreadCrumb, SelectGroup, Const, Headline } from 'qmkit';
import { Form, Row, Col, Select, Input, Button, message, Tooltip, Table } from 'antd';
import * as webapi from './webapi';
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
      title: 'Subscription Plan',
      subscriptionForm: {},
      typeList: ['Product'],
      subscriptionPlanList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      loading: false
    };

    this.handleTableChange = this.handleTableChange.bind(this);
    this.getSubscriptionPlanList = this.getSubscriptionPlanList.bind(this);
  }

  componentDidMount() {
    this.getSubscriptionPlanList();
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
            subscriptionPlanList: res.context,
            pagination: pagination,
            loading: false
          });
        } else {
          message.error(res.message || 'Get Data Failed');
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        message.error(err || 'Get Data Failed');
        this.setState({
          loading: false
        });
      });
  };
  render() {
    const { title, typeList, subscriptionPlanList } = this.state;
    const columns = [
      {
        title: 'Subscription Plan ID',
        dataIndex: 'subscriptionPlanId',
        key: 'subscriptionPlanId',
        width: '18%'
      },
      {
        title: 'Subscription Plan Name',
        dataIndex: 'name',
        key: 'name',
        width: '18%'
      },
      {
        title: 'Subscription Plan Type',
        dataIndex: 'type',
        key: 'type',
        width: '18%'
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
        width: '8%'
      },
      {
        title: 'Offer Time Period',
        dataIndex: 'timePeriod',
        key: 'timePeriod',
        width: '13%',
        render: (text, record) => moment(record.startDate).format('YYYY.MM.DD') + '-' + moment(record.endDate).format('YYYY.MM.DD')
      },
      {
        title: 'Number of Delivery',
        dataIndex: 'delivery',
        key: 'delivery',
        width: '13%'
      },
      {
        title: 'Operation',
        key: 'operation',
        width: '8%',
        render: (text, record) => (
          <div>
            <Tooltip placement="top" title="Edit">
              <Link to={'/subscription-plan-update/' + record.id} className="iconfont iconEdit"></Link>
            </Tooltip>
          </div>
        )
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
                    addonBefore={<p style={styles.label}>Subscription Plan Name</p>}
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'name',
                        value
                      });
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={<p style={styles.label}>Subscription Plan ID</p>}
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'id',
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
                    label={<p style={styles.label}>Subscription Plan Type</p>}
                    style={{ width: 195 }}
                    onChange={(value) => {
                      value = value === '' ? null : value;
                      this.onFormChange({
                        field: 'consumerType',
                        value
                      });
                    }}
                  >
                    <Option value="">
                      <FormattedMessage id="all" />
                    </Option>
                    {typeList &&
                      typeList.map((item, index) => (
                        <Option value={item} key={index}>
                          {item}
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
                      <FormattedMessage id="search" />
                    </span>
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="container">
          <Button type="primary" htmlType="submit" style={{ marginBottom: '20px' }}>
            <Link to={{ pathname: '/subscription-plan-add' }}>Add New Plan</Link>
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
