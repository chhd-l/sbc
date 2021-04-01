import React, { Component } from 'react';
import { Card, Icon, Row, Col, message, Tooltip, Table, Input, Menu, Checkbox, Select } from 'antd';
import * as webapi from '../webapi';
import { Const, OrderStatus, getOrderStatusValue } from 'qmkit';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

const Option = Select.Option;

export default class orders extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      orderList: [],
      pagination: {
        current: 1,
        pageSize: 4,
        total: 0
      },
      formData: {},
      loading: false
    };
    this.handleTableChange = this.handleTableChange.bind(this);
    this.getOrderList = this.getOrderList.bind(this);
  }

  componentDidMount() {
    this.getOrderList();
  }

  handleTableChange = (pagination: any) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.getOrderList()
    );
  };
  onFormChange = ({ field, value }) => {
    let data = this.state.formData;
    data[field] = value;
    this.setState(
      {
        formData: data
      },
      () => this.getOrderList()
    );
  };
  getOrderList = () => {
    const { formData, pagination } = this.state;
    let params = Object.assign(formData, {
      id: formData.id,
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize,
      orderType: 'ALL_ORDER',
      buyerId: this.props.petOwnerId,
      tradeState: { flowState: formData.status }
    });
    this.setState({
      loading: true
    });
    webapi
      .getOrderList(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          pagination.total = res.context.total;
          this.setState({
            orderList: res.context.content,
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
    const { orderList } = this.state;
    const columns = [
      {
        title: 'Number',
        dataIndex: 'id',
        width: '30%',
        render: (text) => {
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
        title: 'Time',
        dataIndex: 'tradeState.createTime',
        width: '30%',
        render: (text) => {
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
        title: 'Status',
        dataIndex: 'status',
        width: '30%',
        render: (text, record) => {
          return (
            <Tooltip
              overlayStyle={{
                overflowY: 'auto'
              }}
              placement="bottomLeft"
              title={<div><FormattedMessage id={record.tradeState ? getOrderStatusValue('OrderStatus', record.tradeState.flowState): ''}/></div>}
            >
              <p className="overFlowtext"><FormattedMessage id={record.tradeState ? getOrderStatusValue('OrderStatus', record.tradeState.flowState): ''}/></p>
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
              <Link to={'/order-detail/' + record.id} className="iconfont iconDetails"></Link>
            </Tooltip>
          </div>
        )
      }
    ];
    return (
      <Card title="Order" className="topCard">
        <Row>
          <Col span={9} style={{ marginBottom: '20px' }}>
            <Input
              className="searchInput"
              placeholder="Order Number"
              onPressEnter={() => this.getOrderList()}
              onChange={(e) => {
                const value = (e.target as any).value;
                this.onFormChange({
                  field: 'id',
                  value
                });
              }}
              prefix={<Icon type="search" onClick={() => this.getOrderList()} />}
            />
          </Col>
          <Col span={15} className="activities-right" style={{ marginBottom: '20px' }}>
            <div style={{ marginRight: '10px' }}>
              <Select
                allowClear
                className="filter"
                placeholder="Order Status"
                style={{ width: '180px' }}
                onChange={(value) => {
                  this.onFormChange({
                    field: 'status',
                    value
                  });
                }}
              >
                {OrderStatus.map((item) => (
                  <Option value={item.value}>{item.name}</Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col span={24}>
            <Table
              rowKey="id"
              size="small"
              columns={columns}
              dataSource={orderList}
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
