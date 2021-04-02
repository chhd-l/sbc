import React from 'react';
import { Modal, Card } from 'antd';
import moment from 'moment';

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
        <Card title={scanedInfo.status === 0 ? 'Booked' : scanedInfo.status === 1 ? 'Arrived' : scanedInfo.status === 2 ? 'Canceled' : ''} onClick={() => onChoose()}>
          <p>Recommendation ID: {scanedInfo.felinRecoId}</p>
          <p>Appointment time: {scanedInfo.apptDate ? moment(scanedInfo.apptDate, 'YYYYMMDD').format('YYYY-MM-DD') : ''} {scanedInfo.apptTime}</p>
          <p>Recommended products: {scanedInfo.products.map(p => p.goodsInfoName).join(', ')}</p>
        </Card>
      </Modal>
    );
  }
}
