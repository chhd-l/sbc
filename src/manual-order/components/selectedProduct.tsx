import { Button, Icon, Popconfirm, Select, Table, Tooltip, Checkbox } from 'antd';
import React from 'react';
import AddProductModal from './addProductModal';
import { getGoodsInfoCarts, querySysDictionary, updateGoodsInfoCarts, deleteGoodsInfoCarts, getValetGuestMiniCarts,deleteGuestCartsData } from '../webapi';
import { cache, AuthWrapper, util } from 'qmkit';
import { FormattedMessage } from 'react-intl';
const defaultImg = require('./img/none.png');
const { Option } = Select;
export default class SelectedProduct extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      confirmLoading: false,
      dataSource: [],
      options: [],
      clubOptions: [],
      loading: false,
      totalPrice: 0,
      goodsCount: {},//商品数量 map id：0对应
      guestId:this.props.guestKey,
    };
  }

  addProduct = () => {
    this.setState({
      visible: true
    });
  };
  handleOk = (guestKey?:string) => {
    const {guest} = this.props;
    this.setState(
      {
        visible: false
      },
      () => {
        if (((guest && guestKey) || !guest)) {
          this.getGoodsInfoCartsList(guestKey)
        }
      }
    );
  };

  componentDidMount() {
    this.querySysDictionary();
  }
  /**
   * 
   * @param e 下拉选项
   * @param index 
   * @param row 
   * @param name 
   */
  async onSelectChange(e, index, row, name) {
    const { customer } = this.props;
    const { options } = this.state
    if (name === 'subscriptionStatus' && e === 0) {
      row['periodTypeId'] = 0;
      row.goodsInfoFlag = 0
    } else if (name === 'subscriptionStatus' && e === 1) {
      row.periodTypeId = row.periodTypeId ? row.periodTypeId : row?.options[0]?.id
      if (row.promotions === 'club') {
        row.goodsInfoFlag = 2
      } else {
        row.goodsInfoFlag = 1
      }
    }
    row[name] = e;
    this.setState({
      loading: true
    });

    await updateGoodsInfoCarts(this.props.storeId, {
      periodTypeId: row.periodTypeId,
      subscriptionStatus: row.subscriptionStatus,
      goodsInfoFlag: row.goodsInfoFlag,
      goodsNum: row.buyCount,
      goodsInfoId: row.goodsInfoId,
      customerId: customer.customerId,
      purchaseId: row.purchaseId
    });

    this.state.dataSource[index] = row;
    this.setState({
      dataSource: this.state.dataSource
    }, () => {
      this.getGoodsInfoCartsList();
    });
  }

  //获取购物车列表
  getGoodsInfoCartsList = async (guestKey?:string) => {
    this.props.guestId(guestKey)
    this.setState({
      guestId:guestKey
    })
    const { res } = guestKey ? await getValetGuestMiniCarts(this.props.storeId, guestKey) : await getGoodsInfoCarts(this.props.storeId, this.props.customer.customerId);
    let goodsList = res.context?.goodsList ?? [];
    let goodsCount = {}, totalPrice = 0;
    goodsList.map(item => {
      goodsCount = {
        ...goodsCount,
        [item.goodsInfoId]: item.buyCount
      }

      if (item.subscriptionStatus === 1) {
        //console.log(item.subscriptionStatus)
        if (item.promotions === 'club') {
          item.options = this.state.clubOptions
        } else {
          item.options = this.state.options
        }
      }

      totalPrice += (+item.itemTotalAmount)
    })
    this.props.carts(goodsList);
    this.setState(
      {
        dataSource: goodsList,
        loading: false,
        goodsCount: goodsCount,
        totalPrice: totalPrice.toFixed(2),
      }
    );
  }
  /**
   * 获取更新频率月｜ 周
   */
  async querySysDictionary() {
    const {guest} = this.props;
    !guest && this.setState({ loading: true });
    const result = await Promise.all([querySysDictionary({ type: 'Frequency_week' }), querySysDictionary({ type: 'Frequency_month' }), querySysDictionary({ type: 'Frequency_week_club' }), querySysDictionary({ type: 'Frequency_month_club' })]);
    let weeks = result[0].res?.context?.sysDictionaryVOS ?? [];
    let months = result[1].res?.context?.sysDictionaryVOS ?? [];
    let club_weeks = result[2].res?.context?.sysDictionaryVOS ?? [];
    let club_months = result[3].res?.context?.sysDictionaryVOS ?? [];
    let options = [...months, ...weeks];
    let clubOptions = [...club_months, ...club_weeks];
    this.setState({
      options,
      clubOptions
    }, () => {
      !guest && this.getGoodsInfoCartsList()
    });
  }
  /**
   *
   * @param row 删除购物车的商品
   */
  async deleteCartsGood(row) {
    const { storeId, customer } = this.props;
    const {guestId} = this.state;
    this.setState({
      loading: true
    });
    if(guestId) {
      await deleteGuestCartsData({
        goodsInfoIds: [row.goodsInfoId],
      customerId: guestId
      })
    }else {
       await deleteGoodsInfoCarts(storeId, {
      goodsInfoIds: [row.goodsInfoId],
      customerId: customer.customerId
    });
    }
   
    this.getGoodsInfoCartsList(guestId);
  }
  render() {
    // const { getFieldDecorator } = this.props.form;
    const { options, dataSource, loading, totalPrice, goodsCount, visible, guestId } = this.state;
    const { storeId, customer, url } = this.props;
    const columns = [
      {
        title: 'Image',
        width: 100,
        dataIndex: 'goodsInfoImg',
        key: 'goodsInfoImg',
        render: (img) => (img ? <img src={util.optimizeImage(img)} style={styles.imgItem} /> : <img src={defaultImg} style={styles.imgItem} />)
      },
      {
        title: 'SKU',
        width: 100,
        dataIndex: 'goodsInfoNo',
        key: 'goodsInfoNo'
      },
      {
        title: 'Product name',
        dataIndex: 'goodsInfoName',
        width: 100,
        key: 'goodsInfoName'
      },
      {
        title: 'Weight',
        width: 100,
        dataIndex: 'packSize',
        key: 'packSize'
      },
      {
        title: 'Stock availability',
        dataIndex: 'stock',
        width: 100,
        key: 'stock'
      },
      {
        title: 'Marketing price',
        dataIndex: 'marketPrice',
        width: 100,
        key: 'marketPrice'
      },
      {
        title: 'Subscription price',
        width: 100,
        dataIndex: 'subscriptionPrice',
        key: 'subscriptionPrice'
      },
      {
        title: 'Selected Subscription',
        dataIndex: 'subscriptionStatus',
        width: 100,
        key: 'subscriptionStatus',

        render: (text, record, index) => {
          return (
            <Select
              style={{ width: 100 }}
              value={[1, 2].includes(record.goodsInfoFlag) ? 1 : 0}
              getPopupContainer={(trigger: any) => trigger.parentNode}
              disabled={this.props.felinStore}
              placeholder="Select a person" optionFilterProp="children"
              onChange={(e) => this.onSelectChange(e, index, record, 'subscriptionStatus')}>
              { record.subscriptionStatus === 1 && (<Option value={1}>Y</Option>)}
              <Option value={0}>N</Option>
            </Select>
          );
        }
      },
      {
        title: 'Frequency',
        dataIndex: 'periodTypeId',
        width: 100,
        key: 'periodTypeId',

        render: (text, record, index) => {
          // let value=record.goodsInfoFlag===1?(text?text:options[0].id):null

          return [1, 2].includes(record.goodsInfoFlag) && record.subscriptionStatus === 1 ? (
            <Select style={{ width: 100 }}
              value={text} getPopupContainer={(trigger: any) => trigger.parentNode}
              placeholder="Select a person" optionFilterProp="children"
              onChange={(e) => this.onSelectChange(e, index, record, 'periodTypeId')}>
              {record.options.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          ) : (
            <span></span>
          );
        }
      },

      {
        title: 'quantity',
        dataIndex: 'buyCount',
        width: 100,
        key: 'buyCount'
      },

      {
        title: 'Total amount',
        dataIndex: 'itemTotalAmount',
        key: 'itemTotalAmount',
        width: 100,
        return: (text, record) => {
          let price = {
            1: (record.subscriptionPrice * record.buyCount).toFixed(2),
            0: (record.marketPrice * record.buyCount).toFixed(2)
          }
          return (<span>{price[record.subscriptionStatus]}</span>)
        }

      },
      {
        title: 'Operation',
        dataIndex: 'Operation',
        width: 100,
        fixed: 'right',
        key: 'Operation',
        render: (text, record) => {
          return (
            <Popconfirm placement="topLeft" title={<FormattedMessage id="Order.deleteproduct" />} onConfirm={() => this.deleteCartsGood(record)} okText={<FormattedMessage id="Order.confirm" />} cancelText={<FormattedMessage id="Order.btnCancel" />}>
              <Tooltip placement="top" title="Delete">
                <a>
                  <span style={{ color: 'red', paddingRight: 10, cursor: 'pointer', fontSize: 16 }} className="icon iconfont iconDelete"></span>
                </a>
              </Tooltip>
            </Popconfirm>
          );
        }
      }
    ];
    // 翻译title
    columns.forEach(obj => {
      (obj.title as any) = <FormattedMessage id={`Order.${obj.title}`} />
    });
    return (
      <div>
        <h3><FormattedMessage id="Order.Step2" /></h3>
        <h4>
          <FormattedMessage id={`Order.${this.props.stepName}`} />:
          {/* <span className="ant-form-item-required"></span> */}
        </h4>
        <Button type="primary" onClick={this.addProduct} style={{ marginTop: 10 }}>
          <FormattedMessage id="Order.addProduct" />
        </Button>
        <div className="basicInformation">
          <Table
            pagination={false}
            loading={loading}
            className="goods-info-list"
            rowKey="goodsInfoId"
            dataSource={dataSource}
            columns={columns}
            scroll={{ x: 1400 }}
          />
          <div style={{ textAlign: 'right', padding: '20px 0' }}>
            <FormattedMessage id="Order.Product amount" /> {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}:{totalPrice}</div>
          {visible && <AddProductModal url={url} storeId={storeId} customer={customer} goodsCount={goodsCount} guestId={guestId} visible={visible} guest={this.props.guest} searchCount={this.getGoodsInfoCartsList} handleCancel={this.handleOk} handleOk={this.handleOk}></AddProductModal>}
        </div>
        <AuthWrapper functionName='f_goodwill_order'>
          <Checkbox onChange={e => this.props.onGoodwillChecked(e.target.checked)}><FormattedMessage id="Order.goodwillDesc" /></Checkbox>
        </AuthWrapper>
      </div>
    );
  }
}

const styles = {
  imgItem: {
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    float: 'left',
    marginRight: 10,
    background: '#fff',
    borderRadius: 3
  }
} as any;
