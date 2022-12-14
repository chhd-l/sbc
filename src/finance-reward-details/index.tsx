import React from 'react';

import { Breadcrumb, Tooltip, Icon, Spin } from 'antd';
import { StoreProvider } from 'plume2';
import styled from 'styled-components';

import { Headline, BreadCrumb } from 'qmkit';

import Detail from './components/detail';
import OrderInvoiceList from './components/list';
import Chart from './components/chart';
import Bottom from './components/bottom';
import AppStore from './store';
import './style.css';
import { FormattedMessage } from 'react-intl';
import SearchForm from './components/search-form';
//import { WMChart } from 'biz';
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
          // height: 'calc(100vh - 64px)',
          /*margin: -10,
          padding: 10,*/
          position: 'relative'
        }}
      >
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{<FormattedMessage id="Finance.rewardDetails" />}</Breadcrumb.Item>
        </BreadCrumb>
        <Spin spinning={this.store.get('loading')}>
          <div className="container-search">
            <div className="space-between">
              <div style={{ width: '60%' }}>
                <Headline title={<FormattedMessage id="Finance.rewardDetails" />} />
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
                    &nbsp;&nbsp;{<FormattedMessage id="Finance.RewardRules" />}
                  </a>
                </Tooltip>
              </OptionDiv>
            </div>
            <Detail />
            <SearchForm />
          </div>
          <div className="container">
            <Chart />
            <OrderInvoiceList settleId={this.props.match.params.settleId} />
            <Bottom />
          </div>
        </Spin>
      </div>
    );
  }

  _renderTitle = () => {
    return (
      <div>
        <div>
          <div style={{ textAlign: 'center', width: '170px', fontSize: '18px' }}>Reward rules</div>
          {this.state.fetchFindListByPrescriber.map((item, i) => {
            return (
              <div key={i} style={{ padding: '10px' }}>
                <p>
                  {i + 1}. {item.startTime} - {item.endTIme}
                </p>
                <p>
                  {<FormattedMessage id="Finance.firstRewardRate" />}: {item.firstRewardRate}
                </p>
                <p>
                  {<FormattedMessage id="Finance.repeatRewardRate" />}: {item.repeatRewardRate}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
}
