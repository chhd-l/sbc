import React from 'react';

import {
  Table,
  Col,
  Button,
  Select,
  Switch,
  Popconfirm,
  message,
  Modal
} from 'antd';
import { Relax } from 'plume2';
import { IMap, IList } from 'typings/globalType';
import DetailList from './list';
import ProductTooltip from './productTooltip';
import { cache, history, noop, SelectGroup, RCi18n, Const } from 'qmkit';
const Option = Select.Option;
//import moment from 'moment';

//import { Const, util } from 'qmkit';
//import { FormattedMessage } from 'react-intl';
//import { bool } from 'prop-types';
// let checkNum = 0;
// let check = true;
let loading = false;

@Relax
export default class BillingDetails extends React.Component<any, any> {
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
    };
  };

  static relaxProps = {
    settlement: 'settlement',
    setName: 'setName',
    onSharing: noop,
    onLinkStatus: noop,
    detailProductList: 'detailProductList',
    linkStatus: 'linkStatus',
    createLinkType: 'createLinkType'
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
      detailProductList,
      createLinkType,
      linkStatus
    } = this.props.relaxProps;
    const employee = JSON.parse(sessionStorage.getItem(cache.EMPLOYEE_DATA));
    const allPrescribers =
      employee && employee.prescribers && employee.prescribers.length > 0
        ? employee.prescribers
        : [];
    const check = +linkStatus === 0 ? true : false;

    loading = false;
    return (
      <div style={styles.main}>
        <div
          className="space-between"
          style={{ marginTop: 15, marginBottom: 10 }}
        >
          <div style={{ width: 150 }}>
            {history.location.state ? (
              <SelectGroup
                label={RCi18n({id:Const.SITE_NAME==='MYVETRECO'?'Menu.Clinic':'Order.Prescriber'})}
                disabled
                value={detailProductList.prescriberName}
              ></SelectGroup>
            ) : (
              <SelectGroup
                label={RCi18n({id:'Order.Prescriber'})}
                disabled={createLinkType}
                defaultValue={
                  sessionStorage.getItem('PrescriberType')
                    ? JSON.parse(sessionStorage.getItem('PrescriberType'))
                        .children
                    : null
                }
                onChange={(value, name) => this._prescriberChange(value, name)}
              >
                {allPrescribers.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.prescriberName}
                  </Option>
                ))}
              </SelectGroup>
            )}
          </div>
          <div style={{ marginTop: 12, marginRight: 15 }}>
            {history.location.state ? (
              <div className="proptContainer">
                <Popconfirm
                  title={RCi18n({id:'Order.stateTip'})}
                  onConfirm={() => this.confirm(check)}
                  onCancel={this.cancel}
                  getPopupContainer={(e) => document.body}
                  okText={RCi18n({id:'Order.yes'})}
                  cancelText={RCi18n({id:'Order.no'})}
                  className="proptMessage"
                >
                  <Switch
                    loading={loading}
                    checkedChildren={RCi18n({id:'Order.Valid'})}
                    unCheckedChildren={RCi18n({id:'Order.invalid'})}
                    checked={check}
                    // onChange={this.onValid}
                  />
                </Popconfirm>
              </div>
            ) : null}
          </div>
        </div>

        <div style={styles.nav}>
          {history.location.state
            ? RCi18n({id:'Order.RecommendedProductList'})
            : RCi18n({id:'Order.SelectRecommendedProduct'})}
        </div>
        <div style={styles.btn}>
          {history.location.state ? null : (
            <Button
              type="primary"
              shape="round"
              disabled={createLinkType}
              icon="edit"
              onClick={() => this.showProduct(true)}
            >
              {RCi18n({id:'Order.addProduct'})}
            </Button>
          )}
        </div>
        <DetailList />
        {this.state.visible == true ? (
          <ProductTooltip
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
