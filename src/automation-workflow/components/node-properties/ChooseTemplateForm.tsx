import React, { Component } from 'react';
import { Form, Row, Icon, Select, Card, Modal, message, Button } from 'antd';
import * as webapi from '@/automation-workflow/webapi';

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
      selectLoading: false,
      title: 'Preview' + ' ' + 'Template',
      nodeId: ''
    };
    this.onChange = this.onChange.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
  }

  componentDidMount() {
    this.setState({
      selectLoading: true
    });
    webapi
      .getSendGirdTemplates()
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          this.setState({
            lists: res.context.emailTemplateResponseList ? res.context.emailTemplateResponseList : []
          });
          this.setState({
            selectLoading: false
          });
          this.initData(this.props);
        } else {
          message.error(res.message || 'Get Data Failed');
          this.setState({
            selectLoading: false
          });
        }
      })
      .catch((err) => {
        message.error(err || 'Get Data Failed');
        this.setState({
          selectLoading: false
        });
      });
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
    const { updateValue } = this.props;
    this.setState({
      templateId: value
    });
    updateValue('templateId', value);
  }

  handlePreview() {
    const { form } = this.state;
    debugger;
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
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }
  render() {
    const { form, lists, title, modalVisible, previewLoading, emailContent, selectLoading } = this.state;
    return (
      <React.Fragment>
        <FormItem label="Choose an Email template" colon={false}>
          <Icon type="eye" className={'icon-eye' + (!form.selectValue ? ' disable' : '')} onClick={() => this.handlePreview()} />
          <Select
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
            {lists.map((item, index) => (
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
