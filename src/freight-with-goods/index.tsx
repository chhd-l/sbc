import React from 'react';
import { StoreProvider } from 'plume2';

import { Breadcrumb } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';
import FreightGoodsList from './component/freight-goods-list';
import FreightModal from './component/freight-modal';
import AppStore from './store';

/**
 * 运费模板关联商品
 */
@StoreProvider(AppStore, { debug: __DEV__ })
export default class FreightWithGoods extends React.Component<any, any> {
  store: AppStore;
  componentDidMount() {
    const { freightId } = this.props.match.params;
    // 初始化
    const params = {
      pageNum: 0,
      pageSize: 10,
      freightTempId: freightId
    };
    this.store.init(params);
    this.store.setFreightList();
    this.store.setGoodsFreight(freightId, false);
  }

  constructor(props) {
    super(props);
  }

  render() {
    return [
      <BreadCrumb thirdLevel={true}>
        <Breadcrumb.Item>Related products</Breadcrumb.Item>
      </BreadCrumb>,

      <div className="container" key="container">
        <Headline title="Related products" />
        <div style={{ marginBottom: 10 }}>
          Current shipping template:
          {this.store.state().get('freightTemp').get('freightTempName')}
        </div>
        <FreightGoodsList />
        {/*批量设置运费模板Modal*/}
        <FreightModal />
      </div>
    ];
  }
}
