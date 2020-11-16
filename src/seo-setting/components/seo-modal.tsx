import React, { Component } from 'react';
import { Relax, StoreProvider } from 'plume2';
import { AuthWrapper, BreadCrumb, Headline, noop, SelectGroup } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Form, Select, Input, Button, Table, Divider, message, Modal } from 'antd';
import { Link } from 'react-router-dom';
import SeoSettingForm from './seo-setting-form';
const FormItem = Form.Item;
const _SeoSettingForm = Form.create({})(SeoSettingForm);

@Relax
export default class SeoModal extends Component<any, any> {
  state: {};
  props: {
    relaxProps?: {
      seoModalVisible: any;
      seoForm: any;
      setSeoModalVisible: Function;
    };
  };

  static relaxProps = {
    seoModalVisible: 'seoModalVisible',
    seoForm: 'seoForm',
    setSeoModalVisible: noop
  };
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  _handleModelCancel = () => {
    const { setSeoModalVisible } = this.props.relaxProps;
    setSeoModalVisible(false);
  };
  _handleSubmit = () => {
    const { seoForm, setSeoModalVisible } = this.props.relaxProps;
    const seoObj = seoForm.toJS();
    console.log(seoObj, '传递的参数------------');
    setSeoModalVisible(false);
  };
  uploadImage() {}
  render() {
    const { seoModalVisible, setSeoModalVisible } = this.props.relaxProps;
    return (
      <Modal
        maskClosable={false}
        title={<FormattedMessage id="seoSetting" />}
        visible={seoModalVisible}
        width={920}
        // confirmLoading={true}
        onCancel={this._handleModelCancel}
        onOk={this._handleSubmit}
      >
        <AuthWrapper functionName="fOrderList001">
          <_SeoSettingForm />
        </AuthWrapper>
      </Modal>
    );
  }
}
