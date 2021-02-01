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
        calculateTax: '',
        enterPrice: '',
        rewardCalculation: '',
        promotionCalculation: ''
      },

      zoneList: []
    };
  }
  componentDidMount() {}

  static getDerivedStateFromProps(props, state) {
    // 当传入的值发生变化的时候，更新state
    if (props.visible !== state.visible) {
      return {
        visible: props.visible
      };
    }

    return null;
  }

  handleSubmit = () => {
    this.props.closeFunction();
  };

  handleCancel = () => {
    this.props.closeFunction();
  };
  getSettingForm = () => {
    let settingForm = {
      calculateTax: 'shippingAddress',
      enterPrice: 'inclusiveOfTax',
      rewardCalculation: 'inclusiveOfTax',
      promotionCalculation: 'inclusiveOfTax'
    };
    this.setState({
      settingForm
    });
  };

  onSettingFormChange = ({ field, value }) => {
    let data = this.state.taxForm;
    data[field] = value;
    this.setState({
      taxForm: data
    });
  };

  render() {
    const { visible, loading, settingForm } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
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
                <Radio value="shippingAddress">Shipping address</Radio>
                <Radio value="billingAddress">Billing address</Radio>
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
                <Radio value="inclusiveOfTax">Inclusive of tax</Radio>
                <Radio value="exclusiveOfTax">Exclusive of tax</Radio>
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
                <Radio value="inclusiveOfTax">Inclusive of tax</Radio>
                <Radio value="exclusiveOfTax">Exclusive of tax</Radio>
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
                <Radio value="inclusiveOfTax">Inclusive of tax</Radio>
                <Radio value="exclusiveOfTax">Exclusive of tax</Radio>
              </Radio.Group>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
export default Form.create()(TaxesAdd);
