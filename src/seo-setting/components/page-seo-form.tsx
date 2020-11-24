import React, { Component } from 'react';
import { Relax, StoreProvider } from 'plume2';
import { fromJS, Map } from 'immutable';
import { AuthWrapper, BreadCrumb, Headline, noop, SelectGroup } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Form, Select, Spin, Input, Button, Table, Divider, message, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { IMap } from '../../../typings/globalType';
const { TextArea } = Input;
const FormItem = Form.Item;

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
export default class PageSettingForm extends Component<any, any> {
  _rejectForm;

  WrapperForm: any;

  state: {};
  props: {
    form: any;
    relaxProps?: {
      seoForm: any;
      loading: any;
      updateSeoForm: Function;
      getSeo: Function;
    };
  };

  static relaxProps = {
    seoForm: 'seoForm',
    loading: 'loading',
    updateSeoForm: noop,
    getSeo: noop
  };
  componentDidMount() {}

  render() {
    const { getFieldDecorator } = this.props.form;
    const { seoForm, updateSeoForm, loading } = this.props.relaxProps;
    const seoObj = seoForm.toJS();

    setTimeout(() => {
      console.log(seoObj, 'seoObj--------------');
    });
    return (
      <div>
        {loading ? (
          <div className="spin-container">
            <Spin />
          </div>
        ) : null}
        <Form {...formItemLayout} className="login-form">
          <Form.Item label="Title">
            {getFieldDecorator('title', {
              initialValue: seoObj.title
            })(
              <Input
                placeholder="Meta title for the site"
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
              initialValue: seoObj.metaKeywords
            })(
              <TextArea
                placeholder="Meta keywords for the site"
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
              initialValue: seoObj.description
            })(
              <TextArea
                rows={4}
                placeholder="Meta description for the site"
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
      </div>
    );
  }
}