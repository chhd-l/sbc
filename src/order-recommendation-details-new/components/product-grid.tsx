import * as React from 'react';
import { fromJS, Set } from 'immutable';

import { Const, DataGrid, SelectGroup } from 'qmkit';

//import SearchForm from './search-form';
import * as webapi from '../webapi';
import { Select, Table } from 'antd';
const { Option } = Select;

const Column = Table.Column;
let recommendationNumber = 1;
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
      goodsInfoPage: {},
      searchParams: props.searchParams ? props.searchParams : {},
      showValidGood: props.showValidGood,
      content: []
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

  /*static getDerivedStateFromProps(nextProps, prevState) {
    console.log(nextProps.selectedRows.toJS(),1111122);
    const { visible } = nextProps;
    // 当传入的type发生变化的时候，更新state
    if (visible !== prevState.visible) {
      return {
        visible
      };
    }
    // 否则，对于state不进行任何操作
    return null;
  }*/

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
            title="Product Name"
            dataIndex="goodsInfoName"
            key="goodsInfoName"
            width="15%"
          />

          <Column
            title="SKU"
            dataIndex="goodsInfoNo"
            key="goodsInfoNo"
            width="20%"
            //ellipsis
          />

          <Column
            title="Signed classification"
            dataIndex="Signed"
            key="Signed"
            width="20%"
            ellipsis
            render={(value) => {
              if (value) {
                return <span>{value.goods.goodsCateName}</span>;
              } else {
                return '-';
              }
            }}
          />

          <Column title="Price" key="marketPrice" dataIndex="marketPrice" />

          <Column
            title="Quantity"
            key="recommendationNumber"
            dataIndex="recommendationNumber"
            render={(value, i, e) => {
              /*  console.log(this.state.selectedRows.toJS(),111111);
              console.log(i,222222);
              console.log(value,333333);
              console.log(e,444444444444);
              console.log(goodsInfoPage.content,555555);*/
              console.log(value, 333333);
              if (value) {
                /*this.state.selectedRows.toJS().map((item,index)=>{
                  if (item.goodsId == i.goodsId) {
                    console.log(555555555)

                    recommendationNumber = item.recommendationNumber
                  }else {
                    recommendationNumber = 1
                  }
                })*/
                return (
                  <Select
                    defaultValue={value}
                    style={{ width: 120 }}
                    onChange={(e, a) => {
                      let obj = this.state.selectedRows.toJS();
                      for (let o = 0; o < obj.length; o++) {
                        obj[o].goodsInfoId === i['goodsInfoId']
                          ? (obj[o].recommendationNumber = Number(e))
                          : this.state.selectedRows.toJS();
                      }
                      this.setState({
                        selectedRows: fromJS(obj)
                      });

                      i = i['recommendationNumber'] = Number(e);
                      rowChangeBackFun(this.state.selectedRowKeys, fromJS(obj));
                    }}
                  >
                    <Option value="1">1</Option>
                    <Option value="2">2</Option>
                    <Option value="3">3</Option>
                    <Option value="4">4</Option>
                    <Option value="5">5</Option>
                    <Option value="6">6</Option>
                    <Option value="7">7</Option>
                    <Option value="8">8</Option>
                    <Option value="9">9</Option>
                    <Option value="10">10</Option>
                  </Select>
                );
              } else {
                return '-';
              }
            }}
          />
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
      res = (res as any).context.goodsInfoPage;
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

      let arr = res.content;
      let a = arr;
      let b = this.state.selectedRows.toJS();
      let list = [];
      list = b.reduce((pre, cur) => {
        let target = pre.find((ee) => ee.goodsInfoId == cur.goodsInfoId);
        if (target) {
          Object.assign(target, cur);
        } else {
          console.log(cur);
          pre.push(cur);
        }
        return pre;
      }, a);
      // console.log(list)
      /* a.map((item,index)=>{
         console.log(b[index]&&b[index].goodsInfoId);
         console.log(item&&item.goodsInfoId);
         if (b[index] && item.goodsInfoId  ==  b[index].goodsInfoId ) {
           console.log(11111)
           arr.push(b[index])
         }else {
           arr.push(item)
         }
       })*/

      // res.content = combined

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
