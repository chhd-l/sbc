import React from 'react'
import { FormattedMessage } from 'react-intl'
import { BreadCrumb, Headline, history, Const, RCi18n } from 'qmkit'
import { Button, Form, Input, Row, Col, Switch, Spin,message,Breadcrumb,Select } from 'antd'
import * as webapi from '../webapi'
import './index.less'

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

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
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      surveyTypeList:[]
    }
  }

  componentDidMount(): void {
    this.getSurveyTypeDict()
  }

  getSurveyTypeDict = async() =>{
    const {res} = await webapi.surveyTypeDict();
    const surveyTypeList = res.context?.sysDictionaryVOS || []
    this.setState({
      surveyTypeList,
    })
  }

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
    try {
      this.setState({
        loading: true
      })
      const { res } = await webapi.addNewSurvey(params)
      if (res.code === Const.SUCCESS_CODE) {
        message.success(res.message)
        history.push('/survey-list')
      }
      this.setState({
        loading: false
      })

    } catch (err) {
    }

  }

  handleCancel = () => {
    history.push('/survey-list')
  }

  render() {
    const {surveyTypeList,loading} = this.state;
    let { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Spin spinning={loading}>
        <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>{RCi18n({ id: 'Survey.new_survey' })}</Breadcrumb.Item>
          </BreadCrumb>
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
                  <FormItem label={<FormattedMessage id="Survey.show_survey" />}>
                    {getFieldDecorator('surveyTypes', {
                      rules: [
                        {
                          required: true,
                        },
                      ],
                      initialValue: ["Everyone"]
                    })(<Select
                      mode="multiple"
                      className="survey_types"
                      getPopupContainer={() => document.getElementsByClassName('survey_types')[0]}
                    >
                      {surveyTypeList.map(item => <Option key={item.id} value={item.name}>{item.name}</Option>)}
                    </Select>)}
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
        </Spin>
      </div>
    )
  }
}