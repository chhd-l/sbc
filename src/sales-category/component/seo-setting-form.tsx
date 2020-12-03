import React, { Component } from 'react';
import { Relax, StoreProvider } from 'plume2';
import { fromJS, Map } from 'immutable';
import { AuthWrapper, BreadCrumb, Headline, noop, SelectGroup } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Form, Select, Input, Spin, Button, Table, Divider, message, Icon } from 'antd';
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
    };
  };

  static relaxProps = {
    seoForm: 'seoForm',
    loading: 'loading',
    updateSeoForm: noop
  };
  componentDidMount() {}

  render() {
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const { seoForm, updateSeoForm, loading } = this.props.relaxProps;
    const seoObj = seoForm.toJS();
    setFieldsValue({
      titleSource: seoObj.titleSource,
      metaKeywordsSource: seoObj.metaKeywordsSource,
      metaDescriptionSource: seoObj.metaDescriptionSource
    });
    return (
      <div>
        {loading ? (
          <div className="spin-container">
            <Spin indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px',height: '90px' }} alt="" />}/>
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
        </Form>
      </div>
    );
  }
}
