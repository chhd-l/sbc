import React, { Component } from 'react';
import { Button, Spin, Modal } from 'antd';
import TaxesTable from '../components/taxes-table';
import TaxesAdd from '../components/taxes-add';
import TaxesSetting from '../components/taxes-setting';

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
      isEdit: false,
      settingVisible: false,
      taxForm: {
        id: '',
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
    let pagination = {
      current: 1,
      pageSize: 10,
      total: 0
    };
    this.setState(
      {
        pagination: pagination
      },
      () => {
        this.getTaxList();
      }
    );
  };

  handleTableChange = (pagination) => {
    debugger;
    this.setState(
      {
        pagination: pagination
      },
      () => {
        this.getTaxList();
      }
    );
  };

  getTaxList = () => {
    const { pagination } = this.state;
    console.log(pagination);

    let taxList = [
      {
        id: 1982,
        taxZoneName: 'test_1',
        taxZoneDescription: 'test_1',
        taxZoneType: 'statesBased',
        zoneIncludes: '',
        taxRates: 0.12,
        status: 0
      },
      {
        id: 1983,
        taxZoneName: 'test_3',
        taxZoneDescription: 'test_3',
        taxZoneType: 'countryBased',
        zoneIncludes: '',
        taxRates: 0.15,
        status: 1
      }
    ];
    this.setState({
      dataList: taxList,
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: 2
      }
    });
  };
  openAddTaxPage = () => {
    let taxForm = {
      id: '',
      taxZoneName: '',
      taxZoneDescription: '',
      taxZoneType: '',
      zoneIncludes: '',
      taxRates: ''
    };
    this.setState({
      addVisible: true,
      isEdit: false,
      taxForm
    });
  };
  closeAllModal = () => {
    this.setState({
      addVisible: false,
      settingVisible: false
    });
  };

  openEditTaxPage = (row) => {
    let taxForm = {
      id: row.id,
      taxZoneName: row.taxZoneName,
      taxZoneDescription: row.taxZoneDescription,
      taxZoneType: row.taxZoneType,
      zoneIncludes: row.zoneIncludes,
      taxRates: row.taxRates
    };
    this.setState({
      addVisible: true,
      isEdit: true,
      taxForm
    });
  };
  openTaxSettingPage = () => {
    this.setState({
      settingVisible: true
    });
  };

  render() {
    const { loading, dataList, pagination, addVisible, isEdit, settingVisible, taxForm } = this.state;
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
            <TaxesTable dataList={dataList} pagination={pagination} editFunction={this.openEditTaxPage} tableChangeFunction={this.handleTableChange} />
            <TaxesAdd visible={addVisible} isEdit={isEdit} taxForm={taxForm} closeFunction={this.closeAllModal} />
            <TaxesSetting visible={settingVisible} closeFunction={this.closeAllModal} />
          </div>
        </div>
      </Spin>
    );
  }
}
