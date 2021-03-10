import React, { Component } from 'react';
import { Form, Row, Col, Input, Radio, TimePicker, DatePicker, InputNumber, Select, Card, Modal, message, Button } from 'antd';
import * as webapi from '@/automation-workflow/webapi';
import List from 'wangeditor/dist/menus/list';

const FormItem = Form.Item;
const { Option } = Select;
export default class ChooseTemplataeForm extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        selectValue: undefined
      },
      modalVisible: false,
      lists: [],
      emailContent: '',
      previewLoading: false,
      title: 'Preview' + ' ' + 'Template'
    };
    this.onChange = this.onChange.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
  }

  componentDidMount() {
    const { templateId } = this.props;
    webapi
      .getSendGirdTemplates()
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          this.setState({
            lists: res.context
          });
          this.setState({
            form: {
              selectValue: templateId ? templateId : undefined
            }
          });
        } else {
          message.error(res.message || 'Get Data Failed');
        }
      })
      .catch((err) => {
        message.error(err || 'Get Data Failed');
      });
  }

  onChange(value) {
    const { updateValue } = this.props;
    updateValue('eventType', value);
  }

  handlePreview() {
    const { form } = this.state;
    if (!form.selectValue) {
      return;
    }
    this.setState({
      previewLoading: true
    });
    webapi
      .getSendGridTemplateById({ templateId: form.selectValue })
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          this.setState({
            previewLoading: false
          });
        } else {
          message.error(res.message || 'Get Data Failed');
          this.setState({
            previewLoading: false
          });
        }
      })
      .catch((err) => {
        message.error(err || 'Get Data Failed');
        this.setState({
          previewLoading: false
        });
      });
  }
  filterOption(input, option) {
    return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }
  render() {
    const { form, lists, title, modalVisible, previewLoading, emailContent } = this.state;
    return (
      <React.Fragment>
        <FormItem label="Choose an Email template" colon={false}>
          <span className={'iconfont icon-eye' + !form.selectValue ? 'disable' : ''} onClick={() => this.handlePreview} />
          <Select showSearch placeholder="Please select template" value={form.selectValue} optionFilterProp="children" filterOption={this.filterOption}>
            {lists.map((item, index) => (
              <Option value={item.templateId} key={index}>
                {item.name}
              </Option>
            ))}
          </Select>
        </FormItem>
        <Modal title={title} visible={modalVisible} maskClosable={false} className="previewModal" width="700px">
          <Card bordered={false} loading={previewLoading} className="previewCard">
            <iframe v-if="nodeType === 'SendEmail'" ref="previewIframe" srcDoc={emailContent} width="100%" height="700px" frameBorder="0"></iframe>
            <p v-else v-html="content"></p>
          </Card>
          <Row slot="footer">
            <Button type="primary" className="ui-white" onClick={() => this.setState({ modalVisible: false })}>
              OK
            </Button>
          </Row>
        </Modal>
      </React.Fragment>
    );
  }
}
