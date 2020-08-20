import React, { Component } from 'react';
import { BreadCrumb, Headline, SelectGroup, history } from 'qmkit';
import {
  Form,
  Spin,
  Row,
  Col,
  Select,
  Input,
  Button,
  message,
  Tooltip,
  Divider,
  Table
} from 'antd';
import { FormattedMessage } from 'react-intl';
import * as webapi from './webapi';
import { Link } from 'react-router-dom';

const FormItem = Form.Item;
const Option = Select.Option;

export default class ClinicList extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Email Task List',
      loading: false,
      searchForm: {
        taskId: '',
        objectType: '',
        objectNo: '',
        emailTemplate: '',
        category: '',
        status: ''
      },
      objectTypeList: [],
      categoryList: [],
      statusList: [],
      taskList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    };
  }
  componentDidMount() {
    this.querySysDictionary('objectType');
    this.querySysDictionary('messageCategory');
    this.querySysDictionary('messageStatus');
  }

  onFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };
  onSearch = () => {
    message.success('coding');
  };
  querySysDictionary = (type: String) => {
    webapi
      .querySysDictionary({ type: type })
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          if (type === 'objectType') {
            let objectTypeList = [...res.context.sysDictionaryVOS];
            this.setState({
              objectTypeList
            });
          }
          if (type === 'messageCategory') {
            let categoryList = [...res.context.sysDictionaryVOS];
            this.setState({
              categoryList
            });
          }
          if (type === 'messageStatus') {
            let statusList = [...res.context.sysDictionaryVOS];
            this.setState({
              statusList
            });
          }
        } else {
          message.error(res.message || 'Unsuccessful');
        }
      })
      .catch((err) => {
        message.error(err.message || 'Unsuccessful');
      });
  };
  handleTableChange(pagination: any) {
    this.setState({
      pagination: pagination
    });
  }
  overview = () => {
    history.push({
      pathname: '/message-overview'
    });
  };
  quickSend = () => {
    history.push({
      pathname: '/message-quick-send'
    });
  };

  render() {
    const {
      title,
      searchForm,
      objectTypeList,
      categoryList,
      statusList,
      taskList
    } = this.state;

    const columns = [
      {
        title: 'Task ID',
        dataIndex: 'taskId',
        key: 'taskId',
        width: '10%'
      },
      {
        title: 'Object Type',
        dataIndex: 'objectType',
        key: 'objectType',
        width: '15%',
        ellipsis: true
      },
      {
        title: 'Object No',
        dataIndex: 'objectNo',
        key: 'objectNo',
        width: '10%'
      },
      {
        title: 'Email Template',
        dataIndex: 'emailTemplate',
        key: 'emailTemplate',
        width: '10%'
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        width: '10%'
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '10%'
      },

      {
        title: 'Operation',
        key: 'operation',
        width: '10%',
        render: (text, record) => (
          <span>
            <Tooltip placement="top" title="Details">
              <Link
                to={'/message-detail/' + record.id}
                className="iconfont iconDetails"
              ></Link>
            </Tooltip>
          </span>
        )
      }
    ];
    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search">
          <Spin spinning={this.state.loading}>
            <Headline
              title={title}
              extra={
                <div>
                  <Button
                    shape="round"
                    onClick={() => {
                      this.overview();
                    }}
                    style={{
                      marginRight: 20,
                      borderColor: '#e2001a'
                    }}
                  >
                    <p style={{ color: '#e2001a' }}>Overview</p>
                  </Button>
                  <Button
                    shape="round"
                    onClick={() => {
                      this.quickSend();
                    }}
                    style={{
                      borderColor: '#e2001a'
                    }}
                  >
                    <p style={{ color: '#e2001a' }}>Quick Send</p>
                  </Button>
                </div>
              }
            />
            <Form className="filter-content" layout="inline">
              <Row>
                <Col span={8}>
                  <FormItem>
                    <Input
                      addonBefore={<p style={styles.label}>Task ID</p>}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'taskId',
                          value
                        });
                      }}
                    />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    <SelectGroup
                      defaultValue=""
                      label={<p style={styles.label}>Object Type</p>}
                      style={{ width: 180 }}
                      onChange={(value) => {
                        value = value === '' ? null : value;
                        this.onFormChange({
                          field: 'objectType',
                          value
                        });
                      }}
                    >
                      <Option value="">
                        <FormattedMessage id="all" />
                      </Option>
                      {objectTypeList &&
                        objectTypeList.map((item, index) => (
                          <Option value={item.name} key={index}>
                            {item.name}
                          </Option>
                        ))}
                    </SelectGroup>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    <Input
                      addonBefore={<p style={styles.label}>Object No</p>}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'objectNo',
                          value
                        });
                      }}
                    />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    <Input
                      addonBefore={<p style={styles.label}>Email Template</p>}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'emailTemplate',
                          value
                        });
                      }}
                    />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    <SelectGroup
                      defaultValue=""
                      label={<p style={styles.label}>Category</p>}
                      style={{ width: 180 }}
                      onChange={(value) => {
                        value = value === '' ? null : value;
                        this.onFormChange({
                          field: 'category',
                          value
                        });
                      }}
                    >
                      <Option value="">
                        <FormattedMessage id="all" />
                      </Option>
                      {categoryList &&
                        categoryList.map((item, index) => (
                          <Option value={item.name} key={index}>
                            {item.name}
                          </Option>
                        ))}
                    </SelectGroup>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    <SelectGroup
                      defaultValue=""
                      label={<p style={styles.label}>Status</p>}
                      style={{ width: 180 }}
                      onChange={(value) => {
                        value = value === '' ? null : value;
                        this.onFormChange({
                          field: 'status',
                          value
                        });
                      }}
                    >
                      <Option value="">
                        <FormattedMessage id="all" />
                      </Option>
                      {statusList &&
                        statusList.map((item, index) => (
                          <Option value={item.name} key={index}>
                            {item.name}
                          </Option>
                        ))}
                    </SelectGroup>
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
          </Spin>
        </div>
        <div className="container">
          <Table
            rowKey="id"
            columns={columns}
            dataSource={taskList}
            pagination={this.state.pagination}
            loading={this.state.loading}
            scroll={{ x: '100%' }}
            onChange={this.handleTableChange}
          />
        </div>
      </div>
    );
  }
}
const styles = {
  label: {
    width: 120,
    textAlign: 'center'
  },
  wrapper: {
    width: 157
  }
} as any;
