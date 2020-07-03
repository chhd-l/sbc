import React from 'react';

import { Breadcrumb, Tooltip, Icon } from 'antd';
import { StoreProvider } from 'plume2';
import styled from 'styled-components';

import { Headline, BreadCrumb } from 'qmkit';

import Detail from './components/detail';
import List from './components/list';
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
          <Headline title={<FormattedMessage id="rewardDetails" />} />
          <OptionDiv>
            <Tooltip
              overlayStyle={{
                overflowY: 'auto',
                height: 'calc(100vh - 64px)'
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
          <Detail />
          <SearchForm />
          <div className="chart space-between">
            <div className="chartDetails1">
              <div className="chartDetailsList flex-content">
                <div className="btn">
                  Reward amount <br /> $ 4000
                </div>
                <div className="btn">
                  Order amount <br /> $ 4000
                </div>
                <div className="btn">
                  Order quantity
                  <br /> 12000
                </div>
              </div>
            </div>
            <div className="chartDetails2">
              <WMChart
                title=""
                startTime={new Date()}
                endTime={new Date()}
                dataDesc={[
                  { title: 'Order number', key: 'orderCount' },
                  { title: 'Order amount', key: 'orderAmt' },
                  { title: 'Number of payment orders', key: 'payOrderCount' },
                  { title: 'Payment amount', key: 'payOrderAmt' }
                ]}
                radioClickBack={() => {}}
                content={this.state.flowTrendData}
                rangeVisible={false}
              />
            </div>

            <div className="chartDetails2">
              <WMChart
                title=""
                startTime={new Date()}
                endTime={new Date()}
                dataDesc={[
                  { title: 'Order number', key: 'orderCount' },
                  { title: 'Order amount', key: 'orderAmt' },
                  { title: 'Number of payment orders', key: 'payOrderCount' },
                  { title: 'Payment amount', key: 'payOrderAmt' }
                ]}
                radioClickBack={() => {}}
                content={this.state.flowTrendData}
                rangeVisible={false}
              />
            </div>
          </div>

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
          <p></p>
        </div>
      </div>
    );
  };
}
