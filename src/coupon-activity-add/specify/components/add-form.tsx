import * as React from 'react';
import { Button, Checkbox, Col, DatePicker, Form, Input, message, Radio, Row, Spin } from 'antd';
import PropTypes from 'prop-types';
import { Store } from 'plume2';
import styled from 'styled-components';
import { Const, history, QMMethod, util } from 'qmkit';
import { fromJS } from 'immutable';
import ChooseCoupons from '../../common-components/choose-coupons';
import ChooseCustomer from './specify-customer';
import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
import '../../index.less';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

const NumBox = styled.div`
  .chooseNum .has-error .ant-form-explain {
    margin-left: 90px;
  }
`;
const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 21
  }
};
const { RangePicker } = DatePicker;

export default class SpecifyAddForm extends React.Component<any, any> {
  props;
  _store: Store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
    this.state = {
      //等级选择组件相关
      level: {
        _indeterminate: false,
        _checkAll: false,
        _checkedLevelList: [],
        _allCustomer: true,
        _levelPropsShow: false,
        _specify: false
      },
      joinLevel: {
        _joinLevel: null
      }
    };
  }

  UNSAFE_componentWillReceiveProps() {
    //等级初始化
    const store = this._store as any;
    const joinLevel = store.state().getIn(['activity', 'joinLevel']) + '';
    if (this.state.joinLevel._joinLevel == joinLevel) {
      return;
    }
    const levelList = store.state().get('levelList') && store.state().get('levelList').toJS();
    this.setState({ joinLevel: { _joinLevel: joinLevel } });
    if (joinLevel == undefined || joinLevel == null) {
      const { customerLevel } = this.state;
      const levelIds = customerLevel.map((level) => {
        return level.customerLevelId + '';
      });
      this.setState({
        level: {
          _indeterminate: false,
          _checkAll: true,
          _checkedLevelList: levelIds,
          _allCustomer: true,
          _levelPropsShow: false,
          _specify: false
        }
      });
    } else {
      if (+joinLevel === 0) {
        //全店铺客户
        this._levelRadioChange(0, levelList);
        //店铺内客户全选
        this._allLevelChecked(true, levelList);
      } else if (+joinLevel === -1) {
        //全平台客户
        this._levelRadioChange(-1, levelList);
        // 自营店铺默认客户全选  //店铺内客户全选
        this._allLevelChecked(true, levelList);
      } else if (+joinLevel === -2) {
        //全平台客户
        this._levelRadioChange(-2, '');
      } else {
        util.isThirdStore() ? this._levelRadioChange(0, levelList) : this._levelRadioChange(-1, levelList);
        //勾选某些等级
        this._levelGroupChange(joinLevel.split(','), levelList);
      }
    }
  }

  render() {
    const { form } = this.props;
    let { level } = this.state;
    const store = this._store as any;
    const activity = store.state().get('activity');
    const loading = store.state().get('loading');
    const levelList = store.state().get('levelList').toJS();
    const chooseCustomerList = activity.get('chooseCustomerList');
    const { getFieldDecorator } = form;
    return (
      <NumBox>
        <Form style={{ marginTop: 20 }}>
          <FormItem {...formItemLayout} label={<FormattedMessage id="Marketing.ActivityName" />}>
            {getFieldDecorator('activityName', {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: <FormattedMessage id="Marketing.theActivityShould" />
                },
                { min: 1, max: 100, message: <FormattedMessage id="Marketing.100Wrods" /> },
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorEmoji(rule, value, callback, 'Activity name');
                  }
                }
              ],
              onChange: (e) => {
                store.changeFormField({ activityName: e.target.value });
              },
              initialValue: activity.get('activityName')
            })(<Input placeholder="No more than one hundred words" style={{ width: 360 }} />)}
          </FormItem>

          <FormItem {...formItemLayout} label="Activity time">
            {getFieldDecorator('startTime', {
              rules: [
                { required: true, message: <FormattedMessage id="Marketing.PleaseSelectTheDeliveryTime" /> },
                {
                  validator: (_rule, value, callback) => {
                    if (value && moment().add(-5, 'minutes').second(0).unix() > moment(value).unix()) {
                      callback(<FormattedMessage id="Marketing.TheDeliveryTime" />);
                    } else if (value && moment().add('months', 3).unix() < moment(value).minute(0).second(0).unix()) {
                      callback(<FormattedMessage id="Marketing.TheDeliveryTimeLater" />);
                    } else {
                      callback();
                    }
                  }
                }
              ],
              onChange: (date, dateString) => {
                if (date) {
                  store.changeFormField({
                    startTime: dateString[0] + ':00',
                    endTime: dateString[1] + ':00'
                  });
                }
              },
              initialValue: activity.get('startTime') && activity.get('endTime') && [moment(activity.get('startTime')), moment(activity.get('endTime'))]
              // initialValue: activity.get('startTime') ? moment(activity.get('startTime')) : null
            })(
              <RangePicker
                getCalendarContainer={() => document.getElementById('page-content')}
                allowClear={false}
                disabledDate={(current) => {
                  return current && current < moment().startOf('day');
                  // return (current && current < moment().add(-1, 'minutes')) || (current && current > moment().add(3, 'months'));
                }}
                format={Const.DATE_FORMAT}
                placeholder={['Start date', 'End date']}
                showTime={{ format: 'HH:mm' }}
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={<FormattedMessage id="Marketing.SelectCoupons" />} required={true}>
            {getFieldDecorator(
              'coupons',
              {}
            )(
              <ChooseCoupons
                form={form}
                coupons={activity.get('coupons').toJS()}
                invalidCoupons={activity.get('invalidCoupons').toJS()}
                onChosenCoupons={(coupons) => {
                  store.onChosenCoupons(coupons);
                  this._validCoupons(fromJS(coupons), form);
                }}
                onDelCoupon={async (couponId) => {
                  store.onDelCoupon(couponId);
                  this._validCoupons(activity.get('coupons'), form);
                }}
                onChangeCouponTotalCount={(index, totalCount) => store.changeCouponTotalCount(index, totalCount)}
                type={2}
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={<FormattedMessage id="Marketing.TargetCustomers" />} required={true}>
            {getFieldDecorator('joinLevel', {
              // rules: [{required: true, message: '请选择目标客户'}],
            })(
              <div>
                <RadioGroup
                  value={level._specify ? -2 : level._allCustomer ? -1 : level._allLevel ? 0 : -2}
                  onChange={(e) => {
                    this._levelRadioChange(e.target.value, levelList);
                  }}
                >
                  <Radio value={-1}>
                    <FormattedMessage id="Marketing.AllCustomers" />
                  </Radio>
                  {/*{util.isThirdStore() && <Radio value={0}>店铺内客户</Radio>}*/}
                  {/*<Radio value={-2}>Custom</Radio>*/}
                </RadioGroup>

                {/* {level._levelPropsShow && (
                  <div>
                    {util.isThirdStore() && (
                      <Checkbox indeterminate={level._indeterminate} onChange={(e) => this._allLevelChecked(e.target.checked, levelList)} checked={level._checkAll}>
                        全部等级
                      </Checkbox>
                    )}
                    <CheckboxGroup options={this._renderCheckboxOptions(levelList)} onChange={(value) => this._levelGroupChange(value, levelList)} value={level._checkedLevelList} />
                  </div>
                )} */}

                {/*{!loading && level._specify && (*/}
                {/*  <ChooseCustomer*/}
                {/*    chooseCustomerList={chooseCustomerList && chooseCustomerList.toJS()}*/}
                {/*    selectedCustomerIds={activity.get('chooseCustomerIds') && activity.get('chooseCustomerIds').toJS()}*/}
                {/*    maxLength={1000}*/}
                {/*    onDelCustomer={async (id) => {*/}
                {/*      store.onDelCustomer(id);*/}
                {/*      form.resetFields(['joinLevel']);*/}
                {/*    }}*/}
                {/*    chooseCustomerBackFun={async (customerIds, rows) => {*/}
                {/*      store.chooseCustomerBackFun(customerIds, rows);*/}
                {/*      form.resetFields(['joinLevel']);*/}
                {/*    }}*/}
                {/*  />*/}
                {/*)}*/}
              </div>
            )}
          </FormItem>

          <Row type="flex" justify="start">
            <Col span={3} />
            <Col span={10}>
              <Button onClick={() => this._onSave()} type="primary" htmlType="submit">
                <FormattedMessage id="Marketing.Save" />
              </Button>
              &nbsp;&nbsp;
              <Button onClick={() => history.goBack()}>
                <FormattedMessage id="Marketing.Cancel" />
              </Button>
            </Col>
          </Row>
        </Form>
        {loading && <Spin className="loading-spin" indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" alt="" />} />}
      </NumBox>
    );
  }

  /**
   * 保存
   */
  _onSave = () => {
    const store = this._store as any;
    const activity = store.state().get('activity');
    const form = this.props.form;
    // 1.验证优惠券列表
    let errors = this._validCoupons(activity.get('coupons'), form);
    // 2.指定客户
    let errorsCustomer = this._validCustomers(activity.get('chooseCustomerIds'), form);
    // if (!activity.activityId) {
    form.resetFields(['time']);
    //强制校验创建时间
    if (moment().add(-5, 'minutes').second(0).unix() >= moment(activity.get('startTime')).unix()) {
      form.setFields({
        ['startTime']: {
          errors: [new Error('The selected time must be later than the current time')]
        }
      });
      message.error(<FormattedMessage id="Marketing.TheSelected" />);
      errors = true;
    }
    // if (moment().add('months', 3).unix() < moment(activity.get('startTime')).minute(0).second(0).unix()) {
    //   form.setFields({
    //     ['startTime']: {
    //       errors: [new Error('发放时间不能晚于三个月')]
    //     }
    //   });
    //   message.error('发放时间不能小于当前时间')
    //   errors = true;
    // }
    // }
    // 2.验证其它表单信息
    this.props.form.validateFields((errs) => {
      if (!errs && !errors && !errorsCustomer) {
        // 3.验证通过，保存
        const { level } = this.state;
        let joinLevel = '2';
        // if (level._specify) {
        //   joinLevel = '-2';
        // } else if (level._allCustomer && (level._checkAll || util.isThirdStore())) {
        //   joinLevel = '-1';
        // } else if (level._allLevel && level._checkAll) {
        //   joinLevel = '0';
        // } else {
        //   level._checkedLevelList.forEach((v) => {
        //     joinLevel = joinLevel + v + ',';
        //   });
        //   joinLevel = joinLevel.substring(0, joinLevel.length - 1);
        // }
        store.save(joinLevel);
      }
    });
  };

  /**
   * 渲染等级的checkBox
   * @param levels
   * @returns {any}
   */
  _renderCheckboxOptions = (levels) => {
    return levels.map((level) => {
      return {
        label: level.customerLevelName,
        value: level.customerLevelId + '',
        key: level.customerLevelId
      };
    });
  };

  /**
   * 验证优惠券列表
   */
  _validCoupons = (coupons, form) => {
    let errorFlag = false;
    form.resetFields(['coupons']);
    let errorObject = {};
    if (coupons.size == 0) {
      errorObject['coupons'] = {
        value: null,
        errors: [new Error('Please select coupons')]
      };
      errorFlag = true;
    }
    form.setFields(errorObject);
    return errorFlag;
  };

  /**
   * 验证指定客户列表
   */
  _validCustomers = (customer, form) => {
    let errorFlag = false;
    form.resetFields(['joinLevel']);
    // 3.验证通过，保存
    const { level } = this.state;
    if (level._specify) {
      let errorObject = {};
      if (!customer || customer.size == 0) {
        errorObject['joinLevel'] = {
          value: null,
          errors: [new Error('Please select the specified user')]
        };
        errorFlag = true;
      } else if (customer.size > 1000) {
        errorObject['joinLevel'] = {
          value: null,
          errors: [new Error('Up to 1000 users')]
        };
        errorFlag = true;
      }
      form.setFields(errorObject);
    }
    return errorFlag;
  };

  /**
   * 勾选全部等级
   * @param checked
   */
  _allLevelChecked = (checked, customerLevel) => {
    const levelIds = customerLevel.map((level) => {
      return level.customerLevelId + '';
    });
    let { level } = this.state;
    level._indeterminate = false;
    level._checkAll = checked;
    (level._checkedLevelList = checked ? levelIds : []), this.setState(level);
  };

  /**
   * 全部客户 ～ 全部等级  选择
   * @param value
   */
  _levelRadioChange = (value, customerLevel) => {
    let levelPropsShow = false;

    let { level } = this.state;

    // 自营全部等级+店铺等级
    if ((util.isThirdStore() && value == 0) || (!util.isThirdStore() && value == -1)) {
      levelPropsShow = true;
      level._specify = false;
      const levelIds = customerLevel.map((level) => {
        return level.customerLevelId + '';
      });
      // 全选
      if (levelPropsShow && level._checkedLevelList.length == 0) {
        level._indeterminate = false;
        level._checkedLevelList = levelIds;
        level._checkAll = true;
      }
    } else {
      // 第三方店铺-全平台
      level._specify = false;
    }
    if (value == -1) {
      level._allCustomer = true;
      level._allLevel = false;
      level._levelPropsShow = levelPropsShow;
    } else if (value == 0) {
      level._allLevel = true;
      level._allCustomer = false;
      level._levelPropsShow = true;
      level._indeterminate = false;
      level._specify = false;
    } else if (value == -2) {
      level._specify = true;
      level._allCustomer = false;
      level._levelPropsShow = false;
      level._checkAll = false;
      level._allLevel = false;
    }
    this.props.form.resetFields('joinLevel');
    this.setState(level);
  };

  /**
   * 勾选部分等级方法
   * @param checkedList
   */
  _levelGroupChange = (checkedList, customerLevel) => {
    let { level } = this.state;
    level._indeterminate = !!checkedList.length && checkedList.length < customerLevel.length;
    level._checkAll = checkedList.length === customerLevel.length;
    (level._checkedLevelList = checkedList), this.setState(level);

    this.props.form.resetFields('joinLevel');
  };
}
