import React, { Component } from 'react'
import { Form, Row, Col, Input } from 'antd';
import { FormattedMessage } from 'react-intl';

export default class RequestDetail extends Component<any, any>{
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Form className="filter-content myform">
        <Row gutter={24}>
          <Col span={8}>
            <Input addonBefore={<p style={styles.label}>{<FormattedMessage id="Log.RequestID" />}</p>} defaultValue="123" disabled />
          </Col>
          <Col span={8}>
            <Input addonBefore={<p style={styles.label}>{<FormattedMessage id="Log.Time" />}</p>} defaultValue="123456" disabled />
          </Col>
          <Col span={8}>
            <Input addonBefore={<p style={styles.label}>{<FormattedMessage id="Log.Interface" />}</p>} defaultValue="123456" disabled />
          </Col>
        </Row>
      </Form>
    )
  }
}

const styles = {
  label: {
    width: 151,
    textAlign: 'center'
  }
} as any