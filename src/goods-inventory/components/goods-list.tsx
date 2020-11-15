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
        <Column title="SKU" dataIndex="SKU" key="SKU" />
        <Column title={<FormattedMessage id="product.SPU" />} dataIndex="goodsNo" key="goodsNo" />

        <Column
          title={
            <span>
              <FormattedMessage id="product.marketPrice" />
              <br />
              <FormattedMessage id="priceSettingMethod" />
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
                <p style={{ color: '#999' }}>{Const.priceType[priceType]}</p>
              </div>
            );
          }}
        />
        <Column
          // title="店铺分类"
          title="Sale product"
          dataIndex="Sale"
          key="Sale"
          render={this._renderStoreCateList}
        />
        <Column
          // title="店铺分类"
          title={<FormattedMessage id="product.storeCategory" />}
          dataIndex="storeCateIds"
          key="storeCateIds"
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
        <Column title="Inventory" dataIndex="Inventory" key="Inventory" render={(rowInfo) => {}} />
        <Column align="center" title="" width={0} />
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