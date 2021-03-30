import { Button, Icon, Popconfirm, Select, Table, Tooltip } from 'antd';
import React from 'react';
import AddProductModal from './addProductModal';
import { getGoodsInfoCarts, querySysDictionary, updateGoodsInfoCarts, deleteGoodsInfoCarts, totalGoodsPrice } from '../webapi';
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
      totalPrice: 0
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
        this.querySysDictionary();
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
    const {options}=this.state
    if (name === 'subscriptionStatus' && e === 0) {
      row['periodTypeId'] = null;
    }else if(name === 'subscriptionStatus' && e === 1){
      row.periodTypeId=row.periodTypeId?row.periodTypeId:options[0].id
    }
    row[name] = e;
    await updateGoodsInfoCarts(this.props.storeId, {
      periodTypeId: row.periodTypeId,
      subscriptionStatus: row.subscriptionStatus,
      goodsInfoFlag: row.subscriptionStatus,
      goodsNum: row.buyCount,
      goodsInfoId: row.goodsInfoId,
      customerId: customer.customerId,
     purchaseId:row.purchaseId
    });

    this.state.dataSource[index] = row;
    this.setState({
      dataSource: this.state.dataSource
    },()=>{
      this.querySysDictionary();
    });
  }
/**
 * 
 * @param data 获取总的价格
 */
  async totalGoodsPrices(data) {
    const { customer } = this.props;
    let goodsInfoIds = data.map((item) => item.goodsInfoId);
    let params = {
      goodsInfoIds: goodsInfoIds,
      promotionCode: '',
      subscriptionFlag: false,
      country: '',
      region: '',
      city: '',
      street: '',
      postalCode: '',
      customerAccount: ''
    };
    const { res } = await totalGoodsPrice(customer.customerId, params);
    this.setState({
      totalPrice: res.context?.tradePrice ?? 0
    });
  }

  /**
   * 获取更新频率月｜ 周
   */
  async querySysDictionary() {
    this.setState({ loading: true });
    const result = await Promise.all([querySysDictionary({ type: 'Frequency_week' }), querySysDictionary({ type: 'Frequency_month' }), getGoodsInfoCarts(this.props.storeId, this.props.customer.customerId)]);
    let weeks = result[0].res?.context?.sysDictionaryVOS ?? [];
    let months = result[1].res?.context?.sysDictionaryVOS ?? [];
    let goodsList = result[2].res.context?.goodsList ?? [];
    let options = [...months, ...weeks];
    this.props.carts(goodsList);
    this.setState(
      {
        options,
        dataSource: goodsList,
        loading: false
      },
      () => {
        this.totalGoodsPrices(goodsList);
      }
    );
  }
  /**
   *
   * @param row 删除购物车的商品
   */
  async deleteCartsGood(row) {
    const { storeId, customer } = this.props;
    await deleteGoodsInfoCarts(storeId, {
      goodsInfoIds: [row.goodsInfoId],
      customerId: customer.customerId
    });
    this.querySysDictionary();
  }
  render() {
    // const { getFieldDecorator } = this.props.form;
    const { options, dataSource, loading, totalPrice } = this.state;
    const { storeId, customer } = this.props;
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
             { record.subscriptionStatus===1&&(<Option value={1}>Y</Option>)}
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
        title: ' Total amount',
        dataIndex: 'itemTotalAmount',
        key: 'itemTotalAmount',
        return: (text, record) => {
          let price={
          1:(record.subscriptionPrice*record.buyCount).toFixed(2),
          0:(record.marketPrice*record.buyCount).toFixed(2)
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
            <Popconfirm placement="topLeft" title="Are you sure you want to delete this product?" onConfirm={() => this.deleteCartsGood(record)} okText="Confirm" cancelText="Cancel">
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
    return (
      <div>
        <h3>Step2</h3>
        <h4>
          {this.props.stepName}
          {/* <span className="ant-form-item-required"></span> */}
        </h4>
        <Button type="primary" onClick={this.addProduct} style={{marginTop:10}}>
          Add product
        </Button>
        <div className="basicInformation">
          <Table
            pagination={false}
            loading={{ spinning: loading, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" /> }}
            rowKey="goodsInfoId"
            dataSource={dataSource}
            columns={columns}
          />
          <div style={{ textAlign: 'right', padding: '20px 0' }}>Product amount ${totalPrice}</div>
          <AddProductModal storeId={storeId} customer={customer} visible={this.state.visible} handleCancel={this.handleOk} handleOk={this.handleOk}></AddProductModal>
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
