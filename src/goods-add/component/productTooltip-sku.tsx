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
    console.log(goodsList.toJS(),1111);


    selectedRows && selectedRows.map((item) => {
        if(item.stock){
          minStock.push(item.stock)
        }else if(sessionStorage.getItem('minStock')){
          minStock.push(sessionStorage.getItem('minStock'))
        }
        targetGoodsIds.push({
          subGoodsInfoId: item.goodsInfoId || item.subGoodsInfoId,
          bundleNum: 1,
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
    sessionStorage.setItem('minStock',tempMinStock)
    targetGoodsList.push({
      pid: this.props.pid,
      targetGoodsIds: goodsIds,
      minStock: tempMinStock
    });
    let id = goodsList.toJS()[0].id
    let marketPrice = goodsIds[0].marketPrice * goodsIds[0].bundleNum
    let subscriptionPrice = goodsIds[0].subscriptionPrice * goodsIds[0].bundleNum
    let stock = Number(String(goodsIds[0].stock?goodsIds[0].stock:0 / goodsIds[0].bundleNum).replace(/\.\d+/g, ''))
    console.log(stock,1111)

    if (goodsList.toJS().length == 1 && goodsIds.length == 1) {
      editGoodsItem(id, 'marketPrice', marketPrice);
      editGoodsItem(id, 'subscriptionPrice', subscriptionPrice);
      editGoodsItem(id, 'stock', stock);
    }/*else if (targetGoodsList.length == 0){
      editGoodsItem(id, 'marketPrice', 0);
      editGoodsItem(id, 'subscriptionPrice', 0);
    }*/else {
      editGoodsItem(id, 'marketPrice', 0);
      editGoodsItem(id, 'subscriptionPrice', 0);
      editGoodsItem(id, 'stock', tempMinStock);

    }
    if (targetGoodsIds.length <= 10) {
      if (targetGoodsIds.length !== 0) {
        onProductselectSku(targetGoodsList);

      }
      targetGoodsIds = [];
      this.props.showModal({ type: 0 }, this.props.pid);
    } else {
      message.info('Maximum 10 products!');
    }
    this.props.form.resetFields();
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
      selectedRows: selectedRows
    });
  };
}

export default Form.create()(ProductTooltipSKU);
