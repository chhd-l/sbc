import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper, history } from 'qmkit';
import { Link } from 'react-router-dom';
import { Table, Tooltip, Button, Form, Input, Row, Col, message, Select, Spin, Popconfirm, Switch, Breadcrumb, Card, Avatar, Pagination, Icon, DatePicker, Empty } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
const { RangePicker } = DatePicker;
const { Meta } = Card;

class BookingDetail extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Booking Detail',
      loading: false,
      searchForm: {
        startDate: '',
        endDate: '',
        petOwnerName: '',
        status: null
      },
      pagination: {
        current: 1,
        pageSize: 9,
        total: 1
      },
      BookingList: [1, 2, 34, 5]
    };
  }
  componentDidMount() {}
  init = () => {};
  onSearchFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };

  onSearch = () => {};
  onChangeDate = (date, dateString) => {
    const { searchForm } = this.state;
    searchForm.startDate = dateString[0] ? moment(dateString[0]).format('YYYY-MM-DD') : '';
    searchForm.endDate = dateString[1] ? moment(dateString[1]).format('YYYY-MM-DD') : '';
    this.setState({
      searchForm
    });
  };
  deleteBook = (id) => {};
  onPageChange = (page, pageSize) => {};

  render() {
    const { loading, title, pagination, BookingList } = this.state;

    return (
      <AuthWrapper functionName="f_booking_detail">
        {/* f_prescriber_booking_detail */}
        <div>
          <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
            <BreadCrumb thirdLevel={true}>
              <Breadcrumb.Item>{title}</Breadcrumb.Item>
            </BreadCrumb>
            <div className="container">
              <Headline>{title}</Headline>
              <Form layout="inline" style={{ marginBottom: 20 }}>
                <Row>
                  <Col span={8}>
                    <FormItem>
                      <InputGroup compact style={styles.formItemStyle}>
                        <Input style={styles.label} disabled defaultValue="Pet owner name" />
                        <Input
                          style={styles.wrapper}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.onSearchFormChange({
                              field: 'petOwnerName',
                              value
                            });
                          }}
                        />
                      </InputGroup>
                    </FormItem>
                  </Col>

                  <Col span={8}>
                    <FormItem>
                      <InputGroup compact style={styles.formItemStyle}>
                        <Input style={styles.label} disabled defaultValue="Publish status" />
                        <Select
                          style={styles.wrapper}
                          onChange={(value) => {
                            value = value === '' ? null : value;
                            this.onSearchFormChange({
                              field: 'publishedStatus',
                              value
                            });
                          }}
                        >
                          <Option value={null}>All</Option>
                          <Option value={1}>valid</Option>
                          <Option value={0}>invalid</Option>
                        </Select>
                      </InputGroup>
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem>
                      <InputGroup compact style={styles.formItemStyle}>
                        <Input style={styles.label} disabled defaultValue="Book date" />
                        <RangePicker style={styles.wrapper} onChange={this.onChangeDate} format={'YYYY-MM-DD'} />
                      </InputGroup>
                    </FormItem>
                  </Col>
                  <Col span={24} style={{ textAlign: 'center', marginTop: 10 }}>
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
                        <span>Search</span>
                      </Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>

              <Row>
                {BookingList && BookingList.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : null}
                {BookingList &&
                  BookingList.map((item, index) => (
                    <Col span={8}>
                      <Card style={{ width: 330, marginTop: 16 }} key={index}>
                        <Meta
                          avatar={
                            <div style={{ marginTop: 20 }}>
                              <Avatar size={64} icon="user" />
                              <p style={{ textAlign: 'center', marginTop: 5 }}>test</p>
                            </div>
                          }
                          title={
                            <div>
                              <p style={styles.cardLabelText}>
                                <span className="iconfont iconnaozhong"></span>
                                <span style={{ marginLeft: 5 }}>Check-up Date</span>
                                <span style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>{'2021-11-11'}</span>
                              </p>
                              <p style={{ textAlign: 'center' }}>
                                <span style={{ fontWeight: 'bold', color: '#000000' }}>{'08:15'}</span>
                                <span style={{ margin: '0 10px' }}>--</span>
                                <span style={{ fontWeight: 'bold', color: '#000000' }}>{'10:12'}</span>
                              </p>
                            </div>
                          }
                          description={
                            <div>
                              <ul>
                                <li>
                                  <p>
                                    <span style={{ marginLeft: 5 }}>Pet owner</span>
                                    <span style={{ color: '#000000', marginLeft: 10 }}>{'2021-11-11'}</span>
                                  </p>
                                </li>
                                <li>
                                  <p>
                                    <span style={{ marginLeft: 5 }}>Pet Name</span>
                                    <span style={{ color: '#000000', marginLeft: 10 }}>{'2021-11-11'}</span>
                                  </p>
                                </li>
                                <li>
                                  <p>
                                    <span style={{ marginLeft: 5 }}>Booking status</span>
                                    <span style={{ color: '#000000', marginLeft: 10 }}>{'2021-11-11'}</span>
                                  </p>
                                </li>
                              </ul>
                            </div>
                          }
                        />
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            right: 10
                          }}
                        >
                          <Link to={'/pet-owner-detail/' + item.id} style={styles.linkStyle}>
                            <span style={styles.deleteStyle} className="iconfont iconEdit"></span>
                          </Link>

                          <Popconfirm placement="topRight" title={'Are you sure to delete this item?'} onConfirm={() => this.deleteBook(item.id)} okText="Confirm" cancelText="Cancel">
                            <span style={styles.deleteStyle} className="iconfont iconDelete"></span>
                          </Popconfirm>
                        </div>
                      </Card>
                    </Col>
                  ))}
              </Row>
              {pagination.total ? <Pagination style={{ marginBottom: 20 }} current={pagination.current} pageSize={pagination.pageSize} total={pagination.total} onChange={this.onPageChange} /> : null}
            </div>
          </Spin>
        </div>
        <div className="bar-button">
          <Button
            type="primary"
            onClick={() => {
              console.log('save');
            }}
          >
            New book
          </Button>
          <Button style={{ marginLeft: 20 }} onClick={() => (history as any).go(-1)}>
            {<FormattedMessage id="back" />}
          </Button>
        </div>
      </AuthWrapper>
    );
  }
}

const styles = {
  formItemStyle: {
    width: 335
  },
  label: {
    width: 135,
    textAlign: 'center',
    color: '#000000',
    backgroundColor: '#fff',
    cursor: 'text'
  },
  wrapper: {
    width: 200
  },
  linkStyle: {
    marginRight: 10
  },
  cardLabelText: {
    fontSize: 14,
    color: '#8D85A8'
  }
} as any;

export default Form.create()(BookingDetail);
