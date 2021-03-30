import React, { Component } from 'react';
import { Relax, StoreProvider } from 'plume2';
import { AuthWrapper, BreadCrumb, Headline, noop, SelectGroup } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Form, Select, Input, Button, Table, Divider, message, Modal, Spin } from 'antd';
import { Link } from 'react-router-dom';
const FormItem = Form.Item;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    span: 6,
    xs: { span: 6 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 10,
    xs: { span: 10 },
    sm: { span: 10 }
  }
};
@Relax
export default class SeoSettingModal extends Component<any, any> {
  state: {};
  props: {
    form: any;
    relaxProps?: {
      seoModalVisible: any;
      currentStoreCateId: any;
      setSeoModalVisible: Function;
      editSeo: Function;
      clear: Function;
      seoForm: any;
      loading: any;
      updateSeoForm: Function;
    };
  };

  static relaxProps = {
    seoModalVisible: 'seoModalVisible',
    currentStoreCateId: 'currentStoreCateId',
    seoForm: 'seoForm',
    loading: 'loading',
    updateSeoForm: noop,
    setSeoModalVisible: noop,
    editSeo: noop,
    clear: noop
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
      titleSource: seoObj.titleSource,
      headingTag: seoObj.headingTag
    };
    editSeo(params);
  };
  uploadImage() {}
  _afterClose = () => {
    const { clear } = this.props.relaxProps;
    clear();
    this.props.form.resetFields();
  };
  render() {
    // const { seoModalVisible, setSeoModalVisible } = this.props.relaxProps;
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const { seoForm, updateSeoForm, loading, seoModalVisible } = this.props.relaxProps;
    const seoObj = seoForm.toJS();
    const loginInfo = JSON.parse(sessionStorage.getItem('s2b-supplier@login'));
    setFieldsValue({
      titleSource: seoObj.titleSource,
      metaKeywordsSource: seoObj.metaKeywordsSource,
      metaDescriptionSource: seoObj.metaDescriptionSource
    });
    const arr = [
      { name: 'H1', id: 'H1' },
      { name: 'H2', id: 'H2' },
      { name: 'H3', id: 'H3' },
      { name: 'H4', id: 'H4' },
      { name: 'H5', id: 'H5' }
    ];
    return (
      <Modal
        maskClosable={false}
        title={<FormattedMessage id="Product.seoSetting" />}
        visible={seoModalVisible}
        width={920}
        // confirmLoading={true}
        onCancel={this._handleModelCancel}
        onOk={this._handleSubmit}
        afterClose={this._afterClose}
      >
        <div>
          {loading ? (
            <div className="spin-container">
              <Spin indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />} />
            </div>
          ) : null}
          <Form {...formItemLayout} className="login-form">
            <Form.Item label="Title">
              {getFieldDecorator('titleSource', {
                initialValue: seoObj.titleSource
              })(
                <Input
                  onChange={(e) =>
                    updateSeoForm({
                      field: 'titleSource',
                      value: e.target.value
                    })
                  }
                />
              )}
            </Form.Item>
            {/*<Form.Item label="Heading Tag">*/}
            {/*  {getFieldDecorator('headingTag', {*/}
            {/*    initialValue: seoObj.headingTag*/}
            {/*  })(*/}
            {/*    <Select*/}
            {/*      onChange={(e) =>*/}
            {/*        updateSeoForm({*/}
            {/*          field: 'headingTag',*/}
            {/*          value: e*/}
            {/*        })*/}
            {/*      }*/}
            {/*      value={seoObj.headingTag}*/}
            {/*    >*/}
            {/*      {arr.map((item) => (*/}
            {/*        <option key={item.id} value={item.id}>*/}
            {/*          {item.name}*/}
            {/*        </option>*/}
            {/*      ))}*/}
            {/*    </Select>*/}
            {/*  )}*/}
            {/*</Form.Item>*/}

            {loginInfo && loginInfo.storeId !== 123457910 && (
              <>
                <Form.Item label="Meta Keywords">
                  {getFieldDecorator('metaKeywordsSource', {
                    initialValue: seoObj.metaKeywordsSource
                  })(
                    <TextArea
                      rows={4}
                      onChange={(e) =>
                        updateSeoForm({
                          field: 'metaKeywordsSource',
                          value: e.target.value
                        })
                      }
                    />
                  )}
                </Form.Item>
                <Form.Item label="Meta Description">
                  {getFieldDecorator('metaDescriptionSource', {
                    initialValue: seoObj.metaDescriptionSource
                  })(
                    <TextArea
                      rows={4}
                      onChange={(e) =>
                        updateSeoForm({
                          field: 'metaDescriptionSource',
                          value: e.target.value
                        })
                      }
                    />
                  )}
                </Form.Item>
                <Form.Item label="H1">
                  {getFieldDecorator('h1', {
                    initialValue: '{ description title }'
                  })(<Input disabled />)}
                </Form.Item>
                <Form.Item label="H2">
                  {getFieldDecorator('h2', {
                    initialValue: '{ product name }'
                  })(<Input disabled />)}
                </Form.Item>
              </>
            )}
          </Form>
        </div>
      </Modal>
    );
  }
}
