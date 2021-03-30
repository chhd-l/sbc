import React, { Component } from 'react';
import { Relax, StoreProvider } from 'plume2';
import { fromJS, Map } from 'immutable';
import { AuthWrapper, BreadCrumb, Headline, noop, SelectGroup } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Form, Select, Input, Button, Table, Divider, message, Icon, Spin } from 'antd';
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
      loading: any;
      updateSeoForm: Function;
      getContent: Function;
    };
  };

  static relaxProps = {
    seoForm: 'seoForm',
    loading: 'loading',
    updateSeoForm: noop,
    getContent: noop
  };
  componentDidMount() {
    const { getContent } = this.props.relaxProps;
    getContent();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { seoForm, updateSeoForm, loading } = this.props.relaxProps;
    const seoObj = seoForm.toJS();
    return (
      <div>
        {loading ? (
          <div className="spin-container">
            <Spin indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />} />
          </div>
        ) : null}
        <Form {...formItemLayout} className="login-form">
          <Form.Item label={<FormattedMessage id="Setting.SiteMap" />}>
            {getFieldDecorator('content', {
              initialValue: seoObj.content
            })(
              <TextArea
                rows={12}
                onChange={(e) =>
                  updateSeoForm({
                    field: 'content',
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
