import React, { Component } from 'react';
import { Card, Icon, Row, Col, message, Tooltip, Table, Input, DatePicker } from 'antd';
import * as webapi from '../webapi';
import { history, Const } from 'qmkit';
import { Link } from 'react-router-dom';
import { string } from 'prop-types';

const { RangePicker } = DatePicker;



export default class bookings extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      subscriptionList: [
      ],
      pagination: {
        current: 1,
        pageSize: 4,
        total: 0
      },
      formData: {},
      loading: false
    };
  }
  componentDidMount() {
    this.getSubscriptionList();
  }

  handleTableChange = (pagination: any) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.getSubscriptionList()
    );
  };
  onFormChange = (value) => {
    let data = this.state.formData;
    data['startTime'] = value[0] ? value[0] + ' 00:00:00' : null;
    data['endTime'] = value[1] ? value[1] + ' 23:59:59' : null;
    this.setState({
      formData: data
    }, ()=> this.getSubscriptionList());
  };
  getSubscriptionList = () => {
    const { formData, pagination } = this.state;
    let params = Object.assign(formData, {
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize,
      customerAccount: this.props.customerAccount
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
            subscriptionList: res.context.subscriptionResponses,
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
    const { subscriptionList } = this.state;
    const columns = [
      {
        title: 'Type',
        dataIndex: 'subscriptionType',
        width: '20%',
        render: (text, record) => {
          return (
            <Tooltip
              overlayStyle={{
                overflowY: 'auto'
              }}
              placement="bottomLeft"
              title={<div>{text}</div>}
            >
              <p className="overFlowtext">{text}</p>
            </Tooltip>
          );
        }
      },
      {
        title: 'Number',
        dataIndex: 'subscribeId',
        width: '20%',
        render: (text) => {
          return (
            <Tooltip
              overlayStyle={{
                overflowY: 'auto'
              }}
              placement="bottomLeft"
              title={<div>{text}</div>}
            >
              <p className="overFlowtext">
                {text}
              </p>
            </Tooltip>
          );
        }
      },
      {
        title: 'Product name',
        dataIndex: 'goodsInfo',
        width: '25%',
        render: (text, record) => {
          return (
            <Tooltip
              overlayStyle={{
                overflowY: 'auto'
              }}
              placement="bottomLeft"
              title={<div>{record.goodsInfo && record.goodsInfo.length > 0 ? record.goodsInfo.map((x) => x.goodsName).join(',') : ''}</div>}
            >
              <p className="overFlowtext">{record.goodsInfo && record.goodsInfo.length > 0 ? record.goodsInfo.map((x) => x.goodsName).join(',') : ''}</p>
            </Tooltip>
          );
        }
      },
      {
        title: 'Status',
        dataIndex: 'subscribeStatus',
        width: '25%',
        render: (text) => {
          return (
            <Tooltip
              overlayStyle={{
                overflowY: 'auto'
              }}
              placement="bottomLeft"
              title={<div>{text}</div>}
            >
              <p className="overFlowtext">{text === '0' ? 'Active' : 'Inactive'}</p>
            </Tooltip>
          );
        }
      },
      {
        title: '',
        key: 'operation',
        width: '10%',
        render: (text, record) => (
          <div>
            <Tooltip placement="top" title="Details">
              <Link to={'/subscription-detail/' + record.id} className="iconfont iconDetails"></Link>
            </Tooltip>
          </div>
        )
      }
    ];
    return (
      <Card title="Subscription" className="topCard">
        <Row>
          <Col span={9}></Col>
          <Col span={15} className="activities-right" style={{ marginBottom: '20px' }}>
            <RangePicker
              format="YYYY-MM-DD"
              onChange={(date, dateString) => {
                this.onFormChange(dateString);
              }}
            />
          </Col>
          <Col span={24}>
            <Table
              rowKey="id"
              size="small"
              columns={columns}
              dataSource={subscriptionList}
              pagination={this.state.pagination}
              loading={{ spinning: this.state.loading, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" /> }}
              scroll={{ x: '100%' }}
              onChange={this.handleTableChange}
            />
          </Col>
        </Row>
      </Card>
    );
  }
}
