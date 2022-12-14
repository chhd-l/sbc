import React, { Component } from 'react';
import { Headline, BreadCrumb, cache, Const } from 'qmkit';
import ClinicForm from './components/prescriber-form';
import MyvetForm from './components/myvetreco-form';
import { Breadcrumb, message } from 'antd';
import { FormattedMessage } from 'react-intl';
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
      prescriberId: this.props.match.params.id ? this.props.match.params.id : '',
      pageType: this.props.match.params.id ? 'edit' : 'create',
      loading: false
    };
  }
  render() {
    let employee = JSON.parse(sessionStorage.getItem(cache.EMPLOYEE_DATA));
    const prescriberId = employee && employee.prescribers && employee.prescribers.length > 0 ? employee.prescribers[0].id : null;
    // if (prescriberId && prescriberId !== this.props.match.params.id) {
    //   message.error("You don't have permission to access the prescriber");
    //   return null;
    // }
    return (
      <div>
        {prescriberId && Const.SITE_NAME !== 'MYVETRECO' ? null : this.props.match.params.id ? (
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>
              <FormattedMessage id={Const.SITE_NAME === 'MYVETRECO' ? "Clinic.EditClinic" : "Prescriber.EditPrescriber"} />
            </Breadcrumb.Item>
          </BreadCrumb>
        ) : (
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>
              <FormattedMessage id={Const.SITE_NAME === 'MYVETRECO' ? "Clinic.AddClinic" : "Prescriber.NewPrescriber"} />
            </Breadcrumb.Item>
          </BreadCrumb>
        )}
        <div className="container">
          {/* <Headline
            title={
              this.props.match.params.id ? 'Edit Prescriber' : 'New Prescriber'
            }
          /> */}
          {Const.SITE_NAME === 'MYVETRECO' ? <MyvetForm pageType={this.state.pageType} prescriberId={this.state.prescriberId} /> :<ClinicForm pageType={this.state.pageType} prescriberId={this.state.prescriberId} />}
        </div>
      </div>
    );
  }
}
