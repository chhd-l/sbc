import * as React from 'react';
import { fromJS, List } from 'immutable';
import { DataGrid, cache, noop, Const, history } from 'qmkit';
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
    localStorage.removeItem('productselect');
    const { productselect, onCreateLink } = this.props.relaxProps;
    localStorage.setItem('productselect', String(productselect.length));
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
    localStorage.setItem('productselect', String(productselect.length));
  }

  forceUpdate(callback?: () => void) {
    super.forceUpdate(callback);
  }

  render() {
    const { productselect, detailProductList } = this.props.relaxProps;
    //const pageNum = productForm && productForm.pageNum;
    return (
      <TableRow>
        <DataGrid scroll={{ y: 500 }} size="small" rowKey={(record, index) => index} dataSource={productselect instanceof Array ? productselect : []} pagination={false}>
          {/*<Column title="No" dataIndex="No" key="No" render={(text,record,index) => {
            return <span>{(pageNum)*10+index+1}</span>
          }}/>
          <Column title="Image" dataIndex="Image" key="Image" render={(text) => {
            return <img src={text} alt="" width="20" height="25"/>
          }}/>*/}
          <Column title="Product Name" dataIndex="goodsInfoName" key="goodsInfoName" />
          <Column title="SKU" dataIndex="goodsInfoNo" key="goodsInfoNo" />
          <Column
            title="Signed classification"
            dataIndex="goods.goodsCateName"
            key="goodsCateName"
            render={(text, record, i) => {
              /*setTimeout(() => {
                console.log(text, 11111111);
                console.log(
                  detailProductList.recommendationGoodsInfoRels,
                  22222222
                );
                console.log(i, 33333333);
              });*/
              return text;
              //return history.location.state?detailProductList.recommendationGoodsInfoRels[i].recommendationNumber:text
            }}
          />
          <Column title="Price" dataIndex="marketPrice" key="marketPrice" />
          <Column
            title="Quantity"
            key="quantity"
            dataIndex="quantity"
            render={(text, record, i) => {
              /*return history.location.state
                ? detailProductList.recommendationGoodsInfoRels[i]
                    .recommendationNumber
                : text;*/
              return record.recommendationNumber;
            }}
          />
        </DataGrid>
      </TableRow>
    );
  }
}
