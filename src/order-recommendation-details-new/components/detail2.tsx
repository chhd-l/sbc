import React from 'react';

import { Table, Col, Button, Select, Switch, Icon } from 'antd';
import { Relax } from 'plume2';
import { IMap, IList } from 'typings/globalType';
import DetailList from './list';
import ProductTooltip from './productTooltip';

import { cache, history, noop, SelectGroup } from 'qmkit';
const Option = Select.Option;
//import moment from 'moment';

//import { Const, util } from 'qmkit';
//import { FormattedMessage } from 'react-intl';
//import { bool } from 'prop-types';

@Relax
export default class BillingDetailsNext extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  props: {
    relaxProps?: {
      settlement: IMap;
      setName: IList;
      onSharing: Function;
      onLinkStatus: Function;
      detailProductList: any;
    };
  };

  static relaxProps = {
    settlement: 'settlement',
    setName: 'setName',
    onSharing: noop,
    onLinkStatus: noop,
    detailProductList: 'detailProductList'
  };
  componentDidMount() {}

  showProduct = (res) => {
    this.setState({
      visible: res
    });
  };
  onValid = (e) => {
    const { onLinkStatus } = this.props.relaxProps;
    let linkStatus = e == true ? 0 : 1;
    onLinkStatus({ linkStatus, id: history.location.state.id });
  };
  render() {
    return (
      <div style={styles.main}>
        <div style={styles.nav}>{history.location.state ? 'Recommended Product List' : 'Select Recommended Product'}</div>
        <div style={styles.btn}>
          {history.location.state ? null : (
            <Button type="primary" shape="round" icon="edit" onClick={() => this.showProduct(true)} disabled={localStorage.getItem('enable') ? true : false}>
              Add Product
            </Button>
          )}
        </div>
        <DetailList />
        {this.state.visible == true ? <ProductTooltip visible={this.state.visible} showModal={this.showProduct} /> : <React.Fragment />}
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
