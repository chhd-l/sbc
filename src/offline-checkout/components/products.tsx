import React from 'react';
import { Input, Row, Col } from 'antd';

export default class ProductOverview extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <>
        <div className="c-box-title">Product overview</div>
        <div className="c-product-overview">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div className="c-product-item">
                <img src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202008030949305851.png" alt=""/>
                <div className="name">Puppy LATA</div>
                <div className="ean">Ean:12345678</div>
              </div>
            </Col>
            <Col span={12}>
              <div className="c-product-item selected">
                <img src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202008030949305851.png" alt=""/>
                <div className="name">Puppy LATA</div>
                <div className="ean">Ean:12345678</div>
              </div>
            </Col>
            <Col span={12}>
              <div className="c-product-item">
                <img src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202008030949305851.png" alt=""/>
                <div className="name">Puppy LATA</div>
                <div className="ean">Ean:12345678</div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="c-box-footer">
          <Input.Search />
        </div>
      </>
    );
  }
}
