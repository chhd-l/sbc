import React from 'react';
import { Form, Modal, Radio } from 'antd';
import { noop, RCi18n } from 'qmkit';
import { IMap } from 'plume2';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import Button from 'antd/lib/button/button';
import { FormattedMessage } from 'react-intl';

const RadioGroup = Radio.Group;

export default class ExportModal extends React.Component<any, any> {
  _form: any;
  WrapperForm: any;

  props: {
    data: any;
    onHide: Function;
    handleByParams: Function;
    handleByIds: Function;
  };

  static defaultProps = {
    data: {},
    onHide: noop,
    handleByParams: noop,
    handleByIds: noop
  };

  state = {
    posting: false
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(ExportForm);
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const { data, onHide } = this.props;

    let visible, byParamsTitle, byIdsTitle;
    if (data.get) {
      visible = data.get('visible');
      byParamsTitle = data.get('byParamsTitle');
      byIdsTitle = data.get('byIdsTitle');
    } else {
      visible = data.visible;
      byParamsTitle = data.byParamsTitle;
      byIdsTitle = data.byIdsTitle;
    }

    if (!visible) {
      return null;
    }

    return (
      <Modal
        maskClosable={false}
        title={<FormattedMessage id="Public.Batch Export" />}
        visible={visible}
        onCancel={() => onHide()}
        footer={[
          <Button key="back" size="large" onClick={() => onHide()}>
            <FormattedMessage id="Public.Cancel" />
          </Button>,
          <Button
            key="submit"
            type="primary"
            size="large"
            loading={this.state.posting}
            onClick={() => this._handleOk()}
          >
            <FormattedMessage id="Public.Export" />
          </Button>
        ]}
      >
        <WrapperForm
          ref={(form) => (this['_form'] = form)}
          {...{
            byParamsTitle: byParamsTitle,
            byIdsTitle: byIdsTitle
          }}
        />

      </Modal>
    );
  }

  _handleOk() {
    const { onHide, handleByParams, handleByIds } = this.props;
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      if (!errs) {
        this.setState({ posting: true });
        const callback =
          values.exportType === 'byParams' ? handleByParams : handleByIds;
        callback().then(() => {
          this.setState({ posting: false });
          onHide();
        });
      }
    });
  }
}

const FormItem = Form.Item;

/**
 * ???????????? form
 */
class ExportForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Form style={{ marginLeft: 50 }}>
          <FormItem >
            {getFieldDecorator('exportType', {
              rules: [
                {
                  required: true,
                  message: RCi18n({id:"Order.Pleaseselectanexportmethod"})
                }
              ]
            })(
              <RadioGroup>
                <Radio value="byParams">{this.props.byParamsTitle}</Radio>
                <Radio value="byIds">{this.props.byIdsTitle}</Radio>
              </RadioGroup>
            )}
          </FormItem>

        </Form>
        <p style={{ color: '#e2001a', lineHeight: 0.5 }}><FormattedMessage id="Public.Reminder100records" /></p>
      </div>

    );
  }
}
