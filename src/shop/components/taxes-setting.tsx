import React from 'react';
import { Button, Modal, Form, Radio, Input, Select, Spin, InputNumber } from 'antd';
import _ from 'lodash';

const FormItem = Form.Item;
const Option = Select.Option;
class TaxesAdd extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      settingForm: {
        calculateTax: 0,
        enterPrice: 0,
        rewardCalculation: 0,
        promotionCalculation: 0
      },

      zoneList: []
    };
  }
  componentDidMount() {}

  static getDerivedStateFromProps(props, state) {
    // 当传入的值发生变化的时候，更新state
    if (props.visible !== state.visible) {
      return {
        visible: props.visible,
        settingForm: props.settingForm
      };
    }

    return null;
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { settingForm } = this.state;
        this.props.submitFunction(settingForm);
      }
    });
  };

  handleCancel = () => {
    this.props.closeFunction();
  };

  onSettingFormChange = ({ field, value }) => {
    let data = this.state.settingForm;
    data[field] = value;
    this.setState({
      taxForm: data
    });
  };

  render() {
    const { visible, loading, settingForm } = this.state;
    const { getFieldDecorator } = this.props.form;
    this.props.form.resetFields();
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 9 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };
    return (
      <Modal
        width={600}
        maskClosable={false}
        zIndex={1000}
        title="Tax setting"
        visible={visible}
        confirmLoading={loading}
        onCancel={() => this.handleCancel()}
        footer={[
          <Button
            key="back"
            onClick={() => {
              this.handleCancel();
            }}
          >
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => this.handleSubmit()}>
            Submit
          </Button>
        ]}
      >
        <Form {...formItemLayout}>
          <FormItem label="Calculate Tax Based on ">
            {getFieldDecorator('calculateTax', {
              initialValue: settingForm.calculateTax,
              rules: [{ required: true, message: 'Please selected Calculate Tax Based on' }]
            })(
              <Radio.Group
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.onSettingFormChange({
                    field: 'calculateTax',
                    value
                  });
                }}
              >
                <Radio value={0}>Shipping address</Radio>
                <Radio value={1}>Billing address</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="Enter price">
            {getFieldDecorator('enterPrice', {
              initialValue: settingForm.enterPrice,
              rules: [{ required: true, message: 'Please selected enter price' }]
            })(
              <Radio.Group
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.onSettingFormChange({
                    field: 'enterPrice',
                    value
                  });
                }}
              >
                <Radio value={0}>Inclusive of tax</Radio>
                <Radio value={1}>Exclusive of tax</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="Reward calculation">
            {getFieldDecorator('rewardCalculation', {
              initialValue: settingForm.rewardCalculation,
              rules: [{ required: true, message: 'Please selected reward calculation' }]
            })(
              <Radio.Group
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.onSettingFormChange({
                    field: 'rewardCalculation',
                    value
                  });
                }}
              >
                <Radio value={0}>Inclusive of tax</Radio>
                <Radio value={1}>Exclusive of tax</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="Promotion calculation">
            {getFieldDecorator('promotionCalculation', {
              initialValue: settingForm.promotionCalculation,
              rules: [{ required: true, message: 'Please selected promotion calculation' }]
            })(
              <Radio.Group
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.onSettingFormChange({
                    field: 'promotionCalculation',
                    value
                  });
                }}
              >
                <Radio value={0}>Inclusive of tax</Radio>
                <Radio value={1}>Exclusive of tax</Radio>
              </Radio.Group>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
export default Form.create()(TaxesAdd);
