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
      productForm: any;
      detailProductList: any;
      onCreateLink: Function;
    };
  };

  static relaxProps = {
    productselect: 'productselect',
    productForm: 'productForm',
    detailProductList: 'detailProductList',
    onCreateLink: noop
  };

  componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
    const { productselect, onCreateLink } = this.props.relaxProps;
    let arr = productselect.map((v, i) => {
      return {
        goodsInfoId: v.goodsInfoId,
        recommendationNumber: v.recommendationNumber
      };
    });
    onCreateLink({
      field: 'recommendationGoodsInfoRels',
      value: arr
    });
  }
  //改变数量
  inputNumberChange=(value,row,index)=>{

  }
  //删除
  deleteCartsGood=()=>{

  }
  render() {
    const { productselect, detailProductList } = this.props.relaxProps;
    return (
      <TableRow>
        <DataGrid scroll={{ y: 500 }} size="small" rowKey={(record, index) => index} dataSource={productselect instanceof Array ? productselect : []} pagination={false}>
         

          <Column title="Product Name" dataIndex="goodsInfoName" key="goodsInfoName" />
          <Column title="SPU" dataIndex="goodsNo" key="goodsNo" />
          <Column title="SKU" dataIndex="goodsInfoNo" key="goodsInfoNo" />
          <Column title="Product category" dataIndex="goodsCateName" key="goodsCateName" />
          <Column title="Sales category" dataIndex="storeCateName" key="storeCateName" />
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
           <Column title="Weight" dataIndex="Weight" key="Weight" />
          <Column title="Quantity" key="recommendationNumber" dataIndex="recommendationNumber" 
          render={(value,row,index)=>{
            return ( <InputNumber
              min={0}
              max={10}
              defaultValue={value}
              onChange={(e) => {
                this.inputNumberChange(e, row,index);
              }}
            />)
          }}
          
          />
          <Column 
          title="Operation"
           dataIndex="Operation"
            key="Operation"
            render={(text, record) => {
            return (
              <Popconfirm placement="topLeft" title="Are you sure you want to delete this product?" onConfirm={() => this.deleteCartsGood(record)} okText="Confirm" cancelText="Cancel">
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
