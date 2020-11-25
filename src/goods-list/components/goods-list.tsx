import * as React from 'react';
import { Relax } from 'plume2';
import { DataGrid, noop, history, AuthWrapper, Const, cache, checkAuth } from 'qmkit';
import { List, fromJS } from 'immutable';
import { Menu, Dropdown, Icon, Modal, Tooltip } from 'antd';
import { withRouter } from 'react-router';
import { IList } from 'typings/globalType';
import { Table } from 'antd';

const Column = Table.Column;
const confirm = Modal.confirm;
const defaultImg = require('../img/none.png');
import { FormattedMessage } from 'react-intl';
import './goods-list.css';

@withRouter
@Relax
export default class CateList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      goodsPageContent: IList;
      goodsInfoList: IList;
      goodsInfoSpecDetails: IList;
      allCateList: IList;
      goodsBrandList: IList;
      onSelectChange: Function;
      spuDelete: Function;
      spuOnSale: Function;
      spuOffSale: Function;
      selectedSpuKeys: IList;
      total: number;
      onFormFieldChange: Function;
      onSearch: Function;
      onPageSearch: Function;
      onShowSku: Function;
      pageNum: number;
      expandedRowKeys: IList;
    };
  };

  static relaxProps = {
    goodsPageContent: ['goodsPage', 'content'],
    goodsInfoList: 'goodsInfoList',
    goodsInfoSpecDetails: 'goodsInfoSpecDetails',
    allCateList: 'allCateList',
    goodsBrandList: 'goodsBrandList',
    onSelectChange: noop,
    spuDelete: noop,
    spuOnSale: noop,
    spuOffSale: noop,
    selectedSpuKeys: 'selectedSpuKeys',
    total: ['goodsPage', 'totalElements'],
    onFormFieldChange: noop,
    onSearch: noop,
    onPageSearch: noop,
    onShowSku: noop,
    pageNum: 'pageNum',
    expandedRowKeys: 'expandedRowKeys'
  };

  render() {
    const { goodsBrandList, goodsPageContent, selectedSpuKeys, onSelectChange, total, pageNum, expandedRowKeys, onShowSku } = this.props.relaxProps;

    let hasMenu = false;
    if (checkAuth('f_goods_sku_edit_2') || checkAuth('f_goods_sku_edit_3') || checkAuth('f_goods_up_down') || checkAuth('f_goods_6')) {
      hasMenu = true;
    }
    return (
      <DataGrid
        rowKey={(record) => record.goodsId}
        dataSource={goodsPageContent.toJS()}
        // expandedRowRender={this._expandedRowRender}
        // expandedRowKeys={expandedRowKeys.toJS()}
        // onExpand={(expanded, record) => {
        //   let keys = fromJS([]);
        //   if (expanded) {
        //     keys = expandedRowKeys.push(record.goodsId);
        //   } else {
        //     keys = expandedRowKeys.filter((key) => key != record.goodsId);
        //   }
        //   onShowSku(keys);
        // }}
        rowSelection={{
          selectedRowKeys: selectedSpuKeys.toJS(),
          onChange: (selectedRowKeys) => {
            onSelectChange(selectedRowKeys);
          }
        }}
        pagination={{ total, current: pageNum + 1, onChange: this._getData }}
      >
        <Column title={<FormattedMessage id="product.image" />} dataIndex="goodsImg" key="goodsImg" render={(img) => (img ? <img src={img} style={styles.imgItem} /> : <img src={defaultImg} style={styles.imgItem} />)} />
        <Column
          // title="商品名称"
          title={<FormattedMessage id="product.productName" />}
          dataIndex="goodsName"
          key="goodsName"
          className="nameBox"
          width={160}
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
        <Column title={<FormattedMessage id="product.SPU" />} dataIndex="goodsNo" key="goodsNo" />
        {/* <Column
          title="销售类型"
          key="saleType"
          render={(rowInfo) => {
            const { saleType } = rowInfo;
            return (
              <div>
                <p style={styles.lineThrough}>
                  {saleType == 0 ? '批发' : '零售'}
                </p>
              </div>
            );
          }}
        /> */}
        <Column
          title={
            <span>
              <FormattedMessage id="product.marketPrice" />
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
              </div>
            );
          }}
        />
        <Column
          // title="店铺分类"
          title={<FormattedMessage id="product.productCategory" />}
          dataIndex="storeCateIds"
          key="storeCateIds"
          width={100}
          render={this._renderStoreCateList}
        />
        <Column
          // title="品牌"
          title={<FormattedMessage id="product.brand" />}
          dataIndex="brandId"
          key="brandId"
          render={(rowInfo) => {
            return (
              goodsBrandList
                .filter((v) => {
                  return v.get('brandId') == rowInfo;
                })
                .getIn([0, 'brandName']) || '-'
            );
          }}
        />
        <Column
          title={<FormattedMessage id="product.onOrOffShelves" />}
          dataIndex="addedFlag"
          key="addedFlag"
          render={(rowInfo) => {
            if (rowInfo == 0) {
              return <FormattedMessage id="product.offShelves" />;
            }
            if (rowInfo == 2) {
              return <FormattedMessage id="product.partialOnShelves" />;
            }
            return <FormattedMessage id="product.onShelves" />;
          }}
        />
        <Column
          align="center"
          title={<FormattedMessage id="operation" />}
          key="goodsId"
          className="operation-th"
          render={(rowInfo) => {
            return hasMenu ? this._menu(rowInfo) : '-';
          }}
        />
      </DataGrid>
    );
  }

  /**
   * 渲染多个店铺分类
   */
  _renderStoreCateList = (rowInfo) => {
    const { allCateList } = this.props.relaxProps;
    if (rowInfo && rowInfo.length) {
      const strInfo = rowInfo.map((info) => allCateList.filter((v) => v.get('storeCateId') == info).getIn([0, 'cateName'])).join(',');
      if (strInfo.length > 20) {
        return (
          <Tooltip placement="top" title={strInfo}>
            {strInfo.substr(0, 20)}...
          </Tooltip>
        );
      } else {
        return (
          <Tooltip placement="top" title={strInfo}>
            {strInfo}
          </Tooltip>
        );
      }
    }
    return '-';
  };

  _menu = (rowInfo) => {
    const { spuOnSale, spuOffSale } = this.props.relaxProps;
    return (
      <div className="operation-box">
        <AuthWrapper functionName="f_goods_sku_edit_2">
          <Tooltip placement="top" title="Edit">
            {rowInfo.goodsType != 2 ? (
              <a
                href="#!"
                onClick={() =>
                  history.push({
                    pathname: `/goods-regular-edit/${rowInfo.goodsId}`,
                    state: { tab: 'main', goodsType: 'edit' }
                  })
                }
                style={{ marginRight: 5 }}
              >
                <span className="icon iconfont iconEdit" style={{ fontSize: 20 }}></span>
                {/* <FormattedMessage id="edit" /> */}
              </a>
            ) : (
              <a
                href="#!"
                onClick={() =>
                  history.push({
                    pathname: `/goods-bundle-edit/${rowInfo.goodsId}`,
                    state: { tab: 'main', goodsType: 'edit' }
                  })
                }
                style={{ marginRight: 5 }}
              >
                <span className="icon iconfont iconEdit" style={{ fontSize: 20 }}></span>
                {/* <FormattedMessage id="edit" /> */}
              </a>
            )}
          </Tooltip>
        </AuthWrapper>
        {/* <AuthWrapper functionName="f_goods_sku_edit_3">
          <a
            href="#!"
            onClick={() =>
              history.push({
                pathname: `/goods-edit/${rowInfo.goodsId}`,
                state: { tab: 'price' }
              })
            }
          >
            <FormattedMessage id="product.setPrice" />
          </a>
        </AuthWrapper> */}
        {rowInfo.addedFlag == 0 || rowInfo.addedFlag == 2 ? (
          <AuthWrapper functionName="f_goods_up_down">
            <Tooltip placement="top" title="On Shelves">
              <a
                href="#!"
                onClick={() => {
                  spuOnSale([rowInfo.goodsId]);
                }}
                style={{ marginRight: 5 }}
              >
                <span className="icon iconfont iconOnShelves" style={{ fontSize: 20 }}></span>
              </a>
            </Tooltip>
          </AuthWrapper>
        ) : null}
        {rowInfo.addedFlag == 1 || rowInfo.addedFlag == 2 ? (
          <AuthWrapper functionName="f_goods_up_down">
            <Tooltip placement="top" title="Off Shelves">
              <a
                href="#!"
                onClick={() => {
                  spuOffSale([rowInfo.goodsId]);
                }}
                style={{ marginRight: 5 }}
              >
                <span className="icon iconfont iconOffShelves" style={{ fontSize: 20 }}></span>
              </a>
            </Tooltip>
          </AuthWrapper>
        ) : null}
        <AuthWrapper functionName="f_goods_6">
          <Tooltip placement="top" title="Delete">
            <a
              href="#!"
              onClick={() => {
                this._delete(rowInfo.goodsId);
              }}
              style={{ marginRight: 5 }}
            >
              <span className="icon iconfont iconDelete" style={{ fontSize: 20 }}></span>
            </a>
          </Tooltip>
        </AuthWrapper>
      </div>
    );
  };

  _expandedRowRender = (record, index) => {
    const { goodsInfoList, goodsInfoSpecDetails } = this.props.relaxProps;

    const currentGoods = goodsInfoList.filter((v) => {
      return record.goodsInfoIds.indexOf(v.get('goodsInfoId')) != -1;
    });

    return currentGoods
      .map((goods, i) => {
        const currentGoodsSpecDetails = goodsInfoSpecDetails
          .filter((v) => goods.get('specDetailRelIds').indexOf(v.get('specDetailRelId')) != -1)
          .map((v) => {
            return v.get('detailName');
          })
          .join(' ');

        return (
          <div key={`${index}_${i}`} style={styles.item}>
            <div style={{ marginLeft: 17 }}>
              <img src={goods.get('goodsInfoImg') ? goods.get('goodsInfoImg') : defaultImg} style={styles.imgItem} />
              <AuthWrapper functionName="f_goods_sku_edit_2">
                <a
                  href="#!"
                  style={{
                    marginTop: 5,
                    marginRight: 5,
                    display: 'inline-block'
                  }}
                  onClick={() =>
                    history.push({
                      pathname: `/goods-sku-edit/${goods.get('goodsInfoId')}`,
                      state: { tab: 'main' }
                    })
                  }
                >
                  <FormattedMessage id="edit" />
                </a>
              </AuthWrapper>
              <AuthWrapper functionName="f_goods_sku_edit_3">
                {record.priceType === 1 && !record.allowPriceSet ? null : (
                  <a
                    href="#!"
                    style={{ marginTop: 5, display: 'inline-block' }}
                    onClick={() =>
                      history.push({
                        pathname: `/goods-sku-edit/${goods.get('goodsInfoId')}`,
                        state: { tab: 'price' }
                      })
                    }
                  >
                    <FormattedMessage id="product.setPrice" />
                  </a>
                )}
              </AuthWrapper>
            </div>
            <div style={{ marginLeft: 0 }}>
              <div style={styles.cell}>
                <label style={styles.label}>Specification：</label>
                <span className="specification" style={styles.textCon}>
                  {currentGoodsSpecDetails ? currentGoodsSpecDetails : '-'}
                </span>
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>SKU code：</label>
                {goods.get('goodsInfoNo')}
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>Market price：</label>
                {goods.get('marketPrice') || goods.get('marketPrice') === 0 ? goods.get('marketPrice').toFixed(2) : 0}
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>On/Off shelve：</label>
                {goods.get('addedFlag') == 0 ? 'Off shelf' : 'On shelf'}
              </div>
            </div>
            <div>
              <div style={styles.cell}>
                <label style={styles.label}>Bar code：</label>
                {goods.get('goodsInfoBarcode') ? goods.get('goodsInfoBarcode') : '-'}
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>In stock：</label>
                {goods.get('stock')}
              </div>
            </div>
          </div>
        );
      })
      .toJS();
  };

  //通过图标点击显示SKU
  _showSkuByIcon = (index) => {
    const { onShowSku } = this.props.relaxProps;
    let goodsIds = List();
    if (index != null && index.length > 0) {
      index.forEach((value, key) => {
        goodsIds = goodsIds.set(key, value);
      });
    }
    onShowSku(goodsIds);
  };

  _getData = (pageNum, pageSize) => {
    const { onFormFieldChange, onPageSearch } = this.props.relaxProps;
    onFormFieldChange({ key: 'pageNum', value: --pageNum });
    onFormFieldChange({ key: 'pageSize', value: pageSize });
    onPageSearch();
  };

  /**
   * 删除
   */
  _delete = (goodsId: string) => {
    const { spuDelete } = this.props.relaxProps;
    confirm({
      title: 'Prompt',
      content: 'Are you sure you want to delete this product?',
      onOk() {
        spuDelete([goodsId]);
      }
    });
  };
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
    background: '#fff'
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
