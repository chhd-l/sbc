import React, { useEffect, useState } from 'react';
import { BreadCrumb, Const } from 'qmkit';
import { Row, Col, Button, message, Switch } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import * as webapi from './webapi';

import { FormattedMessage } from 'react-intl';

const Index = () => {
  const [bannerForm, setBannerForm] = useState({
    id: '',
    status: false,
    content: '',
    iconStatus: false,
    buttonStatus: false,
    buttonContent: '',
    buttonHyperlink: ''
  });

  useEffect(() => {
    webapi
      .GetBanner()
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          const result = JSON.parse(JSON.stringify(res.context));
          const { status, iconStatus, buttonStatus, content, buttonContent, buttonHyperlink } =
            res.context;
          setBannerForm({
            status: status === 1,
            iconStatus: iconStatus === 1,
            buttonStatus: buttonStatus === 1,
            content,
            buttonContent,
            buttonHyperlink,
            id: result.id
          });
        } else if (res.code === 'marketingBannerVO is not exist') {
          message.warning('Data does not exist, please add it manually ');
        } else {
          message.error(res.message || []);
        }
      })
      .catch(() => {
        message.error('error');
      });
  }, []);

  function onTagFormChange({ field, value }) {
    switch (field) {
      case 'bannerContent':
        setBannerForm({ ...bannerForm, content: value });
        break;
      case 'buttonContent':
        setBannerForm({ ...bannerForm, buttonContent: value });
        break;
      case 'buttonLink':
        if (/^((https|http|ftp|rtsp|mms))/) {
          setBannerForm({ ...bannerForm, buttonHyperlink: value });
        }

        break;
    }
  }

  function saveBannerSet() {
    const { id, status, iconStatus, buttonStatus, content, buttonContent, buttonHyperlink } =
      bannerForm;
    const data = {
      status: status ? 1 : 0,
      iconStatus: iconStatus ? 1 : 0,
      buttonStatus: buttonStatus ? 1 : 0,
      content,
      buttonContent,
      buttonHyperlink,
      id
    };

    webapi.setBannerForm(data).then(({ res }) => {
      if (res.code == Const.SUCCESS_CODE) {
        message.success('Operation successful');
      } else {
        message.error('error');
      }
    });
  }

  return (
    <div>
      <BreadCrumb />
      <div className="container" style={{ minHeight: '100vh', background: '#fff' }}>
        <Row gutter={[16, 16]}>
          <Col span={4} style={{ width: '203px' }}>
            <p>Display Marketing Banner </p>
          </Col>
          <Col span={1} style={{ width: '55px' }}>
            <p>Enable:</p>
          </Col>
          <Col span={4}>
            <Switch
              checked={bannerForm.status}
              onChange={(checked) => setBannerForm({ ...bannerForm, status: checked })}
            />
          </Col>
        </Row>

        {bannerForm.status ? (
          <>
            <div style={{ padding: '22px' }}>
              <Row gutter={[16, 16]}>
                <Col span={4} style={{ width: '182px' }}>
                  <p>Marketing Banner Icon</p>
                </Col>
                <Col span={1} style={{ width: '55px' }}>
                  <p>Enable:</p>
                </Col>
                <Col span={4}>
                  <Switch
                    checked={bannerForm.iconStatus}
                    onChange={(checked) => setBannerForm({ ...bannerForm, iconStatus: checked })}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={4}>
                  <p className="ant-form-item-required">Marketing Banner Content</p>
                </Col>
                <Col span={9}>
                  <TextArea
                    rows={3}
                    value={bannerForm.content}
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      onTagFormChange({
                        field: 'bannerContent',
                        value
                      });
                    }}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={1} style={{ width: '111px' }} />
                <Col span={2} style={{ width: '70px' }}>
                  <p>Button</p>
                </Col>
                <Col span={1} style={{ width: '55px' }}>
                  <p>Enable:</p>
                </Col>
                <Col span={4}>
                  <Switch
                    checked={bannerForm.buttonStatus}
                    onChange={(checked) => setBannerForm({ ...bannerForm, buttonStatus: checked })}
                  />
                </Col>
              </Row>
              {bannerForm.buttonStatus && (
                <>
                  <Row gutter={[16, 16]}>
                    <Col span={1} />
                    <Col span={3}>
                      <p className="ant-form-item-required">
                        {Const.SITE_NAME === 'MYVETRECO' ? 'Button Label' : 'Button Content'}
                      </p>
                    </Col>
                    <Col span={9}>
                      <TextArea
                        rows={3}
                        value={bannerForm.buttonContent}
                        onChange={(e) => {
                          const value = (e.target as any).value;
                          onTagFormChange({
                            field: 'buttonContent',
                            value
                          });
                        }}
                      />
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col span={1} />
                    <Col span={3}>
                      <p className="ant-form-item-required">Button Hyperlink</p>
                    </Col>
                    <Col span={9}>
                      <TextArea
                        rows={1}
                        value={bannerForm.buttonHyperlink}
                        onChange={(e) => {
                          const value = (e.target as any).value;
                          onTagFormChange({
                            field: 'buttonLink',
                            value
                          });
                        }}
                      />
                    </Col>
                  </Row>
                </>
              )}
            </div>
          </>
        ) : null}
      </div>
      <div className="bar-button">
        <Button type="primary" onClick={saveBannerSet}>
          <FormattedMessage id="Setting.Save" />
        </Button>
      </div>
    </div>
  );
};
export default Index;
