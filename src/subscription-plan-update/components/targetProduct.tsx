import React, { Component } from 'react';
import { Spin, Popconfirm, Tooltip } from 'antd';
import AddProduct from '../modals/addProduct';
import { FormattedMessage } from 'react-intl';
import { util } from 'qmkit';
export default class targetProduct extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false
    };
    this.deleteProduct = this.deleteProduct.bind(this);
    this.showAddTargetProduct = this.showAddTargetProduct.bind(this);
    this.updateTable = this.updateTable.bind(this);
  }

  deleteProduct(key) {
    const { subscriptionPlan, addField, allSkuProduct } = this.props;

    let newTargetProductIds = [];
    subscriptionPlan.targetGoodsIds.map((item) => {
      if (item !== key) {
        newTargetProductIds.push(item);
      }
    });
    let targetProducts = allSkuProduct.filter((x) => newTargetProductIds.includes(x.goodsInfoId));
    addField('targetGoods', targetProducts);
    addField('targetGoodsIds', newTargetProductIds);
  }

  showAddTargetProduct() {
    this.setState({
      visible: true
    });
  }

  updateTable(selectedGoods) {
    const { addField } = this.props;
    if (selectedGoods) {
      addField('targetGoods', selectedGoods);
      //addField('targetGoodsIds', selectedRowKeys);
    }
    this.setState({
      visible: false
    });
  }

  render() {
    const { loading, visible } = this.state;
    const { editable, subscriptionPlan } = this.props;
    return (
      <div>
        <h3>
          <FormattedMessage id="Subscription.Step2" />
        </h3>
        <h4>
          <FormattedMessage id="Subscription.TargetProduct" />
        </h4>
        <div className="targetProduct">
          <Spin spinning={loading}>
            <div className="ant-table-wrapper">
              <div className="ant-table ant-table-large ant-table-scroll-position-left">
                <div className="ant-table-content">
                  <div className="ant-table-body">
                    <table>
                      <thead className="ant-table-thead">
                        <tr>
                          <th style={{ width: '10%' }}>
                            <FormattedMessage id="Subscription.Image" />
                          </th>
                          <th style={{ width: '10%' }}>
                            <FormattedMessage id="Subscription.SKU" />
                          </th>
                          <th style={{ width: '20%' }}>
                            <FormattedMessage id="Subscription.ProductName" />
                          </th>
                          <th style={{ width: '15%' }}>
                            <FormattedMessage id="Subscription.Specification" />
                          </th>
                          <th style={{ width: '25%' }}>
                            <FormattedMessage id="Subscription.ProductCategory" />
                          </th>
                          <th style={{ width: '10%' }}>
                            <FormattedMessage id="Subscription.Brand" />
                          </th>
                          <th style={{ width: '10%' }}>
                            <FormattedMessage id="Subscription.Price" />
                          </th>
                        </tr>
                      </thead>
                      <tbody className="ant-table-tbody">
                        {subscriptionPlan.targetGoods &&
                          subscriptionPlan.targetGoods.map((item) => (
                            <tr key={item.goodsInfoId}>
                              <td>
                                <img src={util.optimizeImage(item.goodsInfoImg)} />
                              </td>
                              <td>{item.goodsInfoNo}</td>
                              <td>
                                <Tooltip
                                  overlayStyle={{
                                    overflowY: 'auto'
                                    //height: 100
                                  }}
                                  placement="bottomLeft"
                                  title={<div>{item.goodsInfoName}</div>}
                                >
                                  <p className="overflow">{item.goodsInfoName}</p>
                                </Tooltip>
                              </td>
                              <td>{item.specName}</td>
                              <td>{item.goodsCateName}</td>
                              <td>{item.brandName}</td>
                              <td>{item.marketPrice}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    {editable ? (
                      <div className="noProduct">
                        <div className="addProduct" onClick={this.showAddTargetProduct}>
                          <span>
                            <FormattedMessage id="Subscription.AddProduct" />
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </Spin>
          {visible && <AddProduct visible={visible} updateTable={this.updateTable} selectedRowKeys={[]} />}
        </div>
      </div>
    );
  }
}
