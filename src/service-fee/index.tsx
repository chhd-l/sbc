import React from 'react';
import { StoreProvider } from 'plume2';
// import { Row, Col, Form, Modal, message, Button, Card, Tooltip, Switch, Input, Select, Spin } from 'antd';

import {
  Breadcrumb,
  Alert,
  Radio,
  Button,
  Tabs,
  Row,
  Col,
  Card,
  Switch,
  Popconfirm,
  Tooltip,
  message
} from 'antd';
import { Headline, history, AuthWrapper, checkAuth, BreadCrumb, RCi18n } from 'qmkit';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import * as webapi from './webapi';

import GoodsSetting from './component/goods-setting';
import StoreSetting from './component/store-setting';
import AppStore from './store';
import './index.less';

const TitleBox = styled.div`
  background: #fafafa;
  height: 60px;
  padding-left: 10px;
  padding-right: 20px;
  line-height: 60px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .ant-radio-group {
    width: calc(100% - 400px);
    margin-left: 20px;
    .ant-radio-wrapper:last-child {
      margin-left: 40px;
    }
  }
`;

const RadioGroup = Radio.Group;
/**
 * 运费模板
 */
@StoreProvider(AppStore, { debug: __DEV__ })
export default class FreightTemplate extends React.Component<any, any> {
  store: AppStore;

  UNSAFE_componentWillMount() {
    let { tab } = (this.props && this.props.location && this.props.location.state) || {
      tab: 0
    };
    // 初始化
    this.store.init({ tab } as any);
  }

  constructor(props) {
    super(props);
    this.state = {
      switchSerficeFee: false,
      switchSerficeFeeCalculation: false,
      config: []
    };
  }

  componentDidMount() {
    webapi
      .fetchServiceFeeConf()
      .then((res) => {
        const config = res?.res?.context || [];
        this.setState({
          config,
          switchSerficeFee: !!config.find((c) => c.configType === 'order_service_fee_all')?.status,
          switchSerficeFeeCalculation: !!config.find(
            (c) => c.configType === 'order_service_fee_fgs'
          )?.status
        });
      })
      .catch((err) => {
        message.error(err.message);
      });
  }

  _handleServiceFeeChange = async () => {
    const temVal = !this.state.switchSerficeFee;
    this.setState({
      switchSerficeFee: temVal
    });
    if (temVal) {
      this.setState({
        switchSerficeFeeCalculation: temVal
      });
    }
    // 当第一个开启时，第二个必然开启；当关闭第一个时，无其他连带逻辑
    const { config } = this.state;
    let params = [...config];
    params = params.map((p, idx) => {
      if (temVal) {
        p.status = 1;
      } else if (p.configType === 'order_service_fee_all') {
        p.status = 0;
      }
      return p;
    });
    try {
      await webapi.updateServiceFeeConf({ requestList: params });
      message.success(RCi18n({ id: 'Setting.Operatesuccessfully' }));
    } catch (err) {
      message.error(err.message);
    }
  };

  render() {
    const fMode = this.store.state().get('fMode');
    const tab = this.store.state().get('tab');
    const { switchSerficeFee, switchSerficeFeeCalculation } = this.state;
    return [
      <BreadCrumb />,
      <div>
        <div className="service-fee-container">
          <Headline
            title={<FormattedMessage id="Menu.Service fee" />}
            style={{ marginBottom: 0 }}
          />
          <div className="service-fee-item">
            <Row>
              <Col span={8}>
                <Card style={{ width: 300, margin: 20 }} bodyStyle={{ padding: 10 }}>
                  <div className="methodItem">
                    <svg
                      t="1648194326370"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="4487"
                      width="80"
                      height="80"
                      fill="#e2001a"
                    >
                      <path
                        d="M870.4 57.6C780.8 19.2 652.8 0 512 0 371.2 0 243.2 19.2 153.6 57.6 51.2 102.4 0 153.6 0 211.2l0 595.2c0 57.6 51.2 115.2 153.6 153.6C243.2 1004.8 371.2 1024 512 1024c140.8 0 268.8-19.2 358.4-57.6 96-38.4 153.6-96 153.6-153.6L1024 211.2C1024 153.6 972.8 102.4 870.4 57.6L870.4 57.6zM812.8 320C729.6 352 614.4 364.8 512 364.8 403.2 364.8 294.4 352 211.2 320 115.2 294.4 70.4 256 70.4 211.2c0-38.4 51.2-76.8 140.8-108.8C294.4 76.8 403.2 64 512 64c102.4 0 217.6 19.2 300.8 44.8 89.6 32 140.8 70.4 140.8 108.8C953.6 256 908.8 294.4 812.8 320L812.8 320zM819.2 505.6C736 531.2 620.8 550.4 512 550.4c-108.8 0-217.6-19.2-307.2-44.8C115.2 473.6 64 435.2 64 396.8L64 326.4C128 352 172.8 384 243.2 396.8 326.4 416 416 428.8 512 428.8c96 0 185.6-12.8 268.8-32C851.2 384 896 352 960 326.4l0 76.8C960 435.2 908.8 473.6 819.2 505.6L819.2 505.6zM819.2 710.4c-83.2 25.6-198.4 44.8-307.2 44.8-108.8 0-217.6-19.2-307.2-44.8C115.2 684.8 64 646.4 64 601.6L64 505.6c64 32 108.8 57.6 179.2 76.8C326.4 601.6 416 614.4 512 614.4c96 0 185.6-12.8 268.8-32C851.2 563.2 896 537.6 960 505.6l0 96C960 646.4 908.8 684.8 819.2 710.4L819.2 710.4zM512 960c-108.8 0-217.6-19.2-307.2-44.8C115.2 889.6 64 851.2 64 812.8l0-96c64 32 108.8 57.6 179.2 76.8 76.8 19.2 172.8 32 262.4 32 96 0 185.6-12.8 268.8-32 76.8-19.2 121.6-44.8 185.6-76.8l0 96c0 38.4-51.2 76.8-140.8 108.8C736 947.2 614.4 960 512 960L512 960zM512 960"
                        p-id="4488"
                      ></path>
                    </svg>
                  </div>
                  <div className="bar">
                    <div className="status">
                      <FormattedMessage id="Menu.Service fee" />
                    </div>

                    <div className={'flex-start-align'}>
                      <Popconfirm
                        placement="topRight"
                        title={
                          switchSerficeFee ? (
                            <FormattedMessage id="ServiceFee.AreYouSureDisable" />
                          ) : (
                            <FormattedMessage id="ServiceFee.AreYouSureEnable" />
                          )
                        }
                        onConfirm={this._handleServiceFeeChange}
                        okText={<FormattedMessage id="Subscription.Confirm" />}
                        cancelText={<FormattedMessage id="Subscription.Cancel" />}
                      >
                        {/* <Tooltip
                          placement="top"
                          title={<FormattedMessage id="Subscription.CancelAll" />}
                        > */}
                        <Switch
                          style={{ marginRight: 15 }}
                          checked={switchSerficeFee}
                          // onChange={this._handleServiceFeeChange}
                        />
                        {/* <a
                            type="link"
                            style={{ padding: '0 5px' }}
                            className="iconfont iconbtn-cancelall"
                          > */}
                        {/*Cancel all*/}
                        {/* </a> */}
                        {/* </Tooltip> */}
                      </Popconfirm>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
          <Headline
            title={<FormattedMessage id="ServiceFee.Calculation" />}
            style={{ marginBottom: 0 }}
          />
          <div className="service-fee-item">
            <Row>
              <Col span={8}>
                <Card
                  style={{ width: 300, margin: 20, opacity: switchSerficeFee ? 1 : 0.7 }}
                  bodyStyle={{ padding: 10 }}
                >
                  {switchSerficeFeeCalculation ? (
                    <a
                      type="link"
                      onClick={() => {
                        if (switchSerficeFee) history.push('/service-fee-template');
                      }}
                      className="iconfont iconEdit"
                      style={{ cursor: switchSerficeFee ? 'pointer' : 'not-allowed' }}
                    />
                  ) : null}

                  <div className="methodItem">
                    <h1
                      style={{
                        fontSize: '30px',
                        fontWeight: 'bold',
                        color: 'var(--primary-color)'
                      }}
                    >
                      FGS
                    </h1>
                    <p>
                      <FormattedMessage id="ServiceFee.SetUpYourOwnRule" />
                    </p>
                  </div>
                  <div className="bar flex-end-align">
                    <div className={''}>
                      <Switch
                        style={{ marginRight: 15 }}
                        checked={switchSerficeFeeCalculation}
                        onChange={(checked) => {
                          this.setState({
                            switchSerficeFeeCalculation: checked
                          });
                        }}
                        disabled={true || !switchSerficeFee}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    ];
  }

  /**
   * 保存店铺的运费模板类别
   */
  _save = () => {
    this.store.saveStoreFreight();
  };
}
