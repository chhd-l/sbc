import * as React from 'react';
import { fromJS } from 'immutable';

import { message, Modal } from 'antd';

import ProductGrid from './product-grid';
import { IList } from '../../../typings/globalType';
import { Relax } from 'plume2';
import { noop } from 'qmkit';
import { FormattedMessage, injectIntl } from 'react-intl';

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
      selectedRows: props.selectedRows ? props.selectedRows : []
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      selectedRows: nextProps.selectedRows
        ? nextProps.selectedRows
        : [],
      selectedSkuIds: nextProps.selectedSkuIds ? nextProps.selectedSkuIds : []
    });
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
           <FormattedMessage id="Prescriber.Choose goods"/>&nbsp;
            <small>
              <span style={{ color: 'red' }}>{selectedSkuIds.length}</span>{' '}
            <FormattedMessage id="Prescriber.itemsselected"/>
            </small>
          </div>
        }
        width={1100}
        visible={visible}
        onOk={() => {
          onProductselect(this.state.selectedRows);
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
        okText={<FormattedMessage id="Prescriber.Confirm"/>}
        cancelText={<FormattedMessage id="Prescriber.Cancel"/>}
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
