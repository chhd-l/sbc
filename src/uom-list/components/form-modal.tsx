import React, { useState } from 'react';
import { Modal, Input, Form, Select, InputNumber } from 'antd';
import { UOM_TYPE_LIST, addUom, editUom } from '../webapi';
import { Const } from 'qmkit';

const FormItem = Form.Item;
const Option = Select.Option;

export default function FormModal(props) {
  const [uomName, setUomName] = useState(props.uomName);
  const [categoryId, setCategoryId] = useState(props.categoryId);
  const [type, setType] = useState(props.type);
  const [ratio, setRatio] = useState(props.ratio);
  const [loading, setLoading] = useState(false);

  const saveUom = () => {
    setLoading(true);
    const handler = props.formType === 1 ? addUom : editUom;
    handler({
      id: props.formType === 2 ? props.id : undefined,
      uomCode: props.formType === 2 ? props.uomCode : undefined,
      uomName: uomName,
      categoryId: categoryId,
      type: type,
      ratio: ratio
    }).then(data => {
      setLoading(false);
      if (data.res.code === Const.SUCCESS_CODE) {
        props.onConfirm();
      }
    });
  }

  const okButtonDisabled = uomName === '' || !categoryId || type === '' || (type !== 'Reference UOM for this category' && !ratio);

  return (
    <Modal
     title={props.formType === 1 ? 'Add' : 'Edit'}
     visible={props.visible}
     width={500}
     okText="Save"
     cancelText="Cancel"
     confirmLoading={loading}
     okButtonProps={{disabled: okButtonDisabled}}
     onOk={saveUom}
     onCancel={props.onCancel}
    >
      <Form labelCol={{span: 8}} wrapperCol={{span: 16}} layout="horizontal">
        {props.formType === 2 && <FormItem label="UOM Code">
          <Input disabled value={props.uomCode} />
        </FormItem>}
        <FormItem label="UOM Name">
          <Input value={uomName} onChange={(e) => setUomName(e.target.value)} />
        </FormItem>
        <FormItem label="Category">
          <Select value={categoryId} onChange={(value) => setCategoryId(value)}>
            {props.categories.map((item, idx) => (
              <Option key={idx} value={item.id}>{item.uomCategoryName}</Option>
            ))}
          </Select>
        </FormItem>
        <FormItem label="Type">
          <Select value={type} onChange={(value) => setType(value)}>
            {UOM_TYPE_LIST.map((item, idx) => (
              <Option key={idx} value={item.value}>{item.name}</Option>
            ))}
          </Select>
        </FormItem>
        {type !== 'Reference UOM for this category' && <FormItem label="Ratio">
          <InputNumber value={ratio} onChange={(value) => setRatio(value)} />
        </FormItem>}
      </Form>
    </Modal>
  );
}
