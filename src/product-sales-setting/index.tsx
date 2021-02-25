import React, { Component } from 'react';
import { BreadCrumb, SelectGroup, Const, Headline, cache } from 'qmkit';
import { Form, Input, Select, Modal, Button, Radio, message } from 'antd';
import ModalForm from './conponents/modal-form';
import { FormattedMessage } from 'react-intl';
import { querySysDictionary, defaultProductSetting, translateAddBatch, addSysDictionary } from './webapi';
const { Option } = Select;

class ProductSearchSetting extends Component<any, any> {
  state = {
    visible: false,
    disabled: false,
    options: [],
    defaultPurchaseType: '',
    defaultSubscriptionFrequencyId: '',
    language: []
  };
  onFinish = (e: any) => {
    e.preventDefault();
    const { disabled } = this.state;

    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const res: any = await defaultProductSetting(values);
        if (res.res.code === Const.SUCCESS_CODE) {
          message.success(res.res.message);
          let obj = JSON.parse(sessionStorage.getItem(cache.PRODUCT_SALES_SETTING) || '{}');
          sessionStorage.setItem(cache.PRODUCT_SALES_SETTING, JSON.stringify({ ...obj, ...values }));
        }
      }
    });
  };
  componentDidMount() {
    this.querySysDictionary();
  }
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  handleSubmit = () => {
    this.setState(
      {
        visible: false
      },
      () => {
        this.querySysDictionary();
      }
    );
  };

  /**
   * 获取更新频率月｜ 周
   */
  async querySysDictionary() {
    const result = await Promise.all([querySysDictionary({ type: 'Frequency_week' }), querySysDictionary({ type: 'Frequency_month' }), querySysDictionary({ type: 'language' })]);
    let { defaultPurchaseType, defaultSubscriptionFrequencyId, languageId } = JSON.parse(sessionStorage.getItem(cache.PRODUCT_SALES_SETTING) || '{}');
    let weeks = result[0].res.context.sysDictionaryVOS;
    let months = result[1].res.context.sysDictionaryVOS;
    let languageList = result[2].res.context.sysDictionaryVOS;
    let options = [...months, ...weeks];
    let d = languageId.split(',');

    let language = languageList.filter((item) => {
      if (d.includes(item.id.toString())) {
        return item;
      }
    });
    // debugger
    this.setState({
      options,
      defaultPurchaseType,
      defaultSubscriptionFrequencyId,
      language
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { disabled, defaultPurchaseType, visible, defaultSubscriptionFrequencyId, options, language } = this.state;
    return (
      <div style={styles.container}>
        <BreadCrumb />
        <div style={styles.formContainer}>
          <Form name="complex" onSubmit={this.onFinish} labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 15 }}>
            <Form.Item label={<span style={{ color: '#666' }}>Default purchase type</span>}>
              {getFieldDecorator('defaultPurchaseType', {
                initialValue: defaultPurchaseType,
                rules: [
                  {
                    required: true,
                    message: 'Please select purchase type!'
                  }
                ]
              })(
                <Radio.Group disabled={disabled}>
                  <Radio.Button value="One-off" style={{ width: 150, textAlign: 'center' }}>
                    One-off
                  </Radio.Button>
                  <Radio.Button value="Subscription" style={{ width: 150, textAlign: 'center' }}>
                    Subscription
                  </Radio.Button>
                </Radio.Group>
              )}
            </Form.Item>

            <Form.Item label={<span style={{ color: '#666' }}>Default subscription frequency</span>} style={{ marginBottom: 0 }}>
              <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
                {getFieldDecorator('defaultSubscriptionFrequencyId', {
                  initialValue: defaultSubscriptionFrequencyId,
                  rules: [
                    {
                      required: true,
                      message: 'Please select subscription frequency !'
                    }
                  ]
                })(
                  <Select disabled={disabled} placeholder="Please select subscription frequency !">
                    {options.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}>
                <Button type="danger" size="default" onClick={this.showModal} disabled={disabled}>
                  Add new frequency
                </Button>
              </Form.Item>
            </Form.Item>
            <div className="bar-button">
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </div>
          </Form>
        </div>

        <ModalForm visible={visible} languageList={language} handleOk={this.handleSubmit} handleCancel={this.handleCancel} />
      </div>
    );
  }
}
export default Form.create()(ProductSearchSetting);
const styles = {
  container: {
    background: 'rgb(255, 255, 255)',
    height: 'calc(100vh - 170px)'
  },
  formContainer: {
    marginTop: '30px',
    marginLeft: 35
  }
} as any;
