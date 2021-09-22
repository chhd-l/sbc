import React, { useState } from 'react';
import { Modal, Input, Form } from 'antd';
import { addUOMCategory, editUOMCategory } from '../webapi';
import { Const } from 'qmkit';

const TextArea = Input.TextArea;
const FormItem = Form.Item;

export default function FormModal(props) {
  const [name, setName] = useState(props.name);
  const [description, setDescription] = useState(props.description);
  const [loading, setLoading] = useState(false);

  const onConfirm = () => {
    setLoading(true);
    const handler = props.type === 1 ? addUOMCategory : editUOMCategory;
    handler({
      id: props.type === 1 ? undefined : props.id,
      uomCategoryName: name,
      description: description
    }).then(data => {
      setLoading(false);
      if (data.res.code === Const.SUCCESS_CODE) {
        props.onConfirm();
      }
    });
  };

  return (
    <Modal
     title={props.type === 1 ? 'Add' : 'Edit'}
     visible={props.visible}
     width={500}
     okText="Save"
     cancelText="Cancel"
     confirmLoading={loading}
     onOk={() => {}}
     onCancel={props.onCancel}
    >
      <Form labelCol={{span: 8}} wrapperCol={{span: 16}} layout="horizontal">
        <FormItem label="UOM category name">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </FormItem>
        <FormItem label="Description">
          <TextArea autoSize value={description} onChange={(e) => setDescription(e.target.value)} />
        </FormItem>
      </Form>
    </Modal>
  );
}
