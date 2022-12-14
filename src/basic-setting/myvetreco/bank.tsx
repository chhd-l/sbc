import React from 'react';
import { Form, Input, Row, Col } from 'antd';
import DebounceSelect from '../../myvetreco-logins/create-store/components/debounceSelect';
import { cityList } from '../webapi';
import FileItem from './fileitem';
import { SupportedDocumentUtil } from './main';
import { FormComponentProps } from 'antd/es/form';
import { RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';

interface BankFormProps extends FormComponentProps {
  isBusiness: boolean;
  adyenAuditState: number;
}

const FormItem = Form.Item;

const fetchUserList = async (cityName) => {
  return cityList({cityName,storeId:123457915}).then(({res})=>{
    return res.context.systemCityVO
  })
}

class BankInformation extends React.Component<BankFormProps, any> {

  constructor(props) {
    super(props);
    this.state = {
      defaultOptions: {}
    }
  }

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
            documentType: 'BANK_STATEMENT',
            supportedDocument: SupportedDocumentUtil.mapFormDataToProps(values.supportedDocument, 'BANK_STATEMENT')
          });
        } else {
          reject('3');
        }
      });
    });
  };

  render() {
    const { form: { getFieldDecorator }, isBusiness, adyenAuditState } = this.props;
    const { defaultOptions } = this.state;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 }
    };
    return (
      <Form layout="horizontal" {...formLayout}>
        <Row gutter={[24,12]}>
          <Col span={12}>
            <FormItem label={RCi18n({id:"Store.ownername"})}>
              {getFieldDecorator('ownerName', {
                rules: [{ required: isBusiness, message: RCi18n({id:"PetOwner.ThisFieldIsRequired"}) }],
                initialValue: ''
              })(
              <Input disabled={adyenAuditState === 0} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[24,12]}>
          <Col span={12}>
            <FormItem label={RCi18n({id:"Store.ownercity"})} required>
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
                  disabled={adyenAuditState === 0}
                  size="default"
                  placeholder=""
                  fetchOptions={fetchUserList}
                  defaultOptions={defaultOptions}
                  style={{
                    width: '100%',
                  }}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[24,12]}>
          <Col span={12}>
            <FormItem label={RCi18n({id:"Store.iban"})}>
              {getFieldDecorator('iban', {
                rules: [{ required: isBusiness, message: RCi18n({id:"PetOwner.ThisFieldIsRequired"}) }],
                initialValue: ''
              })(
              <Input disabled={adyenAuditState < 2} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[24,12]}>
          <Col span={24}>
            <FormItem label={RCi18n({id:"Store.supportdoc"})} labelCol={{span: 4}} wrapperCol={{span: 12}} extra={<div style={{color:'#000'}}>
              <div>You can upload Bank Statement, Letter from bank, Screenshot online banking environment</div>
              <div>Allowed formats: JPEG, JPG, PNG, PDF.</div>
              <div>Minimum allowed size: 1 KB for PDF, 100 KB for other formats.</div>
              <div>Maximum allowed size: 4 MB.</div>
              <div>No maximum on the number of pages for PDF.</div>
              <div>The document needs to contain the following information: Bank logo or bank name in a unique font???bank account details  and name of the account holder.</div>
            </div>}>
              {getFieldDecorator('supportedDocument', {
                rules: [{ required: isBusiness, type: 'array', message: RCi18n({id:"PetOwner.ThisFieldIsRequired"}) }]
              })(
                <FileItem disabled={adyenAuditState === 0} />
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create<BankFormProps>()(BankInformation);
