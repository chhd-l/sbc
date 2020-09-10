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
  Modal,
  Row,
  Col
} from 'antd';
import { SelectGroup, cache } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import * as webapi from '../webapi';
import { Link } from 'react-router-dom';
import UserModal from './user-modal';
import { QMMethod, ValidConst } from 'qmkit';
const { confirm } = Modal;

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
      disabledReason: '',
      auditModalVisible: false
    }),
      (this.getUsers = this.getUsers.bind(this));
    this.deleteUser = this.deleteUser.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.getUsers();
  }

  getUsers = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 5 }) => {
    if (!this.props.prescriberKeyId) {
      return;
    }
    const query = this.state.searchForm;
    this.setState({
      loading: true
    });
    const { res } = await webapi.getUsersByPrescriberId({
      ...query,
      prescriberId: this.props.prescriberKeyId,
      pageNum,
      pageSize
    });
    if (res.code === 'K-000000') {
      let pagination = this.state.pagination;
      let userData = res.context.content;
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
    this.getUsers({ pageNum: pagination.current - 1, pageSize: 5 });
  }

  deleteUser = async (id) => {
    let employeeIds = [];
    employeeIds.push(id);
    const { res } = await webapi.deleteEmployeeByIds(employeeIds);
    if (res.code === 'K-000000') {
      this.getUsers();
    }
  };

  editUser = async (record) => {
    this.setState({
      userForm: Object.assign({
        id: record.employeeId,
        firstName: record.employeeName ? record.employeeName.split(' ')[0] : '',
        lastName: record.employeeName ? record.employeeName.split(' ')[1] : '',
        email: record.email
      }),
      userVisible: true
    });
  };

  disabledUser = async (record) => {
    this.setState({
      disabledModalVisible: true,
      userForm: Object.assign({
        id: record.employeeId
      })
    });
  };

  enableUser = async (record) => {
    const { res } = await webapi.enableEmployee([record.employeeId]);
    if (res.code === 'K-000000') {
      this.getUsers();
    }
  };

  auditUser = async (record) => {
    this.setState({
      auditModalVisible: true,
      userForm: Object.assign({
        id: record.employeeId
      })
    })
  };

  handleAudit = async (agree: Boolean) => {
     if (agree) {
      const { res } = await webapi.auditEmployee([this.state.userForm.id], 0);
      if (res.code === 'K-000000') {
        this.setState({
          auditModalVisible: false
        })
        this.getUsers();
      }
     } else {
      const { res } = await webapi.auditEmployee([this.state.userForm.id], 1);
      if (res.code === 'K-000000') {
        this.setState({
          auditModalVisible: false
        })
        this.getUsers();
      }
     }
  }

  sendEmail = async (recored) => {
    const { res: prescriberRes } = await webapi.getClinicById({
      id: this.props.prescriberKeyId
    });
    let prescriberId = '';
    if (prescriberRes.code === 'K-000000') {
      prescriberId = prescriberRes.context.prescriberId
    }
    let employeeName = recored.employeeName.split(' ');
    let paramter = {
      baseUrl: window.origin,
      email: recored.email,
      firstName: employeeName && employeeName.length > 0 ?  recored.employeeName.split(' ')[0] : '',
      prescriberId: prescriberId
    }
    const { res } = await webapi.sendEmail(paramter);
    if(res.code === 'K-000000') {
      message.success('send successful')
    } else {
      message.error(res.message || 'send failed')
    }
  };

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

  cancelDisabled = () => {
    this.setState({
      disabledModalVisible: false
    });
    this.props.form.setFieldsValue({
      reason: null
    });
  };
  handleDisabled = () => {
    const form = this.props.form;
    // 账号禁用
    form.validateFields(null, async (errs, values) => {
      //如果校验通过
      if (!errs) {
        await webapi.disableEmployee(this.state.userForm.id, values.reason, 1);
        this.props.form.setFieldsValue({
          reason: null
        });
        this.setState({
          disabledModalVisible: false
        });
        this.getUsers();
      }
    });
  };

  addUser = () => {
    if (!this.props.alreadyHasPrescriber) {
      message.error('Please add prescriber first');
      return;
    }
    this.setState({
      userVisible: true,
      userForm: Object.assign({
        id: '',
        firstName: '',
        lastName: '',
        email: ''
      })
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    let employee = JSON.parse(sessionStorage.getItem(cache.EMPLOYEE_DATA));
    const prescriberId =
      employee && employee.prescribers && employee.prescribers.length > 0
        ? employee.prescribers[0].id
        : null;
    const columns = [
      {
        title: 'User name',
        dataIndex: 'employeeName',
        key: 'employeeName'
      },
      {
        title: 'User email',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: 'User status',
        dataIndex: 'accountState',
        key: 'accountState',
        render: (text, record) => {
          switch (text) {
            case 0:
              return 'Enabled';
            case 1:
              return 'Disabled';
            case 3:
              return 'Inactivated';
            case 4:
              return 'To be audit';
            default:
              return '';
          }
        }
      },
      {
        title: 'Operation',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => {
          if (record.accountState === 0 || record.accountState === 1) {
            return (
              <span className="operation-box">
                <Tooltip placement="top" title="Edit">
                  <a
                    onClick={() => this.editUser(record)}
                    className="iconfont iconEdit"
                  ></a>
                </Tooltip>
                <Popconfirm
                  title="Are you sure to remove the user?"
                  onConfirm={() => {
                    this.deleteUser(record.employeeId);
                  }}
                  okText="OK"
                  cancelText="Cancel"
                >
                  <Tooltip placement="top" title="Delete">
                    <a
                      className="iconfont iconDelete"
                    ></a>
                  </Tooltip>
                </Popconfirm>
                {record.accountState === 0 ? (
                  <Tooltip placement="top" title="Disabled">
                    <a
                      onClick={() => this.disabledUser(record)}
                      className="iconfont iconbtn-disable"
                    ></a>
                  </Tooltip>
                ) : (
                  <Tooltip placement="top" title="Enabled">
                    <a
                      onClick={() => this.enableUser(record)}
                      className="iconfont iconEnabled"
                    ></a>
                  </Tooltip>
                )}
              </span>
            );
          }

          if (record.accountState === 3 || record.accountState === 4) {
            return (
              <span className="operation-box">
                {record.accountState === 3 ? (
                  <Tooltip placement="top" title="Send">
                    <a
                      onClick={() => this.sendEmail(record)}
                      className="iconfont iconemail"
                    ></a>
                  </Tooltip>
                ) : prescriberId ? (
                  <Tooltip placement="top" title="Audit">
                    <a
                      onClick={() => this.auditUser(record)}
                      className="iconfont iconaudit"
                    ></a>
                  </Tooltip>
                ) : null}
                <Popconfirm
                  title="Are you sure to remove the user?"
                  onConfirm={() => {
                    this.deleteUser(record.employeeId);
                  }}
                  okText="OK"
                  cancelText="Cancel"
                >
                  <Tooltip placement="top" title="Delete">
                    <a
                      className="iconfont iconDelete"
                    ></a>
                  </Tooltip>
                </Popconfirm>
              </span>
            );
          }
        }
      }
    ];
    return (
      <div>
        <p style={{ color: '#f02637', fontWeight: 700, fontSize: '12px' }}>
          *New added user still needs to register before logging in store portal
        </p>
        <div className="container-search">
          <Form layout="inline">
            <FormItem>
              <Input
                addonBefore="User name"
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.onFormChange({
                    field: 'userName',
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
                    field: 'email',
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
                    field: 'accountState',
                    value
                  });
                }}
                style={{ width: 80 }}
              >
                <Option value="">All</Option>
                <Option value={'3'}>Inactivated</Option>
                <Option value={'4'}>To be audit</Option>
                <Option value={'0'}>Enabled</Option>
                <Option value={'1'}>Disabled</Option>
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
            onClick={this.addUser}
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
          prescriberKeyId={this.props.prescriberKeyId}
          reflash={() => this.getUsers()}
        />
        <Modal
          maskClosable={false}
          title="Please input the reason for suspension"
          visible={this.state.disabledModalVisible}
          onCancel={this.cancelDisabled}
          onOk={this.handleDisabled}
        >
          <Form>
            <FormItem>
              {getFieldDecorator('reason', {
                rules: [
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
        <Modal
          maskClosable={false}
          visible={this.state.auditModalVisible}
          footer={null}
          title="Agree or Reject?"
          onCancel={()=>this.setState({
            auditModalVisible: false
          })}
        > 
          <Row>
            <Col span={12}>
            </Col>
            <Col span={12} style={{textAlign: 'right'}}>
               <Button onClick={()=> this.handleAudit(false)} style={{ marginRight: '10px' }}>Reject</Button>
               <Button type="primary" onClick={()=> this.handleAudit(true)}>Agree</Button>
            </Col>
          </Row>       
        </Modal>
      </div>
    );
  }
}

export default Form.create()(UserList);
