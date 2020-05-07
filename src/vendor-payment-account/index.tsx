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

const AccountModalForm = Form.create({})(AccountModal);

let factory = React.createFactory('div');
let child1 = factory(null, '操作说明:');
let child2 = factory(
  null,
  '1、平台会给您首次创建的银行账户进行一笔小额打款，平台打款后您可以看到收到打款按钮，确认后您的账号才生效;'
);
let child3 = factory(
  null,
  '2、您可将通过打款验证的任何一个账户设为主账户，平台给您结算时会优先打款至主账户；'
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
            <Headline title="商家收款账户" />
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
