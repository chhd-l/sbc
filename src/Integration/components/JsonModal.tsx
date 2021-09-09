import { Button, message, Modal } from 'antd';
import React, { Component } from 'react';
import ReactJson from 'react-json-view';
import copy from 'copy-to-clipboard';
import { RCi18n } from 'qmkit';

export default class JsonModal extends Component<any, any>{
  constructor(props) {
    super(props)
  }

  handleCopy = (value) => {    
    if (copy(value)) {
      message.success(RCi18n({id:"Order.CopySucc"}));
    }
  };

  render() {
    const { visible, title, showJson } = this.props
    return (
      <Modal
        visible={visible}
        width={1050}
        title={title}
        footer={null}
        onCancel={()=>this.props.modalCancel()}
      >
        <div style={{textAlign:"end"}}>
          <Button type="link" onClick={()=>this.handleCopy(JSON.stringify(showJson) )}>{RCi18n({id:"Setting.Copy"})}</Button>
        </div>
        
        <ReactJson src={showJson}
          enableClipboard={false}
          displayObjectSize={false}
          displayDataTypes={false}
          style={{ wordBreak: 'break-all' }} />

      </Modal>
    )
  }
}