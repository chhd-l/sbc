import React, { Component } from 'react';
import { Relax, StoreProvider } from 'plume2';
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
    span: 6,
    xs: { span: 6 },
    sm: { span: 4 }
  },
  wrapperCol: {
    span: 10,
    xs: { span: 10 },
    sm: { span: 12 }
  }
};

@Relax
export default class SeoSettingForm extends Component<any, any> {
  _rejectForm;

  WrapperForm: any;

  state: {};
  props: {
    form: any;
    relaxProps?: {
      seoForm: any;
      updateSeoForm: Function;
    };
  };

  static relaxProps = {
    seoForm: 'seoForm',
    updateSeoForm: noop
  };
  componentDidMount() {}

  render() {
    const { getFieldDecorator } = this.props.form;
    const { seoForm, updateSeoForm } = this.props.relaxProps;
    const seoObj = seoForm.toJS();
    return (
      <Form {...formItemLayout} className="login-form">
        <Form.Item label="Site Map">
          {getFieldDecorator('title', {
            initialValue: seoObj.title
          })(
            <TextArea
              rows={12}
              onChange={(e) =>
                updateSeoForm({
                  field: 'title',
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
