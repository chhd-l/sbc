import React, { Component } from 'react';
import { Headline, BreadCrumb } from 'qmkit';
import ClinicForm from './components/clinic-form';

export default class ClinicList extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      clinicList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      searchForm: {
        clinicsId: '',
        clinicsName: '',
        phone: '',
        primaryCity: '',
        primaryZip: ''
      },
      clinicId: this.props.match.params.id ? this.props.match.params.id : '',
      pageType: this.props.match.params.id ? 'edit' : 'create',
      loading: false
    };
  }
  render() {
    return (
      <div>
        {this.props.match.params.id ? <div></div> : <BreadCrumb />}
        <div className="container">
          <Headline
            title={
              this.props.match.params.id ? 'Edit Prescriber' : 'New Prescriber'
            }
          />
          <ClinicForm
            pageType={this.state.pageType}
            clinicId={this.state.clinicId}
          />
        </div>
      </div>
    );
  }
}
