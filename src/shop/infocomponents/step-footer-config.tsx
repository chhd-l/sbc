import React from 'react';
import { Form, Col, Row, Switch, Button, Icon, Input, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import { fromJS } from 'immutable';
import * as webapi from '../webapi';
import './footerConfig.less';
import { i } from 'plume2';

const FormItem = Form.Item;

let categoryId = 0;
let subCategoryId = 0;
class StepFooterConfig extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      visible: false,
      newTitle: '',

      footerCategory: []
    };
  }

  showModal = () => {
    this.setState({
      newTitle: '',
      visible: true
    });
  };

  handleCancel = () => {
    this.setState({
      newTitle: '',
      visible: false
    });
  };

  handleCreate = () => {
    const { footerCategory } = this.state;
    let newCategoryObj = {
      id: categoryId,
      title: this.state.newTitle,
      list: [
        {
          id: subCategoryId,
          name: '',
          link: ''
        }
      ]
    };
    categoryId++;
    subCategoryId++;
    footerCategory.push(newCategoryObj);
    this.setState({
      footerCategory: footerCategory,
      newTitle: '',
      visible: false
    });
  };

  remove = (parentId, subId) => {
    const { footerCategory } = this.state;
    footerCategory.map((item, index) => {
      if (item.id === parentId) {
        item.list = item.list.filter((obj) => obj.id !== subId);
        return item;
      }
    });
    this.setState({
      footerCategory
    });
  };
  deleteCategory = (id) => {
    const { footerCategory } = this.state;
    let footerCategoryTemp = footerCategory.filter((item) => item.id !== id);
    this.setState({
      footerCategory: footerCategoryTemp
    });
  };

  add = (id) => {
    const { footerCategory } = this.state;
    footerCategory.map((item, index) => {
      if (item.id === id) {
        let obj = {
          id: subCategoryId,
          name: '',
          link: ''
        };
        item.list.push(obj);
        subCategoryId++;
        return item;
      }
    });
    this.setState({
      footerCategory
    });
  };
  onChangeName = (parentId, subId, value) => {
    const { footerCategory } = this.state;
    footerCategory.map((item) => {
      if (item.id === parentId) {
        item.list.map((sub) => {
          if (sub.id === subId) {
            sub.name = value;
          }
          return sub;
        });
        return item;
      }
    });

    this.setState({
      footerCategory
    });
  };
  onChangeLink = (parentId, subId, value) => {
    const { footerCategory } = this.state;
    footerCategory.map((item) => {
      if (item.id === parentId) {
        item.list.map((sub) => {
          if (sub.id === subId) {
            sub.link = value;
          }
          return sub;
        });
        return item;
      }
    });
    this.setState({
      footerCategory
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { footerCategory } = this.state;
        console.log(footerCategory);
      }
    });
  };
  renderForm = (obj) => {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItems = obj.list.map((k, index) => (
      <div key={k.id}>
        <h3>{index === 0 ? obj.title : ''}</h3>
        <FormItem required={false} key={'names' + k.id}>
          {getFieldDecorator(`names[${k.id}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: 'Please input name.'
              }
            ]
          })(
            <Input
              placeholder="name"
              style={{ width: '100%', marginRight: 8 }}
              onChange={(e) => {
                const value = (e.target as any).value;
                this.onChangeName(obj.id, k.id, value);
              }}
            />
          )}
        </FormItem>
        <FormItem required={false} key={'link' + k.id}>
          {getFieldDecorator(`links[${k.id}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: 'Please input link.'
              }
            ]
          })(
            <Input
              placeholder="link"
              style={{ width: '100%', marginRight: 8 }}
              onChange={(e) => {
                const value = (e.target as any).value;
                this.onChangeLink(obj.id, k.id, value);
              }}
            />
          )}
        </FormItem>
        {obj.list.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(obj.id, k.id)}
          />
        ) : null}
        <Icon
          className="dynamic-delete-button"
          type="plus-circle-o"
          style={{ marginLeft: 8 }}
          onClick={() => this.add(obj.id)}
        />
        {index === 0 ? (
          <i
            className="iconfont iconDelete"
            onClick={() => this.deleteCategory(obj.id)}
            style={{ fontSize: 20, marginTop: 8, marginLeft: 8 }}
          ></i>
        ) : null}
      </div>
    ));
    return formItems;
  };

  render() {
    const { visible, footerCategory } = this.state;
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          Add new category
        </Button>
        <Modal
          visible={visible}
          title="Add new category"
          okText="Confirm"
          cancelText="Cancel"
          onCancel={this.handleCancel}
          onOk={this.handleCreate}
        >
          <Form>
            <FormItem label="Title">
              <Input
                value={this.state.newTitle}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.setState({
                    newTitle: value
                  });
                }}
              />
            </FormItem>
          </Form>
        </Modal>
        <Form onSubmit={this.handleSubmit} layout="inline">
          {footerCategory.map((item) => this.renderForm(item))}
          {footerCategory.length > 0 ? (
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          ) : null}
        </Form>
      </div>
    );
  }
}
export default Form.create()(StepFooterConfig);
