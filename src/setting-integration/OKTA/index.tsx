import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, util } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Form, Icon, Input, Button, Row, Col, Spin, message } from 'antd';
import * as webApi from '../webapi';

import './index.less';
import * as webapi from '@/setting-integration/webapi';

// @ts-ignore
@Form.create()
export default class OKTA extends Component<any, any>{
  private base64: any;
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      shopData: {},
      frontData: {},
    }
    this.base64 = new util.Base64();
  }

  componentDidMount() {
    // 初始化form数据
    this.initForm();
  }

  initForm = async () => {
    const { setFieldsValue } = this.props.form;
    this.setState({loading:true})
    let { res } = await webApi.getOKTAList();
    this.setState({loading:false})
    let shopData = res.context.find(item => item.type === 'SHOP');
    let frontData = res.context.find(item => item.type === 'FRONT');
    this.setState({
      shopData: shopData??{},
      frontData: frontData??{},
    })
    if (res.code === Const.SUCCESS_CODE){
      setFieldsValue({
        'OKTA.appName': frontData?.appName,
        'OKTA.oktaDomain': frontData?.oktaDomain,
        'OKTA.ciamDomain': frontData?.ciamDomain,
        'OKTA.clientId': frontData?.clientId ? this.base64.urlDecode(frontData?.clientId):'',
        'OKTA.signOutRedirectUrls': frontData?.signOutRedirectUrls ?? null,
        'OKTA.signInRedirectUrls': frontData?.signInRedirectUrls ?? null,

        'Workforce.appName': shopData?.appName,
        'Workforce.oktaDomain': shopData?.oktaDomain,
        'Workforce.ciamDomain': shopData?.ciamDomain,
        'Workforce.clientId': shopData?.clientId ? this.base64.urlDecode(shopData?.clientId):'',
        'Workforce.clientSecret':  shopData?.clientSecret ? this.base64.urlDecode(shopData?.clientSecret):'',
        'Workforce.signOutRedirectUrls': shopData?.signOutRedirectUrls ?? null,
        'Workforce.signInRedirectUrls': shopData?.signInRedirectUrls ?? null,
      })
    }else {
      message.warn(res.message)
    }

  }

  handleSubmit = e => {
    e.preventDefault();
    const {
      shopData,
      frontData
    } = this.state;
    this.props.form.validateFields( async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let {
          OKTA,
          Workforce
        } = values;
        let params = {
          oktaSettingSaveRequests: [
            {
              ...shopData,
              ...Workforce,
            },
            {
              ...frontData,
              ...OKTA,
            }
          ]
        }
        this.setState({loading: true});
        let {res} = await webapi.updateOKTA(params);
        this.setState({loading: false});

        if (res.code === Const.SUCCESS_CODE){
          message.success('Operate successfully');
        }else {
          message.warn(res.message);
        }
      }
    })
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    const { loading } = this.state;

    return (
      <div>
        <BreadCrumb />
        <Spin spinning={loading}>
          <div className="container-search OKTA-warp">
            <Form {...formItemLayout}>
              <Headline title={'Shop'} />
              <Row>
                <Col span={12}>
                  <Form.Item label={'Application name'}>
                    {getFieldDecorator('OKTA.appName', {
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
                    {getFieldDecorator('OKTA.oktaDomain', {
                      rules: [
                        { required: true, message: 'Please input your OKTA domain!' },
                        {
                          pattern: /[a-zA-z]+:\/\/[^s]*/,
                          message: 'Please enter the correct URL!'
                        }
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
                    {getFieldDecorator('OKTA.ciamDomain', {
                      rules: [
                        { required: true, message: 'Please input your CIAM domain!' },
                        {
                          pattern: /[a-zA-z]+:\/\/[^s]*/,
                          message: 'Please enter the correct URL!'
                        }
                      ],
                    })(
                      <Input
                        placeholder="CIAM domain"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'Client ID'}>
                    {getFieldDecorator('OKTA.clientId', {
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
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={'Sign-out redirect URLS'}>
                    {getFieldDecorator('OKTA.signOutRedirectUrls')(
                      <Input.TextArea
                        autoSize
                        rows={3}
                        placeholder="Sign-out redirect URLS"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'Sign-in redirect URLS'}>
                    {getFieldDecorator('OKTA.signInRedirectUrls')(
                      <Input.TextArea
                        autoSize
                        rows={3}
                        placeholder="Sign-in redirect URLS"
                      />
                    )}
                  </Form.Item>

                </Col>
              </Row>

              <Headline title={'Backend'} />
              <Row>
                <Col span={12}>
                  <Form.Item label={'Application name'}>
                    {getFieldDecorator('Workforce.appName', {
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
                    {getFieldDecorator('Workforce.oktaDomain', {
                      rules: [
                        { required: true, message: 'Please input your OKTA domain!' },
                        {
                          pattern: /[a-zA-z]+:\/\/[^s]*/,
                          message: 'Please enter the correct URL!'
                        }
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
                    {getFieldDecorator('Workforce.ciamDomain', {
                      rules: [
                        { required: true, message: 'Please input your CIAM domain!' },
                        {
                          pattern: /[a-zA-z]+:\/\/[^s]*/,
                          message: 'Please enter the correct URL!'
                        }
                      ],
                    })(
                      <Input
                        placeholder="CIAM domain"
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
                  <Form.Item label={'Client ID'}>
                    {getFieldDecorator('Workforce.clientId', {
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
                    {getFieldDecorator('Workforce.signOutRedirectUrls')(
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
                    {getFieldDecorator('Workforce.signInRedirectUrls', {})(
                      <Input.TextArea
                        autoSize
                        rows={3}
                        placeholder="Sign-in redirect URLS"
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
