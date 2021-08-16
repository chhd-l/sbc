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
        rowKey={(record) => record.goodsInfoNo}
        pagination={{
          pageSize,
          total,
          fitColumns: true,
          current: current,
          onChange: (pageNum, pageSize) => {
            init(pageNum - 1, pageSize, stock);
          }
        }}
        dataSource={dataList && dataList}
      >
        <Column title={<FormattedMessage id="Product.image" />} dataIndex="goodsInfoImg" key="goodsInfoImg" render={(img) => (img ? <img src={img} style={styles.imgItem} /> : <img src={defaultImg} style={styles.imgItem} />)} />
        <Column
          // title="商品名称"
          title={<FormattedMessage id="Product.productName" />}
          dataIndex="goodsInfoName"
          key="goodsInfoName"
          className="goodsInfoName"
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
        <Column title={<FormattedMessage id="Product.SKU" />} dataIndex="goodsInfoNo" key="goodsInfoNo" />
        <Column title={<FormattedMessage id="Product.SPU" />} dataIndex="goods.goodsNo" key="goods.goodsNo" />

        <Column
          title={
            <span>
              <FormattedMessage id="Product.marketPrice" />
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
          title={<FormattedMessage id="Product.ProductCategory" />}
          dataIndex="goods.cateName"
          key="goods.cateName"
          width={150}
        />
        <Column
          // title="店铺分类"
          title={<FormattedMessage id="Product.Salescategory" />}
          dataIndex="goods.storeCateNames"
          key="goods.storeCateNames"
          render={(rowInfo) => {
            return rowInfo && rowInfo.join(' , ');
          }}
        />
        <Column
          // title="品牌"
          title={<FormattedMessage id="Product.brand" />}
          dataIndex="goods.brandName"
          key="goods.brandName"
        />
        <Column
          title={<FormattedMessage id="Product.onOrOffShelves" />}
          dataIndex="addedFlag"
          key="addedFlag"
          render={(rowInfo) => {
            if (rowInfo == 0) {
              return <FormattedMessage id="Product.offShelves" />;
            }
            if (rowInfo == 2) {
              return <FormattedMessage id="Product.partialOnShelves" />;
            }
            return <FormattedMessage id="Product.onShelves" />;
          }}
        />
        <Column title={<FormattedMessage id="Product.Inventory" />} dataIndex="stock" key="stock" />
        <Column align="center" key="goods.storeId" title="" width={0} />
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
    float: 'left',
    marginRight: 10,
    background: '#fff',
    borderRadius: 3
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
