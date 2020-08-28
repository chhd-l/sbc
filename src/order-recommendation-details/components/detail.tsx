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
let checkNum = 0;
let check = true;

@Relax
export default class BillingDetails extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      check: true
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
    onSharing({
      field: 'prescriberId',
      value: employee.clinicsIds[0]
    });
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
  onValid = (e) => {
    const { onLinkStatus } = this.props.relaxProps;
    let linkStatus = e == true ? 0 : 1;

    onLinkStatus({ linkStatus, id: history.location.state.id });
  };

  render() {
    const { detailProductList, createLinkType } = this.props.relaxProps;
    const employee = JSON.parse(sessionStorage.getItem(cache.EMPLOYEE_DATA));
    const allPrescribers =
      employee && employee.prescribers && employee.prescribers.length > 0
        ? employee.prescribers
        : [];
    check =
      detailProductList && detailProductList.linkStatus == 0 ? true : false;

    return (
      <div style={styles.main}>
        <div
          className="space-between"
          style={{ marginTop: 15, marginBottom: 10 }}
        >
          <div style={{ width: 150 }}>
            {history.location.state ? (
              <SelectGroup
                label="Prescriber"
                disabled
                value={detailProductList.prescriberName}
              ></SelectGroup>
            ) : (
              <SelectGroup
                label="Prescriber"
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
                  <Option value={item.prescriberId} key={item.prescriberId}>
                    {item.prescriberName}
                  </Option>
                ))}
              </SelectGroup>
            )}
          </div>
          <div style={{ marginTop: 12, marginRight: 15 }}>
            {history.location.state ? (
              <Switch
                checkedChildren=" Valid "
                unCheckedChildren=" Invalid "
                key={check}
                defaultChecked={check}
                onChange={this.onValid}
              />
            ) : null}
          </div>
        </div>

        <div style={styles.nav}>
          {history.location.state
            ? 'Recommended Product List'
            : 'Select Recommended Product'}
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
              Add Product
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
