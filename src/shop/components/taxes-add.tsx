import React from 'react';
import { Button, Modal, Form, Radio, Input, Select, Spin, InputNumber, message } from 'antd';
import _ from 'lodash';
import * as webApi from './../webapi';
import { Const } from 'qmkit';

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
  componentDidMount() {}

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
        let params = {
          description: taxForm.taxZoneDescription,
          taxRate: taxForm.taxRates,
          taxZoneName: taxForm.taxZoneName,
          taxZoneStateRels: taxForm.zoneIncludes,
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
        data['zoneIncludes'] = this.state.countryZoneIncludes;
      } else {
        data['zoneIncludes'] = this.state.statesZoneIncludes;
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
          message.success(res.message || 'Operation successful');
          this.props.closeFunction(true);
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
          this.props.closeFunction(true);
        } else {
          message.error(res.message || 'Operation failure');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'Operation failure');
      });
  };

  getZoneList = () => {};

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
        zIndex={1000}
        title={isEdit ? 'Edit tax zone' : 'New tax zone'}
        visible={visible}
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
          <Button key="submit" type="primary" onClick={() => this.handleSubmit()}>
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
                      {item.name}
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
    );
  }
}
export default Form.create()(TaxesAdd);
