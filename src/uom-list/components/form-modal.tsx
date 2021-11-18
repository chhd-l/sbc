import React, { useState } from 'react';
import { Modal, Input, Form, Select, InputNumber } from 'antd';
import { UOM_TYPE_LIST, addUom, editUom } from '../webapi';
import { Const, RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';

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
      ratio: type !== 'Reference UOM for this category' ? ratio : null
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
     title={props.formType === 1 ? RCi18n({id:'Setting.Add'}) : RCi18n({id:'Setting.Edit'})}
     visible={props.visible}
     width={500}
     okText={RCi18n({id:'Product.Save'})}
     cancelText={RCi18n({id:'Product.Cancel'})}
     confirmLoading={loading}
     okButtonProps={{disabled: okButtonDisabled}}
     onOk={saveUom}
     onCancel={props.onCancel}
    >
      <Form labelCol={{span: 8}} wrapperCol={{span: 16}} layout="horizontal">
        {props.formType === 2 && <FormItem label={RCi18n({id:'Product.UOMcode'})}>
          <Input disabled value={props.uomCode} />
        </FormItem>}
        <FormItem label={RCi18n({id:'Product.UOMname'})}>
          <Input value={uomName} onChange={(e) => setUomName(e.target.value)} />
        </FormItem>
        <FormItem label={RCi18n({id:'Setting.Category'})}>
          <Select value={categoryId} onChange={(value) => setCategoryId(value)}>
            {props.categories.map((item, idx) => (
              <Option key={idx} value={item.id}>{item.uomCategoryName}</Option>
            ))}
          </Select>
        </FormItem>
        <FormItem label={RCi18n({id:'Setting.Type'})}>
          <Select value={type} onChange={(value) => setType(value)}>
            {UOM_TYPE_LIST.map((item, idx) => (
              <Option key={idx} value={item.value}>{item.name}</Option>
            ))}
          </Select>
        </FormItem>
        {type !== 'Reference UOM for this category' && <FormItem label={RCi18n({id:'Product.Ratio'})}>
          <InputNumber value={ratio} onChange={(value) => setRatio(value)} />
        </FormItem>}
      </Form>
    </Modal>
  );
}
