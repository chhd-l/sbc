import * as React from 'react';
import { fromJS } from 'immutable';

import { message, Modal } from 'antd';

import ProductGrid from './product-grid';
import SearchForm from './search-form';

import { IList } from '../../../typings/globalType';
import { Relax } from 'plume2';
import { noop } from 'qmkit';

@Relax
export default class GoodsModal extends React.Component<any, any> {
  props: {
    relaxProps?: {
      sharing: any;
      productForm: any;
      productList: IList;
      onProductselect: Function;
      onSharing: Function;
      onProductForm: Function;
      loading: boolean;
      createLink: any;
      productselect: any;
      searchParams: any;
      onSearchParams: Function;
    };
    showModal: Function;
    visible: boolean;
    onOkBackFun: Function;
    onCancelBackFun: Function;
    skuLimit?: number;
    showValidGood?: boolean;
    companyType?: number;
    //搜索参数

    //应用标示。如添加秒杀商品：saleType
    application?: string;
  };

  static relaxProps = {
    sharing: 'sharing',
    productForm: 'productForm',
    onSharing: noop,
    searchParams: 'searchParams',
    onProductselect: noop,
    loading: 'loading',
    productList: 'productList',
    createLink: 'createLink',
    productselect: 'productselect',
    onSearchParams: noop
  };
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: []
    };
  }
  componentDidMount = () => {
    this.init();
  };
  init = () => {
    const { productselect } = this.props.relaxProps;
    let obj = productselect;
    if (Array.isArray(obj) && obj.length > 0) {
      let selectedRows = [];
      let selectedRowKeys = [];
      for (let i = 0; i < obj.length; i++) {
        const element = obj[i];
        selectedRows.push(element);
        selectedRowKeys.push(element.goodsInfoId);
      }
      this.setState({ selectedRows, selectedRowKeys });
    }
  };

  render() {
    const { visible, onOkBackFun, onCancelBackFun, skuLimit, showValidGood, application } = this.props;
    const { selectedRowKeys, selectedRows } = this.state;
    const { onProductselect, searchParams, onSearchParams } = this.props.relaxProps;
    return (
      <Modal
        maskClosable={false}
        title={
          <div>
            Choose goods&nbsp;
            <small>
              <span style={{ color: 'red' }}>{selectedRowKeys.length}</span> items have been selected
            </small>
          </div>
        }
        width={1100}
        visible={visible}
        onOk={() => {
          const params = {
            likeGoodsName: '',
            likeGoodsInfoNo: ''
          };
          onSearchParams(params);
          onProductselect(this.state.selectedRows);
          this.props.showModal(false);
        }}
        onCancel={() => {
          const params = {
            likeGoodsName: '',
            likeGoodsInfoNo: ''
          };
          onSearchParams(params);
          this.props.showModal(false);
          //onCancelBackFun();
        }}
        okText="Confirm"
        cancelText="Cancel"
      >
        <SearchForm />
        {<ProductGrid visible={visible} showValidGood={showValidGood} skuLimit={skuLimit} isScroll={false} selectedRowKeys={selectedRowKeys} selectedRows={selectedRows} rowChangeBackFun={this.rowChangeBackFun} searchParams={searchParams} />}
      </Modal>
    );
  }

  arrayFilter = (arrKey, arrList) => {
    let tempList = [];
    arrKey.map((item) => {
      tempList.push(arrList.find((el) => el.goodsInfoNo === item));
    });
    return tempList;
  };

  rowChangeBackFun = (selectedRowKeys, selectedRow) => {
    let { selectedRows } = this.state;
    selectedRows = selectedRows.concat(selectedRow);
    selectedRows = this.arrayFilter(selectedRowKeys, selectedRows);
    this.setState({
      selectedRowKeys: selectedRowKeys,
      selectedRows: selectedRow
    });
  };
}
