import React, { Component } from 'react';
import { Relax, StoreProvider } from 'plume2';
import '../index.less';
import { noop } from 'qmkit';
// import { Form, Select, Input, Modal } from 'antd';
import { IMap } from 'plume2';
import { List, fromJS, Map } from 'immutable';
import { Form, Icon, Input, Button, Checkbox, Modal, Select } from 'antd';
const FormItem = Form.Item;
const { Option } = Select;
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
  state = {
    okDisabled: false,
    confirmLoading: false,
    codeValidateStatus: 'success'
  };
  props: {
    form: any;
    relaxProps?: {
      isEdit: boolean;
      cityModalVisible: boolean;
      cityForm: any;
      stateNameList: any;
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
    stateNameList: 'stateNameList',
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
    const { setCityModalVisible } = this.props.relaxProps;
    setCityModalVisible(false);
  };

  _validateCode = () => {
    const { cityForm } = this.props.relaxProps;
    const { postCodeArr } = cityForm.toJS();
    let flag = true;
    if (postCodeArr.length > 0) {
      postCodeArr.forEach((item) => {
        if ((item.preCode && !item.suffCode) || (!item.preCode && item.suffCode)) {
          flag = false;
        }
      });
    }
    return flag;
  };
  _handleSubmit = () => {
    this.setState({
      okDisabled: true
    });
    this.props.form.validateFields((err) => {
      if (this._validateCode()) {
        this.setState({
          codeValidateStatus: 'success'
        });
      } else {
        this.setState({
          codeValidateStatus: 'error'
        });
        return;
      }
      if (!err) {
        const { setCityModalVisible, onResetCityForm, cityForm } = this.props.relaxProps;
        const { country, state, city, postCodeArr } = cityForm.toJS();
        this.setState({
          confirmLoading: true
        });
        let arr = [];
        if (postCodeArr.length > 1) {
          postCodeArr.forEach((item) => {
            if (item.preCode && item.suffCode) {
              arr.push(`${item.preCode}-${item.suffCode}`);
            }
          });
        } else {
          if (postCodeArr[0].preCode && postCodeArr[0].suffCode) {
            arr.push(`${postCodeArr[0].preCode}-${postCodeArr[0].suffCode}`);
          } else {
            arr.push('');
          }
        }
        const params = {
          country,
          state,
          city,
          postCodeArr: arr.join(';')
        };
        console.log(params, 'params--------');
        setTimeout(() => {
          this.setState({
            confirmLoading: false
          });
          setCityModalVisible(false);
        }, 4000);
        // onResetCityForm();
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

  _afterClose = () => {
    this.props.form.resetFields();
    this.setState({
      codeValidateStatus: 'success'
    });
    const { onResetCityForm } = this.props.relaxProps;
    onResetCityForm();
  };

  render() {
    const { confirmLoading, codeValidateStatus } = this.state;
    const { onCityFormChange, cityForm, cityModalVisible, stateNameList } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    const { country, state, postCodeArr, city } = cityForm.toJS();
    return (
      <Modal maskClosable={false} title="Add City" visible={cityModalVisible} width={920} confirmLoading={confirmLoading} onCancel={this._handleModelCancel} onOk={this._handleSubmit} afterClose={this._afterClose}>
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
                // <Input
                //   value={state}
                //   onChange={(e) =>
                //     onCityFormChange({
                //       field: 'state',
                //       value: e.target.value
                //     })
                //   }
                // />
                stateNameList.size > 0 ? (
                  <Select
                    // style={{ width: 160 }}
                    defaultValue={state}
                    onChange={(e) => {
                      onCityFormChange({
                        field: 'state',
                        value: e
                      });
                    }}
                  >
                    {stateNameList.toJS().map((item: any, index) => (
                      <Option key={index} value={item.value}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                ) : null
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

            <FormItem {...formItemLayout} label="Code" validateStatus={codeValidateStatus === 'success' ? 'success' : 'error'}>
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
              <span className={`${codeValidateStatus === 'success' ? 'hide' : 'codeStr'}`}>If you fill in one of them, you haveto complete the other.</span>
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  }
}
