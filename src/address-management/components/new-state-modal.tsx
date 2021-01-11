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
  state = {};
  props: {
    form: any;
    relaxProps?: {
      isEdit: boolean;
      modalVisible: boolean;
      stateForm: any;
      setStateModalVisible: Function;
      resetImageForm: Function;
      onStateFormChange: Function;
      onResetStateForm: Function;
    };
  };

  static relaxProps = {
    isEdit: 'isEdit',
    modalVisible: 'modalVisible',
    stateForm: 'stateForm',
    setStateModalVisible: noop,
    resetImageForm: noop,
    onStateFormChange: noop,
    onResetStateForm: noop
  };
  componentDidMount() {
    const { isEdit } = this.props.relaxProps;
    if (isEdit) {
      //编辑
    }
  }

  _handleModelCancel = () => {
    const { setStateModalVisible, onResetStateForm } = this.props.relaxProps;
    setStateModalVisible(false);
    onResetStateForm();
  };

  _handleSubmit = () => {
    this.props.form.validateFields((err) => {
      if (!err) {
        const { setStateModalVisible, onResetStateForm } = this.props.relaxProps;
        setStateModalVisible(false);
        onResetStateForm();
      }
    });
  };

  _addCode = () => {
    const { stateForm, onStateFormChange } = this.props.relaxProps;
    let postCodeArr = stateForm.toJS().postCodeArr;
    postCodeArr.push({
      id: new Date().getTime(),
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
      if (code.id === item.id) {
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
      if (code.id === item.id) {
        code[field] = e.target.value;
      }
    });
    onStateFormChange({
      field: 'postCodeArr',
      value: fromJS(postCodeArr)
    });
  };
  render() {
    const { modalVisible, onStateFormChange, stateForm } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;

    console.log(stateForm.toJS(), 'ddddddddddddd');
    const { country, state, postCodeArr } = stateForm.toJS();
    console.log(postCodeArr, 'postCodeArr-------------');
    return (
      <Modal
        maskClosable={false}
        title="Add state"
        visible={modalVisible}
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
