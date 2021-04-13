import { Button } from 'antd';
import { cache, history } from 'qmkit';
import React from 'react';
import { FormattedMessage } from 'react-intl';

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
          <FormattedMessage id="Order.checkout" />
          <br />
          <FormattedMessage id="Order.open" />&nbsp;
          <span onClick={() => this.props.turnShowPage('other')} style={{ textDecoration: 'underline', color: '#f00', cursor: 'pointer' }}>
          <FormattedMessage id="Order.here" />
          </span>
        </h2>
      );
    } else if (status === 2) {
      return <h2><FormattedMessage id="Order.failure" /> {customer.customerAccount}</h2>;
    } else {
      return <h2><FormattedMessage id="Order.successfully" /> {customer.customerAccount}</h2>;
    }
  }

  render() {
    const { stepName, noLanguageSelect, status, customer } = this.props;
    return (
      <div>
        <h3>
          <FormattedMessage id={`Order.${noLanguageSelect ? 'Step2' : 'Step3'}`} />
        </h3>
        <h4>
          <FormattedMessage id={`Order.${stepName}`} />
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
              <FormattedMessage id="Order.Back" />
            </Button>
          )}
        </div>
      </div>
    );
  }
}
