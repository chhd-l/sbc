import * as React from 'react';
import RelatedProduct from './related-product';
import { Relax } from 'plume2';
import { Button } from 'antd';
import { noop, Const } from 'qmkit';
import ProductTooltip from './productTooltip';
import { FormattedMessage, injectIntl } from 'react-intl';

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
      getGoodsId: any;
    };
  };

  static relaxProps = {
    priceOpt: 'priceOpt',
    editPriceSetting: noop,
    getGoodsId: 'getGoodsId'
  };
  componentDidMount() {
    const { getGoodsId } = this.props.relaxProps;
  }

  showProduct = (res) => {
    this.setState({
      visible: res
    });
  };

  render() {
    const { getGoodsId } = this.props.relaxProps;
    const disabled = Const.SITE_NAME === 'MYVETRECO';
    return (
      <div>
        <div className="related-btn">
          <Button type="primary" disabled={disabled} shape="round" onClick={() => this.showProduct(true)}>
          <FormattedMessage id="Product.ChooseProduct" />
          </Button>
          <span className="related-text"><FormattedMessage id="Product.Maximum30" /></span>
        </div>

        <RelatedProduct />
        {
          this.state.visible == true
            ? <ProductTooltip visible={this.state.visible} showModal={this.showProduct} />
            : <React.Fragment />
        }
      </div>
    );
  }
}
