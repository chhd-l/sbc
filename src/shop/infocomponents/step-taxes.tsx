import React, { Component } from 'react';
import { Button, Spin, Modal, message, Form, Input, Select, InputNumber } from 'antd';
import TaxesTable from '../components/taxes-table';
// import TaxesAdd from '../components/taxes-add';
import TaxesSetting from '../components/taxes-setting';
import _ from 'lodash';

import * as webApi from './../webapi';
import { Const } from 'qmkit';
const FormItem = Form.Item;
const Option = Select.Option;
class StepTaxes extends Component<any, any> {
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
      settingParams: [],
      taxZoneTypeList: [
        {
          value: 0,
          name: 'States based'
        },
        {
          value: 1,
          name: 'Country based'
        }
      ],
      zoneList: [],
      fetching: false,
      statesZoneIncludes: sessionStorage.getItem('currentCountry') ? [sessionStorage.getItem('currentCountry')] : [],
      countryZoneIncludes: []
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
        this.getZoneList('');
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
  handleCancel = () => {
    this.closeAllModal(false);
  };
  handleSubmit = () => {
    const { taxForm, isEdit } = this.state;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        let taxZoneStateRels = [];
        for (let i = 0; i < taxForm.zoneIncludes.length; i++) {
          let param = {
            stateId: taxForm.zoneIncludes[i]
          };
          taxZoneStateRels.push(param);
        }
        let params = {
          description: taxForm.taxZoneDescription,
          taxRate: (taxForm.taxRates / 100).toFixed(2),
          taxZoneName: taxForm.taxZoneName,
          taxZoneStateRels: +taxForm.taxZoneType ? [] : taxZoneStateRels,
          taxZoneType: taxForm.taxZoneType
        };
        if (isEdit) {
          params = Object.assign(params, {
            id: taxForm.id
          });
          this.updateTaxZone(params);
        } else {
          this.addTaxZone(params);
        }
      }
    });
  };
  onTaxFormChange = ({ field, value }) => {
    let data = this.state.taxForm;

    if (field === 'taxZoneType') {
      if (value) {
        data['zoneIncludes'] = this.state.statesZoneIncludes;
      } else {
        data['zoneIncludes'] = this.state.countryZoneIncludes;
      }
    }
    if (field === 'zoneIncludes') {
      this.setState({
        countryZoneIncludes: value
      });
    }
    data[field] = value;
    this.setState({
      taxForm: data
    });
  };
  getZoneList = (value) => {
    let params = {
      stateName: value,
      pageNum: 0,
      pageSize: 50
    };
    this.setState({
      fetching: true
    });
    webApi
      .getAddressList(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let zoneList = res.context.systemStates.content;
          this.setState({
            zoneList,
            fetching: false
          });
        } else {
          this.setState({
            fetching: false
          });
          message.error(res.message || 'Operation failure');
        }
      })
      .catch((err) => {
        this.setState({
          fetching: false
        });
        message.error(err.toString() || 'Operation failure');
      });
  };

  addTaxZone = (params) => {
    webApi
      .addTaxZone(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(res.message || 'Operation successful');
          this.closeAllModal(true);
        } else {
          message.error(res.message || 'Operation failure');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'Operation failure');
      });
  };
  updateTaxZone = (params) => {
    webApi
      .editTaxZone(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(res.message || 'Operation successful');
          this.closeAllModal(true);
        } else {
          message.error(res.message || 'Operation failure');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'Operation failure');
      });
  };

  render() {
    const { loading, dataList, pagination, addVisible, isEdit, settingVisible, taxForm, settingForm, taxZoneTypeList, zoneList, fetching } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
      }
    };
    const { getFieldDecorator } = this.props.form;
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
          </div>
          {/* <TaxesAdd visible={addVisible} isEdit={isEdit} taxForm={taxForm} closeFunction={this.closeAllModal} /> */}
          <TaxesSetting visible={settingVisible} settingForm={settingForm} closeFunction={this.closeAllModal} submitFunction={this.updateSettingConfig} />

          <Modal
            width={600}
            maskClosable={false}
            title={isEdit ? 'Edit tax zone' : 'New tax zone'}
            visible={addVisible}
            confirmLoading={loading}
            onCancel={() => this.handleCancel()}
            footer={[
              <Button
                key="back"
                onClick={() => {
                  this.handleCancel();
                }}
              >
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={this.handleSubmit}>
                Submit
              </Button>
            ]}
          >
            <Form {...formItemLayout}>
              <FormItem label="Tax zone name">
                {getFieldDecorator('taxZoneName', {
                  rules: [
                    { required: true, message: 'Tax zone name is required' },
                    {
                      max: 50,
                      message: 'Exceed maximum length!'
                    }
                  ],
                  initialValue: taxForm.taxZoneName
                })(
                  <Input
                    style={{ width: '80%' }}
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onTaxFormChange({
                        field: 'taxZoneName',
                        value
                      });
                    }}
                  />
                )}
              </FormItem>
              <FormItem label="Tax zone description">
                {getFieldDecorator('taxZoneDescription', {
                  rules: [
                    {
                      max: 500,
                      message: 'Exceed maximum length!'
                    }
                  ],
                  initialValue: taxForm.taxZoneDescription
                })(
                  <Input
                    style={{ width: '80%' }}
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onTaxFormChange({
                        field: 'taxZoneDescription',
                        value
                      });
                    }}
                  />
                )}
              </FormItem>
              <FormItem label="Tax zone type">
                {getFieldDecorator('taxZoneType', {
                  rules: [{ required: true, message: 'Tax zone type is required' }],
                  initialValue: taxForm.taxZoneType
                })(
                  <Select
                    style={{ width: '80%' }}
                    onChange={(value) => {
                      value = value === '' ? null : value;
                      this.onTaxFormChange({
                        field: 'taxZoneType',
                        value
                      });
                    }}
                  >
                    {taxZoneTypeList &&
                      taxZoneTypeList.map((item) => (
                        <Option value={item.value} key={item.value}>
                          {item.name}
                        </Option>
                      ))}
                  </Select>
                )}
              </FormItem>
              <FormItem label="Zone includes">
                {getFieldDecorator('zoneIncludes', {
                  rules: [
                    {
                      required: true,
                      message: 'Please Select zone!'
                    }
                  ],
                  initialValue: taxForm.zoneIncludes
                })(
                  <Select
                    style={{ width: '80%' }}
                    showSearch
                    placeholder="Select zone"
                    optionFilterProp="children"
                    mode="multiple"
                    disabled={taxForm.taxZoneType === 1}
                    onChange={(value) => {
                      this.onTaxFormChange({
                        field: 'zoneIncludes',
                        value
                      });
                    }}
                    notFoundContent={fetching ? <Spin size="small" /> : null}
                    onSearch={_.debounce(this.getZoneList, 500)}
                    filterOption={(input, option) => option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {zoneList &&
                      zoneList.map((item, index) => (
                        <Option value={item.id} key={index}>
                          {item.stateName}
                        </Option>
                      ))}
                  </Select>
                )}
              </FormItem>
              <FormItem label="Tax rates">
                {getFieldDecorator('taxRates', {
                  rules: [{ required: true, message: 'Tax rates is required' }],
                  initialValue: taxForm.taxRates ? taxForm.taxRates : 0
                })(
                  <InputNumber
                    style={{ width: '80%' }}
                    min={0}
                    max={100}
                    formatter={(value) => `${value}%`}
                    parser={(value) => value.replace('%', '')}
                    onChange={(value) => {
                      this.onTaxFormChange({
                        field: 'taxRates',
                        value
                      });
                    }}
                  />
                )}
              </FormItem>
            </Form>
          </Modal>
        </div>
      </Spin>
    );
  }
}
export default Form.create()(StepTaxes);
