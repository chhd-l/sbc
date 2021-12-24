import * as React from 'react';
import { fromJS, List } from 'immutable';
import { DataGrid, cache, noop, Const, history, RCi18n } from 'qmkit';
import { Popconfirm, Select, Table, Tooltip } from 'antd';
const Column = Table.Column;
import styled from 'styled-components';
import { Relax } from 'plume2';
declare type IList = List<any>;
const { Option } = Select;

import moment from 'moment';
const TableRow = styled.div`
  .ant-table-small > .ant-table-content > .ant-table-scroll > .ant-table-body > table > .ant-table-tbody > tr > td {
    padding: 8px 8px;
  }
  .ant-table-thead > tr:first-child > th:last-child {
    text-align: left;
  }
`;

/**
 * 商品添加
 */
@Relax
export default class SelectedGoodsGrid extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  props: {
    relaxProps?: {
      productselect: any;
      productForm: any;
      detailProductList: any;
      onCreateLink: Function;
      onProductselect: Function;
    };
  };

  static relaxProps = {
    productselect: 'productselect',
    productForm: 'productForm',
    detailProductList: 'detailProductList',
    onCreateLink: noop,
    onProductselect: noop
  };

  // componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
  //   localStorage.removeItem('productselect');
  //   const { productselect, onCreateLink } = this.props.relaxProps;
  //   localStorage.setItem('productselect', String(productselect.length));
  //   let arr = productselect.map((v, i) => {
  //     return {
  //       goodsInfoId: v.goodsInfoId,
  //       recommendationNumber: v.recommendationNumber?v.recommendationNumber:1
  //     };
  //   });
  //   onCreateLink({
  //     field: 'recommendationGoodsInfoRels',
  //     value: arr
  //   });
  //   localStorage.setItem('productselect', String(productselect.length));
  // }

  forceUpdate(callback?: () => void) {
    super.forceUpdate(callback);
  }
  onQuantityChange = (row, value) => {
    const { productselect, onProductselect } = this.props.relaxProps;
    let obj = productselect;
    for (let o = 0; o < obj.length; o++) {
      if (obj[o].goodsInfoId === row['goodsInfoId']) {
        obj[o].recommendationNumber = Number(value);
      }
    }
    onProductselect(obj);
  };
  deleteProduct = (row) => {
    const { productselect, onProductselect } = this.props.relaxProps;
    let obj = productselect.filter((item) => item.goodsInfoId !== row.goodsInfoId);
    onProductselect(obj);
  };

  render() {
    const { productselect } = this.props.relaxProps;
    //const pageNum = productForm && productForm.pageNum;
    return (
      <TableRow>
        <DataGrid scroll={{ y: 500 }} size="small" rowKey={(record, index) => index} dataSource={productselect instanceof Array ? productselect : []} pagination={false}>
          <Column title={RCi18n({id:'Order.Product Name'})} dataIndex="goodsInfoName" key="goodsInfoName" />
          <Column title={RCi18n({id:'Order.SPU'})} dataIndex="goodsNo" key="goodsNo" />
          <Column title={RCi18n({id:'Order.SKU'})} dataIndex="goodsInfoNo" key="goodsInfoNo" />
          <Column title={RCi18n({id:'Order.Product category'})}  dataIndex="goodsCateName" key="goodsCateName" />
          <Column title={RCi18n({id:'Order.Sales category'})}  dataIndex="storeCateName" key="storeCateName" />
          <Column
            title={RCi18n({id:'Order.Price'})}
            dataIndex="marketPrice"
            key="marketPrice"
            render={(value) => {
              if (value) {
                return sessionStorage.getItem('s2b-supplier@systemGetConfig:') + value;
              } else {
                return '';
              }
            }}
          />
          <Column
            title={RCi18n({id:'Order.Weight'})}
            dataIndex="goodsInfoWeight"
            key="goodsInfoWeight"
            render={(goodsInfoWeight) => {
              return goodsInfoWeight ? goodsInfoWeight : '--';
            }}
          />

          <Column
            title={RCi18n({id:'Order.Quantity'})}
            key="recommendationNumber"
            dataIndex="recommendationNumber"
            render={(text, row) => {
              return (
                <Select
                  value={text ? text : 1}
                  style={{ width: 120 }}
                  onChange={(e) => {
                    const value = e;
                    this.onQuantityChange(row, value);
                  }}
                >
                  <Option value={1}>1</Option>
                  <Option value={2}>2</Option>
                  <Option value={3}>3</Option>
                  <Option value={4}>4</Option>
                  <Option value={5}>5</Option>
                  <Option value={6}>6</Option>
                  <Option value={7}>7</Option>
                  <Option value={8}>8</Option>
                  <Option value={9}>9</Option>
                  <Option value={10}>10</Option>
                </Select>
              );
            }}
          />
          <Column
            title={RCi18n({id:'Order.Operation'})}
            key="Operation"
            render={(text, row) => (
              <Popconfirm placement="topLeft" title={RCi18n({id:'Order.DeleteTip'})} onConfirm={() => this.deleteProduct(row)} okText={RCi18n({id:'Order.btnConfirm'})} cancelText={RCi18n({id:'Order.btnCancel'})}>
                <Tooltip placement="top" title={RCi18n({id:'Order.Delete'})}>
                  <a className="iconfont iconDelete" style={{ marginRight: 10 }}></a>
                </Tooltip>
              </Popconfirm>
            )}
          />
        </DataGrid>
      </TableRow>
    );
  }
}
