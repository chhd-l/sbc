import React from 'react';
import PropTypes from 'prop-types';
import { Store } from 'plume2';
import { Row, Form, Input, Select, Radio, Switch, DatePicker, TreeSelect, message, Upload, Icon } from 'antd';
import { List } from 'immutable';
import { Const, RCi18n } from 'qmkit';
import moment from 'moment';
import Checkbox from 'antd/lib/checkbox/Checkbox';

import { QMMethod, ValidConst } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import {
  getClinicsLites,
  getUserInfo
} from './../webapi';

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
const debounce = (fn, delay = 500) => {
  // timer 是在闭包中的
  let timer = null;
  return function() {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      // 清空定时器
      timer = null;
    }, delay);
  };
};

export default class EditForm extends React.Component<any, any> {
  _store: any;

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
      selectRoleNames: '',
      prescriberIds: {},
      loading: false,
      uploadLoading: false
    };
    this._store = ctx['_plume$Store'];
    this.getClinicsLites();
    // this.findEmployeeByEmail = debounce(this.findEmployeeByEmail, 500);
  }

  getClinicsLites = async () => {
    const { res } = await getClinicsLites();
    if (res.code === Const.SUCCESS_CODE) {
      this.setState({
        clinicsLites: res.context
      });
    } else {
    }
  };

  UNSAFE_componentWillMount() {
    const _state = this._store.state();
    const employeeForm = _state.get('employeeForm');
    if (_state.get('edit')) {
      this.setState({
        selectRoleNames: this.getRoleNamesByIds(employeeForm.get('roleIds'))
      });
    } else {
      this.setState({
        selectRoleNames: ''
      });
    }
    this.setState({
      prescriberIds: {
        initialValue: Array.isArray(employeeForm.get('prescriberIds')) ? employeeForm.get('prescriberIds') : employeeForm.get('prescriberIds') ? employeeForm.get('prescriberIds').toJS() : []
      }
    });
  }

  findEmployeeByEmail = async (value) => {
    if (!value) return;
    if (!ValidConst.email.test(value)) return; // 邮箱正则

    this.setState({ loading: true });
    let { res } = await getUserInfo(value);
    this.setState({ loading: false });
    //  改变为编辑状态， 更新form数据 TO DO
    if (res.code === Const.SUCCESS_CODE) {
      let {
        employeeId
      } = res.context;
      if (!!employeeId) {
        // initEmployeeByEmail
        const employeeForm = {
          //员工名称
          employeeName: '',
          //员工手机
          employeeMobile: '',
          //角色id,逗号分隔
          roleIds: '',
          //账户名
          accountName: '',
          //账户手机
          accountPassword: '',
          //是否是业务员
          isEmployee: null,
          //邮箱
          email: null,
          //工号
          jobNo: '',
          //职位
          position: null,
          //性别，默认0，保密
          sex: 0,
          //归属部门，逗号分隔
          departmentIds: '',
          //生日
          birthday: null,
          //头像
          employeeImage: ''
        };
        this._store.initEmployeeByEmail({
          ...employeeForm,
          ...res.context
        });

      }
    } else {

    }
  };

  onEmailChange = (value: any) => {
    this.findEmployeeByEmail(value);
  };

  handleUpload = ({ file }) => {
    const status = file.status;
    if (status === 'uploading') {
      this.setState({ uploadLoading: true });
      return;
    }
    if (status === 'done') {
      if (file.response && file.response.code &&file.response.code !== Const.SUCCESS_CODE) {
        message.error(`${file.name} ${RCi18n({id:"Public.Upload.uploadfailed"})}`);
      } else {
        message.success(`${file.name} ${RCi18n({id:"Public.Upload.uploadsuccess"})}`);

        const { setFieldsValue } = this.props.form;

        setFieldsValue({
          employeeImage: file.response[0]
        });
      }
    } else if (status === 'error') {
      message.error(`${file.name} ${RCi18n({ id: 'Public.Upload.uploadfailed' })}`);
    }
    this.setState({ uploadLoading: false });
  };

  render() {
    let { loading } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const _state = this._store.state();
    const roles = _state.get('roles');
    const employeeForm = _state.get('employeeForm');
    //部门树
    const departTree = _state.get('departTree');
    let employeeName = {};
    let firstName = {};
    let lastName = {};
    let employeeMobile = {};
    //邮箱
    let email = {};
    let jobNo = {};
    let position = {};
    let birthday = {};
    let sex = {
      initialValue: 0
    };
    let employeeImage = {};
    let departmentIdList = {};

    let roleIdList = {};
    let isEmployee = {};
    //表单控件是否禁用
    const editDisable = _state.get('editDisable') && _state.get('edit');
    //如果是编辑状态
    if (_state.get('edit')) {
      employeeName = {
        initialValue: employeeForm.get('employeeName')
      };

      firstName = {
        initialValue: employeeForm.get('employeeName') ? employeeForm.get('employeeName').split(' ')[0] : ''
      };

      lastName = {
        initialValue: employeeForm.get('employeeName') ? employeeForm.get('employeeName').split(' ')[1] : ''
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
        initialValue: employeeForm.get('birthday') ? moment(employeeForm.get('birthday')) : null
      };

      departmentIdList = {
        initialValue: employeeForm.get('departmentIds') ? employeeForm.get('departmentIds').split(',') : []
      };
      sex = {
        initialValue: employeeForm.get('sex') || 0
      };

      employeeImage = {
        initialValue: employeeForm.get('employeeImage')
      };

      isEmployee = {
        initialValue: employeeForm.get('isEmployee')
      };

      //取最新的roleIds集合与该员工下面挂的roleIds的交集，防止有的角色已经删除仍然显示的情况
      roleIdList = {
        initialValue: employeeForm.get('roleIds')
      };
    }

    return (
      <Form>
        <Row>
          <FormItem {...formItemLayout} label={<FormattedMessage id='Setting.avatar' />} style={{marginBottom: 0}}>
            {getFieldDecorator('employeeImage', {
              ...employeeImage,
            })(<Input hidden={true} />)}
            <Upload
              name='uploadFile'
              headers={{
                Accept: 'application/json',
                Authorization: 'Bearer ' + (window as any).token
              }}
              listType='picture-card'
              className='avatar-uploader'
              accept='.jpg,.jpeg,.png,.gif'
              showUploadList={false}
              action={`${Const.HOST}/store/uploadStoreResource??resourceType=IMAGE`}
              onChange={this.handleUpload}
            >
              {
                getFieldValue('employeeImage') ? (
                  <img src={getFieldValue('employeeImage')} alt="avatar" style={{ width: '100%' }} />
                ) : (<Icon type={this.state.uploadLoading ? 'loading' : 'plus'} />)
              }
            </Upload>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id='email' />}
            // required={true}
            // hasFeedback
          >
            {getFieldDecorator('email', {
              ...email,
              rules: [
                { required: true, message: 'Email is required' },
                {
                  pattern: ValidConst.email,
                  message: 'Please enter your vaild email'
                },
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorWhiteSpace(rule, value, callback, 'Email');
                  }
                }
              ]
            })(<Input.Search
              enterButton
              loading={loading}
              onSearch={this.onEmailChange}
              disabled={_state.get('edit')}
              placeholder='0-50 characters'
            />)}
          </FormItem>
          <p style={{color: '#999', paddingLeft: '140px'}}>* If the account has been added to other store, you can click the button to refresh the information</p>

          <FormItem {...formItemLayout} label={<FormattedMessage id='firstName' />} hasFeedback>
            {getFieldDecorator('firstName', {
              ...firstName,
              rules: [
                {
                  required: true,
                  whitespace: false,
                  message: 'Please input first name'
                },
                {
                  min: 1,
                  max: 20,
                  message: '1-20 characters'
                },
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorWhiteSpace(rule, value, callback, 'firstName');
                  }
                }
              ]
            })(<Input disabled={editDisable} placeholder='Only 1-20 characters' />)}
          </FormItem>

          <FormItem {...formItemLayout} label={<FormattedMessage id='lastName' />} hasFeedback>
            {getFieldDecorator('lastName', {
              ...lastName,
              rules: [
                {
                  required: true,
                  whitespace: false,
                  message: 'Please input last name'
                },
                {
                  min: 1,
                  max: 20,
                  message: '1-20 characters'
                },
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorWhiteSpace(rule, value, callback, 'lastName');
                  }
                }
              ]
            })(<Input disabled={editDisable} placeholder='Only 1-20 characters' />)}
          </FormItem>

          <FormItem {...formItemLayout} label={<FormattedMessage id='employeePhone' />} hasFeedback required={false}>
            {getFieldDecorator('employeeMobile', {
              ...employeeMobile,
              rules: [
                // { required: false, message: 'employee Phone' }
                // { pattern: ValidConst.phone, message: '请输入正确的手机号码' }
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorMinAndMax(rule, value, callback, 'Phone', 8, 20);
                  }
                }
              ]
            })(<Input disabled={editDisable} />)}
          </FormItem>

          {/*<FormItem {...formItemLayout} label={<FormattedMessage id="employeeNo" />}>
            {getFieldDecorator('jobNo', {
              ...jobNo,
              rules: [
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorMinAndMax(rule, value, callback, 'User No', 0, 20);
                  }
                }
              ]
            })(<Input disabled={editDisable} placeholder="0-20 characters" />)}
          </FormItem>*/}

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

          <FormItem {...formItemLayout} label={<FormattedMessage id='birthday' />}>
            {getFieldDecorator('birthday', {
              ...birthday
            })(<DatePicker disabled={editDisable} getCalendarContainer={() => document.getElementById('page-content')}
                           allowClear={true} format={Const.DAY_FORMAT} placeholder={'birthday'} />)}
          </FormItem>

          <FormItem {...formItemLayout} label={<FormattedMessage id='gender' />}>
            {getFieldDecorator('sex', {
              ...sex
            })(
              <RadioGroup disabled={editDisable} value={employeeForm.get('sex')}>
                <Radio value={0}>
                  <span style={styles.darkColor}>Secret</span>
                </Radio>
                <br />
                <Radio value={1}>
                  <span style={styles.darkColor}>Male</span>
                </Radio>
                <Radio value={2}>
                  <span style={styles.darkColor}>Female</span>
                </Radio>
              </RadioGroup>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={<FormattedMessage id='attributionDepartment' />}>
            {getFieldDecorator('departmentIdList', {
              ...departmentIdList
            })(
              <TreeSelect disabled={editDisable} treeCheckable={true} showSearch={false} style={{ width: '100%' }}
                          dropdownStyle={{ maxHeight: 550, overflow: 'auto' }}
                          placeholder='Please select, Multiple choice' allowClear treeDefaultExpandAll
                          onChange={this.onChange}>
                {this._loop(departTree)}
              </TreeSelect>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={<FormattedMessage id='systemRole' />} hasFeedback required={true}>
            {getFieldDecorator('roleIdList', {
              ...roleIdList,
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please select Role'
                }
              ]
            })(
              <Select
                placeholder='Please choose'
                disabled={editDisable}
                // mode="multiple"
                showSearch
                onChange={this.roleChange}
                filterOption={(input, option: { props }) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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

          {this.state.selectRoleNames && this.state.selectRoleNames.indexOf('Prescriber') > -1 ? (
            <FormItem {...formItemLayout} label={<FormattedMessage id='Prescriber' />} hasFeedback>
              {getFieldDecorator('prescriberIds', {
                ...this.state.prescriberIds,
                rules: [{ required: true, message: 'Please Select Prescribers!' }]
              })(
                <Select
                  mode='tags'
                  placeholder='Please Select Prescribers'
                  disabled={editDisable}
                  // onChange={this.clinicChange}
                  showSearch
                  filterOption={this.filterOption}
                >
                  {this._renderPerscirbersOption()}
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

          {/* {_state.get('edit') ? (
            <FormItem {...formItemLayout} label="Reset Password">
              <Switch onChange={(e) => this.setState({ changePassword: e.valueOf() })} />
            </FormItem>
          ) : null} */}

          {/* {this.state.changePassword ? (
            <div>
              <FormItem {...formItemLayout} label="Password" hasFeedback required={true}>
                {getFieldDecorator('accountPassword', {
                  rules: [
                    { required: true, message: 'Please enter the password' },
                    {
                      pattern: ValidConst.password,
                      message: 'Password is 6-16 alphanumeric password'
                    }
                  ]
                })(<Input type="password" />)}
              </FormItem>

              <FormItem {...formItemLayout} label="Confirm Password" hasFeedback required={true}>
                {getFieldDecorator('accountPasswordConfirm', {
                  rules: [
                    {
                      required: true,
                      message: 'Please enter the confirmation password'
                    },
                    { validator: this.checkConfirmPassword }
                  ]
                })(<Input type="password" />)}
              </FormItem>
            </div>
          ) : null} */}

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
    return roles && roles.map((option) => {
      return (
        <Option value={option.get('roleInfoId').toString()} key={option.get('roleInfoId')}>
          {option.get('roleName')}
        </Option>
      );
    }) || [];
  }

  filterOption = (input, option: { props }) => {
    return option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  /**
   * 医院
   * @param roles
   * @returns {Iterable<number, any>}
   * @private
   */
  _renderPerscirbersOption() {
    return this.state.clinicsLites.map((option) => {
      return (
        <Option value={option.id} key={option.id}>
          {option.prescriberId}-{option.prescriberName}
        </Option>
      );
    });
  }

  roleChange = (value) => {
    // let roleStringIds = value.join(',');

    this.setState({
      selectRoleNames: this.getRoleNamesByIds(value),
      prescriberIds: {
        initialValue: []
      }
    });
  };

  getRoleNamesByIds = (rolesIds) => {
    const _state = this._store.state();
    const roles = _state.get('roles');
    let roleIdList = rolesIds.split(',');
    let roleNames = [];
    roleIdList.map((x) => {
      let role = roles && roles.find((r) => r.get('roleInfoId').toString() === x) || undefined;
      if (role) {
        roleNames.push(role.get('roleName') || '');
      }
    });
    return roleNames.join(',');
  };

  // clinicChange = (value) => {
  //   var clinic = this.state.clinicsLites.find((x) => x.clinicsId === value);
  //   if (clinic) {
  //     this.props.form.setFieldsValue({
  //       employeeName: clinic.clinicsName
  //     });
  //   }
  // };

  checkConfirmPassword = (_rule, value, callback) => {
    if (value != this.props.form.getFieldValue('accountPassword')) {
      callback(new Error('Repeated passwords are inconsistent'));
      return;
    }

    callback();
  };

  onChange = (ids) => {
    this.setState({ 'departmentIdList': ids });
    //存放目标部门IDlist
    // const { setTargetDeparts } = this.props.relaxProps;
    // setTargetDeparts(ids)
  };

  _loop = (allDeparts) => {
    return allDeparts.map((dep, index) => {
      //子部门
      if (dep.get('children') && dep.get('children').size > 0) {
        const childDeparts = dep.get('children');
        return (
          <TreeNode value={dep.get('departmentId')} title={dep.get('departmentName')} key={dep.get('departmentId')}>
            {this._loop(childDeparts)}
          </TreeNode>
        );
      }
      return <TreeNode value={dep.get('departmentId')} title={dep.get('departmentName')}
                       key={dep.get('departmentId')} />;
    });
  };
}

const styles = {
  darkColor: {
    fontSize: 12,
    color: '#333'
  }
};
