import React from 'react';
import PropTypes from 'prop-types';
import { Store } from 'plume2';
import {
  Row,
  Form,
  Input,
  Select,
  Radio,
  Switch,
  DatePicker,
  TreeSelect,
  message
} from 'antd';
import { List } from 'immutable';
import { Const } from 'qmkit';
import moment from 'moment';
import Checkbox from 'antd/lib/checkbox/Checkbox';

import { QMMethod, ValidConst } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { getClinicsLites } from './../webapi';

const RadioGroup = Radio.Group;
const { TreeNode } = TreeSelect;
const FormItem = Form.Item;

const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 10 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 10 }
  }
};

export default class EditForm extends React.Component<any, any> {
  _store: Store;

  accountPassword;

  accountPasswordConfirm;
  accountName;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this.state = {
      changePassword: false,
      value: undefined,
      clinicsLites: [],
      selectRoleIds: ''
    };
    this._store = ctx['_plume$Store'];
    this.getClinicsLites();
  }

  getClinicsLites = async () => {
    const { res } = await getClinicsLites();
    if (res.code === 'K-000000') {
      this.setState({
        clinicsLites: res.context
      });
    } else {
      message.error(res.message);
    }
  };

  componentWillMount() {
    const _state = this._store.state();
    const employeeForm = _state.get('employeeForm');
    if (_state.get('edit')) {
      this.setState({
        selectRoleIds: employeeForm.get('roleIds')
      });
    } else {
      this.setState({
        selectRoleIds: ''
      });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const _state = this._store.state();
    const roles = _state.get('roles');
    //管理部门的账号集合
    const manageDepartmentIdList = _state.get('manageDepartmentIdList');
    const isMaster = _state.get('isMaster');
    //扁平化roles,获取roleIds集合
    const roleIds = roles.map((role) => {
      return role.get('roleInfoId');
    });
    const employeeForm = _state.get('employeeForm');
    //部门树
    const departTree = _state.get('departTree');
    let employeeName = {};
    let employeeMobile = {};
    //邮箱
    let email = {};
    let jobNo = {};
    let position = {};
    let birthday = {};
    let sex = {
      initialValue: 0
    };
    let departmentIdList = {};

    let roleIdList = {};
    let isEmployee = {};
    let clinicsId = {};
    //表单控件是否禁用
    const editDisable = _state.get('editDisable') && _state.get('edit');
    //如果是编辑状态
    if (_state.get('edit')) {
      employeeName = {
        initialValue: employeeForm.get('employeeName')
      };

      employeeMobile = {
        initialValue: employeeForm.get('employeeMobile')
      };

      email = {
        initialValue: employeeForm.get('email')
      };

      jobNo = {
        initialValue: employeeForm.get('jobNo')
      };

      position = {
        initialValue: employeeForm.get('position')
      };

      birthday = {
        initialValue: employeeForm.get('birthday')
          ? moment(employeeForm.get('birthday'))
          : null
      };

      departmentIdList = {
        initialValue: employeeForm.get('departmentIds')
          ? isMaster == 0
            ? employeeForm
                .get('departmentIds')
                .split(',')
                .filter((v) => manageDepartmentIdList.toJS().includes(v))
            : employeeForm.get('departmentIds').split(',')
          : []
      };

      sex = {
        initialValue: employeeForm.get('sex') || 0
      };

      isEmployee = {
        initialValue: employeeForm.get('isEmployee')
      };

      //取最新的roleIds集合与该员工下面挂的roleIds的交集，防止有的角色已经删除仍然显示的情况
      roleIdList = {
        initialValue: employeeForm.get('roleIds')
          ? employeeForm
              .get('roleIds')
              .split(',')
              .reduce((pre, cur) => {
                let current = Number(cur);
                if (roleIds.toJS().includes(current)) {
                  pre.push(cur);
                }
                return pre;
              }, [])
          : []
      };
      clinicsId = {
        initialValue: employeeForm.get('clinicsId')
      };
    }
    return (
      <Form>
        <Row>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="employeeName" />}
            hasFeedback
          >
            {getFieldDecorator('employeeName', {
              ...employeeName,
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请填写员工姓名'
                },
                {
                  min: 1,
                  max: 20,
                  message: '1-20个字符'
                }
                // {
                //   validator: (rule, value, callback) => {
                //     QMMethod.validatorTrimMinAndMax(
                //       rule,
                //       value,
                //       callback,
                //       '员工姓名',
                //       1,
                //       20
                //     );
                //   }
                // }
              ]
            })(<Input disabled={editDisable} placeholder="仅限1-20位字符" />)}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="email" />}
            required={true}
            hasFeedback
          >
            {getFieldDecorator('email', {
              ...email,
              rules: [
                { pattern: ValidConst.email, message: '请输入正确的邮箱' },
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorMinAndMax(
                      rule,
                      value,
                      callback,
                      '邮箱',
                      0,
                      50
                    );
                  }
                }
              ]
            })(<Input disabled={editDisable} placeholder="仅限0-50位字符" />)}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="employeePhone" />}
            hasFeedback
            required={true}
          >
            {getFieldDecorator('employeeMobile', {
              ...employeeMobile,
              rules: [
                { required: true, message: '员工手机不能为空' },
                { pattern: ValidConst.phone, message: '请输入正确的手机号码' }
              ]
            })(<Input disabled={editDisable} placeholder="仅限11位数字" />)}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="employeeNo" />}
          >
            {getFieldDecorator('jobNo', {
              ...jobNo,
              rules: [
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorMinAndMax(
                      rule,
                      value,
                      callback,
                      '工号',
                      0,
                      20
                    );
                  }
                }
              ]
            })(<Input disabled={editDisable} placeholder="仅限0-20位字符" />)}
          </FormItem>

          {/* <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="position" />}
          >
            {getFieldDecorator('position', {
              ...position,
              rules: [
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorMinAndMax(
                      rule,
                      value,
                      callback,
                      '岗位',
                      0,
                      20
                    );
                  }
                }
              ]
            })(<Input disabled={editDisable} placeholder="仅限0-20位字符" />)}
          </FormItem> */}

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="birthday" />}
          >
            {getFieldDecorator('birthday', {
              ...birthday
            })(
              <DatePicker
                disabled={editDisable}
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                allowClear={true}
                format={Const.DAY_FORMAT}
                placeholder={'生日'}
              />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="Gender" />}
          >
            {getFieldDecorator('sex', {
              ...sex
            })(
              <RadioGroup
                disabled={editDisable}
                value={employeeForm.get('sex')}
                //onChange={(e) => console.log(e.target.value)}
              >
                <Radio value={0}>
                  <span style={styles.darkColor}>保密</span>
                </Radio>
                <Radio value={1}>
                  <span style={styles.darkColor}>男</span>
                </Radio>
                <Radio value={2}>
                  <span style={styles.darkColor}>女</span>
                </Radio>
              </RadioGroup>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="attributionDepartment" />}
          >
            {getFieldDecorator('departmentIdList', {
              ...departmentIdList
            })(
              <TreeSelect
                disabled={
                  editDisable ||
                  (isMaster == 0 && manageDepartmentIdList.size == 0)
                }
                // treeData = {treeData.toJS()}
                showSearch={false}
                style={{ width: '100%' }}
                value={departmentIdList}
                dropdownStyle={{ maxHeight: 550, overflow: 'auto' }}
                placeholder="请选择，可多选"
                allowClear
                multiple
                treeDefaultExpandAll
                onChange={this.onChange}
              >
                {this._loop(departTree)}
              </TreeSelect>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="systemRole" />}
            hasFeedback
          >
            {getFieldDecorator('roleIdList', {
              ...roleIdList
            })(
              <Select
                placeholder="请选择，可多选"
                disabled={editDisable}
                mode="multiple"
                showSearch
                onChange={this.roleChange}
                filterOption={(input, option: { props }) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {this._renderOption(roles)}
                {/* {
                    <Option value={'addRole'} key={'xxx'}>
                      {'+其它员工角色'}
                    </Option>
                  } */}
              </Select>
            )}
          </FormItem>

          {this.state.selectRoleIds &&
          this.state.selectRoleIds.indexOf('168') > -1 ? (
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="clinics" />}
              hasFeedback
            >
              {getFieldDecorator('clinicsId', {
                ...clinicsId,
                rules: [{ required: true, message: 'Please Select Clinics!' }]
              })(
                <Select
                  placeholder="Please Select Clinics"
                  disabled={editDisable}
                  showSearch
                  filterOption={(input, option: { props }) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this._renderClinicsOption()}
                </Select>
              )}
            </FormItem>
          ) : (
            ''
          )}

          {/* {this.state.roleIds.includes('addRole') ? (
              <FormItem {...formItemLayout} label="员工角色" hasFeedback>
                {getFieldDecorator('roleName', {
                  ...roleName,
                  rules: [
                    {
                      validator: (rule, value, callback) => {
                        QMMethod.validatorTrimMinAndMax(
                          rule,
                          value,
                          callback,
                          '角色名称',
                          1,
                          10
                        );
                      }
                    }
                  ]
                })(<Input />)}
              </FormItem>
            ) : null} */}
          {/* <FormItem
            {...formItemLayout}
            label={
              <span>
                <FormattedMessage id="assistant" />
              </span>
            }
          >
            {getFieldDecorator('isEmployee', {
              ...isEmployee,
              rules: [{ required: true, message: '请选择是否是业务员' }]
            })(
              <RadioGroup disabled={editDisable}>
                <Radio value={0}>是</Radio>
                <Radio value={1}>否</Radio>
              </RadioGroup>
            )}
          </FormItem> */}

          {/* <FormItem
              {...formItemLayout}
              label="账户名"
              hasFeedback
              required={true}
            >
              {getFieldDecorator('accountName', {
                ...accountName,
                rules: [
                  { required: true, message: '请输入账户名' },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorTrimMinAndMax(
                        rule,
                        value,
                        callback,
                        '账户名',
                        1,
                        20
                      );
                    }
                  }
                ]
              })(<Input />)}
            </FormItem> */}

          {_state.get('edit') ? (
            <FormItem {...formItemLayout} label="Reset Password">
              <Switch
                onChange={(e) => this.setState({ changePassword: e.valueOf() })}
              />
            </FormItem>
          ) : null}

          {this.state.changePassword || !_state.get('edit') ? (
            <div>
              <FormItem
                {...formItemLayout}
                label="Password"
                hasFeedback
                required={true}
              >
                {getFieldDecorator('accountPassword', {
                  rules: [
                    { required: true, message: '请输入密码' },
                    {
                      pattern: ValidConst.password,
                      message: '密码为6-16位字母或数字密码'
                    }
                  ]
                })(<Input type="password" />)}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="Confirm Password"
                hasFeedback
                required={true}
              >
                {getFieldDecorator('accountPasswordConfirm', {
                  rules: [
                    { required: true, message: '请输入确认密码' },
                    { validator: this.checkConfirmPassword }
                  ]
                })(<Input type="password" />)}
              </FormItem>
              {/* <FormItem {...formItemLayout} colon={false} label=" ">
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {getFieldDecorator('isSendPassword')(
                      <Checkbox>发送账号到员工手机</Checkbox>
                    )}
                  </div>
                </FormItem> */}
            </div>
          ) : null}

          {/* {_state.get('edit') ? null : (
            <FormItem {...formItemLayout} colon={false} label=" ">
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                {getFieldDecorator('isSendPassword')(
                  <Checkbox>短信通知员工</Checkbox>
                )}
              </div>
            </FormItem>
          )} */}
        </Row>
      </Form>
    );
  }

  /**
   * 系统角色
   * @param roles
   * @returns {Iterable<number, any>}
   * @private
   */
  _renderOption(roles: List<any>) {
    return roles.map((option) => {
      return (
        <Option
          value={option.get('roleInfoId').toString()}
          key={option.get('roleInfoId')}
        >
          {option.get('roleName')}
        </Option>
      );
    });
  }

  /**
   * 医院
   * @param roles
   * @returns {Iterable<number, any>}
   * @private
   */
  _renderClinicsOption() {
    return this.state.clinicsLites.map((option) => {
      return (
        <Option value={option.clinicsId} key={option.clinicsId}>
          {option.clinicsName}
        </Option>
      );
    });
  }
  roleChange = (value) => {
    let roleStringIds = value.join(',');
    this.setState({
      selectRoleIds: roleStringIds
    });
  };

  checkConfirmPassword = (_rule, value, callback) => {
    if (value != this.props.form.getFieldValue('accountPassword')) {
      callback(new Error('重复密码不一致'));
      return;
    }

    callback();
  };

  onChange = (ids, value) => {
    this.setState({ value: value });
    //存放目标部门IDlist
    // const { setTargetDeparts } = this.props.relaxProps;
    // setTargetDeparts(ids)
  };

  _loop = (allDeparts) => {
    const _state = this._store.state();
    const manageDepartmentIdList = _state.get('manageDepartmentIdList');
    //是否为主账号
    const isMaster = _state.get('isMaster');
    return allDeparts.map((dep) => {
      //子部门
      if (dep.get('children') && dep.get('children').size > 0) {
        const childDeparts = dep.get('children');
        return (
          <TreeNode
            disabled={
              isMaster == 0 &&
              !manageDepartmentIdList.toJS().includes(dep.get('departmentId'))
            }
            value={dep.get('departmentId')}
            title={dep.get('departmentName')}
          >
            {this._loop(childDeparts)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          disabled={
            isMaster == 0 &&
            !manageDepartmentIdList.toJS().includes(dep.get('departmentId'))
          }
          value={dep.get('departmentId')}
          title={dep.get('departmentName')}
        />
      );
    });
  };
}

const styles = {
  darkColor: {
    fontSize: 12,
    color: '#333'
  }
};
