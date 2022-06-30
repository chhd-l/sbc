import { Button, Modal } from 'antd';
import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl';
import { Headline, Const, cache, AuthWrapper, getOrderStatusValue, RCi18n, util } from 'qmkit';


function ChangeDisacount(props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(props.addDiscountVisible);
  }, [props.addDiscountVisible]);
  return (

    <Modal
      closable={false}
      maskClosable={false}
      // mask={false}
      width={455}
      visible={visible}
      // footer={null}
      onCancel={props.onCancel}
    >
      <p style={{ fontSize: '18px' }}>This product cannot be used for Club Subscription.</p>
      <br />
      <p style={{ fontSize: '18px' }}>Please, choose another one.</p>
      <div style={{ textAlign: 'right' }}>
        <Button
          type="primary"
          onClick={() => {
            props.onCancel()
            // setVisible(false)
          }}
        >
          OK
        </Button>
      </div>
    </Modal>

  )
}

export default ChangeDisacount
