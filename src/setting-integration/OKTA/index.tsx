import React, { Component } from 'react';
import { BreadCrumb, Headline } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Form, Icon, Input, Button, Row, Col, Switch, Spin } from 'antd';

import './index.less';

// @ts-ignore
@Form.create()
export default class OKTA extends Component<any, any>{
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
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const { loading } = this.state;

    return (
      <div>
        <BreadCrumb />
        <Spin spinning={loading}>
          <div className="container-search OKTA-warp">
            <Form {...formItemLayout}>
              <Headline title={<FormattedMessage id="Menu.OKTA" />} />
              <Row>
                <Col span={12}>
                  <Form.Item label={'Application name'}>
                    {getFieldDecorator('OKTA.applicationName', {
                      rules: [
                        { required: true, message: 'Please input your Application name!' },
                      ],
                    })(
                      <Input
                        placeholder="Application name"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'OKTA domain'}>
                    {getFieldDecorator('OKTA.OKTADomain', {
                      rules: [
                        { required: true, message: 'Please input your OKTA domain!' },
                      ],
                    })(
                      <Input
                        placeholder="OKTA domain"
                      />
                    )}
                  </Form.Item>

                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={'CIAM domain'}>
                    {getFieldDecorator('OKTA.CIAMDomain', {
                      rules: [
                        { required: true, message: 'Please input your CIAM domain!' },
                      ],
                    })(
                      <Input
                        placeholder="CIAM domain"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'Application ID'}>
                    {getFieldDecorator('OKTA.applicationID', {
                      rules: [
                        { required: true, message: 'Please input your Application ID!' },
                      ],
                    })(
                      <Input
                        placeholder="Application ID"
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={'Client ID'}>
                    {getFieldDecorator('OKTA.clientID', {
                      rules: [
                        { required: true, message: 'Please input your Client ID!' },
                      ],
                    })(
                      <Input
                        placeholder="Client ID"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'Sign-out redirect URLS'}>
                    {getFieldDecorator('OKTA.SignOutRedirectURLS', {
                      rules: [
                        { required: true, message: 'Please input your Sign-out redirect URLS!' },
                      ],
                    })(
                      <Input.TextArea
                        autoSize
                        rows={3}
                        placeholder="Sign-out redirect URLS"
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={'Sign-in redirect URLS'}>
                    {getFieldDecorator('OKTA.SignInRedirectURLS', {
                      rules: [
                        { required: true, message: 'Please input your Sign-in redirect URLS!' },
                      ],
                    })(
                      <Input.TextArea
                        autoSize
                        rows={3}
                        placeholder="Sign-in redirect URLS"
                      />
                    )}
                  </Form.Item>

                </Col>

              </Row>

              <Headline title={'Workforce'} />
              <Row>
                <Col span={12}>
                  <Form.Item label={'Application name'}>
                    {getFieldDecorator('Workforce.applicationName', {
                      rules: [
                        { required: true, message: 'Please input your Application name!' },
                      ],
                    })(
                      <Input
                        placeholder="Application name"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'OKTA domain'}>
                    {getFieldDecorator('Workforce.OKTADomain', {
                      rules: [
                        { required: true, message: 'Please input your OKTA domain!' },
                      ],
                    })(
                      <Input
                        placeholder="OKTA domain"
                      />
                    )}
                  </Form.Item>

                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={'CIAM domain'}>
                    {getFieldDecorator('Workforce.CIAMDomain', {
                      rules: [
                        { required: true, message: 'Please input your CIAM domain!' },
                      ],
                    })(
                      <Input
                        placeholder="CIAM domain"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'Application ID'}>
                    {getFieldDecorator('Workforce.applicationID', {
                      rules: [
                        { required: true, message: 'Please input your Application ID!' },
                      ],
                    })(
                      <Input
                        placeholder="Application ID"
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={'Client ID'}>
                    {getFieldDecorator('Workforce.clientID', {
                      rules: [
                        { required: true, message: 'Please input your Client ID!' },
                      ],
                    })(
                      <Input
                        placeholder="Client ID"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'Client secret'}>
                    {getFieldDecorator('Workforce.clientSecret', {
                      rules: [
                        { required: true, message: 'Please input your Client secret!' },
                      ],
                    })(
                      <Input
                        placeholder="Client secret"
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={'Sign-in redirect URLS'}>
                    {getFieldDecorator('Workforce.SignInRedirectURLS', {
                      rules: [
                        { required: true, message: 'Please input your Sign-in redirect URLS!' },
                      ],
                    })(
                      <Input.TextArea
                        autoSize
                        rows={3}
                        placeholder="Sign-in redirect URLS"
                      />
                    )}
                  </Form.Item>

                </Col>
                <Col span={12}>
                  <Form.Item label={'Sign-out redirect URLS'}>
                    {getFieldDecorator('Workforce.SignOutRedirectURLS', {
                      rules: [
                        { required: true, message: 'Please input your Sign-out redirect URLS!' },
                      ],
                    })(
                      <Input.TextArea
                        autoSize
                        rows={3}
                        placeholder="Sign-out redirect URLS"
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>

            </Form>
          </div>
          <Row className='bar-button'>
            <Col span={12}>
              <Row>
                <Col span={12}>
                  <Button onClick={this.handleSubmit}>Save</Button>
                </Col>
              </Row>
            </Col>
          </Row>

        </Spin>
      </div>
    );
  }
}