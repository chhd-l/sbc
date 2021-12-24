import React from 'react';
import { Headline, BreadCrumb } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import CookieBanner from './components/cookie-banner';

export default function ShopCookieBanner() {

  return (
    <div>
      <BreadCrumb />
      <div className="container">
        <Headline title={<FormattedMessage id="Setting.cookieBanner" />} />
        <CookieBanner />
      </div>
    </div>
  );
}