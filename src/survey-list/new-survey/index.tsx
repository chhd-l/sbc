import React from 'react'
import { FormattedMessage } from 'react-intl'
import { BreadCrumb, Headline } from 'qmkit'
import { Button, Form, Input, Row, Col, Switch, Spin } from 'antd';
import './index.less'

const FormItem = Form.Item;
const { TextArea } = Input;
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

// @ts-ignore
@Form.create()
export default class NewSurvey extends React.Component<any, any>{

  saveSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values,'valuesssss')
      if (!err) {
        // this.saveResourceData(params)
      }
    });
  }
  
  render() {
    let { getFieldDecorator } = this.props.form;
    return (
      <div>
        {/* <BreadCrumb /> */}
        <div className="container">
          <Headline title={<FormattedMessage id="Survey.new_survey" />} />
          <Form
            {...formItemLayout}
          // onSubmit={this.saveSubmit}
          >
            <Row>
              <Col span={14}>
                <FormItem label={<FormattedMessage id="Survey.title" />}>
                  {getFieldDecorator('title', {
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={14}>
                <FormItem label={<FormattedMessage id="Survey.label" />}>
                  {getFieldDecorator('label', {
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={14}>
                <FormItem label={<FormattedMessage id="Survey.description" />}>
                  {getFieldDecorator('description', {
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(<TextArea rows={4} />)}
                </FormItem>
              </Col>
              <Col span={14}>
                <FormItem label={<FormattedMessage id="Survey.active" />}>
                  {getFieldDecorator('active', { valuePropName: 'checked' })(<Switch />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="bar-button">
            <Button htmlType="submit" className="new-survey-save-btn" type="primary" >
            <FormattedMessage id="save" />
            </Button>
            <Button>
            <FormattedMessage id="cancel" />
            </Button>
          </div>
      </div>
    )
  }
}