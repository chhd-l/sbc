import React, { useEffect, useState } from 'react';
import { Form, Button, Input, Row, Col, Spin, Select, Icon, Tooltip } from 'antd';
import { checkCompanyInfoExists, saveLegalInfo } from '../webapi';
import { FormattedMessage } from 'react-intl';
import { Const, cache, RCi18n } from 'qmkit';

const FormItem = Form.Item;
const { Option } = Select;
const isMYVETRECO = Const.SITE_NAME === 'MYVETRECO';
function Step2({ setStep, userInfo, legalInfo = {}, form, sourceStoreId, sourceCompanyInfoId }) {
  const [loading, setLoading] = useState(false);
  const { getFieldDecorator } = form;

  const toNext = async (e) => {
    e.preventDefault();

    form.validateFields(async (errs, values) => {
      console.log(values);
      // return
      if (!errs) {
        setLoading(true);
        checkCompanyInfoExists({
          legalCompanyName: values.legalCompanyName,
          commerceNumber: values.commerceNumber,
          storeName: '',
          storeId: userInfo.storeId,
          companyInfoId: userInfo.companyInfoId
        }).then(({ res }) => {
          if (!res.context.legalCompanyNameExists && !res.context.commerceNumber) {
            saveLegalInfo({
              email: userInfo.accountName,
              storeId: userInfo.storeId,
              companyInfoId: userInfo.companyInfoId,
              sourceStoreId:
                sessionStorage.getItem(cache.CREATESTORE_SOURCE_STORE_ID) || sourceStoreId,
              ...values
            })
              .then((res) => {
                setStep(2);
              })
              .catch((err) => {
                setLoading(false);
              });
          } else {
            let errorArray = {};
            if (res.context.legalCompanyNameExists) {
              errorArray.legalCompanyName = {
                value: values.legalCompanyName,
                errors: [new Error(RCi18n({ id: 'Store.companynamerepeated' }))]
              };
            }
            if (res.context.commerceNumberExists) {
              errorArray.commerceNumber = {
                value: values.commerceNumber,
                errors: [new Error(RCi18n({ id: 'Store.companynumberrepeated' }))]
              };
            }
            form.setFields(errorArray);
          }
          setLoading(false);
        });
      }
    });
  };

  const onChangePhoneNumber = (e) => {
    if (Const.SITE_NAME === 'MYVETRECO' && e && !e.target.value.startsWith('+31')) {
      const temp = e.target.value;
      setTimeout(() => {
        form.setFieldsValue({
          contactPhone: `+31${temp.replace(/^[+|+3|+31]/, '')}`
        });
      });
    }
  };

  const validatePhoneNumber = (rules, value, callback) => {
    if (Const.SITE_NAME === 'MYVETRECO' && !/^\+31[0-9]{9}$/.test(value)) {
      callback(`${RCi18n({ id: 'inputPhoneNumberTip2' })} +31xxxxxxxxx`);
    } else if (!/^[0-9+-\\(\\)\s]{6,25}$/.test(value)) {
      callback(RCi18n({ id: 'inputPhoneNumberTip2' }));
    } else {
      callback();
    }
  };

  return (
    <div className="step2">
      <div className="vmargin-level-4 align-item-center word big">
        2 / {Const.SITE_NAME === 'MYVETRECO' ? '5' : '3'}{' '}
        <FormattedMessage id="Store.fillincontactinfo" />
      </div>
      <div style={{ width: 800, margin: '20px auto' }}>
        <Form layout="vertical" onSubmit={toNext}>
          <Row gutter={[24, 12]}>
            {/* <Col span={12}>
              <FormItem label="Trader category code (MCC)" name="tradeCategoryCode">
                {getFieldDecorator('tradeCategoryCode', {
                  rules: [{ required: true, message: 'Trader category code (MCC)' }],
                 initialValue: legalInfo?.tradeCategoryCode??''
                })(<Input size="large" placeholder='Trader category code (MCC)' />)}
              </FormItem>

            </Col> */}
            <Col span={12} style={{ display: isMYVETRECO ? 'block' : 'none' }}>
              <FormItem label={RCi18n({ id: 'Store.typeofbusi' })}>
                {getFieldDecorator('typeOfBusiness', {
                  rules: [
                    { required: true, message: RCi18n({ id: 'PetOwner.ThisFieldIsRequired' }) }
                  ],
                  initialValue: legalInfo?.typeOfBusiness ?? 1
                })(
                  <Select size="large">
                    <Option value={1}>Business</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <div style={{ height: 1, clear: 'both' }}>&nbsp;</div>
            <Col span={12}>
              <FormItem
                label={
                  <>
                    {RCi18n({ id: 'Store.companyname' })}
                    {/* 荷兰显示tooltip */}
                    {isMYVETRECO && (
                      <Tooltip
                        title="This is the legal business name or trading (doing business as) name of your company. It should match account holder name of your bank account used for payout."
                        overlayClassName="store-tip-overlay"
                      >
                        <Icon type="exclamation-circle" />
                      </Tooltip>
                    )}
                  </>
                }
              >
                {getFieldDecorator('legalCompanyName', {
                  rules: [
                    { required: true, message: RCi18n({ id: 'PetOwner.ThisFieldIsRequired' }) }
                  ],
                  initialValue: legalInfo?.legalCompanyName ?? ''
                })(<Input size="large" />)}
              </FormItem>
            </Col>
            <Col span={12} style={{ display: isMYVETRECO ? 'block' : 'none' }}>
              <FormItem
                label={
                  <>
                    {RCi18n({ id: 'Store.companynumber' })}
                    <Tooltip
                      title={RCi18n({ id: 'Store.companyname.Tooltip' })}
                      overlayClassName="store-tip-overlay"
                    >
                      <Icon type="exclamation-circle" />
                    </Tooltip>
                  </>
                }
              >
                {getFieldDecorator('commerceNumber', {
                  rules: [
                    {
                      required: isMYVETRECO,
                      message: RCi18n({ id: 'PetOwner.ThisFieldIsRequired' })
                    }
                  ],
                  initialValue: legalInfo?.commerceNumber ?? ''
                })(<Input size="large" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label={
                  isMYVETRECO
                    ? RCi18n({ id: 'Store.First name of Clinic Manager' })
                    : RCi18n({ id: 'PetOwner.First name' })
                }
              >
                {getFieldDecorator('firstName', {
                  rules: [
                    { required: true, message: RCi18n({ id: 'PetOwner.ThisFieldIsRequired' }) },
                    { pattern: /^((?![0-9]).)*$/, message: RCi18n({ id: 'Store.namenono' }) }
                  ],
                  initialValue: legalInfo?.firstName ?? ''
                })(<Input size="large" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label={
                  isMYVETRECO
                    ? RCi18n({ id: 'Store.Last name of Clinic Manager' })
                    : RCi18n({ id: 'PetOwner.Last name' })
                }
              >
                {getFieldDecorator('lastName', {
                  rules: [
                    { required: true, message: RCi18n({ id: 'PetOwner.ThisFieldIsRequired' }) },
                    { pattern: /^((?![0-9]).)*$/, message: RCi18n({ id: 'Store.namenono' }) }
                  ],
                  initialValue: legalInfo?.lastName ?? ''
                })(<Input size="large" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={isMYVETRECO ? 'Business email' : RCi18n({ id: 'PetOwner.Email' })}>
                {getFieldDecorator('contactEmail', {
                  rules: [
                    { required: true, message: RCi18n({ id: 'PetOwner.ThisFieldIsRequired' }) },
                    { type: 'email', message: <FormattedMessage id="Login.email_address_vld1" /> }
                  ],
                  initialValue: legalInfo?.contactEmail ?? userInfo.accountName
                })(<Input size="large" disabled />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={RCi18n({ id: 'PetOwner.Phone number' })}>
                {getFieldDecorator('contactPhone', {
                  rules: [{ required: true, validator: validatePhoneNumber }],
                  initialValue: legalInfo?.contactPhone ?? ''
                })(<Input size="large" maxLength={12} onChange={onChangePhoneNumber} />)}
              </FormItem>
            </Col>
            <Col span={24} className="align-item-right" style={{ textAlign: 'center' }}>
              <Button size="large" onClick={() => setStep(0)}>
                <FormattedMessage id="back" />
              </Button>
              <Button
                loading={loading}
                size="large"
                style={{ marginLeft: 20 }}
                type="primary"
                htmlType="submit"
              >
                <FormattedMessage id="Setting.Next" />
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}

export default Form.create()(Step2);
