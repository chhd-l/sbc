import React from 'react';
import { Breadcrumb, Tooltip, Icon, Button, Input, Modal } from 'antd';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb, history } from 'qmkit';
import Detail from './components/detail';
import PublishButton from './components/publishButton';

import AppStore from './store';
import './style.less';
//import { Simulate } from 'react-dom/test-utils';
//import input = Simulate.input;
//import { FormattedMessage } from 'react-intl';
//import SearchForm from './components/search-form';
//import { __DEV__ } from 'typings/global';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class BillingDetails extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { settleId } = this.props.match.params;
    //this.store.init(settleId);
  }
  onInput = (e) => {
    this.store.onCreateLink({
      field: 'recommendationReasons',
      value: e.target.value
    });
  };
  render() {
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>New Prescription portal</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container-search">
          <Headline title="New Prescription portal" />
        </div>
        <div className="container" id="recommendation">
          <Detail />
          <div className="text">
            <Icon type="info-circle" />
            <span>Do not recommend more than five items at a time.</span>
          </div>
          <div className="reasonsInput">
            <span>Recommended Reasons</span>
            <Input
              size="large"
              placeholder="Input Recommended Reasons"
              style={{ border: '1px #dedede solid' }}
              onChange={this.onInput}
            />
          </div>
        </div>
        <div className="btn">
          <PublishButton />
        </div>
      </div>
    );
  }
}
