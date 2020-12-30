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
    };
    showModal: Function;
    selectedSkuIds: IList;
    selectedRows: IList;
    visible: boolean;
    onOkBackFun: Function;
    onCancelBackFun: Function;
    skuLimit?: number;
    showValidGood?: boolean;
    companyType?: number;
    //搜索参数
    searchParams: any;
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
    createLink: 'createLink'
  };
  constructor(props) {
    super(props);
    this.state = {
      selectedSkuIds: props.selectedSkuIds ? props.selectedSkuIds : [],
      selectedRows: props.selectedRows ? props.selectedRows : fromJS([])
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      selectedRows: nextProps.selectedRows ? nextProps.selectedRows : fromJS([]),
      selectedSkuIds: nextProps.selectedSkuIds ? nextProps.selectedSkuIds : []
    });
  }

  render() {
    const { visible, onOkBackFun, onCancelBackFun, skuLimit, showValidGood, application } = this.props;
    const { selectedSkuIds, selectedRows } = this.state;
    const { onProductselect, searchParams } = this.props.relaxProps;
    return (
      <Modal
        maskClosable={false}
        title={
          <div>
            Choose goods&nbsp;
            <small>
              <span style={{ color: 'red' }}>{selectedSkuIds.length}</span> items have been selected
            </small>
          </div>
        }
        width={1100}
        visible={visible}
        onOk={() => {
          onProductselect(this.state.selectedRows.toJS());
          this.props.showModal(false);
        }}
        onCancel={() => {
          this.props.showModal(false);
          //onCancelBackFun();
        }}
        okText="Confirm"
        cancelText="Cancel"
      >
        <SearchForm />
        {<ProductGrid visible={visible} showValidGood={showValidGood} skuLimit={skuLimit} isScroll={false} selectedSkuIds={selectedSkuIds} selectedRows={selectedRows} rowChangeBackFun={this.rowChangeBackFun} searchParams={searchParams} />}
      </Modal>
    );
  }

  rowChangeBackFun = (selectedSkuIds, selectedRows) => {
    this.setState(
      {
        selectedSkuIds: selectedSkuIds,
        selectedRows: selectedRows
      },
      () => {}
    );
  };
}
