import React from 'react';

import { Row, Col } from 'antd';
import { Relax } from 'plume2';
import { IMap } from 'typings/globalType';
import moment from 'moment';

import { Const, util } from 'qmkit';
import { FormattedMessage } from 'react-intl';

@Relax
export default class BillingDetails extends React.Component<any, any> {
  props: {
    relaxProps?: {
      settlement: IMap;
    };
  };

  static relaxProps = {
    settlement: 'settlement'
  };

  render() {
    const { settlement } = this.props.relaxProps;
    return (
      <div>
        <div style={styles.static}>
          <p style={{ marginLeft: 5, marginBottom: 2 }}>
            <span style={styles.space}>
              {<FormattedMessage id="PrescriberID" />}:
              02334
            </span>
            <span style={styles.space}>
              {<FormattedMessage id="PrescriberName" />}:
              Test12334
            </span>

          </p>


        </div>
      </div>
    );
  }
}

const styles = {
  nav: {
    fontSize: 14,
    color: '#666666',
    padding: 5
  },
  num: {
    color: '#F56C1D',
    fontSize: 16,
    padding: 5
  },
  static: {
    background: '#fafafa',
    padding: 10,
    marginBottom: 15,
    marginTop: 10
  },
  space: {
    marginRight: 35
  }
};
