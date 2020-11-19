import * as React from 'react';
import { Relax } from 'plume2';
import { DataGrid, noop, Const, cache } from 'qmkit';
import { List } from 'immutable';
import { Modal, Tooltip } from 'antd';

import { Table } from 'antd';

const Column = Table.Column;
const confirm = Modal.confirm;
const defaultImg = require('../img/none.png');
import { FormattedMessage } from 'react-intl';
type TList = List<any>;

@Relax
export default class CateList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      total: number;
      pageSize: number;
      dataList: any;
      init: Function;
      current: number;
      stock: any;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    dataList: 'dataList',
    init: noop,
    current: 'current',
    stock: 'stock'
  };

  render() {
    const { loading, total, pageSize, dataList, init, current, stock } = this.props.relaxProps;
    return (
      <DataGrid
        loading={loading}
        rowKey={(record) => record.goodsId}
        pagination={{
          pageSize,
          total,
          fitColumns: true,
          current: current,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize, stock: stock });
          }
        }}
        dataSource={dataList}
      >
        <Column title={<FormattedMessage id="product.image" />} dataIndex="goodsImg" key="goodsImg" render={(img) => (img ? <img src={img} style={styles.imgItem} /> : <img src={defaultImg} style={styles.imgItem} />)} />
        <Column
          // title="商品名称"
          title={<FormattedMessage id="product.productName" />}
          dataIndex="goodsName"
          key="goodsName"
          className="nameBox"
          render={(rowInfo) => {
            return (
              <Tooltip
                overlayStyle={{
                  overflowY: 'auto'
                  //height: 100
                }}
                placement="bottomLeft"
                title={<div>{rowInfo}</div>}
              >
                <p style={styles.text}>{rowInfo}</p>
              </Tooltip>
            );
          }}
        />
        <Column title="SKU" dataIndex="SKU" key="SKU" />
        <Column title={<FormattedMessage id="product.SPU" />} dataIndex="goodsNo" key="goodsNo" />

        <Column
          title={
            <span>
              <FormattedMessage id="product.marketPrice" />
              <br />
              <FormattedMessage id="priceSettingMethod" />
            </span>
          }
          key="marketPrice"
          render={(rowInfo) => {
            const { marketPrice, priceType } = rowInfo;
            return (
              <div>
                <p style={styles.lineThrough}>
                  {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                  {marketPrice == null ? 0.0 : marketPrice.toFixed(2)}
                </p>
                <p style={{ color: '#999' }}>{Const.priceType[priceType]}</p>
              </div>
            );
          }}
        />
        <Column
          // title="店铺分类"
          title="Product category"
          dataIndex="Sale"
          key="Sale"
        />
        <Column
          // title="店铺分类"
          title="Product category"
          dataIndex="storeCateIds"
          key="storeCateIds"
        />
        <Column
          // title="品牌"
          title={<FormattedMessage id="product.brand" />}
          dataIndex="brandId"
          key="brandId"
        />
        <Column
          title={<FormattedMessage id="product.onOrOffShelves" />}
          dataIndex="addedFlag"
          key="addedFlag"
          render={(rowInfo) => {
            if (rowInfo == 0) {
              return <FormattedMessage id="product.offShelves" />;
            }
            if (rowInfo == 2) {
              return <FormattedMessage id="product.partialOnShelves" />;
            }
            return <FormattedMessage id="product.onShelves" />;
          }}
        />
        <Column title="Inventory" dataIndex="Inventory" key="Inventory" />
        <Column align="center" title="" width={0} />
      </DataGrid>
    );
  }
}

const styles = {
  item: {
    float: 'left',
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
    margin: '10px 0',
    height: 124
  },
  text: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  cell: {
    color: '#999',
    width: 180,
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  } as any,
  label: {
    color: '#999',
    width: 80,
    textAlign: 'right',
    display: 'inline-block'
  } as any,
  imgItem: {
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    background: '#fff'
  },
  textCon: {
    width: 100,
    maxHeight: 62,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    webkitBoxOrient: 'vertical'
  } as any
} as any;
