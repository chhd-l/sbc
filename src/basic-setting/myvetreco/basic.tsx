import React from 'react';
import { Form, Input, Select, Row, Col, DatePicker } from 'antd';
import { Const, cache, RCi18n } from 'qmkit';
import DebounceSelect from '../../myvetreco-logins/create-store/components/debounceSelect';
import { cityList, checkCompanyInfoExists } from '../webapi';
import { FormattedMessage } from 'react-intl';
import UploadItem from './uploaditem';
import { FormComponentProps } from 'antd/es/form';
import moment from 'moment';
import { SupportedDocumentUtil, SupportedDocumentFieldValidator } from './main';

interface BasicFormProps extends FormComponentProps {
  onChangeName: Function;
  adyenAuditState: number;
}

const FormItem = Form.Item;
const Option = Select.Option;

const fetchUserList = async (cityName) => {
  return cityList({cityName,storeId:123457915}).then(({res})=>{
    return res.context.systemCityVO
  })
}

class BusinessBasicInformation extends React.Component<BasicFormProps, any> {

  constructor(props) {
    super(props);
    this.state = {
      defaultOptions: []
    }
  }

  onChangePhoneNumber = (e) => {
    const { form } = this.props;
    if (e && !e.target.value.startsWith('+31')) {
      const temp = e.target.value;
      setTimeout(() => {
        form.setFieldsValue({
          phoneNumber: `+31${temp.replace(/^[+|+3|+31]/, '')}`
        });
      });
    }
  };

  setDefaultOptions = () => {
    const cityObj = this.props.form.getFieldValue('cityId');
    const defaultOptions = {
      id: cityObj.key,
      cityName: cityObj.label
    };
    this.setState({ defaultOptions });
  };

  validateForm = (preHandler? : Function, postHandler? : Function) => {
    const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}');
    return new Promise((resolve, reject) => {
      this.props.form.validateFields((errors, values) => {
        if (!errors) {
          if (preHandler) {
            preHandler();
          }
          checkCompanyInfoExists({
            storeName: values.storeName,
            companyInfoId: loginInfo.companyInfoId,
            storeId: loginInfo.storeId
          }).then(data => {
            if (postHandler) {
              postHandler();
            }
            if (data.res.code === Const.SUCCESS_CODE && !data.res.context.storeNameExists) {
              resolve({
                ...values,
                cityId: values.cityId.key,
                city: values.cityId.label,
              });
            } else {
              this.props.form.setFields({
                storeName:{value: values.storeName,errors:[new Error(RCi18n({id:"Store.storenamerepeated"}))]}
              });
              reject('1');
            }
          }).catch(() => {
            if (postHandler) {
              postHandler();
            }
            reject('1');
          });
        } else {
          if (postHandler) {
            postHandler();
          }
          reject('1');
        }
      });
    });
  };

  render() {
    const { form: { getFieldDecorator }, form, onChangeName, adyenAuditState } = this.props;
    const { defaultOptions } = this.state;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 }
    };
    return (
      <Form layout="horizontal" {...formLayout}>
        <Row gutter={[24,12]}>
          <Col span={12}>
            <FormItem label={RCi18n({id:"Store.typeofbusi"})} required>
              {getFieldDecorator('typeOfBusiness', {
                initialValue: 1
              })(
              <Select disabled>
                <Option value={1}>Business</Option>
                <Option value={0}>Individual</Option>
              </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[24,12]}>
          <Col span={12}>
            <FormItem label={RCi18n({id:"Store.companyname"})} required>
              {getFieldDecorator('legalBusinessName', {
                rules: [{ required: true, message: RCi18n({id:"PetOwner.ThisFieldIsRequired"}) }],
              })(
                <Input disabled={adyenAuditState === 0} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[24,12]}>
          <Col span={12}>
            <FormItem label={RCi18n({id:"Store.companynumber"})} required extra={<div style={{color:'#000'}}>{RCi18n({id:"Store.companynumbertip"})}</div>}>
              {getFieldDecorator('chamberOfCommerceNumber', {
                rules:[{ required: true, message: RCi18n({id:"PetOwner.ThisFieldIsRequired"}) }],
              })(
                <Input disabled />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={RCi18n({id:"Store.taxid"})} required>
              {getFieldDecorator('taxId', {
                rules:[{ required: true, message: RCi18n({id:"PetOwner.ThisFieldIsRequired"}) }],
              })(
                <Input disabled={adyenAuditState === 0} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[24,12]}>
          <Col span={12}>
            <FormItem label={RCi18n({id:"Setting.storeName"})} required>
              {getFieldDecorator('storeName', {
                rules: [{ required: true, message: RCi18n({id:"PetOwner.ThisFieldIsRequired"}) }],
                
              })(
                <Input
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\w]/ig,'').substring(0,50).toLowerCase();
                    const postfix = window.location.host.match(/\.\w+$/) ? window.location.host.match(/\.\w+$/)[0] : '';
                    form.setFieldsValue({storeDomain:'https://'+value+'.myvetreco'+postfix});
                  }}
                  disabled={adyenAuditState === 0}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={RCi18n({id:"Store.storeDomain"})} required>
              {getFieldDecorator('storeDomain', {
                initialValue: ''
              })(
                <Input disabled />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={RCi18n({id:"Store.province"})}>
              {getFieldDecorator('province', {
                rules: [{ required: true, message: RCi18n({id:"PetOwner.ThisFieldIsRequired"}) }]
              })(
                <Input disabled={adyenAuditState === 0} maxLength={3} />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={RCi18n({id:"PetOwner.City"})} required>
              {getFieldDecorator('cityId', {
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      if (!value || !value.key) {
                        callback(RCi18n({id:"PetOwner.ThisFieldIsRequired"}));
                      }
                      callback();
                    }
                  }
                ],
                initialValue: {key:'',value:'',label:''}
              })(
                <DebounceSelect
                  size="default"
                  placeholder=""
                  fetchOptions={fetchUserList}
                  defaultOptions={defaultOptions}
                  disabled={adyenAuditState === 0}
                  style={{
                    width: '100%',
                  }}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={RCi18n({id:"Store.street"})}>
              {getFieldDecorator('storeAddress1', {
                rules: [{ required: true, message: RCi18n({id:"PetOwner.ThisFieldIsRequired"}) }]
              })(
                <Input disabled={adyenAuditState === 0} />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={RCi18n({id:"Store.housenumber"})}>
              {getFieldDecorator('houseNumberOrName', {
                rules: [{ required: true, message: RCi18n({id:"PetOwner.ThisFieldIsRequired"}) }]
              })(
                <Input disabled={adyenAuditState === 0} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[24,12]}>
          <Col span={12}>
            <FormItem label={RCi18n({id:"Store.postcode"})}>
              {getFieldDecorator('postCode', {
                rules: [{ required: true, pattern: /^[0-9]{4}\s[A-Za-z]{2}$/, message: `${RCi18n({id:"PetOwner.theCorrectPostCode"})}: 1234 AB` }],
              })(
                <Input disabled={adyenAuditState === 0} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[24,12]}>
          <Col span={12}>
            <FormItem label={RCi18n({id:"PetOwner.Email"})}>
              {getFieldDecorator('email', {
                rules:[
                  { required: true, message: RCi18n({id:"PetOwner.ThisFieldIsRequired"}) },
                  { type: 'email', message: <FormattedMessage id="Login.email_address_vld1" /> }
                ],
              })(<Input disabled={adyenAuditState === 0} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={RCi18n({id:"PetOwner.Phone number"})}>
              {getFieldDecorator('phoneNumber', {
                rules:[
                  { required: true, pattern: /^\+31[0-9]{9}$/, message: `${RCi18n({id:"inputPhoneNumberTip2"})} +31xxxxxxxxx` }
                ],
              })(
                <Input maxLength={12} onChange={this.onChangePhoneNumber} disabled={adyenAuditState === 0} />
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

class IndividualBasicInformation extends React.Component<BasicFormProps, any> {

  constructor(props) {
    super(props);
    this.state = {
      defaultOptions: []
    }
  }

  onChangePhoneNumber = (e) => {
    const { form } = this.props;
    if (e && !e.target.value.startsWith('+31')) {
      const temp = e.target.value;
      setTimeout(() => {
        form.setFieldsValue({
          phoneNumber: `+31${temp.replace(/^[+|+3|+31]/, '')}`
        });
      });
    }
  };

  setDefaultOptions = () => {
    const cityObj = this.props.form.getFieldValue('cityId');
    const defaultOptions = {
      id: cityObj.key,
      cityName: cityObj.label
    };
    this.setState({ defaultOptions });
  };

  validateForm = () => {
    return new Promise((resolve, reject) => {
      this.props.form.validateFields((errors, values) => {
        if (!errors) {
          resolve({
            ...values,
            cityId: values.cityId.key,
            city: values.cityId.label,
            dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : undefined,
            documentType: values.supportedDocument.documentType,
            supportedDocument: SupportedDocumentUtil.mapUploadObjToProps(values.supportedDocument)
          });
        } else {
          reject('1');
        }
      });
    });
  };

  render() {
    const { form: { getFieldDecorator }, form, onChangeName, adyenAuditState } = this.props;
    const { defaultOptions } = this.state;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 }
    };
    return (
      <Form layout="horizontal" {...formLayout}>
        <Row gutter={[24,12]}>
          <Col span={12}>
            <FormItem label={RCi18n({id:"Store.typeofbusi"})} required>
              {getFieldDecorator('typeOfBusiness', {
                initialValue: 0
              })(
              <Select disabled>
                <Option value={1}>Business</Option>
                <Option value={0}>Individual</Option>
              </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[24,12]}>
          <Col span={12}>
            <FormItem label={RCi18n({id:"PetOwner.First name"})}>
              {getFieldDecorator('firstName', {
                rules: [{ required: true, message: RCi18n({id:"PetOwner.ThisFieldIsRequired"}) }, { pattern: /^((?![0-9]).)*$/, message: RCi18n({id:"Store.namenono"}) }],
              })(
                <Input disabled={adyenAuditState === 0} />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={RCi18n({id:"PetOwner.Last name"})}>
              {getFieldDecorator('lastName', {
                rules:[{ required: true, message: RCi18n({id:"PetOwner.ThisFieldIsRequired"}) }, { pattern: /^((?![0-9]).)*$/, message: RCi18n({id:"Store.namenono"}) }],
              })(
                <Input disabled={adyenAuditState === 0} />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={RCi18n({id:"PetOwner.Email"})}>
              {getFieldDecorator('email', {
                rules:[
                  { required: true, type: 'email', message: <FormattedMessage id="Login.email_address_vld1" /> }
                ],
              })(<Input disabled={adyenAuditState === 0} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={RCi18n({id:"PetOwner.Phone number"})}>
              {getFieldDecorator('phoneNumber', {
                rules:[
                  { required: true, pattern: /^\+31[0-9]{9}$/, message: `${RCi18n({id:"inputPhoneNumberTip2"})} +31xxxxxxxxx` }
                ],
              })(
                <Input maxLength={12} onChange={this.onChangePhoneNumber} disabled={adyenAuditState === 0} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[24,12]}>
          <Col span={24}>
            <FormItem label={RCi18n({id:"PetOwner.Address1"})} labelCol={{span: 4}} wrapperCol={{span: 12}} extra={<div style={{color:'#000'}}>{RCi18n({id:"Store.addressexample"})}</div>}>
              {getFieldDecorator('address1', {
                rules: [{ required: true, message: RCi18n({id:"PetOwner.ThisFieldIsRequired"}) }]
              })(
                <Input disabled={adyenAuditState === 0} />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={RCi18n({id:"Store.postcode"})}>
              {getFieldDecorator('postCode', {
                rules: [{ required: true, pattern: /^[0-9]{4}\s[A-Za-z]{2}$/, message: `${RCi18n({id:"PetOwner.theCorrectPostCode"})}: 1234 AB` }],
              })(
                <Input disabled={adyenAuditState === 0} />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={RCi18n({id:"PetOwner.City"})} required>
              {getFieldDecorator('cityId', {
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      if (!value || !value.key) {
                        callback(RCi18n({id:"PetOwner.ThisFieldIsRequired"}));
                      }
                      callback();
                    }
                  }
                ],
                initialValue: {key:'',value:'',label:''}
              })(
                <DebounceSelect
                  size="default"
                  placeholder=""
                  fetchOptions={fetchUserList}
                  defaultOptions={defaultOptions}
                  disabled={adyenAuditState === 0}
                  style={{
                    width: '100%',
                  }}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={RCi18n({id:"Store.dateofbirth"})}>
              {getFieldDecorator('dateOfBirth', {
                rules: [{ required: true, message: RCi18n({id:"PetOwner.ThisFieldIsRequired"}) }],
              })(
                <DatePicker format="YYYY-MM-DD" disabledDate={current => current > moment().startOf('day')} disabled={adyenAuditState === 0} />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label={RCi18n({id:"Store.supportdoc"})} labelCol={{span: 4}} wrapperCol={{span: 12}} extra={<div style={{color:'#000'}}>
              <div>Allowed formats: JPEG, JPG, PNG, or PDF (max. 2 pages)</div>
              <div>Minimum allowed size: 1 KB for PDF, 100 KB for other formats</div>
              <div>Maximum allowed size: 4 MB</div>
            </div>}>
              {getFieldDecorator('supportedDocument', {
                rules: [{ required: true, validator: SupportedDocumentFieldValidator }],
                initialValue: { documentType: 'PASSPORT', PASSPORT: [] }
              })(
                <UploadItem disabled={adyenAuditState === 0} />
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

export const BusinessBasicInformationForm = Form.create<BasicFormProps>()(BusinessBasicInformation);
export const IndividualBasicInformationForm = Form.create<BasicFormProps>()(IndividualBasicInformation);
