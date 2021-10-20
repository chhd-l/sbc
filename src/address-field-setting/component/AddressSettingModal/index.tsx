import React, { useState, useEffect } from 'react';
import { Modal, Form, Switch } from 'antd';

interface AddressSettingFormProps {
  visible: boolean;
  onCancel: Function;
}

export default function AddressSettingModal(props: AddressSettingFormProps) {
  const [loading, setLoading] = useState(false);
  const [suggestionChecked, setSuggestionChecked] = useState(false);
  const [validationChecked, setValidationChecked] = useState(false);

  const formLayoutTemplate = {
    labelCol: { span: 12 },
    wrapperCol: {span: 8 }
  };

  return (
    <Modal
      visible={props.visible}
      title="Address Setting"
      confirmLoading={loading}
      okText="Save"
      cancelText="Cancel"
      onCancel={() => props.onCancel()}
    >
      <Form layout="horizontal" {...formLayoutTemplate}>
        <Form.Item label="Address Suggestion">
          <Switch checked={suggestionChecked} />
        </Form.Item>
        <Form.Item label="Address Validation">
          <Switch checked={validationChecked} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
