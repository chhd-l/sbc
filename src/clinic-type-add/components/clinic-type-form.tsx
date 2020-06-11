import React from 'react';
import { Form, Input, InputNumber, Button, Select, message } from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './../webapi';

const FormItem = Form.Item;
const Option = Select.Option;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

class ClinicForm extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
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
    if (res.code === 'K-000000') {
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
    } else {
      message.error('Unsuccessful');
    }
    console.log(this.state.clinicTypeForm);
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
      storeId: 0
    };

    const { res } = await webapi.addClinicsDictionary(params);
    if (res.code === 'K-000000') {
      message.success('Successful');
    } else {
      message.error('Unsuccessful');
    }
  };
  onUpdate = async () => {
    debugger;
    const clinicTypeForm = this.state.clinicTypeForm;
    let params = {
      id: clinicTypeForm.clinicTypeId,
      description: clinicTypeForm.clinicTypeDesc,
      name: clinicTypeForm.clinicTypeName,
      type: 'clinicType',
      value: clinicTypeForm.clinicTypeName,
      valueEn: clinicTypeForm.clinicTypeName,
      priority: 0,
      storeId: 0
    };
    console.log(params);

    const { res } = await webapi.updateClinicsDictionary(params);
    if (res.code === 'K-000000') {
      message.success('Successful');
    } else {
      message.error('Unsuccessful');
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
        <FormItem label="Prescriber Type Name">
          {getFieldDecorator('clinicTypeName', {
            rules: [
              { required: true, message: 'Please input Prescriber Type Name!' }
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
        <FormItem label="Prescriber Type Description">
          {getFieldDecorator('clinicTypeDesc', {
            rules: [
              {
                required: true,
                message: 'Please input Prescriber Type Description!'
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
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          ) : (
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          )}
          <Button style={{ marginLeft: '20px' }}>
            <Link to="/clinic-type">Back To List</Link>
          </Button>
        </FormItem>
      </Form>
    );
  }
}
export default Form.create()(ClinicForm);
