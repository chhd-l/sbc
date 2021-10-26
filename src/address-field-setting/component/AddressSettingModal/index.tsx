import React, { useState, useEffect } from 'react';
import { Modal, Form, Switch, message } from 'antd';
import { Const } from 'qmkit';
import { setFlagForAddress1 } from '../../webapi';

interface AddressSettingFormProps {
  fieldId: number;
  visible: boolean;
  onCancel: Function;
  suggestionFlag: number;
  validationFlag: number;
  onChangeField: Function;
}

export default function AddressSettingModal(props: AddressSettingFormProps) {
  const [loading, setLoading] = useState(false);
  const [suggestionChecked, setSuggestionChecked] = useState(props.suggestionFlag === 1);
  const [validationChecked, setValidationChecked] = useState(props.validationFlag === 1);

  const formLayoutTemplate = {
    labelCol: { span: 12 },
    wrapperCol: {span: 8 }
  };

  const onSave = () => {
    setLoading(true);
    setFlagForAddress1({
      id: props.fieldId,
      suggestionFlag: suggestionChecked ? 1 : 0,
      validationFlag: validationChecked ? 1 : 0
    }).then(data => {
      setLoading(false);
      if (data.res.code === Const.SUCCESS_CODE) {
        message.success('Operation successful');
        props.onChangeField(props.fieldId, { suggestionFlag: suggestionChecked ? 1 : 0, validationFlag: validationChecked ? 1 : 0 });
        props.onCancel();
      }
    }).catch(() => {
      setLoading(false);
    });
  };

  return (
    <Modal
      visible={props.visible}
      title="Address Setting"
      confirmLoading={loading}
      okText="Save"
      cancelText="Cancel"
      onCancel={() => props.onCancel()}
      onOk={onSave}
    >
      <Form layout="horizontal" {...formLayoutTemplate}>
        <Form.Item label="Address Suggestion">
          <Switch checked={suggestionChecked} onChange={(checked) => setSuggestionChecked(checked)} />
        </Form.Item>
        <Form.Item label="Address Validation">
          <Switch checked={validationChecked} onChange={(checked) => setValidationChecked(checked)} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
