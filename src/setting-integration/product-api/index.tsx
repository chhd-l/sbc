import React, { Component } from 'react';
import { BreadCrumb, Headline } from 'qmkit';
import { FormattedMessage } from 'react-intl';

export default class ProductApi extends Component<any, any>{
  render() {
    return (
      <div>
        <BreadCrumb />
        <div className="container-search">
          <Headline title={<FormattedMessage id="Menu.Product API" />} />
        </div>
      </div>
    );
  }
}