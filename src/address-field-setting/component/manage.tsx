import React from 'react';
import { Headline } from 'qmkit';
import { Alert, Row, Col } from 'antd';

export default class Manage extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className="container-search">
        <Headline title="Address field setting / Manage field display" />
        <Alert type="info" message="Address setting is for address adding and address edit of shop and store portal" />
        <Row gutter={8}>
          <Col span={8}>
            <div>Select field</div>
            <div className="field-item-container">
              <span className="field-item">First name</span>
              <span className="field-item">Last name</span>
              <span className="field-item">Country</span>
              <span className="field-item">State</span>
              <span className="field-item">City</span>
            </div>
          </Col>
          <Col span={16}>
            <div>Basic information</div>
            <Row className="display-field-item-container">
              <Col span={12}>
                <div className="display-field-item"></div>
              </Col>
              <Col span={12}>
                <div className="display-field-item"></div>
              </Col>
              <Col span={12}>
                <div className="display-field-item"></div>
              </Col>
              <Col span={12}>
                <div className="display-field-item"></div>
              </Col>
              <Col span={12}>
                <div className="display-field-item"></div>
              </Col>
              <Col span={12}>
                <div className="display-field-item"></div>
              </Col>
              <Col span={12}>
                <div className="display-field-item"></div>
              </Col>
              <Col span={12}>
                <div className="display-field-item"></div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}
