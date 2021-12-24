import React, { Component } from 'react';
import { Form, Select, Input, Button, Table, Divider, message, Tooltip, Popconfirm, Modal, Row, Col } from 'antd';
import { SelectGroup, cache, Const, RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import * as webapi from '../webapi';
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
      auditModalVisible: false,
      hasPrescriberRole: false
    }),
      (this.getUsers = this.getUsers.bind(this));
    this.deleteUser = this.deleteUser.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
  }

  componentDidMount() {
    this.getAllRoles();
    this.getUsers();
  }

  getAllRoles() {
    webapi
      .fetchAllRoles()
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          let allRoles = res.context ? res.context.map((x) => x.roleName) : [];
          this.setState({
            hasPrescriberRole: allRoles.includes('Prescriber')
          });
        } else {
          message.error(res.message || (window as any).RCi18n({id:'Public.GetDataFailed'}));
        }
      })
      .catch(() => {
        message.error(RCi18n({ id: 'Prescriber.Get data failed' }));
      });
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
    if (res.code === Const.SUCCESS_CODE) {
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
    if (res.code === Const.SUCCESS_CODE) {
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
    if (res.code === Const.SUCCESS_CODE) {
      this.getUsers();
    }
  };

  auditUser = async (record) => {
    this.setState({
      auditModalVisible: true,
      userForm: Object.assign({
        id: record.employeeId
      })
    });
  };

  handleAudit = async (agree: Boolean) => {
    if (agree) {
      const { res } = await webapi.auditEmployee([this.state.userForm.id], 0);
      if (res.code === Const.SUCCESS_CODE) {
        this.setState({
          auditModalVisible: false
        });
        this.getUsers();
      }
    } else {
      const { res } = await webapi.auditEmployee([this.state.userForm.id], 1);
      if (res.code === Const.SUCCESS_CODE) {
        this.setState({
          auditModalVisible: false
        });
        this.getUsers();
      }
    }
  };

  sendEmail = (recored) => {
    this.setState({ loading: true });
    webapi.getClinicById({
      id: this.props.prescriberKeyId
    }).then((data)=>{
      const prescriberRes = data.res;
      let prescriberId = '';
      if (prescriberRes.code === Const.SUCCESS_CODE) {
        prescriberId = prescriberRes.context.prescriberId;
      }
      let employeeName = recored.employeeName.split(' ');
      let paramter = {
        baseUrl: window.origin,
        email: recored.email,
        lastName: employeeName && employeeName.length > 0 ? recored.employeeName.split(' ')[1] : '',
        firstName: employeeName && employeeName.length > 0 ? recored.employeeName.split(' ')[0] : '',
        prescriberId: prescriberId
      };
      webapi.sendEmail(paramter).then((data)=>{
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({ loading: false });
          message.success(RCi18n({ id: 'Prescriber.sendSuccessful' }));
        }
      });
    });
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
      message.error(RCi18n({ id: 'Prescriber.PleaseAddPrescriberFirst' }));
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
    const prescriberId = employee && employee.prescribers && employee.prescribers.length > 0 ? employee.prescribers[0].id : null;
    const columns = [
      {
        title: RCi18n({ id: 'Prescriber.UserName' }),
        dataIndex: 'employeeName',
        key: 'employeeName'
      },
      {
        title: RCi18n({ id: 'Prescriber.UserEmail' }),
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: RCi18n({ id: 'Prescriber.UserStatus' }),
        dataIndex: 'accountState',
        key: 'accountState',
        render: (text, record) => {
          switch (text) {
            case 0:
              return RCi18n({ id: 'Prescriber.Enabled' });
            case 1:
              return RCi18n({ id: 'Prescriber.Disabled' });
            case 3:
              return RCi18n({ id: 'Prescriber.Inactivated' });
            case 4:
              return RCi18n({ id: 'Prescriber.ToBeAudit' });
            default:
              return '';
          }
        }
      },
      {
        title: RCi18n({ id: 'Prescriber.operation' }),
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => {
          if (record.accountState === 0 || record.accountState === 1) {
            return (
              <span className="operation-box">
                <Tooltip placement="top" title={RCi18n({ id: 'Prescriber.Edit' })}>
                  <a onClick={() => this.editUser(record)} className="iconfont iconEdit"></a>
                </Tooltip>
                <Popconfirm
                  title={RCi18n({ id: 'Prescriber.removeTheUser' })}
                  onConfirm={() => {
                    this.deleteUser(record.employeeId);
                  }}
                  okText={RCi18n({ id: 'Prescriber.OK' })}
                  cancelText={RCi18n({ id: 'Prescriber.Cancel' })}
                >
                  <Tooltip placement="top" title={RCi18n({ id: 'Prescriber.Delete' })}>
                    <a className="iconfont iconDelete"></a>
                  </Tooltip>
                </Popconfirm>
                {record.accountState === 0 ? (
                  <Tooltip placement="top" title={RCi18n({ id: 'Prescriber.Disabled' })}>
                    <a onClick={() => this.disabledUser(record)} className="iconfont iconbtn-disable"></a>
                  </Tooltip>
                ) : (
                  <Tooltip placement="top" title={RCi18n({ id: 'Prescriber.Enabled' })}>
                    <a onClick={() => this.enableUser(record)} className="iconfont iconEnabled"></a>
                  </Tooltip>
                )}
              </span>
            );
          }

          if (record.accountState === 3 || record.accountState === 4) {
            return (
              <span className="operation-box">
                {record.accountState === 3 ? (
                  <Tooltip placement="top" title={RCi18n({ id: 'Prescriber.Edit' })}>
                    <a onClick={() => this.editUser(record)} className="iconfont iconEdit"></a>
                  </Tooltip>
                ) : null}
                <Popconfirm
                  title={RCi18n({ id: 'Prescriber.removeTheUser' })}
                  onConfirm={() => {
                    this.deleteUser(record.employeeId);
                  }}
                  okText={RCi18n({ id: 'Prescriber.OK' })}
                  cancelText={RCi18n({ id: 'Prescriber.Cancel' })}
                >
                  <Tooltip placement="top" title={RCi18n({ id: 'Prescriber.Disabled' })}>
                    <a className="iconfont iconDelete"></a>
                  </Tooltip>
                </Popconfirm>
                {record.accountState === 3 ? (
                  <Tooltip placement="top" title={RCi18n({ id: 'Prescriber.Send' })}>
                    <a onClick={() => this.sendEmail(record)} className="iconfont iconemail"></a>
                  </Tooltip>
                ) : prescriberId ? (
                  <Tooltip placement="top" title={RCi18n({ id: 'Prescriber.Audit' })}>
                    <a onClick={() => this.auditUser(record)} className="iconfont iconaudit"></a>
                  </Tooltip>
                ) : null}
              </span>
            );
          }
        }
      }
    ];
    return (
      <div>
        {this.state.hasPrescriberRole ? (
          <React.Fragment>
            <p style={{ color: '#f02637', fontWeight: 700, fontSize: '12px' }}>
              *<FormattedMessage id="Prescriber.NewAdded" />
            </p>
            <div className="container-search">
              <Form layout="inline">
                <FormItem>
                  <Input
                    addonBefore={RCi18n({ id: 'Prescriber.UserName' })}
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'userName',
                        value
                      });
                    }}
                    placeholder={RCi18n({ id: 'Prescriber.inputname' })}
                    style={{ width: 300 }}
                  />
                </FormItem>
                <FormItem>
                  <Input
                    addonBefore={RCi18n({ id: 'Prescriber.UserEmail' })}
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'email',
                        value
                      });
                    }}
                    placeholder={RCi18n({ id: 'Prescriber.PleaseInputEmail' })}
                    style={{ width: 300 }}
                  />
                </FormItem>
                <FormItem>
                  <SelectGroup
                    defaultValue={RCi18n({id:"Prescriber.All"})}
                    label={RCi18n({ id: 'Prescriber.UserStatus' })}
                    onChange={(value) => {
                      value = value === '' ? null : value;
                      this.onFormChange({
                        field: 'accountState',
                        value
                      });
                    }}
                    style={{ width: 80 }}
                  >
                    <Option value="">
                      <FormattedMessage id="Prescriber.All" />
                    </Option>
                    <Option value={'3'}>
                      <FormattedMessage id="Prescriber.Inactivated" />
                    </Option>
                    <Option value={'4'}>
                      <FormattedMessage id="Prescriber.ToBeAudit" />
                    </Option>
                    <Option value={'0'}>
                      <FormattedMessage id="Prescriber.Enabled" />
                    </Option>
                    <Option value={'1'}>
                      <FormattedMessage id="Prescriber.Disabled" />
                    </Option>
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
                      <FormattedMessage id="Prescriber.search" />
                    </span>
                  </Button>
                </Form.Item>
              </Form>
              <Button type="primary" htmlType="submit" onClick={this.addUser} style={{ marginBottom: '10px', marginTop: '10px' }}>
                <FormattedMessage id={RCi18n({ id: 'Prescriber.add' })} />
              </Button>
            </div>
            <div className="container">
              <Table rowKey={(record, index) => index} dataSource={this.state.userData} columns={columns} pagination={this.state.pagination} loading={this.state.loading} onChange={this.handleTableChange} />
            </div>
            <UserModal userForm={this.state.userForm} visible={this.state.userVisible} parent={this} prescriberKeyId={this.props.prescriberKeyId} reflash={() => this.getUsers()} />
            <Modal maskClosable={false} title={RCi18n({ id: 'Prescriber.theReasonForDisabling' })} visible={this.state.disabledModalVisible} onCancel={this.cancelDisabled} onOk={this.handleDisabled}>
              <Form>
                <FormItem>
                  {getFieldDecorator('reason', {
                    rules: [
                      {
                        validator: (rule, value, callback) => {
                          QMMethod.validatorTrimMinAndMax(rule, value, callback, 'Reason for disabling', 1, 100);
                        }
                      }
                    ]
                  })(
                    <Input.TextArea
                      placeholder={RCi18n({ id: 'Prescriber.inputreasonfordisabling' })}
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
              title={RCi18n({ id: 'Prescriber.AgreeOrReject' })}
              onCancel={() =>
                this.setState({
                  auditModalVisible: false
                })
              }
            >
              <Row>
                <Col span={12}></Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <Button onClick={() => this.handleAudit(false)} style={{ marginRight: '10px' }}>
                    Reject
                  </Button>
                  <Button type="primary" onClick={() => this.handleAudit(true)}>
                    Agree
                  </Button>
                </Col>
              </Row>
            </Modal>
          </React.Fragment>
        ) : (
          <p style={{ color: '#f02637', fontWeight: 700, fontSize: '12px' }}>
            *<FormattedMessage id="Prescriber.NoPrescriberRole" />
          </p>
        )}
      </div>
    );
  }
}

export default Form.create()(UserList);
