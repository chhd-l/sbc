import React from 'react';
import { Col, Empty, Input, Row, Collapse, Icon } from 'antd';
import _ from 'lodash';

import { FormattedMessage } from 'react-intl';
import { RCi18n } from 'qmkit';

const { Panel } = Collapse;

const customPanelStyle = {
  background: '#f7f7f7',
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
  overflow: 'hidden'
};

export default class ProductOverview extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      searchStr: ''
    };
    this.onSearch = _.debounce(this.onSearch, 200);
  }

  onSearch = (searchStr: string) => {
    const { onSearch } = this.props;

    onSearch(searchStr);

    this.setState({
      searchStr
    });
  };

  renderProductList = (products) => {
    console.log('products', products);

    const { list, onAddProduct } = this.props;

    return (
      <Row gutter={[16, 16]}>
        {products.length ? (
          products.map((product, idx) => (
            <Col span={12} key={idx}>
              <div
                className={`c-product-item ${
                  list.findIndex((p) => p.goodsInfoId === product.goodsInfoId) > -1
                    ? 'selected'
                    : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  onAddProduct(product);
                }}
              >
                <img src={product.goodsImg} alt="product" />
                <div className="name">{product.goodsInfoName}</div>
                <div className="ean">
                  WEIGHT:{product?.weight}
                  {product?.infoUnit?.toLowerCase()}
                </div>
                {/* <div className="ean">EAN:{product.goodsInfoBarcode}</div> */}
                {/* <div className="ean">SKU:{product.goodsInfoNo}</div> */}
              </div>
            </Col>
          ))
        ) : (
          <Col span={24}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </Col>
        )}
      </Row>
    );
  };

  renderProductColumn = () => {
    const { searchStr } = this.state;
    const { products, cateList } = this.props;

    // console.log(cateList,'cateListcateList',products)

    cateList.forEach((cate) => {
      cate.childProducts = products.filter((childProduct) => childProduct.cateId === cate.cateId);
    });

    // 如果有搜索条件 or 没有分类 就直接展示所有产品
    if (searchStr || cateList?.length === 0) {
      return this.renderProductList(products);
    }

    return cateList.map(({ cateName, childProducts }, index) => {
      return (
        <Collapse
          key={index}
          bordered={false}
          expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
        >
          <Panel
            header={`${cateName} [${childProducts.length}]`}
            key={index}
            style={customPanelStyle}
          >
            {this.renderProductList(childProducts)}
          </Panel>
        </Collapse>
      );
    });
  };

  render() {
    return (
      <>
        <div className="c-box-title">
          <FormattedMessage id="Order.offline.productOverview" />
        </div>
        <div className="c-product-overview">{this.renderProductColumn()}</div>
        <div className="c-box-footer">
          <Input.Search
            size="large"
            placeholder={RCi18n({ id: 'Order.offline.searchByProductName' })}
            onSearch={(value) => this.onSearch(value)}
          />
        </div>
      </>
    );
  }
}
