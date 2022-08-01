import { Button, Modal, Form, Input, Select } from 'antd';
import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl';
import { Headline, Const, cache, AuthWrapper, getOrderStatusValue, RCi18n, util } from 'qmkit';
import { e } from 'mathjs';


function RetryModal(props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(props.retryModalVisible);
  }, [props.retryModalVisible]);
  
  return (
    <Modal
      maskClosable={false}
      bodyStyle={{padding: "40px 10px 10px 20px"}}
      width={300}
      visible={visible}
      onOk={props.onOK}
      onCancel={props.onCancel}
      zIndex={3}
    >
      <p >
        <FormattedMessage id={'Marketing.retryModalVisible'} />
      </p>
      <br />
    </Modal>

  )
}

export default RetryModal;
