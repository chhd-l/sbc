import React from 'react';
import { IMap, Relax } from 'plume2';
import { IList } from 'typings/globalType';
import {
  Button,
  Checkbox,
  InputNumber,
  Modal,
  Table,
  message,
  Form,
  Input
} from 'antd';
import GoodsAdd from './goods-add';
import { fromJS } from 'immutable';
import { noop, ValidConst, QMFloat, QMMethod } from 'qmkit';
import './goods-list-style.css';
import { FormattedMessage } from 'react-intl';
// import UUID from 'uuid-js';

import styled from 'styled-components';
const TableSet = styled.div`
  @media screen and (max-width: 1440px) {
    .ant-select {
      max-width: 220px;
    }
  }
  @media screen and (min-width: 1440px) and (max-width: 1680px) {
    .ant-select {
      max-width: 320px;
    }
  }
  @media screen and (min-width: 1680px) {
    .ant-select {
      max-width: 400px;
    }
  }
`;

const FormItem = Form.Item;
const Column = Table.Column;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 14 }
  },
  wrapperCol: {
    span: 22,
    xs: { span: 24 },
    sm: { span: 10 }
  }
};

@Relax
export default class GoodsList extends React.Component<any, any> {
  props: {
    form?: any;
    edit?: boolean;
    relaxProps?: {
      goodsList: IMap;
      oldSkuIds: IList;
      newSkuIds: IList;
      oldBuyCount: IList;
      giftMarketings: IList;
      goodsIntervalPrices: IList;
      totalMoney: string;
      payTotal: string;
      discountPrice: number;
      couponPrice: number;
      pointsPrice: number;
      reductionPrice: number;
      oldTradePrice: IMap;

      onChangeSpecVal: Function;
      onEnableSpecVal: Function;
      onSelectGoodList: Function;
      onDeleteSelectedGoodsList: Function;
      onEnableDeliverFee: Function;
      onChangeDeliverFee: Function;
      onChangeBuyCount: Function;
      onDelGift: Function;
      onExtraInfoChange: Function;
      onCreateOrder: Function;
      saveNewSkuIds: Function;
    };
    //当前选中的会员
    selectedCustomerId: string;
  };

  static relaxProps = {
    goodsList: 'goodsList',
    oldSkuIds: 'oldSkuIds',
    newSkuIds: 'newSkuIds',
    oldBuyCount: 'oldBuyCount',
    giftMarketings: 'giftMarketings',
    goodsIntervalPrices: ['goodsList', 'goodsIntervalPrices'],
    totalMoney: ['goodsList', 'totalMoney'],
    payTotal: ['goodsList', 'payTotal'],
    discountPrice: 'discountPrice',
    couponPrice: 'couponPrice',
    pointsPrice: 'pointsPrice',
    reductionPrice: 'reductionPrice',
    oldTradePrice: 'oldTradePrice',

    onChangeSpecVal: noop,
    onEnableSpecVal: noop,
    onSelectGoodList: noop,
    onDeleteSelectedGoodsList: noop,
    onEnableDeliverFee: noop,
    onChangeDeliverFee: noop,
    onChangeBuyCount: noop,
    onDelGift: noop,
    onSelectAddress: noop,
    onDeleteAddress: noop,
    saveNewSkuIds: noop
  };

  constructor(props) {
    super(props);
    this.state = {
      //显示添加商品
      addAddressVisible: false,
      //选中的商品Ids
      selectedKeys: fromJS([]),
      //选中的商品信息
      selectedRows: fromJS([])
    };
  }

  static defaultProps = {
    selectedCustomerId: '',
    edit: false
  };

  /**
   * 开启/禁用 特价选择
   * @private
   */
  _enableSpecVal(checked: boolean) {
    const { onEnableSpecVal } = this.props.relaxProps;
    this.props.form.resetFields(['specVal']);
    onEnableSpecVal(checked);
    // this.setState({});
  }

  /**
   * 开启/禁用 运费选择
   * @private
   */
  _enableDeliverFee(checked: boolean) {
    const { onEnableDeliverFee } = this.props.relaxProps;
    this.props.form.resetFields(['deliverFee']);
    onEnableDeliverFee(checked);
    this.setState({});
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    // 如果customerId被清空,则清空下面的值
    if (
      !nextProps.selectedCustomerId ||
      this.props.selectedCustomerId != nextProps.selectedCustomerId
    ) {
      this.setState({
        //显示添加商品
        addAddressVisible: false,
        //选中的商品Ids
        selectedKeys: fromJS([]),
        //选中的商品信息
        selectedRows: fromJS([])
      });
      this.props.form.resetFields();
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const { selectedCustomerId } = this.props;

    const {
      goodsList,
      oldSkuIds,
      newSkuIds,
      oldBuyCount,
      discountPrice,
      couponPrice,
      pointsPrice,
      reductionPrice,
      totalMoney,
      payTotal,

      onSelectGoodList,
      onChangeSpecVal,
      onChangeDeliverFee,
      onChangeBuyCount,
      saveNewSkuIds
    } = this.props.relaxProps;
    let dataSource = goodsList.get('dataSource').toJS();
    // 已选赠品列表，会与商品列表合并后放入Table
    let giftDataSource = goodsList.get('giftDataSource').toJS();
    dataSource.forEach((val) => (val.key = val.goodsInfoId));

    const deliverFee = this._deliverFee();

    return (
      <TableSet>
        {!this.props.edit && (
          <Button
            style={{ marginBottom: 10 }}
            type="primary"
            onClick={() => {
              if (!selectedCustomerId) {
                message.error('Please select member');
                return;
              }

              this.setState({
                addAddressVisible: true
              });
            }}
          >
            <FormattedMessage id="addProduct" />
          </Button>
        )}

        <FormItem>
          {getFieldDecorator('goodsChoose', {
            initialValue:
              dataSource && fromJS(dataSource).count() > 0
                ? fromJS(dataSource).count()
                : '',
            rules: [
              {
                required: selectedCustomerId ? true : false,
                message: 'Must select a product'
              }
            ]
          })(<input type="hidden" />)}
        </FormItem>
        <Table
          bordered
          rowKey={(record: any) => {
            if (record.gift) {
              return 'gift_' + record.goodsInfoId;
            }
            return 'row_' + record.goodsInfoId;
          }}
          dataSource={dataSource.concat(giftDataSource)}
          pagination={false}
        >
          <Column
            title={<FormattedMessage id="serialNumber" />}
            key="index"
            width="61px"
            render={(_text, _record, index) => <span>{index + 1}</span>}
          />

          <Column
            title={<FormattedMessage id="skuCode" />}
            dataIndex="goodsInfoNo"
            width="140px"
            key="goodsInfoNo"
          />

          <Column
            width="20%"
            title={<FormattedMessage id="productName" />}
            key="goodsInfoName"
            render={(rowInfo) => {
              if (rowInfo.gift) {
                return (
                  '【' +
                  <FormattedMessage id="giveaway" /> +
                  '】' +
                  rowInfo.goodsInfoName
                );
              }
              return rowInfo.goodsInfoName;
            }}
          />
          <Column
            title={<FormattedMessage id="weight" />}
            width="10%"
            key="goodsSpecs"
            render={(rowInfo) => {
              if (rowInfo.gift) {
                return rowInfo.goodsSpecs;
              }
              return rowInfo.specText;
            }}
          />
          <Column
            title={
              this.props.edit ? (
                <FormattedMessage id="price" />
              ) : (
                <FormattedMessage id="memberPrice" />
              )
            }
            width="110px"
            key="salePrice"
            render={(rowInfo) => {
              if (rowInfo.gift) return '$0.00';
              if (this.props.edit) return rowInfo.levelPrice.toFixed(2);
              const goodsIntervalPrices = this.props.relaxProps
                .goodsIntervalPrices;
              let price = '$' + rowInfo.salePrice.toFixed(2);
              if (rowInfo.priceType === 1) {
                const buyCount = rowInfo.buyCount;
                if (buyCount == 0) {
                  const minPrice = rowInfo.intervalMinPrice;
                  const maxPrice = rowInfo.intervalMaxPrice;
                  price =
                    '$' + minPrice.toFixed(2) + '-' + '$' + maxPrice.toFixed(2);
                } else {
                  const prices = fromJS(rowInfo.intervalPriceIds || [])
                    .map((id) =>
                      goodsIntervalPrices
                        .filter((price) => price.get('intervalPriceId') == id)
                        .first()
                    )
                    .filter((f) => f && f.get('count') <= buyCount)
                    .maxBy((f) => f.get('count'));
                  if (prices) {
                    price = '$' + prices.get('price').toFixed(2);
                  }
                }
              }
              return (
                <div>
                  <p>{price}</p>
                </div>
              );
            }}
          />

          <Column
            width="175px"
            className="centerItem"
            key="num"
            title={<FormattedMessage id="quantity" />}
            render={(_text, record: any) => {
              //赠品数量显示
              if (record.gift) {
                return record.num;
              }
              const buySku = fromJS(
                oldBuyCount.find(
                  (sku) => fromJS(sku).get('skuId') == record.goodsInfoId
                )
              );
              return (
                <FormItem>
                  {getFieldDecorator(record.goodsInfoId + '_buyCount', {
                    initialValue:
                      record && record.buyCount
                        ? record.buyCount.toString()
                        : '0',
                    rules: [
                      {
                        required: true,
                        message: 'Purchase quantity must be entered'
                      },
                      {
                        pattern: ValidConst.noZeroNumber,
                        message:
                          'Purchase volume can only be an integer greater than 0'
                      },
                      {
                        validator: (_rule, value, callback) => {
                          const priceType = record.priceType;

                          let stock = 0;
                          if (this.props.edit) {
                            if (buySku) {
                              stock = QMFloat.accAdd(
                                record.stock,
                                buySku.get('buyCount')
                              );
                            } else {
                              stock = record.stock;
                            }
                          } else {
                            stock = record.stock;
                          }
                          if (stock < value) {
                            if (this.props.edit) {
                              callback(
                                'The purchase volume cannot be greater than the remaining inventory'
                              );
                            } else {
                              callback(
                                'Purchase volume cannot be greater than inventory'
                              );
                            }
                            return;
                          }
                          if (priceType === 0) {
                            const maxCount = record.maxCount;
                            const count = record.count;
                            if (maxCount && maxCount < value) {
                              callback(
                                'The purchase volume cannot be greater than the limit order quantity'
                              );
                              return;
                            }
                            if (count && count > value) {
                              callback(
                                'The purchase volume cannot be less than the minimum quantity'
                              );
                              return;
                            }
                          }
                          callback();
                        }
                      }
                    ]
                  })(
                    <InputNumber
                      disabled={this.props.edit}
                      onChange={(val: string) => {
                        onChangeBuyCount(record.goodsInfoId, val);
                      }}
                    />
                  )}
                  <p>
                    {this.props.edit &&
                    (record.initBuyCount || (buySku && buySku.get('buyCount')))
                      ? null
                      : `${(<FormattedMessage id="stock" />)}: ${
                          record.stock
                        } ${
                          record.priceType === 0
                            ? (record.count
                                ? 'Minimum order quantity: ' + record.count
                                : '') +
                              (record.maxCount
                                ? 'Maximum amount: ' + record.maxCount
                                : '')
                            : ''
                        }`}
                  </p>
                </FormItem>
              );
            }}
          />

          <Column
            title={<FormattedMessage id="total" />}
            width="110px"
            key="subtotal"
            render={(_text, record: any) => {
              if (record.gift) return '$0.00';
              if (this.props.edit)
                return (record.buyCount * record.levelPrice).toFixed(2);
              const { goodsIntervalPrices } = this.props.relaxProps;
              let price = record.salePrice;
              if (
                record.priceType === 1 &&
                goodsIntervalPrices &&
                goodsIntervalPrices.count() > 0 &&
                goodsIntervalPrices.get(0) != null
              ) {
                const buyCount = record.buyCount;
                const prices = goodsIntervalPrices
                  .filter((intervalPrice) =>
                    fromJS(record.intervalPriceIds).includes(
                      intervalPrice.get('intervalPriceId')
                    )
                  )
                  .filter(
                    (intervalPrice) => intervalPrice.get('count') <= buyCount
                  )
                  .maxBy((intervalPrice) => intervalPrice.get('count'));
                if (prices) {
                  price = prices.get('price');
                }
              }
              return (
                <span>
                  $
                  {(price * record.buyCount
                    ? price * record.buyCount
                    : 0.0
                  ).toFixed(2)}{' '}
                </span>
              );
            }}
          />

          {!this.props.edit && (
            <Column
              title={<FormattedMessage id="operation" />}
              key="opt"
              width="61px"
              render={(_text, record: any) => (
                <a
                  href="#!"
                  onClick={() => {
                    if (record.gift) {
                      this._delGift(fromJS(record).get('goodsInfoId'));
                    } else {
                      this._delGoodsInfo(fromJS(record).get('goodsInfoId'));
                    }
                  }}
                >
                  <FormattedMessage id="delete" />
                </a>
              )}
            />
          )}
        </Table>
        <div style={styles.detailBox as any}>
          <div style={styles.inputBox as any}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }}
              className="afterNone"
            >
              <FormItem
                style={{ width: 280 }}
                {...formItemLayout}
                colon={false}
                label={
                  <Checkbox
                    checked={goodsList.get('isEnableSpecVal')}
                    disabled={selectedCustomerId ? false : true}
                    onChange={(e: any) => {
                      if (!selectedCustomerId) {
                        message.error('Please select member');
                        return;
                      }
                      //开启或者取消特价
                      const checked = (e.target as any).checked;
                      this._enableSpecVal(checked);
                    }}
                  >
                    <FormattedMessage id="order.orderPriceChange" />
                    :$
                  </Checkbox>
                }
              >
                {getFieldDecorator('specVal', {
                  initialValue: goodsList.get('isEnableSpecVal')
                    ? (goodsList.get('specVal') || 0).toFixed(2)
                    : '',
                  rules: [
                    {
                      required: goodsList.get('isEnableSpecVal'),
                      message: 'Please enter the amount'
                    },
                    {
                      pattern: ValidConst.zeroPrice,
                      message: 'Please enter the correct amount'
                    }
                  ]
                })(
                  <Input
                    disabled={
                      selectedCustomerId
                        ? goodsList.get('isEnableSpecVal')
                          ? false
                          : true
                        : true
                    }
                    onChange={(e) => {
                      onChangeSpecVal(parseFloat((e.target as any).value || 0));
                      this.setState({});
                    }}
                    style={{ width: 80, marginLeft: 0 }}
                  />
                )}
              </FormItem>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }}
              className="afterNone"
            >
              <FormItem
                style={{ width: 280 }}
                {...formItemLayout}
                colon={false}
                label={
                  <Checkbox
                    checked={goodsList.get('isEnableDeliverFee')}
                    disabled={selectedCustomerId ? false : true}
                    onChange={(e) => {
                      if (!selectedCustomerId) {
                        message.error('Please select member');
                        return;
                      }
                      const checked = (e.target as any).checked;
                      this._enableDeliverFee(checked);
                    }}
                  >
                    <FormattedMessage id="shippingFees" />
                    :$
                  </Checkbox>
                }
              >
                {getFieldDecorator('deliverFee', {
                  initialValue: goodsList.get('isEnableDeliverFee')
                    ? goodsList.get('deliverFee')
                    : '',
                  rules: [
                    {
                      required: goodsList.get('isEnableDeliverFee'),
                      message: 'Please enter the amount'
                    },
                    {
                      pattern: ValidConst.zeroPrice,
                      message: 'Please enter the correct amount'
                    }
                  ]
                })(
                  <Input
                    disabled={
                      selectedCustomerId
                        ? goodsList.get('isEnableDeliverFee')
                          ? false
                          : true
                        : true
                    }
                    onChange={(e) => {
                      onChangeDeliverFee(
                        parseFloat((e.target as any).value || 0)
                      );
                      this.setState({});
                    }}
                    style={{ width: 80, marginLeft: 0 }}
                  />
                )}
              </FormItem>
            </div>
          </div>

          <div style={styles.bottomPrice}>
            <div style={styles.title}>
              <span style={styles.itemsText}>
                <FormattedMessage id="productAmount" />:
              </span>
              {reductionPrice != 0 && (
                <span style={styles.itemsText}>
                  <FormattedMessage id="fullReductionAmount" />:
                </span>
              )}
              {discountPrice != 0 && (
                <span style={styles.itemsText}>
                  <FormattedMessage id="fullDiscountAmount" />:
                </span>
              )}
              {couponPrice != 0 && (
                <span style={styles.itemsText}>
                  <FormattedMessage id="coupon" />:
                </span>
              )}
              {pointsPrice != 0 && (
                <span style={styles.itemsText}>
                  <FormattedMessage id="pointsDeduction" />:
                </span>
              )}
              {goodsList.get('isEnableSpecVal') && (
                <span style={styles.itemsText}>
                  <FormattedMessage id="order.orderPriceChange" />:
                </span>
              )}
              <span style={styles.itemsText}>
                <FormattedMessage id="shippingFees" />:
              </span>
              <span style={styles.itemsText}>
                <FormattedMessage id="totalPayable" />:
              </span>
            </div>
            <div style={styles.priceCom}>
              <div style={styles.priceCol}>
                <span style={styles.itemsText}>${totalMoney}</span>
                {reductionPrice != 0 && (
                  <span style={styles.itemsText}>
                    -${reductionPrice.toFixed(2)}
                  </span>
                )}
                {discountPrice != 0 && (
                  <span style={styles.itemsText}>
                    -${discountPrice.toFixed(2)}
                  </span>
                )}
                {couponPrice != 0 && (
                  <span style={styles.itemsText}>
                    -${couponPrice.toFixed(2)}
                  </span>
                )}
                {pointsPrice != 0 && (
                  <span style={styles.itemsText}>
                    -${pointsPrice.toFixed(2)}
                  </span>
                )}
                {goodsList.get('isEnableSpecVal') && (
                  <span style={styles.itemsText}>
                    ${(goodsList.get('specVal') || 0).toFixed(2)}
                  </span>
                )}
                <span style={styles.itemsText}>${deliverFee}</span>
                <span style={styles.itemsText}>${payTotal}</span>
              </div>
            </div>
          </div>
        </div>

        {this.state.addAddressVisible && (
          <Modal
            maskClosable={false}
            title="Select product"
            width={1100}
            visible={this.state.addAddressVisible}
            onOk={async () => {
              let selectedRows = fromJS(
                (await this['_goodsAdd'].getSelectRows()) || []
              );
              selectedRows = QMMethod.distinct(
                fromJS(dataSource),
                selectedRows,
                'goodsInfoId'
              );
              const selectedKeys = await this['_goodsAdd'].getSelectKeys();
              const newKeys = selectedKeys
                .map((key) => key.substring(4))
                .filter((key) => oldSkuIds.findIndex((o) => o == key) < 0);
              const wholeKeys = newSkuIds
                .toSet()
                .concat(newKeys.toSet())
                .toList();
              if (wholeKeys.count() > 50) {
                message.error('No more than 50 types of purchased goods');
                return;
              }
              saveNewSkuIds(wholeKeys);
              const intervalPricesNew = await this[
                '_goodsAdd'
              ].getIntervalPrices();

              const { goodsIntervalPrices } = this.props.relaxProps;
              let intervalPricesOld = goodsIntervalPrices;
              //当前选中的商品
              const selectedRow = selectedRows.map((v) => {
                let buyCount = v.get('buyCount') || 1;
                //如果有最小起订量
                if (v.get('priceType') === 0 && v.get('count')) {
                  buyCount =
                    v.get('count') > v.get('stock')
                      ? v.get('stock')
                      : v.get('count');
                }
                return v.set('buyCount', buyCount);
              });
              const rowCount = selectedRows.count();
              this.props.form.setFieldsValue({
                goodsChoose: rowCount > 0 ? rowCount.toString() : ''
              });
              this.setState({
                addAddressVisible: false,
                selectedKeys: selectedKeys,
                selectedRows: selectedRows
              });
              onSelectGoodList(
                selectedRow,
                QMMethod.distinct(
                  fromJS(intervalPricesNew),
                  fromJS(intervalPricesOld),
                  'intervalPriceId'
                )
              );
            }}
            onCancel={() => {
              this.setState({ addAddressVisible: false });
            }}
            okText={<FormattedMessage id="confirm" />}
            cancelText={<FormattedMessage id="cancel" />}
          >
            {
              <GoodsAdd
                selectedCustomerId={selectedCustomerId}
                selectedKeys={this.state.selectedKeys}
                selectedRows={this.state.selectedRows}
                ref={(goodsAdd) => (this['_goodsAdd'] = goodsAdd)}
              />
            }
          </Modal>
        )}
      </TableSet>
    );
  }

  _deliverFee = () => {
    const { goodsList } = this.props.relaxProps;
    const deliverFee = goodsList.get('deliverFee') || 0;
    return deliverFee.toFixed(2);
  };

  _renderSpecVal = () => {
    const { goodsList } = this.props.relaxProps;
    const isEnableSpecVal = goodsList.get('isEnableSpecVal');
    const specVal = goodsList.get('specVal');

    if (!isEnableSpecVal) {
      return null;
    }

    return (
      <label style={styles.priceItem as any}>
        <span style={styles.name}>
          <FormattedMessage id="order.orderPriceChange" />:{' '}
        </span>
        <strong>${(specVal || 0).toFixed(2)}</strong>
      </label>
    );
  };

  /**
   * 根据商品Id删除选中的赠品
   */
  _delGift(goodsInfoId) {
    this.props.relaxProps.onDelGift(goodsInfoId);
  }

  /**
   * 根据商品Id删除选中的商品
   * @param goodsInfoId
   * @returns {Promise<void>}
   * @private
   */
  async _delGoodsInfo(goodsInfoId) {
    const {
      goodsList,

      onDeleteSelectedGoodsList
    } = this.props.relaxProps;
    let { selectedRows, selectedKeys } = this.state;
    selectedKeys = selectedKeys.filter((key) => key != 'add_' + goodsInfoId);
    selectedRows = selectedRows.filter(
      (sku) => sku.get('goodsInfoId') != goodsInfoId
    );
    this.setState({
      selectedKeys: selectedKeys,
      selectedRows: selectedRows
    });
    const count = fromJS(goodsList.get('dataSource')).count();
    if (count <= 1) {
      this.props.form.setFieldsValue({
        goodsChoose: ''
      });
    } else {
      this.props.form.setFieldsValue({
        goodsChoose: QMFloat.accSubtr(count, 1)
      });
    }
    onDeleteSelectedGoodsList(goodsInfoId);
    let key = goodsInfoId + '_buyCount';
    this.props.form.resetFields([key]);
  }
}

const styles = {
  giftBox: {
    alignItems: 'center',
    padding: 20,
    border: '1px solid #e9e9e9',
    borderTop: 0
  },
  detailBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    border: '1px solid #e9e9e9',
    borderTop: 0,
    marginTop: -4,
    borderRadius: 4,
    marginBottom: 20,
    height: 200
  },
  priceBox: {
    display: 'flex',
    flexDirection: 'column'
  },
  name: {
    width: 80,
    textAlign: 'right',
    display: 'inline-block'
  },
  priceItem: {
    width: 280,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10
  },
  inputBox: {
    display: 'flex',
    flexDirection: 'column',
    height: 110,
    justifyContent: 'space-between'
  },
  lineThrough: {
    textDecoration: 'line-through',
    color: '#999'
  },
  bottomPrice: {
    minWidth: 300,
    maxWidth: 400,
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    display: 'flex',
    flexDirection: 'column'
  },
  priceCom: {
    display: 'flex'
  },
  priceCol: {
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column'
  },
  priceLine: {
    marginLeft: 10,
    color: '#999',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    textDecoration: 'line-through'
  },
  itemsText: {
    paddingTop: 10
  }
} as any;
