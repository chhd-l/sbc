import * as React from 'react';
import { fromJS, Set } from 'immutable';

import { Const, DataGrid, cache, RCi18n } from 'qmkit';

import SearchForm from './search-form';
import * as webapi from './webapi';
import { Table } from 'antd';
import 'index.less'


const Column = Table.Column;

/**
 * 商品添加
 */
export default class GoodsGrid extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      selectedRows: props.selectedRows
        ? props.selectedRows
        : fromJS([]),
      selectedRowKeys: props.selectedSkuIds
        ? props.selectedSkuIds
        : [],
      total: 0,
      goodsInfoPage: {},
      searchParams: props.searchParams? props.searchParams : {},
      showValidGood: props.showValidGood
    };
  }

  componentDidMount() {
    this.init(this.props.searchParams? this.props.searchParams : {});
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      this.setState({
        searchParams: nextProps.searchParams?nextProps.searchParams:{}
      });
      this.init(nextProps.searchParams?nextProps.searchParams:{});
    }
    this.setState({
      selectedRows: nextProps.selectedRows
        ? nextProps.selectedRows
        : fromJS([]),
      selectedRowKeys: nextProps.selectedSkuIds ? nextProps.selectedSkuIds : []
    });
  }

  render() {
    const {
      loading,
      goodsInfoPage,
      selectedRowKeys,
      selectedRows,
      showValidGood
    } = this.state;
    const { rowChangeBackFun, visible } = this.props;
    return (
      <div className="content">
        {/*search*/}
        <SearchForm searchBackFun={this.searchBackFun} visible={visible} />

        <DataGrid
          loading={loading}
          rowKey={(record) => record.goodsInfoId}
          dataSource={goodsInfoPage.content}
          isScroll={false}
          pagination={{
            total: goodsInfoPage.totalElements,
            current: goodsInfoPage.number + 1,
            pageSize: goodsInfoPage.size,
            onChange: (pageNum, pageSize) => {
              const param = {
                pageNum: --pageNum,
                pageSize: pageSize
              };
              this._pageSearch(param);
            }
          }}
          rowSelection={{
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedRowKeys: any[], selectedTableRows: any[]) => {
              const sRows = fromJS(selectedRows).filter((f) => f);
              let rows = (sRows.isEmpty() ? Set([]) : sRows.toSet())
                .concat(fromJS(selectedTableRows).toSet())
                .toList();
              rows = selectedRowKeys
                .map((key) =>
                  rows.filter((row) => row.get('goodsInfoId') == key).first()
                )
                .filter((f) => f);
              this.setState({
                selectedRows: rows,
                selectedRowKeys
              });
              rowChangeBackFun(selectedRowKeys, fromJS(rows));
            },
            getCheckboxProps: (record) => ({
              /* old: 如果validFlag === 0 标识该商品不是有效的商品,可能存在情况是=>无货,起订量大于库存etc..
                      该情况下商品checkbox置灰,禁止选中 */

              // 以上两行注释是老的逻辑, 新的逻辑需要把状态为无货的商品给放开
              // goodsStatus 的状态为: 商品状态 0：正常 1：缺货 2：失效
              // 因此判断等于2的失效状态下禁用
              disabled: showValidGood
                ? !showValidGood
                : record.goodsStatus === 2
            })
          }}
        >
           <Column
            title={RCi18n({id:'Prescriber.Product Name'})}
            dataIndex="goodsInfoName"
            key="goodsInfoName"
            width="15%"
          />
          <Column
            title={RCi18n({id:'Prescriber.SPU'})}
            dataIndex="goods.goodsNo"
            key="goodsNo"
            width="20%"
            //ellipsis
          />
          <Column
            title={RCi18n({id:'Prescriber.SKU'})}
            dataIndex="goodsInfoNo"
            key="goodsInfoNo"
            width="20%"
            //ellipsis
          />

          <Column
            title={RCi18n({id:'Prescriber.Product category'})}
            dataIndex="goods.cateName"
            key="goods.cateName"
            width="20%"
            // ellipsis
           
          />
          <Column title={RCi18n({id:'Prescriber.Sales category'})} key="goods.brandName" dataIndex="goods.brandName" />

          <Column title={RCi18n({id:'Prescriber.Price'})} key="marketPrice" dataIndex="marketPrice"  
           render={(data) => {
              return data ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + data : sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)+ '0.00';
            }}/>


          {/* <Column
            title="SKU Code"
            dataIndex="goodsInfoNo"
            key="goodsInfoNo"
            width="15%"
          />

          <Column
            title="Product Name"
            dataIndex="goodsInfoName"
            key="goodsInfoName"
            width="20%"
            ellipsis
          />

          <Column
            title="Specification"
            dataIndex="specText"
            key="specText"
            width="20%"
            ellipsis
            render={(value) => {
              if (value) {
                return value;
              } else {
                return '-';
              }
            }}
          />

          <Column title="Product category" key="goodsCate" dataIndex="goods.cateName"  width="15%"
          />

          <Column
            title="Brand"
            key="goodsBrand"
            dataIndex="goods.brandName"
            render={(value) => {
              if (value) {
                return value;
              } else {
                return '-';
              }
            }}
          />

          <Column
            title="Price"
            key="marketPrice"
            dataIndex="marketPrice"
            render={(data) => {
              return data ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + data : sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)+ '0.00';
            }}
          /> */}
        </DataGrid>
      </div>
    );
  }

  _pageSearch = ({ pageNum, pageSize }) => {
    const params = this.state.searchParams;
    this.init({ ...params, pageNum, pageSize });
    this.setState({
      pageNum,
      pageSize,
    });
  };

  init = async (params) => {
    if (!params.pageNum) {
      params.pageNum = 0;
    }
    if (!params.pageSize) {
      params.pageSize = 10;
    }
   // params.subscriptionFlag = sessionStorage.getItem('PromotionTypeValue') == '1' ? true : false
    this.setState({loading: true});
    let { res } = await webapi.fetchGoodsListSku({ ...params });

    if ((res as any).code == Const.SUCCESS_CODE) {
      res = (res as any).context;
      // res['goodsInfoPage'].content.map((goodInfo) => {
      //   const cId = fromJS(res['goodses'])
      //     .find((s) => s.get('goodsId') === goodInfo.goodsId)
      //     .get('cateId');
      //   const cate = fromJS(res['cates']).find((s) => s.get('cateId') === cId);
      //   goodInfo['cateName'] = cate ? cate.get('cateName') : '';

      //   const bId = fromJS(res['goodses'])
      //     .find((s) => s.get('goodsId') === goodInfo.goodsId)
      //     .get('brandId');
      //   const brand =
      //     res['brands'] == null
      //       ? ''
      //       : fromJS(res['brands']).find((s) => s.get('brandId') === bId);
      //   goodInfo['brandName'] = brand ? brand.get('brandName') : '';

      //   return goodInfo;
      // });

      this.setState({
        goodsInfoPage: res['goodsInfoPage'],
        loading: false
      });
    }
  };

  /**
   * 搜索条件点击搜索的回调事件
   * @param searchParams
   */
  searchBackFun = (searchParams) => {
    if (this.props.searchParams){
      searchParams = {...searchParams, ...this.props.searchParams};
    }
    this.setState({ searchParams: searchParams });
    this.init(searchParams);
  };
}
