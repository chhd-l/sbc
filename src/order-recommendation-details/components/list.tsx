import * as React from 'react';
import { fromJS, List } from 'immutable';
import { DataGrid, cache, noop, Const, history, RCi18n } from 'qmkit';
import { Table } from 'antd';
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

  render() {
    const { productselect, detailProductList } = this.props.relaxProps;
    return (
      <TableRow>
        <DataGrid scroll={{ y: 500 }} size="small" rowKey={(record, index) => index} dataSource={productselect instanceof Array ? productselect : []} pagination={false}>
          {/*<Column title="No" dataIndex="No" key="No" render={(text,record,index) => {
            return <span>{(pageNum)*10+index+1}</span>
          }}/>
          <Column title="Image" dataIndex="Image" key="Image" render={(text) => {
            return <img src={text} alt="" width="20" height="25"/>
          }}/>*/}

          <Column title={RCi18n({id:'Order.Product Name'})} dataIndex="goodsInfoName" key="goodsInfoName" />
          <Column title={RCi18n({id:'Order.SPU'})} dataIndex="goodsNo" key="goodsNo" />
          <Column title={RCi18n({id:'Order.SKU'})} dataIndex="goodsInfoNo" key="goodsInfoNo" />
          <Column title={RCi18n({id:'Order.Product category'})} dataIndex="goodsCateName" key="goodsCateName" />
          <Column title={RCi18n({id:'Order.Sales category'})} dataIndex="storeCateName" key="storeCateName" />
          <Column
            title={RCi18n({id:'Order.Price'})} 
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
          <Column title={RCi18n({id:'Order.Quantity'})}  key="recommendationNumber" dataIndex="recommendationNumber" />
        </DataGrid>
      </TableRow>
    );
  }
}
