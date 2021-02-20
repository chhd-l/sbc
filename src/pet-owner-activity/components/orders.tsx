import React, { Component } from 'react';
import { Card, Icon, Row, Col, message, Tooltip, Table } from 'antd';
import * as webapi from '../webapi';
import { history, Const } from 'qmkit';
import { Link } from 'react-router-dom';

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
      formData: {}
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

  getOrderList = () => {
    const { formData, pagination } = this.state;
    let params = Object.assign(formData, {
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize
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
            orderList: res.context.orderList,
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
        title: 'Order Type',
        dataIndex: 'orderType',
        width: '10%'
      },
      {
        title: 'Pet',
        dataIndex: 'Pet',
        width: '15%'
      },
      {
        title: 'Order No',
        dataIndex: 'status',
        width: '10%'
      },
      {
        title: 'Order Time',
        dataIndex: 'priority',
        width: '10%'
      },
      {
        title: 'Order Status',
        dataIndex: 'assistantEmail',
        width: '15%'
      },
      {
        title: 'Operation',
        key: 'operation',
        width: '10%',
        render: (text, record) => (
          <div>
            <Tooltip placement="top" title="Details">
              <Link to={'/order-detail-prescriber/' + record.orderNumber} className="iconfont iconDetails"></Link>
            </Tooltip>
          </div>
        )
      }
    ];
    return (
      <div>
        <Card title="Order">
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
        </Card>
      </div>
    );
  }
}
