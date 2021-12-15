import React, { Component } from 'react';
import { StoreProvider } from 'plume2';
import Consent from './consent';
import AppStore from './store';

import { BreadCrumb, Headline } from 'qmkit';
import { FormattedMessage } from 'react-intl';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class StoreConsent extends Component<any, any> {
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
      </div>
    );
  }
}

