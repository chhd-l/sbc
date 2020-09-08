import * as React from 'react';
import { fromJS } from 'immutable';

import { message, Modal } from 'antd';

import ProductGrid from './product-grid';
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
    searchParams?: Object;
    //应用标示。如添加秒杀商品：saleType
    application?: string;
  };

  static relaxProps = {
    sharing: 'sharing',
    productForm: 'productForm',
    onSharing: noop,
    onProductForm: noop,
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

<<<<<<< HEAD
  onSelectChange = (selectedRowKeys, v, o) => {
    selectedRowKeys.map((item, i) => {
      v[i].quantity = 1;
      if (arrQuantity.length > 0) {
        arrQuantity.map((m, n) => {
          if (m.no == item) {
            v[i].quantity = Number(m.quantity);
          }
        });
        localStorage.setItem('arrQuantity', 'true');
      }
    });
    this.setState({ selectedRowKeys, addProduct: v });
  };
  handleOk = (e) => {
    const { onProductselect } = this.props.relaxProps;
    onProductselect(this.state.addProduct);
    this.props.showModal(false);
  };

  handleCancel = (e) => {
    this.props.showModal(false);
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { visible } = nextProps;
    // 当传入的type发生变化的时候，更新state
    if (visible !== prevState.visible) {
      return {
        visible
      };
    }
    // 否则，对于state不进行任何操作
    return null;
  }
  componentDidMount() {
    const { onProductForm } = this.props.relaxProps;
    onProductForm();
    localStorage.removeItem('arrQuantity');
=======
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      selectedRows: nextProps.selectedRows
        ? nextProps.selectedRows
        : fromJS([]),
      selectedSkuIds: nextProps.selectedSkuIds ? nextProps.selectedSkuIds : []
    });
>>>>>>> a9dbf9140911fa34f4217542e1c160e9abe2c6e0
  }

  render() {
    const {
      visible,
      onOkBackFun,
      onCancelBackFun,
      skuLimit,
      showValidGood,
      searchParams,
      application
    } = this.props;
    const { selectedSkuIds, selectedRows } = this.state;
    const { onProductselect } = this.props.relaxProps;
    return (
      <Modal
        maskClosable={false}
        title={
          <div>
            Choose goods&nbsp;
            <small>
              <span style={{ color: 'red' }}>{selectedSkuIds.length}</span>{' '}
              items have been selected
            </small>
          </div>
        }
        width={1100}
        visible={visible}
        onOk={() => {
          onProductselect(this.state.selectedRows.toJS());
          this.props.showModal(false);
          /* if (application === 'saleType') {
                   // onOkBackFun(this.state.selectedSkuIds, this.state.selectedRows);
                 } else if (skuLimit && selectedSkuIds.length > skuLimit) {
                   message.error('Choose up to 20 items');
                 } else {
                 //  onOkBackFun(this.state.selectedSkuIds, this.state.selectedRows);
                 }*/
        }}
        onCancel={() => {
          onCancelBackFun();
        }}
        okText="Confirm"
        cancelText="Cancel"
      >
        {
          <ProductGrid
            visible={visible}
            showValidGood={showValidGood}
            skuLimit={skuLimit}
            isScroll={false}
            selectedSkuIds={selectedSkuIds}
            selectedRows={selectedRows}
            rowChangeBackFun={this.rowChangeBackFun}
            searchParams={searchParams}
          />
        }
      </Modal>
    );
  }

  rowChangeBackFun = (selectedSkuIds, selectedRows) => {
    this.setState({
      selectedSkuIds: selectedSkuIds,
      selectedRows: selectedRows
    });
  };
}
