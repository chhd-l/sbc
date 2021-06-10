import React, { Component } from 'react';
import { Headline, BreadCrumb, Const } from 'qmkit';
import {
  Row,
  Col,
  Form,
  Modal,
  message,
  Card,
  Tooltip,
  Switch,
  Input,
  Spin,
  Popconfirm
} from 'antd';
import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
};

class ShippingFeeSetting extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      shippingFeeVisible: false,
      shippingFeeList: [],
      selectShippingFee: {},
      shippingFeeLoading: false,
      deliveryLoading: false,
      deliveryOptions: [],
      deliveryChecked: false
    };
    this.closeModel = this.closeModel.bind(this);
    this.enableShippingFee = this.enableShippingFee.bind(this);
    this.getShippingFeeSetting = this.getShippingFeeSetting.bind(this);
    this.saveShippingFee = this.saveShippingFee.bind(this);
  }
  componentDidMount() {
    this.getShippingFeeSetting();
    this.getDeliveryOption();
  }
  getShippingFeeSetting() {
    this.setState({
      shippingfeeloading: true
    });
    webapi
      .GetShipSettingList()
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          let list = res.context.page ? res.context.page.content : [];
          let shippingFeeList = [];
          list.map((item) => {
            if (item.type === 'fgs') {
              shippingFeeList.push(item);
            }
            return item;
          });
          list.map((item) => {
            if (item.type !== 'fgs') {
              shippingFeeList.push(item);
            }
            return item;
          });
          this.setState({
            shippingFeeList: shippingFeeList,
            shippingfeeloading: false
          });
        } else {
          message.error(res.message || <FormattedMessage id="Public.GetDataFailed" />);
          this.setState({
            shippingfeeloading: false
          });
        }
      })
      .catch(() => {
        message.error('Get data failed');
        this.setState({
          shippingfeeloading: false
        });
      });
  }

  getDeliveryOption() {
    this.setState({
      deliveryLoading: true
    });
    webapi
      .getDeliveryOptions()
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            deliveryOptions: res.context.configVOList,
            deliveryLoading: false
          });
        } else {
          message.error(res.message || <FormattedMessage id="Public.GetDataFailed" />);
          this.setState({
            deliveryLoading: false
          });
        }
      })
      .catch(() => {
        message.error(<FormattedMessage id="Public.GetDataFailed" />);
        this.setState({
          deliveryLoading: false
        });
      });
  }

  closeModel = () => {
    this.setState({
      shippingFeeVisible: false
    });
  };
  enableShippingFee(id) {
    webapi
      .enableShippingFee(id)
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          message.success('Operate successfully');
          this.getShippingFeeSetting();
        } else {
          message.error(res.message || 'Update Failed');
        }
      })
      .catch((err) => {
        message.error(err || 'Update Failed');
      });
  }
  enableDelivery(id) {
    webapi
      .editDeliveryOption(id, this.state.deliveryChecked ? 1 : 0)
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          message.success('Operate successfully');
          this.getDeliveryOption();
        } else {
          message.error(res.message || 'Update Failed');
        }
      })
      .catch((err) => {
        message.error(err || 'Update Failed');
      });
  }
  saveShippingFee() {
    const { selectShippingFee } = this.state;
    this.props.form.validateFields((errs, values) => {
      selectShippingFee.url = values.url;
      selectShippingFee.header = JSON.stringify({ Domain: values.domain });
      if (!errs) {
        webapi
          .updateShipSetting(selectShippingFee)
          .then((data) => {
            const { res } = data;
            if (res.code === 'K-000000') {
              message.success('Operate successfully');
              this.closeModel();
              this.getShippingFeeSetting();
            } else {
              message.error(res.message || 'Update Failed');
            }
          })
          .catch((err) => {
            message.error(err || 'Update Failed');
          });
      }
    });
  }
  render() {
    const {
      shippingFeeList,
      shippingFeeVisible,
      shippingfeeloading,
      deliveryLoading,
      deliveryOptions,
      deliveryChecked
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    let header = this.state.selectShippingFee.header
      ? JSON.parse(this.state.selectShippingFee.header)
      : {};
    let domain = header.Domain;
    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search" style={{ minHeight: '100vh', background: '#fff' }}>
          {deliveryOptions && deliveryOptions.length > 0 ? (
            <Row>
              <Headline title="Delivery option selection" />
              <Spin
                style={{ position: 'fixed', top: '30%', left: '100px' }}
                spinning={deliveryLoading}
                indicator={
                  <img
                    className="spinner"
                    src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif"
                    style={{ width: '90px', height: '90px' }}
                    alt=""
                  />
                }
              >
                <Row style={{ marginBottom: 20 }}>
                  {deliveryOptions.map((item) => (
                    <Col span={8}>
                      <Card style={{ width: 300 }} bodyStyle={{ padding: 10 }}>
                        <div style={{ textAlign: 'center', margin: '9px 0' }}>
                          <img src={item.context ? JSON.parse(item.context).img : ''} alt="home" />
                        </div>
                        <strong style={{ float: 'left', fontSize: 12 }}>{item.configName}</strong>
                        <div className="bar" style={{ float: 'right' }}>
                          <div className="status">
                            <Popconfirm
                              placement="topLeft"
                              title={`Are you sure to ${
                                item.status === 1 ? 'disbale' : 'enable'
                              } this?`}
                              onConfirm={() => this.enableDelivery(item.id)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Switch
                                size="small"
                                checked={item.status === 1 ? true : false}
                                onChange={(checked) => {
                                  this.setState({
                                    deliveryChecked: checked
                                  });
                                }}
                              />
                            </Popconfirm>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Spin>
            </Row>
          ) : null}

          {shippingFeeList && shippingFeeList.length > 0 ? (
            <Row>
              <Headline title="Shipping fee calculation" />
              <Spin
                style={{ position: 'fixed', top: '30%', left: '100px' }}
                spinning={shippingfeeloading}
                indicator={
                  <img
                    className="spinner"
                    src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif"
                    style={{ width: '90px', height: '90px' }}
                    alt=""
                  />
                }
              >
                <Row style={{ marginBottom: 20 }}>
                  {shippingFeeList.map((item, index) => (
                    <Col span={8} key={index}>
                      {item.type === 'fgs' ? (
                        <Card style={{ width: 300 }} bodyStyle={{ padding: 10 }}>
                          <div style={{ textAlign: 'center', margin: '9px 0' }}>
                            <h1
                              style={{
                                fontSize: 30,
                                fontWeight: 'bold',
                                color: '#e2001a'
                              }}
                            >
                              FGS
                            </h1>
                            <p>Set up your own rule</p>
                          </div>
                          <div className="bar" style={{ float: 'right' }}>
                            <div className="status">
                              <Popconfirm
                                placement="topLeft"
                                disabled={item.closeFlag === 0}
                                title={`Are you sure to enable this?`}
                                onConfirm={() => this.enableShippingFee(item.id)}
                                okText="Yes"
                                cancelText="No"
                              >
                                <Switch
                                  size="small"
                                  disabled={item.closeFlag === 0}
                                  checked={item.closeFlag === 0 ? true : false}
                                />
                              </Popconfirm>
                            </div>
                          </div>
                        </Card>
                      ) : null}

                      {item.type === 'tempoline' ? (
                        <Card style={{ width: 300 }} bodyStyle={{ padding: 10 }}>
                          <div style={{ textAlign: 'center', margin: '20px 0' }}>
                            <img src={item.imgUrl} style={{ width: '200px', height: '43px' }} />
                          </div>
                          <div className="bar" style={{ float: 'right' }}>
                            <div className="status">
                              <Popconfirm
                                placement="topLeft"
                                disabled={item.closeFlag === 0}
                                title={`Are you sure to enable this?`}
                                onConfirm={() => this.enableShippingFee(item.id)}
                                okText="Yes"
                                cancelText="No"
                              >
                                <Switch
                                  size="small"
                                  disabled={item.closeFlag === 0}
                                  checked={item.closeFlag === 0 ? true : false}
                                />
                              </Popconfirm>
                            </div>
                            <div>
                              {item.closeFlag === 0 ? (
                                <Tooltip placement="top" title="Edit">
                                  <a
                                    style={{
                                      color: 'red',
                                      position: 'absolute',
                                      top: 10,
                                      right: 10
                                    }}
                                    type="link"
                                    onClick={() => {
                                      this.setState({
                                        shippingFeeVisible: true,
                                        selectShippingFee: item
                                      });
                                    }}
                                    className="iconfont iconEdit"
                                  ></a>
                                </Tooltip>
                              ) : null}
                            </div>
                          </div>
                        </Card>
                      ) : null}
                    </Col>
                  ))}
                </Row>
              </Spin>
            </Row>
          ) : null}
          <Modal
            visible={shippingFeeVisible}
            title="Shipping API Setting"
            onOk={this.saveShippingFee}
            maskClosable={false}
            onCancel={() => this.closeModel()}
            okText="Submit"
          >
            <Form>
              <FormItem {...formItemLayout} required={true} label="URL">
                {getFieldDecorator('url', {
                  initialValue: this.state.selectShippingFee.url,
                  rules: [{ required: true, message: 'Please input URL' }]
                })(<Input />)}
              </FormItem>
              <FormItem {...formItemLayout} required={true} label="Domain">
                {getFieldDecorator('domain', {
                  initialValue: domain,
                  rules: [{ required: true, message: 'Please input domain' }]
                })(<Input />)}
              </FormItem>
            </Form>
          </Modal>
        </div>
      </div>
    );
  }
}
export default Form.create()(ShippingFeeSetting);
