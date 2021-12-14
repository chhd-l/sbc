import React from 'react';

import { Breadcrumb, Spin } from 'antd';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb, RCi18n } from 'qmkit';
import { injectIntl } from 'react-intl';
import AppStore from './store';
import MarketingDes from './common/components/marketing-des';
import GoodsList from './common/components/goods-list';
import Bottom from './common/components/bottom';
import GiftList from './gift-details/components/gift-list';
import MarketingRule from './common/components/marketing-rule';
import './index.css'
const MAK_TYPE = {
  0: 'Full reduction ',
  1: 'Full discount ',
  2: 'Gift ',
  3: 'Free shipping '
};

@StoreProvider(AppStore, { debug: __DEV__ })
class MarketingDetails extends React.Component<any, any> {
  store: AppStore;

  props: {
    intl;
    match: any
  }
  componentDidMount() {
    const  marketingId  = this.props.match && this.props.match.params ? this.props.match.params.marketingId : null
    this.store.init(marketingId);
  }

  render() {
    const marketingType = this.store.state().get('marketingType');
    const title = MAK_TYPE[marketingType] + (window as any).RCi18n({
      id: 'Marketing.Activitydetails'
    });
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{title}</Breadcrumb.Item>
        </BreadCrumb>
        {
          !this.store.state().get('loading') ?
            <>
              <div className="container-search">
                <Headline title={title} />

                {/*满赠顶部描述*/}
                <MarketingDes />
                {marketingType === 1 ? (
                  <MarketingRule />
                ) : marketingType === 2 ? (
                  <GiftList />
                ) : marketingType === 3 ? null : (
                  <MarketingRule />
                )}
                {/*商品列表*/}
              </div>
              <div className="container">
                {/*{*/}
                {/*  marketingType !== 3 ? <GoodsList /> : null*/}
                {/*}*/}
                <GoodsList />
                {/*满赠底部*/}
                <Bottom />
              </div>
            </> :
            <Spin className="loading-spin" />
        }

      </div>
    );
  }
}

export default injectIntl(MarketingDetails)
