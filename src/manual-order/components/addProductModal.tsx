import { Button, Col, Form, Icon, Input, InputNumber, message, Modal, Pagination, Radio, Row, Table } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { Const } from 'qmkit';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { getGoodsSKUS, addGoodsIntoCarts } from '../webapi';
const defaultImg = require('./img/none.png');
interface IParams {
  cateType: string;
  likeGoodsInfoNo: string;
  keywords: string;
  pageNum: number;
  pageSize: number;
}

export default class AddProductModal extends Component {
  state = {
    cateType: '',
    likeGoodsInfoNo: '',
    keywords: '',
    goodsLists: [],
    currentPage: 1,
    total: 0,
    pageSize: 5,
    loading: false
  };
  props: {
    customerId: string;
    storeId: string;
    visible: boolean;
    handleOk: any;
    handleCancel: any;
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
  async getGoodsSKUSList(param: IParams) {
    this.setState({
      loading: true
    });
    const { res } = await getGoodsSKUS(param);
    const { goodsInfoPage } = res.context;
    this.setState(
      {
        total: goodsInfoPage.total,
        currentPage: goodsInfoPage?.number ?? 1,
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
    const { cateType, likeGoodsInfoNo, keywords } = this.state;
    this.getGoodsSKUSList({
      cateType,
      likeGoodsInfoNo,
      keywords,
      pageNum: 1,
      pageSize: 5
    });
  };
  inputNumberChange(e, key) {
    this.state.goodsLists[key].buyCount = e;
  }
  async addCarts(row) {
    if (row.buyCount === 0) {
      message.info('please selected quantity');
      return;
    }
    const { res } = await addGoodsIntoCarts(this.props.storeId, {
      customerId: this.props.customerId,
      goodsInfoId: row.goodsInfoId,
      goodsNum: row.buyCount
    });
    if (res.code === Const.SUCCESS_CODE) {
      message.success('add success');
    }
  }

  render() {
    const { visible, handleOk, handleCancel } = this.props;
    const { cateType, likeGoodsInfoNo, keywords, goodsLists, total, pageSize, currentPage, loading } = this.state;
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
          return (
            <InputNumber
              min={0}
              max={record.stock}
              defaultValue={text}
              onChange={(e) => {
                this.inputNumberChange(e, index);
              }}
            />
          );
        }
      },

      {
        title: 'Operation',
        dataIndex: 'Operation',
        key: 'Operation',
        render: (text, row) => {
          return <span onClick={() => this.addCarts(row)} style={{ color: 'red', paddingRight: 10, cursor: 'pointer', fontSize: 25 }} className="iconfont icongouwu"></span>;
        }
      }
    ];
    return (
      <Modal title="Choose product" visible={visible} onOk={handleOk} width="70%" onCancel={handleCancel}>
        <Form className="filter-content" layout="inline">
          <Row>
            <Col span={24}>
              <FormItem label="Product category">
                <Radio.Group onChange={(e) => this.onChange(e, 'cateType')} value={cateType}>
                  <Radio value="Cat SPT">Cat SPT</Radio>
                  <Radio value="Dog SPT">Dog SPT</Radio>
                </Radio.Group>
              </FormItem>
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
                <Input addonBefore={<p style={styles.label}>Product name</p>} value={keywords} onChange={(e) => this.onChange(e, 'keywords')} />
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
                this.getGoodsSKUSList({ cateType, likeGoodsInfoNo, keywords, pageNum: pageNum, pageSize });
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
