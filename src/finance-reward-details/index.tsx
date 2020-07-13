import React from 'react';

import { Breadcrumb, Tooltip, Icon } from 'antd';
import { StoreProvider } from 'plume2';
import styled from 'styled-components';

import { Headline, BreadCrumb } from 'qmkit';

import Detail from './components/detail';
import List from './components/list';
import Chart from './components/chart';
import Bottom from './components/bottom';
import AppStore from './store';
import './style.css';
import { FormattedMessage } from 'react-intl';
import SearchForm from './components/search-form';
import { WMChart } from 'biz';
//import { __DEV__ } from 'typings/global';

const OptionDiv = styled.div`
  width: 100%;
  text-align: right;
  display: block;
  position: absolute;
  right: 40px;
  top: 90px;
`;

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
          height: 'calc(100vh - 64px)',
          /*margin: -10,
          padding: 10,*/
          position: 'relative'
        }}
      >
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>
            {<FormattedMessage id="rewardDetails" />}
          </Breadcrumb.Item>
        </BreadCrumb>

        <div className="container">
          <div className="space-between">
            <div style={{ width: '60%' }}>
              <Headline title={<FormattedMessage id="rewardDetails" />} />
            </div>
            <OptionDiv style={{ width: '30%' }}>
              <Tooltip
                overlayStyle={{
                  overflowY: 'auto'
                  //height: 100
                }}
                placement="bottomLeft"
                title={this._renderTitle}
              >
                <a style={{ fontSize: 14 }}>
                  <Icon type="question-circle-o" />
                  &nbsp;&nbsp;{<FormattedMessage id="RewardRules" />}
                </a>
              </Tooltip>
            </OptionDiv>
          </div>

          <Detail />
          <SearchForm />
          <Chart />
          <List settleId={this.props.match.params.settleId} />
          <Bottom />
        </div>
      </div>
    );
  }

  _renderTitle = () => {
    return (
      <div>
        <div>
          <div style={{ textAlign: 'center', fontSize: '18px' }}>
            Reward rules
          </div>
          <br />
          <div>
            <p>1. 2020/06/06-Now:</p>
            <p>First order: 12%</p>
            <p>Repeat order:10%</p>
          </div>
        </div>
      </div>
    );
  };
}
