import React from 'react';
import { Relax } from 'plume2';
import { List } from 'immutable';
import { ConfirmMessage } from 'biz';
import { InputNumber, message } from 'antd';
import { RCi18n, noop } from 'qmkit';

@Relax
class ConsentVersionModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      hasError: false
    };
  }

  props: {
    relaxProps?: {
      selectedConsentIds: List<number>;
      batchUpdateConsentVersion: Function;
    };
  };

  static relaxProps = {
    selectedConsentIds: 'selectedConsentIds',
    batchUpdateConsentVersion: noop
  };

  handleValueChange = (value: number) => {
    this.setState({
      value: value
    })
  };

  onBatchUpdateClick = () => {
    const { selectedConsentIds } = this.props.relaxProps;
    if (!selectedConsentIds || !selectedConsentIds.size) {
      message.error(RCi18n({id:'Product.atLeastOneItem'}));
      return false;
    } else {
      return true;
    }
  };

  handleBatchUpdateConsentVersion = () => {
    const { selectedConsentIds, batchUpdateConsentVersion } = this.props.relaxProps;
    const { value } = this.state;
    if (!value) {
      this.setState({
        hasError: true
      });
      return Promise.resolve(false);
    } else {
      this.setState({
        hasError: false
      });
    }
    return batchUpdateConsentVersion(selectedConsentIds.toJS(), value);
  };

  render() {
    const { value, hasError } = this.state;
    return (
      <ConfirmMessage
        title={RCi18n({id:'Setting.Confirm'})}
        triggerButtonText={RCi18n({id:'Setting.UpdateConsentVersion'})}
        onTriggerClick={this.onBatchUpdateClick}
        triggerButtonProps={{
          type:'primary'
        }}
        onOk={this.handleBatchUpdateConsentVersion}
      >
        <span>{RCi18n({id:'Setting.ConsentVersion'})}: </span>
        <InputNumber value={value} min={1} step={1} precision={0} style={hasError ? {borderColor:'red'} : {}} onChange={this.handleValueChange} />
      </ConfirmMessage>
    );
  };
}

export default ConsentVersionModal;
