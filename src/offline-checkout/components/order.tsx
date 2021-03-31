import React from 'react';
import { Row, Col } from 'antd';
import Header from './header';
import Cart from './cart';
import ProductOverview from './products';
import MemberBar from './member-bar';
import CheckoutAction from './checkout-action';

export default class Order extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  onSetMemberInfo = (memberInfo: any = {}, memberType: 'Member' | 'Guest' = 'Guest') => {
    const { onSelectMember } = this.props;
    onSelectMember(memberInfo, memberType);
  };

  render() {
    const { memberType, memberInfo, products, list, onAddProduct } = this.props;
    return (
      <>
        <Header />
        <Row gutter={24} className="c-content">
          <Col span={16} style={{height: '100%'}}>
            <div className="c-full-box c-order">
              <Cart list={list} />
            </div>
            <div className="c-full-box c-foot">
              <MemberBar memberType={memberType} memberInfo={memberInfo} onChange={this.onSetMemberInfo} />
            </div>
          </Col>
          <Col span={8} style={{height: '100%'}}>
            <div className="c-full-box c-order">
              <ProductOverview products={products} list={list} onAddProduct={onAddProduct} />
            </div>
            <div className="c-full-box c-foot">
              <CheckoutAction />
            </div>
          </Col>
        </Row>
      </>
    );
  }
}
