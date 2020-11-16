import React, { Component } from 'react';
import { Relax, StoreProvider } from 'plume2';
import AppStore from './store';
import './index.less';
import { AuthWrapper, BreadCrumb, Headline, noop, SelectGroup } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Form, Tabs, Select, Input, Button, Table, Divider, message } from 'antd';
import { Link } from 'react-router-dom';
import SeoSettingForm from './components/seo-setting-form';
import Foot from './components/foot';
import PageSeo from '@/seo-setting/components/page-seo';
const FormItem = Form.Item;
const _SeoSettingForm = Form.create({})(SeoSettingForm);

const { TabPane } = Tabs;

@StoreProvider(AppStore, { debug: __DEV__ })
export default class SetBanner extends Component<any, any> {
  store: AppStore;
  state: {
    operation: 'new'; //edit
    isEdit: false;
  };

  componentDidMount() {}
  callback(key) {
    console.log(key);
  }

  render() {
    return (
      <AuthWrapper functionName="fOrderList001">
        <div className="order-con">
          <BreadCrumb />
          <div className="container-search">
            <Headline title={<FormattedMessage id="seoSetting" />} />
          </div>
          <div className="container">
            <Tabs defaultActiveKey="1" onChange={this.callback}>
              <TabPane tab="Site SEO" key="siteSeo">
                <_SeoSettingForm />
              </TabPane>
              <TabPane tab="Page SEO" key="pageSeo">
                <PageSeo />
              </TabPane>
            </Tabs>
            <Foot tabType="1" />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
