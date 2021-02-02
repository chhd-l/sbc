import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper } from 'qmkit';
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
      title: 'Tag management edit',
      id: this.props.match.params.id,

      tagForm: {
        tagName: '123',
        tagDescription: 'test',
        published: true
      },
      loading: false
    };
  }
  componentDidMount() {
    this.getTagDeatail(this.state.id);
  }
  getTagDeatail = (id) => {
    console.log(id);
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
      }
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
          <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
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
                    'published',
                    {}
                  )(
                    <Switch
                      checked={tagForm.published}
                      onChange={(checked) =>
                        this.onTagFormChange({
                          field: 'published',
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
