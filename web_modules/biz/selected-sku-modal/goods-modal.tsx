import * as React from 'react';
import { fromJS } from 'immutable';

import { message, Modal } from 'antd';

import GoodsGrid from './goods-grid';
import { IList } from '../../../typings/globalType';
import { FormattedMessage, injectIntl } from 'react-intl';

class GoodsModal extends React.Component<any, any> {
  props: {
    intl;
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
    titleContent?: any;
    //英文的product category name
    goodsCate?: string;
    isSubsrciptionEdit?: boolean;
    pageType?: string;
    subscriptionType?:string;
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedSkuIds: props.selectedSkuIds ? props.selectedSkuIds : [],
      selectedRows: props.selectedRows ? props.selectedRows : fromJS([]),
      timer: null,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      selectedRows: nextProps.selectedRows ? nextProps.selectedRows : fromJS([]),
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
      application,
      titleContent = null,
      goodsCate,
      isSubsrciptionEdit = false,
      pageType,
      subscriptionType
    } = this.props;
    const { selectedSkuIds, selectedRows } = this.state;
    return (
      <Modal
        maskClosable={false}
        destroyOnClose={true}
        title={
          <div>
            <FormattedMessage id="Product.ChooseGoods" />
            &nbsp;
            <small>
              <span style={{ color: 'red' }}>{selectedSkuIds.length}</span>{' '}
              <FormattedMessage id="Product.itemsHaveBeenSelected" />
            </small>
          </div>
        }
        width={1100}
        visible={visible}
        onOk={() => {
          let { timer } = this.state
          if (application === 'saleType') {
            if (timer) {
              clearTimeout(timer)
            }
            timer = setTimeout(() => {
              onOkBackFun(this.state.selectedSkuIds, this.state.selectedRows);
            }, 1000)
            this.setState({
              timer
            })
          } else if (skuLimit && selectedSkuIds.length > skuLimit) {
            message.error(`Choose up to ${skuLimit} items`);
            // message.error('Choose up to 20 items');
          } else {
            if (timer) {
              clearTimeout(timer)
            }
            timer = setTimeout(() => {
              onOkBackFun(this.state.selectedSkuIds, this.state.selectedRows);
            }, 1000)
            this.setState({
              timer
            })
          }
        }}
        onCancel={() => {
          onCancelBackFun();
        }}
        okText="Confirm"
        cancelText="Cancel"
      >
        {titleContent}
        {
          <GoodsGrid
            visible={visible}
            showValidGood={showValidGood}
            skuLimit={skuLimit}
            isScroll={false}
            selectedSkuIds={selectedSkuIds}
            selectedRows={selectedRows}
            rowChangeBackFun={this.rowChangeBackFun}
            searchParams={searchParams}
            goodsCate={goodsCate}
            isSubsrciptionEdit={isSubsrciptionEdit}
            pageType={pageType}
            subscriptionType={subscriptionType}
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

export default injectIntl(GoodsModal);
