import React from 'react';
import { Breadcrumb, Tooltip, Icon, Button, Input } from 'antd';
import { StoreProvider } from 'plume2';
import styled from 'styled-components';
import { Headline, BreadCrumb, history } from 'qmkit';
import Detail from './components/detail';
import AppStore from './store';
import './style.less';
//import { FormattedMessage } from 'react-intl';
//import SearchForm from './components/search-form';
//import { __DEV__ } from 'typings/global';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class BillingDetails extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { settleId } = this.props.match.params;
    this.store.init(settleId);
  }

  render() {
    return (
      <div
        style={{
          overflowY: 'auto',
          // height: 'calc(100vh - 64px)',
          /*margin: -10,
          padding: 10,*/
          position: 'relative'
        }}
      >
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>New Recommendation</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container-search">
          <Headline title="New Recommendation" />
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
            />
          </div>
        </div>
        <div className="btn">
          <Button
            shape="round"
            style={{ width: 80, marginRight: 10 }}
            href="/recomm-page"
            onClick={() => history.goBack()}
          >
            Exit
          </Button>
          <Button type="primary" shape="round" style={{ width: 80 }}>
            Publish
          </Button>
        </div>
      </div>
    );
  }
}
