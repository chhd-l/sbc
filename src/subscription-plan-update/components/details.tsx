import { Col, Row } from 'antd';
import React, { Component } from 'react';
import AddProduct from '../modals/addProduct';
import { Spin, Popconfirm, Tooltip, Input, Icon, InputNumber } from 'antd';
import moment from 'moment';
import { cache } from 'qmkit';

const intReg = /^[0-9]*$/;
export default class details extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false
    };
    this.showAddMainProduct = this.showAddMainProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.updateTable = this.updateTable.bind(this);
    this.updateQty = this.updateQty.bind(this);
    this.updateSettingPrice = this.updateSettingPrice.bind(this);
    this.onBlurQty = this.onBlurQty.bind(this);
  }

  showAddMainProduct() {
    this.setState({
      visible: true
    });
  }

  updateTable(selectedGoods) {
    const { addField, subscriptionPlan } = this.props;
    if (selectedGoods) {
      selectedGoods.map((item) => {
        item.packageId = 'PK' + moment(new Date()).format('YYMMDDHHmmSSS');
        item.quantity = 1;
        item.settingPrice = item.marketPrice ? +item.marketPrice : 0.01;
      });
      subscriptionPlan.mainGoods.push(...selectedGoods);
      //subscriptionPlan.mainGoodsIds.push(...selectedRowKeys);
      addField('mainGoods', subscriptionPlan.mainGoods);
      //addField('mainGoodsIds', subscriptionPlan.mainGoodsIds);
    }
    this.setState({
      visible: false
    });
  }

  deleteProduct(key) {
    const { subscriptionPlan, addField } = this.props;

    let newMainProducts = [];
    subscriptionPlan.mainGoods.forEach((item) => {
      if (item.goodsInfoId !== key) {
        newMainProducts.push(item);
      }
    });
    addField('mainGoods', newMainProducts);
    //addField('mainGoodsIds', newMainProductIds);
  }

  updateQty(goodsInfoId, qty) {
    if (qty && !intReg.test(qty)) {
      return;
    }
    if (qty <= 0) {
      return;
    }
    const { subscriptionPlan, addField } = this.props;
    subscriptionPlan.mainGoods.map((item) => {
      if (item.goodsInfoId === goodsInfoId && qty <= item.stock) {
        item.quantity = qty;
      }
      return item;
    });
    addField('mainGoods', subscriptionPlan.mainGoods);
  }

  onBlurQty(goodsInfoId, qty) {
    const { subscriptionPlan, addField } = this.props;
    if (!qty) {
      addField(
        'mainGoods',
        subscriptionPlan.mainGoods.map((item) => {
          if (item.goodsInfoId === goodsInfoId) {
            item.quantity = 1;
          }
          return item;
        })
      );
    }
  }

  updateSettingPrice(goodsInfoId, settingPrice) {
    const { subscriptionPlan, addField } = this.props;
    addField(
      'mainGoods',
      subscriptionPlan.mainGoods.map((item) => {
        if (item.goodsInfoId === goodsInfoId) {
          item.settingPrice = settingPrice;
        }
        return item;
      })
    );
  }

  render() {
    const { loading, visible } = this.state;
    const { editable, subscriptionPlan } = this.props;
    const currencySymbol = sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) : '';
    return (
      <div>
        <h3>Step5</h3>
        <Row>
          <Col span={20}>
            <h4>Details</h4>
          </Col>
          <Col span={4}>
            {editable ? (
              <div className="addProduct" onClick={this.showAddMainProduct} style={{ marginTop: '10px', marginRight: '0px' }}>
                <span> + Add product</span>
              </div>
            ) : null}
          </Col>
        </Row>
        <div className="details">
          {subscriptionPlan.mainGoods &&
            subscriptionPlan.mainGoods.map((item) => (
              <div className="ant-table-wrapper" key={item.packageId}>
                <div className="ant-table ant-table-large ant-table-scroll-position-left">
                  <div className="ant-table-content">
                    <div className="ant-table-body">
                      <table>
                        <thead className="ant-table-thead">
                          <tr>
                            <th style={{ width: '10%' }}>Package ID</th>
                            <th style={{ width: '10%' }}>Image</th>
                            <th style={{ width: '20%' }}>Product Name</th>
                            <th style={{ width: '10%', textAlign: 'center' }}>Qty</th>
                            <th style={{ width: '10%' }}>Market Price</th>
                            <th style={{ width: '12%' }}>Setting Price</th>
                            <th style={{ width: '10%' }}>Operation</th>
                          </tr>
                        </thead>
                        <tbody className="ant-table-tbody">
                          <tr key={item.packageId}>
                            <td>{item.packageId}</td>
                            <td>
                              <img src={item.goodsInfoImg} />
                            </td>
                            <td>
                              <Tooltip
                                overlayStyle={{
                                  overflowY: 'auto'
                                }}
                                placement="bottomLeft"
                                title={<div>{item.goodsInfoName}</div>}
                              >
                                <p className="overflow">{item.goodsInfoName}</p>
                              </Tooltip>
                            </td>
                            <td>
                              <Icon type="minus" onClick={() => this.updateQty(item.goodsInfoId, item.quantity - 1)} />
                              <Input
                                disabled={!editable}
                                style={{ textAlign: 'center' }}
                                value={item.quantity}
                                onBlur={(e) => {
                                  const value = (e.target as any).value;
                                  this.onBlurQty(item.goodsInfoId, value);
                                }}
                                onChange={(e) => {
                                  const value = (e.target as any).value;
                                  this.updateQty(item.goodsInfoId, value && intReg.test(value) ? parseInt(value) : value);
                                }}
                              />
                              <Icon type="plus" onClick={() => this.updateQty(item.goodsInfoId, item.quantity + 1)} />
                            </td>
                            <td>
                              <span className="currency">{currencySymbol}</span>
                              {item.marketPrice}
                            </td>
                            <td>
                              <span className="currency">{currencySymbol}</span>
                              <InputNumber
                                disabled={!editable}
                                precision={2}
                                min={0.01}
                                value={item.settingPrice}
                                onChange={(value) => {
                                  this.updateSettingPrice(item.goodsInfoId, value);
                                }}
                              />
                            </td>
                            <td>
                              {editable && (
                                <Popconfirm placement="topLeft" title="Are you sure to delete this product?" onConfirm={() => this.deleteProduct(item.goodsInfoId)} okText="Confirm" cancelText="Cancel">
                                  <Tooltip placement="top" title="Delete">
                                    <a className="iconfont iconDelete"></a>
                                  </Tooltip>
                                </Popconfirm>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {visible ? <AddProduct visible={visible} clearExsit={true} updateTable={this.updateTable} exsit={subscriptionPlan.mainGoods} /> : null}
      </div>
    );
  }
}
