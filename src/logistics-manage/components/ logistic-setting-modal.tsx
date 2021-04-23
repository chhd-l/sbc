import React, { Component } from 'react';
import { Row, Col, Form, Tabs, message, Input, Modal, Switch, Select } from 'antd';

import { FormattedMessage } from 'react-intl';
const FormItem = Form.Item;
const Option = Select.Option;
import * as webapi from '../webapi';
import { SelectGroup, Const, noop, RCi18n } from 'qmkit';
import List from "@/groupon-activity-list/component/list";
import { Relax } from 'plume2';
const { TabPane } = Tabs;

const formItemLayout = {
  labelCol: {
    span: 10
  },
  wrapperCol: {
    span: 14
  }
};
@Relax
class LogisticSettingModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }
  form;
  props: {
    visible: any;
    form: any;
    relaxProps?: {
      settingForm: any;
      settingModalVisible: boolean;
      saveSettingLoading: boolean;
      onSettingFormChange: Function;
      saveSetting: Function;
      close: Function;
      afterCloseSettingModal: Function;
      closeSettingModal: Function;
    };
  };

  static relaxProps = {
    saveSettingLoading: 'saveSettingLoading',
    settingForm: 'settingForm',
    settingModalVisible: 'settingModalVisible',
    closeSettingModal: noop,
    onSettingFormChange: noop,
    saveSetting: noop,
    afterCloseSettingModal: noop,
    close: noop
  };

  _save = () => {
    const { saveSetting } = this.props.relaxProps
    this.setState({
      count: 1
    })
    this.props.form.validateFields(null, async (errs, values) => {
      if (!errs) {
        saveSetting()
      }
    });
  }
  _cancel = () => {
    const { closeSettingModal } = this.props.relaxProps
    closeSettingModal()
  }
  _afterClose = () => {
    const { afterCloseSettingModal } = this.props.relaxProps
    this.props.form.resetFields()
    afterCloseSettingModal()
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const { onSettingFormChange,settingForm, settingModalVisible, saveSettingLoading, } = this.props.relaxProps
    console.log(settingForm.toJS(), 'settingForm--------');
    return (
      <Modal afterClose={this._afterClose}
             confirmLoading={saveSettingLoading}
             maskClosable={false}
             title={<FormattedMessage id="Setting.Editlogisticsetting"/>}
             visible={settingModalVisible}
             onOk={this._save} onCancel={() => this._cancel()}>
        <Form>
          <Form.Item {...formItemLayout} label={<FormattedMessage id="Setting.Headertoken" />}>
            {getFieldDecorator('headerToken', {
              rules: [
                {
                  required: true,
                  message: RCi18n({
                    id: 'Setting.Pleaseinputheadertoken'
                  }),
                },
              ],
            })(
              <Input placeholder={
                RCi18n({
                  id: 'Setting.Pleaseinputheadertoken'
                })}
                     onChange={(e) => {
                       onSettingFormChange({
                         field: 'headerToken',
                         value: e.target.value
                       })
                     }}
              />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label={<FormattedMessage id="Setting.Username" />}>
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: RCi18n({
                    id: 'Setting.Pleaseinputusername'
                  }),
                },
              ],
            })(
              <Input placeholder={
                RCi18n({
                  id: 'Setting.Pleaseinputusername'
                })
              }
                     onChange={(e)=>{
                       onSettingFormChange({
                         field: 'username',
                         value: e.target.value
                       })
                     }}
              />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label={<FormattedMessage id="Setting.Lang" />}>
            {getFieldDecorator('lang', {
              rules: [
                {
                  required: true,
                  message: RCi18n({
                    id: 'Setting.Pleaseinputlang'
                  }),
                },
              ],
            })(
              <Input placeholder={
                RCi18n({
                  id: 'Setting.Pleaseinputlang'
                })
              }
                     onChange={(e)=>{
                       onSettingFormChange({
                         field: 'lang',
                         value: e.target.value
                       })
                     }}
              />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label={<FormattedMessage id="Setting.Url" />}>
            {getFieldDecorator('url', {
              rules: [
                {
                  required: true,
                  message: RCi18n({
                    id: 'Setting.Pleaseinputurl'
                  }),
                },
              ],
            })(
              <Input placeholder={
                RCi18n({
                  id: 'Setting.Pleaseinputurl'
                })
              }
                     onChange={(e)=>{
                       onSettingFormChange({
                         field: 'companyCode',
                         value: e.target.value
                       })
                     }}
              />
            )}
          </Form.Item>

        </Form>
      </Modal>
    );
  }
}
export default Form.create()(LogisticSettingModal);
