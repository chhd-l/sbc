import * as React from 'react';
import { Relax } from 'plume2';
import { DataGrid, noop, history, AuthWrapper, Const } from 'qmkit';
import { List } from 'immutable';
import { Menu, Modal, Dropdown, Icon, Tooltip } from 'antd';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { IList } from 'typings/globalType';
import { Table } from 'antd';

const Column = Table.Column;
const confirm = Modal.confirm;
const defaultImg = require('../img/none.png');
import { FormattedMessage, injectIntl } from 'react-intl';

@withRouter
@Relax
class CateList extends React.Component<any, any> {
  props: {
    intl?:any;
    relaxProps?: {
      loading: any;
      goodsPageContent: IList;
      goodsInfoList: IList;
      goodsInfoSpecDetails: IList;
      allCateList: IList;
      goodsBrandList: IList;
      onSelectChange: Function;
      onSpuDelete: Function;
      selectedSpuKeys: IList;
      total: number;
      onFormFieldChange: Function;
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
    onSpuDelete: noop,
    selectedSpuKeys: 'selectedSpuKeys',
    total: ['goodsPage', 'totalElements'],
    onFormFieldChange: noop,
    onPageSearch: noop,
    onShowSku: noop,
    pageNum: 'pageNum',
    expandedRowKeys: 'expandedRowKeys',
    loading: 'loading'
  };

  render() {
    const { goodsBrandList, goodsPageContent, selectedSpuKeys, onSelectChange, total, pageNum, expandedRowKeys, loading } = this.props.relaxProps;
    return (
      <DataGrid
        loading={{ spinning: loading, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" /> }}
        rowKey={(record) => record.goodsId}
        dataSource={goodsPageContent.toJS()}
        expandedRowRender={this._expandedRowRender}
        expandedRowKeys={expandedRowKeys.toJS()}
        onExpandedRowsChange={(record) => this._showSkuByIcon(record)}
        rowSelection={{
          selectedRowKeys: selectedSpuKeys.toJS(),
          onChange: (selectedRowKeys) => {
            onSelectChange(selectedRowKeys);
          },
          getCheckboxProps: (record) => ({
            disabled: record.auditStatus == 0 //待审核的不能删除
          })
        }}
        pagination={{ total, current: pageNum + 1, onChange: this._getData }}
      >
        <Column title={<FormattedMessage id="Product.image" />} dataIndex="goodsImg" key="goodsImg" render={(img) => (img ? <img src={img} style={styles.imgItem} /> : <img src={defaultImg} style={styles.imgItem} />)} />
        <Column title={<FormattedMessage id="Product.productName" />} dataIndex="goodsName" key="goodsName" className="nameBox" width={200} />
        <Column title={<FormattedMessage id="Product.SPU" />} dataIndex="goodsNo" key="goodsNo" />
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
          width={150}
          title={
            <span>
              <FormattedMessage id="product.marketPrice" />
              
              <FormattedMessage id="priceSettingMethod" />

            </span>
          }
          key="marketPrice"
          render={(rowInfo) => {
            const { marketPrice, priceType } = rowInfo;
            return (
              <div>
                <p style={styles.lineThrough}>{marketPrice == null ? 0.0 : marketPrice.toFixed(2)}</p>
                <p style={{ color: '#999' }}>{Const.priceType[priceType]}</p>
              </div>
            );
          }}
        />
        <Column title={<FormattedMessage id="Product.storeCategory" />} dataIndex="storeCateIds" key="storeCateIds" width={150} render={this._renderStoreCateList} />
        <Column
          title={<FormattedMessage id="Product.brand" />}
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
        <Column title={<FormattedMessage id="Product.approvalStatus" />} dataIndex="auditStatus" key="auditStatus" render={this._getAuditInfo} />
        <Column
          align="center"
          title={<FormattedMessage id="Product.operation" />}
          key="goodsId"
          className="operation-th"
          render={(rowInfo) => {
            if (rowInfo.auditStatus == 2 || rowInfo.auditStatus == 3) {
              return this._menu(rowInfo);
            } else {
              return (
                <div className="operation-th">
                  <AuthWrapper functionName="f_goods_detail_1">
                    <Link to={`/goods-detail/${rowInfo.goodsId}`}>
                      <FormattedMessage id="Product.View" />
                    </Link>
                  </AuthWrapper>
                </div>
              );
            }
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

  /**
   * 获取操作的菜单
   */
  _menu = (rowInfo) => {
    return (
      <div className="operation-box">
        <AuthWrapper functionName="f_goods_sku_edit">
          <a
            href="#"
            onClick={() =>
              history.push({
                pathname: `/goods-check-edit/${rowInfo.goodsId}`,
                state: { tab: 'main' }
              })
            }
          >
            <FormattedMessage id="Product.edit" />
          </a>
        </AuthWrapper>
        <AuthWrapper functionName="f_goods_sku_price">
          <a
            href="#"
            onClick={() =>
              history.push({
                pathname: `/goods-check-edit/${rowInfo.goodsId}`,
                state: { tab: 'price' }
              })
            }
          >
            <FormattedMessage id="Product.setPrice" />
          </a>
        </AuthWrapper>
        <AuthWrapper functionName="f_goods_del">
          <a
            href="#"
            onClick={() => {
              this._delete(rowInfo.goodsId);
            }}
          >
            <FormattedMessage id="Product.delete" />
          </a>
        </AuthWrapper>
      </div>
    );
  };

  /**
   * 删除
   */
  _delete = (goodsId: string) => {
    const { onSpuDelete } = this.props.relaxProps;
    const title = this.props.intl.formatMessage({id:'Product.Prompt'});
    const content = this.props.intl.formatMessage({id:'Product.DeleteConfirmTip'});
    confirm({
      title: title,
      content: content,
      onOk() {
        onSpuDelete([goodsId]);
      }
    });
  };

  /**
   * 获取审核区域展示信息
   */
  _getAuditInfo = (auditStatus, record) => {
    let auditStatusStr = '';
    if (auditStatus == 0) {
      auditStatusStr = '待审核';
    } else if (auditStatus == 1) {
      auditStatusStr = '审核通过';
    } else if (auditStatus == 2) {
      auditStatusStr = '审核未通过';
    } else if (auditStatus == 3) {
      auditStatusStr = 'No sale';
    }
    return (
      <div>
        <p>{auditStatusStr}</p>
        {(auditStatus == 2 || auditStatus == 3) && (
          <Tooltip placement="top" title={record.auditReason}>
            <a href="#">
              <FormattedMessage id="Product.reason" />
            </a>
          </Tooltip>
        )}
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
              {record.auditStatus == 2 || record.auditStatus == 3 ? (
                <div>
                  <AuthWrapper functionName="f_goods_sku_edit">
                    <a
                      href="#"
                      style={{
                        marginTop: 5,
                        marginRight: 5,
                        display: 'inline-block'
                      }}
                      onClick={() =>
                        history.push({
                          pathname: `/goods-sku-check-edit/${goods.get('goodsInfoId')}`,
                          state: { tab: 'main' }
                        })
                      }
                    >
                      <FormattedMessage id="Product.edit" />
                    </a>
                  </AuthWrapper>
                  <AuthWrapper functionName="f_goods_sku_price">
                    {record.saleType == 0 && record.priceType == 1 && record.allowPriceSet == 0 ? null : (
                      <a
                        href="#"
                        style={{ marginTop: 5, display: 'inline-block' }}
                        onClick={() =>
                          history.push({
                            pathname: `/goods-sku-check-edit/${goods.get('goodsInfoId')}`,
                            state: { tab: 'price' }
                          })
                        }
                      >
                        设价
                      </a>
                    )}
                  </AuthWrapper>
                </div>
              ) : (
                <div>
                  <AuthWrapper functionName="f_goods_detail_1">
                    <Link style={{ marginTop: 5, display: 'inline-block' }} to={`/goods-sku-detail/${goods.get('goodsInfoId')}`}>
                      查看
                    </Link>
                  </AuthWrapper>
                </div>
              )}
            </div>
            <div style={{ marginLeft: 0 }}>
              <div style={styles.cell}>
                <label style={styles.label}>
                  <FormattedMessage id="Product.Specification" />：
                </label>
                <span style={styles.textCon}>{currentGoodsSpecDetails ? currentGoodsSpecDetails : '-'}</span>
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>
                  <FormattedMessage id="Product.SKU" />：
                </label>
                {goods.get('goodsInfoNo')}
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>
                  <FormattedMessage id="Product.MarketPrice" />：
                </label>
                {goods.get('marketPrice') ? goods.get('marketPrice').toFixed(2) : '0.0'}
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>
                  <FormattedMessage id="Product.shelve" />：
                </label>
                {goods.get('addedFlag') == 0 ? '下架' : '上架'}
              </div>
            </div>
            <div>
              <div style={styles.cell}>
                <label style={styles.label}>
                  <FormattedMessage id="Product.BarCode" />：
                </label>
                {goods.get('goodsInfoBarcode') ? goods.get('goodsInfoBarcode') : '-'}
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>
                  <FormattedMessage id="Product.InStock" />：
                </label>
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
}

export default injectIntl(CateList);

const styles = {
  item: {
    float: 'left',
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
    margin: '10px 0'
  },
  cell: {
    color: '#999',
    width: 200,
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
    float: 'left',
    marginRight: 10,
    background: '#fff',
    borderRadius: 3
  },
  textCon: {
    width: 120
  }
} as any;
