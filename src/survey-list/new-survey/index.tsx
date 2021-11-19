import React from 'react'
import { FormattedMessage } from 'react-intl'
import { BreadCrumb, Headline, history } from 'qmkit'
import { Button, Form, Input, Row, Col, Switch, Spin } from 'antd'
import * as webapi from '../webapi'
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
      const statusBol = values['status']
      let params = {
        ...values,
        status: statusBol ? 1 : 0
      }
      if (!err) {
        this.saveNewSurvey(params)
      }
    });
  }

  saveNewSurvey = async (params) => {
    console.log(params, 'ppppp')
    const {res} = await webapi.addNewSurvey(params)
    console.log(res,'resSaveNew')
    // 成功后跳转到list,并且给出一个操作成功的提示
    // 如果“活动”打开：将触发验证以检查是否存在活动调查。
    // 验证失败：CC 停留在新的调查页面上，并看到系统错误消息“已经有一个活动调查”（后端接口出提示信息）。
  }

  handleCancel = () => {
    history.push('/survey-list')
  }

  render() {
    let { getFieldDecorator } = this.props.form;
    return (
      <div>
        {/* <BreadCrumb /> */}
        <Form
          {...formItemLayout}
          onSubmit={this.saveSubmit}
        >
          <div className="container">
            <Headline title={<FormattedMessage id="Survey.new_survey" />} />

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
                  {getFieldDecorator('status', {
                    valuePropName: 'checked',
                    initialValue: false
                  })(<Switch />)}
                </FormItem>
              </Col>
            </Row>
          </div>
          <div className="bar-button">
            <Button htmlType="submit" className="new-survey-save-btn" type="primary" >
              <FormattedMessage id="save" />
            </Button>
            <Button onClick={this.handleCancel}>
              <FormattedMessage id="cancel" />
            </Button>
          </div>
        </Form>
      </div>
    )
  }
}