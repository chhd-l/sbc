import React, { Component } from 'react';
import { Form, Input, Modal } from 'antd';
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
      onShow: Function;
    };
  };

  static relaxProps = {
    switchVisible: 'switchVisible',
    onShow: noop
  };

  onFormChange = (value) => {
    this.setState({
      enabled: value
    });
  };

  render() {
    const { switchVisible } = this.props.relaxProps;

    return (
      <Modal visible={switchVisible} title="Set rules" onOk={this.onOk} onCancel={() => this.cancel()}>
        <div className="methodTips flex-start-align">
          <span>Max order amount is</span>
          <span>
            <Input type="text" />
          </span>
          <span>{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}</span>
        </div>
      </Modal>
    );
  }
  /**
   * 保存
   */
  onOk = () => {
    const { onShow } = this.props.relaxProps;
    onShow(false);
  };

  cancel = () => {
    const { onShow } = this.props.relaxProps;
    onShow(false);
  };
}
export default Form.create()(MethodTips);
