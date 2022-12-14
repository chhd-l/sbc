import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Headline, history } from 'qmkit'
import { Modal, Button, Form, Input, Row, Col, Switch, Spin, Select } from 'antd'
import * as webapi from '../webapi'

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

// @ts-ignore
@Form.create()
export default class NewSurveyModal extends React.Component<any, any>{
  constructor(props) {
    super(props);
    this.state = {
      surveyTypeList: []
    }
  }

  componentDidMount(): void {
    this.getSurveyTypeDict()
  }

  getSurveyTypeDict = async () => {
    const { res } = await webapi.surveyTypeDict();
    const surveyTypeList = res.context?.sysDictionaryVOS || []
    this.setState({
      surveyTypeList,
    })
  }

  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const statusBol = values['status']
      let params = {
        ...values,
        status: statusBol ? 1 : 0
      }
      if (!err) {
        this.props.saveSurveyContent(params)
      }
    });
  }

  handleCancel = () => {
    this.props.handleCancelModal()
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, detailData, confirmLoading } = this.props;
    const { surveyTypeList } = this.state;
    return (
      <Modal
        title={<strong><FormattedMessage id="Survey.survey_content" /></strong>}
        visible={visible}
        width={700}
        confirmLoading={confirmLoading}
        maskClosable={false}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okText={<FormattedMessage id="save" />}
      >
        <Form
          {...formItemLayout}
        >
          <Row>
            <Col span={22}>
              <FormItem label={<FormattedMessage id="Survey.title" />}>
                {getFieldDecorator('title', {
                  rules: [
                    {
                      required: true,
                    },
                  ],
                  initialValue: detailData?.title || ''
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={22}>
              <FormItem label={<FormattedMessage id="Survey.label" />}>
                {getFieldDecorator('label', {
                  rules: [
                    {
                      required: true,
                    },
                  ],
                  initialValue: detailData?.label || ''
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={22}>
              <FormItem label={<FormattedMessage id="Survey.show_survey" />}>
                {getFieldDecorator('surveyTypes', {
                  rules: [
                    {
                      required: true,
                    },
                  ],
                  initialValue: detailData?.surveyTypes || []
                })(<Select
                  mode="multiple"
                  className="survey_types"
                  getPopupContainer={() => document.getElementsByClassName('survey_types')[0]}
                >
                  {surveyTypeList.map(item => <Option key={item.id} value={item.name}>{item.name}</Option>)}
                </Select>)}
              </FormItem>
            </Col>
            <Col span={22}>
              <FormItem label={<FormattedMessage id="Survey.description" />}>
                {getFieldDecorator('description', {
                  rules: [
                    {
                      required: true,
                    },
                  ],
                  initialValue: detailData?.description || ''
                })(<TextArea rows={4} />)}
              </FormItem>
            </Col>
            <Col span={22}>
              <FormItem label={<FormattedMessage id="Survey.active" />}>
                {getFieldDecorator('status', {
                  valuePropName: 'checked',
                  initialValue: detailData?.status ? detailData?.status === 1 ? true : false : false
                })(<Switch />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}