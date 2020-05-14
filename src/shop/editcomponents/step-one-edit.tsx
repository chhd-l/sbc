import React from 'react';
import { IMap, Relax } from 'plume2';

import { Form, Input, Button, Col, Row } from 'antd';
import { noop, ValidConst, AreaSelect, QMMethod } from 'qmkit';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;

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
      onChange: Function; //改变商家基本信息
      onEditStoreInfo: Function;
    };
  };

  static relaxProps = {
    company: 'company',
    onChange: noop,
    onEditStoreInfo: noop
  };

  render() {
    const { company, onChange } = this.props.relaxProps;
    const storeInfo = company.get('storeInfo');
    const { getFieldDecorator } = this.props.form;
    const area = storeInfo.get('provinceId')
      ? [
          storeInfo.get('provinceId').toString(),
          storeInfo.get('cityId') ? storeInfo.get('cityId').toString() : null,
          storeInfo.get('areaId') ? storeInfo.get('areaId').toString() : null
        ]
      : [];

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
        <div style={{ width: 520 }}>
          <Form>
            <FormItem {...formItemLayout} required={true} label="商家编号">
              {getFieldDecorator('supplierCode', {
                initialValue: storeInfo.get('supplierCode')
              })(<Input disabled={true} />)}
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="商家名称">
              {getFieldDecorator('supplierName', {
                initialValue: storeInfo.get('supplierName'),
                rules: [
                  { required: true, message: '请填写商家名称' },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorTrimMinAndMax(
                        rule,
                        value,
                        callback,
                        '商家名称',
                        1,
                        20
                      );
                    }
                  }
                ]
              })(
                <Input
                  placeholder="商家名称不得超过20字符"
                  onChange={(e: any) =>
                    onChange({
                      field: 'supplierName',
                      value: e.target.value
                    })
                  }
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="店铺名称">
              {getFieldDecorator('storeName', {
                initialValue: storeInfo.get('storeName'),
                rules: [
                  { required: true, message: '请填写店铺名称' },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorTrimMinAndMax(
                        rule,
                        value,
                        callback,
                        '店铺名称',
                        1,
                        20
                      );
                    }
                  }
                ]
              })(
                <Input
                  placeholder="店铺名称不得超过20字符"
                  onChange={(e: any) =>
                    onChange({
                      field: 'storeName',
                      value: e.target.value
                    })
                  }
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="联系人">
              {getFieldDecorator('contactPerson', {
                initialValue: storeInfo.get('contactPerson'),
                rules: [
                  { required: true, message: '请填写联系人' },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorTrimMinAndMax(
                        rule,
                        value,
                        callback,
                        '联系人',
                        2,
                        15
                      );
                    }
                  }
                ]
              })(
                <Input
                  placeholder="请输入常用联系人姓名"
                  onChange={(e: any) =>
                    onChange({
                      field: 'contactPerson',
                      value: e.target.value
                    })
                  }
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="联系方式">
              {getFieldDecorator('contactMobile', {
                initialValue: storeInfo.get('contactMobile'),
                rules: [
                  { required: true, message: '请填写联系方式' },
                  { pattern: ValidConst.phone, message: '请输入正确的联系方式' }
                ]
              })(
                <Input
                  placeholder="请输入常用联系人11位手机号"
                  onChange={(e: any) =>
                    onChange({
                      field: 'contactMobile',
                      value: e.target.value
                    })
                  }
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="联系邮箱">
              {getFieldDecorator('contactEmail', {
                initialValue: storeInfo.get('contactEmail'),
                rules: [
                  { required: true, message: '请填写联系邮箱' },
                  {
                    pattern: ValidConst.email,
                    message: '请输入正确的联系邮箱'
                  },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorTrimMinAndMax(
                        rule,
                        value,
                        callback,
                        '联系邮箱',
                        1,
                        100
                      );
                    }
                  }
                ]
              })(
                <Input
                  placeholder="请输入常用联系邮箱"
                  onChange={(e: any) =>
                    onChange({
                      field: 'contactEmail',
                      value: e.target.value
                    })
                  }
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="所在地区">
              {getFieldDecorator('area', {
                initialValue: area,
                rules: [{ required: true, message: '请选择所在地区' }]
              })(
                <AreaSelect
                  placeholder="请选择所在地区"
                  getPopupContainer={() =>
                    document.getElementById('page-content')
                  }
                  onChange={(value) =>
                    onChange({ field: 'area', value: value })
                  }
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="详细地址">
              {getFieldDecorator('addressDetail', {
                initialValue: storeInfo.get('addressDetail'),
                rules: [
                  { required: true, message: '请填写详细地址' },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorTrimMinAndMax(
                        rule,
                        value,
                        callback,
                        '详细地址',
                        1,
                        60
                      );
                    }
                  }
                ]
              })(
                <Input
                  placeholder="请输入详细地址"
                  onChange={(e) =>
                    onChange({
                      field: 'addressDetail',
                      value: (e.target as any).value
                    })
                  }
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="商家账号">
              {getFieldDecorator('accountName', {
                initialValue: storeInfo.get('accountName')
              })(<Input disabled={true} />)}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" onClick={this._onSave}>
                保存
              </Button>
            </FormItem>
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
        onEditStoreInfo(company.get('storeInfo'));
      } else {
        this.setState({});
      }
    });
  };
}
