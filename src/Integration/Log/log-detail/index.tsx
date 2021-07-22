import React, { Component } from 'react'
import { BreadCrumb, Headline } from 'qmkit'
import { FormattedMessage } from 'react-intl'
// import { Descriptions } from 'antd'
import { Form, Input, Row, Col, Icon, Collapse } from 'antd'
import '@/Integration/components/index.less'
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
          <Form className="filter-content myform">
            <Row gutter={24}>
              <Col span={8}>
                <Input addonBefore={<p style={styles.label}>{<FormattedMessage id="Log.RequestID" />}</p>} defaultValue="123456" disabled />
              </Col>
              <Col span={8}>
                <Input addonBefore={<p style={styles.label}>{<FormattedMessage id="Log.Time" />}</p>} defaultValue="123456" disabled />
              </Col>
              <Col span={8}>
                <Input addonBefore={<p style={styles.label}>{<FormattedMessage id="Log.Interface" />}</p>} defaultValue="123456" disabled />
              </Col>
            </Row>
          </Form>
        </div>

        <div style={styles.info}>
          <Collapse expandIconPosition="right" bordered={false} style={styles.ghost}>
            <Panel header={<h3 style={{fontSize:18}}>{<FormattedMessage id="Log Header" />}</h3>} key="0" style={styles.panelStyle}>

            </Panel>
          </Collapse>
        </div>
        <div style={styles.info}>
          <Collapse expandIconPosition="right" bordered={false} style={styles.ghost}>
            <Panel header={<h3 style={{fontSize:18}}>{<FormattedMessage id="Log Header" />}</h3>} key="0" style={styles.panelStyle}>

            </Panel>
          </Collapse>
        </div>
        <div style={styles.info}>
          <Collapse expandIconPosition="right" bordered={false} style={styles.ghost}>
            <Panel header={<h3 style={{fontSize:18}}>{<FormattedMessage id="Log Header" />}</h3>} key="0" style={styles.panelStyle}>

            </Panel>
          </Collapse>
        </div>
      </div>
    )
  }
}

const styles = {
  label: {
    width: 151,
    textAlign: 'center'
  },
  panelStyle: {
    borderRadius: 4,
    marginBottom: 24,
    border: 0,
    overflow: 'hidden',
  },
  ghost:{
    backgroundColor:'transparent',
    paddingLeft:12
  },
  info:{
    backgroundColor:'#fff',
    margin:12  
  }
} as any

export default LogDetail;