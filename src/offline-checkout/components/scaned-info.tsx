import React from 'react';
import { Modal, Card } from 'antd';
import moment from 'moment';

import { FormattedMessage } from 'react-intl';

export default class ScanedInfo extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const { visible, scanedInfo, onChoose } = this.props;
    return (
      <Modal
        visible={visible}
        closable={false}
        footer={null}
        className="scan-member-info"
        title={<div><div>{scanedInfo.customerName}</div><div>{scanedInfo.email}</div></div>}
      >
        <Card headStyle={{fontWeight:'bold'}} title={scanedInfo.status === 0 ? <FormattedMessage id="Order.offline.booked"/> : scanedInfo.status === 1 ? <FormattedMessage id="Order.offline.arrived"/> : scanedInfo.status === 2 ? <FormattedMessage id="Order.offline.canceled"/> : ''} onClick={() => onChoose()}>
          <p><span className="text-bold"><FormattedMessage id="Order.offline.recommendationId"/>:</span> {scanedInfo.felinRecoId}</p>
          <p><span className="text-bold"><FormattedMessage id="Order.offline.appointmentTime"/>:</span> {scanedInfo.apptDate ? moment(scanedInfo.apptDate, 'YYYYMMDD').format('YYYY-MM-DD') : ''} {scanedInfo.apptTime}</p>
          <p><span className="text-bold"><FormattedMessage id="Order.offline.recommendationProducts"/>:</span> {scanedInfo.products ? scanedInfo.products.map(p => p.goodsInfoName).join(', ') : ''}</p>
        </Card>
      </Modal>
    );
  }
}
