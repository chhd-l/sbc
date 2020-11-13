import React, { Component } from 'react';
import { Relax, StoreProvider } from 'plume2';
import AppStore from '../store';
import { fromJS, Map } from 'immutable';
import { AuthWrapper, BreadCrumb, Headline, noop, SelectGroup } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Form, Select, Input, Button, Table, Divider, message, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { IMap } from '../../../typings/globalType';
const { TextArea } = Input;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 4,
    xs: { span: 4 },
    sm: { span: 4 }
  },
  wrapperCol: {
    span: 10,
    xs: { span: 10 },
    sm: { span: 10 }
  }
};
@Relax
export default class seoSettingForm extends Component<any, any> {
  _rejectForm;

  WrapperForm: any;

  state: {
    operation: 'new'; //edit
    isEdit: false;
  };
  props: {
    form: any;
    seoForm: IMap;
    relaxProps?: {
      seoForm: 'seoForm';
      updateSeoForm: Function;
    };
  };

  static relaxProps = {
    updateSeoForm: noop
  };
  componentDidMount() {}

  render() {
    const { getFieldDecorator } = this.props.form;
    const { seoForm, updateSeoForm } = this.props.relaxProps;
    debugger;
    return (
      <Form {...formItemLayout} className="login-form">
        {/*<Form.Item>*/}
        {/*  {getFieldDecorator('title', {*/}
        {/*    rules: [{ required: true, message: 'Please input your username!' }],*/}
        {/*  })*/}
        {/*  (*/}
        {/*    <Input*/}
        {/*      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}*/}
        {/*      placeholder="Username"*/}
        {/*    />,*/}
        {/*  )}*/}
        {/*</Form.Item>*/}
        <Form.Item label="Title">
          {getFieldDecorator('title', {
            initialValue: '{name}-Royal Canin}'
          })(
            <Input
              onChange={(e) =>
                updateSeoForm({
                  field: 'title',
                  value: e.target.value
                })
              }
            />
          )}
        </Form.Item>
        <Form.Item label="Meta Keywords">
          {getFieldDecorator('metaKeywords', {
            initialValue: '{name}, {subtitle}, {sales category}, {tagging}'
          })(
            <TextArea
              rows={4}
              onChange={(e) =>
                updateSeoForm({
                  field: 'metaKeywords',
                  value: e.target.value
                })
              }
            />
          )}
        </Form.Item>
        <Form.Item label="Meta Description">
          {getFieldDecorator('description', {
            initialValue: '{description}'
          })(
            <TextArea
              rows={4}
              onChange={(e) =>
                updateSeoForm({
                  field: 'description',
                  value: e.target.value
                })
              }
            />
          )}
        </Form.Item>
      </Form>
    );
  }
}
