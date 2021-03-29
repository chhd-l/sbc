import React from 'react';
import { Modal, Card } from 'antd';

export default class ScanedInfo extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        closable={false}
        footer={null}
        className="scan-member-info"
        title={<div><div>Name</div><div>Consumer Email</div></div>}
      >
        <Card title="Arrived">
          <p>Recommendation ID:</p>
          <p>Appointment time:</p>
          <p>Recommended products:</p>
          <p>Comments:</p>
        </Card>
      </Modal>
    );
  }
}
