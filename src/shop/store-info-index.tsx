import React from 'react';
import { Form, Breadcrumb, Button, Tabs } from 'antd';
import { StoreProvider } from 'plume2';

import { history, Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import AppStore from './store';
import StepOne from './infocomponents/step-one-info';
import StepTwo from './detailcomponents/step-two';
import StepThree from './infocomponents/step-three-info';
import StepFour from './editcomponents/step-four-edit';
import { FormattedMessage } from 'react-intl';

const StepOneForm = Form.create()(StepOne);
const StepTwoForm = Form.create()(StepTwo);
const StepFourForm = Form.create()(StepFour);

const PAIN = {
  '0': <StepOneForm />,
  '1': <StepTwoForm />,
  '2': <StepThree />,
  '3': <StepFourForm />
};

@StoreProvider(AppStore, { debug: __DEV__ })
export default class ShopInfo extends React.Component<any, any> {
  store: AppStore;

  componentWillMount() {
    this.store.init();
  }

  render() {
    const currentTab = this.store.state().get('tabsStep');
    return (
      <AuthWrapper functionName="f_storeInfo_0">
        <div>
          <BreadCrumb />
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>设置</Breadcrumb.Item>
            <Breadcrumb.Item>店铺设置</Breadcrumb.Item>
            <Breadcrumb.Item>店铺信息</Breadcrumb.Item>
          </Breadcrumb> */}

          <div className="container">
            <Headline title={<FormattedMessage id="storeInformation" />} />
            <Tabs
              onChange={(key) => this.store.setCurrentTab(key)}
              activeKey={currentTab}
            >
              <Tabs.TabPane
                tab={<FormattedMessage id="basicInformation" />}
                key="0"
              />
              <Tabs.TabPane
                tab={<FormattedMessage id="businessInformation" />}
                key="1"
              />
              <Tabs.TabPane
                tab={<FormattedMessage id="signedInformation" />}
                key="2"
              />
              <Tabs.TabPane
                tab={<FormattedMessage id="financialInformation" />}
                key="3"
              />
            </Tabs>
            <div className="steps-content" style={{ marginTop: 20 }}>
              {PAIN[currentTab]}
            </div>
          </div>
          <AuthWrapper functionName="f_storeInfoEdit_0">
            <div className="bar-button">
              <Button type="primary" onClick={() => this._edit()}>
                <FormattedMessage id="edit" />
              </Button>
            </div>
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
