import React, { useEffect, useState } from 'react';
import { BreadCrumb, Const } from 'qmkit';
import { Row, Col, Button, message, Switch } from 'antd';

import { FormattedMessage } from 'react-intl';
// import TextArea from 'antd/es/input/TextArea';
import TextArea from 'antd/lib/input/TextArea';
import * as webapi from './webapi';

const index = () => {
  const [bannerContent, setBannerContent] = useState(' ');
  const [buttonContent, setButtonContent] = useState(' ');
  const [buttonLink, setButtonLink] = useState(' ');

  const [bannerStatus, setBannerStatus] = useState(false);
  const [buttonStatus, setButtonStatus] = useState(false);
  const [bannerIconStatus, setBannerIconStatus] = useState(false);
  const [bannerForm, setBannerForm] = useState({
    id: '',
    status: Number(bannerStatus),
    content: bannerContent,
    iconStatus: Number(bannerIconStatus),
    buttonStatus: Number(buttonStatus),
    buttonContent: buttonContent,
    buttonHyperlink: buttonLink
  });

  useEffect(() => {
    webapi
      .GetBanner()
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let data = JSON.parse(JSON.stringify(res.context));
          setBannerStatus(res.context.status === 1);
          setBannerIconStatus(res.context.iconStatus === 1);
          setButtonStatus(res.context.buttonStatus === 1);
          setBannerContent(res.context.content);
          setButtonContent(res.context.buttonContent);
          setButtonLink(res.context.buttonHyperlink);
          bannerForm.id = data.id;
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
    // let data = this.state.tagForm;
    // data[field] = value;
    // this.setState({
    //   searchForm: data
    // });
    switch (field) {
      case 'bannerContent':
        setBannerContent(value);
        break;
      case 'buttonContent':
        setButtonContent(value);
        break;
      case 'buttonLink':
        if (/^((https|http|ftp|rtsp|mms))/) {
          setButtonLink(value);
        }

        break;
    }
  }

  function saveBannerSet() {
    let data = JSON.parse(JSON.stringify(bannerForm));
    if (bannerStatus) {
      data.status = 1;
    } else {
      data.status = 0;
    }
    if (bannerIconStatus) {
      data.iconStatus = 1;
    } else {
      data.iconStatus = 0;
    }
    if (buttonStatus) {
      data.buttonStatus = 1;
    } else {
      data.buttonStatus = 0;
    }
    data.content = bannerContent;
    data.buttonContent = buttonContent;
    data.buttonHyperlink = buttonLink;

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
            <Switch checked={bannerStatus} onChange={setBannerStatus} />
          </Col>
        </Row>

        {bannerStatus ? (
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
                  <Switch checked={bannerIconStatus} onChange={setBannerIconStatus} />
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={4}>
                  <p className="ant-form-item-required">Marketing Banner Content</p>
                </Col>
                <Col span={9}>
                  <TextArea
                    rows={3}
                    value={bannerContent}
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
                  <Switch checked={buttonStatus} onChange={setButtonStatus} />
                </Col>
              </Row>

              {buttonStatus ? (
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
                        value={buttonContent}
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
                        value={buttonLink}
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
              ) : null}
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
export default index;
