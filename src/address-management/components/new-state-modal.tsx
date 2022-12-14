import React, { Component } from 'react';
import { Relax, StoreProvider } from 'plume2';
import '../index.less';
import { FormattedMessage } from 'react-intl';
import { cache, Const, noop, SelectGroup } from 'qmkit';
import * as webapi from '../webapi';
import { Form, Select, Input, Button, Table, Divider, message, Checkbox, Pagination, Spin, Tooltip, Modal, Rate, TreeSelect, Icon, Upload, Tree } from 'antd';
import { IMap } from 'plume2';
import { List, fromJS, Map } from 'immutable';

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const Dragger = Upload.Dragger;
const Option = Select.Option;
type TList = List<IMap>;
const confirm = Modal.confirm;
const ButtonGroup = Button.Group;
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
export default class NewStateModal extends Component<any, any> {
  // new edit
  _rejectForm;

  WrapperForm: any;

  constructor(props) {
    super(props);
  }
  state = {
    okDisabled: false,
    codeValidateStatus: 'success'
  };
  props: {
    form: any;
    relaxProps?: {
      isEdit: boolean;
      modalVisible: boolean;
      stateForm: any;
      confirmLoading: boolean;
      setStateModalVisible: Function;
      resetImageForm: Function;
      onStateFormChange: Function;
      onResetStateForm: Function;
      addState: Function;
      editState: Function;
    };
  };

  static relaxProps = {
    isEdit: 'isEdit',
    modalVisible: 'modalVisible',
    stateForm: 'stateForm',
    confirmLoading: 'confirmLoading',
    setStateModalVisible: noop,
    resetImageForm: noop,
    onStateFormChange: noop,
    onResetStateForm: noop,
    addState: noop,
    editState: noop
  };
  componentDidMount() {
    const { isEdit } = this.props.relaxProps;
    if (isEdit) {
      //编辑
    }
  }

  _handleModelCancel = () => {
    const { setStateModalVisible } = this.props.relaxProps;
    setStateModalVisible(false);
  };

  _validateCode = () => {
    const { stateForm } = this.props.relaxProps;
    const { postCodeArr } = stateForm.toJS();
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
    const { addState, isEdit, editState } = this.props.relaxProps;
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
        const { setStateModalVisible, onResetStateForm, stateForm } = this.props.relaxProps;
        const { id, country, state, abbreviation, postCodeArr } = stateForm.toJS();
        let arr = [];
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
        const params = {
          id,
          countryName: country,
          stateName: state,
          abbreviation: abbreviation,
          // "stateNo": "string",
          systemStatePostCodes: arr
        };
        if (id) {
          editState(params);
        } else {
          addState(params);
        }
        // setTimeout(() => {
        //   this.setState({
        //     confirmLoading: false
        //   });
        //   setStateModalVisible(false);
        // }, 4000);
        // onResetStateForm();
      }
    });
  };

  _addCode = () => {
    const { stateForm, onStateFormChange } = this.props.relaxProps;
    let postCodeArr = stateForm.toJS().postCodeArr;
    postCodeArr.push({
      value: new Date().getTime(),
      preCode: '',
      suffCode: ''
    });
    onStateFormChange({
      field: 'postCodeArr',
      value: fromJS(postCodeArr)
    });
  };

  _removeCode = (item) => {
    const { stateForm, onStateFormChange } = this.props.relaxProps;
    let postCodeArr = stateForm.toJS().postCodeArr;
    if (postCodeArr.length < 2) {
      return;
    }
    postCodeArr.forEach((code, index) => {
      if (code.value === item.value) {
        postCodeArr.splice(index, 1);
      }
    });
    onStateFormChange({
      field: 'postCodeArr',
      value: fromJS(postCodeArr)
    });
  };
  _codeOnChange = (e, item, field) => {
    const { stateForm, onStateFormChange } = this.props.relaxProps;
    const { postCodeArr } = stateForm.toJS();

    postCodeArr.forEach((code) => {
      if (code.value === item.value) {
        code[field] = e.target.value;
      }
    });
    onStateFormChange({
      field: 'postCodeArr',
      value: fromJS(postCodeArr)
    });
  };

  _afterClose = () => {
    this.props.form.resetFields();
    const { onResetStateForm } = this.props.relaxProps;
    this.setState({
      codeValidateStatus: 'success'
    });
    onResetStateForm();
  };
  render() {
    const { codeValidateStatus } = this.state;
    const { modalVisible, onStateFormChange, stateForm, confirmLoading } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    const { id, country, state, abbreviation, postCodeArr } = stateForm.toJS();
    return (
      <Modal maskClosable={false} title={id ? 'Edit State' : 'Add State'} visible={modalVisible} width={920} confirmLoading={confirmLoading} onCancel={this._handleModelCancel} onOk={this._handleSubmit} afterClose={this._afterClose}>
        <div>
          <Form>
            <FormItem {...formItemLayout} label="Country name">
              {getFieldDecorator('country', {
                initialValue: country
                // rules: [{ required: true, message: 'Please select country name.' }]
              })(
                <Input
                  // onChange={(e) =>
                  //   onStateFormChange({
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
                    onStateFormChange({
                      field: 'state',
                      value: e.target.value
                    })
                  }
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Abbreviation">
              {getFieldDecorator('abbreviation', {
                initialValue: abbreviation
              })(
                <Input
                  value={abbreviation}
                  onChange={(e) =>
                    onStateFormChange({
                      field: 'abbreviation',
                      value: e.target.value
                    })
                  }
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Code"
              validateStatus={codeValidateStatus === 'success' ? 'success' : 'error'}
              // validateStatus="success"
            >
              {postCodeArr.length > 0
                ? postCodeArr.map((item) => (
                    <span className="code-container">
                      <Input value={item.preCode} onChange={(e) => this._codeOnChange(e, item, 'preCode')} />
                      &nbsp;&nbsp;-&nbsp;&nbsp;
                      <Input value={item.suffCode} onChange={(e) => this._codeOnChange(e, item, 'suffCode')} />
                      <span className="iconfont iconjia" onClick={this._addCode}></span>
                      <span className={`iconfont iconjian2 ${postCodeArr.length > 1 ? '' : 'grey-color'}`} onClick={() => this._removeCode(item)}></span>
                    </span>
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
