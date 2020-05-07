import React from 'react';
import { Form, Breadcrumb } from 'antd';
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import SettingForm from './components/setting-form';
import { StoreProvider } from 'plume2';
import AppStore from './store';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class BasicSetting extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.store.init();
  }

  render() {
    const SettingFormDetail = Form.create({})(SettingForm);

    return (
      <AuthWrapper functionName="f_basicSetting_0">
        <div>
          <BreadCrumb />
          <div className="container">
            <Headline title="基本设置" />
            <SettingFormDetail />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
