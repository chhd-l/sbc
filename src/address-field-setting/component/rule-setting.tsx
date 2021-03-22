import React from 'react';
import { Const } from 'qmkit';
import { Form, Modal, Input, Radio, Switch, Row, Col, message } from 'antd';
import { getAddressSetting, saveAddressInputTypeSetting, editAddressApiSetting } from '../webapi';

const FormItem = Form.Item;

class RuleSetting extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      addressSettingForm: {
        validationUrl: '',
        clientId: '',
        parentKey: '',
        companyCode: '',
        parentPassword: '',
        userKey: '',
        userPassword: '',
        accountNumber: '',
        meterNumber: '',
        clientReferenceId: ''
      }
    };
  }

  componentDidMount() {
    this.getAddressSettingList();
  }

  getAddressSettingList = () => {
    getAddressSetting().then((data) => {
      if (data.res.code === Const.SUCCESS_CODE && data.res.context.addressApiSettings.length > 0) {
        this.setState({
          addressSettingForm: data.res.context.addressApiSettings[0]
        });
      }
    });
  };

  onCancel = () => {
    this.props.onCloseModal();
  };

  onSave = () => {
    const { setting } = this.props;
    this.props.form.validateFields((err, fields) => {
      if (!err) {
        this.setState({ loading: true });
        Promise.all([
          saveAddressInputTypeSetting({
            configRequestList: setting
          }),
          editAddressApiSetting({
            ...this.state.addressSettingForm,
            ...fields
          })
        ])
          .then(([data1, data2]) => {
            if (data1.res.code === Const.SUCCESS_CODE && data2.res.code === Const.SUCCESS_CODE) {
              message.success('Operate successfully');
            }
            this.setState({ loading: false });
            this.onCancel();
          })
          .catch(() => {
            this.setState({ loading: false });
          });
      }
    });
  };

  render() {
    const { loading, addressSettingForm } = this.state;
    const { setting, onChange } = this.props;
    const {
      visible,
      form: { getFieldDecorator }
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    return (
      <Modal width={1200} visible={visible} title="Address rule setting" confirmLoading={loading} okText="Submit" cancelText="Cancel" onOk={this.onSave} onCancel={this.onCancel}>
        {setting.length &&
          setting.map((setItem, idx) => (
            <div key={idx} style={{ marginBottom: 20, color: '#000' }}>
              {setItem.configKey === 'address_input_type_manually' ? 'Input manually' : 'Input automatically'}
              :
              <Switch checked={setItem.context === '1'} onChange={(checked) => onChange(idx, checked ? '1' : '0')} />
            </div>
          ))}
        {setting.findIndex((st) => st.configKey === 'address_input_type_automatically') > -1 && setting.find((st) => st.configKey === 'address_input_type_automatically')['context'] === '1' && addressSettingForm.id ? (
          <>
            <Radio value={addressSettingForm.id} key={addressSettingForm.id} checked={true}>
              <img src={addressSettingForm.imgUrl} style={{ width: '120px' }} />
            </Radio>
            <Form {...formItemLayout} style={{ marginTop: 20 }}>
              <Row>
                <Col span={24}>
                  <FormItem label="Validation url">
                    {getFieldDecorator('validationUrl', {
                      rules: [{ required: true, message: 'Validation url is required' }],
                      initialValue: addressSettingForm.validationUrl
                    })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={24}>
                  <FormItem label="Token">
                    {getFieldDecorator('userKey', {
                      rules: [{ required: true, message: 'Token is required' }],
                      initialValue: addressSettingForm.userKey
                    })(<Input />)}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </>
        ) : null}
      </Modal>
    );
  }
}

export default Form.create<any>()(RuleSetting);
