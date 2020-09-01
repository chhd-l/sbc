import React, { Component } from 'react';
import {
  Form,
  Select,
  Input,
  Button,
  Table,
  Divider,
  message,
  Tooltip,
  Popconfirm,
  Modal
} from 'antd';
import { SelectGroup, cache } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import * as webapi from '../webapi';
import { Link } from 'react-router-dom';
import UserModal from './user-modal';
import { QMMethod, ValidConst } from 'qmkit';

const FormItem = Form.Item;
const Option = Select.Option;

class UserList extends Component<any, any> {
  constructor(props: any) {
    super(props);
    (this.state = {
      userData: [],
      searchForm: {
        name: '',
        email: '',
        status: ''
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      loading: false,
      userForm: {
        id: '',
        firstName: '',
        lastName: '',
        email: ''
      },
      userVisible: false,
      disabledModalVisible: false,
      disabledReason: ''
    }),
      (this.getUsers = this.getUsers.bind(this));
    this.deleteUser = this.deleteUser.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    // this.getUsers()
  }

  getUsers = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    const query = this.state.searchForm;
    const { res } = await webapi.getUsersByPrescriberId({
      ...query,
      prescriberId: this.props.prescriberId,
      pageNum,
      pageSize
    });

    this.setState({
      loading: true
    });
    if (res.code === 'K-000000') {
      let pagination = this.state.pagination;
      let userData = res.context;
      pagination.total = res.context.total;
      this.setState({
        pagination: pagination,
        userData: userData,
        loading: false
      });
    }
  };

  handleTableChange(pagination: any) {
    this.setState({
      pagination: pagination
    });
    this.getUsers({ pageNum: pagination.current - 1, pageSize: 10 });
  }

  deleteUser = async (id) => {
    let employeeIds = [];
    employeeIds.push(id);
    await webapi.deleteEmployeeByIds(employeeIds);
  };

  editUser = async (record) => {
    this.setState({
      userForm: Object.assign({
        id: record.id,
        firstName: record.firstName,
        lastName: record.lastName,
        email: record.email
      }),
      userVisible: true
    });
  };

  disabledUser = async (record) => {
    this.setState({
      disabledModalVisible: true,
      userForm: Object.assign({
        id: record.id,
        accountState: record.accountState
      })
    });
  };

  sendEmail = async (id) => {};

  onFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };

  closeUserModel = () => {
    this.setState({
      userVisible: false
    });
  };

  _handleOk = () => {
    const form = this.props.form;
    // 账号禁用
    form.validateFields(null, async (errs, values) => {
      //如果校验通过
      if (!errs) {
        await webapi.disableEmployee(
          this.state.userForm.id,
          values.reason,
          this.state.userForm.accountState
        );
        this.props.form.setFieldsValue({
          reason: null
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    let employee = JSON.parse(sessionStorage.getItem(cache.EMPLOYEE_DATA));
    const prescriberId =
      employee && employee.prescribers && employee.prescribers.length > 0
        ? employee.prescribers[0].prescriberId
        : null;
    const columns = [
      {
        title: 'User name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'User email',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: 'User status',
        dataIndex: 'accountState',
        key: 'accountState'
      },
      {
        title: 'Operation',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) =>
          prescriberId ? (
            <span>
              {record.accountState !== 3 ? (
                <Tooltip placement="top" title="Edit">
                  <a
                    onClick={() => this.editUser(record)}
                    className="iconfont iconEdit"
                  ></a>
                </Tooltip>
              ) : null}

              <Tooltip placement="top" title="Delete">
                <a
                  onClick={() => this.deleteUser(record.id)}
                  className="iconfont iconDelete"
                ></a>
              </Tooltip>
              <Tooltip placement="top" title="Disabled">
                <a
                  onClick={() => this.disabledUser(record)}
                  className="iconfont iconbtn-disable"
                ></a>
              </Tooltip>
            </span>
          ) : (
            <span>
              <a onClick={() => this.sendEmail(record.id)}>Send</a>
              <Popconfirm
                title="Are you sure to remove the user?"
                onConfirm={() => {
                  this.deleteUser(record.id);
                }}
                okText="OK"
                cancelText="Cancel"
              >
                <Tooltip placement="top" title="Remove">
                  <a href="javascript:void(0);">Remove</a>
                </Tooltip>
              </Popconfirm>
            </span>
          )
      }
    ];
    return (
      <div>
        <div className="container-search">
          <Form layout="inline">
            <FormItem>
              <Input
                addonBefore="User name"
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.onFormChange({
                    field: 'name',
                    value
                  });
                }}
                placeholder="Please input name"
                style={{ width: 300 }}
              />
            </FormItem>
            <FormItem>
              <Input
                addonBefore="User email"
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.onFormChange({
                    field: 'name',
                    value
                  });
                }}
                placeholder="Please input email"
                style={{ width: 300 }}
              />
            </FormItem>
            <FormItem>
              <SelectGroup
                defaultValue="All"
                label="User status"
                onChange={(value) => {
                  value = value === '' ? null : value;
                  this.onFormChange({
                    field: 'type',
                    value
                  });
                }}
                style={{ width: 80 }}
              >
                <Option value="">All</Option>
                <Option value="4">Inactivated</Option>
                <Option value="3">To be audit</Option>
                <Option value="0">Enabled</Option>
                <Option value="1">Disabled</Option>
              </SelectGroup>
            </FormItem>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon="search"
                shape="round"
                onClick={(e) => {
                  e.preventDefault();
                  this.getUsers();
                }}
              >
                <span>
                  <FormattedMessage id="search" />
                </span>
              </Button>
            </Form.Item>
          </Form>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              this.setState({
                userVisible: true
              });
            }}
            style={{ marginBottom: '10px', marginTop: '10px' }}
          >
            <FormattedMessage id="add" />
          </Button>
        </div>
        <div className="container">
          <Table
            rowKey={(record, index) => index}
            dataSource={this.state.userData}
            columns={columns}
            pagination={this.state.pagination}
            loading={this.state.loading}
            onChange={this.handleTableChange}
          />
        </div>
        <UserModal
          userForm={this.state.userForm}
          visible={this.state.userVisible}
          parent={this}
          reflash={() => this.getUsers()}
        />
        <Modal
          maskClosable={false}
          title="Please input the reason for suspension"
          visible={this.state.disabledModalVisible}
          onCancel={() => {}}
          onOk={this._handleOk}
        >
          <Form>
            <FormItem>
              {getFieldDecorator('reason', {
                rules: [
                  {
                    required: true,
                    message: 'Please input the reason for suspension'
                  },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorTrimMinAndMax(
                        rule,
                        value,
                        callback,
                        'Reason for disabling',
                        1,
                        100
                      );
                    }
                  }
                ]
              })(
                <Input.TextArea
                  placeholder="Please input a reason for disabling"
                  onChange={(e: any) =>
                    this.setState({
                      disabledReason: e.target.value
                    })
                  }
                />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(UserList);
