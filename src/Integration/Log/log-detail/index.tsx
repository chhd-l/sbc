import React, { Component } from 'react'
import { BreadCrumb, Headline } from 'qmkit'
import { FormattedMessage } from 'react-intl'
// import { Descriptions } from 'antd'
import { Form, Input, Row, Col, Icon, Collapse } from 'antd'
import { Container } from 'postcss';

const { Panel } = Collapse;

class LogDetail extends Component<any, any>{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <BreadCrumb />
        <div className="container-search">
          <Headline title={<FormattedMessage id="Log.RequestDetail" />} />
          {/* <Row>
            <Col span={8} style = {{paddingRight: 10}}>
            <Descriptions bordered size="small" style={{width:337,textAlign:'center'}}>
              <Descriptions.Item label={<FormattedMessage id="Log.RequestID"  />}>
              <p style={styles.label}>123455</p>
              </Descriptions.Item>
            </Descriptions>
            </Col>
            <Col span={8}>
            <Descriptions bordered size="small" style={{width:337,textAlign:'center'}}>
              <Descriptions.Item label={<FormattedMessage id="Log.Time" />}>
              <p style={styles.label}>123455</p>
              </Descriptions.Item>
            </Descriptions>
            </Col>
            <Col span={8}>
            <Descriptions bordered size="small" style={{width:337,textAlign:'center'}}>
              <Descriptions.Item label={<FormattedMessage id="Log.Interface" />}>
              <p style={styles.label}>123455</p>
              </Descriptions.Item>
            </Descriptions>
            </Col>
          </Row> */}
          <Form layout="inline" className="filter-content">
            <Row>
              <Col span={8}>
                <Input style={{ width: 337 }} addonBefore={<p style={{ width: 120 }}>{<FormattedMessage id="Log.RequestID" />}</p>} defaultValue="123456" disabled />
              </Col>
              <Col span={8}>
                <Input style={{ width: 337 }} addonBefore={<p style={{ width: 120 }}>{<FormattedMessage id="Log.Time" />}</p>} defaultValue="123456" disabled />
              </Col>
              <Col span={8}>
                <Input style={{ width: 337 }} addonBefore={<p style={{ width: 120 }}>{<FormattedMessage id="Log.Interface" />}</p>} defaultValue="123456" disabled />
              </Col>
            </Row>
          </Form>
        </div>

        <Collapse expandIconPosition="right" defaultActiveKey="2">
          
            <Panel header={<Headline title="Log Header" />} key="0">

            </Panel>
          
          
            <Panel header={<Headline title="Log Header" />} key="1">

            </Panel>
            <Panel header={<Headline title="Log Header" />} key="2">

            </Panel>
        </Collapse>
      </div>
    )
  }
}

const styles = {
  label: {
    width: 134,

  },
}

export default LogDetail;