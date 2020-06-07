import React from 'react';
import { IMap, Relax } from 'plume2';

import { Form, Input, Button, Col, Row, Select, InputNumber } from 'antd';
import { noop, ValidConst, AreaSelect, QMMethod } from 'qmkit';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import * as webapi from './../webapi';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 14,
      offset: 6
    }
  }
};

const GreyBg = styled.div`
  background: #f5f5f5;
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
  0: '待审核',
  1: '已审核',
  2: '审核未通过'
};

// 店铺状态 0、开启 1、关店
const STORE_STATE = {
  0: '开启',
  1: '关店'
};

// 账户状态  0：启用   1：禁用
const ACCOUNT_STATE = {
  0: '启用',
  1: '禁用'
};

@Relax
export default class StepOneEdit extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      company: IMap;
      dictionary: IMap;
      onChange: Function; //改变商家基本信息
      onEditStoreInfo: Function;
    };
  };

  static relaxProps = {
    company: 'company',
    dictionary: 'dictionary',
    onChange: noop,
    onEditStoreInfo: noop
  };
  render() {
    const { company, onChange, dictionary } = this.props.relaxProps;
    const storeInfo = company.get('storeInfo');
    const { getFieldDecorator } = this.props.form;
    const countryData = dictionary.get('country').toJS();
    const cityData = dictionary.get('city').toJS();
    const languageData = dictionary.get('language').toJS();
    const currencyData = dictionary.get('currency').toJS();
    const timeZoneData = dictionary.get('timeZone').toJS();

    return (
      <div>
        <GreyBg>
          <Row>
            <Col span={8}>
              <span>
                <FormattedMessage id="reviewStatus" />：
              </span>{' '}
              {storeInfo.get('auditState') != null
                ? AUDIT_STATE[storeInfo.get('auditState')]
                : '-'}
            </Col>
            <Col span={8}>
              <span>
                <FormattedMessage id="accountStatus" />：
              </span>{' '}
              {storeInfo.get('accountState') != null
                ? ACCOUNT_STATE[storeInfo.get('accountState')]
                : '-'}
            </Col>
            <Col span={8}>
              <span>
                <FormattedMessage id="storeStatus" />：
              </span>{' '}
              {storeInfo.get('storeState') != null
                ? STORE_STATE[storeInfo.get('storeState')]
                : '-'}
            </Col>
            {storeInfo.get('auditState') != null &&
            storeInfo.get('auditState') == 2 ? (
              <Col span={8}>
                <p className="reason">
                  <span>审核驳回原因：</span>
                  {storeInfo.get('auditReason')
                    ? storeInfo.get('auditReason')
                    : '-'}
                </p>
              </Col>
            ) : null}
            {storeInfo.get('accountState') != null &&
            storeInfo.get('accountState') == 1 ? (
              <Col span={8}>
                <p className="reason">
                  <span>账号禁用原因：</span>
                  {storeInfo.get('accountDisableReason')
                    ? storeInfo.get('accountDisableReason')
                    : '-'}
                </p>
              </Col>
            ) : null}
            {storeInfo.get('storeState') != null &&
            storeInfo.get('storeState') == 1 ? (
              <Col span={8}>
                <p className="reason">
                  <span>店铺关闭原因：</span>
                  {storeInfo.get('storeClosedReason')
                    ? storeInfo.get('storeClosedReason')
                    : '-'}
                </p>
              </Col>
            ) : null}
          </Row>
        </GreyBg>
        <div>
          <Form>
            <Row>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  required={false}
                  label={<FormattedMessage id="storeLanguage" />}
                >
                  {getFieldDecorator('languageId', {
                    initialValue: storeInfo.get('languageId'),
                    rules: [
                      { required: false, message: 'Please select Language!' }
                    ]
                  })(
                    // <Input
                    //   placeholder="商家名称不得超过20字符"
                    //   onChange={(e: any) =>
                    //     onChange({
                    //       field: 'supplierName',
                    //       value: e.target.value
                    //     })
                    //   }
                    // />
                    <Select
                      onChange={(value) =>
                        onChange({
                          field: 'languageId',
                          value: value
                        })
                      }
                    >
                      {languageData.map((item) => (
                        <Option value={item.id} key={item.id}>
                          {item.valueEn}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  required={false}
                  label={<FormattedMessage id="timeZone" />}
                >
                  {getFieldDecorator('timeZoneId', {
                    initialValue: storeInfo.get('timeZoneId'),
                    rules: [
                      { required: false, message: 'Please select TimeZone!' }
                    ]
                  })(
                    <Select
                      onChange={(value) =>
                        onChange({
                          field: 'timeZoneId',
                          value: value
                        })
                      }
                    >
                      {timeZoneData.map((item) => (
                        <Option value={item.id} key={item.id}>
                          {item.valueEn}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  required={false}
                  label={<FormattedMessage id="targetCountry" />}
                >
                  {getFieldDecorator('countryId', {
                    initialValue: storeInfo.get('countryId'),
                    rules: [
                      { required: false, message: 'Please select Country!' }
                    ]
                  })(
                    <Select
                      onChange={(value) => {
                        onChange({
                          field: 'countryId',
                          value: value
                        });
                      }}
                    >
                      {countryData.map((item) => (
                        <Option value={item.id} key={item.id}>
                          {item.valueEn}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  required={false}
                  label={<FormattedMessage id="targetCity" />}
                >
                  {getFieldDecorator('cityId', {
                    initialValue: storeInfo.get('cityId'),
                    rules: [{ required: false, message: 'Please select City!' }]
                  })(
                    <Select
                      onChange={(value) =>
                        onChange({
                          field: 'cityId',
                          value: value
                        })
                      }
                    >
                      {cityData.map((item) => (
                        <Option value={item.id} key={item.id}>
                          {item.valueEn}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  required={false}
                  label={<FormattedMessage id="currency" />}
                >
                  {getFieldDecorator('currencyId', {
                    initialValue: storeInfo.get('currencyId'),
                    rules: [
                      { required: false, message: 'Please select Currency!' }
                    ]
                  })(
                    <Select
                      onChange={(value) =>
                        onChange({
                          field: 'currencyId',
                          value: value
                        })
                      }
                    >
                      {currencyData.map((item) => (
                        <Option value={item.id} key={item.id}>
                          {item.valueEn}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  required={false}
                  label={<FormattedMessage id="taxRate" />}
                >
                  {getFieldDecorator('taxRate', {
                    initialValue: parseInt(storeInfo.get('taxRate')),
                    rules: [
                      { required: false, message: 'Please input taxRate!' }
                    ]
                  })(
                    <InputNumber
                      min={0}
                      onChange={(value) =>
                        onChange({
                          field: 'taxRate',
                          value: value + ''
                        })
                      }
                    />
                  )}{' '}
                  %
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem {...tailFormItemLayout}>
                  <Button type="primary" onClick={this._onSave}>
                    <FormattedMessage id="save" />
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }

  /**
   * 保存商家基本信息
   */
  _onSave = () => {
    const form = this.props.form;
    const { onEditStoreInfo, company } = this.props.relaxProps;
    form.validateFields(null, (errs) => {
      //如果校验通过
      if (!errs) {
        let storeInfo = company.get('storeInfo');
        onEditStoreInfo(storeInfo);
      } else {
        this.setState({});
      }
    });
  };
}
