import React from 'react';
import { Form, Input, Select, Spin, Row, Col, Button, message, AutoComplete, Modal, Alert, Radio } from 'antd';
import { FormattedMessage } from 'react-intl';
import { FormComponentProps } from 'antd/lib/form';
import { Headline, cache, Const, RCi18n } from 'qmkit';
import { getAddressInputTypeSetting, getAddressFieldList, getCountryList, getStateList, getCityList, searchCity, getSuggestionOrValidationMethodName, validateAddress, getRegionListByCityId, getAddressListByDadata, validateAddressScope, getSuggestionAddressListByDQE, returnDQE } from './webapi';
import { updateAddress, addAddress, validPostCodeBlock } from '../webapi';
import _ from 'lodash';
import IMask from 'imask';


const { Option } = Select;

type TDelivery = {
  deliveryAddressId?: string;
  firstName?: string;
  lastName?: string;
  firstNameKatakana?: string;
  lastNameKatakana?: string;
  consigneeNumber?: string;
  postCode?: string;
  countryId?: number;
  province?: string;
  city?: string;
  address1?: string;
  address2?: string;
  rfc?: string;
  isDefaltAddress?: number;
  provinceIdStr?: string;
  areaIdStr?: string;
  cityIdStr?: string;
  settlementIdStr?: string;
};

interface Iprop extends FormComponentProps {
  delivery: TDelivery;
  customerId: string;
  addressType: string;
  backToDetail?: Function;
  fromPage?: string;
  pickupEditNumber?: number;
  updatePickupEditNumber?: (num: number) => void;
}

export const FORM_FIELD_MAP = {
  'First name': 'firstName',
  'Last name': 'lastName',
  'Last name katakana': 'lastNameKatakana',
  'First name katakana': 'firstNameKatakana',
  Country: 'countryId',
  Region: 'area',
  State: 'province',
  City: 'city',
  Address1: 'address1',
  Address2: 'address2',
  'Phone number': 'consigneeNumber',
  'Postal code': 'postCode',
  Entrance: 'entrance',
  Apartment: 'apartment',
  Comment: 'rfc',
  County: 'county'
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
      regionList: [],
      addressInputType: '',
      suggestionMethodName: 'FGS',
      validationMethodName: 'FGS',
      isAddress1ApplySuggestion: false,
      isAddress1ApplyValidation: false,
      validationModalVisisble: false,
      validationSuccess: false,
      checkedAddress: 0,
      fields: {},
      suggestionAddress: {},
      searchAddressList: [],
      dadataAddress: {}, //用来验证俄罗斯地址是不是在配送范围
      suggestionOpen: false  //手动控制建议地址的展开或关闭
    };
    this.searchCity = _.debounce(this.searchCity, 500);
    this.searchAddress = _.debounce(this.searchAddress, 200);
  }

  componentDidMount() {
    this.getDics();
  }

  getDics = async () => {
    this.setState({ loading: true });
    const addressInputType = await getAddressInputTypeSetting();
    let fields = [];
    let states = [];
    let cities = [];
    let regions = [];
    if (addressInputType) {
      fields = await getAddressFieldList(addressInputType);
    }
    const countries = await getCountryList();
    if (fields.find(ad => ad.fieldName === 'City' && ad.inputDropDownBoxFlag === 1)) {
      cities = await getCityList();
      if (fields.find(ad => ad.fieldName === 'Region' && ad.inputDropDownBoxFlag === 1) && this.props.delivery.city) {
        const regionRes = await getRegionListByCityId((cities.find((ci) => ci.cityName === this.props.delivery.city) || {})['id'] || 0);
        if (regionRes.res.code === Const.SUCCESS_CODE) {
          regions = regionRes.res.context.systemRegions.map((r) => ({ id: r.id, name: r.regionName }));
        }
      }
    }
    if (fields.find(ad => ad.fieldName === 'State' && ad.inputDropDownBoxFlag === 1)) {
      states = await getStateList();
    }
    //获取suggestion和validation的配置
    let [suggestionMethodName, validationMethodName] = await Promise.all([getSuggestionOrValidationMethodName(1), getSuggestionOrValidationMethodName(0)]);
    //AUTOMATICALLY类型地址读取address1的suggestionFlag和validationFlag
    let isAddress1ApplySuggestion = false, isAddress1ApplyValidation = false;
    if (addressInputType === 'AUTOMATICALLY') {
      const address1 = fields.find(ad => ad.fieldKey === 'address1') ?? {};
      isAddress1ApplySuggestion = address1.suggestionFlag === 1;
      isAddress1ApplyValidation = address1.validationFlag === 1;
    }
    this.setState({
      loading: false,
      addressInputType: addressInputType,
      formFieldList: fields,
      countryList: countries,
      stateList: states.map((t) => ({ id: t.id, name: t.stateName })),
      cityList: cities,
      regionList: regions,
      suggestionMethodName,
      validationMethodName,
      isAddress1ApplySuggestion,
      isAddress1ApplyValidation
    }, () => {
      // this.setPhoneNumberReg();
      //设置默认country
      if (!this.props.delivery.countryId && countries.length === 1) {
        this.props.form.setFieldsValue({ countryId: countries[0]['id'] });
      }
    });
  };

  validateAddress = () => {
    this.setState({ loading: true });
    //us fedex进行弹框显示建议地址
    if (this.state.suggestionMethodName === 'FEDEX') {
      this.props.form.validateFields((err, fields) => {
        if (!err) {
          validateAddress({
            ...fields,
            countryId: this.state.countryList[0]?.id,
            deliveryAddress: [fields.address1, fields.address2].join(''),
            addressApiType: 1
          })
            .then((data) => {
              if (data.res.code === Const.SUCCESS_CODE) {
                this.setState({
                  loading: false,
                  validationModalVisisble: true,
                  fields: fields,
                  checkedAddress: 1,
                  suggestionAddress: data.res.context.suggestionAddress,
                  validationSuccess: data.res.context.validationResult
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

  getRegionListByCity = (type: number, city: any) => {
    let cityId = 0;
    if (type === 1) {
      cityId = (this.state.cityList.find((ci) => ci.cityName === city) || {})['id'] || 0;
    } else {
      cityId = (this.state.searchCityList.find((ci) => ci.cityName === city) || {})['id'] || 0;
    }
    getRegionListByCityId(cityId).then((data) => {
      if (data.res.code === Const.SUCCESS_CODE) {
        this.setState({
          regionList: data.res.context.systemRegions.map((r) => ({ id: r.id, name: r.regionName }))
        });
      }
    });
    if (this.props.form.getFieldValue('region')) {
      this.props.form.setFieldsValue({ region: '' });
    }
  };

  backToCustomerDetail = () => {
    const {
      backToDetail,
      form: { resetFields }
    } = this.props;
    resetFields();
    backToDetail();
  };

  saveAddress = async () => {
    const { delivery } = this.props;
    const { checkedAddress, suggestionAddress, dadataAddress, suggestionMethodName, isAddress1ApplyValidation } = this.state;
    const sugAddr = checkedAddress === 1 ? { province: suggestionAddress.provinceCode, city: suggestionAddress.city, address1: suggestionAddress.address1, address2: suggestionAddress.address2, postCode: suggestionAddress.postalCode } : {};

    if (dadataAddress) {
      // 保存DuData中的各种Id
      delivery.provinceIdStr = dadataAddress?.provinceId;
      delivery.areaIdStr = dadataAddress?.areaId;
      delivery.cityIdStr = dadataAddress?.cityId;
      delivery.settlementIdStr = dadataAddress?.settlementId;
    }

    this.props.form.validateFields(async (err, fields) => {
      if (!err) {
        this.setState({ loading: true });
        const handlerFunc = delivery.deliveryAddressId ? updateAddress : addAddress;
        const rFields = { ...fields, ...sugAddr };

        //俄罗斯地址修改了才去调是否在配送范围的验证
        if (isAddress1ApplyValidation && suggestionMethodName === 'DADATA' && delivery.address1 !== fields.address1) {

          const validStatus = await validateAddressScope({
            regionFias: dadataAddress.provinceId || null,
            areaFias: dadataAddress.areaId || null,
            cityFias: dadataAddress.cityId || null,
            settlementFias: dadataAddress.settlementId || null,
            postalCode: dadataAddress.postCode || null
          });
          if (!validStatus) {
            this.props.form.setFields({
              address1: {
                value: fields['address1'],
                errors: [new Error(RCi18n({ id: "PetOwner.addressWithinAlert" }))]
              }
            });
            this.setState({ loading: false });
            return;
          }
        }
        //俄罗斯地址验证地址是否齐全
        if (isAddress1ApplyValidation && suggestionMethodName === 'DADATA' && delivery.address1 === fields.address1 && (!delivery.street || !delivery.postCode || !delivery.house || !delivery.city)) {
          const errTip = !delivery.street
            ? new Error(RCi18n({ id: 'PetOwner.AddressStreetTip' }))
            : !delivery.postCode
              ? new Error(RCi18n({ id: 'PetOwner.AddressPostCodeTip' }))
              : !delivery.house
                ? new Error(RCi18n({ id: 'PetOwner.AddressHouseTip' }))
                : new Error(RCi18n({ id: 'PetOwner.AddressCityTip' }));
          this.props.form.setFields({
            address1: {
              value: fields['address1'],
              errors: [errTip]
            }
          });
          this.setState({ loading: false });
          return;
        }

        delivery['receiveType'] = "HOME_DELIVERY"; // 必须字段

        handlerFunc({
          ...delivery,
          ...(dadataAddress.unrestrictedValue ? {
            country: dadataAddress.countryCode || '',
            countryId: (this.state.countryList[0] ?? {}).id ?? '',
            province: dadataAddress.province || '',
            provinceId: null,
            city: dadataAddress.city || '',
            cityId: null,
            area: dadataAddress.area || '',
            housing: dadataAddress.block || '',
            house: dadataAddress.house || '',
            settlement: dadataAddress.settlement || '',
            street: dadataAddress.street || '',
            postCode: rFields.postCode || dadataAddress.postCode,
          } : {
            country: (this.state.countryList[0] ?? {}).value ?? '',
            countryId: (this.state.countryList[0] ?? {}).id ?? '',
            provinceId: rFields.province ? (this.state.stateList.find(st => st.name === rFields.province) ?? {})['id'] : null
          }),
          ...rFields,
          cityId: rFields.city ? ((this.state.cityList.concat(this.state.searchCityList)).find(st => st.cityName === rFields.city) ?? {})['id'] : undefined,
          areaId: rFields.area ? (this.state.regionList.find(st => st.name === rFields.area) ?? {})['id'] : undefined,
          customerId: this.props.customerId,
          consigneeName: rFields.firstName + ' ' + rFields.lastName,
          deliveryAddress: [rFields.address1, rFields.address2].join(''),
          isDefaltAddress: delivery.isDefaltAddress || 0,
          type: this.props.addressType.toUpperCase()
        })
          .then((data) => {

            if (this.props.fromPage === 'subscription') {
              // 更新pickup编辑次数
              let pknum = Number(this.props.pickupEditNumber) + 1;
              this.props.updatePickupEditNumber(pknum);
            }

            message.success(data.res.message);
            this.setState({ loading: false, validationModalVisisble: false });
            this.backToCustomerDetail();
          })
          .catch(() => {
            this.setState({ loading: false });
          });
      } else {
        this.setState({ loading: false });
      }
    });
  };

  searchCity = (txt: string) => {
    txt.trim() !== '' && searchCity(txt).then((data) => {
      if (data.res.code === Const.SUCCESS_CODE) {
        this.setState({
          searchCityList: data.res.context.systemCityVO
        });
      }
    });
  };

  searchAddress = (txt: string) => {
    const { suggestionMethodName, isAddress1ApplySuggestion } = this.state;
    if (isAddress1ApplySuggestion && txt !== '') {
      if (suggestionMethodName === 'DADATA') { 
        getAddressListByDadata(txt).then((data) => {
          if (data.res.code === Const.SUCCESS_CODE) {
            this.setState({
              searchAddressList: data.res.context.addressList,
              suggestionOpen: true
            });
          }
        });
      } else if (suggestionMethodName === 'DQE') {
        getSuggestionAddressListByDQE(txt).then(data => {
          if (data.res.code === Const.SUCCESS_CODE) {
            this.setState({
              searchAddressList: (data.res.context ?? [])
                .reduce((prev, curr) => {   //根据label去重
                  if (prev.findIndex(t => t.label === curr.label) === -1) {
                    prev.push(curr);
                  }
                  return prev;
                }, [])
                .map(addr => ({
                  ...addr,
                  unrestrictedValue: addr.label,
                  selectedListeNumero: '',
                  postCode: addr.codePostal,
                  city: addr.localite,
                  state: addr.county,
                  street: addr.voie
                })),
              suggestionOpen: true
            });
          }
        });
      }
    }
  };

  onSelectRuAddress = (val: string) => {
    let { suggestionMethodName, searchAddressList } = this.state;
    const address = searchAddressList.find(addr => addr.unrestrictedValue === val);
    let suggestionOpen = false;
    if (address) {
      if (suggestionMethodName === 'DADATA') {
        this.props.form.setFieldsValue({ postCode: address.postCode || '', entrance: address.entrance || '', apartment: address.flat || '' });
      } else if (suggestionMethodName === 'DQE') {
        this.props.form.setFieldsValue({ postCode: address.postCode || '', city: address.city || '', address1: address.address1, county: address.county });
        if (address.selectedListeNumero || address.listeNumero.indexOf(';') === -1) {
          returnDQE(address.idvoie, address.pays, address.selectedListeNumero || address.listeNumero);
        } else {
          //删除一级地址, 然后用解析的二级地址作为候选
          // const addressIndex = searchAddressList.findIndex(addr => addr.unrestrictedValue === val);
          // searchAddressList.splice(addressIndex, 1);
          searchAddressList = address.listeNumero.split(';').map(item => ({
            ...address,
            unrestrictedValue: `${item} ${address.unrestrictedValue}`,
            address1: `${item} ${address.address1}`,
            selectedListeNumero: item
          }));
          suggestionOpen = true;
        }
      }
      this.setState({
        searchAddressList,
        dadataAddress: address,
        suggestionOpen
      });
    }
  };

  onCheckRuAddress = () => {
    const { suggestionMethodName } = this.state;
    const address1 = this.props.form.getFieldValue('address1');
    const address = this.state.searchAddressList.find(addr => addr.unrestrictedValue === address1);
    if (!address && suggestionMethodName === 'DADATA') { //dadata 必须选择列表中的一个地址
      this.props.form.setFieldsValue({ address1: this.props.delivery.address1 });
    }
    this.setState({ suggestionOpen: false });
  };

  // 设置手机号输入限制
  setPhoneNumberReg = () => {
    const { storeId } = this.state;
    let element = document.getElementById('consigneeNumber');
    let maskOptions: any;
    let phoneReg = null;
    switch (storeId) {
      case 123457909:
        phoneReg = [
          { mask: '(+33) 0 00 00 00 00' },
          { mask: '(+33) 00 00 00 00 00' }
        ];
        break;
      case 123457910:
        phoneReg = [{ mask: '000-000-0000' }];
        break;
      case 123457907:
        phoneReg = [{ mask: '+{7} (000) 000-00-00' }];
        break;
      case 123456858:
        phoneReg = [{ mask: '+(52) 000 000 0000' }];
        break;
      case 123457911:
        phoneReg = [{ mask: '{0} (000) 000-00-00' }];
        break;
      default:
        phoneReg = [{ mask: '00000000000' }];
        break;
    }
    maskOptions = {
      mask: phoneReg
    };
    IMask(element, maskOptions);
  };

  renderField = (field: any) => {
    if (field.fieldName === 'Address1') {
      if (field.inputSearchBoxFlag === 1) {
        return (
          <AutoComplete open={this.state.suggestionOpen} dataSource={this.state.searchAddressList.map(addr => addr.unrestrictedValue)} onSearch={this.searchAddress} onSelect={this.onSelectRuAddress} onBlur={this.onCheckRuAddress} />
          // <Select showSearch filterOption={false} onSearch={this.searchAddress} onChange={this.onSelectRuAddress}>
          //   {this.state.searchAddressList.map((item, idx) => (
          //     <Option value={item.unrestrictedValue} key={idx}>
          //       {item.unrestrictedValue}
          //     </Option>
          //   ))}
          // </Select>
        );
      } else {
        return <Input />;
      }
    }
    if (field.fieldName === 'City') {
      if (field.inputDropDownBoxFlag === 1) {
        return (
          <Select showSearch onChange={(val) => this.getRegionListByCity(1, val)}>
            {this.state.cityList.map((city, idx) => (
              <Option value={city.cityName} key={idx}>
                {city.cityName}
              </Option>
            ))}
          </Select>
        );
      } else if (field.inputSearchBoxFlag === 1 && field.inputFreeTextFlag === 1) {
        return <AutoComplete dataSource={this.state.searchCityList.map((city) => city.cityName)} onSearch={this.searchCity} onChange={(val) => this.getRegionListByCity(2, val)} />;
      } else if (field.inputSearchBoxFlag === 1) {
        return (
          <Select showSearch onSearch={this.searchCity} onChange={(val) => this.getRegionListByCity(2, val)}>
            {this.state.searchCityList.map((city, idx) => (
              <Option value={city.cityName} key={idx}>
                {city.cityName}
              </Option>
            ))}
          </Select>
        );
      } else {
        return <Input />;
      }
    }
    const optionList = field.fieldName === 'Country' ? this.state.countryList : field.fieldName === 'State' ? this.state.stateList : field.fieldName === 'Region' ? this.state.regionList : [];
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
  comparePhone = (rule: any, value: any, callback: any) => {
    const { storeId } = this.state;
    //  MEX(123456858
    //   FR(123457909
    //   DE(123457908
    //   US(123457910
    //   UK(123457916
    //   SE(123457915
    //   RU(123457907
    //   TR(123457911
    // let regExp = null;
    // if (storeId == 123457909) {
    //   // 法国
    //   regExp = /^\(\+[3][3]\)[\s](([0][1-9])|[1-9])[\s][0-9]{2}[\s][0-9]{2}[\s][0-9]{2}[\s][0-9]{2}$/;
    // } else if (storeId == 123457910) {
    //   // 美国
    //   regExp = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
    // } else if (storeId == 123456858) {
    //   // 墨西哥
    //   regExp = /^\+\([5][2]\)[\s\-][0-9]{3}[\s\-][0-9]{3}[\s\-][0-9]{4}$/;
    // } else if (storeId == 123457907) {
    //   // 俄罗斯
    //   regExp = /^(\+7|7|8)?[\s\-]?\(?[0-9][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    // } else if (storeId == 123457911) {
    //   // 土耳其
    //   regExp = /^0\s\(?([2-9][0-8][0-9])\)?\s([1-9][0-9]{2})[\-\. ]?([0-9]{2})[\-\. ]?([0-9]{2})(\s*x[0-9]+)?$/;
    // } else {
    //   // 其他国家
    //   // regExp = /\S/;
    //   regExp = /^[0-9+-\\(\\)\s]{6,25}$/;
    // }
    const regExp = /^[0-9+-\\(\\)\s]{6,25}$/;

    if (!regExp.test(value)) {
      callback(RCi18n({ id: "PetOwner.theCorrectPhone" }));
    } else {
      callback();
    }
  };

  // 邮编校验
  compareZip = async (rule, value, callback) => {
    if (!/^[0-9A-Za-z-\s]{3,10}$/.test(value)) {
      callback(RCi18n({ id: "PetOwner.theCorrectPostCode" }));
    } else {
      // 邮编黑名单校验
      let res = await validPostCodeBlock(value);
      //console.log('res', res);
      if (res?.res?.code === Const.SUCCESS_CODE) {
        const data = res?.res?.context || {};
        // validFlag 1 通过 0 不通过
        if (!!data?.validFlag) {
          callback()
        } else {
          callback(new Error(data.alert))
        }
      }
      else {
        callback(new Error(RCi18n({ id: 'PetOwner.PostalCodeMsg' })));
      }
    }
  };

  //俄罗斯address1校验
  ruAddress1Validator = (rule, value, callback) => {
    const { suggestionMethodName } = this.state;
    if (suggestionMethodName !== 'DADATA') {
      callback();
    }
    const address = this.state.searchAddressList.find(addr => addr.unrestrictedValue === value);
    if (address && !address.street) {
      callback(RCi18n({ id: 'PetOwner.AddressStreetTip' }));
    } else if (address && !address.postCode) {
      callback(RCi18n({ id: 'PetOwner.AddressPostCodeTip' }));
    } else if (address && !address.house) {
      callback(RCi18n({ id: 'PetOwner.AddressHouseTip' }));
    } else if (address && !address.city) {
      callback(RCi18n({ id: 'PetOwner.AddressCityTip' }));
    } else {
      callback();
    }
  };

  render() {
    const { delivery, addressType } = this.props;
    const { fields, suggestionAddress, checkedAddress, validationSuccess, storeId } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = (col: number) => ({
      labelCol: {
        xs: { span: 24 },
        sm: { span: col === 1 ? 10 : 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: col === 1 ? 10 : 17 }
      }
    });
    return (
      <div>
        <Spin spinning={this.state.loading}>
          <div className="container">
            <Headline title={
              delivery.deliveryAddressId
                ? (addressType === 'delivery'
                  ? RCi18n({ id: "PetOwner.EditDeliveryInformation" })
                  : RCi18n({ id: "PetOwner.EditBillingInformation" }))
                : (addressType === 'delivery'
                  ? RCi18n({ id: "PetOwner.AddDeliveryInformation" })
                  : RCi18n({ id: "PetOwner.AddBillingInformation" }))
            }
            />
            <Form>
              <Row>
                {this.state.formFieldList.map((field, colIdx) => (
                  <Col span={12 * field.occupancyNum} key={colIdx}>
                    <Form.Item {...formItemLayout(field.occupancyNum)} label={RCi18n({ id: `PetOwner.${storeId === 123457919 ? 'AddressForm.' : ''}${field.fieldName}` })}>
                      {getFieldDecorator(`${FORM_FIELD_MAP[field.fieldName]}`,
                        {
                          initialValue: delivery[FORM_FIELD_MAP[field.fieldName]],
                          validateTrigger: field.fieldName === 'Postal code' && field.requiredFlag === 1
                            ? 'onBlur'
                            : 'onChange',
                          rules: [
                            { required: field.requiredFlag === 1, message: RCi18n({ id: "PetOwner.ThisFieldIsRequired" }) },
                            field.fieldName != 'Country'
                              ? { max: field.maxLength, message: RCi18n({ id: "PetOwner.ExceedMaximumLength" }) }
                              : undefined,

                            {
                              validator: field.fieldName === 'Phone number' && field.requiredFlag === 1
                                ? this.comparePhone
                                : (rule, value, callback) => callback()
                            },
                            {
                              validator: field.fieldName === 'Postal code' && field.requiredFlag === 1
                                ? this.compareZip
                                : (rule, value, callback) => callback()
                            },
                            {
                              validator: field.fieldName === 'Address1' && field.inputSearchBoxFlag === 1
                                ? this.ruAddress1Validator
                                : (rule, value, callback) => callback()
                            }
                          ].filter((r) => !!r)
                        })(this.renderField(field))
                      }
                    </Form.Item>
                  </Col>
                ))}
              </Row>
            </Form>
          </div>
          <div className="bar-button">
            <Button type="primary" disabled={this.state.formFieldList.length === 0} onClick={() => this.validateAddress()}>
              <FormattedMessage id="PetOwner.Save" />
            </Button>
            <Button onClick={this.backToCustomerDetail} style={{ marginLeft: '20px' }}>
              <FormattedMessage id="PetOwner.Cancel" />
            </Button>
          </div>
          <Modal width={920} title={RCi18n({ id: "PetOwner.verifyYourAddress" })} visible={this.state.validationModalVisisble} confirmLoading={this.state.loading} onCancel={this.onCancelSuggestionModal} onOk={this.saveAddress}>
            <Alert type="warning" message={RCi18n({ id: "PetOwner.verifyAddressAlert" })} />
            <Row gutter={32} style={{ marginTop: 20 }}>
              <Col span={12}>
                <Radio disabled={!validationSuccess} checked={checkedAddress === 0} onClick={() => this.onChangeCheckedAddress(0)}>
                  <span className="text-highlight"><FormattedMessage id="PetOwner.originalAddress" /></span>
                  <br />
                  <span style={{ paddingLeft: 26, wordBreak: 'break-word' }}>{[[fields.address1, fields.address2].join(''), fields.city, fields.state, fields.postCode].filter((fd) => !!fd).join(',')}</span>
                </Radio>
                <div style={{ paddingLeft: 10 }}>
                  <Button type="link" onClick={this.onCancelSuggestionModal}>
                    <FormattedMessage id="PetOwner.Edit" />
                  </Button>
                </div>
              </Col>
              <Col span={12}>
                <Radio checked={checkedAddress === 1} onClick={() => this.onChangeCheckedAddress(1)}>
                  <span className="text-highlight"><FormattedMessage id="PetOwner.suggestAddress" /></span>
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
