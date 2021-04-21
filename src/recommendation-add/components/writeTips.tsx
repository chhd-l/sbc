import { Checkbox, Form, Input, Spin } from 'antd';
import { Relax } from 'plume2';
import { noop } from 'qmkit';
import React from 'react';

@Relax
export default class PaymentInformation extends React.Component<any, any> {
  props: {
    form: any,
    relaxProps?: {
      felinReco: any
      onChangePestsForm: Function,
      loading:boolean
    };
  }
  static relaxProps = {
    felinReco: 'felinReco',
    onChangePestsForm: noop,
    loading:'loading'
  };
  constructor(props) {
    super(props);
  }

  _onChange(e, key: string,checked?:boolean) {
    const { onChangePestsForm, felinReco } = this.props.relaxProps;
    let value=null
    if(checked){
      value = e.target.checked
    }else{
      if (e && e.target.value) {
        value = e.target.value;
      }
    }
    let _pets = Object.assign({}, felinReco)
   onChangePestsForm({ ..._pets, [key]: value }, 'felinReco')
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { felinReco,loading } = this.props.relaxProps;

    const formItemLayout = {
      labelCol: {
        sm: { span: 2 },
      },
      wrapperCol: {
        sm: { span: 5 },
      },
    };

    return (
      <div>
         <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />} >
        <Form >
          <Form.Item label="What we suggest/ recommend for your cat">
            {getFieldDecorator('suggest', {
             initialValue: felinReco.suggest || '',
              onChange: (e) => this._onChange(e, 'suggest'),
            })(<Input.TextArea rows={4} placeholder="Input" />)}

          </Form.Item>
          <Form.Item label="We recommend to you the following optimal nutrition">
            {getFieldDecorator('optimal', {
              initialValue: felinReco.optimal || '',
              onChange: (e) => this._onChange(e, 'optimal'),

            })(<Input.TextArea rows={4} placeholder="Input" />)}

          </Form.Item>
          <Form.Item label="Paris (Y/N)" {...formItemLayout}>
            {getFieldDecorator('paris', {
              initialValue: felinReco.paris,
              onChange: (e) => this._onChange(e, 'paris',true),

            })(<Checkbox checked={felinReco.paris}/>)}

          </Form.Item>
          <Form.Item label="Pick up (Y/N)"  {...formItemLayout}>
            {getFieldDecorator('pickup', {
              initialValue: felinReco.pickup,
              onChange: (e) => this._onChange(e, 'pickup',true),
            })(<Checkbox checked={felinReco.pickup}/>)}

          </Form.Item>
        </Form>
     </Spin>
      </div>
    );
  }
}
