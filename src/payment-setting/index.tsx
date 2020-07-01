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
      paymentVisible: false
    };
    this.closeModel = this.closeModel.bind(this);
  }

  closeModel = () => {
    this.setState({
      paymentVisible: false
    });
  };

  render() {
    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container">
          <ContainerDiv>
            <Headline title={<FormattedMessage id="paymentSetting" />} />
            <Card style={{ width: 300 }} bodyStyle={{ padding: 10 }}>
              <div className="methodItem">
                <img
                  src={require('./img/payu.jpg')}
                  style={{ width: '150px', height: '100%', marginTop: '10px' }}
                />
              </div>
              <div className="bar">
                <div className="status"></div>
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
            <PaymentModel visible={this.state.paymentVisible} parent={this} />
          </ContainerDiv>
        </div>
      </div>
    );
  }
}
