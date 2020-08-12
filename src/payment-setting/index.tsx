import React, { Component } from 'react';
import { Headline, SelectGroup, BreadCrumb, AuthWrapper, history } from 'qmkit';
import { Row, Col, Form, Modal, message, Button, Card } from 'antd';
import { FormattedMessage } from 'react-intl';
const FormItem = Form.Item;
import * as webapi from './webapi';
import styled from 'styled-components';
import PaymentModel from './components/payment-modal';

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
      paymentForm: {}, //edit
      paymentList: []
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
        paymentList: res.context.payGatewayVOList
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
  reflash() {
    this.getPaymentSetting();
  }
  render() {
    const { paymentList } = this.state;
    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div
          className="container-search"
          style={{ height: '100vh', width: '100vh', background: '#fff' }}
        >
          <ContainerDiv>
            <Headline title={<FormattedMessage id="paymentSetting" />} />
            <Row>
              {paymentList &&
                paymentList.map((item, index) => (
                  <Col span={8} key={index}>
                    <Card style={{ width: 300 }} bodyStyle={{ padding: 10 }}>
                      <div className="methodItem">
                        <img
                          src={item.imgUrl}
                          style={{
                            width: '150px',
                            height: '80px',
                            marginTop: '10px'
                          }}
                        />
                      </div>
                      <div className="bar">
                        <div className="status">
                          {item.isOpen === 1 ? 'Enabled' : 'Disabled'}
                        </div>
                        <div>
                          <Button
                            type="link"
                            onClick={() => {
                              this.setState({
                                paymentVisible: true,
                                paymentForm: item
                              });
                            }}
                            className="links"
                          >
                            <FormattedMessage id="edit" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
            </Row>

            <PaymentModel
              paymentForm={this.state.paymentForm}
              visible={this.state.paymentVisible}
              parent={this}
              reflash={() => this.reflash()}
            />
          </ContainerDiv>
        </div>
      </div>
    );
  }
}
