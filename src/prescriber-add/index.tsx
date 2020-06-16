import React, { Component } from 'react';
import { Headline, BreadCrumb } from 'qmkit';
import ClinicForm from './components/prescriber-form';
import { Breadcrumb } from 'antd';

export default class ClinicList extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      prescriberList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      searchForm: {
        prescriberId: '',
        prescriberName: '',
        phone: '',
        primaryCity: '',
        primaryZip: ''
      },
      prescriberId: this.props.match.params.id
        ? this.props.match.params.id
        : '',
      pageType: this.props.match.params.id ? 'edit' : 'create',
      loading: false
    };
  }
  render() {
    return (
      <div>
        {this.props.match.params.id ? (
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>Edit Prescriber</Breadcrumb.Item>
          </BreadCrumb>
        ) : (
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>New Prescriber</Breadcrumb.Item>
          </BreadCrumb>
        )}
        <div className="container">
          {/* <Headline
            title={
              this.props.match.params.id ? 'Edit Prescriber' : 'New Prescriber'
            }
          /> */}
          <ClinicForm
            pageType={this.state.pageType}
            prescriberId={this.state.prescriberId}
          />
        </div>
      </div>
    );
  }
}
