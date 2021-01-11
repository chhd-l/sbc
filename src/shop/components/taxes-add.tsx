import React from 'react';
import { Modal } from 'antd';
import { Relax } from 'plume2';
import { noop } from 'qmkit';

/**
 * 图片上传组件，在Upload基础上增加了预览默认弹窗显示功能
 */
@Relax
export default class TaxesAdd extends React.Component<any, any> {
  props: {
    taxId: 'taxId';
    relaxProps?: {
      taxesAddVisible: any;
      onTaxesAddVisible: Function;
      clickImg: Function;
    };
  };

  static relaxProps = {
    taxesAddVisible: 'taxesAddVisible',
    onTaxesAddVisible: noop,
    clickImg: noop
  };

  handleOk = (e) => {
    const { onTaxesAddVisible } = this.props.relaxProps;
    onTaxesAddVisible(false);
  };

  handleCancel = (e) => {
    const { onTaxesAddVisible } = this.props.relaxProps;
    onTaxesAddVisible(false);
  };

  render() {
    const { taxesAddVisible } = this.props.relaxProps;
    return (
      <Modal maskClosable={false} title={this.props.taxId ? 'Edit tax zone' : 'New tax zone'} visible={taxesAddVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    );
  }
}
