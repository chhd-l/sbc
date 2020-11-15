import * as React from 'react';
import { Relax } from 'plume2';
import { Radio, Alert } from 'antd';
import { noop } from 'qmkit';

import LevelPrice from './level-price';
import AreaPrice from './area-price';

const RadioGroup = Radio.Group;

@Relax
export default class Price extends React.Component<any, any> {
  props: {
    relaxProps?: {
      priceOpt: number;
      editPriceSetting: Function;
      marketPrice: number;
      costPrice: number;
      saleType: number;
    };
  };

  static relaxProps = {
    priceOpt: 'priceOpt',
    editPriceSetting: noop,
    marketPrice: ['goods', 'marketPrice'],
    costPrice: ['goods', 'costPrice'],
    saleType: ['goods', 'saleType']
  };

  render() {
    const { priceOpt, saleType } = this.props.relaxProps;
    return (
      <div>
        <Alert
          message={
            <div>
              <p>
                Please note that please select the price setting mode for this product first. Under the same SPU, all SKUs use the same price setting mode. Carry out batch setting of SPU, and the setting scheme will cover all SKUS (except skUS that open and keep independent
                setting). Please operate carefully. For separate pricing for SKU, you can go to the SKU pricing page.
              </p>
              {/* <p>请注意</p>
              <p>
                请先选择该商品使用的设价方式，同一SPU下所有SKU都使用同一种设价方式；
              </p>
              <p>
                进行SPU批量设价，设价方案将会覆盖所有SKU（开启保持独立设价的SKU除外），请谨慎操作；
              </p>
              <p>如需针对SKU单独设价，您可前往SKU的设价页；</p> */}
            </div>
          }
          type="info"
        />

        <div
          style={{
            backgroundColor: '#f5f5f5',
            padding: 15,
            marginTop: 10,
            width: '100%',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <RadioGroup onChange={this._editPriceSetting} value={priceOpt}>
            <Radio value={2}>Sell at market price&nbsp;&nbsp;</Radio>
            <Radio value={0}>Sell at consumer price&nbsp;&nbsp;</Radio>
            {saleType === 0 && <Radio value={1}>Set price for order quantity&nbsp;&nbsp;</Radio>}
          </RadioGroup>
        </div>

        {priceOpt == 0 && <LevelPrice />}
        {priceOpt == 1 && <AreaPrice />}
      </div>
    );
  }

  _editPriceSetting = (e) => {
    const { editPriceSetting } = this.props.relaxProps;
    editPriceSetting('priceOpt', e.target.value);
  };
}