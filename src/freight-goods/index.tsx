import React from 'react';
import { StoreProvider, Relax } from 'plume2';

import { Breadcrumb, Form, Alert } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';

import AppStore from './store';
import FreightTemp from './component/freight-temp';
const FreightTempForm = Form.create()(FreightTemp) as any;
const FreightTempRelax = Relax(FreightTempForm);
/**
 * 运费模板
 */
@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsFreight extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { freightId } = (this.props.match && this.props.match.params) || {
      freightId: 0
    };
    const { isCopy } = (this.props.location && this.props.location.state) || {
      isCopy: false
    };
    if (freightId) {
      // 初始化
      this.store.init(freightId, isCopy);
    }
  }

  constructor(props) {
    super(props);
  }

  render() {
    let typeTxt = 'Add';
    if (this.store.state().get('freightTempId')) {
      typeTxt = 'Edit';
    }
    return [
      // <AuthWrapper functionName="f_freight_1">
      <BreadCrumb thirdLevel={true}>
        <Breadcrumb.Item>
          {typeTxt}Single product shipping template
        </Breadcrumb.Item>
      </BreadCrumb>,
      <div className="container-search" key="container">
        <Headline title={`${typeTxt}Single product shipping template`} />
        <Alert
          message={
            <div>
              <div>
                When setting the freight template, it is recommended to consider
                the possible overflow costs of sub-wholesale goods, and
                appropriately increase the base.
              </div>
              <div>
                If you want to set up shipping, please choose the seller to bear
                the shipping cost, if you want to set up shipping in some
                regions, please choose the buyer to bear the shipping cost, and
                then specify the conditions of shipping.
              </div>
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: 15 }}
        />
        <FreightTempRelax />
      </div>
    ];
  }
}
