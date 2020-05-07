import React from 'react';
import { IMap, Relax } from 'plume2';

import { Form, Col, Row } from 'antd';
import { FindArea } from 'qmkit';
import styled from 'styled-components';

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
    };
  };

  static relaxProps = {
    company: 'company'
  };

  render() {
    const { company } = this.props.relaxProps;
    const storeInfo = company.get('storeInfo');
    //拼接地址
    const area = FindArea.addressInfo(
      storeInfo.get('provinceId'),
      storeInfo.get('cityId'),
      storeInfo.get('areaId')
    );

    return (
      <div>
        <GreyBg>
          <Row>
            <Col span={8}>
              <span>审核状态：</span>{' '}
              {storeInfo.get('auditState') != null
                ? AUDIT_STATE[storeInfo.get('auditState')]
                : '-'}
            </Col>
            <Col span={8}>
              <span>账号状态：</span>{' '}
              {storeInfo.get('accountState') != null
                ? ACCOUNT_STATE[storeInfo.get('accountState')]
                : '-'}
            </Col>
            <Col span={8}>
              <span>店铺状态：</span>{' '}
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
              <p style={{ color: '#333' }}>{storeInfo.get('supplierCode')}</p>
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="商家名称">
              <p style={{ color: '#333' }}>{storeInfo.get('supplierName')}</p>
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="店铺名称">
              <p style={{ color: '#333' }}>{storeInfo.get('storeName')}</p>
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="联系人">
              <p style={{ color: '#333' }}>{storeInfo.get('contactPerson')}</p>
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="联系方式">
              <p style={{ color: '#333' }}>{storeInfo.get('contactMobile')}</p>
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="联系邮箱">
              <p style={{ color: '#333' }}>{storeInfo.get('contactEmail')}</p>
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="所在地区">
              <p style={{ color: '#333' }}>{area}</p>
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="详细地址">
              <p style={{ color: '#333' }}>{storeInfo.get('addressDetail')}</p>
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="商家账号">
              <p style={{ color: '#333' }}>{storeInfo.get('accountName')}</p>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}
