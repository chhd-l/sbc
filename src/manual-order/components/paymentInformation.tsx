import { cache } from 'qmkit';
import React from 'react';

export default class PaymentInformation extends React.Component<any, any> {
  state = {
    status: true
  };
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //const {token}=JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)||'{}');
    const token =
      'eyJhbGciOiJIUzI1NiIsInppcCI6IkRFRiJ9.eNp0jk8LgkAUxL_LO0v4lnV39VREhw4V9Ocs6-6TBHVFVynE794WRKfmOPMbZmYYxgIyMIhrS7WrvKeVcc3KtBBBpT1kKDBJMBGSR2DGwbuG-r0NHVkGkZJKsZSkKphOhLBpzFBwLJmCH78xxo2t_zv05Y66oQBttb8_EUPQ1dqXrm_e5u1yPR125-BOuh4p19aSzQfqp8rQEIh5CRk9us9nhSmPJV9eAAAA__8.DSFy91v9VnqvIKeOgmG5T1DWHqnnbiIKneqVr9iUogk';
    this.turnShowPage(token);
  }

  turnShowPage = (stoken) => {
    window.open(`http://shopstg.royalcanin.com/de/cart?stoken=${stoken}`, 'newwindow', 'height=500, width=800, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
  };

  render() {
    const { stepName, noLanguageSelect } = this.props;
    const { status } = this.state;
    return (
      <div>
        <h3>{noLanguageSelect ? 'Step2' : 'Step3'}</h3>
        <h4>
          {stepName}
          <span className="ant-form-item-required"></span>
        </h4>
        <div className="interaction" style={{ textAlign: 'center', paddingTop: 20 }}>
          {status ? (
            <h2>The order is placed successfully for mgn@cc.com</h2>
          ) : (
            <h2>
              Please process to checkout in the new window.
              <br />
              If the new window fails to open, click{' '}
              <span onClick={this.turnShowPage} style={{ textDecoration: 'underline', color: '#f00', cursor: 'pointer' }}>
                here
              </span>
            </h2>
          )}
        </div>
      </div>
    );
  }
}
