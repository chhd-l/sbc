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

  render() {
    return (
      <AuthWrapper functionName="fOrderList001">
        <div className="order-con">
          <BreadCrumb />
          <div className="container-search">
            <Headline title={<FormattedMessage id="siteMap" />} />
          </div>
          <div className="container">
            <_SeoSettingForm />
            <Foot />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
