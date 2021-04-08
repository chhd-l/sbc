import React from 'react';
import { Button, Row, Col, Icon } from 'antd';

import { FormattedMessage } from 'react-intl';

export default class Result extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }
  
  render() {
    const { onRefill, onClose } = this.props;

    return (
      <div style={{marginTop: 50, textAlign:'center'}}>
        <Row>
          <Col span={12} offset={6}>
            <div className="c-box">
              <div style={{padding:'30px 0',backgroundColor:'#e2001a',color:'#fff',fontSize:20,fontWeight:'bold'}}><FormattedMessage id="Order.offline.success"/></div>
              <div style={{padding:'2px 20px',backgroundColor:'#fff',fontSize:16}}>
                <div style={{margin:'30px 0',color:'#e2001a'}}><FormattedMessage id="Order.offline.refillAlert"/></div>
                <div style={{margin:'30px 0'}}>
                  <Button type="primary" size="large" block onClick={() => onRefill(true)}><FormattedMessage id="Order.offline.yes"/></Button>
                </div>
                <div style={{margin:'30px 0'}}>
                  <Button type="default" size="large" block onClick={() => onRefill(false)}><FormattedMessage id="Order.offline.no"/></Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={12} offset={6} style={{textAlign:'right',marginTop:20}}>
            <Button type="link" onClick={onClose}><FormattedMessage id="Order.offline.complete"/> <Icon type="right" /></Button>
          </Col>
        </Row>
      </div>
    );
  }
}
