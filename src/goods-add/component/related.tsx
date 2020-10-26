import * as React from 'react';
import RelatedProduct from './related-product';
import { Relax } from 'plume2';
import { Button } from 'antd';
import { noop } from 'qmkit';

@Relax
export default class Related extends React.Component<any, any> {
  props: {
    relaxProps?: {
      priceOpt: number;
    };
  };

  static relaxProps = {
    priceOpt: 'priceOpt',
    editPriceSetting: noop
  };

  render() {
    return (
      <div>
        <div className="related-btn">
          <Button type="primary" shape="round">
            Choose product
          </Button>
          <span className="related-text">Maximum 30 products</span>
        </div>

        <RelatedProduct />
      </div>
    );
  }
}
