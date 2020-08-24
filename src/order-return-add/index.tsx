import React from 'react';
import { StoreProvider } from 'plume2';
import { Breadcrumb, Form } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';

import AppStore from './store';
import ReturnOrderForm from './components/form';

const WrapperForm = Form.create({})(ReturnOrderForm);

/**
 * 新增退单
 */
@StoreProvider(AppStore, { debug: __DEV__ })
export default class OrderReturnAdd extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const tid = this.props.location.search.split('=')[1];
    this.store.init(tid);
  }

  render() {
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>Add chargeback</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container-search">
          <Headline title="Add chargeback" />
        </div>
        <div className="container">
          <WrapperForm ref={(form) => (window['_form'] = form)} />
        </div>
      </div>
    );
  }
}
