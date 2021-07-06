import React, { useState, useEffect } from 'react';
import { Modal, Radio, Row, Col, Checkbox, Button, Popconfirm } from 'antd';
import * as webapi from '../webapi';
import { Const, AuthWrapper } from 'qmkit';

const PaymentMethod = (props) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [paymentType, setPaymentType] = useState(0);
  const [deliveryPay, setDeliveryPay] = useState(true);
  const [showError, setShowError] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      bank: 'XXXX Bank',
      cardType: 'Credit Card',
      cardNo: '**** **** **** 8989'
    },
    {
      id: 2,
      bank: 'XXXX Bank',
      cardType: 'Credit Card',
      cardNo: '**** **** **** 0001'
    }
  ]);
  const [selectPaymentMethod, setSelectPaymentMethod] = useState();

  useEffect(() => {
    setVisible(props.paymentMethodVisible);
    if (props.paymentMethodVisible) {
      setPaymentType(0);
    }
  }, [props.paymentMethodVisible]);

  useEffect(() => {
    if (paymentType === 0) {
      setSelectPaymentMethod(1);
    } else {
      setDeliveryPay(true);
    }
  }, [paymentType]);

  useEffect(() => {
    if (paymentType === 0) {
      setDisabled(!selectPaymentMethod);
    } else {
      setDisabled(!deliveryPay);
    }
  }, [paymentType, selectPaymentMethod, deliveryPay]);

  function changePaymentMethod() {
    setLoading(true);
    webapi
      .changePaymentMethod()
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(window.RCi18n({ id: 'Content.OperateSuccessfully' }));
          clear();
          setLoading(false);
        } else {
          message.error(res.message || window.RCi18n({ id: 'Order.UpdateFailed' }));
          setLoading(false);
        }
      })
      .catch(() => {
        message.error(window.RCi18n({ id: 'Public.GetDataFailed' }));
        setLoading(false);
      });
  }

  function clear() {
    props.cancel();
  }

  function deleteCard(id) {}

  return (
    <Modal
      visible={visible}
      title="Payment Method"
      onOk={() => changePaymentMethod()}
      okButtonProps={{ loading: loading, disabled: disabled }}
      onCancel={() => {
        clear();
      }}
    >
      <Radio.Group onChange={(e) => setPaymentType(e.target.value)} value={paymentType}>
        <Radio value={0}>Debit Card or Credit Card</Radio>
        <Radio value={1}>Cash on Delivery</Radio>
      </Radio.Group>
      {paymentType === 0 ? (
        <Row className="paymentDoor">
          <Radio.Group
            onChange={(e) => setSelectPaymentMethod(e.target.value)}
            value={selectPaymentMethod}
          >
            {paymentMethods.map((item, index) => (
              <Row key={index} className="payment-panel">
                <Radio value={item.id}>
                  <div className="cardInfo">
                    <h4>{item.bank}</h4>
                    <p>{item.cardType}</p>
                    <p>{item.cardNo}</p>
                  </div>
                </Radio>
                <Row>
                  <AuthWrapper functionName="f_delete_card">
                    <Popconfirm
                      placement="topLeft"
                      title={`Are you sure to delete this card?`}
                      onConfirm={() => deleteCard(item.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <a>Delete</a>
                    </Popconfirm>
                    {showError ? (
                      <div className="errorMessage">
                        This card cannot be removed due to the subscription association, please
                        remove the association first.
                      </div>
                    ) : null}
                  </AuthWrapper>
                </Row>
              </Row>
            ))}
          </Radio.Group>
          <AuthWrapper functionName="f_delete_card">
            <Button style={{ marginTop: 20 }} type="primary">
              Add New
            </Button>
          </AuthWrapper>
        </Row>
      ) : (
        <Row className="payment-panel">
          <Checkbox checked={deliveryPay} onChange={(e) => setDeliveryPay(e.target.checked)}>
            I want to pay by cash or card on delivery{' '}
            <span className="ant-form-item-required"></span>
          </Checkbox>
        </Row>
      )}
    </Modal>
  );
};

export default PaymentMethod;
