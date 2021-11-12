import React, { useState } from 'react';
import { Modal, Input, Form } from 'antd';
import { addUOMCategory, editUOMCategory } from '../webapi';
import { Const, RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';

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
     title={props.type === 1 ? RCi18n({id:'Setting.Add'}) : RCi18n({id:'Setting.Edit'})}
     visible={props.visible}
     width={500}
     okText={RCi18n({id:'Product.Save'})}
     cancelText={RCi18n({id:'Product.Cancel'})}
     confirmLoading={loading}
     okButtonProps={{disabled: name === '' || description === ''}}
     onOk={onConfirm}
     onCancel={props.onCancel}
    >
      <Form labelCol={{span: 8}} wrapperCol={{span: 16}} layout="horizontal">
        <FormItem label={RCi18n({id:'Product.UOMCategoryName'})}>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </FormItem>
        <FormItem label={RCi18n({id:'Product.Description'})}>
          <TextArea autoSize value={description} onChange={(e) => setDescription(e.target.value)} />
        </FormItem>
      </Form>
    </Modal>
  );
}
