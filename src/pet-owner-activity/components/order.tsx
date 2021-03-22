import React, { Component } from 'react';
import { Card, Icon, Row, Col, message, Tooltip, Table, Input, Menu, Checkbox, Select } from 'antd';
import * as webapi from '../webapi';
import { Const } from 'qmkit';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

const Option = Select.Option;

export default class orders extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      orderStatus: [],
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
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize,
      orderType: 'ALL_ORDER',
      buyerAccount: this.props.customerAccount
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
    const { orderList, orderCategories } = this.state;
    const deliverStatus = (status) => {
      if (status == 'NOT_YET_SHIPPED') {
        return <FormattedMessage id="order.notShipped" />;
      } else if (status == 'SHIPPED') {
        return <FormattedMessage id="order.allShipments" />;
      } else if (status == 'PART_SHIPPED') {
        return <FormattedMessage id="order.partialShipment" />;
      } else if (status == 'VOID') {
        return <FormattedMessage id="order.invalid" />;
      } else {
        return <FormattedMessage id="order.unknown" />;
      }
    };
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
        dataIndex: 'creationDate',
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
              title={<div>{deliverStatus(record.tradeState ? record.tradeState.deliverStatus : '')}</div>}
            >
              <p className="overFlowtext">{deliverStatus(record.tradeState ? record.tradeState.deliverStatus : '')}</p>
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
          <Col span={10}>
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
