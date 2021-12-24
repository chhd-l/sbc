import React from 'react';

import {
  Table,
  Col,
  Button,
  Select,
  Switch,
  Popconfirm,
  message,
  Modal,
  Spin
} from 'antd';
import { Relax } from 'plume2';
import { IMap, IList } from 'typings/globalType';
import DetailList from './list';
import ProductTooltip from './productTooltip';
import { cache, history, noop, SelectGroup } from 'qmkit';
import { FormattedMessage, injectIntl } from 'react-intl';
import GoodsModal from './selected-sku-modal';
const Option = Select.Option;
//import moment from 'moment';

//import { Const, util } from 'qmkit';
//import { FormattedMessage } from 'react-intl';
//import { bool } from 'prop-types';
// let checkNum = 0;
// let check = true;
let loading = false;

@Relax
export default class ChooseProducts extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      // check: true,
      showSwich: true
    };
  }

  props: {
    relaxProps?: {
      onProductselect:Function
      recommendParams:IMap,
      getGoodsInfoPage: Function
      settlement: IMap;
      setName: IList;
      productselect:IList
      onSharing: Function;
      onLinkStatus: Function;
      savepetsRecommendParams: Function,
      linkStatus: any;
      detailProductList: any;
      createLinkType: any;
      loading:boolean
      onChangeStep: Function
    };
  };

  static relaxProps = {
    recommendParams:'recommendParams',
    settlement: 'settlement',
    setName: 'setName',
    onProductselect: noop,
    productselect:'productselect',
    savepetsRecommendParams: noop,
    onSharing: noop,
    onLinkStatus: noop,
    detailProductList: 'detailProductList',
    linkStatus: 'linkStatus',
    createLinkType: 'createLinkType',
    loading:'loading',
    getGoodsInfoPage: noop,
    onChangeStep: noop
  };

  componentDidMount() {
    const { onSharing, detailProductList, linkStatus,getGoodsInfoPage } = this.props.relaxProps;
    const employee = JSON.parse(sessionStorage.getItem(cache.EMPLOYEE_DATA));
    if (employee.prescribers && employee.prescribers.length > 0) {
      onSharing({
        field: 'prescriberId',
        value: employee.prescribers[0].id
      });
    }
    getGoodsInfoPage()
  }

  showProduct = (res) => {
    this.setState({
      visible: res
    });
  };
  _prescriberChange = (value, name) => {
    //const employee = JSON.parse(sessionStorage.getItem(cache.EMPLOYEE_DATA));
    const { onSharing } = this.props.relaxProps;
    onSharing({
      field: 'prescriberId',
      value: value
    });
  };
  onValid = (check) => {
    loading = true;
    const { onLinkStatus } = this.props.relaxProps;
    if (this.state.showSwich === true) {
      let linkStatus = check === true ? 0 : 1;
      onLinkStatus({ linkStatus, id: history.location.state.id });
    } else {
      return;
    }
  };
  confirm = (check) => {
    this.onValid(!check);
    // this.setState({ showSwich: true });
    // console.log(check);
    // message.success('Click on Yes');
  };

  cancel = () => {
    //message.info('canceled');
  };
  next=()=>{
    const { productselect,recommendParams, onChangeStep,savepetsRecommendParams} = this.props.relaxProps;
    savepetsRecommendParams({...recommendParams.toJS(),goodsQuantity:productselect.toJS()})
   
    setTimeout(() => {
      onChangeStep(3)
    }, 300);
  }
  selectProduct=(select)=>{
    const {
      onProductselect,
    } = this.props.relaxProps;

    onProductselect(select);
    this.setState({
      visible:false
    })
  }
  render() {
    const {
      loading,
      onChangeStep,
      productselect,
    } = this.props.relaxProps;
    let _productselect=productselect.toJS()
    let selectedSkuIds=_productselect.map(item=>item.goodsInfoId)
    return (
      <div style={styles.main}>
     

        <div style={styles.nav}>
          {/* {history.location.state
            ? 'Recommended Product List'
            : ''} */}
           <FormattedMessage id="Prescriber.SelectRecommendedProduct" />
        </div>
        <div style={styles.btn}>
          {/* {history.location.state ? null : ( */}
            <Button
              type="primary"
              shape="round"
              // disabled={createLinkType}
              icon="edit"
              onClick={() => this.showProduct(true)}
            >
               <FormattedMessage id="Prescriber.Add Product" />
            </Button>
          {/* )} */}
        </div>
         <Spin spinning={loading}>

        <DetailList />
        <div className="steps-action">

                        <Button style={{ marginRight: 15 }} onClick={()=>onChangeStep(1)}>
                            <FormattedMessage id="Prescriber.Previous" />
                        </Button>
                        <Button type="primary"  onClick={()=>this.next()} >
                            <FormattedMessage id="Prescriber.Next" />
                        </Button>
                    </div>
</Spin>
        {this.state.visible == true ? (

          <GoodsModal selectedRows={_productselect} selectedSkuIds={selectedSkuIds}  onCancelBackFun={()=>{
            this.setState({
              visible:false
            })
          }}  onOkBackFun={(e,select)=>{this.selectProduct(select)}} visible={this.state.visible}></GoodsModal>
          // <ProductTooltip
          //   onCancelBackFun={() => this.showProduct(false)}
          //   visible={this.state.visible}
          //   showModal={this.showProduct}
          // />
        ) : (
          <React.Fragment />
        )}
      </div>
    );
  }
}

const styles = {
  main: {
    color: '#000',
    padding: 5,
    marginRight: 10
  },
  nav: {
    color: '#000',
    fontSize: 16,
    padding: 5
  },
  btn: {
    paddingTop: 5,
    marginBottom: 10
  },
  static: {
    background: '#fff',
    padding: 10,
    marginBottom: 15,
    marginTop: 10
  },
  space: {
    marginRight: 35
  }
};
