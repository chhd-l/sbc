import React, { Component } from 'react';
import { BreadCrumb, Headline } from 'qmkit';
import { Form, Icon, Input, Button, Row, Col, Switch, Spin } from 'antd';
import { FormattedMessage } from 'react-intl';

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
    const isEnabled =getFieldValue('enabled');
    const { loading } = this.state;

    return (
      <div>
        <BreadCrumb />
        <Spin spinning={loading}>
          <div className="container-search hub-warp">
            <Headline title={'Enable Hub integration'} />
            <Form {...formItemLayout}>
              <Form.Item label={<FormattedMessage id='enabled'/>}>
                {getFieldDecorator('enabled', {
                  rules: [
                    { required: true },
                  ],
                })(
                  <Switch />
                )}
              </Form.Item>
              {
                isEnabled
                  ? (
                    <Form.Item label={<FormattedMessage id='URL'/>}>
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
                  )
                  :null
              }
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