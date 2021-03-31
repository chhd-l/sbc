import React, { Component } from 'react';
import { Headline, BreadCrumb } from 'qmkit';
import PrescriberTypeForm from './components/prescriber-type-form';
import { Breadcrumb } from 'antd';
import { FormattedMessage } from 'react-intl';
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
        {this.props.match.params.id ? (
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>
              <FormattedMessage id="Prescriber.EditPrescriberType" />
            </Breadcrumb.Item>
          </BreadCrumb>
        ) : (
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>
              <FormattedMessage id="Prescriber.NewPrescriberType" />
            </Breadcrumb.Item>
          </BreadCrumb>
        )}
        <div className="container-search">
          <Headline title={this.props.match.params.id ? <FormattedMessage id="Prescriber.EditPrescriberType" /> : <FormattedMessage id="Prescriber.NewPrescriberType" />} />
        </div>
        <div className="container-search">
          <PrescriberTypeForm pageType={this.state.pageType} clinicId={this.state.clinicId} />
        </div>
      </div>
    );
  }
}
