import React, { Component } from 'react';
import { BreadCrumb, Headline, Const } from 'qmkit';
import { Form, Icon, Input, Button, Row, Col, Switch, Spin, message } from 'antd';
import { FormattedMessage } from 'react-intl';
import * as webapi from '../webapi';

import './index.less';

// @ts-ignore
@Form.create()
export default class Hub extends Component<any, any>{
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

  initForm = async () => {
    const { setFieldsValue } = this.props.form;

    this.setState({loading: true})
    let { res } = await webapi.getHubStoreConfigList();
    this.setState({loading: false})
    if (res.code === Const.SUCCESS_CODE){
      let {enableHub, url} = res.context;
      setFieldsValue({
        enableHub: !!enableHub,
        url: !!enableHub ? url : undefined,
      })
    }else {
      message.warn(res.message);
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const params = {
          status: values.enableHub ? 1:0,
          url: values.enableHub ? values.url: null,
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
    const isEnabled =getFieldValue('enableHub');
    const { loading } = this.state;

    return (
      <div>
        <BreadCrumb />
        <Spin spinning={loading}>
          <div className="container-search hub-warp">
            <Headline title={'Enable Hub integration'} />
            <Form {...formItemLayout}>
              <Form.Item label={<FormattedMessage id='enabled'/>}>
                {getFieldDecorator('enableHub', {
                  valuePropName: 'checked',
                  rules: [
                    { required: true }
                  ],
                })(
                  <Switch />
                )}
              </Form.Item>
              <Form.Item
                style={{visibility: isEnabled ? 'visible':'hidden'}}
                label={<FormattedMessage id='URL'/>}
              >
                {getFieldDecorator('url', {
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