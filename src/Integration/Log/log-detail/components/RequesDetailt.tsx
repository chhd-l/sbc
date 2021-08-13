import React, { Component } from 'react'
import { Form, Row, Col, Input, Collapse, } from 'antd';
import { AuthWrapper, RCi18n } from 'qmkit';
import ReactJson from 'react-json-view';
import moment from 'moment';


const { Panel } = Collapse;

export default class RequestDetail extends Component<any, any>{
  constructor(props) {
    super(props);
  }


  render() {
    const { detailInfo } = this.props



    return (
      <AuthWrapper functionName="f_pet_owner_tagging">
      {/* <AuthWrapper functionName="f_lod_detail"> */}
        <div className="container-search">
          <Form className="filter-content myform">
            <Row gutter={24}>
              <Col span={8}>
                <Input addonBefore={<p style={styles.label}>{RCi18n({ id: 'Log.RequestID' })}</p>}
                  value={detailInfo.requestId || ''} disabled />
              </Col>
              <Col span={8}>
                <Input addonBefore={<p style={styles.label}>{RCi18n({ id: 'Log.Time' })}</p>}
                  value={detailInfo.invokeTime ? moment(detailInfo.invokeTime).format('YYYY-MM-DD HH:mm:ss') : ''}
                  disabled />
              </Col>
              <Col span={8}>
                <Input addonBefore={<p style={styles.label}>{RCi18n({ id: 'Log.Interface' })}</p>}
                  value={detailInfo.interfaceName || ''} disabled />
              </Col>
            </Row>
          </Form>

        </div>

        <div style={styles.infofirst}>
          <Collapse bordered={false} expandIconPosition="right" style={styles.ghost}>
            <Panel header={<h3 style={{ fontSize: 18 }}>{RCi18n({ id: 'Log.LogHeader' })}</h3>} key="0" style={styles.panelStyle}>
              <ReactJson
                src={detailInfo.param && detailInfo.param.header ? detailInfo.param.header : {}}
                name={false}
                style={{ fontFamily: 'Sans-Serif' }}
                displayDataTypes={false}
                displayObjectSize={false}
                enableClipboard={false}
                collapseStringsAfterLength={180}
              />
            </Panel>
          </Collapse>
        </div>
        <div style={styles.info}>
          <Collapse bordered={false} expandIconPosition="right" style={styles.ghost}>
            <Panel header={<h3 style={{ fontSize: 18 }}>{RCi18n({ id: 'Log.LogPayload' })}</h3>} key="0" style={styles.panelStyle}>
              <ReactJson
                src={detailInfo.param && detailInfo.param.payload ? JSON.parse(detailInfo.param.payload) : {}}
                name={false}
                style={{ fontFamily: 'Sans-Serif' }}
                displayDataTypes={false}
                displayObjectSize={false}
                enableClipboard={false}
                collapseStringsAfterLength={180}
              />
            </Panel>
          </Collapse>
        </div>
        

      </AuthWrapper>

    )
  }
}

const styles = {
  label: {
    width: 151,
    textAlign: 'center'
  }
} as any