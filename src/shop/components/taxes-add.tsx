import React from 'react';
import { Modal } from 'antd';

export default class TaxesAdd extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isEdit: false
    };
  }

  handleOk = (e) => {};

  handleCancel = (e) => {};

  render() {
    const { visible, isEdit } = this.state;
    return (
      <Modal maskClosable={false} title={isEdit ? 'Edit tax zone' : 'New tax zone'} visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    );
  }
}
