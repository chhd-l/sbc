import React, { Component, useEffect, useState } from 'react';
import { Headline, BreadCrumb, DragTable, Const, RCi18n } from 'qmkit';
import {Row, Col, Button, message, Tooltip, Divider, Popconfirm, Switch, Form, Modal, Spin } from 'antd';
import { Link } from 'react-router-dom';

import { FormattedMessage, injectIntl } from 'react-intl';
// import TextArea from 'antd/es/input/TextArea';
import TextArea from 'antd/lib/input/TextArea';
import { editDeliveryOption } from '@/shipping-fee-setting/webapi';
import * as webapi from './webapi';
import { editBannerOption } from './webapi'



const index = () => {
  const [bannerSwitch,setBannerSwitch] = useState(false);
  const [bannerContent,setBannerContent] = useState('null');
  const [buttonContent,setButtonContent] = useState('null');
  const [buttonLink,setButtonLink] = useState('null');

  const [bannerStatus,setBannerStatus] = useState(0);
  const [buttonStatus,setButtonStatus] = useState(0);
  const [bannerIconStatus,setBannerIconStatus] = useState(0);

  useEffect(() => {
      webapi
        .GetBanner()
        .then((data) => {
          const res = data.res;
          console.log(JSON.stringify(res)+'11111')
          if (res.code === Const.SUCCESS_CODE){
            if (res.context && res.context.id && res.context.openDate){
              if (!res.context.closeDate){
                res.context.closeDate = [];
              }
            }
            //BannerData
            if (res?.context?.systemConfigVO){
              let sco = res.context.sysDictionaryVOS;
              setBannerStatus(sco.status);
              setBannerSwitch(sco.status === 1 ? true : false);
            }
          }else {
            message.error(res.message || []);
          }
        })
        .catch(() => {
          message.error('error');
        });
      webapi
        .getBannerForm()
        .then((data) =>{
          const res = data.res;
          if (res.code === Const.SUCCESS_CODE) {
            if (bannerStatus) {
              setBannerContent(res.context.bannerContent)
              setButtonContent(res.context.buttonContent)
              setButtonLink(res.context.buttonLink)
              // setBannerForm(res.context);
            }else {
              message.error('error2');
            }
          }
        })
        .catch(() => {
          message.error('error3');
        })
  }, []),

  useEffect( () =>{
    webapi
      .setBannerContent(bannerContent)


  },[bannerContent]),

  useEffect(() =>{
    webapi
      .setButtonContent(buttonContent)
  },[buttonContent]),

  useEffect( () =>{
    webapi
      .setBannerLink(buttonLink)
  },[buttonLink])

  function onChangeField(checked: boolean) {
    // editBannerOption(checked ? 1 : 0 )
    //   .then((data) => {
    //     const { res } = data;
    //     if ( res.code === 'k-000000'){
    //       message.success('Operate successfully');
    //       setBannerSwitch(checked);
    //     } else {
    //       message.error(res.message || 'update Failed');
    //     }
    //   })
    //   .catch((err) => {
    //     message.error(err || 'Update Failed');
    //   })
    // @ts-ignore
    setBannerStatus(!bannerStatus);
  }
  function onChangeIconField(checked: boolean) {
    // editBannerOption(checked ? 1 : 0 )
    //   .then((data) => {
    //     const { res } = data;
    //     if ( res.code === 'k-000000'){
    //       message.success('Operate successfully');
    //       setBannerSwitch(checked);
    //     } else {
    //       message.error(res.message || 'update Failed');
    //     }
    //   })
    //   .catch((err) => {
    //     message.error(err || 'Update Failed');
    //   })
    // @ts-ignore
    setBannerIconStatus(!bannerIconStatus);
  }
  function onChangeButton(checked: boolean) {
    // editBannerOption(checked ? 1 : 0 )
    //   .then((data) => {
    //     const { res } = data;
    //     if ( res.code === 'k-000000'){
    //       message.success('Operate successfully');
    //       setBannerSwitch(checked);
    //     } else {
    //       message.error(res.message || 'update Failed');
    //     }
    //   })
    //   .catch((err) => {
    //     message.error(err || 'Update Failed');
    //   })
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
        setButtonLink(value);
        break;
    }
  };

  return (
      <div>
        <BreadCrumb />

        <div
          className="container"
          style={{ minHeight: '100vh', background: '#fff' }}
        >
          <Row gutter={[16, 16]}>
            <Col span={4} ><p >Button: </p></Col>
            <Col span={1} style={{width:'55px'}}><p >Enable:</p></Col>
            <Col span={4}>
              <Switch checked={bannerStatus == 1 ? true : false} onChange={(checked) => onChangeField(checked)} />
            </Col>
          </Row>

          {bannerStatus == 1 ? (
            <>
              <div style={{padding:'22px'}}>
                <Row gutter={[16, 16]}><Col span={4} style={{width:'171px'}}><p>Marketing Banner Icon</p></Col>
                  <Col span={1} style={{width:'55px'}}><p >Enable:</p></Col>
                  <Col span={4}>
                    <Switch checked={bannerIconStatus == 1 ? true : false} onChange={(checked) => onChangeIconField(checked)} />
                  </Col>
                </Row>
                <Row gutter={[16, 16]} >
                  <Col span={1} />
                  <Col span={3} ><p className="ant-form-item-required">Marketing Banner Content</p></Col>
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
                <Row gutter={[16, 16]}><Col span={4} style={{width:'171px'}}><p>Button</p></Col>
                  <Col span={1} style={{width:'55px'}}><p >Enable:</p></Col>
                  <Col span={4}>
                    <Switch checked={buttonStatus == 1 ? true : false} onChange={(checked) => onChangeButton(checked)} />
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={1}/>
                  <Col span={3}><p>Button Content</p></Col>
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
                  <Col span={3}><p>Button Hyperlink</p></Col>
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
                <div className="bar-button">
                  <Button  type="primary" style={{ marginRight: 10 }}>
                    {<FormattedMessage id="Order.save" />}
                  </Button>
                </div>
                {/*<Row gutter={[16, 16]}>*/}
                {/*  <Col  span={3}>*/}
                {/*    <Button className="ant-btn ant-btn-primary">SAVE</Button>*/}
                {/*  </Col>*/}
                {/*</Row>*/}
              </div>

              </>
            ):null}
        </div>

      </div>
    )

}
export default index;