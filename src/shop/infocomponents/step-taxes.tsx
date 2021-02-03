import React, { Component } from 'react';
import { Button, Spin, Modal, message } from 'antd';
import TaxesTable from '../components/taxes-table';
import TaxesAdd from '../components/taxes-add';
import TaxesSetting from '../components/taxes-setting';

import * as webApi from './../webapi';
import { Const } from 'qmkit';
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
        this.getTaxZoneList();
      }
    );
  };

  handleTableChange = (pagination) => {
    this.setState(
      {
        pagination: pagination
      },
      () => {
        this.getTaxZoneList();
      }
    );
  };

  getTaxZoneList = () => {
    const { pagination } = this.state;
    let params = {
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize
    };
    this.setState({
      loading: true
    });

    webApi
      .getTaxZoneList(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let tempObj = res.context.taxZones;
          let taxList = tempObj.content;

          this.setState({
            dataList: taxList,
            loading: false,
            pagination: {
              current: tempObj.number + 1,
              pageSize: tempObj.size,
              total: tempObj.total
            }
          });
        } else {
          this.setState({
            loading: false
          });
          message.error(res.message || 'Operation failure');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.toString() || 'Operation failure');
      });
  };
  openAddTaxPage = () => {
    let zoneIncludes = [];
    let currentCountry = sessionStorage.getItem('currentCountry') || '';
    if (currentCountry) {
      zoneIncludes.push(currentCountry);
    }

    let taxForm = {
      id: '',
      taxZoneName: '',
      taxZoneDescription: '',
      taxZoneType: 1,
      zoneIncludes: zoneIncludes,
      taxRates: ''
    };
    this.setState({
      addVisible: true,
      isEdit: false,
      taxForm
    });
  };
  closeAllModal = (isRefresh) => {
    let taxForm = {
      id: '',
      taxZoneName: '',
      taxZoneDescription: '',
      taxZoneType: 0,
      zoneIncludes: [],
      taxRates: ''
    };
    this.setState({
      addVisible: false,
      settingVisible: false,
      taxForm
    });
    if (isRefresh) {
      this.getTaxZoneList();
    }
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
  handleDetele = (id) => {
    this.setState({
      loading: true
    });
    webApi
      .deleteTaxZone({ id })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.error(res.message || 'Operation successful');
          this.getTaxZoneList();
        } else {
          message.error(res.message || 'Operation failure');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'Operation failure');
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
            <TaxesTable dataList={dataList} pagination={pagination} editFunction={this.openEditTaxPage} tableChangeFunction={this.handleTableChange} deleteFunction={this.handleDetele} />
            <TaxesAdd visible={addVisible} isEdit={isEdit} taxForm={taxForm} closeFunction={this.closeAllModal} />
            <TaxesSetting visible={settingVisible} closeFunction={this.closeAllModal} />
          </div>
        </div>
      </Spin>
    );
  }
}
