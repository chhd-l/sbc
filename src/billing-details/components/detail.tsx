import React from 'react';

import { Row, Col } from 'antd';
import { Relax } from 'plume2';
import { IMap } from 'typings/globalType';
import moment from 'moment';

import { Const, util, cache } from 'qmkit';
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
          <p style={{ marginLeft: 5, marginBottom: 10 }}>
            <span style={styles.space}>
              {<FormattedMessage id="SettlementPeriod" />}：
              {settlement.get('startTime')}～{settlement.get('endTime')}
            </span>
            <span style={styles.space}>
              {<FormattedMessage id="statementNumber" />}：
              {settlement.get('settlementCode')}
            </span>
            <span style={styles.space}>
              {<FormattedMessage id="statementGenerationTime" />}：
              {moment(settlement.get('createTime'))
                .format(Const.DAY_FORMAT)
                .toString()}
            </span>
          </p>

          <Row>
            <Col span={3}>
              <p style={styles.nav}>
                {<FormattedMessage id="Paymentamount" />}
              </p>
              <p style={styles.num}>
                {settlement.get('splitPayPrice')
                  ? util.FORMAT_YUAN(settlement.get('splitPayPrice'))
                  : sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + '0.00'}
              </p>
            </Col>
            {/* <Col span={3}>
              <p style={styles.nav}>{<FormattedMessage id="totalFreight" />}</p>
              <p style={styles.num}>
                {settlement.get('deliveryPrice')
                  ? util.FORMAT_YUAN(settlement.get('deliveryPrice'))
                  : '¥0.00'}
              </p>
            </Col>*/}
          </Row>
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
