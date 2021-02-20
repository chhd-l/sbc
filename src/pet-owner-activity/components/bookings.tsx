import React, { Component } from 'react';
import { Card, Icon, Row, Col, message, Tooltip, Table, Input, DatePicker } from 'antd';
import * as webapi from '../webapi';
import { history, Const } from 'qmkit';
import { Link } from 'react-router-dom';

export default class bookings extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      bookingList: [],
      pagination: {
        current: 1,
        pageSize: 4,
        total: 0
      },
      formData: {}
    };
  }
  componentDidMount() {
    this.getBookingList();
  }

  handleTableChange = (pagination: any) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.getBookingList()
    );
  };
  onFormChange = ({ field, value }) => {
    let data = this.state.formData;
    data[field] = value;
    this.setState({
      formData: data
    });
  };
  getBookingList = () => {
    const { formData, pagination } = this.state;
    let params = Object.assign(formData, {
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize
    });
    this.setState({
      loading: true
    });
    webapi
      .getBookingList(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          pagination.total = res.context.total;
          this.setState({
            bookingList: res.context.bookingList,
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
    const { bookingList } = this.state;
    const columns = [
      {
        title: 'Pet',
        dataIndex: 'orderType',
        width: '10%'
      },
      {
        title: 'Booking Date',
        dataIndex: 'Pet',
        width: '25%'
      },
      {
        title: 'Prescriber Name',
        dataIndex: 'status',
        width: '25%'
      },
      {
        title: 'Booking Time',
        dataIndex: 'priority',
        width: '25%'
      },
      {
        title: '',
        key: 'operation',
        width: '15%',
        render: (text, record) => (
          <div>
            <Tooltip placement="top" title="Details">
              <Link to={'/test/' + record.id} className="iconfont iconDetails"></Link>
            </Tooltip>
          </div>
        )
      }
    ];
    return (
      <Card title="Prescriber Booking" className="topCard">
        <Row>
          <Col span={9}>
            <Input
              className="searchInput"
              placeholder="Search Keyword"
              onPressEnter={() => this.getBookingList()}
              onChange={(e) => {
                const value = (e.target as any).value;
                this.onFormChange({
                  field: 'name',
                  value
                });
              }}
              prefix={<Icon type="search" onClick={() => this.getBookingList()} />}
            />
          </Col>
          <Col span={15} className="activities-right" style={{ marginBottom: '20px' }}>
            <DatePicker
              style={{ width: '60%' }}
              format="DD/MM/YYYY"
              onChange={(date, dateString) => {
                this.onFormChange({
                  field: 'date',
                  value: dateString
                });
              }}
            />
          </Col>
          <Col span={24}>
            <Table
              rowKey="id"
              size="small"
              columns={columns}
              dataSource={bookingList}
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
