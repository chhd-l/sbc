import React from 'react';
import { Form, Input, Select, Spin, Row, Col, Button, message, AutoComplete, Modal, Alert, Radio } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Headline, cache, Const } from 'qmkit';
import { getAddressInputTypeSetting, getAddressFieldList, getCountryList, getStateList, getCityList, searchCity, getIsAddressValidation, validateAddress } from './webapi';
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
  isDefaltAddress?: number;
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
      addressInputType: '',
      isAddressValidation: false,
      validationModalVisisble: false,
      checkedAddress: 0,
      fields: {},
      suggestionAddress: {}
    };
    this.searchCity = _.debounce(this.searchCity, 500);
  }

  componentDidMount() {
    this.getDics();
  }

  getDics = async () => {
    const addressInputType = await getAddressInputTypeSetting();
    let fields = [];
    let isAddressValidation = false;
    if (addressInputType) {
      fields = await getAddressFieldList(addressInputType);
    }
    const countries = await getCountryList();
    const cities = await getCityList();
    const states = await getStateList();
    //MANUALLY类型的地址才去获取是否进行验证的配置
    if (addressInputType === 'MANUALLY') {
      isAddressValidation = await getIsAddressValidation();
    }
    this.setState({
      addressInputType: addressInputType,
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
                  fields: fields,
                  checkedAddress: 1,
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

  onChangeCheckedAddress = (checkedAddress: number) => {
    this.setState({
      checkedAddress: checkedAddress
    });
  };

  onCancelSuggestionModal = () => {
    this.setState({
      checkedAddress: 0,
      validationModalVisisble: false
    });
  };

  backToCustomerDetail = () => {
    const {
      backToDetail,
      form: { resetFields }
    } = this.props;
    resetFields();
    backToDetail();
  };

  saveAddress = () => {
    const { delivery } = this.props;
    const { checkedAddress, suggestionAddress } = this.state;
    const sugAddr = checkedAddress === 1 ? { province: suggestionAddress.provinceCode, city: suggestionAddress.city, address1: suggestionAddress.address1, address2: suggestionAddress.address2, postCode: suggestionAddress.postalCode } : {};
    this.props.form.validateFields((err, fields) => {
      console.log(fields);
      if (!err) {
        this.setState({ loading: true });
        const handlerFunc = delivery.deliveryAddressId ? updateAddress : addAddress;
        const rFields = { ...fields, ...sugAddr };
        handlerFunc({
          ...delivery,
          ...rFields,
          customerId: this.props.customerId,
          consigneeName: rFields.firstName + ' ' + rFields.lastName,
          deliveryAddress: [rFields.address1, rFields.address2].join(''),
          isDefaltAddress: delivery.isDefaltAddress || 0,
          type: this.props.addressType.toUpperCase()
        })
          .then((data) => {
            message.success(data.res.message);
            this.setState({ loading: false, validationModalVisisble: false });
            this.backToCustomerDetail();
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
        return <AutoComplete dataSource={this.state.searchCityList.map((city) => city.cityName)} onSearch={this.searchCity} />;
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

  //手机校验
  comparePhone = (rule, value, callback) => {
    if (!/^[0-9+-\s]{6,20}$/.test(value)) {
      callback('Please enter the correct phone');
    } else {
      callback();
    }
  };

  compareZip = (rule, value, callback) => {
    if (!/^[0-9]{3,10}$/.test(value)) {
      callback('Please enter the correct Post Code');
    } else {
      callback();
    }
  };

  render() {
    const { delivery, addressType } = this.props;
    const { fields, suggestionAddress, checkedAddress } = this.state;
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
                            rules: [
                              { required: field.requiredFlag === 1, message: `${field.fieldName} is required` },
                              { validator: field.fieldName === 'Phone number' ? this.comparePhone : (rule, value, callback) => callback() },
                              { validator: field.fieldName === 'Post code' ? this.compareZip : (rule, value, callback) => callback() }
                            ]
                          })(this.renderField(field))}
                        </Form.Item>
                      </Col>
                    ))}
                </Row>
              ))}
            </Form>
          </div>
          <div className="bar-button">
            <Button type="primary" onClick={() => this.validateAddress()}>
              Save
            </Button>
            <Button onClick={this.backToCustomerDetail} style={{ marginLeft: '20px' }}>
              Cancel
            </Button>
          </div>
          <Modal width={920} title="Verify your address" visible={this.state.validationModalVisisble} confirmLoading={this.state.loading} onCancel={this.onCancelSuggestionModal} onOk={this.saveAddress}>
            <Alert type="warning" message="We could not verify the address you provided, please confirm or edit your address to ensure prompt delivery." />
            <Row gutter={32} style={{ marginTop: 20 }}>
              <Col span={12}>
                <Radio checked={checkedAddress === 0} onClick={() => this.onChangeCheckedAddress(0)}>
                  <span className="text-highlight">Original Address</span>
                  <br />
                  <span style={{ paddingLeft: 26, wordBreak: 'break-word' }}>{[[fields.address1, fields.address2].join(''), fields.city, fields.state, fields.postCode].filter((fd) => !!fd).join(',')}</span>
                </Radio>
                <div style={{ paddingLeft: 10 }}>
                  <Button type="link" onClick={this.onCancelSuggestionModal}>
                    Edit
                  </Button>
                </div>
              </Col>
              <Col span={12}>
                <Radio checked={checkedAddress === 1} onClick={() => this.onChangeCheckedAddress(1)}>
                  <span className="text-highlight">Suggested Address</span>
                  <br />
                  <span style={{ paddingLeft: 26, wordBreak: 'break-word' }}>{[[suggestionAddress.address1, suggestionAddress.address2].join(''), suggestionAddress.city, suggestionAddress.provinceCode, suggestionAddress.postalCode].filter((fd) => !!fd).join(',')}</span>
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
