import { Badge, Button, Col, Form, Icon, Input, InputNumber, message, Modal, Pagination, Radio, Row, Table } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { Const } from 'qmkit';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { getGoodsSKUS, addGoodsIntoCarts } from '../webapi';
const defaultImg = require('./img/none.png');

interface IParams {
  cateType: string;
  likeGoodsInfoNo: string;
  keyword: string;
  pageNum: number;
  pageSize: number;
  saleableFlag: number,

}

export default class AddProductModal extends Component {
  state = {
    cateType: '',
    likeGoodsInfoNo: '',
    keyword: '',
    goodsLists: [],
    currentPage: 0,
    total: 0,
    pageSize: 5,
    loading: false
  };
  props: {
    customer: any;
    storeId: string;
    visible: boolean;
    handleOk: any;
    handleCancel: any;
    goodsCount?: any
    searchCount?:Function
    url:string,
    prefix:string
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
   getGoodsSKUSList=async(param: IParams) =>{
    this.setState({
      loading: true
    });
    const { res } = await getGoodsSKUS(param);
    const { goodsInfoPage } = res.context;
    this.setState(
      {
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
    const { cateType, likeGoodsInfoNo, keyword } = this.state;
    this.getGoodsSKUSList({
      cateType,
      likeGoodsInfoNo,
      keyword,
      pageNum: 0,
      pageSize: 5,
      saleableFlag: 1
    });
  };
  inputNumberChange(e, key,max) {
    this.state.goodsLists[key].buyCount = e;
    this.setState({
      goodsLists: this.state.goodsLists
    });
  }
  async addCarts(row,index) {
    let total = (window as any).goodsCount[this.props.storeId];
     if(row.overCount===total||row.buyCount==row.stcok){
      message.info('The stock ceiling has been reached');
      return;
    }else if (row.buyCount === 0) {
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
      row.overCount+=row.buyCount
        // this.state.goodsLists[index]=row
       this.props.searchCount()
        
      this.setState({ 
        loading: false ,
        //goodsLists:this.state.goodsLists
      });
    }
  }

  render() {
    const { visible, handleOk, handleCancel, goodsCount, storeId,url,prefix} = this.props;
    const { cateType, likeGoodsInfoNo, keyword, goodsLists, total, pageSize, currentPage, loading } = this.state;
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
          if(record.stock <= total){
            max=record.stock-overCount
          }else{
            max=total-overCount
          }
          record.overCount=overCount
          return (
            <InputNumber
              min={0}
              max={max}
              value={text}
              onChange={(e) => {
                this.inputNumberChange(e, index,max);
              }}
            />
          );
        }
      },

      {
        title: 'add',
        dataIndex: 'add',
        key: 'add',
        render: (text, row,index) => {
          return (<Badge count={row.overCount}><span onClick={() => this.addCarts(row,index)} style={{ color: 'red', paddingRight: 10, cursor: 'pointer', fontSize: 25 }} className="iconfont icongouwu"></span></Badge>);
        }
      }
    ];
    return (
      <Modal title="Choose product" visible={visible} onOk={handleOk} width="70%" onCancel={handleCancel}>
        <Form className="filter-content" layout="inline">
          <Row>
            <Col span={20}>
              <FormItem label="Product category">
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
                <a target="_blank" style={{ color: '#fff' }} href={url+prefix}>
                  View all
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
                <Input addonBefore={<p style={styles.label}>Product name</p>} value={keyword} onChange={(e) => this.onChange(e, 'keyword')} />
              </FormItem>
            </Col>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Button type="primary" icon="search" htmlType="submit" shape="round" style={{ textAlign: 'center' }} onClick={this.search}>
                <span>
                  <FormattedMessage id="search" />
                </span>
              </Button>
            </Col>
          </Row>
        </Form>

        <div>
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
                this.getGoodsSKUSList({ cateType, likeGoodsInfoNo, keyword, pageNum: pageNum - 1, pageSize, saleableFlag: 1 });
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
