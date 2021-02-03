import React, { Component } from 'react';
import { Modal } from 'antd';

export default class AddPetOwner extends Component<any, any> {
  constructor(prop) {
    super(prop);
    this.state = {
      visible: true
    };
  }
  componentDidMount() {}
  handleOk = () => {};
  handleCancel = () => {};

  render() {
    return (
      <div>
        <Modal title="Add new pet owner" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}></Modal>
      </div>
    );
  }
}
