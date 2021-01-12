import React from 'react';
import { Button, Modal, Form, Radio, Input, Select, Spin, InputNumber } from 'antd';
import _ from 'lodash';

const FormItem = Form.Item;
const Option = Select.Option;
class TaxesAdd extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isEdit: this.props.isEdit,
      loading: false,
      fetching: false,
      taxForm: {
        taxZoneName: '',
        taxZoneDescription: '',
        taxZoneType: '',
        zoneIncludes: '',
        taxRates: ''
      },
      taxZoneTypeList: [
        {
          value: 'statesBased',
          name: 'States based'
        },
        {
          value: 'countryBased',
          name: 'Country based'
        }
      ],
      zoneList: []
    };
  }
  componentDidMount() {}

  static getDerivedStateFromProps(props, state) {
    // 当传入的值发生变化的时候，更新state
    if (JSON.stringify(props.taxForm) !== JSON.stringify(state.taxForm) || props.visible !== state.visible) {
      return {
        visible: props.visible,
        taxForm: props.taxForm
      };
    }

    return null;
  }

  handleSubmit = () => {};

  handleCancel = () => {};

  onTaxFormChange = ({ field, value }) => {
    let data = this.state.taxForm;
    data[field] = value;
    this.setState({
      taxForm: data
    });
  };
  getZoneList = () => {};

  render() {
    const { visible, isEdit, loading, taxForm, taxZoneTypeList, fetching, zoneList } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    return (
      <Modal
        maskClosable={false}
        zIndex={1000}
        title={isEdit ? 'Edit tax zone' : 'New tax zone'}
        visible={visible}
        confirmLoading={loading}
        onCancel={() =>
          this.setState({
            visible: false
          })
        }
        footer={[
          <Button
            key="back"
            onClick={() => {
              this.setState({
                visible: false
              });
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
            {getFieldDecorator('objectNo', {
              rules: [
                {
                  required: true,
                  message: 'Please Select zone!'
                },
                {
                  max: 50,
                  message: 'Exceed maximum length!'
                }
              ]
            })(
              <Select
                showSearch
                placeholder="Select zone"
                optionFilterProp="children"
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
