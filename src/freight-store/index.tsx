import React from 'react';
import { StoreProvider, Relax } from 'plume2';

import { Breadcrumb, Form } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';

import FreightTemp from './component/freight-temp';
import AppStore from './store';

const FreightTempForm = Form.create()(FreightTemp) as any;
const FreightTempRelax = Relax(FreightTempForm);

/**
 * 运费模板
 */
@StoreProvider(AppStore, { debug: __DEV__ })
export default class StoreFreight extends React.Component<any, any> {
  store: AppStore;

  UNSAFE_componentWillMount() {
    const { freightId } = (this.props.match && this.props.match.params) || {
      freightId: 0
    };

    if (freightId) {
      // 初始化
      this.store.init(freightId);
    } else {
      this.store.fetchSelectedAreaIds();
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
      <BreadCrumb thirdLevel={true}>
        <Breadcrumb.Item>{typeTxt} Store freight template</Breadcrumb.Item>
      </BreadCrumb>,
      <div className="container" key="container">
        <Headline title={`${typeTxt} Store freight template`} />
        <FreightTempRelax />
      </div>
    ];
  }
}
