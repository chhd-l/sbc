import React from 'react';
import { Alert, Button, Form, Input, Modal } from 'antd';

import { ValidConst } from 'qmkit';

const FormItem = Form.Item;

export default class OnlineRefundModal extends React.Component<any, any> {
  _form: any;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(OnlineRefundModalForm);
  }

  state = {
    posting: false
  };

  render() {
    const WrapperForm = this.WrapperForm;
    const { data, onHide } = this.props;
    const handleOk = data.get('onOk');

    if (!data.get('visible')) return null;

    return (
      <Modal  maskClosable={false}
        title="Refund"
        visible={data.get('visible')}
        onCancel={() => onHide()}
        footer={[
          <Button key="back" size="large" onClick={() => onHide()}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            size="large"
            loading={this.state.posting}
            onClick={() => this._handleOk(handleOk)}
          >
            Save
          </Button>
        ]}
      >
        <WrapperForm
          ref={form => (this['_form'] = form)}
          {...{ formType: data.get('type') }}
          data={data}
        />
      </Modal>
    );
  }

  _handleOk(handleOk: Function) {
    const { data, onHide } = this.props;
    this._form.validateFields(null, (errs, values) => {
      if (!errs) {
        handleOk(data.get('rid'), values).then(() => {
          this.setState({ posting: false });
          onHide();
        });
      }
    });
  }
}

/**
 * 在线退单form
 */
class OnlineRefundModalForm extends React.Component<any, any> {

  constructor(props) {
    super(props);
    this.state = {
      //编辑退单
      editRefund: false,
      refund:
        props.data.get('refundAmount') &&
        props.data.get('refundAmount').toFixed(2),
      actualReturnPrice: props.data.get('refundAmount'),
      applyPoints: props.data.get('applyPoints') || 0
    };
  }

  props: {
    form: any;
    refundAmount: number;
    data: any;
    applyPoints: number;
  };

  checkConfirm = (_rule, value, callback) => {
    const form = this.props.form;
    if (value) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const data = this.props.data;
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

    const commentRules = [
      {
        min: 1,
        max: 100,
        message: '1-100字'
      }
    ];

    return (
      <div>
        <Alert
          style={{ marginBottom: 10 }}
          message={
            <div>
              <p>
                After clicking save, the platform will return the money to the customer according to the confirmed amount, and the corresponding points will be returned at the same time. Please input the reason for modifying the refund amount to the refund remark.
              </p>
              {/* <p>点击保存后，平台将按照确认的金额将款项返还给客户，对应积分同时进行返还。</p>
              <p>修改退款金额请将修改原因填写至退款备注。</p> */}
            </div>
          }
          type="info"
        />
        <Form>
          <FormItem {...formItemLayout} label="Refund amount">
            {getFieldDecorator('actualReturnPrice', {
              initialValue: data.get('refundAmount'),
              rules: [
                {
                  required: true,
                  message: '请填写退款金额'
                },
                {
                  pattern: ValidConst.zeroPrice,
                  message: '请填写两位小数的合法金额'
                }
              ]
            })(
              <Input
                type="hidden"
                onChange={e => {
                  this.setState({ refund: (e.target as any).value });
                  this.props.form.setFieldsValue({
                    actualReturnPrice: (e.target as any).value
                  });
                }}
                // value={this.state.refund}
              />
            )}
            {this.state.editRefund ? (
              <Input
                style={{ width: 150, marginRight: 10 }}
                onChange={e => {
                  this.setState({ refund: (e.target as any).value });
                  this.props.form.setFieldsValue({
                    actualReturnPrice: (e.target as any).value
                  });
                }}
                // value={this.state.refund}
              />
            ) : (
              <label style={{ marginRight: 10 }}>
                {data.get('refundAmount')}
              </label>
            )}
            <Button
              onClick={() => {
                this.setState({ editRefund: !this.state.editRefund }, () => {
                  if (!this.state.editRefund) {
                    this.props.form.setFieldsValue({
                      actualReturnPrice: data.get('refundAmount')
                    });
                    this.setState({ refund: data.get('refundAmount') });
                  }
                });
              }}
            >
              {this.state.editRefund ? '放弃修改' : 'Edit'}
            </Button>
          </FormItem>
          <FormItem {...formItemLayout} label="Refund points">
            {getFieldDecorator('actualReturnPoints', {
              initialValue: this.state.applyPoints ,
            })(<Input type="hidden"/>)}
            <label style={{marginRight: 10}}>
              {this.state.applyPoints &&
              this.state.applyPoints ||
              Number(0)}
            </label>
          </FormItem>
          <FormItem {...formItemLayout} label="Refund remark" hasFeedback>
            {getFieldDecorator('refundComment', {
              rules: commentRules
            })(<Input.TextArea placeholder="Please input refund remark" />)}
          </FormItem>
        </Form>
      </div>
    );
  }
}
