import React from 'react';
import { Button, Checkbox, Col, DatePicker, Form, Input, message, Modal, Radio, Row, Select } from 'antd';
import { cache, ValidConst } from 'qmkit';
const FormItem = Form.Item;
const radioStyle = {
  display: 'flex',
  height: '40px',
  lineHeight: '40px',
  alignItems: 'center'
};
export default class ShippingTypeForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      shippingType: null
    };
  }

  render() {
    const { shippingType } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Radio.Group
        defaultValue={this.props.shippingType ? this.props.shippingType : 1}
        onChange={(e) => {
          this.setState({
            shippingType: e.target.value
          });
          this.props.onChange(e, 'shippingType');
        }}
      >
        <FormItem>
          <Radio style={radioStyle} value={1}>
            All order
          </Radio>
        </FormItem>
        <FormItem>
          <Radio style={radioStyle} value={2}>
            <span>
              Order reach &nbsp;
              {getFieldDecorator('shippingValue', {
                rules: [
                  {
                    required: true,
                    message: 'Value must be entered'
                  },
                  {
                    validator: (_rule, value, callback) => {
                      if (shippingType !== 2) {
                        return;
                      }
                      if (value) {
                        if (!ValidConst.zeroPrice.test(value) || !(value < 10000 && value >= 0)) {
                          callback('0-9999');
                        }
                      }
                      callback();
                    }
                  }
                ],
                initialValue: null
              })(
                <Input
                  style={{ width: 200 }}
                  title={'0-9999'}
                  placeholder={'0-9999'}
                  onChange={(e) => {
                    this.props.onChange(e, 'shippingValue');
                  }}
                  disabled={shippingType !== 2}
                />
              )}
              <span>&nbsp;{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}</span>
            </span>
          </Radio>
        </FormItem>
        <FormItem>
          <Radio style={radioStyle} value={3}>
            <span>
              Order reach &nbsp;
              {getFieldDecorator('shippingItems', {
                rules: [
                  {
                    required: true,
                    message: 'Value must be entered'
                  },
                  {
                    validator: (_rule, value, callback) => {
                      if (shippingType !== 3) {
                        return;
                      }
                      if (value) {
                        if (!ValidConst.zeroNumber.test(value) || !(value < 10000 && value >= 0)) {
                          callback('0-9999');
                        }
                      }
                      callback();
                    }
                  }
                ],
                initialValue: null
              })(<Input style={{ width: 200 }} title={'0-9999'} placeholder={'0-9999'} onChange={(e) => this.props.onChange(e, 'shippingItems')} disabled={shippingType !== 3} />)}
              <span>&nbsp;item</span>
            </span>
          </Radio>
        </FormItem>
      </Radio.Group>
    );
  }
}
