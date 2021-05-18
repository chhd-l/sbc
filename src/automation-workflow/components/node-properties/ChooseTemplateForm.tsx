import React, { Component } from 'react';
import { Form, Row, Icon, Select, Card, Modal, message, Button } from 'antd';
import * as webapi from '@/automation-workflow/webapi';
import { FormattedMessage, injectIntl } from 'react-intl';

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
      emailContent: '',
      previewLoading: false,
      title: 'Preview' + ' ' + 'Template',
      nodeId: ''
    };
    this.onChange = this.onChange.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
  }

  componentDidMount() {
    this.initData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initData(nextProps);
  }

  initData(nextProps) {
    if (this.state.nodeId === nextProps.nodeId) {
      return;
    } else {
      this.setState({
        nodeId: nextProps.nodeId
      });
    }
    const { templateId } = nextProps;
    this.setState({
      form: {
        selectValue: templateId ? templateId : undefined
      }
    });
  }

  onChange(value) {
    const { updateValue, templateList } = this.props;
    let template = templateList.find((x) => x.templateId === value);
    this.setState({
      form: {
        selectValue: value
      }
    });
    updateValue('templateId', value);
    updateValue('templateName', template.emailTemplate);
  }

  handlePreview() {
    const { form } = this.state;
    if (!form.selectValue) {
      return;
    }
    this.setState({
      previewLoading: true,
      modalVisible: true
    });
    webapi
      .getSendGridTemplateById({ templateId: form.selectValue })
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          this.setState({
            previewLoading: false,
            emailContent: res.context.emailTemplateHtml
          });
        } else {
          message.error(res.message || <FormattedMessage id="Public.GetDataFailed"/>);
          this.setState({
            previewLoading: false
          });
        }
      })
      .catch((err) => {
        message.error(err || <FormattedMessage id="Public.GetDataFailed"/>);
        this.setState({
          previewLoading: false
        });
      });
  }
  filterOption(input, option) {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }
  render() {
    const { form, title, modalVisible, previewLoading, emailContent, selectLoading } = this.state;
    const { templateList } = this.props;
    return (
      <React.Fragment>
        <FormItem label="Choose an Email template" colon={false}>
          <Icon type="eye" className={'icon-eye' + (!form.selectValue ? ' disable' : '')} onClick={() => this.handlePreview()} />
          <Select
            allowClear
            onChange={(value) => {
              this.onChange(value);
            }}
            loading={selectLoading}
            dropdownClassName="normalSelect"
            showSearch
            placeholder="Please select template"
            value={form.selectValue}
            optionFilterProp="children"
            filterOption={this.filterOption}
          >
            {templateList.map((item, index) => (
              <Option value={item.templateId} key={index}>
                {item.emailTemplate}
              </Option>
            ))}
          </Select>
        </FormItem>
        <Modal
          footer={[
            <Button type="primary" className="ui-white" onClick={() => this.setState({ modalVisible: false })}>
              OK
            </Button>
          ]}
          title={title}
          onCancel={() => this.setState({ modalVisible: false })}
          visible={modalVisible}
          maskClosable={false}
          className="previewModal"
          width="850px"
        >
          <Card bordered={false} loading={previewLoading} className="previewCard">
            <iframe ref="previewIframe" srcDoc={emailContent} width="100%" height="700px" frameBorder="0"></iframe>
          </Card>
        </Modal>
      </React.Fragment>
    );
  }
}
