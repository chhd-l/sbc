import React from 'react';
import { Relax } from 'plume2';
import { Table } from 'antd';
import { IMap } from 'typings/globalType';
import { noop } from 'qmkit';

import './goods-list-style.css';
import Amount from './amount';

@Relax
export default class GoodsList extends React.Component<any, any> {
  props: {
    flushState?: any;
    form?: any;
    relaxProps?: {
      returnDetail: IMap;
      editGoodsNum: Function;
    };
  };

  static relaxProps = {
    // 订单详情
    returnDetail: 'returnDetail',
    // 修改数量
    editGoodsNum: noop
  };

  render() {
    const dataSource = this._getDataSource(); // 订单商品
    const columns = this._getColumns(0);

    const giftDataSource = this._getGiftDataSource(); // 订单赠品
    const giftColumns = this._getColumns(1);
    return (
      <div>
        <h3 style={styles.title}>Select return products</h3>
        <Table
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          rowKey="skuId"
        />

        {giftDataSource && giftDataSource.length > 0 && (
          <Table
            showHeader={false}
            bordered
            dataSource={giftDataSource}
            columns={giftColumns}
            pagination={false}
            rowKey="skuId"
          />
        )}

        {/*小计*/}
        <Amount form={this.props.form} flushState={this.props.flushState} />
      </div>
    );
  }

  _getDataSource = () => {
    const { returnDetail } = this.props.relaxProps;
    return returnDetail.get('returnItems').toJS();
  };

  /**
   * 获取赠品数据源
   */
  _getGiftDataSource = () => {
    const { returnDetail } = this.props.relaxProps;
    if (returnDetail.get('returnGifts')) {
      return returnDetail.get('returnGifts').toJS();
    }
    return null;
  };

  /**
   * 商品与赠品公用(通过itemType区分展示个性内容)
   * itemType=0表示商品 , itemType=1表示赠品
   */
  _getColumns = (itemType) => {
    return [
      {
        title: 'SKU code',
        dataIndex: 'skuNo',
        key: 'skuNo',
        width: 150
      },
      {
        title: 'Product name',
        dataIndex: 'skuName',
        key: 'skuName',
        width: 150,
        render: (text) => `${itemType == 1 ? (window as any).RCi18n({ id: 'Order.Giveaway' }) : ''}${text}`
      },
      {
        title: 'Specification',
        dataIndex: 'specDetails',
        key: 'specDetails',
        width: 150
      },
      {
        title: 'Return unit price',
        key: 'price',
        width: 100,
        render: (rowInfo) => <div>${rowInfo.price.toFixed(2)}</div>
      },
      {
        title: 'Return quantity',
        key: 'num',
        width: 100,
        className: 'centerItem',
        render: (_text, rowInfo: any) => {
          return (
            <div style={{ display: 'inline-block', width: '90px' }}>
              {rowInfo.num || 0}
            </div>
          );
          
        }
      },
      {
        title: 'Subtotal of return amount',
        key: 'total',
        width: 100,
        render: (rowInfo) => (
          <div>
            ${rowInfo.splitPrice ? rowInfo.splitPrice.toFixed(2) : '0.00'}
          </div>
        )
      }
    ];
  };

  /**
   * 修改数量
   */
  _editGoodsNum = (skuId: string, returnNum) => {
    const { editGoodsNum } = this.props.relaxProps;

    editGoodsNum(skuId, returnNum || 0);
  };
}

const styles = {
  priceContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    border: '1px solid #eeeeee',
    marginTop: -4,
    borderTop: 0
  } as any,

  applyPrice: {
    display: 'flex',
    flexDirection: 'column'
  } as any,
  priceBox: {
    display: 'flex',
    flexDirection: 'column'
  } as any,
  name: {
    width: 120,
    textAlign: 'right',
    display: 'inline-block'
  },
  priceItem: {
    width: 200,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5
  } as any
};
