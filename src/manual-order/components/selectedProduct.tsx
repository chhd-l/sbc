import { Button, Icon, Popconfirm, Select, Table, Tooltip } from 'antd';
import React from 'react';
import AddProductModal from './addProductModal';
import { getGoodsInfoCarts, querySysDictionary, updateGoodsInfoCarts, deleteGoodsInfoCarts } from '../webapi';
import { cache } from 'qmkit';
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
      loading: false,
      totalPrice: 0,
      goodsCount: {}//商品数量 map id：0对应
    };
  }

  addProduct = () => {
    this.setState({
      visible: true
    });
  };
  handleOk = () => {
    this.setState(
      {
        visible: false
      },
      () => {
        this.getGoodsInfoCartsList();
      }
    );
  };

  componentDidMount() {
    this.querySysDictionary();
    this.getGoodsInfoCartsList()
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
    } else if (name === 'subscriptionStatus' && e === 1) {
      row.periodTypeId = row.periodTypeId ? row.periodTypeId : options[0].id
    }
    row[name] = e;
    this.setState({
      loading: true
    });
    await updateGoodsInfoCarts(this.props.storeId, {
      periodTypeId: row.periodTypeId,
      subscriptionStatus: row.subscriptionStatus,
      goodsInfoFlag: row.subscriptionStatus,
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
  getGoodsInfoCartsList = async () => {
    const { res } = await getGoodsInfoCarts(this.props.storeId, this.props.customer.customerId)
    let goodsList = res.context?.goodsList ?? [];
    let goodsCount = {}, totalPrice = 0;
    goodsList.map(item => {
      goodsCount = {
        ...goodsCount,
        [item.goodsInfoId]: item.buyCount
      }
      totalPrice += (+item.itemTotalAmount)
    })
    this.props.carts(goodsList);
    this.setState(
      {
        dataSource: goodsList,
        loading: false,
        goodsCount: goodsCount,
        totalPrice:totalPrice.toFixed(2)
      }
    );
  }
  /**
   * 获取更新频率月｜ 周
   */
  async querySysDictionary() {
    this.setState({ loading: true });
    const result = await Promise.all([querySysDictionary({ type: 'Frequency_week' }), querySysDictionary({ type: 'Frequency_month' })]);
    let weeks = result[0].res?.context?.sysDictionaryVOS ?? [];
    let months = result[1].res?.context?.sysDictionaryVOS ?? [];
    let options = [...months, ...weeks];
    this.setState(
      {
        options,
      }
    );
  }
  /**
   *
   * @param row 删除购物车的商品
   */
  async deleteCartsGood(row) {
    const { storeId, customer } = this.props;
    this.setState({
      loading: true
    });
    await deleteGoodsInfoCarts(storeId, {
      goodsInfoIds: [row.goodsInfoId],
      customerId: customer.customerId
    });
    this.getGoodsInfoCartsList();
  }
  render() {
    // const { getFieldDecorator } = this.props.form;
    const { options, dataSource, loading, totalPrice, goodsCount, visible } = this.state;
    const { storeId, customer,url, prefix } = this.props;
    const columns = [
      {
        title: 'Image',
        dataIndex: 'goodsInfoImg',
        key: 'goodsInfoImg',
        render: (img) => (img ? <img src={img} style={styles.imgItem} /> : <img src={defaultImg} style={styles.imgItem} />)
      },
      {
        title: 'SKU',
        dataIndex: 'goodsInfoNo',
        key: 'goodsInfoNo'
      },
      {
        title: 'Product name',
        dataIndex: 'goodsInfoName',
        key: 'goodsInfoName'
      },
      {
        title: 'Weight',
        dataIndex: 'packSize',
        key: 'packSize'
      },
      {
        title: 'Stock availability',
        dataIndex: 'stock',
        key: 'stock'
      },
      {
        title: 'Marketing price',
        dataIndex: 'marketPrice',
        key: 'marketPrice'
      },
      {
        title: 'Subscription price',
        dataIndex: 'subscriptionPrice',
        key: 'subscriptionPrice'
      },
      {
        title: 'Selected Subscription',
        dataIndex: 'subscriptionStatus',
        key: 'subscriptionStatus',

        render: (text, record, index) => {
          return (
            <Select style={{ width: 100 }} value={record.goodsInfoFlag} getPopupContainer={(trigger: any) => trigger.parentNode} placeholder="Select a person" optionFilterProp="children" onChange={(e) => this.onSelectChange(e, index, record, 'subscriptionStatus')}>
              { record.subscriptionStatus === 1 && (<Option value={1}>Y</Option>)}
              <Option value={0}>N</Option>
            </Select>
          );
        }
      },
      {
        title: 'Frequency',
        dataIndex: 'periodTypeId',
        key: 'periodTypeId',

        render: (text, record, index) => {

          // let value=record.goodsInfoFlag===1?(text?text:options[0].id):null

          return record.goodsInfoFlag === 1 ? (
            <Select style={{ width: 100 }} value={text} getPopupContainer={(trigger: any) => trigger.parentNode} placeholder="Select a person" optionFilterProp="children" onChange={(e) => this.onSelectChange(e, index, record, 'periodTypeId')}>
              {options.map((item) => (
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
        key: 'buyCount'
      },

      {
        title: 'Total amount',
        dataIndex: 'itemTotalAmount',
        key: 'itemTotalAmount',
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
        key: 'Operation',
        render: (text, record) => {
          return (
            <Popconfirm placement="topLeft" title={<FormattedMessage id="Order.deleteproduct" />}  onConfirm={() => this.deleteCartsGood(record)} okText={<FormattedMessage id="Order.confirm" />} cancelText={<FormattedMessage id="Order.btnCancel" />}>
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
            loading={{ spinning: loading, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" /> }}
            rowKey="goodsInfoId"
            dataSource={dataSource}
            columns={columns}
          />
          <div style={{ textAlign: 'right', padding: '20px 0' }}>
          <FormattedMessage id="Order.Product amount" /> {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}:{totalPrice}</div>
          {visible && <AddProductModal url={url} prefix={prefix} storeId={storeId} customer={customer} goodsCount={goodsCount} visible={visible} searchCount={(e) => this.getGoodsInfoCartsList()} handleCancel={this.handleOk} handleOk={this.handleOk}></AddProductModal>}
        </div>
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
