import React from 'react';
import { Form, Input, InputNumber, Button, Select, message } from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from '../webapi';
import { Const, history, RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';
const FormItem = Form.Item;
const Option = Select.Option;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

class PrescriberTypeForm extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      clinicTypeForm: {
        clinicTypeId: '',
        clinicTypeName: '',
        clinicTypeDesc: ''
      }
    };
    this.getDetail = this.getDetail.bind(this);

    if (this.props.clinicId) {
      this.getDetail(this.props.clinicId);
    }
  }
  getDetail = async (id) => {
    const { res } = await webapi.clinicsDictionaryDetails({
      id: id
    });
    if (res.code === Const.SUCCESS_CODE) {
      let clinicTypeForm = {
        clinicTypeId: res.context.id,
        clinicTypeName: res.context.name,
        clinicTypeDesc: res.context.description
      };
      this.setState({
        clinicTypeForm: clinicTypeForm
      });
      this.props.form.setFieldsValue({
        clinicTypeId: res.context.id,
        clinicTypeName: res.context.name,
        clinicTypeDesc: res.context.description
      });
    }
  };
  onFormChange = ({ field, value }) => {
    let data = this.state.clinicTypeForm;
    data[field] = value;
    this.setState({
      clinicTypeForm: data
    });
  };
  onCreate = async () => {
    const clinicTypeForm = this.state.clinicTypeForm;
    let params = {
      id: clinicTypeForm.clinicTypeId,
      description: clinicTypeForm.clinicTypeDesc,
      name: clinicTypeForm.clinicTypeName,
      type: 'clinicType',
      value: clinicTypeForm.clinicTypeName,
      valueEn: clinicTypeForm.clinicTypeName,
      priority: 0,
      delFlag: 0
    };
    this.setState({ loading: true });
    const { res } = await webapi.addClinicsDictionary(params);
    if (res.code === Const.SUCCESS_CODE) {
      message.success(RCi18n({id:"Prescriber.OperateSuccessfully"}));
      history.push('/prescriber-type');
    } else {
      this.setState({ loading: false });
    }
  };
  onUpdate = async () => {
    const clinicTypeForm = this.state.clinicTypeForm;
    let params = {
      id: clinicTypeForm.clinicTypeId,
      description: clinicTypeForm.clinicTypeDesc,
      name: clinicTypeForm.clinicTypeName,
      type: 'clinicType',
      value: clinicTypeForm.clinicTypeName,
      valueEn: clinicTypeForm.clinicTypeName,
      priority: 0,
      delFlag: 0
    };
    this.setState({ loading: true });
    const { res } = await webapi.updateClinicsDictionary(params);
    if (res.code === Const.SUCCESS_CODE) {
      message.success(RCi18n({id:"Prescriber.OperateSuccessfully"}));
      history.push('/prescriber-type');
    } else {
      this.setState({ loading: false });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        if (this.props.pageType === 'create') {
          this.onCreate();
        }
        if (this.props.pageType === 'edit') {
          this.onUpdate();
        }
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form {...layout} style={{ width: '600px' }} onSubmit={this.handleSubmit}>
        <FormItem label={<FormattedMessage id="Prescriber.PrescriberTypeName" />}>
          {getFieldDecorator('clinicTypeName', {
            rules: [
              { required: true, message: <FormattedMessage id="Prescriber.PleaseInputPrescriberTypeName" /> },
              {
                max: 50,
                message: <FormattedMessage id="Prescriber.ExceedMaximumLength" />
              }
            ]
          })(
            <Input
              onChange={(e) => {
                const value = (e.target as any).value;
                this.onFormChange({
                  field: 'clinicTypeName',
                  value
                });
              }}
            />
          )}
        </FormItem>
        <FormItem label={<FormattedMessage id="Prescriber.PrescriberTypeDescription" />}>
          {getFieldDecorator('clinicTypeDesc', {
            rules: [
              {
                required: true,
                message: <FormattedMessage id="Prescriber.PleaseInputPrescriberTypeName" />
              },
              {
                max: 200,
                message: <FormattedMessage id="Prescriber.ExceedMaximumLength" />
              }
            ]
          })(
            <Input
              onChange={(e) => {
                const value = (e.target as any).value;
                this.onFormChange({
                  field: 'clinicTypeDesc',
                  value
                });
              }}
            />
          )}
        </FormItem>
        <FormItem wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          {this.props.pageType === 'edit' ? (
            <Button loading={this.state.loading} type="primary" htmlType="submit">
              <FormattedMessage id="Prescriber.Update" />
            </Button>
          ) : (
            <Button loading={this.state.loading} type="primary" htmlType="submit">
              <FormattedMessage id="Prescriber.Create" />
            </Button>
          )}
          <Button style={{ marginLeft: '20px' }}>
            <Link to="/prescriber-type">
              <FormattedMessage id="Prescriber.BackToList" />
            </Link>
          </Button>
        </FormItem>
      </Form>
    );
  }
}
export default Form.create()(PrescriberTypeForm);
