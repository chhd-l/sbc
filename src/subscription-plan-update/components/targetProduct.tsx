import React, { Component } from 'react';
import { Spin, Popconfirm, Tooltip } from 'antd';
import AddProduct from '../modals/addProduct';
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

  updateTable(selectedRowKeys) {
    const { addField, allSkuProduct } = this.props;
    if (selectedRowKeys) {
      let targetProducts = allSkuProduct.filter((x) => selectedRowKeys.includes(x.goodsInfoId));
      addField('targetGoods', targetProducts);
      addField('targetGoodsIds', selectedRowKeys);
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
        <h3>Step2</h3>
        <h4>Target Product</h4>
        <div className="targetProduct">
          <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
            <div className="ant-table-wrapper">
              <div className="ant-table ant-table-large ant-table-scroll-position-left">
                <div className="ant-table-content">
                  <div className="ant-table-body">
                    <table>
                      <thead className="ant-table-thead">
                        <tr>
                          <th style={{ width: '10%' }}>Image</th>
                          <th style={{ width: '10%' }}>SKU</th>
                          <th style={{ width: '20%' }}>Product Name</th>
                          <th style={{ width: '15%' }}>Specification</th>
                          <th style={{ width: '15%' }}>Product Category</th>
                          <th style={{ width: '10%' }}>Brand</th>
                          <th style={{ width: '10%' }}>Price</th>
                          <th style={{ width: '10%' }}>Operation</th>
                        </tr>
                      </thead>
                      <tbody className="ant-table-tbody">
                        {subscriptionPlan.targetGoods &&
                          subscriptionPlan.targetGoods.map((item) => (
                            <tr key={item.goodsInfoId}>
                              <td>
                                <img src={item.goodsInfoImg} />
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
                          <span> + Select product</span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </Spin>
          <AddProduct visible={visible} updateTable={this.updateTable} selectedRowKeys={subscriptionPlan.targetGoods} />
        </div>
      </div>
    );
  }
}
