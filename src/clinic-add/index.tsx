import React, { Component } from 'react';
import { Headline } from 'qmkit';
import ClinicForm from './components/clinic-form';

export default class ClinicList extends Component<any, any> {
  render() {
    return (
      <div className="container">
        <Headline title="New Clinic" />
        <ClinicForm />
      </div>
    );
  }
}
