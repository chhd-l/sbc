import * as React from 'react';
import { fromJS, Set } from 'immutable';

import { Const, DataGrid } from 'qmkit';

import RelatedForm from './related-form';
import * as webapi from '../webapi';
import { Select, Table } from 'antd';
//import { Relax } from 'plume2';

//const { Option } = Select;

const Column = Table.Column;
let recommendationNumber = 1;
/**
 * 商品添加
 */

//@Relax
export default class ProductGridSKU extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      selectedRows: props.selectedRows ? props.selectedRows : fromJS([]),
      selectedRowKeys: props.selectedSkuIds ? props.selectedSkuIds : [],
      total: 0,
      goodsInfoPage: {},
      searchParams: props.searchParams ? props.searchParams : {},
      showValidGood: props.showValidGood,
      content: []
    };
  }

  /* props: {
    relaxProps?: {
      productTooltip: any;
    };
  };

  static relaxProps = {
    productTooltip: 'productTooltip',
  };
*/
  componentDidMount() {
    this.init(this.props.searchParams ? this.props.searchParams : {});
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      this.setState({
        searchParams: nextProps.searchParams ? nextProps.searchParams : {},
        goodsInfoPage: nextProps.productTooltip
      });
      this.init(nextProps.searchParams ? nextProps.searchParams : {});
    }
    this.setState({
      selectedRows: nextProps.selectedRows ? nextProps.selectedRows : fromJS([]),
      selectedRowKeys: nextProps.selectedSkuIds ? nextProps.selectedSkuIds : []
    });
  }

  render() {
    const { loading, goodsInfoPage, selectedRowKeys, selectedRows, showValidGood } = this.state;
    const { rowChangeBackFun } = this.props;

    return (
      <div className="content">
        <RelatedForm form={this.props.form} searchBackFun={(res) => this.searchBackFun(res)} sku={true}/>
        <DataGrid
          loading={loading}
          rowKey={(record, index) => record.goodsInfoNo + index}
          dataSource={goodsInfoPage.content && goodsInfoPage.content}
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
              let rows = (sRows.isEmpty() ? Set([]) : sRows.toSet()).concat(fromJS(selectedTableRows).toSet()).toList();
              let rowsArr = [];
              rows.toJS().map((item) => {
                rowsArr.push(item.goodsInfoNo);
              });
              //rows = selectedRowKeys.map((key) => {rows.filter((row) => row.get('goodsId') == key).first()}).filter((f) => f);
              this.setState({
                selectedRows: rowsArr,
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
              disabled: showValidGood ? !showValidGood : record.goodsStatus === 2
            })
          }}
        >
          <Column
            title="Image"
            dataIndex="goodsInfoImg"
            key="goodsInfoImg"
            render={(rowInfo, i) => {
              if (i) {
                return <img src={i.goodsInfoImg} width="20" />;
              } else {
                return '-';
              }
            }}
          />
          <Column title="SKU" dataIndex="goodsInfoNo" key="goodsInfoNo" />
          <Column title="Product name" dataIndex="goodsInfoName" key="goodsInfoName" width="200px"/>
          <Column title="Sales category" key="storeCateName" dataIndex="storeCateName" />
          <Column title="Specification" dataIndex="specName" key="specName" />
          <Column title="Product category" dataIndex="goodsCateName" key="goodsCateName" />
          <Column title="Brand" key="brandName" dataIndex="brandName" />
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
    // params.goodsName = "Baby"

    let { res } = await webapi.fetchlistGoodsInfo({ ...params });

    if ((res as any).code == Const.SUCCESS_CODE) {
      res = (res as any).context.goodsInfos;
      let arr = res.content;
      let a = arr;
      let b = this.state.selectedRows.toJS();
      b.reduce((pre, cur) => {
        let target = pre.find((ee) => ee.goodsInfoId == cur.goodsInfoId);
        if (target) {
          Object.assign(target, cur);
        } else {
          pre.concat(arr);
        }
        return pre;
      }, a);

      this.setState({
        goodsInfoPage: res,
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
