import React, { Component } from 'react';
import { Button, Spin } from 'antd';
import TaxesTable from '../components/taxes-table';
import TaxesAdd from '../components/taxes-add';

export default class StepTaxes extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dataList: [],

      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      addVisible: false,
      taxForm: {
        taxZoneName: '',
        taxZoneDescription: '',
        taxZoneType: '',
        zoneIncludes: '',
        taxRates: ''
      }
    };
  }

  componentDidMount() {
    this.init();
  }

  init = () => {
    this.getTaxList();
  };

  getTaxList = () => {
    let taxList = [
      {
        id: 1955,
        parentId: null,
        type: '1',
        name: '1',
        storeId: 123456858,
        Status: 0
      },
      {
        id: 1963,
        parentId: null,
        type: '1',
        name: '1',
        storeId: 123456858,
        Status: 1
      }
    ];
    this.setState({
      dataList: taxList
    });
  };
  openAddTaxPage = () => {
    this.setState({
      addVisible: true
    });
  };
  openEditTaxPage = () => {};
  openTaxSettingPage = () => {};

  render() {
    const { loading, dataList, pagination, addVisible, taxForm } = this.state;
    return (
      <Spin style={{ position: 'fixed', top: '30%', left: '100px' }} spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
        <div className="consent">
          <div className="taxes space-between">
            <Button className="btn" type="primary" shape="round" onClick={() => this.openAddTaxPage()}>
              Add tax zone
            </Button>
            <Button className="btn" shape="round" icon="setting" onClick={() => this.openTaxSettingPage()}>
              Tax setting
            </Button>
          </div>
          <div id="consent" className="consent-table">
            <TaxesTable dataList={dataList} pagination={pagination} />
            <TaxesAdd visible={addVisible} isEdit={false} taxForm={taxForm} />
          </div>
        </div>
      </Spin>
    );
  }
}
