//收款账户-商家收款账户
import React from 'react';
import { StoreProvider } from 'plume2';
import { Breadcrumb, Form, Alert } from 'antd';

import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import AppStore from './store';
import Info from './components/info';
import ButtonGroup from './components/button-group';
import List from './components/list';
import AccountModal from './components/account-modal';
import MoneyModal from './components/money-modal';
import DeleteModal from './components/delete-modal';
import MainModal from './components/main-modal';
import { FormattedMessage } from 'react-intl';

const AccountModalForm = Form.create({})(AccountModal);

let factory = React.createFactory('div');
let child1 = factory(null, 'Instructions:');
let child2 = factory(
  null,
  '1. The platform will make a small amount of money for the bank account you created for the first time. After the platform makes a payment, you can see the button to receive the money, and your account will only take effect after confirmation;'
);
let child3 = factory(
  null,
  '2. You can set any account that passes the verification as the main account, and the platform will give priority to the main account when you settle the payment;'
);
let tips = React.createElement('div', null, child1, child2, child3);

@StoreProvider(AppStore, { debug: __DEV__ })
export default class VendorPaymentAccount extends React.Component<any, any> {
  componentDidMount() {
    this.store.init();
  }

  store: AppStore;

  render() {
    return (
      <AuthWrapper functionName="fetchAllOfflineAccounts">
        <div>
          <BreadCrumb />
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>财务</Breadcrumb.Item>
            <Breadcrumb.Item>收款账户</Breadcrumb.Item>
            <Breadcrumb.Item>商家收款账户</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container">
            <Headline title={<FormattedMessage id="partnerAccount" />} />
            <Alert message={tips} type="info" showIcon />
            <Info />

            <ButtonGroup />

            {/*表格*/}
            <List />

            {/*变更当前收款账户*/}
            <AccountModalForm />

            {/*收到打款*/}
            <MoneyModal />

            {/*删除账号*/}
            <DeleteModal />

            <MainModal />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
