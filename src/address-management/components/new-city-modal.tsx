import React, { Component } from 'react';
import { Relax, StoreProvider } from 'plume2';
import '../index.less';
import { noop } from 'qmkit';
// import { Form, Select, Input, Modal } from 'antd';
import { IMap } from 'plume2';
import { List, fromJS, Map } from 'immutable';
import { Form, Icon, Input, Button, Checkbox, Modal, Select } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
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
class NewCityModal extends Component<any, any> {
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
      searchState: Function;
      addCity: Function;
      editCity: Function;
    };
    intl: any;
  };

  static relaxProps = {
    isEdit: 'isEdit',
    cityModalVisible: 'cityModalVisible',
    cityForm: 'cityForm',
    stateNameList: 'stateNameList',
    setCityModalVisible: noop,
    resetImageForm: noop,
    onCityFormChange: noop,
    onResetCityForm: noop,
    searchState: noop,
    addCity: noop,
    editCity: noop
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
          codeValidateStatus: <FormattedMessage id="Setting.success" />
        });
      } else {
        this.setState({
          codeValidateStatus: <FormattedMessage id="Setting.error" />
        });
        return;
      }
      if (!err) {
        const { setCityModalVisible, onResetCityForm, cityForm, stateNameList, addCity, editCity } = this.props.relaxProps;
        const { country, state, city, postCodeArr, id } = cityForm.toJS();
        let arr = [];
        this.setState({
          confirmLoading: true
        });
        if (postCodeArr.length > 1) {
          postCodeArr.forEach((item) => {
            if (item.preCode && item.suffCode) {
              arr.push({
                id: item.id,
                postCode: `${item.preCode}-${item.suffCode}`
              });
            }
          });
        } else {
          if (postCodeArr[0].preCode && postCodeArr[0].suffCode) {
            arr.push({
              id: postCodeArr[0].id,
              postCode: `${postCodeArr[0].preCode}-${postCodeArr[0].suffCode}`
            });
          }
        }
        let selectedState = null;
        if (stateNameList.size > 0) {
          selectedState = stateNameList.toJS().find((item) => {
            return item.id === state;
          });
        }
        const params = {
          id,
          countryName: country,
          stateName: selectedState ? selectedState.stateName : null,
          stateId: state,
          cityName: city,
          systemCityPostCodes: arr
        };
        if (id) {
          editCity(params);
        } else {
          addCity(params);
        }
        this.setState({
          confirmLoading: false
        });
        // setTimeout(() => {
        //   this.setState({
        //     confirmLoading: false
        //   });
        //   setCityModalVisible(false);
        // }, 4000);
        // onResetCityForm();
      }
    });
  };
  _addCode = () => {
    const { cityForm, onCityFormChange } = this.props.relaxProps;
    let postCodeArr = cityForm.toJS().postCodeArr;
    postCodeArr.push({
      value: new Date().getTime(),
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
      if (code.value === item.value) {
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
      if (code.value === item.value) {
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
      codeValidateStatus: <FormattedMessage id="Setting.success" />
    });
    const { onResetCityForm } = this.props.relaxProps;
    onResetCityForm();
  };

  render() {
    const { confirmLoading, codeValidateStatus } = this.state;
    const { onCityFormChange, cityForm, cityModalVisible, stateNameList, searchState } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    const { country, state, postCodeArr, city } = cityForm.toJS();
    return (
      <Modal maskClosable={false} title={<FormattedMessage id="Setting.AddCity" />} visible={cityModalVisible} width={920} confirmLoading={confirmLoading} onCancel={this._handleModelCancel} onOk={this._handleSubmit} afterClose={this._afterClose}>
        <div>
          <Form>
            <FormItem {...formItemLayout} label={this.props.intl.formatMessage({ id: 'Setting.Countryname' })}>
              {getFieldDecorator('country', {
                initialValue: country,
                rules: [{ required: true, message: this.props.intl.formatMessage({ id: 'Setting.Pleaseselectcountryname' }) }]
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
            {stateNameList.size > 0 ? (
              <FormItem {...formItemLayout} label={this.props.intl.formatMessage({ id: 'Setting.Statename' })}>
                {getFieldDecorator('state', {
                  initialValue: state,
                  rules: [{ required: true, message: this.props.intl.formatMessage({ id: 'Setting.Pleaseenterstatename' }) }]
                })(
                  <Select
                    // style={{ width: 160 }}
                    // defaultValue={state}
                    showSearch
                    onSearch={(val) => {
                      searchState(val);
                    }}
                    onChange={(e) => {
                      onCityFormChange({
                        field: 'state',
                        value: e
                      });
                    }}
                    value={state}
                  >
                    {stateNameList.toJS().map((item: any, index) => (
                      <Option key={index} value={item.id}>
                        {item.stateName}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            ) : null}

            <FormItem {...formItemLayout} label={this.props.intl.formatMessage({ id: 'Setting.Cityname' })}>
              {getFieldDecorator('city', {
                initialValue: city,
                rules: [{ required: true, message: this.props.intl.formatMessage({ id: 'Setting.Pleaseentercityname' }) }]
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

            <FormItem {...formItemLayout} label={this.props.intl.formatMessage({ id: 'Setting.Code' })} validateStatus={codeValidateStatus === 'success' ? 'success' : 'error'}>
              {postCodeArr.length > 0
                ? postCodeArr.map((item) => (
                    <div className="code-container" key={item.value}>
                      <Input value={item.preCode} onChange={(e) => this._codeOnChange(e, item, 'preCode')} />
                      &nbsp;&nbsp;-&nbsp;&nbsp;
                      <Input value={item.suffCode} onChange={(e) => this._codeOnChange(e, item, 'suffCode')} />
                      <div className="iconfont iconjia" onClick={this._addCode}></div>
                      <div className={`iconfont iconjian2 ${postCodeArr.length > 1 ? '' : 'grey-color'}`} onClick={() => this._removeCode(item)}></div>
                    </div>
                  ))
                : null}
              <span className={`${codeValidateStatus === 'success' ? 'hide' : 'codeStr'}`}>
                <FormattedMessage id="Setting.Ifyoufillin" />
              </span>
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  }
}

export default injectIntl(NewCityModal);
