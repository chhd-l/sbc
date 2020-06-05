import React from 'react';
import { Relax, IMap } from 'plume2';
import { Row, Col, Form, Modal } from 'antd';
import styled from 'styled-components';

import moment from 'moment';
import { FormattedMessage } from 'react-intl';
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 12 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 12 }
  }
};

const formItemPhoto = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 12 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 12 }
  }
};

const PicBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justifycontent: flex-start;
  width: 430px;
  img {
    width: 60px;
    height: 60px;
    padding: 5px;
    border: 1px solid #ddd;
    margin-right: 10px;
    margin-bottom: 10px;
  }
`;

@Relax
export default class StepTwo extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      company: IMap;
    };
  };

  static relaxProps = {
    company: 'company'
  };

  componentWillMount() {
    this.setState({
      showImg: false,
      imgUrl: ''
    });
  }

  render() {
    const { company } = this.props.relaxProps;
    const info = company ? company.get('info') : {};
    const businessLicence = info.get('businessLicence')
      ? JSON.parse(info.get('businessLicence'))
      : [];
    const backIDCard = info.get('backIDCard')
      ? JSON.parse(info.get('backIDCard'))
      : [];
    const frontIDCard = info.get('frontIDCard')
      ? JSON.parse(info.get('frontIDCard'))
      : [];

    let IDImages = new Array();

    if (backIDCard.length > 0) {
      backIDCard.map((v) => {
        IDImages.push(v);
      });
    }

    if (frontIDCard.length > 0) {
      frontIDCard.map((v) => {
        IDImages.push(v);
      });
    }

    return (
      <div style={{ padding: '20px 0 40px 0' }}>
        <Form>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                required={true}
                label={<FormattedMessage id="logIn" />}
              >
                <p style={{ color: '#333' }}>
                  {company && info.get('socialCreditCode') ? (
                    info.get('socialCreditCode')
                  ) : (
                    <FormattedMessage id="none" />
                  )}
                </p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                required={true}
                label={<FormattedMessage id="UserinfoURL" />}
              >
                <p style={{ color: '#333' }}>
                  {company && info.get('companyName') ? (
                    info.get('companyName')
                  ) : (
                    <FormattedMessage id="none" />
                  )}
                </p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="clientID" />}
              >
                <p style={{ color: '#333' }}>
                  {company && info.get('address') ? (
                    info.get('address')
                  ) : (
                    <FormattedMessage id="none" />
                  )}
                </p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="issuer" />}
              >
                <p style={{ color: '#333' }}>
                  {company && info.get('legalRepresentative') ? (
                    info.get('legalRepresentative')
                  ) : (
                    <FormattedMessage id="none" />
                  )}
                </p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="pedirectURL" />}
              >
                <p style={{ color: '#333' }}>
                  {company && info.get('registeredCapital') ? (
                    info.get('registeredCapital') + '万元'
                  ) : (
                    <FormattedMessage id="none" />
                  )}
                </p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="registration" />}
              >
                <p style={{ color: '#333' }}>
                  {company && info.get('foundDate') ? (
                    moment(info.get('foundDate')).format('YYYY年MM月DD日')
                  ) : (
                    <FormattedMessage id="none" />
                  )}
                </p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="registerPrefix" />}
              >
                <p style={{ color: '#333' }}>
                  {company && info.get('businessTermStart') ? (
                    moment(info.get('businessTermStart')).format(
                      'YYYY年MM月DD日'
                    )
                  ) : (
                    <FormattedMessage id="none" />
                  )}
                </p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="registerCallback" />}
              >
                <p style={{ color: '#333' }}>
                  {company && info.get('businessTermEnd') ? (
                    moment(info.get('businessTermEnd')).format('YYYY年MM月DD日')
                  ) : (
                    <FormattedMessage id="none" />
                  )}
                </p>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
