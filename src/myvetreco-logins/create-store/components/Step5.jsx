import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Input, Form, Tooltip, Icon } from 'antd';
import { savePaymentInfo } from '../webapi';
import { RCi18n, Const } from 'qmkit';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const isMYVETRECO = Const.SITE_NAME === 'MYVETRECO';
function Step5({ setStep, userInfo, paymentInfoRequest, form }) {
  const { getFieldDecorator } = form;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (paymentInfoRequest) {
      form.setFieldsValue({ ...paymentInfoRequest });
    }
  }, [paymentInfoRequest]);

  const toNext = async (e) => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        setLoading(true);
        savePaymentInfo({
          email: userInfo.accountName,
          storeId: userInfo.storeId,
          companyInfoId: userInfo.companyInfoId,
          ...values
        }).then(({ res, err }) => {
          if (err) {
            setLoading(false);
          } else {
            setLoading(false);
            setStep(5);
          }
        });
      }
    });
  };

  return (
    <div>
      <div className="vmargin-level-4 align-item-center word big">
        5 / 5 <FormattedMessage id="Store.addpayment" />
      </div>
      <div style={{ width: 800, margin: '20px auto' }}>
        <Row gutter={24}>
          <Col span={6}></Col>
        </Row>
      </div>
      <div style={{ width: 600, margin: '20px auto' }}>
        <Form layout="vertical" onSubmit={toNext}>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <FormItem
                label={
                  isMYVETRECO ? (
                    <>
                      Bank account number
                      <Tooltip
                        overlayClassName="store-tip-overlay"
                        getPopupContainer={() => document.getElementById('create-store-content')}
                        title="This number is an 18-digit number in the Netherlands. Also, the bank account should be under the legal entity name"
                      >
                        <Icon type="exclamation-circle" />
                      </Tooltip>
                    </>
                  ) : (
                    RCi18n({ id: 'Store.addpayment' })
                  )
                }
              >
                {getFieldDecorator('iban', {
                  rules: [
                    { required: true, message: RCi18n({ id: 'PetOwner.ThisFieldIsRequired' }) }
                  ],
                  initialValue: ''
                })(<Input size="large" />)}
              </FormItem>
            </Col>
            {/*<Col span={24}>*/}
            {/*  <FormItem label="Payout Summary Label">*/}
            {/*    {getFieldDecorator('payoutSummaryLabel', {*/}
            {/*      initialValue: ''*/}
            {/*    })(*/}
            {/*      <Input size="large" />*/}
            {/*    )}*/}
            {/*  </FormItem>*/}
            {/*</Col>*/}
            {/*<Col span={24}>*/}
            {/*  <FormItem label="Debit Summary Label">*/}
            {/*    {getFieldDecorator('debitSummaryLabel', {*/}
            {/*      initialValue: ''*/}
            {/*    })(*/}
            {/*      <Input size="large" />*/}
            {/*    )}*/}
            {/*  </FormItem>*/}
            {/*</Col>*/}
            <Col span={12} className="align-item-right">
              <Button size="large" onClick={() => setStep(3)}>
                <FormattedMessage id="back" />
              </Button>
            </Col>
            <Col span={12}>
              <FormItem>
                <Button loading={loading} size="large" type="primary" htmlType="submit">
                  <FormattedMessage id="Setting.Next" />
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}
export default Form.create()(Step5);
