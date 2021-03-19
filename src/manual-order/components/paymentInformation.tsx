import { cache } from 'qmkit';
import React from 'react';

export default class PaymentInformation extends React.Component<any, any> {
  state = {
    status: false
  };
  constructor(props) {
    super(props);
  }

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
              <span onClick={() => this.props.turnShowPage('other')} style={{ textDecoration: 'underline', color: '#f00', cursor: 'pointer' }}>
                here
              </span>
            </h2>
          )}
        </div>
      </div>
    );
  }
}
