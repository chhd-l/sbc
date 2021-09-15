import React, { useState } from 'react';
import { Modal, Input, Form } from 'antd';

const TextArea = Input.TextArea;
const FormItem = Form.Item;

export default function FormModal(props) {
  const [name, setName] = useState(props.name);
  const [description, setDescription] = useState(props.description);
  const [loading, setLoading] = useState(false);
  return (
    <Modal
     title={props.title}
     width={500}
     okText="Save"
     cancelText="Cancel"
     confirmLoading={loading}
     onOk={() => {}}
     onCancel={props.onCancel}
    >
      <Form layout="horizontal">
        <FormItem></FormItem>
      </Form>
    </Modal>
  );
}
