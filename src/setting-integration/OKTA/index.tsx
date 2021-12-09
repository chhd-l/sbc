import React, { Component } from 'react';
import { BreadCrumb, Headline } from 'qmkit';
import { FormattedMessage } from 'react-intl';

export default class OKTA extends Component<any, any>{
  render() {
    return (
      <div>
        <BreadCrumb />
        <div className="container-search">
          <Headline title={<FormattedMessage id="Menu.OKTA" />} />
        </div>
      </div>
    );
  }
}