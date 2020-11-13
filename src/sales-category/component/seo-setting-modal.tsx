import React, { Component } from 'react';
import { Relax, StoreProvider } from 'plume2';
import AppStore from '../store';
import { AuthWrapper, BreadCrumb, Headline, noop, SelectGroup } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Form, Select, Input, Button, Table, Divider, message, Modal } from 'antd';
import { Link } from 'react-router-dom';
const FormItem = Form.Item;

@StoreProvider(AppStore, { debug: __DEV__ })
export default class SeoSettingModal extends Component<any, any> {
  store: AppStore;
  state: {};

  componentDidMount() {}
  _handleModelCancel() {}
  _handleSubmit() {}
  uploadImage() {}
  render() {
    return (
      <Modal
        maskClosable={false}
        title={<FormattedMessage id="upload" />}
        visible={this.props.seoModalVisible}
        width={920}
        // confirmLoading={true}
        onCancel={this._handleModelCancel}
        onOk={this._handleSubmit}
      >
        111111111111
        {/*<AuthWrapper functionName="fOrderList001">*/}
        {/*  <UploadImageModalForm />*/}
        {/*</AuthWrapper>*/}
      </Modal>
    );
  }
}
