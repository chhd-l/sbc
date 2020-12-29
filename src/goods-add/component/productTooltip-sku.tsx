import * as React from 'react';
import { fromJS } from 'immutable';

import { message, Modal, Form } from 'antd';
//import RelatedForm from './related-form';
import ProductGridSKU from './product-grid-sku';
import { IList } from '../../../typings/globalType';
import { Relax } from 'plume2';
import { noop } from 'qmkit';
import * as _ from 'lodash';

let targetGoodsList = [];
let targetGoodsIds = [];

@Relax
class ProductTooltipSKU extends React.Component<any, any> {
  props: {
    relaxProps?: {
      sharing: any;
      productForm: any;
      productList: IList;
      onProductselectSku: Function;
      loading: boolean;
      createLink: any;
      getGoodsId: any;
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
    pid: any;
    initCateList: any;
    addSkUProduct: any;
  };

  static relaxProps = {
    sharing: 'sharing',
    productForm: 'productForm',
    onProductselectSku: noop,
    loading: 'loading',
    productList: 'productList',
    createLink: 'createLink',
    getGoodsId: 'getGoodsId',
    initCateList: 'initCateList',
    addSkUProduct: 'addSkUProduct'
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
    const { visible, skuLimit, showValidGood, searchParams } = this.props;
    const { selectedSkuIds, selectedRows } = this.state;
    const { onProductselectSku, addSkUProduct } = this.props.relaxProps;

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
          let a = [];
          let minStock = []
          selectedSkuIds.map((item) => {
            a.push({
              goodsInfoNo: item
            });
          });
          let b = _.intersectionBy(this.state.selectedRows.toJS(), a, 'goodsInfoNo');
          b&&b.map((item) =>{
            minStock.push(item.stock)
              targetGoodsIds.push({
                subGoodsInfoId: item.goodsInfoId,
                bundleNum: 1,
                goodsInfoNo: item.goodsInfoNo,
                subGoodsInfoNo: item.goodsInfoNo,
              })
            }
          );
          let goodsIds = _.uniqBy(targetGoodsIds, 'subGoodsInfoNo');
          /*console.log(targetGoodsList,1111);
          console.log(addSkUProduct,22222111);
          console.log(a,3333333);
          console.log(b,44444);*/

          targetGoodsList = [];
          targetGoodsList.push({
            pid: this.props.pid,
            targetGoodsIds: goodsIds,
            minStock: Math.min.apply(Math, minStock)
          });
          if (targetGoodsIds.length <= 10) {
            //let a = _.filter(targetGoodsList, (o) => o.pid != this.props.pid);
            /*a.push({
              pid: this.props.pid,
              targetGoodsIds: targetGoodsIds
            });*/
            //console.log(targetGoodsList,123);
            if(targetGoodsIds.length !=0) {
              onProductselectSku(targetGoodsList);
            }
            targetGoodsIds = [];
            this.props.showModal({ type: 0 }, this.props.pid);
          } else {
            message.info('Maximum 10 products!');
          }
          this.props.form.resetFields();
        }}
        onCancel={() => {
          this.props.showModal({ type: 0 }, this.props.pid);
          this.props.form.resetFields();
          //onCancelBackFun();
        }}
        okText="Confirm"
        cancelText="Cancel"
      >
        {
          <ProductGridSKU
            form={this.props.form}
            pid={this.props.pid}
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
    this.setState(
      {
        selectedSkuIds: selectedSkuIds,
        selectedRows: selectedRows
      },
      () => {}
    );
  };
}

export default Form.create()(ProductTooltipSKU);
