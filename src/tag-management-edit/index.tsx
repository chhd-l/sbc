import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper, history } from 'qmkit';
import { Link } from 'react-router-dom';
import { Table, Tooltip, Button, Form, Input, Row, Col, message, Select, Spin, Popconfirm, Switch, Breadcrumb, Card, Avatar, Pagination, Icon } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';

const { TextArea } = Input;
const FormItem = Form.Item;

class TagManagementEdit extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Tag management add',
      id: 0,
      isEdit: false,
      tagForm: {
        tagName: '',
        tagDescription: '',
        isPublished: true
      },
      loading: false
    };
  }
  componentDidMount() {
    if (this.props.match.path.indexOf('edit') !== -1) {
      this.setState(
        {
          isEdit: true,
          id: this.props.match.params.id,
          title: 'Tag management edit'
        },
        () => {
          this.getTagDetail(this.props.match.params.id);
        }
      );
    } else if (this.props.match.path.indexOf('add') !== -1) {
      this.setState({
        isEdit: false,
        title: 'Tag management add'
      });
    }
  }
  getTagDetail = (id) => {
    this.setState({
      loading: true
    });
    webapi
      .getTagDetail(id)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(res.message || 'Operation successful');
        } else {
          this.setState({
            loading: false
          });
          message.error(res.message || 'Operation failure');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.toString() || 'Operation failure');
      });
  };
  onTagFormChange = ({ field, value }) => {
    let data = this.state.tagForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };
  saveTag = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { tagForm, isEdit, id } = this.state;
        let params = {
          name: tagForm.tagName,
          description: tagForm.tagDescription,
          isPublished: tagForm.isPublished
        };
        if (isEdit) {
          params = Object.assign(params, { id: id });
          this.editTag(params);
        } else {
          this.addTag(params);
        }
      }
    });
  };

  editTag = (params) => {
    webapi
      .editTag(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(res.message || 'Operation successful');
          history.push(`./tag-management-detail/${params.id}`);
        } else {
          this.setState({
            loading: false
          });
          message.error(res.message || 'Operation failure');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.toString() || 'Operation failure');
      });
  };
  addTag = (params) => {
    webapi
      .addTag(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(res.message || 'Operation successful');
          history.push('./tag-management-list');
        } else {
          this.setState({
            loading: false
          });
          message.error(res.message || 'Operation failure');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.toString() || 'Operation failure');
      });
  };

  render() {
    const { loading, title, tagForm } = this.state;

    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      }
    };

    return (
      <AuthWrapper functionName="f_tag_management_edit">
        <div>
          <Spin spinning={loading}>
            <BreadCrumb thirdLevel={true}>
              <Breadcrumb.Item>{title}</Breadcrumb.Item>
            </BreadCrumb>
            <div className="container">
              <Form {...formItemLayout}>
                <FormItem label="Tag name">
                  {getFieldDecorator('tagName', {
                    rules: [
                      { required: true, message: 'Tag name is required' },
                      {
                        max: 50,
                        message: 'Exceed maximum length!'
                      }
                    ],
                    initialValue: tagForm.tagName
                  })(
                    <Input
                      style={{ width: '80%' }}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onTagFormChange({
                          field: 'tagName',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>
                <FormItem label="Tag description">
                  {getFieldDecorator('tagDescription', {
                    rules: [
                      {
                        max: 500,
                        message: 'Exceed maximum length!'
                      }
                    ],
                    initialValue: tagForm.tagDescription
                  })(
                    <TextArea
                      style={{ width: '80%' }}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onTagFormChange({
                          field: 'tagDescription',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>

                <FormItem label="Published">
                  {getFieldDecorator(
                    'isPublished',
                    {}
                  )(
                    <Switch
                      checked={tagForm.isPublished}
                      onChange={(checked) =>
                        this.onTagFormChange({
                          field: 'isPublished',
                          value: checked
                        })
                      }
                    ></Switch>
                  )}
                </FormItem>
              </Form>
            </div>
          </Spin>
        </div>
        <div className="bar-button">
          <Button type="primary" onClick={this.saveTag}>
            {<FormattedMessage id="save" />}
          </Button>
          <Button style={{ marginLeft: 20 }} onClick={() => (history as any).go(-1)}>
            {<FormattedMessage id="back" />}
          </Button>
        </div>
      </AuthWrapper>
    );
  }
}

const styles = {
  detailDesc: {
    color: 'rgba(0, 0, 0, 0.45)',
    lineHeight: 2
  },
  detailValue: {
    color: '#221357'
  },
  deleteStyle: {
    color: '#e2001a',
    marginLeft: 10,
    cursor: 'pointer'
  },
  linkStyle: {
    cursor: 'pointer',
    color: '#221357'
  }
} as any;

export default Form.create()(TagManagementEdit);
