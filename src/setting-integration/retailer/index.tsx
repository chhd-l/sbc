import React, { Component } from 'react';
import { BreadCrumb, Headline, Const } from 'qmkit';
import { Form, Radio, Icon, Input, Button, Row, Col, Switch, Spin, message } from 'antd';
import { FormattedMessage } from 'react-intl';
import * as webapi from '../webapi';

// @ts-ignore
@Form.create()
export default class Hub extends Component<any, any>{
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      enabled: false,
      type: 1,
    }
  }

  componentDidMount() {
    this.initForm();
  }

  initForm = async () => {
    const { setFieldsValue } = this.props.form;

    this.setState({loading: true})
    let { res } = await webapi.getHubStoreConfigList('hubConfig');
    this.setState({loading: false})
    if (res.code === Const.SUCCESS_CODE){
      let {enable, url, id} = res.context;
      setFieldsValue({
        enabled: !!enable,
      })
    }else {
      message.warn(res.message);
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {

        const params = {
          status: values.enableHub ? 1:0,
        }
        this.setState({loading: true});
        let {res} = await webapi.updateHub(params);
        this.setState({loading: false});
        if (res.code === Const.SUCCESS_CODE){
          message.success('Operate successfully');
        }else {
          message.warn(res.message);
        }
      }
    });
  };

  onChange = (type, value) => {
    this.setState({
      [type]: value
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
    };

    const { loading, enabled, type } = this.state;

    return (
      <div>
        <BreadCrumb />
        <Spin spinning={loading}>
          <div className="container-search" style={{paddingBottom: '20px'}}>
            <Headline title={<FormattedMessage id='Menu.Buy from Retailer'/>} />
            <Form {...formItemLayout}>
              <Form.Item label={<FormattedMessage id='enabled'/>}>
                {getFieldDecorator('enabled', {
                  valuePropName: 'checked',
                  rules: [
                    { required: true }
                  ],
                })(
                  <Switch onChange={(e) => this.onChange('enabled', e)}/>
                )}
              </Form.Item>
              <div style={{display: enabled ? 'block' : 'none'}}>
                <Form.Item label={<FormattedMessage id='Retailer.Type'/>}>
                  {getFieldDecorator('type', {
                    rules: [
                      { required: true }
                    ],
                  })(
                    <Radio.Group onChange={(e) => this.onChange('type', e.target.value)}>
                      <Radio value={1}>API</Radio>
                      <Radio value={2}>URL</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
                {
                  /*type 选择API*/
                  type === 1 && (
                    <>
                      <Form.Item label={<FormattedMessage id='Retailer.Local'/>}>
                        {getFieldDecorator('Local', {
                          rules: [
                            { required: true }
                          ],
                        })(
                          <Input/>
                        )}
                      </Form.Item>
                      <Form.Item label={<FormattedMessage id='Retailer.Token'/>}>
                        {getFieldDecorator('token', {
                          rules: [
                            { required: true }
                          ],
                        })(
                          <Input/>
                        )}
                      </Form.Item>
                      <Form.Item label={<FormattedMessage id='Retailer.DisplayLanguage'/>}>
                        {getFieldDecorator('displayLanguage', {
                          rules: [
                            { required: true }
                          ],
                        })(
                          <Input/>
                        )}
                      </Form.Item>
                      <Form.Item label={<FormattedMessage id='Retailer.IdRetailerProducts'/>}>
                        {getFieldDecorator('retailerProductsIds', {
                          rules: [
                            { required: true }
                          ],
                        })(
                          <Input/>
                        )}
                      </Form.Item>
                      <Form.Item label={<FormattedMessage id='Retailer.IdVetProducts'/>}>
                        {getFieldDecorator('vetProductsIds', {
                          rules: [
                            { required: true }
                          ],
                        })(
                          <Input/>
                        )}
                      </Form.Item>
                      <Form.Item label={<FormattedMessage id='Retailer.TrackingIdPrefix'/>}>
                        {getFieldDecorator('trackingPrefixId', {
                          rules: [
                            { required: true }
                          ],
                        })(
                          <Input/>
                        )}
                      </Form.Item>
                    </>
                  )
                }
                {
                  /*type 选择URL*/
                  type === 2 && (
                    <Form.Item label={<FormattedMessage id='Setting.URL'/>}>
                      {getFieldDecorator('url', {
                        rules: [
                          { required: true }
                        ],
                      })(
                        <Input/>
                      )}
                    </Form.Item>
                  )
                }
              </div>
            </Form>
          </div>
          <Row className='bar-button'>
            <Col span={12}>
              <Row>
                <Col span={12}>
                  <Button type="primary" onClick={this.handleSubmit}>Save</Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Spin>
      </div>
    );
  }
}
