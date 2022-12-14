import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form } from 'antd';
import { noop, util } from 'qmkit';
import EditForm from './edit-form';
import { WrappedFormUtils } from 'antd/lib/form/Form';
const WrapperForm = Form.create()(EditForm as any);

@Relax
export default class EmployeeModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      visible: boolean;
      edit: boolean;
      onCancel: Function;
      onSave: Function;
      editDisable: boolean;
    };
  };

  static relaxProps = {
    visible: 'visible',
    edit: 'edit',
    customerLevel: 'customerLevel',
    onCancel: noop,
    onSave: noop,
    editDisable: 'editDisable'
  };

  render() {
    const { onCancel, visible, edit, editDisable } = this.props.relaxProps;

    if (!visible) {
      return null;
    }

    return (
      <Modal
          maskClosable={false}
          title={editDisable ? 'User Detail' : edit ? 'Edit User' : 'Add User'}
          visible={visible}
          onOk={() => this._handleOK()}
          onCancel={() => onCancel()}
      >
        <WrapperForm ref={(form) => (this._form = form)} />
      </Modal>
    );
  }

  _handleOK = () => {
    const form = this._form as WrappedFormUtils;
    let base64 = new util.Base64();
    form.validateFields(null, (errs, values) => {
      //如果校验通过
      if (!errs) {
        if (values.accountPassword) {
          values.accountPassword = base64.urlEncode(values.accountPassword);
          values.accountPasswordConfirm = base64.urlEncode(values.accountPasswordConfirm);
        }
        values.roleIdList = values.roleIdList ? [values.roleIdList] : null;
        values.employeeName = values.firstName + ' ' + values.lastName;
        values.accountState = 0;
        this.props.relaxProps.onSave(values);
      }
    });
  };
}
