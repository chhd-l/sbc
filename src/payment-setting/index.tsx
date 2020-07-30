import React, { Component } from 'react';
import { Headline, SelectGroup, BreadCrumb, AuthWrapper, history } from 'qmkit';
import { Row, Col, Form, Modal, message, Button, Card } from 'antd';
import { FormattedMessage } from 'react-intl';
const FormItem = Form.Item;
import * as webapi from './webapi';
import styled from 'styled-components';
import PaymentModel from './components/payment-modal';
const formItemLayout = {
  labelCol: {
    span: 4,
    xs: { span: 24 },
    sm: { span: 12 }
  },
  wrapperCol: {
    span: 20,
    xs: { span: 24 },
    sm: { span: 12 }
  }
};

const ContainerDiv = styled.div`
  .methodItem {
    width: 100%;
    border: 1px solid #f5f5f5;
    text-align: center;
    padding: 20px 0;
    img {
      width: 86px;
      height: 86px;
    }
    h4 {
      font-size: 14px;
      color: #333;
      margin-top: 5px;
    }
  }
  .bar {
    flex-direction: row;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 8px 0;
    .status {
      font-size: 12px;
      color: #666;
    }
    .links {
      font-size: 12px;
      margin-left: 15px;
    }
  }
`;

export default class PaymentSetting extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      paymentVisible: false,
      enabled: true,
      paymentForm: {}
    };
    this.closeModel = this.closeModel.bind(this);
  }
  componentDidMount() {
    this.getPaymentSetting();
  }
  getPaymentSetting = async () => {
    const { res } = await webapi.getPaymentSetting();
    if (res.code === 'K-000000') {
      this.setState({
        paymentForm: res.context
      });
    } else {
      message.error(res.message);
    }
  };

  closeModel = () => {
    this.setState({
      paymentVisible: false
    });
  };
  setEnable(enabled) {
    this.setState({
      enabled: enabled
    });
  }
  render() {
    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container">
          <ContainerDiv>
            <Headline title={<FormattedMessage id="paymentSetting" />} />
            {this.state.paymentForm ? (
              <Card style={{ width: 300 }} bodyStyle={{ padding: 10 }}>
                <div className="methodItem">
                  {this.state.paymentForm.storeId === 123457908 ? (
                    <img
                      src={require('./img/adycn.png')}
                      style={{
                        width: '150px',
                        height: '100%',
                        marginTop: '10px'
                      }}
                    />
                  ) : (
                    <img
                      src={this.state.paymentImage}
                      src={require('./img/payu.jpg')}
                      style={{
                        width: '150px',
                        height: '100%',
                        marginTop: '10px'
                      }}
                    />
                  )}
                </div>
                <div className="bar">
                  <div className="status">
                    {this.state.enabled ? 'Enabled' : 'Disabled'}
                  </div>
                  <div>
                    <a
                      onClick={() => {
                        this.setState({
                          paymentVisible: true
                        });
                      }}
                      className="links"
                    >
                      <FormattedMessage id="edit" />
                    </a>
                  </div>
                </div>
              </Card>
            ) : null}
            <PaymentModel
              paymentForm={this.state.paymentForm}
              visible={this.state.paymentVisible}
              parent={this}
              setEnabled={(enabled) => this.setEnable(enabled)}
            />
          </ContainerDiv>
        </div>
      </div>
    );
  }
}
