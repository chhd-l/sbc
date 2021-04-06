import React from 'react';
import { StoreProvider } from 'plume2';
import { Breadcrumb, Form, Spin } from 'antd';
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
    const tid = this.props.match.params.id;
    this.store.init(tid);
  }

  render() {
    if (this.state.loading) {
      return (
        <div style={styles.noBackgroundContainer}>
          <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}></Spin>
        </div>
      );
    }
    
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>Add return order</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container-search">
          <Headline title="Add return order" />
        </div>
        <div className="container">
          <WrapperForm ref={(form) => (window['_form'] = form)} />
        </div>
      </div>
    );
  }
}

const styles = {
  noBackgroundContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh'
  } as any
};