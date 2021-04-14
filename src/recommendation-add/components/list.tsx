import * as React from 'react';
import { fromJS, List } from 'immutable';
import { DataGrid, cache, noop, Const, history } from 'qmkit';
import { InputNumber, Popconfirm, Table, Tooltip } from 'antd';
const Column = Table.Column;
import styled from 'styled-components';
import { Relax } from 'plume2';
declare type IList = List<any>;

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
      onProductselect: Function
    };
  };

  static relaxProps = {
    productselect: 'productselect',
    onProductselect: noop
  };
  componentDidMount() {


  }
  //改变数量
  inputNumberChange = (value, row, index) => {
    if(!value)return;
    const { productselect, onProductselect } = this.props.relaxProps;
    let _clone = JSON.parse(JSON.stringify(productselect))
    let goodsInfoWeight:any=0,goodsInfoUnit=( row?.goodsInfoUnit??'').toLowerCase();
    if(goodsInfoUnit==='g'){
       goodsInfoWeight= value * (row.goodsInfoWeight/row.quantity)
    }else if(goodsInfoUnit==='kg'){
       let d:any=(value * (row.goodsInfoWeight/row.quantity))/1000
       goodsInfoWeight=parseInt(d)
    }
    
    row.goodsInfoWeight=goodsInfoWeight;
    row.quantity=value;
    
    _clone[index] = row
    onProductselect(_clone)
  }
  //删除
  deleteCartsGood = (index) => {
    const { productselect, onProductselect } = this.props.relaxProps;
    let _clone = JSON.parse(JSON.stringify(productselect))
    _clone.splice(index, 1)
    onProductselect(_clone)
  }
  render() {
    const { productselect } = this.props.relaxProps;
    return (
      <TableRow>
        <DataGrid scroll={{ y: 500 }} size="small" rowKey="goodsInfoNo" dataSource={productselect instanceof Array ? productselect : []} pagination={false}>

          <Column title="Product Name" dataIndex="goodsInfoName" key="goodsInfoName" />
          <Column title="SPU" dataIndex="goods.goodsNo" key="goods.goodsNo" />
          <Column title="SKU" dataIndex="goodsInfoNo" key="goodsInfoNo" />
          <Column title="Product category" dataIndex="goods.cateName" key="goods.cateName" />
          <Column title="Sales category" dataIndex="goods.brandName" key="goods.brandName" />
          <Column
            title="Price"
            dataIndex="marketPrice"
            render={(value) => {
              if (value) {
                return sessionStorage.getItem('s2b-supplier@systemGetConfig:') + value;
              } else {
                return '';
              }
            }}
            key="marketPrice"
          />
          <Column title='Weight (g)' dataIndex="goodsInfoWeight" key="goodsInfoWeight" 
          />
          <Column title="Quantity" key="quantity" dataIndex="quantity"
            render={(value, row, index) => {
              return (<InputNumber
                min={1}
                max={9999}
                defaultValue={value || 0}
                onChange={(e) => {
                  this.inputNumberChange(e, row, index);
                }}
              />)
            }}

          />
          <Column
            title="Operation"
            dataIndex="Operation"
            key="Operation"
            render={(text, record, index) => {
              return (
                <Popconfirm placement="topLeft" title="Are you sure you want to delete this product?" onConfirm={() => this.deleteCartsGood(index)} okText="Confirm" cancelText="Cancel">
                  <Tooltip placement="top" title="Delete">
                    <a>
                      <span style={{ color: 'red', paddingRight: 10, cursor: 'pointer', fontSize: 16 }} className="icon iconfont iconDelete"></span>
                    </a>
                  </Tooltip>
                </Popconfirm>
              );
            }}
          />
        </DataGrid>
      </TableRow>
    );
  }
}
