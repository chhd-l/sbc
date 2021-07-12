import React, {Component} from 'react';
import {Relax, StoreProvider} from 'plume2';
import {fromJS, Map} from 'immutable';
import {AuthWrapper, BreadCrumb, Headline, noop, SelectGroup, ValidConst} from 'qmkit';
import {FormattedMessage} from 'react-intl';
import {Form, Select, Spin, Input, Switch, DatePicker, Button, Table, Divider, message, Icon} from 'antd';
import {Link} from 'react-router-dom';
import {IMap} from '../../../typings/globalType';
import {settings} from 'cluster';
import moment from 'moment';

const {TextArea} = Input;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;

const formItemLayout = {
  labelCol: {
    span: 6,
    xs: {span: 6},
    sm: {span: 6}
  },
  wrapperCol: {
    span: 10,
    xs: {span: 10},
    sm: {span: 10}
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
    const {getFieldDecorator, setFieldsValue} = this.props.form;
    const {seoForm, updateSeoForm, loading} = this.props.relaxProps;
    const seoObj = seoForm.toJS();
    setFieldsValue({
      title: seoObj.title,
      metaKeywords: seoObj.metaKeywords,
      description: seoObj.description,
      priorityFlag: seoObj.priorityFlag,
      priorityTime: seoObj.priorityTime,
    });
    return (
      <div>
        {loading ? (
          <div className="spin-container">
            <Spin indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{width: '90px', height: '90px'}} alt=""/>}/>
          </div>
        ) : null}
        <div className="turn-type flex-start">
          <Switch checkedChildren="On" unCheckedChildren="off" checked={seoObj.priorityFlag != 0} size='default' onChange={(e) =>
            updateSeoForm({
              field: 'priorityFlag',
              value: e == true || null ?1:0
            })
          }/>
          <p>{seoObj.priorityFlag === 0 ? (<FormattedMessage id="Setting.turnText1"/>):(<FormattedMessage id="Setting.turnText2"/>)}</p>
        </div>

        <Form {...formItemLayout} className="login-form">
          {
            seoObj.priorityFlag == 1 ? (
              <Form.Item required label={<FormattedMessage id="Setting.Startandendtime"/>}>
                {getFieldDecorator('priorityTime', {
                  initialValue: seoObj.priorityTime
                })(
                  <RangePicker  onChange={(e) =>
                    updateSeoForm({
                      field: 'priorityTime',
                      value: e
                    })
                  }/>
                )}
              </Form.Item>) : <></>
          }
          <Form.Item label={<FormattedMessage id="Setting.Title"/>}>
            {getFieldDecorator('title', {
              initialValue: seoObj.title
            })(
              <Input
                placeholder="Meta title for the page"
                onChange={(e) =>
                  updateSeoForm({
                    field: 'title',
                    value: e.target.value
                  })
                }
              />
            )}
          </Form.Item>
          <Form.Item label={<FormattedMessage id="Setting.MetaKeywords"/>}>
            {getFieldDecorator('metaKeywords', {
              initialValue: seoObj.metaKeywords
            })(
              <TextArea
                placeholder="Meta keywords for the page"
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
          <Form.Item label={<FormattedMessage id="Setting.MetaDescription"/>}>
            {getFieldDecorator('description', {
              initialValue: seoObj.description
            })(
              <TextArea
                rows={4}
                placeholder="Meta description for the page"
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
