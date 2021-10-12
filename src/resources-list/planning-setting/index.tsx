import React, { useEffect, useState } from 'react';
import { Icon, Table, Tooltip, Divider, Switch, Modal, Button, Form, Input, Row, Col, message, Select, Spin } from 'antd';
// import * as webapi from './webapi'
import { FormattedMessage } from 'react-intl';
import { BreadCrumb, Headline, Const } from 'qmkit';
import { SelectGroup } from 'qmkit';
import ServiceSetting from '../component/service-setting'
import './index.less'

const { Option } = Select;
const FormItem = Form.Item;

const styles = {
  planningBtn: {
    marginRight: 12
  }
};

const optionTest = [{
  label:'1',
  value:'1',
},{
  label:'2',
  value:'2',
},{
  label:'3',
  value:'3',
},]


// @ts-ignore
@Form.create()
export default class PlanningSetting extends React.Component<any, any>{
  constructor(props) {
    super(props);
  }

  render() {
    let {
      getFieldDecorator,
    } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    return (
      <div className="planning-setting-wrap">
        {/* <BreadCrumb /> */}
        <div className="container">
          <div className="title-box">
            <span className="title-text">Planning Setting</span>
          </div>
          <Form
          className="planning-setting-form"
          {...formItemLayout}
            // onSubmit={this.handleSubmit}
          >
          <Row >
              <Col span={14}>
            <FormItem  label={ <FormattedMessage id="Resources.email" />}>
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                  },
                  // {
                  //   min: 1,
                  //   max: 20,
                  //   message: '1-20 characters'
                  // },
                  // {
                  //   validator: (rule, value, callback) => {
                  //     QMMethod.validatorEmoji(rule, value, callback, 'SPU encoding');
                  //   }
                  // }
                ],
                // onChange: this._editGoods.bind(this, 'goodsNo'),
                // initialValue: goods.get('goodsNo')
              })(<Input disabled/>)}
            </FormItem>
          </Col>
          <Col span={14}>
            <FormItem  label={ <FormattedMessage id="Resources.name" />}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                  },
                  // {
                  //   min: 1,
                  //   max: 20,
                  //   message: '1-20 characters'
                  // },
                  // {
                  //   validator: (rule, value, callback) => {
                  //     QMMethod.validatorEmoji(rule, value, callback, 'SPU encoding');
                  //   }
                  // }
                ],
                // onChange: this._editGoods.bind(this, 'goodsNo'),
                // initialValue: goods.get('goodsNo')
              })(<Input disabled/>)}
            </FormItem>
          </Col>
          <Col span={14}>
            <FormItem  label={ <FormattedMessage id="Resources.service_type" />}>
              {getFieldDecorator('serviceType', {
                rules: [
                  {
                    required: true,
                  },
                  // {
                  //   min: 1,
                  //   max: 20,
                  //   message: '1-20 characters'
                  // },
                  // {
                  //   validator: (rule, value, callback) => {
                  //     QMMethod.validatorEmoji(rule, value, callback, 'SPU encoding');
                  //   }
                  // }
                ],
                // onChange: this._editGoods.bind(this, 'goodsNo'),
                // initialValue: goods.get('goodsNo')
              })(<Select
                mode="multiple"
                >
                  {optionTest.map(item => <Option key={item.value}>{item.label}</Option>)}
                </Select>)}
            </FormItem>
          </Col>
          <Col span={14}>
            <FormItem  label={ <FormattedMessage id="Resources.expert_type" />}>
              {getFieldDecorator('expertType', {
                rules: [
                  {
                    required: true,
                  },
                  // {
                  //   min: 1,
                  //   max: 20,
                  //   message: '1-20 characters'
                  // },
                  // {
                  //   validator: (rule, value, callback) => {
                  //     QMMethod.validatorEmoji(rule, value, callback, 'SPU encoding');
                  //   }
                  // }
                ],
                // onChange: this._editGoods.bind(this, 'goodsNo'),
                // initialValue: goods.get('goodsNo')
              })(<Select
                mode="multiple"
                >
                  {optionTest.map(item => <Option key={item.value}>{item.label}</Option>)}
                </Select>)}
            </FormItem>
          </Col>
          <Col span={14}>
            <FormItem  label={ <FormattedMessage id="Resources.appointment_type" />}>
              {getFieldDecorator('appointmentType', {
                rules: [
                  {
                    required: true,
                  },
                  // {
                  //   min: 1,
                  //   max: 20,
                  //   message: '1-20 characters'
                  // },
                  // {
                  //   validator: (rule, value, callback) => {
                  //     QMMethod.validatorEmoji(rule, value, callback, 'SPU encoding');
                  //   }
                  // }
                ],
                // onChange: this._editGoods.bind(this, 'goodsNo'),
                // initialValue: goods.get('goodsNo')
              })(<Select
                mode="multiple"
                >
                  {optionTest.map(item => <Option key={item.value}>{item.label}</Option>)}
                </Select>)}
            </FormItem>
          </Col>
          </Row>
          </Form>
          <div className="availability-title">Availability:</div>
          <ServiceSetting/>
         
        </div>
      </div>
    )
  }
}