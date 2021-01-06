import React, { Component } from 'react';
import { Checkbox, Spin, Pagination, Modal, Form, Input, Button, Popconfirm, message, Tooltip, Row } from 'antd';
import AddTargetProduct from '../modals/addTargetProduct';
export default class targetProduct extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false
    };
    this.deleteProduct = this.deleteProduct.bind(this);
    this.addTargetProduct = this.addTargetProduct.bind(this);
  }

  deleteProduct(id) {
    const { subscriptionPlan, addField } = this.props;
  }

  addTargetProduct() {
    this.setState({
      visible: true
    });
  }

  render() {
    const { loading, visible } = this.state;
    const { subscriptionPlan, addField } = this.props;
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
                        {subscriptionPlan.targetProducts &&
                          subscriptionPlan.targetProducts.map((item) => (
                            <tr key={item.id}>
                              <td>
                                <img src={item.goodsImg} />
                              </td>
                              <td>{item.SKU}</td>
                              <td>
                                <Tooltip
                                  overlayStyle={{
                                    overflowY: 'auto'
                                    //height: 100
                                  }}
                                  placement="bottomLeft"
                                  title={<div>{item.goodsName}</div>}
                                >
                                  <p className="overflow">{item.goodsName}</p>
                                </Tooltip>
                              </td>
                              <td>{item.specification}</td>
                              <td>{item.productCategoryNames}</td>
                              <td>{item.brandName}</td>
                              <td>{item.Price}</td>
                              <td>
                                <Popconfirm placement="topLeft" title="Are you sure to delete this product?" onConfirm={() => this.deleteProduct(item.id)} okText="Confirm" cancelText="Cancel">
                                  <Tooltip placement="top" title="Delete">
                                    <a className="iconfont iconDelete"></a>
                                  </Tooltip>
                                </Popconfirm>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    <div className="noProduct">
                      <div className="addProduct" onClick={this.addTargetProduct}>
                        <span> + Add product</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Spin>
          <AddTargetProduct visible={visible} />
        </div>
      </div>
    );
  }
}
