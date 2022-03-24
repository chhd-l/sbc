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
};

const index = (props: FormComponentProps) => {
  const [loading,setLoading] = useState(true);

  const form = props.form;
  const { getFieldDecorator } = form;

  useEffect(()=>{
    webapi.getListSystemAccountConfigUsing().then((opt) => {
      setLoading(false);
      if (opt.res.code === Const.SUCCESS_CODE) {
        form.setFieldsValue({
          choice: opt.res.context[0]?.context || '1'
        });
        optObj = Object.assign(optObj, (opt.res.context[0] || {}));
      }
    }).catch(() => { setLoading(false); });
  },[])

  const saveAccountSet = () => {
    form.validateFields(null, (err, values) => {
      if (!err) {
        setLoading(true);
        webapi.editCustomAccountSetting(Object.assign(optObj, { context: values['choice'] })).then(data => {
          if (data.res.code === Const.SUCCESS_CODE) {
            message.success(RCi18n({id:"Product.OperateSuccessfully"}));
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
                <strong><FormattedMessage id="Order.customAccount"/></strong>
              </Col>
              <Col span={24}>
                <p><FormattedMessage id="Order.customAccountTip"/></p>
              </Col>
            </Row>
            <div style={{padding:'30px 20px 0 20px',margin:'20px 20px 0 20px',background: '#fff',borderRadius:'10px'}}>
              <Form.Item>
                {getFieldDecorator('choice')(
                  <Radio.Group>
                    <Radio  value="2">
                      <a style={{color:'#222'}}><FormattedMessage id="Order.accountOpt"/></a>
                      <p><FormattedMessage id="Order.accountOptTip"/></p>
                    </Radio>
                    <br/>
                    <Radio value="1">
                      <a style={{color:'#222'}}><FormattedMessage id="Order.accountMdt"/></a>
                      <p><FormattedMessage id="Order.accountMdtTip"/></p>
                    </Radio>
                </Radio.Group>
                )}
              </Form.Item>
              
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