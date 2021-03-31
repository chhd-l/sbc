import React, { Component } from 'react';
import { Relax, StoreProvider } from 'plume2';
import AppStore from './store';
import './index.less';
import { AuthWrapper, BreadCrumb, Headline, noop, SelectGroup } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Form, Tabs } from 'antd';
import { Alert } from 'antd';
import StatesList from './components/states-list';
import CityList from './components/city-list';
import NewStateModal from './components/new-state-modal';
import NewCityModal from './components/new-city-modal';
const NewStateModalForm = Form.create({})(NewStateModal);
const NewCityModalForm = Form.create({})(NewCityModal);
const { TabPane } = Tabs;
@StoreProvider(AppStore, { debug: __DEV__ })
export default class AddressManagement extends Component<any, any> {
  store: AppStore;
  state: {};

  componentDidMount() {
    this.store.init();
  }
  tabsOnChange = () => {};
  render() {
    return (
      <AuthWrapper functionName="fOrderList001">
        <div className="order-con">
          <BreadCrumb />
          <div className="container-search">
            <Headline title={<FormattedMessage id="Setting.addressManagement" />} />
            <Alert message={<FormattedMessage id="Setting.AddressManagementisusedfor" />} type="info" />
            <div className="tab-container">
              <Tabs defaultActiveKey="1" onChange={this.tabsOnChange}>
                <TabPane tab={<FormattedMessage id="Setting.States" />} key="1">
                  <StatesList />
                  <NewStateModalForm />
                </TabPane>
                <TabPane tab={<FormattedMessage id="Setting.City" />} key="2">
                  <CityList />
                  <NewCityModalForm />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
