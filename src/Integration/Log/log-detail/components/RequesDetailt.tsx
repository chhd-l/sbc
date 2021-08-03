import React, { Component } from 'react'
import { Form, Row, Col, Input } from 'antd';
import { RCi18n } from 'qmkit';

interface IProps {
  datalist: any,
}

export default class RequestDetail extends Component<any, any>{
  constructor(props) {
    super(props);
  }
  render() {
    const { datalist } = this.props
    return (
      // 展示默认数据
      <Form className="filter-content myform">
        <Row gutter={24}>
          <Col span={8}>
            <Input addonBefore={<p style={styles.label}>{RCi18n({id:'Log.RequestID'})}</p>} defaultValue={datalist.requestId} disabled />
          </Col>
          <Col span={8}>
            <Input addonBefore={<p style={styles.label}>{RCi18n({id:'Log.Time'})}</p>} defaultValue={datalist.time} disabled />
          </Col>
          <Col span={8}>
            <Input addonBefore={<p style={styles.label}>{RCi18n({id:'Log.Interface'})}</p>} defaultValue={datalist.interface} disabled />
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