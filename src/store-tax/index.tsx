import React, { Component } from 'react';
import StepTax from './components/step-taxes';

import { BreadCrumb, Headline } from 'qmkit';
import { FormattedMessage } from 'react-intl';


export default class StoreTax extends Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>
        <BreadCrumb />
        <div className="container">
          <Headline title={<FormattedMessage id="Setting.Taxes" />} />
          <StepTax />
        </div>
      </div>
    );
  }
}

