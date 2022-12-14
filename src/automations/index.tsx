import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper, history, RCi18n } from 'qmkit';
import { Link } from 'react-router-dom';
import { Table, Tooltip, Button, Form, Input, Row, Col, message, Select, Spin, Popconfirm, Switch, Breadcrumb, Card, Avatar, Pagination, Icon } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

class AutomationList extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Automations',
      loading: false,
      searchForm: {
        automationName: '',
        automationCategory: '',
        automationStatus: '',
        testStatus: '',
        automationPeriod: ''
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      automationList: []
    };
  }
  componentDidMount() {
    this.init();
  }
  init = () => {
    this.getAutomationList();
  };

  onFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };
  onSearch = () => {
    this.setState(
      {
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        }
      },
      () => {
        this.getAutomationList();
      }
    );
  };
  getAutomationList = () => {
    const { searchForm, pagination } = this.state;
    let params = {
      name: searchForm.automationName || null,
      category: searchForm.automationCategory || null,
      status: searchForm.automationStatus || null,
      testStatus: searchForm.testStatus || null,
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize,
      period: searchForm.automationPeriod || searchForm.automationPeriod === 0 ? searchForm.automationPeriod : null
    };
    this.setState({ loading: true });
    webapi
      .getAutomationList(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let automationList = res.context.campaignList;
          pagination.total = res.context.total;
          this.setState({
            automationList,
            loading: false
          });
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.toString() || RCi18n({id:'Marketing.OperationFailure'}));
      });
  };
  handleTableChange = (pagination: any) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.getAutomationList()
    );
  };
  deleteAutomation = (id) => {
    this.setState({
      loading: true
    });
    webapi
      .deleteAutomation({ idList: [id] })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(res.message || RCi18n({id:'Marketing.OperationSuccessful'}));
          this.getAutomationList();
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.toString() || RCi18n({id:'Marketing.OperationFailure'}));
      });
  };

  render() {
    const { loading, title, pagination, automationList } = this.state;

    const automationCategoryList = [
      { name: 'All', value: '' },
      { name: 'Club Member Care', value: 'Club Member Care' },
      { name: 'Commercial Activity', value: 'Commercial Activity' },
      { name: 'Repeat Purchase', value: 'Repeat Purchase' }
    ];
    const automationStatusList = [
      { name: 'All', value: '' },
      { name: 'Completed', value: 'Completed' },
      { name: 'Draft', value: 'Draft' },
      { name: 'Executing', value: 'Executing' },
      { name: 'Published', value: 'Published' },
      { name: 'Terminated', value: 'Terminated' }
    ];
    const testStatusList = [
      { name: 'All', value: '' },
      { name: 'Not Tested', value: 'NotTested' },
      { name: 'Testing', value: 'Testing' },
      { name: 'Tested', value: 'Tested' }
    ];
    const automationPeriodList = [
      { name: 'All', value: '' },

      { name: 'Within 3 months', value: 0 },
      { name: 'Within 6 months', value: 1 },
      { name: 'Within 1 year', value: 2 }
    ];

    const columns = [
      {
        title: <FormattedMessage id="Marketing.AutomationName" />,
        dataIndex: 'name',
        key: 'name',
        width: '15%'
      },
      {
        title: <FormattedMessage id="Marketing.AutomationCategory" />,
        dataIndex: 'category',
        key: 'category',
        width: '15%'
      },
      {
        title: <FormattedMessage id="Marketing.AutomationStatus" />,
        dataIndex: 'status',
        key: 'status',
        width: '10%'
      },
      {
        title: <FormattedMessage id="Marketing.TestStatus" />,
        dataIndex: 'testStatus',
        key: 'testStatus',
        width: '10%',
        render: (text, record) => <p>{testStatusList.find((item) => item.value === text).name}</p>
      },

      {
        title: <FormattedMessage id="Marketing.StartTime" />,
        dataIndex: 'trackingStartTime',
        key: 'trackingStartTime',
        width: '10%',
        render: (text) => <p>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'}</p>
      },
      {
        title: <FormattedMessage id="Marketing.EndTime" />,
        dataIndex: 'trackingEndTime',
        key: 'trackingEndTime',
        width: '10%',
        render: (text) => <p>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'}</p>
      },

      {
        title: <FormattedMessage id="Marketing.Operation" />,
        key: 'operation',
        width: '8%',
        render: (text, record) => (
          <div>
            {record.status === 'Published' || record.status ==='Executing' ? null : (
              <Tooltip placement="top" title={RCi18n({id:'edit'})}>
                <Link to={`/automation-edit/${record.id}`} className="iconfont iconEdit" style={{ margin: "0 5px" }}></Link>
              </Tooltip>
            )}

            <Tooltip placement="top" title={<FormattedMessage id="Marketing.Details" />}>
              <Link to={`/automation-detail/${record.id}`} className="iconfont iconDetails" style={{ margin: "0 5px" }}></Link>
            </Tooltip>
            {record.status === 'Published' || record.status ==='Executing' ? null :(
            <Popconfirm placement="topLeft" title="Are you sure to do this?" onConfirm={() => this.deleteAutomation(record.id)} okText="Confirm" cancelText="Cancel">
              <Tooltip placement="top" title={RCi18n({id:'delete'})}>
                <a className="iconfont iconDelete" style={{ margin: "0 5px" }}></a>
              </Tooltip>
            </Popconfirm>
            )}
          </div>
        )
      }
    ];

    return (
      <AuthWrapper functionName="f_automation_list">
        <div>
          <Spin spinning={loading}>
            <BreadCrumb />
            <div className="container-search">
              <div className="container-search">
                <Headline title={title} />
                <Form className="filter-content" layout="inline" style={{padding:'0px'}}>
                  <Row>
                    <Col span={8}>
                      <FormItem>
                        <InputGroup compact style={styles.formItemStyle}>
                          <Input style={styles.label} disabled title={RCi18n({id:'Marketing.AutomationName'})} defaultValue={RCi18n({id:'Marketing.AutomationName'})} />
                          <Input
                            style={styles.wrapper}
                            onChange={(e) => {
                              const value = (e.target as any).value;
                              this.onFormChange({
                                field: 'automationName',
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
                          <Input style={styles.label} disabled title={RCi18n({id:'Marketing.AutomationCategory'})} defaultValue={RCi18n({id:'Marketing.AutomationCategory'})} />
                          <Select
                            style={styles.wrapper}
                            onChange={(value) => {
                              value = value === '' ? null : value;
                              this.onFormChange({
                                field: 'automationCategory',
                                value
                              });
                            }}
                          >
                            {automationCategoryList &&
                              automationCategoryList.map((item, index) => (
                                <Option value={item.value} key={index}>
                                  {item.name}
                                </Option>
                              ))}
                          </Select>
                        </InputGroup>
                      </FormItem>
                    </Col>

                    <Col span={8}>
                      <FormItem>
                        <InputGroup compact style={styles.formItemStyle}>
                          <Input style={styles.label} disabled title={RCi18n({id:'Marketing.AutomationStatus'})} defaultValue={RCi18n({id:'Marketing.AutomationStatus'})} />
                          <Select
                            style={styles.wrapper}
                            onChange={(value) => {
                              value = value === '' ? null : value;
                              this.onFormChange({
                                field: 'automationStatus',
                                value
                              });
                            }}
                          >
                            {automationStatusList &&
                              automationStatusList.map((item, index) => (
                                <Option value={item.value} key={index}>
                                  {item.name}
                                </Option>
                              ))}
                          </Select>
                        </InputGroup>
                      </FormItem>
                    </Col>

                    <Col span={8} >
                      <FormItem>
                        <InputGroup compact style={styles.formItemStyle}>
                          <Input style={styles.label} disabled title={RCi18n({id:'Marketing.TestStatus'})} defaultValue={RCi18n({id:'Marketing.TestStatus'})} />
                          <Select
                            defaultValue=""
                            style={styles.wrapper}
                            onChange={(value) => {
                              value = value === '' ? null : value;
                              this.onFormChange({
                                field: 'testStatus',
                                value
                              });
                            }}
                          >
                            {testStatusList &&
                              testStatusList.map((item, index) => (
                                <Option value={item.value} key={index}>
                                  {item.name}
                                </Option>
                              ))}
                          </Select>
                        </InputGroup>
                      </FormItem>
                    </Col>

                    <Col span={8}>
                      <FormItem>
                        <InputGroup compact style={styles.formItemStyle}>
                          <Input style={styles.label} disabled title={RCi18n({id:'Marketing.AutomationPeriod'})} defaultValue={RCi18n({id:'Marketing.AutomationPeriod'})} />
                          <Select
                            defaultValue=""
                            style={styles.wrapper}
                            onChange={(value) => {
                              value = value === '' ? null : value;
                              this.onFormChange({
                                field: 'automationPeriod',
                                value
                              });
                            }}
                          >
                            {automationPeriodList &&
                              automationPeriodList.map((item, index) => (
                                <Option value={item.value} key={index}>
                                  {item.name}
                                </Option>
                              ))}
                          </Select>
                        </InputGroup>
                      </FormItem>
                    </Col>
                    <Col span={24} style={{ textAlign: 'center' }}>
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
                            <FormattedMessage id="search" />
                          </span>
                        </Button>
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
            <div className="container">
              <Button type="primary" style={{ margin: '10px 10px 10px 0' }}>
                <Link to={'/automation-add'}><FormattedMessage id="add" /></Link>
              </Button>

              <Table rowKey="id" columns={columns} dataSource={automationList} pagination={pagination} scroll={{ x: '100%' }} onChange={this.handleTableChange} />
            </div>
          </Spin>
        </div>
      </AuthWrapper>
    );
  }
}

const styles = {
  formItemStyle: {
    width:310
  },
  label: {
    width: '52%',
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.65)',
    backgroundColor: '#fff',
    cursor: 'text'
  },
  wrapper: {
    width: "42%" 
  }
  
} as any;

export default Form.create()(AutomationList);
