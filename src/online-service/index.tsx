import React from 'react';
import { Breadcrumb, Card, Form } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';
import styled from 'styled-components';
import QQModal from './components/qq-modal';
import { StoreProvider } from 'plume2';
import AppStore from './store';

const QQForm = Form.create()(QQModal as any); //品牌弹框
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
export default class OnlineService extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.store.init();
  }

  render() {
    const enableFlag = this.store.state().get('enableFlag');
    return (
      <div>
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>设置</Breadcrumb.Item>
          <Breadcrumb.Item>客服设置</Breadcrumb.Item>
          <Breadcrumb.Item>在线客服</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <ContainerDiv>
            <Headline title="Online Service" />
            <Card style={{ width: 300 }} bodyStyle={{ padding: 10 }}>
              <div className="methodItem">
                <img src={require('./img/qq.png')} />
                <h4>QQ Customer Service</h4>
              </div>
              <div className="bar">
                <div className="status">
                  {enableFlag ? 'Activated' : 'Not Activated'}
                </div>
                <div>
                  <a
                    onClick={() => this.store.onEditServer()}
                    className="links"
                  >
                    Edit
                  </a>
                </div>
              </div>
            </Card>
            <QQForm />
          </ContainerDiv>
        </div>
      </div>
    );
  }
}
