import React from 'react';
import { Relax } from 'plume2';
import { Table, InputNumber, Form } from 'antd';
import { IMap } from 'typings/globalType';
import { noop, ValidConst, QMFloat, cache } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import Amount from './amount';
import './goods-list-style.css';

const FormItem = Form.Item;

@Relax
export default class GoodsList extends React.Component<any, any> {
  props: {
    flushState?: any;
    form?: any;
    relaxProps?: {
      tradeDetail: IMap;
      editGoodsNum: Function;
    };
  };

  static relaxProps = {
    // 订单详情
    tradeDetail: 'tradeDetail',
    // 修改数量
    editGoodsNum: noop
  };

  render() {
    const dataSource = this._getDataSource(); // 订单商品
    const columns = this._getColumns(0);

    const giftDataSource = this._getGiftDataSource(); // 订单赠品
    const giftColumns = this._getColumns(1);

    const subGiftDataSource = this._getSubGiftDataSource(); // 订阅订单赠品
    const subGiftColumns = this._getColumns(2);

    return (
      <div>
        <h3 style={styles.title}>
          <FormattedMessage id="Order.Selectreturnproducts" />
        </h3>
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

        {subGiftDataSource && subGiftDataSource.length > 0 && (
          <Table
            showHeader={false}
            bordered
            dataSource={subGiftDataSource}
            columns={subGiftColumns}
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
    const { tradeDetail } = this.props.relaxProps;
    return tradeDetail.get('tradeItems').toJS();
  };

  /**
   * 获取赠品数据源
   */
  _getGiftDataSource = () => {
    const { tradeDetail } = this.props.relaxProps;
    if (tradeDetail.get('gifts')) {
      return tradeDetail.get('gifts').toJS();
    }
    return null;
  };

  /**
   * 获取订阅订单赠品数据源
   */
  _getSubGiftDataSource = () => {
    const { tradeDetail } = this.props.relaxProps;
    if (tradeDetail.get('subscriptionPlanGiftList')) {
      return tradeDetail.get('subscriptionPlanGiftList').toJS();
    }
    return null;
  };

  /**
   * 商品与赠品公用(通过itemType区分展示个性内容)
   * itemType=0表示商品 , itemType=1表示赠品
   */
  _getColumns = (itemType) => {
    const { getFieldDecorator } = this.props.form;

    return [
      {
        title: <FormattedMessage id="Order.SKU Code" />,
        dataIndex: 'skuNo',
        key: 'skuNo',
        width: 150
      },
      {
        title: <FormattedMessage id="Order.Product Name" />,
        dataIndex: 'skuName',
        key: 'skuName',
        width: 150,
        render: (text) => `${itemType == 1 ? '[Gift]' : ''}${text}`
      },
      {
        title: <FormattedMessage id="Order.Specification" />,
        dataIndex: 'specDetails',
        key: 'specDetails',
        width: 150
      },
      {
        title: <FormattedMessage id="Order.Returnunitprice" />,
        dataIndex: 'unitPrice',
        key: 'price',
        width: 100,
        render: (text, rowInfo) => {
          return (
            <div>
              {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + (rowInfo.unitPrice||0).toFixed(2)}
            </div>
          );
        }
      },
      {
        title: <FormattedMessage id="Order.Returnquantity" />,
        key: 'num',
        width: 100,
        className: 'centerItem',
        render: (_text, rowInfo: any, index) => {
          return itemType == 1 ? (
            <div style={{ display: 'inline-block', width: '90px' }}>
              {rowInfo.num || 0}
            </div>
          ) : (
            <FormItem>
              {getFieldDecorator(rowInfo.skuId + index, {
                initialValue: rowInfo.num,
                rules: [
                  {
                    required: true,
                    message: <FormattedMessage id="Order.Pleaseenterreturnquantity" />
                  },
                  {
                    pattern: ValidConst.number,
                    message: <FormattedMessage id="Order.Returnquantityshould" />
                  },
                  {
                    validator: (_rule, value, callback) => {
                      const canReturnNum = rowInfo.canReturnNum;
                      if (value > canReturnNum) {
                        callback(<FormattedMessage id="Order.Theamountreturnedmustnotexceed" />);
                      }

                      callback();
                    }
                  }
                ]
              })(
                <InputNumber
                  min={0}
                  max={rowInfo.canReturnNum}
                  onChange={this._editGoodsNum.bind(this, rowInfo.skuId,itemType)}
                />
              )}
              <p><FormattedMessage id="Order.Returnablenumber" />{` ${rowInfo.canReturnNum}`}</p>
            </FormItem>
          );
        }
      },
      {
        title: <FormattedMessage id="Order.Subtotalofreturnamount" />,
        key: 'total',
        width: 100,
        render: (rowInfo) => {
          return (
            <div>
              {' '}
              {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}{' '}
              {(rowInfo.unitPrice * rowInfo.num).toFixed(2)}
            </div>
          );
        }
      }
    ];
  };

  /**
   * 修改数量
   */
  _editGoodsNum = (skuId: string, itemType, returnNum) => {
    const { editGoodsNum } = this.props.relaxProps;
    editGoodsNum(skuId, returnNum || 0, itemType);
  };

  /**
   * 计算每一项的小计金额
   */
  _getRowTotalPrice = (rowInfo) => {
    const num = rowInfo.num || 0;
    if (num < rowInfo.canReturnNum) {
      //小于可退数量,直接单价乘以数量
      return QMFloat.addZero(QMFloat.accMul(rowInfo.unitPrice, num));
    } else {
      //大于等于可退数量 , 使用分摊小计金额 - 已退金额(单价*(购买数量-可退数量))
      return QMFloat.addZero(
        QMFloat.accSubtr(
          rowInfo.splitPrice,
          QMFloat.accMul(
            rowInfo.unitPrice,
            QMFloat.accSubtr(rowInfo.totalNum, rowInfo.canReturnNum)
          )
        )
      );
    }
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
