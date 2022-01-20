import React, { useState } from 'react';
import { Modal, Button, Input } from 'antd';
import { ButtonProps } from 'antd/es/button';

interface IProps {
  title?: string;
  onOk?: () => Promise<boolean>;
  triggerButtonProps?: ButtonProps;
  triggerButtonText: string;
  onTriggerClick?: () => boolean;
  okText?: string;
  cancelText?: string;
};

const ConfirmMessage: React.FC<IProps> = (props) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleTriggerButtonClick = () => {
    if (!props.onTriggerClick || props.onTriggerClick()) {
      setVisible(true);
    }
  };
  return (
    <div>
      <Button {...(props.triggerButtonProps ?? {})} onClick={handleTriggerButtonClick}>
        {props.triggerButtonText}
      </Button>
      <Modal
        title={props.title}
        okText={props.okText}
        cancelText={props.cancelText}
        visible={visible}
        confirmLoading={loading}
        onCancel={() => setVisible(false)}
        onOk={() => {
          setLoading(true);
          props.onOk().then(result => {
            setLoading(false);
            result && setVisible(false);
          });
        }}
      >
        {props.children}
      </Modal>
    </div>
  );
};

export default ConfirmMessage;
