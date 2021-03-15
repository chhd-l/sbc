import React from 'react';

export default class SelectedProduct extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // const { getFieldDecorator } = this.props.form;
    const { noLanguageSelect } = this.props;
    return (
      <div>
        <h3>Step2</h3>
        <h4>
          {this.props.stepName}
          <span className="ant-form-item-required"></span>
        </h4>
        <div className="basicInformation"></div>
      </div>
    );
  }
}
