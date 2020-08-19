import React, { Component } from 'react';
import { BreadCrumb, Headline } from 'qmkit';
import {
  Icon,
  Table,
  Tooltip,
  Divider,
  Switch,
  Modal,
  Button,
  Form,
  Input,
  Row,
  Col,
  Breadcrumb,
  Tag,
  message,
  Select
} from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;
class MessageDetails extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title:
        this.props.location.pathname === '/message-quick-send'
          ? 'Quick Send'
          : 'Message Details',
      emailStatus: 'Draft',
      objectTypeList: [],
      categoryList: [],
      basicForm: {
        taskId: '',
        emailCategory: '',
        emailTemplate: '',
        objectType: '',
        objectNo: ''
      },
      detailForm: {
        consumerAccount: '',
        consumerName: '',
        consumerType: '',
        email: ''
      },
      detailsList: []
    };
  }
  componentDidMount() {
    this.querySysDictionary('objectType');
    this.querySysDictionary('messageCategory');
  }

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

  onBasicFormFormChange = ({ field, value }) => {
    let data = this.state.basicForm;
    data[field] = value;
    this.setState({
      basicForm: data
    });
  };
  onDetailsFormChange = ({ field, value }) => {
    let data = this.state.detailForm;
    data[field] = value;
    this.setState({
      basicForm: data
    });
  };

  render() {
    const {
      title,
      emailStatus,
      objectTypeList,
      categoryList,
      detailsList
    } = this.state;
    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: 'Consumer Account',
        dataIndex: 'consumerAccount',
        key: 'consumerAccount',
        width: '15%'
      },
      {
        title: 'Consumer Name',
        dataIndex: 'consumerName',
        key: 'consumerName',
        width: '15%'
      },
      {
        title: 'Consumer Type',
        dataIndex: 'consumerType',
        key: 'consumerType',
        width: '15%'
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: '15%'
      },
      {
        title: 'Sent Time',
        dataIndex: 'sentTime',
        key: 'sentTime',
        width: '15%'
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '10%'
      },
      {
        title: 'Requests Time',
        dataIndex: 'requestsTime',
        key: 'requestsTime',
        width: '15%'
      }
    ];

    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>Message Details</Breadcrumb.Item>
        </BreadCrumb>
        {/*导航面包屑*/}
        <div className="container-search">
          <Headline title={title} />
          <div>
            <div style={styles.title}>
              <span style={styles.titleText}>Basic Information</span>
              <Tag>{emailStatus}</Tag>
            </div>
            <Form
              layout="horizontal"
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
              labelAlign="right"
            >
              <Row style={{ marginTop: 20 }}>
                <Col span={8}>
                  <FormItem label="Task ID">
                    {getFieldDecorator('taskId', {})(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="Email Category">
                    {getFieldDecorator('emailCategory', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input Email Category!'
                        }
                      ]
                    })(
                      <Select
                        onChange={(value) => {
                          value = value === '' ? null : value;
                          this.onBasicFormFormChange({
                            field: 'emailCategory',
                            value
                          });
                        }}
                      >
                        {categoryList &&
                          categoryList.map((item, index) => (
                            <Option value={item.name} key={index}>
                              {item.name}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="Email Template">
                    {getFieldDecorator('emailTemplate', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input Email Template!'
                        }
                      ]
                    })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="Object Type">
                    {getFieldDecorator('objectType', {
                      rules: [
                        { required: true, message: 'Please input Object Type!' }
                      ]
                    })(
                      <Select
                        onChange={(value) => {
                          value = value === '' ? null : value;
                          this.onBasicFormFormChange({
                            field: 'objectType',
                            value
                          });
                        }}
                      >
                        {objectTypeList &&
                          objectTypeList.map((item, index) => (
                            <Option value={item.name} key={index}>
                              {item.name}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="Object No">
                    {getFieldDecorator('objectNo', {
                      rules: [
                        {
                          max: 50,
                          message: 'Object No exceed the maximum length!'
                        }
                      ]
                    })(
                      <Input
                        onChange={(e) => {
                          const value = (e.target as any).value;
                          this.onBasicFormFormChange({
                            field: 'objectNo',
                            value
                          });
                        }}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
          <div>
            <div style={styles.title}>
              <span style={styles.titleText}>Recipient details</span>
            </div>

            <Form
              layout="horizontal"
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
              labelAlign="right"
            >
              <Row style={{ marginTop: 20 }}>
                <Col span={8}>
                  <FormItem label="Consumer Account">
                    {getFieldDecorator('consumerAccount', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input Consumer Account!'
                        },
                        {
                          max: 50,
                          message: 'Consumer Account exceed the maximum length!'
                        }
                      ]
                    })(
                      <Input
                        onChange={(e) => {
                          const value = (e.target as any).value;
                          this.onDetailsFormChange({
                            field: 'consumerAccount',
                            value
                          });
                        }}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="Consumer Name">
                    {getFieldDecorator('consumerName', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input Consumer Name!'
                        },
                        {
                          max: 50,
                          message: 'Consumer Name exceed the maximum length!'
                        }
                      ]
                    })(
                      <Input
                        onChange={(e) => {
                          const value = (e.target as any).value;
                          this.onDetailsFormChange({
                            field: 'consumerName',
                            value
                          });
                        }}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="Consumer Type">
                    {getFieldDecorator('consumerType', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input Consumer Type!'
                        },
                        {
                          max: 50,
                          message: 'Consumer Type exceed the maximum length!'
                        }
                      ]
                    })(
                      <Input
                        onChange={(e) => {
                          const value = (e.target as any).value;
                          this.onDetailsFormChange({
                            field: 'consumerType',
                            value
                          });
                        }}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="Email">
                    {getFieldDecorator('email', {
                      rules: [
                        { required: true, message: 'Please input Email!' },
                        { max: 50, message: 'Email exceed the maximum length!' }
                      ]
                    })(
                      <Input
                        onChange={(e) => {
                          const value = (e.target as any).value;
                          this.onDetailsFormChange({
                            field: 'email',
                            value
                          });
                        }}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>

          <div>
            <div style={styles.title}>
              <span style={styles.titleText}>Recipient details</span>
            </div>
            <Table
              style={{ marginTop: 20 }}
              columns={columns}
              dataSource={detailsList}
              pagination={false}
            />
          </div>
          <div>
            <div style={styles.title}>
              <span style={styles.titleText}>Preview</span>
            </div>
          </div>
        </div>
        <div className="bar-button">
          <Button
            type="primary"
            shape="round"
            onClick={() => (history as any).go(-1)}
            style={{ marginRight: 10 }}
          >
            Submit
          </Button>
          <Button
            type="primary"
            shape="round"
            style={{ marginRight: 10 }}
            onClick={() => (history as any).go(-1)}
          >
            {<FormattedMessage id="save" />}
          </Button>
          <Button
            shape="round"
            onClick={() => (history as any).go(-1)}
            style={{ marginRight: 10 }}
          >
            {<FormattedMessage id="cancel" />}
          </Button>
        </div>
      </div>
    );
  }
}
const styles = {
  title: {
    borderBottom: 'solid 1px #cccccc',
    paddingBottom: 10
  },
  titleText: {
    color: '#e2001a',
    marginRight: 10,
    fontWeigh: 500
  },
  label: {
    width: 100
  },
  warpper: {}
} as any;

export default Form.create()(MessageDetails);
