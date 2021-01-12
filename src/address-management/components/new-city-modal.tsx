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
      onCityFormChange: Function;
      onResetCityForm: Function;
    };
  };

  static relaxProps = {
    isEdit: 'isEdit',
    cityModalVisible: 'cityModalVisible',
    cityForm: 'cityForm',
    setCityModalVisible: noop,
    resetImageForm: noop,
    onCityFormChange: noop,
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
  _addCode = () => {
    const { cityForm, onCityFormChange } = this.props.relaxProps;
    let postCodeArr = cityForm.toJS().postCodeArr;
    postCodeArr.push({
      id: new Date().getTime(),
      preCode: '',
      suffCode: ''
    });
    onCityFormChange({
      field: 'postCodeArr',
      value: fromJS(postCodeArr)
    });
  };

  _removeCode = (item) => {
    const { cityForm, onCityFormChange } = this.props.relaxProps;
    let postCodeArr = cityForm.toJS().postCodeArr;
    if (postCodeArr.length < 2) {
      return;
    }
    postCodeArr.forEach((code, index) => {
      if (code.id === item.id) {
        postCodeArr.splice(index, 1);
      }
    });
    onCityFormChange({
      field: 'postCodeArr',
      value: fromJS(postCodeArr)
    });
  };
  _codeOnChange = (e, item, field) => {
    const { cityForm, onCityFormChange } = this.props.relaxProps;
    const { postCodeArr } = cityForm.toJS();

    postCodeArr.forEach((code) => {
      if (code.id === item.id) {
        code[field] = e.target.value;
      }
    });
    onCityFormChange({
      field: 'postCodeArr',
      value: fromJS(postCodeArr)
    });
  };
  render() {
    const { onCityFormChange, cityForm, cityModalVisible } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    const { country, state, postCodeArr, city } = cityForm.toJS();
    console.log(postCodeArr, 'postCodeArr-------------');
    return (
      <Modal
        maskClosable={false}
        title="Add City"
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
                  // onChange={(e) =>
                  //   onCityFormChange({
                  //     field: 'country',
                  //     value: e.target.value
                  //   })
                  // }
                  value={country}
                  disabled
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="State name">
              {getFieldDecorator('state', {
                initialValue: state,
                rules: [{ required: true, message: 'Please enter state name.' }]
              })(
                <Input
                  value={state}
                  onChange={(e) =>
                    onCityFormChange({
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
                  value={city}
                  onChange={(e) =>
                    onCityFormChange({
                      field: 'city',
                      value: e.target.value
                    })
                  }
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="Code">
              {postCodeArr.length > 0
                ? postCodeArr.map((item) => (
                    <div className="code-container">
                      <Input value={item.preCode} onChange={(e) => this._codeOnChange(e, item, 'preCode')} />
                      &nbsp;&nbsp;-&nbsp;&nbsp;
                      <Input value={item.suffCode} onChange={(e) => this._codeOnChange(e, item, 'suffCode')} />
                      <div className="iconfont iconjia" onClick={this._addCode}></div>
                      <div className={`iconfont iconjian2 ${postCodeArr.length > 1 ? '' : 'grey-color'}`} onClick={() => this._removeCode(item)}></div>
                    </div>
                  ))
                : null}
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  }
}
