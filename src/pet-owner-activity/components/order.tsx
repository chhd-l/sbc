import React, { Component } from 'react';
import { Card, Icon, Row, Col, message, Tooltip, Table, Input, Menu, Checkbox, Dropdown, Button } from 'antd';
import * as webapi from '../webapi';
import { history, Const } from 'qmkit';
import { Link } from 'react-router-dom';
const { Divider } = Menu;
const { Item } = Menu;
const CheckboxGroup = Checkbox.Group;

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
        pageSize: 20,
        total: 0
      },
      formData: {},
      loading: false,
      categoryVisible: false
    };
    this.handleTableChange = this.handleTableChange.bind(this);
    this.getOrderList = this.getOrderList.bind(this);
  }

  componentDidMount() {
    // this.getOrderList();
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
    this.setState({
      formData: data
    });
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
    const { orderList, orderCategories, categoryVisible } = this.state;
    const filterMenu = (
      <Menu>
        <Checkbox>Select All</Checkbox>
        <a className="closeFilter" onClick={() => this.setState({ categoryVisible: false })}>
          {' '}
          X
        </a>
        <Divider />
        <CheckboxGroup>
          {orderCategories.map((item, index) => (
            <Row gutter={24} key={index}>
              <Col span={24}>
                <Checkbox value={item.value}>{item.label}</Checkbox>
              </Col>
            </Row>
          ))}
        </CheckboxGroup>
      </Menu>
    );
    const columns = [
      {
        title: 'Order Type',
        dataIndex: 'businessType',
        width: '15%'
      },
      {
        title: 'Pet',
        dataIndex: 'pet',
        width: '10%',
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
        dataIndex: 'orderNo',
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
        width: '25%'
      },
      {
        title: '',
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
      <Card title="Subscription" className="rightCard">
        <Row>
          <Col span={9}>
            <Input
              className="searchInput"
              placeholder="Search Keyword"
              onPressEnter={() => this.getOrderList()}
              onChange={(e) => {
                const value = (e.target as any).value;
                this.onFormChange({
                  field: 'name',
                  value
                });
              }}
              prefix={<Icon type="search" onClick={() => this.getOrderList()} />}
            />
          </Col>
          <Col span={15} className="activities-right" style={{ marginBottom: '20px' }}>
            <div style={{ marginRight: '10px' }}>
              <Dropdown overlay={filterMenu} trigger={['click']} overlayClassName="dropdown-custom" visible={categoryVisible}>
                <Button className="ant-dropdown-link" onClick={(e) => this.setState({ categoryVisible: true })}>
                  Order Category
                  <Icon type="down" />
                </Button>
              </Dropdown>
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
