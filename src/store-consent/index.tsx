import React, { Component } from 'react';
import { StoreProvider } from 'plume2';
import { Button } from 'antd';
import Consent from './consent';
import AppStore from './store';

import { BreadCrumb, Headline } from 'qmkit';
import { FormattedMessage } from 'react-intl';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class StoreConsent extends Component<any, any> {
  store: AppStore;
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>
        <BreadCrumb />
        <div className="container">
          <Headline title={<FormattedMessage id="Setting.consent" />} />
          <Consent />
        </div>
        {this.store.state().get('pageChangeType') == 'List' ? null : (
          <div className="bar-button">
            <Button type="primary" onClick={() => this.store.consentSubmit(this.store.state().get('consentForm'), this.store.state().get('editId'))}>
              <FormattedMessage id="Setting.Submit" />
            </Button>
          </div>
        )}
      </div>
    );
  }
}

