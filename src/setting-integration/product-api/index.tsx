import React, { Component } from 'react';
import { BreadCrumb, Const, Headline } from 'qmkit';
import { Form, Icon, Input, Button, Row, Col, Spin, message } from 'antd';

import { FormattedMessage } from 'react-intl';
import './index.less';
import * as webApi from '@/setting-integration/webapi';
import * as webapi from '@/setting-integration/webapi';

// @ts-ignore
@Form.create()
export default class ProductApi extends Component<any, any>{
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      catalogData: {},
      imageData: {},
    }
  }

  componentDidMount() {
    // 初始化form数据
    this.initForm();
  }

  initForm = async () => {
    const { setFieldsValue } = this.props.form;
    this.setState({loading:true})
    let { res } = await webApi.getProductApiList();
    this.setState({loading:false})
    let catalogData = res.context.find(item => item.type === 'CATALOG');
    let imageData = res.context.find(item => item.type === 'IMAGE');
    this.setState({
      catalogData: catalogData??{},
      imageData: imageData??{},
    })
    if (res.code === Const.SUCCESS_CODE){
      setFieldsValue({
        'CatalogInfo.url': catalogData?.url,
        'CatalogInfo.clientId': catalogData?.clientId,
        'CatalogInfo.clientSecret': catalogData?.clientSecret,
        'CatalogInfo.countryCode': catalogData?.countryCode,

        'ImageInfo.url': imageData?.url,
        'ImageInfo.clientId': imageData?.clientId,
        'ImageInfo.clientSecret': imageData?.clientSecret,
        'ImageInfo.countryCode': imageData?.countryCode,

      })
    }else {
      message.warn(res.message)
    }

  }

  handleSubmit = e => {
    e.preventDefault();
    const {
      catalogData,
      imageData
    } = this.state;
    this.props.form.validateFields( async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let {
          CatalogInfo,
          ImageInfo
        } = values;
        let params = {
          productSynchronizationConfigVos: [
            {
              ...catalogData,
              ...CatalogInfo,
            },
            {
              ...imageData,
              ...ImageInfo,
            }
          ]
        }
        this.setState({loading: true});
        let {res} = await webapi.updateProductApi(params);
        this.setState({loading: false});

        if (res.code === Const.SUCCESS_CODE){
          message.success('Operate successfully');
        }else {
          message.warn(res.message);
        }
      }
    })

  };

  render() {
    const { getFieldDecorator } = this.props.form;
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
                {getFieldDecorator('CatalogInfo.clientId', {
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
                {getFieldDecorator('ImageInfo.clientId', {
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
