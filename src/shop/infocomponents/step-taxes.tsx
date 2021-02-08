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
      },
      settingForm: {
        calculateTax: 0,
        enterPrice: 0,
        rewardCalculation: 0,
        promotionCalculation: 0
      },
      settingParams: []
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
        this.getSettingConfig();
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

  getSettingConfig = () => {
    webApi
      .getSystemConfig({ configType: 'tax_setting' })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let settingParams = res.context;
          let settingForm = {
            calculateTax: this.getSettingFormValue('calculate_tax_address_type', settingParams),
            enterPrice: this.getSettingFormValue('enter_price_type', settingParams),
            rewardCalculation: this.getSettingFormValue('reward_calculation', settingParams),
            promotionCalculation: this.getSettingFormValue('promotion_calculation', settingParams)
          };
          this.setState({
            settingParams,
            settingForm
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
  getSettingFormValue = (key, arr) => {
    let element = arr.find((item) => item.configKey === key);
    if (element) {
      return +element.context;
    } else {
      return 0;
    }
  };
  updateSettingConfig = (settingForm) => {
    const { settingParams } = this.state;
    for (let i = 0; i < settingParams.length; i++) {
      if (settingParams[i].configKey === 'calculate_tax_address_type') {
        settingParams[i].context = settingForm.calculateTax.toString();
      }
      if (settingParams[i].configKey === 'enter_price_type') {
        settingParams[i].context = settingForm.enterPrice.toString();
      }
      if (settingParams[i].configKey === 'reward_calculation') {
        settingParams[i].context = settingForm.rewardCalculation.toString();
      }
      if (settingParams[i].configKey === 'promotion_calculation') {
        settingParams[i].context = settingForm.promotionCalculation.toString();
      }
    }
    let params = {
      configRequestList: settingParams
    };
    webApi
      .ModifyConfig(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.closeAllModal(true);
          message.success(res.message || 'Operation successful');
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
    let zoneIncludes = [];
    if (row.taxZoneStateRels) {
      for (let i = 0; i < row.taxZoneStateRels.length; i++) {
        let element = row.taxZoneStateRels[i].stateId;
        zoneIncludes.push(element);
      }
    }

    let taxForm = {
      id: row.id,
      taxZoneName: row.taxZoneName,
      taxZoneDescription: row.description,
      taxZoneType: row.taxZoneType,
      zoneIncludes: zoneIncludes,
      taxRates: (row.taxRate * 100).toFixed(0)
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
          message.success(res.message || 'Operation successful');
          this.getTaxZoneList();
        } else {
          message.error(res.message || 'Operation failure');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'Operation failure');
      });
  };

  updateTaxStatus = (param) => {
    webApi
      .changeTaxZoneStatus(param)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(res.message || 'Operation successful');
          this.getTaxZoneList();
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

  render() {
    const { loading, dataList, pagination, addVisible, isEdit, settingVisible, taxForm, settingForm } = this.state;
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
            <TaxesTable dataList={dataList} pagination={pagination} editFunction={this.openEditTaxPage} tableChangeFunction={this.handleTableChange} deleteFunction={this.handleDetele} updateFunction={this.updateTaxStatus} />
            <TaxesAdd visible={addVisible} isEdit={isEdit} taxForm={taxForm} closeFunction={this.closeAllModal} />
            <TaxesSetting visible={settingVisible} settingForm={settingForm} closeFunction={this.closeAllModal} submitFunction={this.updateSettingConfig} />
          </div>
        </div>
      </Spin>
    );
  }
}
