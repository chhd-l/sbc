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
export default class SeoSettingModal extends Component<any, any> {
  state: {};
  props: {
    relaxProps?: {
      seoModalVisible: any;
      currentStoreCateId: any;
      seoForm: any;
      setSeoModalVisible: Function;
      editSeo: Function;
    };
  };

  static relaxProps = {
    seoModalVisible: 'seoModalVisible',
    currentStoreCateId: 'currentStoreCateId',
    seoForm: 'seoForm',
    setSeoModalVisible: noop,
    editSeo: noop
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
    const { seoForm, setSeoModalVisible, editSeo, currentStoreCateId } = this.props.relaxProps;
    const seoObj = seoForm.toJS();
    const params = {
      type: 2,
      storeCateId: currentStoreCateId,
      metaDescriptionSource: seoObj.metaDescriptionSource,
      metaKeywordsSource: seoObj.metaKeywordsSource,
      titleSource: seoObj.titleSource
    };
    editSeo(params);
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
