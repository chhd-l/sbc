import React from 'react';
import { IMap, Relax } from 'plume2';

import { Form, Col, Row, Switch } from 'antd';
import { FindArea } from 'qmkit';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { fromJS } from 'immutable';
import * as webapi from '../webapi';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

const GreyBg = styled.div`
  background: #fafafa;
  padding: 15px;
  color: #333333;
  margin-bottom: 20px;

  span {
    width: 100px;
    text-align: right;
    color: #666666;
    display: inline-block;
    margin: 5px 0;
  }
  .reason {
    padding-left: 100px;
    position: relative;
    word-break: break-all;
    span {
      position: absolute;
      left: 0;
      top: -5px;
    }
  }
`;

// 审核状态 0、待审核 1、已审核 2、审核未通过
const AUDIT_STATE = {
  0: 'Pending review',
  1: 'Audited',
  2: 'Review failed'
};

// 店铺状态 0、开启 1、关店
const STORE_STATE = {
  0: 'Open',
  1: 'Close shop'
};

// 账户状态  0：启用   1：禁用
const ACCOUNT_STATE = {
  0: 'Enable',
  1: 'Disable'
};

@Relax
export default class StepOneEdit extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      company: IMap;
      dictionary: IMap;
    };
  };

  static relaxProps = {
    company: 'company',
    dictionary: 'dictionary'
  };
  getVauleByData(data, id) {
    let result = data.find((x) => x.id === id);
    if (result) {
      return result.valueEn;
    }
    return '';
  }
  getCountryName = (data, id) => {
    let result = data.find((x) => x.id === id);
    if (result) {
      if (result.valueEn) {
        sessionStorage.setItem('currentCountry', result.valueEn);
      } else {
        sessionStorage.setItem('currentCountry', '');
      }
      return result.valueEn;
    }
    sessionStorage.setItem('currentCountry', '');
    return '';
  };
  getVaulesByData(data, ids) {
    let idlist = ids ? ids.toJS() : [];
    let valueList = [];

    idlist.map(function (item, value) {
      let result = data.find((x) => x.id.toString() === item);
      if (result) {
        valueList.push(result.valueEn);
      }
    });
    return valueList.join(',');
  }
  render() {
    const { company } = this.props.relaxProps;
    const { dictionary } = this.props.relaxProps;
    const storeInfo = company.get('storeInfo');
    const countryData = dictionary.get('country').toJS();
    const cityData = dictionary.get('city').toJS();
    const languageData = dictionary.get('language').toJS();
    const currencyData = dictionary.get('currency').toJS();
    const timeZoneData = dictionary.get('timeZone').toJS();
    //拼接地址
    return (
      <div>
        <Row>
          <Col span={8}>
            <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="shopLogo" />}>
              <img src={storeInfo.get('storeLogo')} style={{ width: '100px' }}></img>
            </FormItem>
          </Col>
        </Row>
        <GreyBg>
          <Row>
            <Col span={8}>
              <span>
                <FormattedMessage id="reviewStatus" />：
              </span>{' '}
              {storeInfo.get('auditState') != null ? AUDIT_STATE[storeInfo.get('auditState')] : '-'}
            </Col>
            <Col span={8}>
              <span>
                <FormattedMessage id="accountStatus" />：
              </span>{' '}
              {storeInfo.get('accountState') != null ? ACCOUNT_STATE[storeInfo.get('accountState')] : '-'}
            </Col>
            <Col span={8}>
              <span>
                <FormattedMessage id="storeStatus" />：
              </span>{' '}
              {storeInfo.get('storeState') != null ? STORE_STATE[storeInfo.get('storeState')] : '-'}
            </Col>
            {storeInfo.get('auditState') != null && storeInfo.get('auditState') == 2 ? (
              <Col span={8}>
                <p className="reason">
                  <span>Reasons for review rejection:</span>
                  {storeInfo.get('auditReason') ? storeInfo.get('auditReason') : '-'}
                </p>
              </Col>
            ) : null}
            {storeInfo.get('accountState') != null && storeInfo.get('accountState') == 1 ? (
              <Col span={8}>
                <p className="reason">
                  <span>Reasons for disabling the account:</span>
                  {storeInfo.get('accountDisableReason') ? storeInfo.get('accountDisableReason') : '-'}
                </p>
              </Col>
            ) : null}
            {storeInfo.get('storeState') != null && storeInfo.get('storeState') == 1 ? (
              <Col span={8}>
                <p className="reason">
                  <span>Reasons for store closure:</span>
                  {storeInfo.get('storeClosedReason') ? storeInfo.get('storeClosedReason') : '-'}
                </p>
              </Col>
            ) : null}
          </Row>
        </GreyBg>
        <div>
          <Form>
            <Row>
              <Col span={12}>
                <span style={{ position: 'absolute', left: '86px', top: '30px' }} className="ant-form-item-required">
                  The first is the default language
                </span>
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="storeLanguage" />}>
                  <p style={{ color: '#333' }}>{this.getVaulesByData(languageData, storeInfo.get('languageId'))}</p>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="timeZone" />}>
                  <p style={{ color: '#333' }}>{this.getVauleByData(timeZoneData, storeInfo.get('timeZoneId'))}</p>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="targetCountry" />}>
                  <p style={{ color: '#333' }}>{this.getCountryName(countryData, storeInfo.get('countryId'))}</p>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="targetCity" />}>
                  <p style={{ color: '#333' }}>{this.getVaulesByData(cityData, storeInfo.get('cityIds'))}</p>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="currency" />}>
                  <p style={{ color: '#333' }}>{this.getVauleByData(currencyData, storeInfo.get('currencyId'))}</p>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="taxRate" />}>
                  <p style={{ color: '#333' }}>{storeInfo.get('taxRate')}%</p>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="domainName" />}>
                  <p style={{ color: '#333' }}>{storeInfo.get('domainName')}</p>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="miniCharge" />}>
                  <p style={{ color: '#333' }}>{storeInfo.get('miniCharge')}</p>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="prescriberMap" />}>
                  <Switch disabled={true} checked={storeInfo.get('prescriberMap') === '1' ? true : false} />
                </FormItem>
              </Col>
              {/* <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  required={false}
                  label={<FormattedMessage id="profilePaymentMethod" />}
                >
                  <Switch
                    disabled={true}
                    checked={
                      storeInfo.get('profilePaymentMethod') === '1'
                        ? true
                        : false
                    }
                  />
                </FormItem>
              </Col> */}

              <Col span={12}>
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="onePageCheckout" />}>
                  <Switch disabled={true} checked={storeInfo.get('onePageCheckout') === '1' ? true : false} />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} required={false} label="City Select">
                  <Switch disabled={true} checked={storeInfo.get('citySelection') === 1 ? true : false} />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}
