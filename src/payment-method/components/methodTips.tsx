import React, { Component } from 'react';
import { Form, Input, Modal, InputNumber } from 'antd';
import { FormattedMessage } from 'react-intl';
import { SelectGroup, Const, cache, noop } from 'qmkit';
import { Relax } from 'plume2';
@Relax
class MethodTips extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      paymentForm: {
        enabled: false
      },
      enabled: null
    };
  }

  props: {
    relaxProps?: {
      switchVisible: any;
      storePaymentVOs: any;
      onShow: Function;
      onChecked: Function;
      getEditStorePayment: Function;
      getStorePaymentVOs: Function;
    };
  };

  static relaxProps = {
    switchVisible: 'switchVisible',
    storePaymentVOs: 'storePaymentVOs',
    getStorePaymentVOs: noop,
    getEditStorePayment: noop,
    onShow: noop,
    onChecked: noop
  };

  onFormChange = (value) => {
    this.setState({
      enabled: value
    });
  };

  render() {
    const { switchVisible, storePaymentVOs } = this.props.relaxProps;

    return (
      <Modal visible={switchVisible} title="Set rules" maskClosable={false} onOk={this.onOk} onCancel={() => this.cancel()}>
        <div className="methodTips flex-start-align">
          <span>Max order amount is</span>
          <span>
            <InputNumber min={0} max={9999} value={storePaymentVOs.maxAmount} onChange={this.onChange} />
          </span>
          <span>{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}</span>
        </div>
      </Modal>
    );
  }
  /**
   * 保存
   */

  onChange = (res) => {
    const { getStorePaymentVOs, storePaymentVOs } = this.props.relaxProps;
    storePaymentVOs.maxAmount = res;
    getStorePaymentVOs(storePaymentVOs);
  };

  onOk = () => {
    const { onShow, getEditStorePayment, storePaymentVOs } = this.props.relaxProps;
    getEditStorePayment(storePaymentVOs);
    onShow(false);
  };

  cancel = () => {
    const { onShow, onChecked } = this.props.relaxProps;
    onShow(false);
    onChecked(false);
  };
}
export default Form.create()(MethodTips);
