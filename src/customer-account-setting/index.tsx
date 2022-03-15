import React, { Component, useEffect, useState } from 'react';

import { Headline, BreadCrumb, DragTable, Const, RCi18n } from 'qmkit';
import { Row, Col, Button, message, Tooltip, Divider, Popconfirm, Switch, Form, Modal, Spin, Radio, Input, InputNumber } from 'antd';
import { Link } from 'react-router-dom';

import { FormattedMessage, injectIntl } from 'react-intl';
// import TextArea from 'antd/es/input/TextArea';
import TextArea from 'antd/lib/input/TextArea';
import { editDeliveryOption } from '@/shipping-fee-setting/webapi';
import * as webapi from './webapi';
// import Foot from './components/foot';
import { FormComponentProps } from 'antd/es/form';

const index = (props: FormComponentProps) => {
  const [loading,setLoading] = useState(true);
  let optObj = {
    configKey: '',
    configName: '',
    configType: '',
    context: "1",
    delFlag: 0,
    id: 571,
    remark: '',
    status: 1,
    userId: ''
  }, skuObj = {
    id: 720,
    configKey: "maximum_number_of_orders_per_sku",
    configType: "maximum_number_of_orders_per_sku",
    maxNumber: 20,
    context: "",
    delFlag: 0,
    clubFlag: null
  }, cartObj = {
    id: 719,
    configKey: "maximum_number_of_items_per_cart",
    configType: "maximum_number_of_items_per_cart",
    maxNumber: null,
    context: "",
    delFlag: 0,
    clubFlag: null
  };

  const form = props.form;
  const { getFieldDecorator } = form;

  useEffect(()=>{
    Promise.all([
      webapi.getListSystemAccountConfigUsing(),
      webapi.getMaxNumberConfig()
    ]).then(([opt, order]) => {
      setLoading(false);
      if (opt.res.code === Const.SUCCESS_CODE && order.res.code === Const.SUCCESS_CODE) {
        form.setFieldsValue({
          choice: opt.res.context[0]?.context || '1',
          maxsku: (order.res.context.find(el => el.configKey === 'maximum_number_of_orders_per_sku') || {})['maxNumber'] || 20,
          maxitem: (order.res.context.find(el => el.configKey === 'maximum_number_of_items_per_cart') || {})['maxNumber'],
        });
        optObj = Object.assign(optObj, (opt.res.context[0] || {}));
        skuObj = Object.assign(skuObj, (order.res.context.find(el => el.configKey === 'maximum_number_of_orders_per_sku') || {}));
        cartObj = Object.assign(cartObj, (order.res.context.find(el => el.configKey === 'maximum_number_of_items_per_cart') || {}));
      }
    }).catch(() => { setLoading(false); });
  },[])

  function saveAccountSet() {
    form.validateFields(null, (err, values) => {
      if (!err) {
        setLoading(true);
        Promise.all([
          webapi.editCustomAccountSetting(Object.assign(optObj, { context: values['choice'] })),
          webapi.saveMaxNumberConfig([Object.assign(skuObj, { maxNumber: values['maxsku'] }), Object.assign(cartObj, { maxNumber: values['maxitem'] })])
        ]).then(data => {
          if (data[0].res.code === Const.SUCCESS_CODE && data[1].res.code === Const.SUCCESS_CODE) {
            message.success('Operation successful');
          }
          setLoading(false);
        }).catch(() => { setLoading(false); });
      }
    });
  };

  return (
    <div>
      <BreadCrumb />
      <div
        className="container"
        style={{ minHeight: '100vh', background: '#fafafa' }}
      >
        <Form>
        <div style={{padding:10,width:'90%'}}>
          <Row style={{marginLeft:20}}>
            <Col span={12}>
              <strong>Custom Account</strong>
            </Col>
            <Col span={24}>
              <p>
                Choose if you want to prompt your customer to create an account when they check out</p>
            </Col>
          </Row>
          <div style={{padding:'30px 20px 0 20px',margin:'20px 20px 0 20px',background: '#fff',borderRadius:'10px'}}>
            <Form.Item>
              {getFieldDecorator('choice')(
                <Radio.Group>
                  <Radio  value="2">
                    <a style={{color:'#222'}}>Accounts are optional</a>
                    <p>Customers will be able to check out with a customer account or as a guest.</p>
                  </Radio>
                  <br/>
                  <Radio value="1">
                    <a style={{color:'#222'}}>Accounts are required</a>
                    <p>Customers will only be able to check out if they have a customer account.</p>
                  </Radio>
              </Radio.Group>
              )}
            </Form.Item>
            
          </div>
        </div>
        <div style={{padding:10,width:'90%'}}>
          <Row style={{marginLeft:20}}>
            <Col span={12}>
              <strong>Quantity limit</strong>
            </Col>
          </Row>
          <div style={{padding:20,margin:'20px 20px 0 20px',background: '#fff',borderRadius:'10px'}}>
            <table style={{border: 'none'}}>
              <tr>
                <td style={{padding: 10, verticalAlign: 'top', color: '#333'}}>Maximum number of orders per SKU:</td>
                <td>
                  <Form.Item>
                    {getFieldDecorator('maxsku', {
                      rules: [{ type: 'number', max: 20, min: 5, message: 'The value must be between 5 and 20' }],
                      initialValue: 20
                    })(
                      <InputNumber style={{width: 180}} />
                    )}
                  </Form.Item>
                </td>
              </tr>
              <tr>
                <td style={{padding: 10, verticalAlign: 'top', color: '#333'}}>Maximum number of items per cart:</td>
                <td>
                  <Form.Item>
                    {getFieldDecorator('maxitem', {
                      rules: [{ type: 'number', max: 100, min: 50, message: 'Number must be between 50 and 100 included' }]
                    })(
                      <InputNumber style={{width: 180}}/>
                    )}
                  </Form.Item>
                </td>
              </tr>
            </table>
          </div>
        </div>
        </Form>
      </div>
      {/*<Foot />*/}
      <div className="bar-button">
        {/*<AuthWrapper key="001" functionName={this.props.goodsFuncName}>*/}
        <Button type="primary" loading={loading} onClick={saveAccountSet}>
          <FormattedMessage id="Setting.Save" />
        </Button>
      </div>
    </div>
    )
}

export default Form.create()(index);