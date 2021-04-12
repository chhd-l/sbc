import * as React from 'react';
import { cache, DataGrid } from 'qmkit';
import { Table } from 'antd';

const Column = Table.Column;

import styled from 'styled-components';
import { Relax } from 'plume2';
import { IList } from '../../../typings/globalType';
import noop from '../../../web_modules/qmkit/noop';
import { Button } from 'antd';
import { FormattedMessage } from 'react-intl';
const TableRow = styled.div`
  margin-top: 20px;
  .red {
    background-color: #eee;
  }
`;

/**
 * 商品添加
 */
@Relax
export default class SelectedGoodsGrid extends React.Component<any, any> {
  props: {
    relaxProps?: {
      goodsRows: IList;
      deleteSelectedSku: Function;
      fieldsValue: Function;
    };
  };

  static relaxProps = {
    goodsRows: 'goodsRows',
    deleteSelectedSku: noop,
    fieldsValue: noop
  };

  render() {
    const { goodsRows, deleteSelectedSku } = this.props.relaxProps;

    return (
      <div>
        <Button type="primary" icon="plus" onClick={() => this.onAdd()}>
          <FormattedMessage id="Marketing.AddProduct" />
        </Button>
        &nbsp;&nbsp;
        <TableRow>
          <DataGrid scroll={{ y: 500 }} size="small" rowKey={(record) => record.goodsInfoId} dataSource={goodsRows ? goodsRows.toJS() : []} pagination={false}>
            <Column title={<FormattedMessage id="Marketing.SKUCode" />} dataIndex="goodsInfoNo" key="goodsInfoNo" width="15%" />

            <Column title={<FormattedMessage id="Marketing.ProductName" />} dataIndex="goodsInfoName" key="goodsInfoName" width="20%" />

            <Column
              title={<FormattedMessage id="Marketing.Specifications" />}
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

            <Column title={<FormattedMessage id="Marketing.Classification" />} key="cateName" dataIndex="cateName" width="10%" />

            <Column
              title={<FormattedMessage id="Marketing.Brand" />}
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
              title={<FormattedMessage id="Marketing.Price" />}
              key="marketPrice"
              dataIndex="marketPrice"
              width="10%"
              render={(data) => {
                return `${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}${data}`;
              }}
            />

            <Column
              title={<FormattedMessage id="Marketing.Operation" />}
              key="operate"
              width="10%"
              render={(row) => {
                return <a onClick={() => deleteSelectedSku(row.goodsInfoId)}><FormattedMessage id="Marketing.Delete" /></a>;
              }}
            />
          </DataGrid>
        </TableRow>
      </div>
    );
  }

  onAdd() {
    const { fieldsValue } = this.props.relaxProps;
    fieldsValue({ field: 'goodsModalVisible', value: true });
  }
}
