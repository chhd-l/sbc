import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, InputNumber, message } from 'antd';
import { cache, Const, RCi18n } from 'qmkit';
import * as webapi from '../webapi';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }
  }
};

const AddRecommendaionCode = (props) => {
  let employee = JSON.parse(sessionStorage.getItem(cache.EMPLOYEE_DATA));
  const prescriberId =
    employee && employee.prescribers && employee.prescribers.length > 0
      ? employee.prescribers[0].id
      : null;
  const amountList = [50, 100, 150, 200, 250, 300];
  const { getFieldDecorator } = props.form;

  const [visible, setVisible] = useState(false);
  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setVisible(props.addRecommendaionCodeVisible);
    if (props.addRecommendaionCodeVisible) {
      props.form.setFieldsValue({
        amount: null
      });
    }
  }, [props.addRecommendaionCodeVisible]);

  function cancel() {
    props.cancel();
  }

  function addCode() {
    props.form.validateFields((err) => {
      if (!err) {
        setLoading(true);
        webapi
          .generateRecommendationCode({
            count: amount,
            prescriberId: props.prescriberKeyId,
            prescriberNo: props.prescriberId,
            recommendationMode: 'SINGLE_USE'
          })
          .then((data) => {
            const res = data.res;
            if (res.code === Const.SUCCESS_CODE) {
              message.success(window.RCi18n({ id: 'Content.OperateSuccessfully' }));
              setLoading(false);
              props.updatePrescriberCodeNumber(res.context.singleUse);
              cancel();
            } else {
              message.error(res.message || window.RCi18n({ id: 'Order.AddFailed' }));
              setLoading(false);
            }
          })
          .catch(() => {
            message.error(window.RCi18n({ id: 'Order.AddFailed' }));
            setLoading(false);
          });
      }
    });
  }
  return (
    <Modal
      title={RCi18n({ id: 'Prescriber.addRecommendaionCode' })}
      maskClosable={false}
      visible={visible}
      okText={RCi18n({id:"Prescriber.Ordernow"})}
      onOk={() => addCode()}
      onCancel={() => cancel()}
      okButtonProps={{ loading: loading }}
    >
      <Form {...formItemLayout}>
        {prescriberId ? (
          <FormItem label={RCi18n({ id: 'Prescriber.amount' })}>
            {getFieldDecorator('amount', {
              rules: [{ required: true, message: RCi18n({ id: 'Prescriber.PleaseSelectAmount' }) }]
            })(
              <Select onChange={(value) => setAmount(value)} allowClear>
                {amountList.map((item) => (
                  <Option value={item} key={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
        ) : (
          <FormItem label={RCi18n({ id: 'Prescriber.amount' })}>
            {getFieldDecorator('amount', {
              rules: [{ required: true, message: RCi18n({ id: 'Prescriber.pleaseInputAmount' }) }]
            })(
              <InputNumber
                style={{ width: '100%' }}
                placeholder="1-50"
                min={1}
                max={50}
                onChange={(value) => {
                  setAmount(value);
                }}
              />
            )}
          </FormItem>
        )}
      </Form>
    </Modal>
  );
};

export default Form.create()(AddRecommendaionCode);
