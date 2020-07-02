import React from 'react';
import styled from 'styled-components';
const Containerp = styled.div`
  overflow: auto;
  padding: 20px;
  height: calc(100vh);
  h1 {
    margin-bottom: 15px;
  }
  h3 {
    margin: 10px 0;
  }
  .ml28 {
    margin-left: 28px;
  }
  p {
    line-height: 28px;
  }
`;
export default class FreightInstruction extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Containerp>
        <h1>Freight algorithm</h1>
        <p>
          Order price change does not affect freight calculation
          <br />
          Judgment of shipping conditions for single product shipping, based on
          the amount of all merchandise after marketing
          <br />
          Judgment of the shipping and shipping conditions of the store, based
          on the amount of all merchandise after marketing
          <br />
          The number, weight, and volume of all products using the same single
          product shipping template in one order are calculated after
          superposition
        </p>

        <h3>When the single item freight is effective</h3>
        <p>
          When the order contains multiple shipping templates, take the shipping
          template with the largest amount of the first item/first weight/first
          volume of all products, calculate the shipping cost of all products
          using the template, and use the other templates for the products
          according to the continuation/continuation of the respective template
          The amount of re/continuous volume is calculated and then summed.
          <br />
          note:
        </p>
        <p className="ml28">
          To exclude the shipping product when calculating <br />
          When calculating the renewal, the number of renewal/renewing/renewing
          volume needs to be rounded up
        </p>

        <p>
          例：
          <br />
          An order contains:
        </p>
        <p className="ml28">
          A10 pieces of goods (weight 0.5KG, volume 0.6m³) associated freight
          template 1 (by weight, default region) : first weight 0.5KG, 10 yuan,
          continued weight 1Kg, 5 yuan (less than 1kg, calculated by 1kg)
          <br />
          Commodity B10 pieces (weight 0.5KG, volume 0.6m³) associated freight
          template 2 (by volume, default area) : first volume 0.5m³, 12 yuan,
          continued volume 0.5m³, 6 yuan (less than 0.5m³, calculated by 0.5m³)
          <br />
          Commodity C10 pieces (weight 0.5KG, volume 0.6m³) associated freight
          template 3 (by number of pieces, default region) : 1 for the first
          piece, 5 yuan, 1 for the continuation, 4 yuan
          <br />
          Product D10 pieces (weight 0.5KG, volume 0.6m³) associated freight
          template 4 (by number of pieces, default region) : 1 for the first
          item, 4 yuan, 1 for the continuation, 4 yuan, Jiangsu, Zhejiang and
          Shanghai area, purchase of 1 free shipping
        </p>

        <p>The calculation process is：</p>
        <p className="ml28">
          1、Compare the shipping address and get the shipping cost setting and
          shipping condition setting in the relevant shipping template of the
          current product
          <br />
          2、Exclude the product D that meets the shipping conditions, and find
          out that the first price of product B is higher
          <br />
          3、Item B freight=12+（0.6×10-0.5)÷0.5（Rounded up）×6=78
          <br />
          Goods A freight=（0.5×10）÷1（Rounded up）×5=25
          <br /> Goods C freight=10×4=40
          <br />
          Goods D freight=0
          <br />
          Total freight=78+25+40=143
        </p>

        <p>
          How to judge whether the product is free shipping
          <br />
          For example: the basic freight set for commodity A is 10 yuan, and for
          each additional piece, the freight is 2 yuan, and the free shipping is
          over 3 pieces
          <br />
          If: There is only product A in an order. If A is over 3 items, it will
          not be included in the freight calculation.
          <br />
          If: The freight template used for goods B and A in an order is the
          same, A\B buys 2 pieces each, a total of 4 pieces, which meets the
          shipping conditions.
        </p>

        <h3>When the shipping fee is effective</h3>
        <p>
          Only one shipping template can be used for the order, and a fixed
          shipping fee is charged or to determine whether the shipping
          conditions are met
          <br />
          example:
          <br />
          An order contains:
          <br />
          Commodity ABCDEFGHI, paid 198.00 yuan
          <br />
          The delivery address is Yuhuatai District, Nanjing City, Jiangsu
          Province
          <br />
          If: The shipping cost of the shop in Nanjing is less than 150 yuan per
          order and the shipping cost is 10 yuan, then the shipping cost for
          this order is 0 yuan
          <br />
          If: The shipping cost of the shop in Nanjing is less than 200 yuan per
          order and the shipping cost is 10 yuan, then the shipping cost for
          this order is 10 yuan
          <br />
          If: The shipping fee of the store in Nanjing is fixed freight of 10
          yuan, then the freight of this order is 10 yuan
        </p>
      </Containerp>
    );
  }
}
