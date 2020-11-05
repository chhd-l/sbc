import { Button, Form, Icon, Input, Modal, Radio } from 'antd';
import moment from 'moment';
import React from 'react';

const FormItem = Form.Item;
class AddCustomizedfilter extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      attributeForm: {
        attributeName: '',
        attributeType: ''
      },
      visibleAttribute: false,
      attributeValueList: []
    };
  }
  onAttributeFormChange = ({ field, value }) => {
    let data = this.state.attributeForm;
    data[field] = value;
    this.setState({
      attributeForm: data
    });
  };
  add = () => {
    const { attributeValueList } = this.state;
    const { form } = this.props;
    let obj = {
      id: this.genID(),
      value: ''
    };

    attributeValueList.push(obj);
    this.setState(
      {
        attributeValueList
      },
      () => {
        let setObj = {};
        let valueName = 'value_' + obj.id;
        setObj[valueName] = obj.value;
        form.setFieldsValue(setObj);
      }
    );
  };

  genID() {
    let date = moment().format('YYYYMMDDHHmmssSSS');
    return 'CV' + date;
  }

  remove = (id) => {
    const { attributeValueList } = this.state;
    let attributeValueListTemp = attributeValueList.filter((item) => item.id !== id);
    this.setState({
      attributeValueList: attributeValueListTemp
    });
  };

  onChangeValue = (id, value) => {
    const { attributeValueList } = this.state;
    attributeValueList.map((item) => {
      if (item.id === id) {
        item.value = value;
        return item;
      }
    });

    this.setState({
      attributeValueList
    });
  };
  openAddPage = () => {
    const { form } = this.props;

    this.setState(
      {
        attributeValueList: [],
        visibleAttribute: true
      },
      () => {
        this.add();
        form.setFieldsValue({
          attributeName: '',
          attributeType: 'Single choice'
        });
      }
    );
  };
  handleSubmit = () => {
    const { attributeForm, attributeValueList } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(attributeForm);
        console.log(attributeValueList);
        const { keys, names } = values;
        console.log(
          'Merged values:',
          keys.map((key) => names[key])
        );
        this.setState({
          visibleAttribute: false
        });
      }
    });
  };

  renderForm = (obj) => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 6 }
      }
    };
    if (obj && obj.length > 0) {
      const formItems = obj.map((k, index) => (
        <div key={k.id}>
          <FormItem label={index === 0 ? 'Attribute value' : ''} {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)} required={false} key={'value' + k.id}>
            {getFieldDecorator('value_' + k.id, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please input Attribute value.'
                }
              ]
            })(
              <Input
                placeholder="Attribute value"
                style={{ width: '80%', marginRight: 8 }}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.onChangeValue(k.id, value);
                }}
              />
            )}
            <span>
              {obj.length > 1 ? <Icon className="dynamic-delete-button" type="minus-circle-o" onClick={() => this.remove(k.id)} /> : null}

              <Icon className="dynamic-delete-button" type="plus-circle-o" style={{ marginLeft: 8 }} onClick={() => this.add()} />
            </span>
          </FormItem>
        </div>
      ));
      return formItems;
    }
  };
  render() {
    const { visibleAttribute, attributeValueList } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    return (
      <div>
        <Button type="primary" style={{ margin: '10px 0 10px 0' }} onClick={() => this.openAddPage()}>
          <span>Add customized filter</span>
        </Button>
        <Modal
          width="600px"
          title="Add new attribute"
          visible={visibleAttribute}
          footer={[
            <Button
              key="back"
              onClick={() => {
                this.setState({
                  visibleAttribute: false
                });
              }}
            >
              Close
            </Button>,
            <Button key="submit" type="primary" onClick={() => this.handleSubmit()}>
              Submit
            </Button>
          ]}
        >
          <Form {...formItemLayout}>
            <FormItem label="Attribute Name">
              {getFieldDecorator('attributeName', {
                rules: [
                  { required: true },
                  {
                    max: 50,
                    message: 'Exceed maximum length!'
                  }
                ]
              })(
                <Input
                  style={{ width: '80%' }}
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onAttributeFormChange({
                      field: 'attributeName',
                      value
                    });
                  }}
                />
              )}
            </FormItem>
            <FormItem label="Choose type">
              {getFieldDecorator('attributeType', {
                rules: [{ required: true }]
              })(
                <Radio.Group
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onAttributeFormChange({
                      field: 'attributeType',
                      value
                    });
                  }}
                  style={{ width: '80%' }}
                >
                  <Radio value="Single choice">Single choice</Radio>
                  <Radio value="Multiple choice">Multiple choice</Radio>
                </Radio.Group>
              )}
            </FormItem>
            {this.renderForm(attributeValueList)}
          </Form>
        </Modal>
      </div>
    );
  }
}
export default Form.create()(AddCustomizedfilter);
