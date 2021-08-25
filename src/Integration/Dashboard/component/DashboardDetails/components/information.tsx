import React, { Component } from 'react';
import { Form, Row, Col, Input } from 'antd';
import { RCi18n } from 'qmkit';

interface IProps {
  detailInfo: any, // 数据源
  form: any
}

class Information extends Component<any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const { detailInfo } = this.props
    return (

      <Form className="filter-content myform">
        <Row gutter={24}>
          <Col span={8}>
            <Input addonBefore={<p style={styles.label}>{RCi18n({ id: 'Log.RequestID' })}</p>}
              value={detailInfo.id || ''} disabled />
          </Col>
          <Col span={8}>
            <Input addonBefore={<p style={styles.label}>{RCi18n({ id: 'Interface.Method' })}</p>}
              value={detailInfo.method || ''} disabled />
          </Col>
          <Col span={8}>
            <Input addonBefore={<p style={styles.label}>{RCi18n({ id: 'Interface.URL' })}</p>}
              value={detailInfo.url || ''} disabled />
          </Col>
        </Row>
        <Row gutter={24} style={{marginTop:20}}>
          <Col span={8}>
            <Input addonBefore={<p style={styles.label}>{RCi18n({ id: 'Interface.MiddleLayer' })}</p>}
              value={detailInfo.middleLayer || ''} disabled />
          </Col>
          <Col span={8}>
            <Input addonBefore={<p style={styles.label}>{RCi18n({ id: 'Interface.Type' })}</p>}
              value={detailInfo.type || ''} disabled />
          </Col>
          <Col span={8}>
            <Input addonBefore={<p style={styles.label}>{RCi18n({ id: 'Interface.Provider' })}</p>}
              value={detailInfo.apiProviderName || ''} disabled />
          </Col>
        </Row>
        <Row gutter={24} style={{marginTop:20}}>
          <Col span={8}>
            <Input addonBefore={<p style={styles.label}>{RCi18n({ id: 'Interface.Invoker' })}</p>}
              value={detailInfo.apiInvokerName || ''} disabled />
          </Col>
          <Col span={8}>
            <Input addonBefore={<p style={styles.label}>{RCi18n({ id: 'Interface.DataFlow' })}</p>}
              value={detailInfo.dataSourceFromName && detailInfo.dataSourceToName ?
                detailInfo.dataSourceFromName + ' → ' + detailInfo.dataSourceToName : ''} disabled />
          </Col>
          <Col span={8}>
            <Input addonBefore={<p style={styles.label}>{RCi18n({ id: 'Interface.Function' })}</p>}
              value={detailInfo.description || ''} disabled />
          </Col>
        </Row>
        <Row gutter={24} style={{marginTop:20}}>
          <Col span={8}>
            <Input addonBefore={<p style={styles.label}>{RCi18n({ id: 'Interface.Uptime' })}</p>}
              value={detailInfo.updateTime || ''} disabled />
          </Col>
        </Row>
      </Form>
    );
  }
}
const styles = {
  label: {
    width: 151,
    textAlign: 'center'
  }
} as any;
export default Form.create<IProps>()(Information);
