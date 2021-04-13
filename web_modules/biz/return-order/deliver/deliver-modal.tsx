import React from 'react';
import { Button, DatePicker, Form, Input, Select, Modal } from 'antd';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import { FormattedMessage, injectIntl } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;

@StoreProvider(AppStore, { debug: __DEV__ })
class DeliverModal extends React.Component<any, any> {
  store: AppStore;
  _form: any;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(DeliverForm);
  }

  state = {
    posting: false
  };

  componentDidMount() {
    this.store.init();
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const { data, onHide, handleOk } = this.props;
    if (!data.get('visible')) {
      return null;
    }

    return (
      <Modal  maskClosable={false}
        title={<FormattedMessage id="Order.FillLogisticsInformation" />}
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
          intl={this.props.intl}
          ref={(form) => (this['_form'] = form)}
          {...{
            formType: data.get('type'),
            logisticCompanyList: this.store.state().get('logisticCompanyList')
          }}
        />
      </Modal>
    );
  }

  _handleOk(handleOk: Function) {
    const { data, onHide } = this.props;
    this._form.validateFields(null, (errs, values) => {
      if (!errs) {
        values.date = values.date.format('YYYY-MM-DD HH:mm:ss');
        this.setState({ posting: true });
        // 找到物流公司code对应的名称
        values.logisticCompany = this.store
          .state()
          .get('logisticCompanyList')
          .find(
            (c) =>
              c.getIn(['expressCompany', 'expressCode']) ==
              values.logisticCompanyCode
          )
          .getIn(['expressCompany', 'expressName']);
        handleOk(data.get('rid'), values).then(() => {
          this.setState({ posting: false });
          onHide();
        });
      }
    });
  }
}

class DeliverForm extends React.Component<any, any> {
  checkConfirm = (_rule, value, callback) => {
    const form = this.props.form;
    if (value) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  render() {
    let { logisticCompanyList } = this.props;
    logisticCompanyList = logisticCompanyList ? logisticCompanyList.toJS() : [];
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 2,
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        span: 24,
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };

    return (
      <Form>
        <FormItem {...formItemLayout} label={<FormattedMessage id="Order.LogisticsCompany" />} hasFeedback>
          {getFieldDecorator('logisticCompanyCode', {
            rules: [
              {
                required: true,
                message: this.props.intl.formatMessage({id:'Order.selectLogisticsCompany'})
              }
            ]
          })(
            <Select>
              {logisticCompanyList.map((company) => {
                return (
                  <Option
                    key={company.expressCompany.expressCompanyId}
                    value={company.expressCompany.expressCode}
                  >
                    {company.expressCompany.expressName}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={<FormattedMessage id="Order.LogisticsOrder" />} hasFeedback>
          {getFieldDecorator('logisticNo', {
            rules: [
              {
                required: true,
                message: this.props.intl.formatMessage({id:'Order.inputLogisticsOrder'})
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label={<FormattedMessage id="Order.Refund date" />} hasFeedback>
          {getFieldDecorator('date', {
            rules: [
              {
                required: true,
                message: this.props.intl.formatMessage({id:'Order.fillreturndate'})
              }
            ]
          })(<DatePicker disabledDate={this.disabledDate} />)}
        </FormItem>
      </Form>
    );
  }

  disabledDate(current) {
    // Can not select days before today and today
    return current && current.valueOf() > Date.now();
  }
}

export default injectIntl(DeliverModal)
