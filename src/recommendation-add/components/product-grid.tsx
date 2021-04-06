import * as React from 'react';
import { fromJS, Set } from 'immutable';

import { Const, DataGrid } from 'qmkit';
import { Select, Table } from 'antd';
import { Relax } from 'plume2';

const Column = Table.Column;

/**
 * 商品添加
 */
@Relax
export default class GoodsGrid extends React.Component<any, any> {
  props: {
    searchParams:any;
    visible:boolean;
    rowChangeBackFun:Function;
    relaxProps?: {
      productselect: any;
      goodsInfoPage:any,
      loading:boolean
    };
  };

  static relaxProps = {
    productselect: 'productselect',
    goodsInfoPage:'goodsInfoPage',
    loading:'loading'
  };
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


  // UNSAFE_componentWillReceiveProps(nextProps) {
  
  //   this.setState({
  //     selectedRows: nextProps.selectedRows
  //       ? nextProps.selectedRows
  //       : fromJS([]),
  //     selectedRowKeys: nextProps.selectedSkuIds ? nextProps.selectedSkuIds : []
  //   });
  // }
  componentDidMount(){
    const {productselect}=this.props.relaxProps
    let selectedRowKeys=[];
    productselect.map(item=>{
      selectedRowKeys.push(item.goodsInfoId)
    })
    this.setState({
      selectedRows: productselect,
      selectedRowKeys
    })
  }

  render() {
    const {
      selectedRowKeys,
      selectedRows,
      showValidGood
    } = this.state;
    const { rowChangeBackFun, visible } = this.props;
    const {goodsInfoPage,loading}=this.props.relaxProps
    return (
      <div className="content">
        <DataGrid
          loading={{ spinning: loading, indicator:<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px',height: '90px' }} alt="" /> }}
          rowKey={(record) => record.goodsInfoId}
          dataSource={goodsInfoPage}
          isScroll={false}
          pagination={false}
          rowSelection={{
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedRowKeys: any[], selectedTableRows: any[]) => {
              let rows = [...selectedRows,...selectedTableRows]
              let _rowObj={}
              rows.map(item=>{
                _rowObj[item.goodsInfoId]=item;
              })
              let _newRow=selectedRowKeys.map(item=>{
                  return {..._rowObj[item],quantity:1}
              })
              this.setState({
                selectedRows: _newRow,
                selectedRowKeys
              });
              rowChangeBackFun(selectedRowKeys, fromJS(_newRow));
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

 

}
