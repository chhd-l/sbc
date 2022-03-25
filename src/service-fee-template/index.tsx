import React from 'react';
import { StoreProvider } from 'plume2';
import { Button } from 'antd';
import { Headline, history, AuthWrapper, checkAuth, BreadCrumb } from 'qmkit';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import TemplateList from './component/template-list';
import AppStore from './store';
import './index.less';

/**
 * 运费模板
 */
@StoreProvider(AppStore, { debug: __DEV__ })
export default class FreightTemplate extends React.Component<any, any> {
  store: AppStore;

  UNSAFE_componentWillMount() {}

  constructor(props) {
    super(props);
    this.state = {
      switchSerficeFee: false
    };
  }

  componentDidMount() {
    this.store.initList();
  }

  _handleServiceFeeChange = (checked) => {
    if (checked) {
      this.setState({
        switchSerficeFee: !this.state.switchSerficeFee
      });
    }
  };

  render() {
    const { switchSerficeFee } = this.state;
    return [
      <BreadCrumb />,
      <div className="service-fee-container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
            alignItems: 'center'
          }}
        >
          <Headline
            title={<FormattedMessage id="Menu.Service fee" />}
            style={{ marginBottom: 0 }}
          />
          <Button
            type="primary"
            htmlType="submit"
            onClick={(e) => {
              history.push('/service-fee-template-add');
            }}
          >
            <FormattedMessage id="ServiceFee.AddSetting" />
          </Button>
        </div>
        <TemplateList />
      </div>
    ];
  }
}
