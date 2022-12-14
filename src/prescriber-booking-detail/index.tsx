import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper, history, RCi18n } from 'qmkit';
import { Link } from 'react-router-dom';
import { Table, Tooltip, Button, Form, Input, Row, Col, message, Select, Spin, Popconfirm, Switch, Breadcrumb, Card, Avatar, Pagination, Icon, DatePicker, Empty, Modal } from 'antd';

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
      title: <FormattedMessage id="Prescriber.BookingDetail" />,
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
      BookingList: [1, 2, 34, 5],
      isEdit: false,
      visible: false,
      bookForm: {
        checkUpDate: '',
        checkUpStartTime: '',
        checkUpEndTime: '',
        petOwner: '',
        pet: ''
      }
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

  handleCancel = () => {};
  handleSubmit = () => {};

  onBookFormChange = ({ field, value }) => {
    let data = this.state.bookForm;
    data[field] = value;
    this.setState({
      bookForm: data
    });
  };

  render() {
    const { loading, title, pagination, BookingList, isEdit, visible, bookForm } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
      }
    };
    const { getFieldDecorator } = this.props.form;

    return (
      <AuthWrapper functionName="f_booking_detail">
        {/* f_prescriber_booking_detail */}
        <div>
          <Spin spinning={loading}>
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
                        <Input style={styles.label} disabled title={RCi18n({id:'PetOwner.ConsumerName'})} defaultValue={RCi18n({id:'PetOwner.ConsumerName'})} />
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
                        <Input style={styles.label} disabled title={RCi18n({id:'Prescriber.PublishStatus'})} defaultValue={RCi18n({id:'Prescriber.PublishStatus'})} />
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
                          <Option value={null}>
                            <FormattedMessage id="Prescriber.All" />
                          </Option>
                          <Option value={1}>
                            <FormattedMessage id="Prescriber.valid" />
                          </Option>
                          <Option value={0}>
                            <FormattedMessage id="Prescriber.invalid" />
                          </Option>
                        </Select>
                      </InputGroup>
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem>
                      <InputGroup compact style={styles.formItemStyle}>
                        <Input style={styles.label} disabled title={RCi18n({id:'Prescriber.BookDate'})} defaultValue={RCi18n({id:'Prescriber.BookDate'})} />
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
                        <span>
                          <FormattedMessage id="Prescriber.Search" />
                        </span>
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
                              <p style={{ textAlign: 'center', marginTop: 5 }}>
                                <FormattedMessage id="Prescriber.test" />
                              </p>
                            </div>
                          }
                          title={
                            <div>
                              <p style={styles.cardLabelText}>
                                <span className="iconfont iconnaozhong"></span>
                                <span style={{ marginLeft: 5 }}>
                                  <FormattedMessage id="Prescriber.CheckDate" />
                                </span>
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
                                    <span style={{ marginLeft: 5 }}>
                                      <FormattedMessage id="Prescriber.PetOwner" />
                                    </span>
                                    <span style={{ color: '#000000', marginLeft: 10 }}>{'2021-11-11'}</span>
                                  </p>
                                </li>
                                <li>
                                  <p>
                                    <span style={{ marginLeft: 5 }}>
                                      <FormattedMessage id="Prescriber.PetName" />
                                    </span>
                                    <span style={{ color: '#000000', marginLeft: 10 }}>{'2021-11-11'}</span>
                                  </p>
                                </li>
                                <li>
                                  <p>
                                    <span style={{ marginLeft: 5 }}>
                                      <FormattedMessage id="Prescriber.BookingStatus" />
                                    </span>
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

                          <Popconfirm placement="topRight" title={<FormattedMessage id="Prescriber.deleteThisItem" />} onConfirm={() => this.deleteBook(item.id)} okText={<FormattedMessage id="Prescriber.Confirm" />} cancelText={<FormattedMessage id="Prescriber.Cancel" />}>
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
        <Modal
          width={600}
          maskClosable={false}
          title={isEdit ? <FormattedMessage id="Prescriber.EditTaxZone" /> : <FormattedMessage id="Prescriber.NewTaxZone" />}
          visible={visible}
          confirmLoading={loading}
          onCancel={() => this.handleCancel()}
          footer={[
            <Button
              key="back"
              onClick={() => {
                this.handleCancel();
              }}
            >
              <FormattedMessage id="Prescriber.Cancel" />
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleSubmit}>
              <FormattedMessage id="Prescriber.Submit" />
            </Button>
          ]}
        >
          <Form {...formItemLayout}>
            {/* <FormItem label="Check-up Date">
                {getFieldDecorator('checkUpDate', {
                  rules: [
                    { required: true, message: 'Check-up Date is required' },
                  ],
                  initialValue: bookForm.checkUpDate
                })(

                  <DatePicker style={{ width: '80%' }} onChange={} />
                  <Input
                    style={{ width: '80%' }}
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onBookFormChange({
                        field: 'taxZoneName',
                        value
                      });
                    }}
                  />
                )}
              </FormItem> */}
            <FormItem label={<FormattedMessage id="Prescriber.TaxZoneDescription" />}>
              {getFieldDecorator('taxZoneDescription', {
                rules: [
                  {
                    max: 500,
                    message: <FormattedMessage id="Prescriber.ExceedMaximumLength" />
                  }
                ],
                initialValue: bookForm.taxZoneDescription
              })(
                <Input
                  style={{ width: '80%' }}
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onBookFormChange({
                      field: 'taxZoneDescription',
                      value
                    });
                  }}
                />
              )}
            </FormItem>
          </Form>
        </Modal>

        <div className="bar-button">
          <Button
            type="primary"
            onClick={() => {
              // console.log('save');
            }}
          >
            <FormattedMessage id="Prescriber.NewBook" />
          </Button>
          <Button style={{ marginLeft: 20 }} onClick={() => (history as any).go(-1)}>
            {<FormattedMessage id="Prescriber.back" />}
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
