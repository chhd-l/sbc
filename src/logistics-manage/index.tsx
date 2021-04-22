import React from 'react';

import { Breadcrumb, Alert } from 'antd';
import { StoreProvider } from 'plume2';
import CompanyList from './components/company-list'
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import AppStore from './store';
import AddCompanyModal from './components/add-company-modal'
import CompanyChoose from './components/company-choose';
import './index.less'
@StoreProvider(AppStore, { debug: __DEV__ })
export default class LogisticsManage extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    // this.store.init();
    this.store.initList();
  }

  constructor(props) {
    super(props);
  }

  render() {
    return [
      <BreadCrumb />,
      <div>
        {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>设置</Breadcrumb.Item>
            <Breadcrumb.Item>物流设置</Breadcrumb.Item>
            <Breadcrumb.Item>物流公司设置</Breadcrumb.Item>
          </Breadcrumb> */}
        <div className="container-search company-container">
          <Headline title={<FormattedMessage id="Setting.LogisticsCompanySettings" />} />
          <Alert message={<FormattedMessage id="Setting.Manage" />} type="info" showIcon />
          <AuthWrapper functionName="f_expressManage_1">
            {/*<CompanyChoose />*/}
            <CompanyList />
            <AddCompanyModal />
          </AuthWrapper>
        </div>
      </div>
    ];
  }
}
