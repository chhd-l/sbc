import React from 'react';
import { Breadcrumb, Tooltip, Icon, Button, Input, Modal } from 'antd';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb, history, RCi18n } from 'qmkit';
import Detail from './components/detail';
import PublishButton from './components/publishButton';
import User from './components/user';

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
    const { state } = history.location;
    if (state) {
      this.store.init(state);
    }
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
          <Breadcrumb.Item>
            {history.location.state
              ? RCi18n({id:'Order.PrescriptionPortalDetail'})
              : RCi18n({id:'Order.NewPrescription'})}
          </Breadcrumb.Item>
        </BreadCrumb>
        <div className="container-search">
          <Headline
            title={
              history.location.state
                ? RCi18n({id:'Order.PrescriptionPortalDetail'})
                : RCi18n({id:'Order.NewPrescription'})
            }
          />
        </div>
        <div className="container" id="recommendation">
          <Detail />
          <div className="text">
            <Icon type="info-circle" />
            <span>{RCi18n({id:'Order.itemTip'})}</span>
          </div>
          <div className="reasonsInput">
            <span>{RCi18n({id:'Order.RecommendedReasons'})}</span>
            {history.location.state ? (
              <Input
                size="large"
                disabled
                placeholder={
                  this.store.state().get('detailProductList')
                    .recommendationReasons
                }
                style={{ border: '1px #dedede solid' }}
              />
            ) : (
              <Input
                size="large"
                disabled={this.store.state().get('createLinkType')}
                placeholder={RCi18n({id:'Order.InputRecommendedReasons'})}
                style={{ border: '1px #dedede solid' }}
                onChange={this.onInput}
              />
            )}
          </div>
          {history.location.state ? <User /> : null}
        </div>
        <div className="btn">
          <PublishButton />
        </div>
      </div>
    );
  }
}
