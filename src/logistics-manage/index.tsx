import React from 'react';

import { Breadcrumb, Alert } from 'antd';
import { StoreProvider } from 'plume2';

import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';

import AppStore from './store';
import CompanyChoose from './components/company-choose';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class LogisticsManage extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AuthWrapper functionName="f_expressManage_1">
        <div>
          <BreadCrumb />,
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>设置</Breadcrumb.Item>
            <Breadcrumb.Item>物流设置</Breadcrumb.Item>
            <Breadcrumb.Item>物流公司设置</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container-search">
            <Headline title="Logistics company settings" />
            <Alert
              message="Manage your commonly used logistics companies, easy to choose when ordering and shipping, up to 20 logistics companies can be set up."
              type="info"
              showIcon
            />
            <CompanyChoose />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
