import React from 'react';
import { Form, Breadcrumb, Button, Tabs } from 'antd';
import { StoreProvider } from 'plume2';

import { history, Headline, AuthWrapper, BreadCrumb, Const } from 'qmkit';
import AppStore from './store';
import StepOne from './infocomponents/step-basic';
import StepTwo from './infocomponents/step-sso';
import StepThree from './infocomponents/step-signed';
import StepFour from './infocomponents/step-footer';
import StepConsent from './infocomponents/step-consent';
import StepFooterConfig from './infocomponents/step-footer-config';
import StepTaxes from './infocomponents/step-taxes';

import { FormattedMessage } from 'react-intl';

const StepOneForm = Form.create()(StepOne);
const StepTwoForm = Form.create()(StepTwo);
const StepFourForm = Form.create()(StepFour);
const StepFiveForm = Form.create()(StepConsent);

const PAIN = {
  '0': <StepOneForm />,
  '1': <StepTwoForm />,
  '2': <StepThree />,
  '3': <StepFourForm />,
  '4': <StepFiveForm />,
  '5': <StepTaxes />,
  '6': <StepFooterConfig />
};

@StoreProvider(AppStore, { debug: __DEV__ })
export default class ShopInfo extends React.Component<any, any> {
  store: AppStore;
  state = {
    tab: 0
  };

  UNSAFE_componentWillMount() {
    this.store.init();
    this.store.initCountryDictionary();
    this.store.initCityDictionary();
    this.store.initLanguageDictionary();
    this.store.initCurrencyDictionary();
    this.store.initTimeZoneDictionary();
  }

  render() {
    const currentTab = this.store.state().get('tabsStep');
    return (
      <AuthWrapper functionName="f_storeInfo_0">
        <div>
          <BreadCrumb />
          <div className="container-search">
            <Headline title={<FormattedMessage id="Setting.storeInformation" />} />
          </div>
          <div className="container">
            <Tabs onChange={(key) => this.store.setCurrentTab(key)} activeKey={currentTab}>
              <Tabs.TabPane tab={<FormattedMessage id="Setting.basicInformation" />} key="0" />
              {Const.SITE_NAME !== "MYVETRECO" ?
              <>
                <Tabs.TabPane tab={<FormattedMessage id="Setting.ssoSetting" />} key="1" />
                <Tabs.TabPane tab={<FormattedMessage id="Setting.signedInformation" />} key="2" />
                <Tabs.TabPane tab={<FormattedMessage id="Setting.footer" />} key="3" />
                <Tabs.TabPane tab={<FormattedMessage id="Setting.consent" />} key="4" />
                <Tabs.TabPane tab={<FormattedMessage id="Setting.Taxes" />} key="5" />
              </> : null}
              {/* <Tabs.TabPane
                tab={<FormattedMessage id="footerConfig" />}
                key="6"
              /> */}
            </Tabs>
            <div className="steps-content" style={{ marginTop: 20 }}>
              {PAIN[currentTab]}
            </div>
          </div>
          <AuthWrapper functionName="f_storeInfoEdit_0">
            {!(+currentTab === 4 || +currentTab === 5) ? (
              <div className="bar-button">
                <Button type="primary" onClick={() => this._edit()}>
                  <FormattedMessage id="Setting.Edit" />
                </Button>
              </div>
            ) : (
              <div>
                {this.store.state().get('pageChangeType') == 'List' ? null : (
                  <div className="bar-button">
                    <Button type="primary" onClick={() => this.store.consentSubmit(this.store.state().get('consentForm'), this.store.state().get('editId'))}>
                      <FormattedMessage id="Setting.Submit" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </AuthWrapper>
        </div>
      </AuthWrapper>
    );
  }

  /**
   * 编辑入口，跳转到编辑页面
   * @private
   */
  _edit = () => {
    history.push('/store-info-edit');
  };
}
