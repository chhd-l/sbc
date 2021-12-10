import React, { Component } from 'react';
import { BreadCrumb, Headline } from 'qmkit';
import { Form, Icon, Input, Button, Row, Col, Spin } from 'antd';

import { FormattedMessage } from 'react-intl';
import './index.less';

// @ts-ignore
@Form.create()
export default class ProductApi extends Component<any, any>{
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false
    }
  }

  componentDidMount() {
    // 初始化form数据
    this.initForm();
  }

  initForm = () => {

  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const {loading} = this.state;

    return (
      <div>
        <BreadCrumb />
        <Spin spinning={loading}>
          <div className="container-search ProductApi-warp">
            <Form {...formItemLayout}>
              <Headline title='Product Catalog Info' />
              <Form.Item label={<FormattedMessage id='URL'/>}>
                {getFieldDecorator('CatalogInfo.url', {
                  rules: [
                    { required: true, message: 'Please input your URL!' },
                    {
                      pattern: /[a-zA-z]+:\/\/[^s]*/,
                      message: 'Please enter the correct URL!'
                    }
                  ],
                })(
                  <Input
                    placeholder="URL"
                  />
                )}
              </Form.Item>
              <Form.Item label={'Client ID'}>
                {getFieldDecorator('CatalogInfo.clientID', {
                  rules: [
                    { required: true, message: 'Please input your Client ID!' },
                  ],
                })(
                  <Input
                    placeholder="Client ID"
                  />
                )}
              </Form.Item>
              <Form.Item label={'Client secret'}>
                {getFieldDecorator('CatalogInfo.clientSecret', {
                  rules: [
                    { required: true, message: 'Please input your Client secret!' },
                  ],
                })(
                  <Input
                    placeholder="Client secret"
                  />
                )}
              </Form.Item>
              <Form.Item label={'Country Code'}>
                {getFieldDecorator('CatalogInfo.countryCode', {
                  rules: [
                    { required: true, message: 'Please input your Country Code!' },
                  ],
                })(
                  <Input
                    placeholder="Country Code"
                  />
                )}
              </Form.Item>

              <Headline title='Product Image Info' />
              <Form.Item label={<FormattedMessage id='URL'/>}>
                {getFieldDecorator('ImageInfo.url', {
                  rules: [
                    { required: true, message: 'Please input your URL!' },
                    {
                      pattern: /[a-zA-z]+:\/\/[^s]*/,
                      message: 'Please enter the correct URL!'
                    }
                  ],
                })(
                  <Input
                    placeholder="URL"
                  />
                )}
              </Form.Item>
              <Form.Item label={'Client ID'}>
                {getFieldDecorator('ImageInfo.clientID', {
                  rules: [
                    { required: true, message: 'Please input your Client ID!' },
                  ],
                })(
                  <Input
                    placeholder="Client ID"
                  />
                )}
              </Form.Item>
              <Form.Item label={'Client secret'}>
                {getFieldDecorator('ImageInfo.clientSecret', {
                  rules: [
                    { required: true, message: 'Please input your Client secret!' },
                  ],
                })(
                  <Input
                    placeholder="Client secret"
                  />
                )}
              </Form.Item>
              <Form.Item label={'Country Code'}>
                {getFieldDecorator('ImageInfo.countryCode', {
                  rules: [
                    { required: true, message: 'Please input your Country Code!' },
                  ],
                })(
                  <Input
                    placeholder="Country Code"
                  />
                )}
              </Form.Item>


            </Form>
            <Row>
              <Col span={8} offset={4}>
                <Button onClick={this.handleSubmit}>Save</Button>
              </Col>
            </Row>

          </div>

        </Spin>
      </div>
    );
  }
}