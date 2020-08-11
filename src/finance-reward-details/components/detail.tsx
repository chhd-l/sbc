import React from 'react';

import { Row, Col } from 'antd';
import { Relax } from 'plume2';
import { IMap, IList } from 'typings/globalType';

import moment from 'moment';

import { Const, util } from 'qmkit';
import { FormattedMessage } from 'react-intl';

@Relax
export default class BillingDetails extends React.Component<any, any> {
  props: {
    relaxProps?: {
      settlement: IMap;
      setName: IList;
      prescriber: any;
    };
  };

  static relaxProps = {
    settlement: 'settlement',
    setName: 'setName',
    prescriber: 'prescriber'
  };

  render() {
    const { prescriber } = this.props.relaxProps;
    return (
      <div>
        <div style={styles.static}>
          <p style={{ marginLeft: 5, marginBottom: 2 }}>
            <span style={styles.space}>
              {<FormattedMessage id="PrescriberID" />}：
              {prescriber.prescriberId}
            </span>
            <span style={styles.space}>
              {<FormattedMessage id="PrescriberName" />}：
              {prescriber.prescriberName}
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
    background: '#fff',
    padding: 10,
    marginBottom: 15,
    marginTop: 10
  },
  space: {
    marginRight: 35
  }
};
