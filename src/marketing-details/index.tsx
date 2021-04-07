import React from 'react';

import { Breadcrumb, Spin } from 'antd';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';

import AppStore from './store';
import MarketingDes from './common/components/marketing-des';
import GoodsList from './common/components/goods-list';
import Bottom from './common/components/bottom';
import GiftList from './gift-details/components/gift-list';
import MarketingRule from './common/components/marketing-rule';
import './index.css'
const MAK_TYPE = {
  0: 'Full reduction',
  1: 'Full discount'
  // 2: '满赠'
};

@StoreProvider(AppStore, { debug: __DEV__ })
export default class MarketingDetails extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { marketingId } = this.props.match.params;
    this.store.init(marketingId);
  }

  render() {
    const marketingType = this.store.state().get('marketingType');
    const title = MAK_TYPE[marketingType] + 'Activity details';
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
                ) : (
                  <MarketingRule />
                )}
                {/*商品列表*/}
              </div>
              <div className="container">

                <GoodsList />

                {/*满赠底部*/}
                <Bottom />
              </div>
            </> :
            <Spin className="loading-spin" indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" alt="" />} />
        }

      </div>
    );
  }
}
