import React, { Component } from 'react';
import { Relax, StoreProvider } from 'plume2';
import { AuthWrapper, BreadCrumb, Headline, noop, SelectGroup } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Form, Select, Input, Button, Table, Divider, message, Modal } from 'antd';
import { Link } from 'react-router-dom';
import PageSettingForm from './page-seo-form';
const FormItem = Form.Item;
const _PageSettingForm = Form.create({})(PageSettingForm);

@Relax
export default class SeoModal extends Component<any, any> {
  state: {};
  props: {
    relaxProps?: {
      currentPage: any;
      seoModalVisible: any;
      seoForm: any;
      setSeoModalVisible: Function;
      editSeo: Function;
      clear: Function;
    };
  };

  static relaxProps = {
    seoModalVisible: 'seoModalVisible',
    seoForm: 'seoForm',
    currentPage: 'currentPage',
    setSeoModalVisible: noop,
    editSeo: noop,
    clear: noop
  };
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  _handleModelCancel = () => {
    const { setSeoModalVisible, clear } = this.props.relaxProps;
    debugger;
    clear();
    setSeoModalVisible(false);
  };
  _handleSubmit = () => {
    const { seoForm, currentPage, setSeoModalVisible, editSeo } = this.props.relaxProps;
    const seoObj = seoForm.toJS();
    const params = {
      type: 3,
      metaDescriptionSource: seoObj.description,
      metaKeywordsSource: seoObj.metaKeywords,
      titleSource: seoObj.title,
      pageName: currentPage
    };
    editSeo(params);
  };
  uploadImage() {}
  render() {
    const { seoModalVisible, currentPage, setSeoModalVisible } = this.props.relaxProps;
    return (
      <Modal
        maskClosable={false}
        title={`${currentPage} SEO Setting`}
        visible={seoModalVisible}
        width={920}
        // confirmLoading={true}
        onCancel={this._handleModelCancel}
        onOk={this._handleSubmit}
      >
        <AuthWrapper functionName="fOrderList001">
          <_PageSettingForm />
        </AuthWrapper>
      </Modal>
    );
  }
}
