import * as React from 'react';
import { fromJS, Set } from 'immutable';

import { Const, DataGrid } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import RelatedForm from './related-form';
import * as webapi from '../webapi';
import { Select, Table } from 'antd';
import { Relax } from 'plume2';

//const { Option } = Select;

const Column = Table.Column;
let recommendationNumber = 1;
/**
 * 商品添加
 */

@Relax
export default class ProductGridSKU extends React.Component<any, any> {
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
      content: [],
      goodsNo: []
    };
  }

  props: {
    rowChangeBackFun: Function;
    visible: Boolean;
    searchParams: Object;
    pid: String;
    relaxProps?: {
      addSkUProduct: any;
    };
  };

  static relaxProps = {
    addSkUProduct: 'addSkUProduct'
  };

  componentDidMount() {
    const { searchParams } = this.state;
    const { addSkUProduct } = this.props.relaxProps;
    this.init(searchParams ? searchParams : {});
    let pid = addSkUProduct.filter((item) => item.pid == this.props.pid);
    this.setState({
      goodsNo: pid
    });
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

  arrayFilter = (arrKey, arrList) => {
    let tempList = [];
    arrKey.map((item) => {
      tempList.push(arrList.find((el) => el.goodsInfoNo === item));
    });
    return tempList;
  };

  render() {
    const { loading, goodsInfoPage, selectedRowKeys, selectedRows, goodsNo } = this.state;
    const { rowChangeBackFun } = this.props;

    return (
      <div className="content">
        <RelatedForm form={this.props.form} searchBackFun={(res) => this.searchBackFun(res)} sku={true} />
        <DataGrid
          loading={{ spinning: loading, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" /> }}
          rowKey={(record, index) => record.goodsInfoNo}
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
            onChange: (selectedRowKeys, selectedTableRows) => {
              let tempSelectedRowKeys = [...new Set(selectedRowKeys)];
              let { selectedRows } = this.state;
              selectedRows = selectedRows.concat(selectedTableRows);
              selectedRows = this.arrayFilter(tempSelectedRowKeys, selectedRows);
              this.setState({
                selectedRows: selectedRows,
                selectedRowKeys: tempSelectedRowKeys
              });

              rowChangeBackFun(selectedRowKeys, selectedRows);
            },
            getCheckboxProps(record) {
              let a = [];
              let b = null;
              goodsNo.map((item) => {
                return item.targetGoodsIds.map((i) => {
                  return a.push(i);
                });
              });
              a.map((o) => {
                if (o.subGoodsInfoNo == record.goodsInfoNo) {
                  if (o.subGoodsInfoNo) {
                    if (record.goodsInfoNo == o.subGoodsInfoNo) {
                      b = 'checked';
                    }
                  }
                }
              });
              return {
                defaultChecked: b // 配置默认勾选的列
              };
            }
          }}
        >
          <Column
            title={<FormattedMessage id="Product.Image" />}
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
          <Column title={<FormattedMessage id="Product.SKU" />} dataIndex="goodsInfoNo" key="goodsInfoNo" />
          <Column title={<FormattedMessage id="Product.ProductName" />} dataIndex="goodsInfoName" key="goodsInfoName" width="200px" />
          <Column title={<FormattedMessage id="Product.SalesCategory" />} key="storeCateName" dataIndex="storeCateName"  width="200px" />
          <Column title={<FormattedMessage id="Product.Specification" />} dataIndex="specName" key="specName" />
          <Column title={<FormattedMessage id="Product.ProductCategory" />} dataIndex="goodsCateName" key="goodsCateName" />
          <Column title={<FormattedMessage id="Product.Brand" />} key="brandName" dataIndex="brandName" />
          <Column title={<FormattedMessage id="Product.Price" />} key="marketPrice" dataIndex="marketPrice" />
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
      loading: false
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
    this.setState({
      loading: true
    });
    let { res } = await webapi.fetchlistGoodsInfo({ ...params });

    if ((res as any).code == Const.SUCCESS_CODE) {
      res = (res as any).context.goodsInfos;
      let arr = res.content;
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
