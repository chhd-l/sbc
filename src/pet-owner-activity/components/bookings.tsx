import React, { Component } from 'react';
import { Card, Icon, Row, Col, message, Tooltip, Table, Input, DatePicker } from 'antd';
import * as webapi from '../webapi';
import { history, Const } from 'qmkit';
import { Link } from 'react-router-dom';

export default class bookings extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      bookingList: [
        {
          bookingDate: '2021-01-29',
          bookingTime: '9:31 AM-10:31 AM',
          clinicsName: 'Вега',
          id: 4,
          pet: 'Doudou',
          petId: '44750',
          relationId: 6
        },
        {
          bookingDate: '2021-01-27',
          bookingTime: '2:19 PM-8:19 PM',
          clinicsName: 'Вега',
          id: 3,
          pet: 'Doudou',
          petId: '44750',
          relationId: 6
        },
        {
          bookingDate: '2021-01-19',
          bookingTime: '12:19 PM-7:19 PM',
          clinicsName: 'Вега',
          id: 2,
          pet: 'Doudou',
          petId: '44750',
          relationId: 6
        }
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
    // this.getBookingList();
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
        dataIndex: 'pet',
        width: '15%',
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
        title: 'Booking Date',
        dataIndex: 'bookingDate',
        width: '25%'
      },
      {
        title: 'Prescriber Name',
        dataIndex: 'clinicsName',
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
              <p className="overFlowtext">{text}</p>
            </Tooltip>
          );
        }
      },
      {
        title: 'Booking Time',
        dataIndex: 'bookingTime',
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
              <p className="overFlowtext">{text}</p>
            </Tooltip>
          );
        }
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
