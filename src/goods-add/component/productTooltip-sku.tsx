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
      addSkUProduct: any;
      onFormFieldChange:Function;
      editGoodsItem: Function;
      goodsList: IList;

    };
    showModal: Function;
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
    id: any

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
    addSkUProduct: 'addSkUProduct',
    goodsList: 'goodsList',
    onFormFieldChange:noop,
    editGoodsItem: noop,

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
    const { addSkUProduct } = this.props.relaxProps;

    let obj = addSkUProduct;
    if (Array.isArray(obj) &&obj.length>0) {
      let currentObj = obj.find(item=>item.pid === this.props.pid)
      if(currentObj){
        let tempArr = currentObj.targetGoodsIds
        if(Array.isArray(tempArr)&& tempArr.length>0){
          let selectedRows = [];
          let selectedRowKeys = [];
          for (let i = 0; i < tempArr.length; i++) {
            const element = tempArr[i];
            selectedRows.push(element);
            selectedRowKeys.push(element.subGoodsInfoNo);
          }
          this.setState({ selectedRows, selectedRowKeys });
        }
      }


    }
  };

  handleOK=()=>{
    const {selectedRowKeys,selectedRows, addSkUProduct, } = this.state
    const { onProductselectSku, goodsList, editGoodsItem } = this.props.relaxProps;
    // let a = [];
    let minStock = []
    // selectedRowKeys.map((item) => {
    //   a.push({
    //     goodsInfoNo: item
    //   });
    // });

    selectedRows && selectedRows.map((item) => {
        /*if(item.stock){
          minStock.push(item.stock)
        }else if(sessionStorage.getItem('minStock')){
          minStock.push(sessionStorage.getItem('minStock'))
        }*/
      minStock.push(item.stock)
        targetGoodsIds.push({
          subGoodsInfoId: item.goodsInfoId || item.subGoodsInfoId,
          bundleNum: 1,
          subStock: item.stock,
          stock: item.stock,
          saleableFlag: item.saleableFlag,
          marketPrice: item.marketPrice,
          subMarketPrice: item.subMarketPrice,
          subScriptionPrice: item.subScriptionPrice,
          subscriptionPrice: item.subscriptionPrice,
          goodsInfoNo: item.goodsInfoNo,
          subGoodsInfoNo: item.goodsInfoNo,

        })
      }
    );
    let goodsIds = _.uniqBy(targetGoodsIds, 'subGoodsInfoNo');

    targetGoodsList = [];
    let tempMinStock = Math.min.apply(Math, minStock)

    //sessionStorage.setItem('minStock',tempMinStock)
    targetGoodsList.push({
      pid: this.props.pid,
      targetGoodsIds: goodsIds,
      minStock: tempMinStock
    });
    let marketPrice = goodsIds[0].marketPrice * goodsIds[0].bundleNum
    let subscriptionPrice = goodsIds[0].subscriptionPrice * goodsIds[0].bundleNum
    //let stock = Number(String(goodsIds[0].stock?goodsIds[0].stock:0 / goodsIds[0].bundleNum).replace(/\.\d+/g, ''))


    if (targetGoodsIds.length <= 10) {
      if (targetGoodsIds.length !== 0) {

        // goodsList.toJS().map(item=>{
        //   if (item.id == this.props.id) {
        //     editGoodsItem(this.props.id, 'stock', tempMinStock);
        //     if (goodsList.toJS().length == 1 && goodsIds.length == 1) {
        //       editGoodsItem(item.id, 'marketPrice', marketPrice);
        //       editGoodsItem(item.id, 'subscriptionPrice', subscriptionPrice);
        //     }else {
        //       editGoodsItem(item.id, 'marketPrice', 0);
        //       editGoodsItem(item.id, 'subscriptionPrice', 0);
        //     }
        //     editGoodsItem(item.id, 'goodsInfoBundleRels', goodsIds);

        //   }
        // })

        // 设置Market Price
        let curGoodsItem = goodsList.toJS().filter(item => item.id === this.props.id)[0]
        if(curGoodsItem && !curGoodsItem.goodsId) {
          let subscriptionPrice = 0;
          let marketPrice = goodsIds.reduce((sum, item) => {
            subscriptionPrice += item.subscriptionPrice * item.bundleNum;
            return sum + item.marketPrice * item.bundleNum;
          }, 0);
          editGoodsItem(curGoodsItem.id, 'marketPrice', marketPrice);
          editGoodsItem(curGoodsItem.id, 'subscriptionPrice', subscriptionPrice);
          editGoodsItem(curGoodsItem.id, 'stock', tempMinStock);
          editGoodsItem(curGoodsItem.id, 'goodsInfoBundleRels', goodsIds);
        }

        onProductselectSku(targetGoodsList);
      }
      targetGoodsIds = [];
      this.props.showModal({ type: 0 }, this.props.pid);
    } else {
      message.info('Maximum 10 products!');
    }
    //this.props.form.resetFields();
    this.clearSearchForm()
  }
  clearSearchForm =()=>{
    const{onFormFieldChange} = this.props.relaxProps
    onFormFieldChange({key: 'likeGoodsName',value: ''});
    onFormFieldChange({key: 'likeGoodsNo',value: ''});
    onFormFieldChange({key: 'goodsCateId',value: ''});
    onFormFieldChange({key: 'storeCategoryIds',value: null});
    onFormFieldChange({key: 'brandId',value: ''});
  }

  render() {
    const { visible, skuLimit, showValidGood, searchParams } = this.props;
    const { selectedRowKeys, selectedRows } = this.state;


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
          this.handleOK()
        }

        }
        onCancel={() => {
          this.props.showModal({ type: 0 }, this.props.pid);
          this.props.form.resetFields();
          this.clearSearchForm()
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
            skuLimit={skuLimit}
            isScroll={false}
            selectedRowKeys={selectedRowKeys}
            selectedRows={selectedRows}
            rowChangeBackFun={this.rowChangeBackFun}
            searchParams={searchParams}
          />
        }
      </Modal>
    );
  }
  arrayFilter = (arrKey, arrList) => {
    let tempList = [];
    arrKey.map((item) => {
      tempList.push(arrList.find((el) => el && el.goodsInfoNo === item));
    });
    return tempList;
  };

  rowChangeBackFun = (selectedRowKeys, selectedRow) => {
    let { selectedRows } = this.state;
    selectedRows = selectedRows.concat(selectedRow);
    selectedRows = this.arrayFilter(selectedRowKeys, selectedRows);
    this.setState({
      selectedRowKeys: selectedRowKeys,
      selectedRows: selectedRows
    });
  };
}

export default Form.create()(ProductTooltipSKU);
