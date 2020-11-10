import * as React from 'react';
import { Relax } from 'plume2';
import { FormattedMessage } from 'react-intl';
import { Alert } from 'antd';
@Relax
export default class AlertInfo extends React.Component<any, any> {
  render() {
    return (
      <Alert
        message={
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
          </div>
        }
        type="info"
      />
    );
  }
}
