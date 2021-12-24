import React from 'react';
import { Headline, BreadCrumb } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import Config from './components/shop-config';

export default function ShopConfig() {

  return (
    <div>
      <BreadCrumb />
      <div className="container">
        <Headline title={<FormattedMessage id="Setting.shopConfig" />} />
        <Config />
      </div>
    </div>
  );
}