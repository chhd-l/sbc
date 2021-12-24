import React, { Component } from 'react';
import { Row, Col, Form, Tabs, message, Input, Modal, Switch, Select } from 'antd';

import { FormattedMessage } from 'react-intl';
const FormItem = Form.Item;
const Option = Select.Option;
import * as webapi from '../webapi';
import { SelectGroup, Const, noop, RCi18n } from 'qmkit';
import List from '@/groupon-activity-list/component/list';
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
  
class LogisticSettingForm extends Component<any, any> {
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
  render() {
    const { getFieldDecorator } = this.props.form;

    const { onSettingFormChange,settingForm, settingModalVisible, saveSettingLoading, } = this.props.relaxProps
    return (
      <Form>
        <Form.Item {...formItemLayout} label={<FormattedMessage id="Setting.Headertoken" />}>
          {getFieldDecorator('headerToken', {
            initialValue: settingForm.get('headerToken'),
            rules: [
              {
                required: true,
                message: RCi18n({
                  id: 'Setting.Pleaseinputheadertoken'
                })
              }
            ]
          })(
            <Input
              placeholder={RCi18n({
                id: 'Setting.Pleaseinputheadertoken'
              })}
              onChange={(e) => {
                onSettingFormChange({
                  field: 'headerToken',
                  value: e.target.value
                });
              }}
            />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label={<FormattedMessage id="Setting.Username" />}>
          {getFieldDecorator('userName', {
            initialValue: settingForm.get('userName'),
            rules: [
              {
                required: true,
                message: RCi18n({
                  id: 'Setting.Pleaseinputusername'
                })
              }
            ]
          })(
            <Input
              placeholder={RCi18n({
                id: 'Setting.Pleaseinputusername'
              })}
              onChange={(e) => {
                onSettingFormChange({
                  field: 'userName',
                  value: e.target.value
                });
              }}
            />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label={<FormattedMessage id="Setting.Lang" />}>
              {getFieldDecorator('lang', {
                 initialValue:settingForm.get('lang')||'',
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
          {getFieldDecorator('outUrl', {
            initialValue: settingForm.get('outUrl'),
            rules: [
              {
                required: true,
                message: RCi18n({
                  id: 'Setting.Pleaseinputurl'
                })
              }
            ]
          })(
            <Input
              placeholder={RCi18n({
                id: 'Setting.Pleaseinputurl'
              })}
              onChange={(e) => {
                onSettingFormChange({
                  field: 'outUrl',
                  value: e.target.value
                });
              }}
            />
          )}
        </Form.Item>
      </Form>
    );
  }
}
export default LogisticSettingForm;
