import React, { Component } from 'react';
import { Alert, Col, Form, Input, message, Modal, Radio, Row, Select, Tree, TreeSelect } from 'antd';
import * as webapi from '../webapi';
const FormItem = Form.Item;
const Option = Select.Option;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10 }
};

export default class Interaction extends React.Component<any, any> {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      interaction: 0,
      pageList: []
    };
    this.radioChange = this.radioChange.bind(this);
    this.getPageTypes = this.getPageTypes.bind(this);
  }

  componentDidMount() {
    this.getPageTypes();
  }

  radioChange(e) {
    this.props.addField('interaction', e.target.value);
  }
  getPageTypes() {
    webapi
      .querySysDictionary({ type: 'pageType' })
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          let pageList = res.context.sysDictionaryVOS;
          this.setState({
            pageList
          });
        } else {
          message.error(res.message || 'Get data failed');
        }
      })
      .catch((err) => {
        message.error('Get data failed');
      });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { pageList } = this.state;
    return (
      <div>
        <h3>Step3</h3>
        <h4>
          Interaction Type<span className="ant-form-item-required"></span>
        </h4>
        <div className="interaction">
          <Form>
            <FormItem>
              <Radio.Group onChange={this.radioChange} size="large">
                <Radio value={0}>Page</Radio>
                <Radio value={1}>External URL</Radio>
              </Radio.Group>
            </FormItem>

            <FormItem {...layout} label="Page">
              {getFieldDecorator('pageId', {
                rules: [{ required: true, message: 'Please select page' }]
              })(
                <Select
                  onChange={(value) => {
                    value = value === '' ? null : value;
                    this.props.addField('pageId', value);
                  }}
                >
                  {pageList &&
                    pageList.map((item, index) => (
                      <Option value={item.id} key={index}>
                        {item.name}
                      </Option>
                    ))}
                </Select>
              )}
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}
