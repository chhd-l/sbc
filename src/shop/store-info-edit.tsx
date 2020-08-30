import React from 'react';
import { Form, Breadcrumb, Tabs } from 'antd';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';

import AppStore from './store';
import StepOne from './editcomponents/step-basic-edit';
import StepTwo from './editcomponents/step-sso-edit';
import StepThree from './editcomponents/step-signed-edit';
import StepFour from './editcomponents/step-footer-edit';
import StepConsentedit from './editcomponents/step-consent-edit';
import BrandModal from './components/brand-modal';
import SortsModal from './components/sort-modal';
import { FormattedMessage } from 'react-intl';
const StepOneForm = Form.create()(StepOne);
const StepTwoForm = Form.create()(StepTwo);
const StepFourForm = Form.create()(StepFour);
const stepConsenteditForm = Form.create()(StepConsentedit);
const SortsForm = Form.create()(SortsModal);
const BrandForm = Form.create()(BrandModal); //品牌弹框

const PAIN = {
  0: <StepOneForm />,
  1: <StepTwoForm />,
  2: <StepThree />,
  3: <StepFourForm />,
  4: <stepConsenteditForm />
};

@StoreProvider(AppStore, { debug: __DEV__ })
export default class ShopInfoEdit extends React.Component<any, any> {
  store: AppStore;

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
      <div>
        <BreadCrumb>
          <Breadcrumb.Item>
            {<FormattedMessage id="storeInformationEdit" />}
          </Breadcrumb.Item>
        </BreadCrumb>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>设置</Breadcrumb.Item>
          <Breadcrumb.Item>店铺设置</Breadcrumb.Item>
          <Breadcrumb.Item>店铺信息</Breadcrumb.Item>
          <Breadcrumb.Item>店铺信息编辑</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container-search">
          <Headline title={<FormattedMessage id="storeInformationEdit" />} />
        </div>
        <div className="container">
          <Tabs
            onChange={(key) => this.store.setCurrentTab(key)}
            activeKey={currentTab}
          >
            <Tabs.TabPane
              tab={<FormattedMessage id="basicInformation" />}
              key="0"
            />
            <Tabs.TabPane tab={<FormattedMessage id="ssoSetting" />} key="1" />
            <Tabs.TabPane
              tab={<FormattedMessage id="signedInformation" />}
              key="2"
            />
            <Tabs.TabPane tab={<FormattedMessage id="footer" />} key="3" />
            <Tabs.TabPane tab={<FormattedMessage id="consent" />} key="4" />
          </Tabs>
          <div className="steps-content" style={{ marginTop: 20 }}>
            {PAIN[currentTab]}
          </div>
          {/* 签约品牌弹框 */}
          <BrandForm />
          {/* 签约类目弹框*/}
          <SortsForm />
        </div>
      </div>
    );
  }
}
