import React from 'react';
import { Form, Input, Modal , message} from 'antd';
import { noop } from 'qmkit';
import { IMap } from 'plume2';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import Button from 'antd/lib/button/button';
import { FormattedMessage, injectIntl } from 'react-intl';

class RejectModal extends React.Component<any, any> {
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
    this.WrapperForm = Form.create({})(injectIntl(RejectForm));
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const { data, onHide, handleOk } = this.props;
    if (!data.get('visible')) {
      return null;
    }

    return (
      <Modal  maskClosable={false}
        title={
          <span>
            <FormattedMessage id="Order.PleaseFillOutThe" />
            {data.get('type')}
            <FormattedMessage id="Order.reason" />
          </span>
        }
        visible={data.get('visible')}
        onCancel={() => onHide()}
        footer={[
          <Button key="back" size="large" onClick={() => onHide()}>
            <FormattedMessage id="Order.btnCancel" />
          </Button>,
          <Button
            key="submit"
            type="primary"
            size="large"
            loading={this.state.posting}
            onClick={() => this._handleOk(handleOk)}
          >
            <FormattedMessage id="Order.btnConfirm" />
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
    const text = RCi18n({id:'Order.reasonIsEmpty'});
    form.validateFields(null, (errs, values) => {
      if (!errs) {
        if(values.reason == null || values.reason.trim() == ''){
          message.error(data.get('type') + text);
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
    const alert1 = RCi18n({id:'Order.pleaseInputReason'}) + ' ' + this.props.formType;
    const alert2 = RCi18n({id:'Order.oneToOneHun'});

    return (
      <Form>
        <FormItem>
          {getFieldDecorator('reason', {
            rules: [
              {
                required: true,
                message: alert1
              },
              {
                min: 1,
                max: 100,
                message: alert2
              }
            ]
          })(<Input.TextArea />)}
        </FormItem>
      </Form>
    );
  }
}

export default injectIntl(RejectModal);
