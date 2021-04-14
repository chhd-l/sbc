import React from 'react';
import { Button, Modal, Form, Radio, Input, Select, Spin, InputNumber, message } from 'antd';
import _ from 'lodash';
import * as webApi from './../webapi';
import { Const } from 'qmkit';
import { FormattedMessage, injectIntl } from 'react-intl';
import { IList } from '../../../typings/globalType';
const FormItem = Form.Item;
const Option = Select.Option;
class TaxesAdd extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isEdit: false,
      loading: false,
      fetching: false,
      taxForm: {
        id: '',
        taxZoneName: '',
        taxZoneDescription: '',
        taxZoneType: 1,
        zoneIncludes: [],
        taxRates: ''
      },
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
      statesZoneIncludes: sessionStorage.getItem('currentCountry') ? [sessionStorage.getItem('currentCountry')] : [],
      countryZoneIncludes: []
    };
  }
  props: {
    intl: any;
  };
  componentDidMount() {
    this.getZoneList('');
  }

  static getDerivedStateFromProps(props, state) {
    // 当传入的值发生变化的时候，更新state
    if (JSON.stringify(props.taxForm) !== JSON.stringify(state.taxForm) || props.visible !== state.visible) {
      return {
        visible: props.visible,
        taxForm: props.taxForm,
        isEdit: props.isEdit
      };
    }

    return null;
  }

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

  handleCancel = () => {
    this.props.closeFunction(false);
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
  addTaxZone = (params) => {
    webApi
      .addTaxZone(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(res.message || RCi18n({ id: 'Setting.Operationsuccessful' }));
          this.props.closeFunction(true);
        } else {
          message.error(res.message || RCi18n({ id: 'Setting.Operationfailure' }));
        }
      })
      .catch((err) => {
        message.error(err.toString() || RCi18n({ id: 'Setting.Operationfailure' }));
      });
  };
  updateTaxZone = (params) => {
    webApi
      .editTaxZone(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(res.message || RCi18n({ id: 'Setting.Operationsuccessful' }));
          this.props.closeFunction(true);
        } else {
          message.error(res.message || RCi18n({ id: 'Setting.Operationfailure' }));
        }
      })
      .catch((err) => {
        message.error(err.toString() || RCi18n({ id: 'Setting.Operationfailure' }));
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
          message.error(res.message || RCi18n({ id: 'Setting.Operationfailure' }));
        }
      })
      .catch((err) => {
        this.setState({
          fetching: false
        });
        message.error(err.toString() || RCi18n({ id: 'Setting.Operationfailure' }));
      });
  };

  render() {
    const { visible, isEdit, loading, taxForm, taxZoneTypeList, fetching, zoneList } = this.state;
    const { getFieldDecorator } = this.props.form;
    this.props.form.resetFields();
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
    return (
      <Modal
        width={600}
        maskClosable={false}
        title={isEdit ? RCi18n({ id: 'Setting.Edittaxzone' }) : RCi18n({ id: 'Setting.Newtaxzone' })}
        visible={visible}
        confirmLoading={loading}
        onCancel={() => this.handleCancel()}
        // onOk={this.handleSubmit}
        // cancelText="Cancel"
        // okText="Submit"

        footer={[
          <Button
            key="back"
            onClick={() => {
              this.handleCancel();
            }}
          >
            {RCi18n({ id: 'Setting.Cancel' })}
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleSubmit}>
            {RCi18n({ id: 'Setting.Submit' })}
          </Button>
        ]}
      >
        <Form {...formItemLayout}>
          <FormItem label={RCi18n({ id: 'Setting.Taxzonename' })}>
            {getFieldDecorator('taxZoneName', {
              rules: [
                { required: true, message: RCi18n({ id: 'Setting.Taxzonenameisrequired' }) },
                {
                  max: 50,
                  message: RCi18n({ id: 'Setting.Exceedmaximumlength' })
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
          <FormItem label={RCi18n({ id: 'Setting.Taxzonedescription' })}>
            {getFieldDecorator('taxZoneDescription', {
              rules: [
                {
                  max: 500,
                  message: RCi18n({ id: 'Setting.Exceedmaximumlength' })
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
          <FormItem label={RCi18n({ id: 'Setting.Taxzonetype' })}>
            {getFieldDecorator('taxZoneType', {
              rules: [{ required: true, message: RCi18n({ id: 'Setting.Taxzonetypeisrequired' }) }],
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
          <FormItem label={RCi18n({ id: 'Setting.Zoneincludes' })}>
            {getFieldDecorator('zoneIncludes', {
              rules: [
                {
                  required: true,
                  message: RCi18n({ id: 'Setting.PleaseSelectzone' })
                }
              ],
              initialValue: taxForm.zoneIncludes
            })(
              <Select
                style={{ width: '80%' }}
                showSearch
                placeholder={RCi18n({ id: 'Setting.Selectzone' })}
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
          <FormItem label={RCi18n({ id: 'Setting.Taxrates' })}>
            {getFieldDecorator('taxRates', {
              rules: [{ required: true, message: RCi18n({ id: 'Setting.Taxratesisrequired' }) }],
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
    );
  }
}
export default Form.create()(injectIntl(TaxesAdd));
