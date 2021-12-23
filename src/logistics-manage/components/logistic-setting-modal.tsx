import React, { Component } from 'react';
import { Row, Col, Form, Tabs, message, Input, Modal, Switch, Select } from 'antd';

import { FormattedMessage } from 'react-intl';
import LogisticSettingForm from './logistic-setting-form';

const FormItem = Form.Item;
const Option = Select.Option;
import * as webapi from '../webapi';
import { SelectGroup, Const, noop, RCi18n } from 'qmkit';
import List from '@/groupon-activity-list/component/list';
import { Relax } from 'plume2';
import { WrappedFormUtils } from 'antd/lib/form/Form';
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
  WrapperForm: any;
  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(LogisticSettingForm);
  }
  _form;
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
    const form = this._form as WrappedFormUtils;
    const { saveSetting } = this.props.relaxProps;
    form.validateFields((errs) => {
      if (!errs) {
        saveSetting();
      }
    });
  };
  _cancel = () => {
    const { closeSettingModal } = this.props.relaxProps;
    closeSettingModal();
  };
  _afterClose = () => {
    const form = this._form as WrappedFormUtils;
    const { afterCloseSettingModal } = this.props.relaxProps;
    form.resetFields();
    afterCloseSettingModal();
  };

  render() {
    const { onSettingFormChange, settingForm, settingModalVisible, saveSettingLoading } =
      this.props.relaxProps;
    const WrapperForm = this.WrapperForm;
    return (
      <Modal
        afterClose={this._afterClose}
        confirmLoading={saveSettingLoading}
        maskClosable={false}
        title={<FormattedMessage id="Setting.Editlogisticsetting" />}
        visible={settingModalVisible}
        onOk={() => this._save()}
        onCancel={() => this._cancel()}
      >
        <WrapperForm ref={(form) => (this._form = form)} relaxProps={this.props.relaxProps} />
      </Modal>
    );
  }
}
export default LogisticSettingModal;
