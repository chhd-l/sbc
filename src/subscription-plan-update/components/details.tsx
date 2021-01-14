import { Col, Row } from 'antd';
import React, { Component } from 'react';
import AddProduct from '../modals/addProduct';
import { Spin, Popconfirm, Tooltip } from 'antd';
import moment from 'moment';

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
  }

  showAddMainProduct() {
    this.setState({
      visible: true
    });
  }

  updateTable(selectedRowKeys) {
    const { addField, allSkuProduct } = this.props;
    if (selectedRowKeys) {
      let mainProducts = allSkuProduct.filter((x) => selectedRowKeys.includes(x.goodsInfoId));
      mainProducts.map((item) => {
        item.packageId = 'PK' + moment(new Date()).format('YYYYMMDDHHSSS');
      });
      addField('mainProducts', mainProducts);
      addField('mainProductIds', selectedRowKeys);
    }
    this.setState({
      visible: false
    });
  }

  deleteProduct(key) {
    const { subscriptionPlan, addField, allSkuProduct } = this.props;

    let newMainProductIds = [];
    subscriptionPlan.mainProductIds.map((item) => {
      if (item !== key) {
        newMainProductIds.push(item);
      }
    });
    let mainProducts = allSkuProduct.filter((x) => newMainProductIds.includes(x.goodsInfoId));
    addField('mainProducts', mainProducts);
    addField('mainProductIds', newMainProductIds);
  }

  render() {
    const { loading, visible } = this.state;
    const { subscriptionPlan } = this.props;
    return (
      <div>
        <h3>Step5</h3>
        <Row>
          <Col span={20}>
            <h4>Details</h4>
          </Col>
          <Col span={4}>
            {' '}
            <div className="addProduct" onClick={this.showAddMainProduct} style={{ marginTop: '10px', marginRight: '0px' }}>
              <span> + Add product</span>
            </div>
          </Col>
        </Row>
        <div className="details">
          {subscriptionPlan.mainProducts &&
            subscriptionPlan.mainProducts.map((item) => (
              <div className="ant-table-wrapper">
                <div className="ant-table ant-table-large ant-table-scroll-position-left">
                  <div className="ant-table-content">
                    <div className="ant-table-body">
                      <table>
                        <thead className="ant-table-thead">
                          <tr>
                            <th style={{ width: '10%' }}>Package ID</th>
                            <th style={{ width: '10%' }}>Image</th>
                            <th style={{ width: '20%' }}>Product Name</th>
                            <th style={{ width: '10%' }}>Qty</th>
                            <th style={{ width: '10%' }}>Market Price</th>
                            <th style={{ width: '10%' }}>Setting Price</th>
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
                                  //height: 100
                                }}
                                placement="bottomLeft"
                                title={<div>{item.goodsInfoName}</div>}
                              >
                                <p className="overflow">{item.goodsInfoName}</p>
                              </Tooltip>
                            </td>
                            <td>{item.qty}</td>
                            <td>{item.marketPrice}</td>
                            <td>{item.settingPrice}</td>
                            <td>
                              <Popconfirm placement="topLeft" title="Are you sure to delete this product?" onConfirm={() => this.deleteProduct(item.goodsInfoId)} okText="Confirm" cancelText="Cancel">
                                <Tooltip placement="top" title="Delete">
                                  <a className="iconfont iconDelete"></a>
                                </Tooltip>
                              </Popconfirm>
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
        <AddProduct visible={visible} isMultiple={true} updateTable={this.updateTable} selectedRowKeys={subscriptionPlan.mainProductIds} />
      </div>
    );
  }
}
