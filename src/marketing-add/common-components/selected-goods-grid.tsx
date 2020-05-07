import * as React from 'react';
import { fromJS } from 'immutable';

import { DataGrid } from 'qmkit';

const { Column } = DataGrid;

import styled from 'styled-components';
const TableRow = styled.div`
  margin-top: 20px;
  .red {
    background-color: #eee;
  }
`;

/**
 * 商品添加
 */
export default class SelectedGoodsGrid extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      skuExists: props.skuExists
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ skuExists: nextProps.skuExists });
  }

  render() {
    const { selectedRows, deleteSelectedSku } = this.props;
    const { skuExists } = this.state;

    return (
      <TableRow>
        <DataGrid
          scroll={{ y: 500 }}
          size="small"
          rowKey={record => record.goodsInfoId}
          dataSource={selectedRows ? selectedRows.toJS() : []}
          pagination={false}
          rowClassName={record => {
            if (fromJS(skuExists).includes(record.goodsInfoId)) {
              return 'red';
            } else {
              return '';
            }
          }}
        >
          <Column
            title="SKU编码"
            dataIndex="goodsInfoNo"
            key="goodsInfoNo"
            width="15%"
          />

          <Column
            title="商品名称"
            dataIndex="goodsInfoName"
            key="goodsInfoName"
            width="20%"
          />

          <Column
            title="规格"
            dataIndex="specText"
            key="specText"
            width="20%"
            render={value => {
              if (value) {
                return value;
              } else {
                return '-';
              }
            }}
          />

          <Column
            title="分类"
            key="cateName"
            dataIndex="cateName"
            width="10%"
          />

          <Column
            title="品牌"
            key="brandName"
            dataIndex="brandName"
            width="10%"
            render={value => {
              if (value) {
                return value;
              } else {
                return '-';
              }
            }}
          />

          <Column
            title="单价"
            key="marketPrice"
            dataIndex="marketPrice"
            width="10%"
            render={data => {
              return `¥${data}`;
            }}
          />

          <Column
            title="操作"
            key="operate"
            width="10%"
            render={row => {
              return (
                <a onClick={() => deleteSelectedSku(row.goodsInfoId)}>删除</a>
              );
            }}
          />
        </DataGrid>
      </TableRow>
    );
  }
}
