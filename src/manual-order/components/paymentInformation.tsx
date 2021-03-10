import React from 'react';

export default class PaymentInformation extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    const { stepName, noLanguageSelect } = this.props;

    return (
      <div>
        <h3>{noLanguageSelect ? 'Step2' : 'Step3'}</h3>
        <h4>
          {stepName}
          <span className="ant-form-item-required"></span>
        </h4>
        <div className="interaction"></div>
      </div>
    );
  }
}
