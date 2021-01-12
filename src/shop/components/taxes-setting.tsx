import React from 'react';
import { Modal } from 'antd';

export default class TaxesSetting extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  handleOk = (e) => {};

  handleCancel = (e) => {};

  render() {
    const { visible } = this.state;
    return (
      <Modal maskClosable={false} title="Tax Setting" visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    );
  }
}
