import * as React from 'react';
import { fromJS, Set } from 'immutable';

import { Const, DataGrid } from 'qmkit';

//import SearchForm from './search-form';
import * as webapi from '../webapi';
import { Select, Table } from 'antd';
const { Option } = Select;

const Column = Table.Column;

/**
 * 商品添加
 */
export default class GoodsGrid extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      selectedRows: props.selectedRows ? props.selectedRows : fromJS([]),
      selectedRowKeys: props.selectedSkuIds ? props.selectedSkuIds : [],
      total: 0,
      goodsInfoPage: [],
      searchParams: props.searchParams ? props.searchParams : {},
      showValidGood: props.showValidGood
    };
  }

  componentDidMount() {
    this.init(this.props.searchParams ? this.props.searchParams : {});
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      this.setState({
        searchParams: nextProps.searchParams ? nextProps.searchParams : {}
      });
      this.init(nextProps.searchParams ? nextProps.searchParams : {});
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
        <DataGrid
          loading={{ spinning: loading, indicator:<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px',height: '90px' }} alt="" /> }}
          rowKey={(record) => record.goodsInfoId}
          dataSource={goodsInfoPage}
          isScroll={false}
          pagination={false}
          // pagination={{
          //   total: goodsInfoPage.totalElements,
          //   current: goodsInfoPage.number + 1,
          //   pageSize: goodsInfoPage.size,
          //   onChange: (pageNum, pageSize) => {
          //     const param = {
          //       pageNum: --pageNum,
          //       pageSize: pageSize
          //     };
          //     this._pageSearch(param);
          //   }
          // }}
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
            title="Product Name"
            dataIndex="goodsInfoName"
            key="goodsInfoName"
            width="15%"
          />
          <Column
            title="SPU"
            dataIndex="goods.goodsNo"
            key="goods.goodsNo"
            width="20%"
            //ellipsis
          />
          <Column
            title="SKU"
            dataIndex="goodsInfoNo"
            key="goodsInfoNo"
            width="20%"
            //ellipsis
          />

          <Column
            title="Product category"
            dataIndex="Signed"
            key="Signed"
            width="20%"
            ellipsis
            render={(value) => <span>{value?.goods?.goodsCateName??'-'}</span>}
          />
          <Column title="Sales category" key="salesCategory" dataIndex="salesCategory" />

          <Column title="Price" key="marketPrice" dataIndex="marketPrice" />

          
        </DataGrid>
      </div>
    );
  }

  _pageSearch = ({ pageNum, pageSize }) => {
    const params = this.state.searchParams;
    this.init({ ...params, pageNum, pageSize });
    this.setState({
      pageNum,
      pageSize
    });
  };

  init = async (params) => {
    if (!params.pageNum) {
      params.pageNum = 0;
    }
    if (!params.pageSize) {
      params.pageSize = 10;
    }
    params.subscriptionFlag =
      sessionStorage.getItem('PromotionTypeValue') == '1' ? true : false;

    let { res } = await webapi.fetchproductTooltip({ ...params });

    if ((res as any).code == Const.SUCCESS_CODE) {
      let goodsInfoList = (res as any).context.goodsInfoList;
      /*res['goodsInfoPage'].content.map((goodInfo) => {
        const cId = fromJS(res['goodses'])
          .find((s) => s.get('goodsId') === goodInfo.goodsId)
          .get('cateId');
        const cate = fromJS(res['cates']).find((s) => s.get('cateId') === cId);
        goodInfo['cateName'] = cate ? cate.get('cateName') : '';

        const bId = fromJS(res['goodses'])
          .find((s) => s.get('goodsId') === goodInfo.goodsId)
          .get('brandId');
        const brand =
          res['brands'] == null
            ? ''
            : fromJS(res['brands']).find((s) => s.get('brandId') === bId);
        goodInfo['brandName'] = brand ? brand.get('brandName') : '';

        return goodInfo;
      });*/

      this.setState({
        goodsInfoPage: goodsInfoList,
        loading: false
      });
    }
  };

  /**
   * 搜索条件点击搜索的回调事件
   * @param searchParams
   */
  searchBackFun = (searchParams) => {
    if (this.props.searchParams) {
      searchParams = { ...searchParams, ...this.props.searchParams };
    }
    this.setState({ searchParams: searchParams });
    this.init(searchParams);
  };
}
