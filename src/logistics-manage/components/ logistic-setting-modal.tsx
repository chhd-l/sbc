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
      onFormChange: Function;
      save: Function;
      close: Function;
      afterClose: Function;
    };
  };

  static relaxProps = {
    saveSettingLoading: 'saveSettingLoading',
    settingForm: 'settingForm',
    settingModalVisible: 'settingModalVisible',
    onFormChange: noop,
    save: noop,
    afterClose: noop,
    close: noop
  };

  _save = () => {
    const { save } = this.props.relaxProps
    this.setState({
      count: 1
    })
    this.props.form.validateFields(null, async (errs, values) => {
      if (!errs) {
        save()
      }
    });
  }
  _cancel = () => {
    const { close } = this.props.relaxProps
    close()
  }
  _afterClose = () => {
    const { afterClose } = this.props.relaxProps
    this.props.form.resetFields()
    afterClose()
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const { onFormChange,settingForm, settingModalVisible, saveSettingLoading, } = this.props.relaxProps
    console.log(settingForm.toJS(), 'settingForm--------');
    return (
      <Modal afterClose={this._afterClose}
             confirmLoading={saveSettingLoading}
             maskClosable={false}
             title={settingForm && settingForm.get('id') ? <FormattedMessage id="Setting.Editlogisticcompany"/>: <FormattedMessage id="Setting.Addlogisticcompany"/>}
             visible={settingModalVisible}
             onOk={this._save} onCancel={() => this._cancel()}>
        <Form>
          <Form.Item {...formItemLayout} label={<FormattedMessage id="Setting.LogisticCompanyname" />}>
            {getFieldDecorator('companyName', {
              rules: [
                {
                  required: true,
                  message: RCi18n({
                    id: 'Setting.Pleaseinputlogisticcompanyname'
                  }),
                },
              ],
            })(
              <Input placeholder={
                RCi18n({
                  id: 'Setting.Pleaseinputlogisticcompanyname'
                })}
                     onChange={(e) => {
                       onFormChange({
                         field: 'companyName',
                         value: e.target.value
                       })
                     }}
              />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label={<FormattedMessage id="Setting.LogisticCompanycode" />}>
            {getFieldDecorator('companyCode', {
              rules: [
                {
                  required: true,
                  message: RCi18n({
                    id: 'Setting.Pleaseinputlogisticcompanycode'
                  }),
                },
              ],
            })(
              <Input placeholder={
                RCi18n({
                  id: 'Setting.Pleaseinputlogisticcompanycode'
                })
              }
                     onChange={(e)=>{
                       onFormChange({
                         field: 'companyCode',
                         value: e.target.value
                       })
                     }}
              />
            )}
          </Form.Item>
          <FormItem {...formItemLayout} label={<FormattedMessage id="Setting.Logisticcompanystatus" />}>
            {getFieldDecorator('status', {
              initialValue: true
            })(
              <Switch defaultChecked={settingForm.get('status') == 1} checked={settingForm.get('status')}
                      onChange={(value)=> {
                        onFormChange({
                          field: 'status',
                          value: value ? 1 : 0
                        })

                      }}
              />)}
          </FormItem>

        </Form>
      </Modal>
    );
  }
}
export default Form.create()(LogisticSettingModal);
