import React, { Component } from 'react';
import { BreadCrumb, Headline, Const } from 'qmkit';
import { Form, Radio, Input, Button, Row, Col, Switch, Spin, message } from 'antd';
import { FormattedMessage } from 'react-intl';
import * as webapi from '../webapi';
import { decryptAES } from '../../../web_modules/qmkit/util';

// @ts-ignore
@Form.create()
export default class Hub extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      enabled: false,
      type: '',
      local: '',
      token: '',
      displayLanguage: '',
      retailerProductsIds: '',
      vetProductsIds: '',
      trackingPrefixId: '',
      url: ''
    };
  }

  componentDidMount() {
    this.initForm();
  }

  initForm = async () => {
    this.setState({ loading: true });
    let { res } = await webapi.findBuyFromRetailer();
    this.setState({ loading: false });
    if (res.code === Const.SUCCESS_CODE) {
      let params = res.context.apiContext ? decryptAES(res.context.buyFromRetailerContext) : {};
      console.log(params, 'params1');

      this.setState({
        enabled: true,
        type: 0,
        local: '00000',
        token: '11111',
        displayLanguage: '22222',
        retailerProductsIds: '3333',
        vetProductsIds: '4444',
        trackingPrefixId: '5555',
        url: '6666'
      });
    } else {
      message.warn(res.message);
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      console.log(err, values);
      return;
      if (!err) {
        const {
          enabled,
          type,
          local,
          token,
          displayLanguage,
          retailerProductsIds,
          vetProductsIds,
          trackingPrefixId,
          url
        } = this.state;

        const params = {
          enabled,
          type,
          local,
          token,
          displayLanguage,
          retailerProductsIds,
          vetProductsIds,
          trackingPrefixId,
          url
        };
        this.setState({ loading: true });
        let { res } = await webapi.editBuyFromRetailer(params);
        this.setState({ loading: false });
        if (res.code === Const.SUCCESS_CODE) {
          message.success('Operate successfully');
        } else {
          message.warn(res.message);
        }
      }
    });
  };

  onChange = (type, value) => {
    this.setState({
      [type]: value
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      }
    };

    const {
      loading,
      enabled,
      type,
      local,
      token,
      displayLanguage,
      retailerProductsIds,
      vetProductsIds,
      trackingPrefixId,
      url
    } = this.state;

    return (
      <div>
        <BreadCrumb />
        <Spin spinning={loading}>
          <div className='container-search' style={{ paddingBottom: '20px' }}>
            <Headline title={<FormattedMessage id='Menu.Buy from Retailer' />} />
            {!loading && (
              <>
                <Form {...formItemLayout}>
                  <Form.Item label={<FormattedMessage id='enabled' />}>
                    {getFieldDecorator('enabled', {
                      valuePropName: 'checked',
                      initialValue: enabled,
                      rules: [
                        { required: true }
                      ]
                    })(
                      <Switch onChange={(e) => this.onChange('enabled', e)} />
                    )}
                  </Form.Item>
                  {enabled && (
                    <>
                      <Form.Item label={<FormattedMessage id='Retailer.Type' />}>
                        {getFieldDecorator('type', {
                          initialValue: type,
                          rules: [
                            { required: true }
                          ]
                        })(
                          <Radio.Group onChange={(e) => this.onChange('type', e.target.value)}>
                            <Radio value={1}>API</Radio>
                            <Radio value={0}>URL</Radio>
                          </Radio.Group>
                        )}
                      </Form.Item>
                      {
                        /*type 选择API*/
                        type === 1 && (
                          <>
                            <Form.Item label={<FormattedMessage id='Retailer.Local' />}>
                              {getFieldDecorator('local', {
                                initialValue: local,
                                rules: [
                                  { required: true }
                                ]
                              })(
                                <Input />
                              )}
                            </Form.Item>
                            <Form.Item label={<FormattedMessage id='Retailer.Token' />}>
                              {getFieldDecorator('token', {
                                initialValue: token,
                                rules: [
                                  { required: true }
                                ]
                              })(
                                <Input />
                              )}
                            </Form.Item>
                            <Form.Item label={<FormattedMessage id='Retailer.DisplayLanguage' />}>
                              {getFieldDecorator('displayLanguage', {
                                initialValue: displayLanguage,
                                rules: [
                                  { required: true }
                                ]
                              })(
                                <Input />
                              )}
                            </Form.Item>
                            <Form.Item label={<FormattedMessage id='Retailer.IdRetailerProducts' />}>
                              {getFieldDecorator('retailerProductsIds', {
                                initialValue: retailerProductsIds,
                                rules: [
                                  { required: true }
                                ]
                              })(
                                <Input />
                              )}
                            </Form.Item>
                            <Form.Item label={<FormattedMessage id='Retailer.IdVetProducts' />}>
                              {getFieldDecorator('vetProductsIds', {
                                initialValue: vetProductsIds,
                                rules: [
                                  { required: true }
                                ]
                              })(
                                <Input />
                              )}
                            </Form.Item>
                            <Form.Item label={<FormattedMessage id='Retailer.TrackingIdPrefix' />}>
                              {getFieldDecorator('trackingPrefixId', {
                                initialValue: trackingPrefixId,
                                rules: [
                                  { required: true }
                                ]
                              })(
                                <Input />
                              )}
                            </Form.Item>
                          </>
                        )
                      }
                      {
                        /*type 选择URL*/
                        type === 0 && (
                          <Form.Item label={<FormattedMessage id='Setting.URL' />}>
                            {getFieldDecorator('url', {
                              initialValue: url,
                              rules: [
                                { required: true }
                              ]
                            })(
                              <Input />
                            )}
                          </Form.Item>
                        )
                      }
                    </>
                  )}
                </Form>
              </>
            )}

          </div>
          <Row className='bar-button'>
            <Col span={12}>
              <Row>
                <Col span={12}>
                  <Button type='primary' onClick={this.handleSubmit}>Save</Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Spin>
      </div>
    );
  }
}
