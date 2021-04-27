import * as React from 'react';
import { Relax } from 'plume2';
import { FormattedMessage } from 'react-intl';
import { Alert } from 'antd';

export default class AlertInfo extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Alert
        message={
          !this.props.message ? (
            <div>
              <p>
                <FormattedMessage id="operationInstruction" />：
              </p>
              <p>
                1、
                <FormattedMessage id="operationInstruction.first" />
              </p>
              <p>
                2、
                <FormattedMessage id="operationInstruction.second" />
              </p>
              <p>
                3、
                <FormattedMessage id="operationInstruction.third" />
              </p>
              <p>
                4、
                <FormattedMessage id="Product.settheSalescategory" />
              </p>
            </div>
          ) : (
            this.props.message
          )
        }
        type="info"
      />
    );
  }
}
