import * as React from 'react';
import { fromJS } from 'immutable';

import { DataGrid, cache } from 'qmkit';
import { Table, InputNumber } from 'antd';
import { FormattedMessage } from 'react-intl';

const Column = Table.Column;

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

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ skuExists: nextProps.skuExists });
  }

  render() {
    const { selectedRows, deleteSelectedSku, customProductsType, changeNumber } = this.props;
    const { skuExists } = this.state;
    return (
      <TableRow>
        <DataGrid
          scroll={{ y: 500 }}
          size="small"
          rowKey={(record) => record.goodsInfoId}
          dataSource={selectedRows ? selectedRows.toJS() : []}
          pagination={false}
          rowClassName={(record) => {
            if (fromJS(skuExists).includes(record.goodsInfoId)) {
              return 'red';
            } else {
              return '';
            }
          }}
        >
          <Column
            title={<FormattedMessage id="Marketing.SKUCode"/>}
            dataIndex="goodsInfoNo"
            key="goodsInfoNo"
            width="15%"
          />

          <Column
            title={<FormattedMessage id="Marketing.ProductName"/>}
            dataIndex="goodsInfoName"
            key="goodsInfoName"
          />

          <Column
            title={<FormattedMessage id="Marketing.Specification"/>}
            dataIndex="specText"
            key="specText"
            render={(value) => {
              if (value) {
                return value;
              } else {
                return '-';
              }
            }}
          />

          <Column
            title={<FormattedMessage id="Marketing.Category"/>}
            key="cateName"
            dataIndex="cateName"
            width="10%"
          />

          <Column
            title={<FormattedMessage id="Marketing.Brand"/>}
            key="brandName"
            dataIndex="brandName"
            width="10%"
            render={(value) => {
              if (value) {
                return value;
              } else {
                return '-';
              }
            }}
          />

          <Column
            title={<FormattedMessage id="Marketing.Price"/>}
            key="marketPrice"
            dataIndex="marketPrice"
            width="10%"
            render={(data) => {
              return `${
                sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + data
              }`;
            }}
          />

          {/* {customProductsType === 0 && <Column
            title={<FormattedMessage id="Marketing.Inventory"/>}
            key="stock"
            dataIndex="stock"
            width="10%"
          />} */}

          {/* {customProductsType === 0 && <Column
            title={<FormattedMessage id="Marketing.GiveTheNumber"/>}
            key="productNumber"
            dataIndex="productNumber"
            width="15%"
            render={(data, record: any) => (
              <InputNumber defaultValue={1} value={data} min={1} step={1} onChange={(val) => changeNumber(record.goodsInfoId, val)} />
            )}
          />} */}

          <Column
            title={<FormattedMessage id="Marketing.Operation"/>}
            key="operate"
            width="10%"
            render={(row) => {
              return (
                <a onClick={() => deleteSelectedSku(row.goodsInfoId)}><FormattedMessage id="Marketing.Delete"/></a>
              );
            }}
          />
        </DataGrid>
      </TableRow>
    );
  }
}
