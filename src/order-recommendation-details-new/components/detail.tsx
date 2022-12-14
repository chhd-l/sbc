import React from 'react';

import { Table, Col, Button, Select, Switch, Icon } from 'antd';
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

@Relax
export default class BillingDetails extends React.Component<any, any> {
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
      sharing: any;
    };
  };

  static relaxProps = {
    settlement: 'settlement',
    setName: 'setName',
    onSharing: noop,
    onLinkStatus: noop,
    detailProductList: 'detailProductList',
    sharing: 'sharing'
  };
  componentDidMount() {
    const { onSharing, sharing } = this.props.relaxProps;
    const employee = JSON.parse(sessionStorage.getItem(cache.EMPLOYEE_DATA));
    onSharing({
      field: 'prescriberId',
      value: sharing.get('prescriberId') ? sharing.get('prescriberId') : employee.prescribers[0].id
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
    const { detailProductList } = this.props.relaxProps;
    const { onSharing, sharing } = this.props.relaxProps;
    const employee = JSON.parse(sessionStorage.getItem(cache.EMPLOYEE_DATA));
    const allPrescribers = employee && employee.prescribers && employee.prescribers.length > 0 ? employee.prescribers : [];

    return (
      <div style={styles.main}>
        <div className="space-between" style={{ marginTop: 15, marginBottom: 10 }}>
          <div style={{ width: 150, margin: '0 auto' }}>
            {history.location.state ? (
              <SelectGroup label={RCi18n({id:Const.SITE_NAME==='MYVETRECO'?'Menu.Clinic':'Order.Prescriber'})} disabled={true} value={detailProductList.prescriberName} disabled={localStorage.getItem('enable') ? true : false}></SelectGroup>
            ) : (
              <SelectGroup label={RCi18n({id:Const.SITE_NAME==='MYVETRECO'?'Menu.Clinic':'Order.Prescriber'})} defaultValue={sharing.get('prescriberId') ? sharing.get('prescriberId') : employee.prescribers[0].id} disabled={localStorage.getItem('enable') ? true : false} onChange={(value, name) => this._prescriberChange(value, name)}>
                {allPrescribers.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.prescriberName}
                  </Option>
                ))}
              </SelectGroup>
            )}
          </div>
          <div style={{ marginTop: 12, marginRight: 105 }}>{history.location.state ? <Switch checkedChildren={RCi18n({id:'Order.Valid'})} unCheckedChildren={RCi18n({id:'Order.invalid'})} defaultChecked onClick={this.onValid} disabled={localStorage.getItem('enable') ? true : false} /> : null}</div>
        </div>
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
