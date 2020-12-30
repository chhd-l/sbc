import * as React from 'react';
import { fromJS, List } from 'immutable';
import { DataGrid, cache, noop, Const, history } from 'qmkit';
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
  //   debugger
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
          <Column title="Product Name" dataIndex="goodsInfoName" key="goodsInfoName" />
          <Column title="SPU" dataIndex="goodsNo" key="goodsNo" />
          <Column title="SKU" dataIndex="goodsInfoNo" key="goodsInfoNo" />
          <Column title="Product category" dataIndex="goodsCateName" key="goodsCateName" />
          <Column title="Sales category" dataIndex="storeCateName" key="storeCateName" />
          <Column title="Price" dataIndex="marketPrice" key="marketPrice" />

          <Column
            title="Quantity"
            key="recommendationNumber"
            dataIndex="recommendationNumber"
            render={(text, row) => {
              return (
                <Select
                  defaultValue={text ? text : 1}
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
            title="Operation"
            key="Operation"
            render={(text, row) => (
              <Popconfirm placement="topLeft" title="Are you sure to delete this item?" onConfirm={() => this.deleteProduct(row)} okText="Confirm" cancelText="Cancel">
                <Tooltip placement="top" title="Delete">
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
