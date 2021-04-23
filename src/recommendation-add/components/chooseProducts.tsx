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
      settlement: IMap;
      setName: IList;
      onSharing: Function;
      onLinkStatus: Function;
      linkStatus: any;
      detailProductList: any;
      createLinkType: any;
      goodsQuantity:any
      loading:boolean
    };
  };

  static relaxProps = {
    settlement: 'settlement',
    setName: 'setName',
    onSharing: noop,
    onLinkStatus: noop,
    detailProductList: 'detailProductList',
    linkStatus: 'linkStatus',
    createLinkType: 'createLinkType',
    goodsQuantity:'goodsQuantity',
    loading:'loading'
  };

  componentDidMount() {
    const { onSharing, detailProductList, linkStatus } = this.props.relaxProps;
    const employee = JSON.parse(sessionStorage.getItem(cache.EMPLOYEE_DATA));
    if (employee.prescribers && employee.prescribers.length > 0) {
      onSharing({
        field: 'prescriberId',
        value: employee.prescribers[0].id
      });
    }
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
  render() {
    const {
      loading,
    } = this.props.relaxProps;


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
         <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />} >

        <DetailList />
</Spin>
        {this.state.visible == true ? (
          <ProductTooltip
            onCancelBackFun={() => this.showProduct(false)}
            visible={this.state.visible}
            showModal={this.showProduct}
          />
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
