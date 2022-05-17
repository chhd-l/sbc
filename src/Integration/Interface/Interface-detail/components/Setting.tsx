import { Button, Row, Form, Col, Switch, InputNumber, Icon } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import '../css/setting.less';

const Setting = (props: any) => {
  const { saveSetting, settingparams, paramsChange } = props;
  const [isShow, setIsShow] = useState(false);
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
              max={10}
              style={{ width: '90%' }}
              defaultValue={0}
              value={settingparams?.retryNum}
              onChange={(value) =>
                paramsChange({
                  field: 'retryNum',
                  value: value
                })
              }
            />
          </Col>
          <Col
            span={4}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>Attempts during broken integration</span>
            <i className="hovericon" style={{ position: 'relative' }}>
              <Icon type="exclamation-circle" />
              <p
                style={{
                  lineHeight: '18px',
                  backgroundColor: '#f4f4f4',
                  // marginTop: '30px',
                  // marginLeft: '10px',
                  padding: '4px',
                  color: '#80868e',
                  position: 'absolute',
                  top: '33px',
                  left: '18px',
                  width: '500px',
                  fontStyle: 'normal'
                }}
              >
                Retry attempts happen regularly for up to 7 days, at increasing time intervals:{' '}
                <br />
                <strong>·</strong> 5 minutes <br />
                <strong>·</strong> 10 minutes <br />
                <strong>·</strong> 15 minutes <br />
                <strong>·</strong> 30 minutes <br />
                <strong>·</strong> 1 hour <br />
                <strong>·</strong> 2 hours <br />
                <strong>·</strong> 4 hours <br />
                After that, retries happen every 8 hours for the following 7 days.
              </p>
            </i>
          </Col>
          <Col span={8} style={{ display: isShow ? 'block' : 'none' }}></Col>
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
