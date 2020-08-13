import React from 'react';
import { StoreProvider } from 'plume2';

import { Breadcrumb, Alert, Radio, Button, Tabs } from 'antd';
import { Headline, history, AuthWrapper, checkAuth, BreadCrumb } from 'qmkit';
import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';

import GoodsSetting from './component/goods-setting';
import StoreSetting from './component/store-setting';
import AppStore from './store';

const TitleBox = styled.div`
  background: #fafafa;
  height: 60px;
  padding-left: 10px;
  padding-right: 20px;
  line-height: 60px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .ant-radio-group {
    width: calc(100% - 400px);
    margin-left: 20px;
    .ant-radio-wrapper:last-child {
      margin-left: 40px;
    }
  }
`;

const RadioGroup = Radio.Group;
/**
 * 运费模板
 */
@StoreProvider(AppStore, { debug: __DEV__ })
export default class FreightTemplate extends React.Component<any, any> {
  store: AppStore;

  UNSAFE_componentWillMount() {
    let { tab } = (this.props &&
      this.props.location &&
      this.props.location.state) || {
      tab: 0
    };
    // 初始化
    this.store.init({ tab } as any);
  }

  constructor(props) {
    super(props);
  }

  render() {
    const fMode = this.store.state().get('fMode');
    const tab = this.store.state().get('tab');
    return [
      <BreadCrumb />,
      // <Breadcrumb separator=">" key="Breadcrumb">
      //   <Breadcrumb.Item>设置</Breadcrumb.Item>
      //   <Breadcrumb.Item>物流设置</Breadcrumb.Item>
      //   <Breadcrumb.Item>运费模板</Breadcrumb.Item>
      // </Breadcrumb>,
      <div>
        <div className="container-search" key="container">
          <Headline
            title={<FormattedMessage id="freightTemplate"></FormattedMessage>}
          />
          <Alert
            message={
              <div>
                Please set the shipping calculation mode first. When selecting a
                single product, the order shipping uses the shipping charge of
                each product; if the store shipping is selected, the single
                product shipping template selected by the product will not be
                effective, and the unified shipping will be charged according to
                the order amount;
              </div>
            }
            type="info"
            showIcon
          />
          <AuthWrapper functionName="f_freight_type_set">
            <TitleBox>
              Set the shipping calculation mode :
              <RadioGroup
                onChange={(e: any) =>
                  this.store.fieldSave({
                    field: 'fMode',
                    value: e.target.value
                  })
                }
                value={fMode}
              >
                <Radio value={0} key="0">
                  <FormattedMessage id="storeShipping"></FormattedMessage>
                </Radio>
                <Radio value={1} key="1">
                  <FormattedMessage id="singleProductShipping"></FormattedMessage>
                </Radio>
              </RadioGroup>
              <Button type="primary" onClick={() => this._save()}>
                Save settings
              </Button>
            </TitleBox>
          </AuthWrapper>
        </div>
        <div className="container">
          {(checkAuth('f_store_temp_list') ||
            checkAuth('f_goods_temp_list')) && (
            <Tabs
              activeKey={tab + ''}
              defaultActiveKey={tab + ''}
              onChange={(value) =>
                this.store.fieldSave({ field: 'tab', value })
              }
              tabBarStyle={{ marginTop: 16 }}
            >
              {checkAuth('f_store_temp_list') && (
                <Tabs.TabPane
                  tab={<FormattedMessage id="storeShipping"></FormattedMessage>}
                  key="0"
                >
                  <StoreSetting />
                </Tabs.TabPane>
              )}
              {checkAuth('f_goods_temp_list') && (
                <Tabs.TabPane
                  tab={
                    <FormattedMessage id="singleProductShipping"></FormattedMessage>
                  }
                  key="1"
                >
                  <GoodsSetting />
                </Tabs.TabPane>
              )}
            </Tabs>
          )}
        </div>
      </div>
    ];
  }

  /**
   * 保存店铺的运费模板类别
   */
  _save = () => {
    this.store.saveStoreFreight();
  };
}
