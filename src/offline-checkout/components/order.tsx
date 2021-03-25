import React from 'react';
import { Row, Col } from 'antd';
import Header from './header';

export default class Order extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <>
        <Header />
        <Row gutter={24} className="c-content">
          <Col span={16} style={{height: '100%'}}>
            <div className="c-full-box c-order"></div>
            <div className="c-full-box c-foot"></div>
          </Col>
          <Col span={8} style={{height: '100%'}}>
            <div className="c-full-box c-order"></div>
            <div className="c-full-box c-foot"></div>
          </Col>
        </Row>
      </>
    );
  }
}
