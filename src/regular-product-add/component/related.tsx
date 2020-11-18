import * as React from 'react';
import RelatedProduct from './related-product';
import { Relax } from 'plume2';
import { Button } from 'antd';
import { noop } from 'qmkit';
import ProductTooltip from './productTooltip';

@Relax
export default class Related extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      visible: false
    };
  }
  props: {
    relaxProps?: {
      priceOpt: number;
      getGoodsId: any
    };
  };

  static relaxProps = {
    priceOpt: 'priceOpt',
    editPriceSetting: noop,
    getGoodsId: 'goodsId'
  };

  showProduct = (res) => {
    this.setState({
      visible: res
    });
  };

  render() {
    const { getGoodsId } = this.props.relaxProps;
    setTimeout(()=>{
      console.log(getGoodsId,2222222);
    })
    return (
      <div>
        <div className="related-btn">
          <Button type="primary" shape="round" onClick={() => this.showProduct(true)}>
            Choose product
          </Button>
          <span className="related-text">Maximum 30 products</span>
        </div>

        <RelatedProduct />
        {this.state.visible == true ? <ProductTooltip visible={this.state.visible} showModal={this.showProduct} /> : <React.Fragment />}
      </div>
    );
  }
}
