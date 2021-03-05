import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper, history } from 'qmkit';
import { Link } from 'react-router-dom';
import { Table, Tooltip, Button, Form, Input, Row, Col, message, Select, Spin, Popconfirm, Switch, Breadcrumb, Card, Avatar, Pagination, Icon } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';

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
  componentDidMount() {}
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
    console.log(searchForm, pagination);
  };
  handleTableChange = (pagination: any) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.getAutomationList()
    );
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
      { name: 'Not Tested', value: 'Not Tested' },
      { name: 'Testing', value: 'Testing' },
      { name: 'Tested', value: 'Tested' }
    ];
    const automationPeriodList = [
      { name: 'All', value: '' },
      { name: 'Within 1 year', value: 'Within 1 year' },
      { name: 'Within 3 months', value: 'Within 3 months' },
      { name: 'Within 6 months', value: 'Within 6 months' }
    ];

    const columns = [
      {
        title: 'Automation name',
        dataIndex: 'automationName',
        key: 'automationName',
        width: '15%'
      },
      {
        title: 'Automation category',
        dataIndex: 'automationCategory',
        key: 'automationCategory',
        width: '15%'
      },
      {
        title: 'Automation status',
        dataIndex: 'automationStatus',
        key: 'automationStatus',
        width: '10%'
      },
      {
        title: 'Test status',
        dataIndex: 'testStatus',
        key: 'testStatus',
        width: '10%'
      },

      {
        title: 'Start time',
        dataIndex: 'startTime',
        key: 'startTime',
        width: '10%'
      },
      {
        title: 'End time',
        dataIndex: 'endTime',
        key: 'endTime',
        width: '10%'
      },

      {
        title: 'Operation',
        key: 'operation',
        width: '8%',
        render: (text, record) => (
          <div>
            <Tooltip placement="top" title="Edit">
              <Link to={`/automation-edit/${record.id}`} className="iconfont iconDetails" style={{ marginRight: 10 }}></Link>
            </Tooltip>
            <Tooltip placement="top" title="Detail">
              <Link to={`/automation-detail/${record.id}`} className="iconfont iconDetails" style={{ marginRight: 10 }}></Link>
            </Tooltip>
          </div>
        )
      }
    ];

    return (
      <AuthWrapper functionName="f_automation_list">
        <div>
          <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
            <BreadCrumb />
            <div className="container-search">
              <div className="container-search">
                <Headline title={title} />
                <Form className="filter-content" layout="inline">
                  <Row>
                    <Col span={8}>
                      <FormItem>
                        <InputGroup compact style={styles.formItemStyle}>
                          <Input style={styles.label} disabled defaultValue="Automation name" />
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
                          <Input style={styles.label} disabled defaultValue="Automation category" />
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
                          <Input style={styles.label} disabled defaultValue="Automation status" />
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

                    <Col span={8}>
                      <FormItem>
                        <InputGroup compact style={styles.formItemStyle}>
                          <Input style={styles.label} disabled defaultValue="Test status" />
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
                          <Input style={styles.label} disabled defaultValue="Automation period" />
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
                <Link to={'/automation-add'}>Add</Link>
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
    width: 355
  },
  label: {
    width: 155,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.65)',
    backgroundColor: '#fff',
    cursor: 'text'
  },
  wrapper: {
    width: 180
  }
} as any;

export default Form.create()(AutomationList);
