import React, { Component } from 'react';
import { Headline, BreadCrumb, Const } from 'qmkit';
import { Row, Col, Form, Modal, message, Card, Tooltip, Switch, Input, Spin, Popconfirm } from 'antd';
import * as webapi from './webapi';

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
      ShippingFeeVisible: false,
      ShippingFeeList: [],
      selectShippingFee: {},
      loading: false
    };
    this.closeModel = this.closeModel.bind(this);
    this.enableShippingFee = this.enableShippingFee.bind(this);
    this.getShippingFeeSetting = this.getShippingFeeSetting.bind(this);
    this.saveShippingFee = this.saveShippingFee.bind(this);
  }
  componentDidMount() {
    this.getShippingFeeSetting();
  }
  getShippingFeeSetting() {
    this.setState({
      loading: true
    });
    webapi
      .GetShipSettingList()
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            ShippingFeeList: res.context.page ? res.context.page.content : [],
            loading: false
          });
        } else {
          message.error(res.message || 'Get data failed');
          this.setState({
            loading: false
          });
        }
      })
      .catch(() => {
        message.error('Get data failed');
        this.setState({
          loading: false
        });
      });
  }

  closeModel = () => {
    this.setState({
      ShippingFeeVisible: false
    });
  };
  enableShippingFee(item) {
    item.closeFlag = item.closeFlag === 0 ? 1 : 0;
    webapi
      .updateShipSetting(item)
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
    const { ShippingFeeList, ShippingFeeVisible, loading } = this.state;
    const { getFieldDecorator } = this.props.form;
    let header = this.state.selectShippingFee.header ? JSON.parse(this.state.selectShippingFee.header) : {};
    let domain = header.Domain;
    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search" style={{ height: '100vh', background: '#fff' }}>
          <Headline title="Shipping fee calculation" />
          <Spin style={{ position: 'fixed', top: '30%', left: '100px' }} spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
            <Row style={{ marginBottom: 10 }}>
              {ShippingFeeList &&
                ShippingFeeList.map((item, index) => (
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
                              disabled={item.closeFlag === 1 && ShippingFeeList.filter((x) => x.closeFlag === 0).length > 0}
                              title={`Are you sure to ${item.closeFlag === 0 ? 'disable' : 'enable'} this?`}
                              onConfirm={() => this.enableShippingFee(item)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Switch size="small" disabled={item.closeFlag === 1 && ShippingFeeList.filter((x) => x.closeFlag === 0).length > 0} checked={item.closeFlag === 0 ? true : false} />
                            </Popconfirm>
                          </div>
                          <div>
                            <Tooltip placement="top" title="Edit">
                              <a
                                style={{ color: 'red', position: 'absolute', top: 10, right: 10 }}
                                type="link"
                                onClick={() => {
                                  this.setState({
                                    ShippingFeeVisible: true,
                                    selectShippingFee: item
                                  });
                                }}
                                className="iconfont iconEdit"
                              ></a>
                            </Tooltip>
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
                              disabled={item.closeFlag === 1 && ShippingFeeList.filter((x) => x.closeFlag === 0).length > 0}
                              title={`Are you sure to ${item.closeFlag === 0 ? 'disable' : 'enable'} this?`}
                              onConfirm={() => this.enableShippingFee(item)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Switch size="small" disabled={item.closeFlag === 1 && ShippingFeeList.filter((x) => x.closeFlag === 0).length > 0} checked={item.closeFlag === 0 ? true : false} />
                            </Popconfirm>
                          </div>
                          <div>
                            <Tooltip placement="top" title="Edit">
                              <a
                                style={{ color: 'red', position: 'absolute', top: 10, right: 10 }}
                                type="link"
                                onClick={() => {
                                  this.setState({
                                    ShippingFeeVisible: true,
                                    selectShippingFee: item
                                  });
                                }}
                                className="iconfont iconEdit"
                              ></a>
                            </Tooltip>
                          </div>
                        </div>
                      </Card>
                    ) : null}
                  </Col>
                ))}
            </Row>
          </Spin>
          <Modal visible={ShippingFeeVisible} title="Shipping API Setting" onOk={this.saveShippingFee} maskClosable={false} onCancel={() => this.closeModel()} okText="Submit">
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
