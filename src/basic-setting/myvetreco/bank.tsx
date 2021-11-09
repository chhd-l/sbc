import React from 'react';
import { Form, Input, Row, Col } from 'antd';
import FileItem from './fileitem';
import { SupportedDocumentUtil } from './main';
import { FormComponentProps } from 'antd/es/form';

interface BankFormProps extends FormComponentProps {
  isBusiness: boolean;
  adyenAuditState: number;
}

const FormItem = Form.Item;

class BankInformation extends React.Component<BankFormProps, any> {

  constructor(props) {
    super(props);
  }

  validateForm = () => {
    return new Promise((resolve, reject) => {
      this.props.form.validateFields((errors, values) => {
        if (!errors) {
          resolve({
            ...values,
            supportedDocument: SupportedDocumentUtil.mapFormDataToProps(values.supportedDocument)
          });
        } else {
          reject('3');
        }
      });
    });
  };

  render() {
    const { form: { getFieldDecorator }, isBusiness, adyenAuditState } = this.props;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 }
    };
    return (
      <Form layout="horizontal" {...formLayout}>
        <Row gutter={[24,12]}>
          <Col span={12}>
            <FormItem label="Owner name">
              {getFieldDecorator('ownerName', {
                rules: [{ required: isBusiness, message: 'Please input owner name' }],
                initialValue: ''
              })(
              <Input disabled />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[24,12]}>
          <Col span={12}>
            <FormItem label="IBAN">
              {getFieldDecorator('iban', {
                rules: [{ required: isBusiness, message: 'Please input IBAN' }],
                initialValue: ''
              })(
              <Input disabled={adyenAuditState !== 3} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[24,12]}>
          <Col span={24}>
            <FormItem label="Supported document" labelCol={{span: 4}} wrapperCol={{span: 12}} extra={<div style={{color:'red'}}>
              <div>You can upload Bank Statement, Letter from bank, Screenshot online banking environment</div>
              <div>Allowed formats: JPEG, JPG, PNG, PDF.</div>
              <div>Minimum allowed size: 1 KB for PDF, 100 KB for other formats.</div>
              <div>Maximum allowed size: 4 MB.</div>
              <div>No maximum on the number of pages for PDF.</div>
              <div>The document needs to contain the following information: Bank logo or bank name in a unique font，bank account details  and name of the account holder.</div>
            </div>}>
              {getFieldDecorator('supportedDocument', {
                rules: [{ required: isBusiness, type: 'array', message: 'Please upload supported document!' }]
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
