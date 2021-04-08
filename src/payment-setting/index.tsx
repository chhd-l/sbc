import React, { Component } from 'react';
import { Headline, SelectGroup, BreadCrumb, AuthWrapper, history, Const } from 'qmkit';
import { Row, Col, Form, Modal, message, Button, Card, Tooltip, Spin } from 'antd';
import { FormattedMessage } from 'react-intl';
const FormItem = Form.Item;
import * as webapi from './webapi';
import styled from 'styled-components';
import PaymentModel from './components/payment-modal';
import AppStore from './store';
import { StoreProvider } from 'plume2';
import { fromJS } from 'immutable';
import './index.less'
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
@StoreProvider(AppStore, { debug: __DEV__ })
export default class PaymentSetting extends React.Component<any, any> {
  store: AppStore;
  constructor(props: any) {
    super(props);
    this.state = {
      paymentVisible: false,
      enabled: true,
      paymentForm: {}, //edit
      paymentList: []
    };
  }
  componentDidMount() {
    this.store.init();
  }

  render() {
    const paymentList  = this.store.state().get('paymentList') ? this.store.state().get('paymentList').toJS() : [];
    console.log(paymentList, 'paymentList-----------');
    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search" style={{ background: '#fff' }}>
          <ContainerDiv className="setting-container">
            <Headline title={<FormattedMessage id="paymentSetting" />} />
            {!this.store.state().get('loading') ?
              <Row>
                {paymentList &&
                paymentList.map((item, index) => (
                  <Col span={8} key={index}>
                    <Card style={{ width: 300, margin: 20 }} bodyStyle={{ padding: 10 }}>
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
                        <div className="status">{item.isOpen === 1 ? 'Enabled' : 'Disabled'}</div>
                        <div>
                          <Tooltip placement="top" title="Edit">
                            <a
                              style={{ color: 'red' }}
                              type="link"
                              onClick={() => {
                                this.store.setCurrentPaymentForm(fromJS(item))
                                this.store.handelModelOpenOClose(true)
                              }}
                              /* className="links"*/
                              className="iconfont iconEdit"
                            >
                              {/* <FormattedMessage id="edit" />*/}
                            </a>
                          </Tooltip>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row> :
              <Spin className="loading-spin" indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" alt="" />} />
            }
            <PaymentModel />
          </ContainerDiv>
        </div>
      </div>
    );
  }
}
