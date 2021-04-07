import React from 'react';
import { Relax, IMap } from 'plume2';
import {
  Modal,
  Form,
  Input,
  Radio,
  Checkbox,
  Tooltip,
  Icon,
  Button
} from 'antd';
import { List } from 'immutable';
import { noop, ValidConst } from 'qmkit';
import styled from 'styled-components';

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

type TList = List<any>;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};
const ServiceDiv = styled.div`
  .service-list {
    display: flex;
    flex-direction: row;
    .ant-row {
      width: 45%;
      .ant-form-item-label {
        float: left;
        width: 37%;
      }
      .ant-form-item-control-wrapper {
        float: left;
        width: 55%;
      }
    }
    .del {
      line-height: 40px;
      margin-left: 9px;
      font-size: 12px;
    }
  }
`;

/**
 * 生效终端
 * @type {{label: string; value: string}[]}
 */
const plainOptions = [
  { label: 'PC', value: 'pc' },
  { label: 'APP', value: 'app' },
  { label: 'Mobile', value: 'mobile' }
];

@Relax
export default class QQModal extends React.Component<any, any> {
  _form: any;

  constructor(props) {
    super(props);

    /*this.state = {
      //是否需要校验
      checkFlag: false
    };*/
  }

  props: {
    form: any;
    relaxProps?: {
      smsVisible: boolean;
      smsCancel: Function;
      onlineServer: IMap;
      onlineServerList: TList;
      onFormChange: Function;
      onAddOnlineServer: Function;
      onSetOnlineServer: Function;
      onDelOnlineServer: Function;
      onSaveOnlineServer: Function;
      setOneFlag: string;
      checkFlag: boolean;
    };
  };

  static relaxProps = {
    smsVisible: 'smsVisible',
    smsCancel: noop,
    onlineServer: 'onlineServer',
    onlineServerList: 'onlineServerList',
    onFormChange: noop,
    onAddOnlineServer: noop,
    onSetOnlineServer: noop,
    onDelOnlineServer: noop,
    onSaveOnlineServer: noop,
    setOneFlag: 'setOneFlag',
    checkFlag: 'checkFlag'
  };

  render() {
    const {
      smsVisible,
      smsCancel,
      onlineServer,
      onlineServerList,
      onSetOnlineServer,
      onDelOnlineServer,
      setOneFlag,
      checkFlag
    } = this.props.relaxProps;

    if (!smsVisible) {
      return null;
    }

    const { getFieldDecorator } = this.props.form;

    const initTerminal = [];
    if (onlineServer.get('effectivePc') == '1') {
      initTerminal.push('pc');
    }
    if (onlineServer.get('effectiveApp') == '1') {
      initTerminal.push('app');
    }
    if (onlineServer.get('effectiveMobile') == '1') {
      initTerminal.push('mobile');
    }

    return (
      <Modal
        maskClosable={false}
        title="Edit QQ customer service"
        visible={smsVisible}
        onOk={this._handleOK}
        onCancel={() => smsCancel()}
        width="600px"
      >
        <Form className="login-form">
          <FormItem {...formItemLayout} label="Enable Switch">
            <RadioGroup
              value={onlineServer.get('serverStatus')}
              onChange={this._handleChange}
            >
              <Radio value={1}>Enable</Radio>
              <Radio value={0}>Disable</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem {...formItemLayout} label="Effective Terminal">
            {getFieldDecorator('effectTerminal', {
              initialValue: initTerminal,
              rules: [
                {
                  required: checkFlag,
                  message: 'Please select valid terminal when enabling'
                }
              ]
            })(
              <CheckboxGroup
                options={plainOptions}
                onChange={this._onCheckedChange}
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Customer Service List">
            {getFieldDecorator('setOneFlag', {
              initialValue: setOneFlag,
              rules: [
                {
                  required: checkFlag,
                  message: 'Set up at least one customer service when enabled'
                }
              ]
            })(
              <div>
                <Button
                  disabled={onlineServerList && onlineServerList.size > 9}
                  onClick={this._onAddOnlineServer}
                >
                  Add customer service
                </Button>
                <Tooltip
                  placement="right"
                  title={this._renderListTitle}
                  overlayClassName={'qq-tooltip'}
                >
                  <a style={{ fontSize: 14, marginLeft: 10 }}>
                    <Icon type="question-circle-o" />
                  </a>
                </Tooltip>
              </div>
            )}
          </FormItem>
          <ServiceDiv>
            {onlineServerList &&
              onlineServerList.toJS().map((v, k) => {
                return (
                  <div className="service-list" key={v.key}>
                    <FormItem
                      {...formItemLayout}
                      label="Nickname"
                      required={true}
                    >
                      {getFieldDecorator(`${v.key}_customerServiceName`, {
                        initialValue: v.customerServiceName,
                        rules: [{ validator: this.checkCustomerAccountName }]
                      })(
                        <Input
                          placeholder="No more than 10 characters"
                          onChange={(e) =>
                            onSetOnlineServer({
                              index: k,
                              field: 'customerServiceName',
                              text: e.target.value
                            })
                          }
                        />
                      )}
                    </FormItem>

                    <FormItem
                      {...formItemLayout}
                      label="Account"
                      required={true}
                    >
                      {getFieldDecorator(`${v.key}_customerServiceAccount`, {
                        initialValue: v.customerServiceAccount,
                        rules: [{ validator: this.checkCustomerAccount }]
                      })(
                        <Input
                          placeholder="Please enter 5-11 digits"
                          onChange={(e) =>
                            onSetOnlineServer({
                              index: k,
                              field: 'customerServiceAccount',
                              text: e.target.value
                            })
                          }
                        />
                      )}
                    </FormItem>
                    <a onClick={() => onDelOnlineServer(k)} className="del">
                      Delete
                    </a>
                  </div>
                );
              })}
          </ServiceDiv>
        </Form>
      </Modal>
    );
  }

  /**
   * 启用时请选择生效终端
   * @param _rule
   * @param value
   * @param callback
   */
  _handleChange = async (e) => {
    const { onFormChange } = this.props.relaxProps;
    await onFormChange({ field: 'serverStatus', value: e.target.value });

    //是否校验
    let checkFlag = e.target.value == 1;
    if (checkFlag) {
      this.props.form.validateFields(['effectTerminal'], {
        force: true
      });
    } else {
      this.props.form.resetFields(['effectTerminal', 'setOneFlag']);
    }
  };

  /**
   * CheckBox 选择事件
   * 启用时请选择生效终端
   * @param checkedValues
   * @private
   */
  _onCheckedChange = (checkedValues) => {
    const { onFormChange } = this.props.relaxProps;
    onFormChange({ field: 'effectTerminal', value: checkedValues });
  };

  /**
   * 添加客服
   * @private
   */
  _onAddOnlineServer = () => {
    const { onAddOnlineServer } = this.props.relaxProps;
    onAddOnlineServer();
    this.props.form.resetFields(['setOneFlag']);
  };

  /**
   * 保存弹框编辑
   * @private
   */
  _handleOK = () => {
    const form = this.props.form;
    const {
      onSaveOnlineServer,
      onlineServer,
      onlineServerList
    } = this.props.relaxProps;
    if (onlineServer.get('serverStatus') == 0) {
      this.props.form.resetFields(['effectTerminal', 'setOneFlag']);
    } else {
      if (onlineServerList.size < 1) {
        this.props.form.setFields({
          setOneFlag: {
            value: '',
            errors: [
              new Error('Set up at least one customer service when enabled')
            ]
          }
        });
      }
    }

    form.validateFields(null, (errs, values) => {
      if (onlineServer.get('serverStatus') == 0) {
        this.props.form.resetFields(['effectTerminal', 'setOneFlag']);
      } else {
        if (values.effectTerminal.length < 1) {
          this.props.form.setFields({
            effectTerminal: {
              value: [],
              errors: [new Error('Please select valid terminal when enabling')]
            }
          });
        }
      }
      // console.log('--------------->', errs, values);
      //如果校验通过
      if (!errs) {
        onSaveOnlineServer();
      } else {
        this.setState({});
      }
    });
  };

  /**
   * 提示
   * @returns {any}
   * @private
   */
  _renderListTitle = () => {
    return (
      <div style={{ fontSize: 12, color: '#666' }}>
        <p>1.Add up to 10 customer service</p>
        <p>
          2.The added customer service QQ needs to open the QQ promotion
          function
        </p>
      </div>
    );
  };

  /**
   * 校验客服账号
   * @param _rule
   * @param value
   * @param callback
   */
  checkCustomerAccount = (_rule, value, callback) => {
    if (!value.trim()) {
      callback('Customer service account cannot be empty');
      return;
    } else {
      const regex = /^\d{5,11}$/;
      if (!regex.test(value)) {
        callback('Please enter 5-11 digits');
      } else {
        callback();
      }
    }
  };

  /**
   * 校验客服昵称
   * @param _rule
   * @param value
   * @param callback
   */
  checkCustomerAccountName = (_rule, value, callback) => {
    if (!value.trim()) {
      callback('Customer service nickname cannot be empty');
      return;
    } else {
      if (!ValidConst.noChar.test(value)) {
        callback(
          'Customer service nicknames only allow Chinese and English numbers'
        );
        return;
      }

      if (value.trim().length > 10) {
        callback('Customer service nickname cannot exceed 10 characters');
        return;
      }
    }
    callback();
  };
}
