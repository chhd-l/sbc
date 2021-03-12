import React from 'react';
import { Form, Input, Select, Spin, Row, Col, Button, message, AutoComplete, Modal, Alert, Radio } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Headline, cache, Const } from 'qmkit';
import { getAddressFieldList, getCountryList, getStateList, getCityList, searchCity, getIsAddressValidation, validateAddress } from './webapi';
import { updateAddress, addAddress } from '../webapi';
import _ from 'lodash';

const { Option } = Select;

type TDelivery = {
  deliveryAddressId?: string;
  firstName?: string;
  lastName?: string;
  consigneeNumber?: string;
  postCode?: string;
  countryId?: number;
  province?: string;
  city?: string;
  address1?: string;
  address2?: string;
  rfc?: string;
};

interface Iprop extends FormComponentProps {
  delivery: TDelivery;
  customerId: string;
  addressType: string;
  backToDetail?: Function;
}

const FORM_FIELD_MAP = {
  'First name': 'firstName',
  'Last name': 'lastName',
  Country: 'countryId',
  Region: 'region',
  State: 'province',
  City: 'city',
  Address1: 'address1',
  Address2: 'address2',
  'Phone number': 'consigneeNumber',
  'Post code': 'postCode',
  Entrance: 'entrance',
  Apartment: 'apartment',
  Comment: 'rfc'
};

class DeliveryItem extends React.Component<Iprop, any> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      storeId: JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).storeId || '',
      loading: false,
      formFieldList: [],
      countryList: [],
      stateList: [],
      cityList: [],
      searchCityList: [],
      isAddressValidation: false,
      validationModalVisisble: false,
      suggestionAddress: {}
    };
  }

  componentDidMount() {
    this.getDics();
  }

  getDics = async () => {
    const fields = await getAddressFieldList();
    const countries = await getCountryList();
    const cities = await getCityList();
    const states = await getStateList();
    const isAddressValidation = await getIsAddressValidation();
    this.setState({
      formFieldList: fields,
      countryList: countries,
      stateList: states.map((t) => ({ id: t.id, name: t.stateName })),
      cityList: cities,
      isAddressValidation: isAddressValidation
    });
  };

  validateAddress = () => {
    if (this.state.isAddressValidation) {
      this.props.form.validateFields((err, fields) => {
        if (!err) {
          this.setState({ loading: true });
          validateAddress({
            ...fields,
            deliveryAddress: [fields.address1, fields.address2].join('')
          })
            .then((data) => {
              if (data.res.code === Const.SUCCESS_CODE) {
                this.setState({
                  loading: false,
                  validationModalVisisble: true,
                  suggestionAddress: data.res.context.suggestionAddress
                });
              } else {
                this.setState({
                  loading: false
                });
              }
            })
            .catch(() => {
              this.setState({
                loading: false
              });
            });
        }
      });
    } else {
      this.saveAddress();
    }
  };

  saveAddress = () => {
    const { delivery, backToDetail } = this.props;
    this.props.form.validateFields((err, fields) => {
      console.log(fields);
      if (!err) {
        this.setState({ loading: true });
        const handlerFunc = delivery.deliveryAddressId ? updateAddress : addAddress;
        handlerFunc({
          ...delivery,
          ...fields,
          customerId: this.props.customerId,
          consigneeName: fields.firstName + ' ' + fields.lastName,
          deliveryAddress: [fields.address1, fields.address2].join(''),
          isDefaltAddress: 0,
          type: this.props.addressType.toUpperCase()
        })
          .then((data) => {
            message.success(data.res.message);
            backToDetail();
          })
          .catch(() => {
            this.setState({ loading: false });
          });
      }
    });
  };

  searchCity = (txt: string) => {
    searchCity(txt).then((data) => {
      this.setState({
        searchCityList: data.res.context.systemCityVO
      });
    });
  };

  renderField = (field: any) => {
    if (field.fieldName === 'Address1') {
      if (field.inputSearchBoxFlag === 1) {
        return <AutoComplete />;
      } else {
        return <Input />;
      }
    }
    if (field.fieldName === 'City') {
      if (field.inputDropDownBoxFlag === 1) {
        return (
          <Select showSearch>
            {this.state.cityList.map((city, idx) => (
              <Option value={city.name} key={idx}>
                {city.name}
              </Option>
            ))}
          </Select>
        );
      } else {
        return <AutoComplete dataSource={this.state.searchCityList.map((city) => city.cityName)} onSearch={_.debounce(this.searchCity, 500)} />;
      }
    }
    const optionList = field.fieldName === 'Country' ? this.state.countryList : field.fieldName === 'State' ? this.state.stateList : [];
    if (field.inputDropDownBoxFlag === 1) {
      return (
        <Select showSearch>
          {optionList.map((item, idx) => (
            <Option value={field.fieldName === 'Country' ? item.id : item.name} key={idx}>
              {item.name}
            </Option>
          ))}
        </Select>
      );
    }
    if (field.inputFreeTextFlag === 1) {
      return <Input />;
    }
    return null;
  };

  render() {
    const { delivery, addressType, backToDetail } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = (col: number) => ({
      labelCol: {
        xs: { span: 24 },
        sm: { span: col === 2 ? 8 : 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: col === 2 ? 12 : 18 }
      }
    });
    return (
      <div>
        <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px', position: 'fixed', marginLeft: '5%' }} alt="" />}>
          <div className="container">
            <Headline title={`${delivery.deliveryAddressId ? 'Edit' : 'Add'} ${addressType === 'delivery' ? 'delivery' : 'billing'} information`} />
            <Form>
              {this.state.formFieldList.map((fieldRow, rowIdx) => (
                <Row key={rowIdx}>
                  {fieldRow &&
                    fieldRow.length &&
                    fieldRow.map((field, colIdx) => (
                      <Col span={24 / fieldRow.length} key={colIdx}>
                        <Form.Item {...formItemLayout(fieldRow.length)} label={field.fieldName}>
                          {getFieldDecorator(`${FORM_FIELD_MAP[field.fieldName]}`, {
                            initialValue: delivery[FORM_FIELD_MAP[field.fieldName]],
                            rules: [{ required: field.requiredFlag === 1, message: `${field.fieldName} is required` }]
                          })(this.renderField(field))}
                        </Form.Item>
                      </Col>
                    ))}
                </Row>
              ))}
            </Form>
          </div>
          <div className="bar-button">
            <Button type="primary" onClick={() => this.saveAddress()}>
              Save
            </Button>
            <Button onClick={() => backToDetail()} style={{ marginLeft: '20px' }}>
              Cancel
            </Button>
          </div>
          <Modal title="Verify your address" visible={this.state.validationModalVisisble}>
            <Alert type="warning" message="We could not verify the address you provided, please confirm or edit your address to ensure prompt delivery." />
            <Row gutter={16}>
              <Col span={12}>
                <Radio checked={false}>
                  <div className="text-highlight">Original Address</div>
                </Radio>
              </Col>
              <Col span={12}>
                <Radio checked={false}>
                  <div className="text-highlight">Suggested Address</div>
                </Radio>
              </Col>
            </Row>
          </Modal>
        </Spin>
      </div>
    );
  }
}

export default Form.create<Iprop>()(DeliveryItem);
