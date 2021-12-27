import React, { Component, useEffect, useState } from 'react';
import { Headline, BreadCrumb, DragTable, Const, RCi18n } from 'qmkit';
import {Row, Col, Button, message, Tooltip, Divider, Popconfirm, Switch, Form, Modal, Spin } from 'antd';
import { Link } from 'react-router-dom';

import { FormattedMessage, injectIntl } from 'react-intl';
// import TextArea from 'antd/es/input/TextArea';
import TextArea from 'antd/lib/input/TextArea';
import * as webapi from './webapi';
import { instanceOf } from 'prop-types';
import { View } from '@antv/x6';

const index = () => {
  const [bannerContent,setBannerContent] = useState(' ');
  const [buttonContent,setButtonContent] = useState(' ');
  const [buttonLink,setButtonLink] = useState(' ');

  const [bannerStatus,setBannerStatus] = useState(0);
  const [buttonStatus,setButtonStatus] = useState(0);
  const [bannerIconStatus,setBannerIconStatus] = useState(0);
  const [bannerForm,setBannerForm] = useState({
    id:'',
    status:bannerStatus,
    content:bannerContent,
    iconStatus:bannerIconStatus,
    buttonStatus:buttonStatus,
    buttonContent:buttonContent,
    buttonHyperlink:buttonLink
  })

  useEffect(() => {
      webapi
        .GetBanner()
        .then((data) => {
          const {res} = data;
          // console.log(JSON.stringify(res)+'WQQQW')
          // console.log(JSON.stringify(res)+'11111')
          if (res.code === Const.SUCCESS_CODE) {
            let data = JSON.parse(JSON.stringify(res.context))
              console.log(res.context.status)
              setBannerStatus(res.context.status)
              setBannerIconStatus(res.context.iconStatus)
              setButtonStatus(res.context.buttonStatus)
              setBannerContent(res.context.content)
              setButtonContent(res.context.buttonContent)
              setButtonLink(res.context.buttonHyperlink)
                bannerForm.id = data.id
            console.log(bannerForm)
          }else {
            message.error(res.message || []);
          }
        })
        .catch(() => {
          message.error('error');
        });
  }, [])

  function onChangeField(checked: boolean) {
    // @ts-ignore
    setBannerStatus(!bannerStatus);
  }
  function onChangeIconField(checked: boolean) {
    // @ts-ignore
    setBannerIconStatus(!bannerIconStatus);
  }
  function onChangeButton(checked: boolean) {
    // @ts-ignore
    setButtonStatus(!buttonStatus);
  }

  function bannerContentChange(value: React.ChangeEvent<HTMLTextAreaElement>) {
    // @ts-ignore
    setBannerContent(value)
    // bannerContent = setBannerForm(value);
  }

  function onTagFormChange  ({ field, value }) {
    // let data = this.state.tagForm;
    // data[field] = value;
    // this.setState({
    //   searchForm: data
    // });
    switch (field){
      case 'bannerContent':
          setBannerContent(value);
        break;
      case 'buttonContent':
        setButtonContent(value);
        break;
      case 'buttonLink':
        if ((/^((https|http|ftp|rtsp|mms))/) ){
          setButtonLink(value);
        }


        break;
    }
  };

  function saveBannerSet() {
    let data = JSON.parse(JSON.stringify(bannerForm))
    if (bannerStatus){
      data.status = 1
    }else {
      data.status = 0
    }
    if (bannerIconStatus){
      data.iconStatus = 1
    }else {
      data.iconStatus = 0
    }
    if (buttonStatus){
      data.buttonStatus = 1
    }else {
      data.buttonStatus = 0
    }
      data.content = bannerContent,
      data.buttonContent = buttonContent,
      data.buttonHyperlink = buttonLink,
        console.log(bannerStatus+'bannerStatus')
    console.log(bannerIconStatus+'bannerIconStatus')
    console.log(data)

    webapi
      .setBannerForm(data).then(({ res }) => {
      if (res.code == Const.SUCCESS_CODE){
        message.success('Operation successful');
      }else {
        message.error('error')
      }
    });

  }

  return (
      <div>
        <BreadCrumb />
        <div
          className="container"
          style={{ minHeight: '100vh', background: '#fff' }}
        >
          <Row gutter={[16, 16]}>
            <Col span={4} style={{width:'203px'}} ><p >Display Marketing Banner </p></Col>
            <Col span={1} style={{width:'55px'}}><p >Enable:</p></Col>
            <Col span={4}>
              <Switch checked={bannerStatus == 1 ? true : false} onChange={(checked) => onChangeField(checked)} />
            </Col>
          </Row>

          {bannerStatus == 1 ? (
            <>
              <div style={{padding:'22px'}}>
                <Row gutter={[16, 16]}><Col span={4} style={{width:'182px'}}><p>Marketing Banner Icon</p></Col>
                  <Col span={1} style={{width:'55px'}}><p >Enable:</p></Col>
                  <Col span={4}>
                    <Switch checked={bannerIconStatus == 1 ? true : false} onChange={(checked) => onChangeIconField(checked)} />
                  </Col>
                </Row>
                <Row gutter={[16, 16]} >
                  <Col span={4} ><p className="ant-form-item-required">Marketing Banner Content</p></Col>
                  <Col span={9}>
                    <TextArea rows={3}
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
                  <Col span={1} style={{width:'111px'}} />
                  <Col span={2} style={{width:'70px'}}><p>Button</p></Col>
                  <Col span={1} style={{width:'55px'}}><p >Enable:</p></Col>
                  <Col span={4}>
                    <Switch checked={buttonStatus == 1 ? true : false} onChange={(checked) => onChangeButton(checked)} />
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={1}/>
                  <Col span={3}><p  className="ant-form-item-required">Button Content</p></Col>
                  <Col span={9}>
                    <TextArea rows={3}
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
                  <Col span={1}/>
                  <Col span={3}><p  className="ant-form-item-required">Button Hyperlink</p></Col>
                  <Col span={9}>
                    <TextArea rows={1}
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
                {/*<Row gutter={[16, 16]}>*/}
                {/*  <Col  span={3}>*/}
                {/*    <Button className="ant-btn ant-btn-primary">SAVE</Button>*/}
                {/*  </Col>*/}
                {/*</Row>*/}
              </div>

              </>
            ):null}
        </div>
        <div className="bar-button">
          <Button type="primary" onClick={saveBannerSet}>
            <FormattedMessage id="Setting.Save" />
          </Button>
        </div>
      </div>
    )

}
export default index;