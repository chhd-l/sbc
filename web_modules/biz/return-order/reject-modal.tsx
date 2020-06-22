import React from 'react';
import { Form, Input, Modal , message} from 'antd';
import { noop } from 'qmkit';
import { IMap } from 'plume2';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import Button from 'antd/lib/button/button';

export default class RejectModal extends React.Component<any, any> {
  _form: any;
  WrapperForm: any;

  props: {
    data: IMap;
    onHide: Function;
    handleOk: Function;
  };

  static defaultProps = {
    data: {},
    onHide: noop,
    handleOk: noop
  };

  state = {
    posting: false
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(RejectForm);
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const { data, onHide, handleOk } = this.props;
    if (!data.get('visible')) {
      return null;
    }

    return (
      <Modal  maskClosable={false}
        title={'Please fill out the ' + data.get('type') + ' reason'}
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
            Confirm
          </Button>
        ]}
      >
        <WrapperForm   
          ref={form => (this['_form'] = form)}
          {...{ formType: data.get('type') }}
        />
      </Modal>
    );
  }

  _handleOk(handleOk: Function) {
    const { data, onHide } = this.props;
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      if (!errs) {
        if(values.reason == null || values.reason.trim() == ''){
          message.error(data.get('type') + '原因不可为空！');
          return;
        }
        this.setState({ posting: true });
        handleOk(data.get('rid'), values.reason).then(() => {
          this.setState({ posting: false });
          onHide();
        });
      }
    });
  }
}

const FormItem = Form.Item;

/**
 * 驳回，拒绝收货，拒绝退款等通用form，只包含一个拒绝原因输入框
 */
class RejectForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form>
        <FormItem>
          {getFieldDecorator('reason', {
            rules: [
              {
                required: true,
                message: 'Please fill in the reason for ' + this.props.formType
              },
              {
                min: 1,
                max: 100,
                message: '1-100字'
              }
            ]
          })(<Input.TextArea />)}
        </FormItem>
      </Form>
    );
  }
}
