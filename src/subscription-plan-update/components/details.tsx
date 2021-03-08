import { Col, Row } from 'antd';
import React, { Component } from 'react';
import AddProduct from '../modals/addProduct';
import { Spin, Popconfirm, Tooltip, Input, Icon, InputNumber } from 'antd';
import moment from 'moment';
import { cache } from 'qmkit';
import { FormattedMessage } from 'react-intl';

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
    const { addField, Subscription } = this.props;
    if (selectedGoods) {
      selectedGoods.map((item) => {
        item.packageId = 'PK' + moment(new Date()).format('YYMMDDHHmmSSS');
        item.quantity = 1;
        item.settingPrice = null;
      });
      Subscription.mainGoods.push(...selectedGoods);
      //Subscription.mainGoodsIds.push(...selectedRowKeys);
      addField('mainGoods', Subscription.mainGoods);
      //addField('mainGoodsIds', Subscription.mainGoodsIds);
    }
    this.setState({
      visible: false
    });
  }

  deleteProduct(key) {
    const { Subscription, addField } = this.props;

    let newMainProducts = [];
    Subscription.mainGoods.forEach((item) => {
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
    const { Subscription, addField } = this.props;
    Subscription.mainGoods.map((item) => {
      if (item.goodsInfoId === goodsInfoId) {
        item.quantity = qty;
      }
      return item;
    });
    addField('mainGoods', Subscription.mainGoods);
  }

  onBlurQty(goodsInfoId, qty) {
    const { Subscription, addField } = this.props;
    if (!qty) {
      addField(
        'mainGoods',
        Subscription.mainGoods.map((item) => {
          if (item.goodsInfoId === goodsInfoId) {
            item.quantity = 1;
          }
          return item;
        })
      );
    }
  }

  updateSettingPrice(goodsInfoId, settingPrice) {
    const { Subscription, addField } = this.props;
    addField(
      'mainGoods',
      Subscription.mainGoods.map((item) => {
        if (item.goodsInfoId === goodsInfoId) {
          item.settingPrice = settingPrice;
        }
        return item;
      })
    );
  }

  render() {
    const { loading, visible } = this.state;
    const { editable, Subscription } = this.props;
    const currencySymbol = sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) : '';
    return (
      <div>
        <h3>
          <FormattedMessage id="Subscription.Step5" />
        </h3>
        <Row>
          <Col span={20}>
            <h4>
              <FormattedMessage id="Subscription.Details" />
            </h4>
          </Col>
          <Col span={4}>
            {editable ? (
              <div className="addProduct" onClick={this.showAddMainProduct} style={{ marginTop: '10px', marginRight: '0px' }}>
                <span>
                  {' '}
                  + <FormattedMessage id="Subscription.Addproduct" />
                </span>
              </div>
            ) : null}
          </Col>
        </Row>
        <div className="details">
          {Subscription.mainGoods &&
            Subscription.mainGoods.map((item) => (
              <div className="ant-table-wrapper" key={item.packageId}>
                <div className="ant-table ant-table-large ant-table-scroll-position-left">
                  <div className="ant-table-content">
                    <div className="ant-table-body">
                      <table>
                        <thead className="ant-table-thead">
                          <tr>
                            <th style={{ width: '10%' }}>
                              <FormattedMessage id="Subscription.PackageID" />
                            </th>
                            <th style={{ width: '10%' }}>
                              <FormattedMessage id="Subscription.Image1" />
                            </th>
                            <th style={{ width: '20%' }}>
                              <FormattedMessage id="Subscription.ProductName1" />
                            </th>
                            <th style={{ width: '10%', textAlign: 'center' }}>
                              <FormattedMessage id="Subscription.Qty" />
                            </th>
                            <th style={{ width: '10%' }}>
                              <FormattedMessage id="Subscription.MarketPrice" />
                            </th>
                            <th style={{ width: '12%' }}>
                              <FormattedMessage id="Subscription.SettingPrice" />
                            </th>
                            <th style={{ width: '10%' }}>
                              <FormattedMessage id="Subscription.Operation" />
                            </th>
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
                                min={0}
                                value={item.settingPrice}
                                onChange={(value) => {
                                  this.updateSettingPrice(item.goodsInfoId, value);
                                }}
                              />
                            </td>
                            <td>
                              {editable && (
                                <Popconfirm
                                  placement="topLeft"
                                  title={<FormattedMessage id="Subscription.deleteThisProduct" />}
                                  onConfirm={() => this.deleteProduct(item.goodsInfoId)}
                                  okText={<FormattedMessage id="Subscription.Confirm" />}
                                  cancelText={<FormattedMessage id="Subscription.Cancel" />}
                                >
                                  <Tooltip placement="top" title={<FormattedMessage id="Subscription.Delete" />}>
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
        {visible ? <AddProduct visible={visible} clearExsit={true} updateTable={this.updateTable} exsit={Subscription.mainGoods} /> : null}
      </div>
    );
  }
}
