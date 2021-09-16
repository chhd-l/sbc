import React, { useState } from 'react';
import { Modal, Input, Form, Select, InputNumber } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

export default function FormModal(props) {
  const [code, setCode] = useState(props.code);
  const [name, setName] = useState(props.name);
  const [category, setCategory] = useState(props.category);
  const [type, setType] = useState(props.type);
  const [ratio, setRatio] = useState(props.ratio);
  const [loading, setLoading] = useState(false);
  return (
    <Modal
     title={props.title}
     visible={props.visible}
     width={500}
     okText="Save"
     cancelText="Cancel"
     confirmLoading={loading}
     onOk={() => {}}
     onCancel={props.onCancel}
    >
      <Form labelCol={{span: 8}} wrapperCol={{span: 16}} layout="horizontal">
        <FormItem label="UOM Code">
          <Input disabled />
        </FormItem>
        <FormItem label="UOM Name">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </FormItem>
        <FormItem label="Category">
          <Select value={category} onChange={(value) => setCategory(value)}>
            <Option value=""></Option>
          </Select>
        </FormItem>
        <FormItem label="Type">
          <Select value={type} onChange={(value) => setType(value)}>
            <Option value="1">Reference UOM for this category</Option>
            <Option value="2">Bigger than the reference UOM</Option>
            <Option value="3">Smaller than the reference UOM</Option>
          </Select>
        </FormItem>
        <FormItem label="Ratio">
          <InputNumber value={ratio} onChange={(value) => setRatio(value)} />
        </FormItem>
      </Form>
    </Modal>
  );
}
