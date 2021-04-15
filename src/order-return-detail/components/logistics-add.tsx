import React from 'react';
import { Relax } from 'plume2';
import { Form, Input, Select, DatePicker } from 'antd';
import { RCi18n } from 'qmkit';

const FormItem = Form.Item;

@Relax
export default class LogisticsAdd extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    const ReceiveFormDetail = Form.create({})(ReceiveForm);
    return (
      <div style={styles.container}>
        <ReceiveFormDetail />
      </div>
    );
  }
}

class ReceiveForm extends React.Component<any, any> {
  state = {
    confirmDirty: false
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(() => {});
  };

  checkConfirm = (_rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 2,
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        span: 24,
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label={RCi18n({id:'Order.LogisticsCompany'})} hasFeedback>
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: RCi18n({id:'Order.ruturnOrder.verifyTip1'})
              },
              {
                required: true,
                message: RCi18n({id:'Order.ruturnOrder.verifyTip2'})
              }
            ]
          })(<Select />)}
        </FormItem>
        <FormItem {...formItemLayout} label={RCi18n({id:'Order.returnOrder.logisticsNumber'})} hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: RCi18n({id:'Order.ruturnOrder.verifyTip3'})
              },
              {
                validator: this.checkConfirm
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label={RCi18n({id:'Order.returnOrder.returnDate'})} hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: RCi18n({id:'Order.ruturnOrder.verifyTip3'})
              },
              {
                validator: this.checkConfirm
              }
            ]
          })(<DatePicker />)}
        </FormItem>
      </Form>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 10
  },

  text: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
} as any;
