import React, { Component } from 'react';
import { Relax, StoreProvider } from 'plume2';
import '../index.less';
import { noop } from 'qmkit';
// import { Form, Select, Input, Modal } from 'antd';
import { IMap } from 'plume2';
import { List, fromJS, Map } from 'immutable';
import { Form, Icon, Input, Button, Checkbox, Modal } from 'antd';
const FormItem = Form.Item;
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
const FILE_MAX_SIZE = 2 * 1024 * 1024;

@Relax
export default class NewCityModal extends Component<any, any> {
  // new edit
  _rejectForm;

  WrapperForm: any;

  constructor(props) {
    super(props);
  }
  state = {};
  props: {
    form: any;
    relaxProps?: {
      isEdit: boolean;
      cityModalVisible: boolean;
      cityForm: any;
      setCityModalVisible: Function;
      resetImageForm: Function;
      onStateFormChange: Function;
      onResetCityForm: Function;
    };
  };

  static relaxProps = {
    isEdit: 'isEdit',
    cityModalVisible: 'cityModalVisible',
    cityForm: 'cityForm',
    setCityModalVisible: noop,
    resetImageForm: noop,
    onStateFormChange: noop,
    onResetCityForm: noop
  };
  componentDidMount() {
    const { isEdit } = this.props.relaxProps;
    if (isEdit) {
      //编辑
    }
  }

  _handleModelCancel = () => {
    const { setCityModalVisible, onResetCityForm } = this.props.relaxProps;
    setCityModalVisible(false);
    onResetCityForm();
  };

  _handleSubmit = () => {
    this.props.form.validateFields((err) => {
      if (!err) {
        const { setCityModalVisible, onResetCityForm } = this.props.relaxProps;
        setCityModalVisible(false);
        onResetCityForm();
      }
    });
  };
  render() {
    const { onStateFormChange, cityForm, cityModalVisible } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    const { country, state, postCode, city } = cityForm.toJS();
    return (
      <Modal
        maskClosable={false}
        title="Add state"
        visible={cityModalVisible}
        width={920}
        // confirmLoading={true}
        onCancel={this._handleModelCancel}
        onOk={this._handleSubmit}
      >
        <div>
          <Form>
            <FormItem {...formItemLayout} label="Country name">
              {getFieldDecorator('country', {
                initialValue: country,
                rules: [{ required: true, message: 'Please select country name.' }]
              })(
                <Input
                  onChange={(e) =>
                    onStateFormChange({
                      field: 'country',
                      value: e.target.value
                    })
                  }
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="State name">
              {getFieldDecorator('state', {
                initialValue: state,
                rules: [{ required: true, message: 'Please enter state name.' }]
              })(
                <Input
                  onChange={(e) =>
                    onStateFormChange({
                      field: 'state',
                      value: e.target.value
                    })
                  }
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="City name">
              {getFieldDecorator('city', {
                initialValue: city,
                rules: [{ required: true, message: 'Please enter city name.' }]
              })(
                <Input
                  onChange={(e) =>
                    onStateFormChange({
                      field: 'city',
                      value: e.target.value
                    })
                  }
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="Code">
              {getFieldDecorator('postCode', {
                initialValue: postCode
              })(
                <Input
                  onChange={(e) =>
                    onStateFormChange({
                      field: 'postCode',
                      value: e.target.value
                    })
                  }
                />
              )}
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  }
}
