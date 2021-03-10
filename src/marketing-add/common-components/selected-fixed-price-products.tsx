import * as React from 'react';
import { fromJS } from 'immutable';

import { DataGrid, cache, ValidConst } from 'qmkit';
import { InputNumber, Table, Form } from 'antd';

const Column = Table.Column;
const FormItem = Form.Item;
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
export default class SelectedFixedPriceProducts extends React.Component<any, any> {
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
    const { selectedRows, deleteSelectedSku } = this.props;
    const { skuExists } = this.state;
    const { getFieldDecorator } = this.props.form;
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
          <Column title="SKU code" dataIndex="goodsInfoNo" key="goodsInfoNo" width="15%" />

          <Column title="Product Name" dataIndex="goodsInfoName" key="goodsInfoName" width="20%" />

          <Column
            title="Specification"
            dataIndex="specText"
            key="specText"
            width="20%"
            render={(value) => {
              if (value) {
                return value;
              } else {
                return '-';
              }
            }}
          />

          <Column title="Category" key="cateName" dataIndex="cateName" width="10%" />

          <Column
            title="Brand"
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
            title="Price"
            key="marketPrice"
            dataIndex="marketPrice"
            width="10%"
            render={(data) => {
              return `${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + data}`;
            }}
          />

          <Column
            title="Quantity"
            className="quantity"
            key="quantity"
            width="20%"
            render={(row, record) => {
              console.log(row, 'row----------');
              console.log(record, 'record----------');
              return (
                <FormItem>
                  {getFieldDecorator(`${row.goodsInfoId}goods_detail`, {
                    initialValue: 0,
                    rules: [
                      { required: true, message: '1-5' },
                      {
                        pattern: ValidConst.noZeroNumber,
                        message: '1-5'
                      },
                      {
                        validator: (_rule, value, callback) => {
                          if (value && ValidConst.noZeroNumber.test(value) && (value > 5 || value < 0)) {
                            callback('1-5');
                          }
                          callback();
                        }
                      }
                    ]
                  })(<InputNumber min={0} onChange={(val) => this.props.selectedProductQuantityOnChange(val, record)} />)}
                </FormItem>
              );
            }}
          />
          <Column
            title="Operation"
            key="operate"
            width="10%"
            render={(row) => {
              return <a onClick={() => deleteSelectedSku(row.goodsInfoId)}>Delete</a>;
            }}
          />
        </DataGrid>
      </TableRow>
    );
  }
}
