import * as React from 'react';
import { fromJS, Set } from 'immutable';

import { cache, Const, DataGrid, SelectGroup, RCi18n } from 'qmkit';

//import SearchForm from './search-form';
import * as webapi from '../webapi';
import { message, Select, Table } from 'antd';

const Column = Table.Column;
let recommendationNumber = 1;
const { Option } = Select;
/**
 * 商品添加
 */
export default class GoodsGrid extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      selectedRows: [],
      selectedRowKeys: [],
      oldSelectedRowKeys: [],
      prevPropSelectedRowKeys: [],
      total: 0,
      goodsInfoPage: {},
      searchParams: {},
      showValidGood: props.showValidGood,
      content: []
    };
  }

  componentDidMount() {
    const { searchParams } = this.state;
    this.init(searchParams ? searchParams : {});
  }
  static getDerivedStateFromProps(props, state) {
    // 当传入的值发生变化的时候，更新state
    if (JSON.stringify(props.selectedRowKeys) !== JSON.stringify(state.prevPropSelectedRowKeys)) {
      return {
        oldSelectedRowKeys: props.selectedRowKeys.concat(),
        selectedRowKeys: props.selectedRowKeys.concat(),
        prevPropSelectedRowKeys: props.selectedRowKeys.concat(),
        selectedRows: props.selectedRows.concat()
      };
    }
    if (JSON.stringify(props.searchParams) !== JSON.stringify(state.searchParams)) {
      return {
        searchParams: props.searchParams
      };
    }

    return null;
  }

  componentDidUpdate(prevProps) {
    // 典型用法（不要忘记比较 props）：
    if (JSON.stringify(this.props.searchParams) !== JSON.stringify(prevProps.searchParams)) {
      this.init(this.props.searchParams);
    }
  }

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   if (nextProps.searchParams) {
  //     this.init(nextProps.searchParams ? nextProps.searchParams : {});
  //   }
  //   if (!this.props.visible && nextProps.visible) {
  //     this.setState({
  //       searchParams: nextProps.searchParams ? nextProps.searchParams : {}
  //     });
  //     this.init(nextProps.searchParams ? nextProps.searchParams : {});
  //   }
  // }

  arrayFilter = (arrKey, arrList) => {
    let tempList = [];
    arrKey.map((item) => {
      tempList.push(arrList.find((el) => el.goodsInfoId === item));
    });
    return tempList;
  };
  // initSelectedRow=()=>{
  //   const { productselect } = this.props.relaxProps;
  //   let obj = productselect;
  //   if(Array.isArray(obj) && obj.length>0){
  //     let selectedRows = []
  //     let selectedRowKeys = []
  //     for (let i = 0; i < obj.length; i++) {
  //       const element = obj[i];
  //       selectedRows.push(element)
  //       selectedRowKeys.push(element.goodsInfoId)
  //     }
  //     this.setState({
  //       selectedRows,
  //       selectedRowKeys
  //     })
  //   }
  // }

  render() {
    const { loading, goodsInfoPage, selectedRowKeys, selectedRows, showValidGood } = this.state;
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
              // const sRows = fromJS(selectedRows).filter((f) => f);
              // let rows = (sRows.isEmpty() ? Set([]) : sRows.toSet()).concat(fromJS(selectedTableRows).toSet()).toList();
              // rows = selectedRowKeys.map((key) => rows.filter((row) => row.get('goodsInfoId') == key).first()).filter((f) => f);

              let { selectedRows } = this.state;
              selectedRows = selectedRows.concat(selectedTableRows);
              selectedRows = this.arrayFilter(selectedRowKeys, selectedRows);
              this.setState({
                selectedRows: selectedRows,
                selectedRowKeys
              });

              rowChangeBackFun(selectedRowKeys, selectedRows);
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
          <Column title={RCi18n({id:'Order.Product Name'})} dataIndex="goodsInfoName" key="goodsInfoName" />
          <Column title={RCi18n({id:'Order.SPU'})} dataIndex="goodsNo" key="goodsNo" />
          <Column title={RCi18n({id:'Order.SKU'})} dataIndex="goodsInfoNo" key="goodsInfoNo" />
          <Column title={RCi18n({id:'Order.Product category'})} dataIndex="goodsCateName" key="goodsCateName" />
          <Column title={RCi18n({id:'Order.Sales category'})} dataIndex="storeCateName" key="storeCateName" />
          <Column
            title={RCi18n({id:'Order.Weight'})}
            dataIndex="goodsInfoWeight"
            key="goodsInfoWeight"
            render={(goodsInfoWeight) => {
              return goodsInfoWeight != null ? goodsInfoWeight : '--';
            }}
          />
          <Column title={RCi18n({id:'Order.Price'})} dataIndex="marketPrice" key="marketPrice" render={(marketPrice) => <span>{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + marketPrice}</span>} />

          {/* <Column
            title="Quantity"
            key="recommendationNumber"
            dataIndex="recommendationNumber"
            render={(value, row) => {
                return (
                  <Select
                    defaultValue={value?value:1}
                    style={{ width: 120 }}
                    onChange={(e) => {
                      let obj = this.state.selectedRows.toJS();
                      for (let o = 0; o < obj.length; o++) {
                        obj[o].goodsInfoId === row['goodsInfoId'] ? (obj[o].recommendationNumber = Number(e)) : this.state.selectedRows.toJS();
                      }
                      this.setState({
                        selectedRows: fromJS(obj)
                      });

                      row = row['recommendationNumber'] = Number(e);
                      rowChangeBackFun(this.state.selectedRowKeys, fromJS(obj));
                    }}
                  >
                    <Option value={1}>1</Option>
                    <Option value={2}>2</Option>
                    <Option value={3}>3</Option>
                    <Option value={4}>4</Option>
                    <Option value={5}>5</Option>
                    <Option value={6}>6</Option>
                    <Option value={7}>7</Option>
                    <Option value={8}>8</Option>
                    <Option value={9}>9</Option>
                    <Option value={10}>10</Option>
                  </Select>
                );
              
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
      pageSize
    });
  };

  init = (params) => {
    this.setState({
      loading: true
    });
    if (!params.pageNum) {
      params.pageNum = 0;
    }
    if (!params.pageSize) {
      params.pageSize = 10;
    }
    params.subscriptionFlag = sessionStorage.getItem('PromotionTypeValue') == '1' ? true : false;

    let newParams = {
      goodsName: params.likeGoodsName,
      goodsInfoNo: params.likeGoodsInfoNo,
      pageNum: params.pageNum,
      pageSize: params.pageSize
    };

    webapi
      .fetchproductTooltip(newParams)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let goodsInfos = (res as any).context.goodsInfos;
          let arr = goodsInfos.content;
          let a = arr;
          let b = this.state.selectedRows;
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
            goodsInfoPage: goodsInfos,
            loading: false
          });
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
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
