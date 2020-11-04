import React, { Component } from 'react';
import { Button, Form, Input, Modal, Select } from 'antd';
import ImageLibraryUpload from './image-library-upload';
import { FormattedMessage } from 'react-intl';
import { Tips } from 'qmkit';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class SalesCategoryModal extends Component<any, any> {
  //定义父组件传入值
  constructor(props: any) {
    super(props);
    this.state = {
      visible: false,
      categoryForm: {
        categoryName: '',
        parentCategory: '',
        categoryImg: [],
        categoryDescription: ''
      },
      parentCategoryList: []
    };
  }
  componentDidMount = () => {};
  openModal = () => {
    this.setState({
      visible: true
    });
  };
  handleOk = () => {
    console.log('ok');
    this.setState({
      visible: false
    });
  };
  handleCancel = () => {
    console.log('cancel');
    this.setState({
      visible: false
    });
  };
  onFormChange = ({ field, value }) => {
    let data = this.state.categoryForm;
    data[field] = value;
    this.setState({
      categoryForm: data
    });
  };

  render() {
    const { categoryForm, parentCategoryList } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 2,
        xs: { span: 24 },
        sm: { span: 10 }
      },
      wrapperCol: {
        span: 24,
        xs: { span: 24 },
        sm: { span: 10 }
      }
    };
    return (
      <div>
        <Button type="primary" style={{ margin: '20px 0' }} onClick={() => this.openModal()}>
          Add Category
        </Button>
        <Modal width={700} title="Add Category" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <Form {...formItemLayout} className="login-form" style={{ width: 550 }}>
            <FormItem label="Category name">
              {getFieldDecorator('categoryName', {
                rules: [
                  { required: true, message: 'Please input Category name!' },
                  {
                    max: 50,
                    message: 'Exceed maximum length!'
                  }
                ]
              })(
                <Input
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onFormChange({
                      field: 'categoryName',
                      value
                    });
                  }}
                />
              )}
            </FormItem>
            <FormItem label="Parent category">
              {getFieldDecorator('parentCategory', {
                rules: []
              })(
                <Select
                  onChange={(value) => {
                    value = value === '' ? null : value;
                    this.onFormChange({
                      field: 'parentCategory',
                      value
                    });
                  }}
                >
                  {parentCategoryList &&
                    parentCategoryList.map((item) => (
                      <Option value={item.valueEn} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                </Select>
              )}
            </FormItem>

            <FormItem label={<FormattedMessage id="cateImage" />}>
              <ImageLibraryUpload images={categoryForm.categoryImg} imgType={0} imgCount={10} skuId="" />
              <Tips title={<FormattedMessage id="product.recommendedSizeImg" />} />
            </FormItem>

            <FormItem label={<FormattedMessage id="cateDsc" />}>
              {getFieldDecorator('cateDescription', {
                rules: [
                  {
                    max: 200,
                    message: 'Exceed maximum length!'
                  }
                ]
              })(
                <TextArea
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onFormChange({
                      field: 'categoryDescription',
                      value
                    });
                  }}
                  rows={4}
                  placeholder="Please input the Category description"
                />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default Form.create()(SalesCategoryModal);
