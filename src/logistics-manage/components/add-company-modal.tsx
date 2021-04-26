import React, { Component } from 'react';
import { Row, Col, Form, Tabs, message, Input, Modal, Switch, Select } from 'antd';

import { FormattedMessage } from 'react-intl';
const FormItem = Form.Item;
const Option = Select.Option;
import * as webapi from '../webapi';
import { SelectGroup, Const, noop, RCi18n } from 'qmkit';
import List from "@/groupon-activity-list/component/list";
import { Relax } from 'plume2';
const { TabPane } = Tabs;

const formItemLayout = {
  labelCol: {
    span: 10
  },
  wrapperCol: {
    span: 14
  }
};
@Relax
class AddCompanyModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }
  form;
  props: {
    visible: any;
    form: any;
    relaxProps?: {
      allCompanyList: any
      companyForm: any;
      modalVisible: boolean;
      saveLoading: boolean;
      onFormChange: Function;
      save: Function;
      close: Function;
      afterClose: Function;
    };
  };

  static relaxProps = {
    allCompanyList: 'allCompanyList',
    saveLoading: 'saveLoading',
    companyForm: 'companyForm',
    modalVisible: 'modalVisible',
    onFormChange: noop,
    save: noop,
    afterClose: noop,
    close: noop
  };

  _save = () => {
    const { save } = this.props.relaxProps
    this.setState({
      count: 1
    })
    this.props.form.validateFields(null, async (errs, values) => {
      if (!errs) {
        save()
      }
    });
  }
  _cancel = () => {
    const { close } = this.props.relaxProps
    close()
  }
  _afterClose = () => {
    const { afterClose } = this.props.relaxProps
    this.props.form.resetFields()
    afterClose()
  }

  render() {
    const { getFieldDecorator, } = this.props.form;

    const { onFormChange, companyForm, modalVisible, saveLoading, allCompanyList } = this.props.relaxProps
    console.log(companyForm.toJS(), 'companyForm--------', allCompanyList);
    return (
      <Modal afterClose={this._afterClose}
        confirmLoading={saveLoading}
        maskClosable={false}
        title={companyForm && companyForm.get('id') ? <FormattedMessage id="Setting.Editlogisticcompany" /> : <FormattedMessage id="Setting.Addlogisticcompany" />}
        visible={modalVisible}
        onOk={this._save} onCancel={() => this._cancel()}>
        <Form>
          <Form.Item {...formItemLayout} label={<FormattedMessage id="Setting.LogisticCompanyname" />}>
            {getFieldDecorator('expressCompanyId', {
              rules: [
                {
                  required: true,
                  message: RCi18n({
                    id: 'Setting.Pleaseinputlogisticcompanyname'
                  }),
                },
              ],
              onChange: (e) => {
                onFormChange({
                  field: 'expressCompanyId',
                  value: e
                })
              }
            })(
              <Select placeholder={
                RCi18n({
                  id: 'Setting.Pleaseinputlogisticcompanyname'
                })}
              >
                {allCompanyList && allCompanyList.length > 0 &&
                  allCompanyList.map(item => {
                    return <Option value={item.expressCompanyId}  >{item.expressName}</Option>
                  })
                }
              </Select>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label={<FormattedMessage id="Setting.LogisticCompanycode" />}>
            {getFieldDecorator('companyCode', {
              rules: [
                {
                  required: true,
                  message: RCi18n({
                    id: 'Setting.Pleaseinputlogisticcompanycode'
                  }),
                },
              ],
              onChange: (e) => {
                onFormChange({
                  field: 'storeCompanyCode',
                  value: e.target.value
                })
              }
            })(
              <Input placeholder={
                RCi18n({
                  id: 'Setting.Pleaseinputlogisticcompanycode'
                })
              }

              />
            )}
          </Form.Item>
          <FormItem {...formItemLayout} label={<FormattedMessage id="Setting.Logisticcompanystatus" />}>
            {getFieldDecorator('status', {
              initialValue: true,
              onChange: (value) => {
                onFormChange({
                  field: 'status',
                  value: value
                })

              }
            })(
              <Switch defaultChecked={companyForm.get('status')} checked={companyForm.get('status')}

              />)}
          </FormItem>

        </Form>
      </Modal>
    );
  }
}
export default Form.create()(AddCompanyModal);
