import { Button } from 'antd';
import { cache, history } from 'qmkit';
import React from 'react';

export default class PaymentInformation extends React.Component<any, any> {
  state = {
    status: false
  };
  constructor(props) {
    super(props);
  }

  renderStatus(status, customer) {
    if (status === 1) {
      return (
        <h2>
          Please process to checkout in the new window.
          <br />
          If the new window fails to open, click{' '}
          <span onClick={() => this.props.turnShowPage('other')} style={{ textDecoration: 'underline', color: '#f00', cursor: 'pointer' }}>
            here
          </span>
        </h2>
      );
    } else if (status === 2) {
      return <h2>The order is placed failure for {customer.customerAccount}</h2>;
    } else {
      return <h2>The order is placed successfully for {customer.customerAccount}</h2>;
    }
  }

  render() {
    const { stepName, noLanguageSelect, status, customer } = this.props;
    return (
      <div>
        <h3>{noLanguageSelect ? 'Step2' : 'Step3'}</h3>
        <h4>
          {stepName}
          <span className="ant-form-item-required"></span>
        </h4>
        <div className="interaction" style={{ textAlign: 'center', paddingTop: 20 }}>
          {this.renderStatus(status, customer)}
          {status !== 1 && (
            <Button
              style={{ marginTop: 20 }}
              type="primary"
              onClick={(e) => {
                history.push('/order-add');
              }}
            >
              Back
            </Button>
          )}
        </div>
      </div>
    );
  }
}
