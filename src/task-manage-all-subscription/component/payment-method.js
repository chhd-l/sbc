import React, { useState, useEffect } from 'react';
import { Modal, Radio, Row, Checkbox, Button, Popconfirm, Spin, message } from 'antd';
import * as webapi from '../webapi';
import { Const, AuthWrapper, cache, RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';

const codCodEnum = { 123457907: 'PAYU_RUSSIA_COD', 123457919: 'JAPAN_COD' };

const PaymentMethod = (props) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [paymentType, setPaymentType] = useState('');
  const [deliveryPay, setDeliveryPay] = useState(true);
  const [cards, setCards] = useState([]);
  const [selectCardId, setSelectCardId] = useState();

  const storeId = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}').storeId || 0;

  useEffect(() => {
    setVisible(props.paymentMethodVisible);
    if (props.paymentMethodVisible) {
      setPaymentType('PAYU_RUSSIA_AUTOSHIP2');
    }
  }, [props.paymentMethodVisible]);

  useEffect(() => {
    if (!props.paymentMethodVisible) {
      return;
    }
    if (paymentType === 'PAYU_RUSSIA_AUTOSHIP2') {
      getCards();
      if (props.cardId) {
        setSelectCardId(props.cardId);
      }
    } else {
      setSelectCardId(null);
      setDeliveryPay(true);
    }
  }, [paymentType, props.paymentMethodVisible]);

  useEffect(() => {
    if (paymentType === 'PAYU_RUSSIA_AUTOSHIP2') {
      setDisabled(!selectCardId);
    } else {
      setDisabled(!deliveryPay);
    }
  }, [paymentType, selectCardId, deliveryPay]);

  function getCards() {
    setLoading(true);
    webapi
      .getCards(props.customerId)
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          setCards(res.context);
          setLoading(false);
        } else {
          message.error(res.message || RCi18n({ id: 'Public.GetDataFailed' }));
          setLoading(false);
        }
      })
      .catch(() => {
        message.error(RCi18n({ id: 'Public.GetDataFailed' }));
        setLoading(false);
      });
  }

  function changePaymentMethod() {
    let selectCard = selectCardId ? cards.find((x) => x.id === selectCardId) : null;
    props.changePaymentMethod(selectCardId, paymentType, selectCard);
    props.cancel();
  }

  function clear() {
    props.cancel();
  }

  function deleteCard(paymentId) {
    setLoading(true);
    webapi
      .deleteCard(storeId, paymentId)
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(RCi18n({ id: 'Subscription.OperateSuccessfully' }));
          getCards();
          setLoading(false);
        } else if (res.code === 'K-100209') {
          showError(paymentId);
          setLoading(false);
        }
      })
      .catch(() => {});
  }

  function showError(paymentId) {
    let newPaymentMethods = cards.map((item) => {
      if (item.id === paymentId) {
        item.showError = true;
      }
      return item;
    });
    setCards(newPaymentMethods);
  }

  return (
    <Modal
      visible={visible}
      title={RCi18n({ id: 'Subscription.Active.PaymentMethod' })}
      onOk={() => changePaymentMethod()}
      okButtonProps={{ disabled: disabled }}
      onCancel={() => {
        clear();
      }}
    >
      <Radio.Group onChange={(e) => setPaymentType(e.target.value)} value={paymentType}>
        <Radio value={'PAYU_RUSSIA_AUTOSHIP2'}>
          <FormattedMessage id="Subscription.DebitOrCreditCard" />
        </Radio>

        {props.subscriptionType === 'Peawee' || Const.SITE_NAME === 'MYVETRECO' ? null : codCodEnum[
            storeId
          ] ? (
          <AuthWrapper functionName="f_cod_payment">
            <Radio value={codCodEnum[storeId]}>
              <FormattedMessage id="Subscription.CashOnDelivery" />
            </Radio>
          </AuthWrapper>
        ) : null}
      </Radio.Group>
      {paymentType === 'PAYU_RUSSIA_AUTOSHIP2' ? (
        <Row className="paymentDoor">
          <Radio.Group onChange={(e) => setSelectCardId(e.target.value)} value={selectCardId}>
            <Spin spinning={loading}>
              <>
                {cards.map((item, index) => (
                  <Row key={index} className="payment-panel">
                    <Radio value={item.id}>
                      <div className="cardInfo">
                        <h4>{item.paymentVendor}</h4>
                        <p>{item.cardType}</p>
                        <p>{'**** **** **** ' + item.lastFourDigits}</p>
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
                          <a>
                            <FormattedMessage id="Subscription.Delete" />
                          </a>
                        </Popconfirm>
                        {item.showError ? (
                          <div className="errorMessage">
                            <FormattedMessage id="Subscription.RemoveAssociationFirst" />
                          </div>
                        ) : null}
                      </AuthWrapper>
                    </Row>
                  </Row>
                ))}
              </>
            </Spin>
          </Radio.Group>
          <AuthWrapper functionName="f_add_card">
            <Button onClick={() => props.addNewCard()} style={{ marginTop: 20 }} type="primary">
              <FormattedMessage id="Subscription.AddNew" />
            </Button>
          </AuthWrapper>
        </Row>
      ) : (
        <Row className="payment-panel">
          <Checkbox checked={deliveryPay} onChange={(e) => setDeliveryPay(e.target.checked)}>
            <FormattedMessage id="Subscription.PayByCashOrCard" />{' '}
            <span className="ant-form-item-required" />
          </Checkbox>
        </Row>
      )}
    </Modal>
  );
};

export default PaymentMethod;
