import React from 'react';
import { Input, Row, Col, Empty } from 'antd';
import _ from 'lodash';

import { FormattedMessage } from 'react-intl';

export default class ProductOverview extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      searchStr: ''
    };
    this.onSearch = _.debounce(this.onSearch, 200);
  }

  onSearch = (searchStr: string) => {
    this.setState({
      searchStr
    });
  }

  render() {
    const { products, list, onAddProduct } = this.props;
    const { searchStr } = this.state;
    const disProducts = products.filter(p => searchStr.trim() === '' || p.goodsInfoName.toLowerCase().indexOf(searchStr.toLowerCase()) > -1 || p.goodsInfoBarcode.toLowerCase().indexOf(searchStr.toLowerCase()) > -1);
    return (
      <>
        <div className="c-box-title"><FormattedMessage id="Order.offline.productOverview"/></div>
        <div className="c-product-overview">
          <Row gutter={[16, 16]}>
            {disProducts && disProducts.length ? disProducts.map((product, idx) => (
              <Col span={12} key={idx}>
                <div className={`c-product-item ${list.findIndex(p => p.goodsId === product.goodsId) > -1 ? 'selected' : ''}`} onClick={(e) => {e.preventDefault();onAddProduct(product);}}>
                  <img src={product.goodsImg} alt=""/>
                  <div className="name">{product.goodsInfoName}</div>
                  <div className="ean">EAN:{product.goodsInfoBarcode}</div>
                </div>
              </Col>
            )) : <Col span={24}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></Col>}
          </Row>
        </div>
        <div className="c-box-footer">
          <Input.Search size="large" onChange={(e) => this.onSearch(e.target.value)} />
        </div>
      </>
    );
  }
}
