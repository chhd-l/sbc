import React from 'react';
import { Relax } from 'plume2';
import { Form } from 'antd';
import moment from 'moment';
import { Const } from 'qmkit';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;

const invoiceStateDic = {
  0: '待开票',
  1: '已开票'
};

const payOrderStatusDic = {
  0: '已付款',
  1: '未付款',
  2: '待确认'
};

const invoiceType = {
  0: '普通发票',
  1: '增值税专用发票'
};

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

@Relax
export default class OrderInvoiceViewForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      invoiceView: any;
    };
  };

  static relaxProps = {
    invoiceView: 'invoiceView'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { invoiceView } = this.props.relaxProps;

    return (
      <Form>
        <FormItem {...formItemLayout} label={<FormattedMessage id="FinanceManageReward.invoiceStatus" />}>
          <label>{invoiceStateDic[invoiceView.get('invoiceState')]}</label>
        </FormItem>
        <FormItem {...formItemLayout} label={<FormattedMessage id="FinanceManageReward.orderNumber" />}>
          <label>{invoiceView.get('orderNo')}</label>
        </FormItem>

        <FormItem {...formItemLayout} label={<FormattedMessage id="FinanceManageReward.consumerName" />}>
          <label>{invoiceView.get('customerName')}</label>
        </FormItem>
        <FormItem {...formItemLayout} label={<FormattedMessage id="FinanceManageReward.OrderAmount" />}>
          <label>
            {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
            {invoiceView.get('orderPrice') && invoiceView.get('orderPrice').toFixed(2)}
          </label>
        </FormItem>
        <FormItem {...formItemLayout} label={<FormattedMessage id="FinanceManageReward.paymentStatus" />}>
          <label>{payOrderStatusDic[invoiceView.get('payOrderStatus')]}</label>
        </FormItem>
        <FormItem {...formItemLayout} label={<FormattedMessage id="FinanceManageReward.invoiceType" />}>
          <label>{invoiceType[invoiceView.get('invoiceType')]}</label>
        </FormItem>
        <FormItem {...formItemLayout} label={<FormattedMessage id="FinanceManageReward.invoiceHeader" />}>
          <label>{invoiceView.get('invoiceTitle') || 'personal'}</label>
        </FormItem>
        {/* {invoiceView.get('taxNo') ? (
          <FormItem {...formItemLayout} label="纳税人识别号">
            <label>{invoiceView.get('taxNo') || '无'}</label>
          </FormItem>
        ) : null}
        {invoiceView.get('invoiceType') == 1 ? (
          <div>
            <FormItem {...formItemLayout} label="注册地址">
              <label>{invoiceView.get('registerAddress')}</label>
            </FormItem>
            <FormItem {...formItemLayout} label="注册电话">
              <label>{invoiceView.get('registerPhone')}</label>
            </FormItem>
            <FormItem {...formItemLayout} label="银行基本户号">
              <label>{invoiceView.get('bankNo')}</label>
            </FormItem>
            <FormItem {...formItemLayout} label="开户银行">
              <label>{invoiceView.get('bankName')}</label>
            </FormItem>
          </div>
        ) : null} */}
        <FormItem {...formItemLayout} label={<FormattedMessage id="FinanceManageReward.billingItems" />}>
          <label>{invoiceView.get('projectName')}</label>
        </FormItem>
        <FormItem {...formItemLayout} label={<FormattedMessage id="invoiceReceiptInformation" />}>
          <label>{invoiceView.get('invoiceAddress')}</label>
        </FormItem>
        <FormItem {...formItemLayout} label={<FormattedMessage id="FinanceManageReward.billingTime" />}>
          <label>{invoiceView.get('invoiceTime') ? moment(invoiceView.get('invoiceTime')).format(Const.TIME_FORMAT).toString() : '-'}</label>
        </FormItem>
      </Form>
    );
  }
}
