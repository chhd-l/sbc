import { Badge, Button, Checkbox, Col, Divider, Dropdown, Form, Icon, Input, InputNumber, Menu, message, Modal, Pagination, Radio, Row, Table } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { i } from 'plume2';
import { Const } from 'qmkit';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { getGoodsSKUS, addGoodsIntoCarts } from '../webapi';
const defaultImg = require('./img/none.png');
const { SubMenu } = Menu;
interface IParams {
  cateType: string;
  likeGoodsInfoNo: string;
  likeGoodsName: string;
  pageNum: number;
  pageSize: number;
  saleableFlag: number,
  goodsAttributesValueRelVOList: any
}
let _tempParam = [];
export default class AddProductModal extends Component {
  state = {
    cateType: '',
    likeGoodsInfoNo: '',
    likeGoodsName: '',
    goodsLists: [],
    currentPage: 0,
    total: 0,
    pageSize: 5,
    loading: false,
    selectedFilter: [],
    filterList: [],
    checkboxValue: [],
    paramsList: []
  };
  props: {
    customer: any;
    storeId: string;
    visible: boolean;
    handleOk: any;
    handleCancel: any;
    goodsCount?: any
    searchCount?: Function
    url: string,
  };
  onChange = (e, type) => {
    if (e && e.target) {
      e = e.target.value;
    }
    this.setState({
      [type]: e
    });
  };
  componentDidMount() {
    this.search();
  }
  getGoodsSKUSList = async (param: IParams) => {
    this.setState({
      loading: true
    });
    const { res } = await getGoodsSKUS(param);
    const { goodsInfoPage, goodsStoreGoodsFilterVOList, selectedFilter } = res.context;
    let filterList =goodsStoreGoodsFilterVOList&&goodsStoreGoodsFilterVOList.map(item => {
      item.visibleDrop = false;
      return item;
    })||[]
    let _selectedFilter = [].concat(selectedFilter || []).reduce((list, current) => {
      return list.concat(current?.attributesValueList ?? [])
    }, [])
    this.setState(
      {
        selectedFilter: _selectedFilter,
        filterList: filterList,
        total: goodsInfoPage.total,
        currentPage: goodsInfoPage?.number + 1 ?? 0,
        pageSzie: goodsInfoPage.numberOfElements,
        goodsLists: goodsInfoPage?.content ?? []
      },
      () => {
        this.setState({
          loading: false
        });
      }
    );
  }
  search = () => {
    const { cateType, likeGoodsInfoNo, likeGoodsName,paramsList } = this.state;
    this.getGoodsSKUSList({
      cateType,
      likeGoodsInfoNo,
      likeGoodsName,
      pageNum: 0,
      pageSize: 5,
      saleableFlag: 1,
      goodsAttributesValueRelVOList: paramsList
    });
  };
  inputNumberChange(e, key, max) {
    this.state.goodsLists[key].buyCount = e;
    this.setState({
      goodsLists: this.state.goodsLists
    });
  }
  //添加购物车
  async addCarts(row, index) {
    let total = (window as any).goodsCount[this.props.storeId];
    if (row.overCount === total || row.buyCount == row.stcok) {
      message.info('The stock ceiling has been reached');
      return;
    } else if (row.buyCount === 0) {
      message.info('please selected quantity');
      return;
    }
    this.setState({ loading: true });
    const { res } = await addGoodsIntoCarts(this.props.storeId, {
      customerId: this.props.customer.customerId,
      goodsInfoId: row.goodsInfoId,
      goodsInfoFlag: 0,
      goodsNum: row.buyCount
    });
    if (res.code === Const.SUCCESS_CODE) {
      message.success('Add successfully');
      this.props.searchCount()
      setTimeout(() => {
        this.setState({ loading: false });
      }, 2000);
    }
  }
  //选择checkbox
  onChangeCheckbox = (values, item) => {
    let _value = values.target.value
    const { cateType, likeGoodsInfoNo, likeGoodsName } = this.state;
    let _paramsObj = {}, checkboxValue = this.state.checkboxValue, _newValue = [];
    //查找是否存在一选择的项
    let _index = checkboxValue.findIndex(_ii => _ii === _value);
    // 存在则删除
    if (_index > -1) {
      checkboxValue.splice(_index, 1);
      _newValue = checkboxValue;
    } else {
      //去重
      _newValue = [...new Set([...checkboxValue, _value])];
    }
    //保存临时当前下拉框的所有数据
    _tempParam = [..._tempParam, item]
    //以对象方式存储存在的值
    _tempParam.map(it => {
      _paramsObj[it.id] = it;
    })
    //组装参数
    let _params = [];
    _newValue.map(val => {
      _params.push({
        attributeId: _paramsObj[val].attributeId,
        attributeValueId: _paramsObj[val].id
      })
    })

    this.setState({
      checkboxValue: _newValue,
      paramsList: _params
    }, () => {
      this.getGoodsSKUSList({
        cateType,
        likeGoodsInfoNo,
        likeGoodsName,
        pageNum: 0,
        pageSize: 5,
        saleableFlag: 1,
        goodsAttributesValueRelVOList: _params
      });
    })
  }
  //删除项
  handlerDeleteItem = (e, index, id) => {
    e.stopPropagation();
    let { cateType, likeGoodsInfoNo, likeGoodsName, selectedFilter, paramsList, checkboxValue } = this.state;
    //删除选中项
    selectedFilter.splice(index, 1);
    //查找参数数据是否已经存在
    let _index = paramsList.findIndex(item => item.attributeValueId === id)
     //查找checkbox id是否已经存在
    let _indexValue = checkboxValue.findIndex(item => item === id)

    //删除参数
    _index > -1 && paramsList.splice(_index, 1);
    //删除选中项
    _indexValue > -1 && checkboxValue.splice(_indexValue, 1);

    //组装选中参数
    let _params = selectedFilter.map(item => ({
      attributeId: item.attributeId,
      attributeValueId: item.id
    }))
    this.setState({
      selectedFilter,
      paramsList,
      checkboxValue
    }, () => {
      this.getGoodsSKUSList({
        cateType,
        likeGoodsInfoNo,
        likeGoodsName,
        pageNum: 0,
        pageSize: 5,
        saleableFlag: 1,
        goodsAttributesValueRelVOList: _params
      });
    })
  }
  //删除所有的filters
  removeFilter=()=>{
    let { cateType, likeGoodsInfoNo, likeGoodsName } = this.state;
    this.setState({
    checkboxValue: [],
    paramsList: []
    },()=>{
      this.getGoodsSKUSList({
        cateType,
        likeGoodsInfoNo,
        likeGoodsName,
        pageNum: 0,
        pageSize: 5,
        saleableFlag: 1,
        goodsAttributesValueRelVOList: []
      });
    })
  }

  handleVisibleChange = (flag, it) => {
    let index = this.state.filterList.findIndex(item => item.id === it.id);
    it.visibleDrop = flag;
    this.state.filterList[index] = it;
    this.setState({ filterList: this.state.filterList });
  }
  menu = (item, checkboxValue) => (
    <ul className="order-valet">
      {item.map(it => (<li key={it.id}><Checkbox checked={checkboxValue.includes(it.id)} onChange={(e) => this.onChangeCheckbox(e, it)} value={it.id}>{it.attributeDetailNameEn}</Checkbox></li>))}
    </ul>

  );
  render() {
    const { visible, handleOk, handleCancel, goodsCount, storeId, url } = this.props;
    const { cateType, filterList, selectedFilter, paramsList, checkboxValue, likeGoodsInfoNo, likeGoodsName, goodsLists, total, pageSize, currentPage, loading } = this.state;
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
        title: 'quantity',
        dataIndex: 'buyCount',
        key: 'buyCount',
        render: (text, record, index) => {
          let total = (window as any).goodsCount[storeId];// 每个国家配置的最大限购数量
          let overCount = goodsCount[record.goodsInfoId] || 0; //已添加到购物车的数量
          let max = 0
          if (record.stock <= total) {
            max = record.stock - overCount
          } else {
            max = total - overCount
          }
          record.overCount = overCount
          return (
            <InputNumber
              min={0}
              max={max}
              value={text}
              onChange={(e) => {
                this.inputNumberChange(e, index, max);
              }}
            />
          );
        }
      },

      {
        title: 'add',
        dataIndex: 'add',
        key: 'add',
        render: (text, row, index) => {
          return (<Badge count={row.overCount}><span onClick={() => this.addCarts(row, index)} style={{ color: 'red', paddingRight: 10, cursor: 'pointer', fontSize: 25 }} className="iconfont icongouwu"></span></Badge>);
        }
      }
    ];
    // 翻译title
    columns.forEach(obj => {
      (obj.title as any) = <FormattedMessage id={`Order.${obj.title}`} />
    });

    return (
      <Modal title={<FormattedMessage id="Order.Choose product" />} visible={visible} onOk={handleOk} width="70%" onCancel={handleCancel}>
        <Form className="filter-content" layout="inline">
          <Row>
            <Col span={20}>
              <FormItem label={<FormattedMessage id="Order.Product category" />}>
                <Radio.Group onChange={(e) => this.onChange(e, 'cateType')} value={cateType}>
                  <Radio value="Cat SPT">Cat SPT</Radio>
                  <Radio value="Dog SPT">Dog SPT</Radio>
                  <Radio value="Cat VET">Cat VET</Radio>
                  <Radio value="Dog VET">Dog VET</Radio>
                </Radio.Group>
              </FormItem>
            </Col>
            <Col span={4} style={{ textAlign: 'right' }}>
              <Button type="primary" shape="round">
                <a target="_blank" style={{ color: '#fff' }} href={url}>
                  <FormattedMessage id="Order.View all" />
                </a>
              </Button>
            </Col>
            <Col span={12}>
              <FormItem>
                <Input
                  addonBefore={
                    <p style={styles.label}>
                      <FormattedMessage id="product.SKU" />
                    </p>
                  }
                  value={likeGoodsInfoNo}
                  onChange={(e) => this.onChange(e, 'likeGoodsInfoNo')}
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem>
                <Input addonBefore={<p style={styles.label}><FormattedMessage id="Order.Product name" /></p>} value={likeGoodsName} onChange={(e) => this.onChange(e, 'likeGoodsName')} />
              </FormItem>
            </Col>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Button type="primary" icon="search" htmlType="submit" shape="round" style={{ textAlign: 'center' }} onClick={this.search}>
                <span>
                  <FormattedMessage id="Order.search" />
                </span>
              </Button>
            </Col>
          </Row>
        </Form>
        <Divider style={{ margin: '15px 0' }} />
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
         <span> Filter products:</span>
         <a onClick={this.removeFilter}>Remove all Filters</a>
          </div>
        <div style={{ display: 'flex', marginTop: 20, alignItems: "flex-start" }}>
          <p style={{marginTop:5}}>selected：</p>
          <div style={{ flex: 1, display: 'flex',flexWrap:'wrap' }}>
            {selectedFilter.map((item, index) => (<div className="selected-item" key={item.id}>
              {item.attributeDetailNameEn} <span style={{ marginLeft: 15 }} onClick={(e) => this.handlerDeleteItem(e, index, item.id)}><Icon type="close-circle" theme="filled" /></span>
            </div>))}

          </div>
        </div>


        <ul className="filter-list">
          {filterList.map(item => (<li style={{ width: '19%' ,marginTop:10}} key={item.id}>
            <Dropdown overlay={this.menu(item.attributesValueList || [], checkboxValue)}
              
              onVisibleChange={(e) => this.handleVisibleChange(e, item)}
              visible={item.visibleDrop}
            >
              <div className="menu-order-list" title={item.attributeNameEn}>
                <span className="flex-1 fitler-name">{item.attributeNameEn}</span> <Icon className="ml10" type="down" />
              </div>
            </Dropdown>
          </li>))}
        </ul>



        <div style={{ marginTop: 20 }}>
          <Table
            rowKey="goodsInfoId"
            loading={{ spinning: loading, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" /> }}
            pagination={false}
            dataSource={goodsLists}
            columns={columns}
          />
          {total > 0 ? (
            <Pagination
              current={currentPage}
              total={total}
              pageSize={pageSize}
              onChange={(pageNum, pageSize) => {
                console.log(pageNum, pageSize)
                this.getGoodsSKUSList({ cateType, likeGoodsInfoNo, likeGoodsName, pageNum: pageNum - 1, pageSize, saleableFlag: 1, goodsAttributesValueRelVOList: paramsList });
              }}
            />
          ) : null}
        </div>




      </Modal>
    );
  }
}

const styles = {
  label: {
    width: 150,
    textAlign: 'center'
  },
  wrapper: {
    width: 177
  },
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
