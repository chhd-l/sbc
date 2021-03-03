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
      orderCategories: [
        { label: 'Single purchase', value: 'SINGLE' },
        { label: '1st autoship order', value: 'FIRST_AUTOSHIP' },
        { label: 'Recurrent orders of autoship', value: 'RECURRENT_AUTOSHIP' }
      ],
      orderList: [
        {
          businessType: 'B2C',
          contactName: 'Morgane Lucas',
          contactUuid: '00uod83hrdUTgu6il0x6',
          creationDate: '2020-10-06 16:59:35',
          id: 1196,
          orderNo: '99933863',
          orderType: 'Single order',
          status: 'failed'
        },
        {
          businessType: 'B2C',
          contactName: 'Morgane Lucas',
          contactUuid: '00uod83hrdUTgu6il0x6',
          creationDate: '2020-10-06 17:03:30',
          id: 1197,
          orderNo: '99933864',
          orderType: 'Single order',
          status: 'failed'
        },
        {
          businessType: 'B2C',
          contactName: 'Morgane Lucas',
          contactUuid: '00uod83hrdUTgu6il0x6',
          creationDate: '2020-10-06 17:14:22',
          id: 1198,
          orderNo: '99933865',
          orderType: 'Single order',
          status: 'failed'
        },
        {
          businessType: 'B2C',
          contactName: 'Morgane Lucas',
          contactUuid: '00uod83hrdUTgu6il0x6',
          creationDate: '2020-10-06 17:16:25',
          id: 1199,
          orderNo: '99933866',
          orderType: 'Single order',
          status: 'failed'
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
      orderType: 'NORMAL_ORDER',
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
        title: 'Order Category',
        dataIndex: 'orderCategory',
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
              <p className="overFlowtext">{text}</p>
            </Tooltip>
          );
        }
      },
      {
        title: 'Order No',
        dataIndex: 'id',
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
              <p className="overFlowtext">{text}</p>
            </Tooltip>
          );
        }
      },
      {
        title: 'Order Time',
        dataIndex: 'creationDate',
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
        title: 'Order Status',
        dataIndex: 'status',
        width: '25%',
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
      <Card title="Order" className="rightCard">
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
          <Col span={14} className="activities-right" style={{ marginBottom: '20px' }}>
            <Select
              className="filter"
              placeholder="Email Type"
              allowClear={true}
              dropdownMatchSelectWidth={false}
              maxTagCount={0}
              style={{ width: '120px' }}
              mode="multiple"
              onChange={(value) =>
                this.onFormChange({
                  field: 'orderCategory',
                  value: value ? (value as []).join(',') : ''
                })
              }
            >
              {orderCategories.map((item) => (
                <Option value={item.value} key={item.label}>
                  {item.label}
                </Option>
              ))}
            </Select>
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
