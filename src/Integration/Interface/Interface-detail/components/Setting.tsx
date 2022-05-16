import { Button, Row, Form, Col, Switch, InputNumber } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

const Setting = (props: any) => {
  const { saveSetting, settingparams, paramsChange } = props;
  return (
    <div className="interfaceSetting">
      <div>
        <Row
          // gutter={[10, { xs: 8, sm: 16, md: 24, lg: 32 }]}
          style={{ height: '64px', lineHeight: '64px' }}
        >
          <Col span={5}>Re-try requests automatically:</Col>
          <Col span={1}>
            <Switch
              checkedChildren={<FormattedMessage id="Subscription.On" />}
              unCheckedChildren={<FormattedMessage id="Subscription.Off" />}
              checked={settingparams?.retryFlag == 1 ? true : false}
              onChange={(value) =>
                paramsChange({
                  field: 'retryFlag',
                  value: value ? 1 : 0
                })
              }
            />
          </Col>
          <Col span={2}>
            <InputNumber
              precision={0}
              min={0}
              max={20}
              style={{ width: '90%' }}
              value={settingparams?.retryNum}
              onChange={(value) =>
                paramsChange({
                  field: 'retryNum',
                  value: value
                })
              }
            />
          </Col>
          <Col span={6}>Attempts during broken integration</Col>
        </Row>
        <Row style={{ height: '64px', lineHeight: '64px' }}>
          <Col span={5}>Send alert notification email automatically:</Col>
          <Col span={1}>
            <Switch
              checkedChildren={<FormattedMessage id="Subscription.On" />}
              unCheckedChildren={<FormattedMessage id="Subscription.Off" />}
              checked={settingparams?.emailFlag == 1 ? true : false}
              onChange={(value) =>
                paramsChange({
                  field: 'emailFlag',
                  value: value ? 1 : 0
                })
              }
            />
          </Col>
          <Col span={10}>*Send this email after the last attempt</Col>
        </Row>
        <Row style={{ height: '64px', lineHeight: '64px' }}>
          <Col span={6}>
            <Button
              type="primary"
              shape="round"
              style={{ marginRight: 10 }}
              onClick={() => saveSetting()}
            >
              {<FormattedMessage id="Subscription.save" />}
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Setting;
