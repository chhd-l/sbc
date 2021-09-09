import React, { useEffect, useState } from 'react';
import { Switch, message } from 'antd';
import { Const } from 'qmkit';
import { getInvoiceConfig, setInvoiceConfig } from '../webapi';
import { FormattedMessage } from 'react-intl';

export default function InvoiceSetting() {
  const [loading, setLoading] = useState(true);
  const [companyInfoId, setCompanyInfoId] = useState(0);
  const [invoiceProjectSwitchId, setInvoiceProjectSwitchId] = useState('');
  const [isPaperInvoice, setIsPaperInvoice] = useState(0);
  const [isSupportInvoice, setIsSupportInvoice] = useState(0);
  const [isValueAddedTaxInvoice, setIsValueAddedTaxInvoice] = useState(0);

  const getInvoiceSetting = () => {
    getInvoiceConfig().then(data => {
      if (data.res.code === Const.SUCCESS_CODE) {
        setLoading(false);
        setCompanyInfoId(data.res.context?.companyInfoId ?? 0);
        setInvoiceProjectSwitchId(data.res.context?.invoiceProjectSwitchId ?? '');
        setIsPaperInvoice(data.res.context?.isPaperInvoice ?? 0);
        setIsSupportInvoice(data.res.context?.isSupportInvoice ?? 0);
        setIsValueAddedTaxInvoice(data.res.context?.isValueAddedTaxInvoice ?? 0);
      }
    });
  };

  useEffect(() => {
    getInvoiceSetting();
  }, []);

  const submitInvoiceSetting = (configItem: any) => {
    setInvoiceConfig({
      companyInfoId,
      invoiceProjectSwitchId,
      isPaperInvoice,
      isSupportInvoice,
      isValueAddedTaxInvoice,
      ...configItem
    }).then(data => {
      if (data.res.code === Const.SUCCESS_CODE) {
        message.success(data.res.message);
        getInvoiceSetting();
      }
    });
  };

  if (loading) {
    return null;
  }

  return (
    <div style={{textAlign: 'right'}}>
      <span>
        <FormattedMessage id="Finance.SupportInvoice" /> 
        <Switch
          style={{marginLeft:5}}
          checked={isSupportInvoice === 1}
          onChange={(checked) => {
            setIsSupportInvoice(checked ? 1 : 0);
            submitInvoiceSetting({
              isSupportInvoice: checked ? 1 : 0,
            });
          }}
        />
      </span>
      <span style={{marginLeft: 30}}>
        <FormattedMessage id="Finance.SupportPaperInvoice" /> 
        <Switch
          style={{marginLeft:5}}
          checked={isPaperInvoice === 1}
          onChange={(checked) => {
            setIsPaperInvoice(checked ? 1 : 0);
            submitInvoiceSetting({
              isPaperInvoice: checked ? 1 : 0,
            });
          }}
        />
      </span>
      <span style={{marginLeft: 30}}>
        <FormattedMessage id="Finance.SupportVATInvoice" /> 
        <Switch
          style={{marginLeft:5}}
          checked={isValueAddedTaxInvoice === 1}
          onChange={(checked) => {
            setIsValueAddedTaxInvoice(checked ? 1 : 0);
            submitInvoiceSetting({
              isValueAddedTaxInvoice: checked ? 1 : 0,
            });
          }}
        />
      </span>
    </div>
  );
}
