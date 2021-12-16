import React from 'react';
import { Headline, BreadCrumb } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import NavigationHeader from './components/navigation-header';

export default function ShopFooter() {

  return (
    <div>
      <BreadCrumb />
      <div className="container">
        <Headline title={<FormattedMessage id="Setting.footer" />} />
        <NavigationHeader />
      </div>
    </div>
  );
}