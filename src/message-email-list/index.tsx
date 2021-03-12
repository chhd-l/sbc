import React, { Component } from 'react';
import { BreadCrumb, Headline, SelectGroup, history, Const } from 'qmkit';
import { Form, Spin, Row, Col, Select, Input, Button, message, Tooltip, Divider, Table, Popconfirm } from 'antd';
import { FormattedMessage } from 'react-intl';
import * as webapi from './webapi';
import { Link } from 'react-router-dom';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

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
        status: '',
        templateId: '',
        recipient: ''
      },
      // objectTypeList: [],
      // categoryList: [],
      // statusList: [],
      taskList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      emailTemplateList: []
    };
  }
  componentDidMount() {
    // this.querySysDictionary('objectType');
    // this.querySysDictionary('messageCategory');
    // this.querySysDictionary('messageStatus');
    this.getTemplateList();
    this.getEmailTaskList();
  }

  onFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };
  onSearch = () => {
    const { pagination } = this.state;
    this.setState(
      {
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        }
      },
      () => this.getEmailTaskList()
    );
  };
  getEmailTaskList = () => {
    const { searchForm, pagination } = this.state;
    let params = {
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize,
      taskId: searchForm.taskId,
      objectType: searchForm.objectType,
      objectNo: searchForm.objectNo,
      templateId: searchForm.templateId,
      category: searchForm.category,
      status: searchForm.status,
      toEmail: searchForm.recipient
    };
    this.setState({
      loading: true
    });
    webapi
      .getEmailTaskList(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          pagination.total = res.context.total;
          this.setState({
            taskList: res.context.content,
            pagination: pagination,
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
      });
  };
  // querySysDictionary = (type: String) => {
  //   webapi
  //     .querySysDictionary({ type: type })
  //     .then((data) => {
  //       const { res } = data;
  //       if (res.code === Const.SUCCESS_CODE) {
  //         if (type === 'objectType') {
  //           let objectTypeList = [...res.context.sysDictionaryVOS];
  //           this.setState({
  //             objectTypeList
  //           });
  //         }
  //         if (type === 'messageCategory') {
  //           let categoryList = [...res.context.sysDictionaryVOS];
  //           this.setState({
  //             categoryList
  //           });
  //         }
  //         if (type === 'messageStatus') {
  //           let statusList = [...res.context.sysDictionaryVOS];
  //           this.setState({
  //             statusList
  //           });
  //         }
  //       }
  //     })
  //     .catch((err) => { });
  // };
  handleTableChange = (pagination: any) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.getEmailTaskList()
    );
  };
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
  getTemplateList = () => {
    webapi.getTemplateList().then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        this.setState({
          emailTemplateList: res.context.emailTemplateResponseList
        });
      }
    });
  };
  deleteTask = (id: string) => {
    this.setState({
      loading: true
    });
    webapi
      .deleteEmailTask(id)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success('Operate successfully');
          this.getEmailTaskList();
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
      });
  };

  render() {
    const { title, searchForm, taskList, emailTemplateList } = this.state;

    const objectTypeList = [
      {
        value: 'Order',
        name: 'Order'
      },
      {
        value: 'Subscription',
        name: 'Subscription'
      },
      {
        value: 'Recommendation',
        name: 'Recommendation'
      },
      {
        value: 'Prescriber creation',
        name: 'Prescriber creation'
      },
      {
        value: 'Automation',
        name: 'Automation'
      }
    ];
    const categoryList = [
      {
        value: 'Notification',
        name: 'Notification'
      }
    ];
    const statusList = [
      {
        value: '0',
        name: 'Draft'
      },
      {
        value: '1',
        name: 'To do'
      },
      {
        value: '2',
        name: 'Finish'
      }
    ];

    const columns = [
      {
        title: 'Email Task ID',
        dataIndex: 'taskId',
        key: 'taskId',
        width: '10%'
      },
      {
        title: 'Object Type',
        dataIndex: 'objectType',
        key: 'objectType',
        width: '10%',
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
        title: 'Recipient',
        dataIndex: 'recipient',
        key: 'recipient',
        width: '10%',
        render: (text, record) => <span>{record.detailsResponse.email}</span>
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '5%',
        render: (text) => <span>{+text === 0 ? 'Draft' : +text === 1 ? 'To do' : +text === 2 ? 'Finish' : ''}</span>
      },
      {
        title: 'Operation',
        key: 'operation',
        width: '8%',
        render: (text, record) => (
          <div>
            {+record.status === 0 ? (
              <div>
                <Tooltip placement="top" title="Edit">
                  <Link to={'/message-edit/' + record.id} className="iconfont iconEdit"></Link>
                </Tooltip>

                <Divider type="vertical" />

                <Popconfirm placement="topLeft" title="Are you sure to delete this item?" onConfirm={() => this.deleteTask(record.id)} okText="Confirm" cancelText="Cancel">
                  <Tooltip placement="top" title="Delete">
                    <a type="link" className="iconfont iconDelete"></a>
                  </Tooltip>
                </Popconfirm>
              </div>
            ) : null}
            {+record.status === 1 ? (
              <div>
                <Tooltip placement="top" title="Details">
                  <Link to={'/message-detail/' + record.id} className="iconfont iconDetails"></Link>
                </Tooltip>

                <Divider type="vertical" />

                <Popconfirm placement="topLeft" title="Are you sure to delete this item?" onConfirm={() => this.deleteTask(record.id)} okText="Confirm" cancelText="Cancel">
                  <Tooltip placement="top" title="Delete">
                    <a type="link" className="iconfont iconDelete"></a>
                  </Tooltip>
                </Popconfirm>
              </div>
            ) : null}
            {+record.status === 2 ? (
              <div>
                <Tooltip placement="top" title="Details">
                  <Link to={'/message-detail/' + record.id} className="iconfont iconDetails"></Link>
                </Tooltip>
              </div>
            ) : null}
          </div>
        )
      }
    ];
    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search">
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
                  <InputGroup compact style={styles.formItemStyle}>
                    <Input style={styles.label} disabled defaultValue="Email Task ID" />
                    <Input
                      style={styles.wrapper}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'taskId',
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
                    <Input style={styles.label} disabled defaultValue="Object Type" />
                    <Select
                      style={styles.wrapper}
                      getPopupContainer={(trigger: any) => trigger.parentNode}
                      defaultValue=""
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
                    <Input style={styles.label} disabled defaultValue="Object No" />
                    <Input
                      style={styles.wrapper}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'objectNo',
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
                    <Input style={styles.label} disabled defaultValue="Email Template" />
                    <Select
                      style={styles.wrapper}
                      getPopupContainer={(trigger: any) => trigger.parentNode}
                      onChange={(value) => {
                        value = value === '' ? null : value;
                        this.onFormChange({
                          field: 'templateId',
                          value
                        });
                      }}
                    >
                      <Option value="">
                        <FormattedMessage id="all" />
                      </Option>
                      {emailTemplateList &&
                        emailTemplateList.map((item, index) => (
                          <Option value={item.templateId} key={index}>
                            {item.emailTemplate}
                          </Option>
                        ))}
                    </Select>
                  </InputGroup>
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem>
                  <InputGroup compact style={styles.formItemStyle}>
                    <Input style={styles.label} disabled defaultValue="Category" />
                    <Select
                      style={styles.wrapper}
                      getPopupContainer={(trigger: any) => trigger.parentNode}
                      defaultValue=""
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
                    <Input style={styles.label} disabled defaultValue="Status" />
                    <Select
                      style={styles.wrapper}
                      getPopupContainer={(trigger: any) => trigger.parentNode}
                      defaultValue=""
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
                    <Input style={styles.label} disabled defaultValue="Recipient" />
                    <Input
                      style={styles.wrapper}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'recipient',
                          value
                        });
                      }}
                    />
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
        <div className="container">
          <Table
            rowKey="id"
            columns={columns}
            dataSource={taskList}
            pagination={this.state.pagination}
            loading={{ spinning: this.state.loading, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" /> }}
            scroll={{ x: '100%' }}
            onChange={this.handleTableChange}
          />
        </div>
      </div>
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
    color: 'rgba(0, 0, 0, 0.65)',
    backgroundColor: '#fff',
    cursor: 'text'
  },
  wrapper: {
    width: 200
  }
} as any;
