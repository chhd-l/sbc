import React from 'react';
import { Form, Breadcrumb } from 'antd';
import { Headline, AuthWrapper, BreadCrumb, Const } from 'qmkit';
import SettingForm from './components/setting-form';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import { FormattedMessage } from 'react-intl';
import MyvetrecoStoreSetting from './myvetreco/main';

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

    if (Const.SITE_NAME === 'MYVETRECO') {
      return <MyvetrecoStoreSetting />;
    }

    return (
      <AuthWrapper functionName="f_basicSetting_0">
        <div>
          <BreadCrumb />
          <div className="container-search">
            <Headline title={<FormattedMessage id="storeSetting" />} />
            <SettingFormDetail />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
