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
      locale: '',
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
      let params = res.context.buyFromRetailerContext ? JSON.parse(decryptAES(res.context.buyFromRetailerContext)) : {};
      this.setState({
        enabled: !!params.retailerEnable || false,
        type: params.type || '',
        locale: params.locale || '',
        token: params.token || '',
        displayLanguage: params.displayLanguage || '',
        retailerProductsIds: params.idRetailProducts || '',
        vetProductsIds: params.idVetProducts || '',
        trackingPrefixId: params.trackingIdPrefix || '',
        sptUrl: params.sptUrl || '',
        vetUrl: params.vetUrl || '',
      });
    } else {
      message.warn(res.message);
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const {
          enabled,
          type,
          locale,
          token,
          displayLanguage,
          retailerProductsIds,
          vetProductsIds,
          trackingPrefixId,
          sptUrl,
          vetUrl,
        } = this.state;

        const params = {
          retailerEnable:  enabled ? 1 : 0,
          type: type,
          locale: locale,
          token: token,
          displayLanguage: displayLanguage,
          idRetailProducts: retailerProductsIds,
          idVetProducts: vetProductsIds,
          trackingIdPrefix: trackingPrefixId,
          sptUrl,
          vetUrl,
        };

        this.setState({ loading: true });
        let { res } = await webapi.editBuyFromRetailer({buyFromRetailerContext: params});
        this.setState({ loading: false });
        if (res.code === Const.SUCCESS_CODE) {
          message.success('Operate successfully');
          this.initForm();
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
      locale,
      token,
      displayLanguage,
      retailerProductsIds,
      vetProductsIds,
      trackingPrefixId,
      sptUrl,
      vetUrl,
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
                            <Radio value="API">API</Radio>
                            <Radio value="URL">URL</Radio>
                          </Radio.Group>
                        )}
                      </Form.Item>
                      {
                        /*type 选择API*/
                        type === 'API' && (
                          <>
                            <Form.Item label={<FormattedMessage id='Retailer.Local' />}>
                              {getFieldDecorator('locale', {
                                initialValue: locale,
                                rules: [
                                  { required: true }
                                ]
                              })(
                                <Input onChange={(e) => this.onChange('locale', e.target.value)}/>
                              )}
                            </Form.Item>
                            <Form.Item label={<FormattedMessage id='Retailer.Token' />}>
                              {getFieldDecorator('token', {
                                initialValue: token,
                                rules: [
                                  { required: true }
                                ]
                              })(
                                <Input onChange={(e) => this.onChange('token', e.target.value)}/>
                              )}
                            </Form.Item>
                            <Form.Item label={<FormattedMessage id='Retailer.DisplayLanguage' />}>
                              {getFieldDecorator('displayLanguage', {
                                initialValue: displayLanguage,
                                rules: [
                                  { required: true }
                                ]
                              })(
                                <Input onChange={(e) => this.onChange('displayLanguage', e.target.value)}/>
                              )}
                            </Form.Item>
                            <Form.Item label={<FormattedMessage id='Retailer.IdRetailerProducts' />}>
                              {getFieldDecorator('retailerProductsIds', {
                                initialValue: retailerProductsIds,
                                rules: [
                                  { required: true }
                                ]
                              })(
                                <Input onChange={(e) => this.onChange('retailerProductsIds', e.target.value)} />
                              )}
                            </Form.Item>
                            <Form.Item label={<FormattedMessage id='Retailer.IdVetProducts' />}>
                              {getFieldDecorator('vetProductsIds', {
                                initialValue: vetProductsIds,
                                rules: [
                                  { required: true }
                                ]
                              })(
                                <Input onChange={(e) => this.onChange('vetProductsIds', e.target.value)}/>
                              )}
                            </Form.Item>
                            <Form.Item label={<FormattedMessage id='Retailer.TrackingIdPrefix' />}>
                              {getFieldDecorator('trackingPrefixId', {
                                initialValue: trackingPrefixId,
                                rules: [
                                  { required: true }
                                ]
                              })(
                                <Input onChange={(e) => this.onChange('trackingPrefixId', e.target.value)}/>
                              )}
                            </Form.Item>
                          </>
                        )
                      }
                      {
                        /*type 选择URL*/
                        type === 'URL' &&
                          <>
                          <Form.Item label={<FormattedMessage id='Setting.sptUrl' />}>
                            {getFieldDecorator('sptUrl', {
                              initialValue: sptUrl,
                              rules: [
                                { required: true }
                              ]
                            })(
                              <Input onChange={(e) => this.onChange('sptUrl', e.target.value)}/>
                            )}
                          </Form.Item>
                          <Form.Item label={<FormattedMessage id='Setting.vetUrl' />}>
                            {getFieldDecorator('vetUrl', {
                              initialValue: vetUrl,
                              rules: [
                                { required: true }
                              ]
                            })(
                              <Input onChange={(e) => this.onChange('vetUrl', e.target.value)}/>
                            )}
                          </Form.Item>
                          </>
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
