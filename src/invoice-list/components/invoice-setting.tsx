import React, { useEffect, useState } from 'react';
import { Form, Input, Switch, Button, Spin, message } from 'antd';
import { Const, Headline, history, RCi18n } from 'qmkit';
import { getInvoiceSysConfig, saveInvoiceSysConfig } from '../webapi';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

const FormItem = Form.Item;

const DEFAULT_PREFIX = {
  context: 'INV-'
};

const DEFAULT_FORMAT = {
  context: '0000-000000'
};

export default function InvoiceSetting() {
  const [loading, setLoading] = useState(true);
  const [invoicePrefix, setInvoicePrefix] = useState(DEFAULT_PREFIX);
  const [invoiceFormat, setInvoiceFormat] = useState(DEFAULT_FORMAT);

  const getInvoiceSetting = () => {
    Promise.all([getInvoiceSysConfig('myvet_invoice_prefix'), getInvoiceSysConfig('myvet_invoice_format')]).then(([data1, data2]) => {
      if (data1.res.code === Const.SUCCESS_CODE && data2.res.code === Const.SUCCESS_CODE) {
        setLoading(false);

        setInvoicePrefix(data1.res.context ? data1.res.context[0] : DEFAULT_PREFIX);
        setInvoiceFormat(data2.res.context ? data2.res.context[0] : DEFAULT_FORMAT);
      }
    });
  };

  useEffect(() => {
    getInvoiceSetting();
  }, []);

  const submitInvoiceSetting = () => {
    if (!invoiceFormat.context.trim()) {
      message.error(RCi18n({id:'Finance.InvoiceFormatMustFill'}));
      return;
    }
    setLoading(true);
    saveInvoiceSysConfig([invoicePrefix, invoiceFormat]).then((data) => {
      if (data.res.code === Const.SUCCESS_CODE) {
        message.success(data.res.message);
        setLoading(false);
      }
    });
  };

  const genExampleInvoiceNumber = (example: string) => {
    return `${invoicePrefix.context}${invoiceFormat.context}`
      .replace(/(.*)0/, `$1${example}`)
      .replace(/DD/g, moment().format('DD'))
      .replace(/MM/g, moment().format('MM'))
      .replace(/YYYY/g, moment().format('YYYY'))
      .replace(/YY/g, moment().format('YY'))
  };

  return (
    <div className="container">
      <Spin spinning={loading}>
        <Headline title={RCi18n({id:'Finance.InvoiceSetting'})} />
        <Form layout="horizontal" labelCol={{span: 4}} wrapperCol={{span:12}}>
          <FormItem label={<FormattedMessage id="Finance.SupportInvoice" />}>
            <Switch
              checked={true}
              disabled
            />
          </FormItem>
          <FormItem label={<FormattedMessage id="Finance.InvoicePrefix" />}>
            <Input value={invoicePrefix.context} onChange={(e) => setInvoicePrefix(Object.assign({}, invoicePrefix, {context:e.target.value}))} />
          </FormItem>
          <FormItem label={<FormattedMessage id="Finance.InvoiceFormat" />} required help={<FormattedMessage id="Finance.InvoiceTips" />}>
            <Input value={invoiceFormat.context} onChange={(e) => setInvoiceFormat(Object.assign({}, invoiceFormat, {context:e.target.value}))} />
          </FormItem>
          <FormItem label={<FormattedMessage id="Finance.InvoiceNumberExample" />}>
            <Input.TextArea
              autoSize 
              readOnly 
              value={genExampleInvoiceNumber('1') + '\n' + genExampleInvoiceNumber('2') + '\n' + genExampleInvoiceNumber('3')}
            />
          </FormItem>
          <FormItem wrapperCol={{span:16,offset:4}}>
            <Button type="primary" onClick={submitInvoiceSetting}><FormattedMessage id="Finance.saveSettings" /></Button>
            <Button style={{marginLeft: 10}} onClick={() => history.go(-1)}><FormattedMessage id="Finance.back" /></Button>
          </FormItem>
        </Form>
      </Spin>
    </div>
  );
}
