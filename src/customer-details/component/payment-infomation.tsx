import React from 'react';
import { Form, Input, InputNumber, Button, Select, message, Table, Row, Col, Radio, Menu, Card, Checkbox, Empty, Spin, DatePicker, Popconfirm, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './../webapi';
import { Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';
import { addressList } from '@/order-add-old/webapi';
import axios from 'axios';
import moment from 'moment';
import { cache, Const } from 'qmkit';

const { TextArea } = Input;
const { MonthPicker } = DatePicker;

const { SubMenu } = Menu;
const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

const { Column } = Table;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

class PaymentInformation extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      customerAccount: '',
      title: '',
      isDefault: false,
      loading: false,
      cardList: []
    };
  }
  componentDidMount() {
    this.getList();
  }
  getList() {
    this.setState({
      loading: true
    });
    webapi
      .getPaymentMethods({ customerId: this.props.customerId, storeId: JSON.parse(sessionStorage.getItem(cache.SYSTEM_BASE_CONFIG)).storeId || '' })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let dataList = res.context;
          let sortData = dataList.sort((a, b) => b.isDefault - a.isDefault);
          this.setState({
            cardList: sortData,
            loading: false
          });
        } else {
          this.setState({
            loading: false
          });
          message.error(res.message || 'Operation failure');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.toString() || 'Operation failure');
      });
  }

  delCard = (id) => {
    webapi
      .deleteCard({ id })
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          message.success('Operate successfully');
          this.getList();
        } else {
          message.error(res.message || 'Delete failed');
        }
      })
      .catch((err) => {
        message.error('Delete failed');
      });
  };
  clickDefault = () => {
    let isDefault = !this.state.isDefault;
    this.setState({
      isDefault: isDefault
    });
  };

  render() {
    const { cardList, loading } = this.state;
    return (
      <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
        <Row style={{ minHeight: 200 }}>
          {cardList &&
            cardList.map((item, index) => (
              <Col span={6} offset={1} key={index}>
                <Card>
                  <Row>
                    <Col span={16} offset={1}>
                      {item.paymentType === 'PAYU' ? (
                        <>
                          <p>{item.payuPaymentMethod.holder_name}</p>
                          <p>{item.payuPaymentMethod.last_4_digits ? '**** **** **** ' + item.payuPaymentMethod.last_4_digits : ''}</p>
                          <p>{item.payuPaymentMethod.card_type}</p>{' '}
                        </>
                      ) : (
                        <>
                          <p>{item.adyenPaymentMethod.holder_name}</p>
                          <p>{item.adyenPaymentMethod.lastFour ? '**** **** **** ' + item.payuPaymentMethod.lastFour : ''}</p>
                          <p>{item.adyenPaymentMethod.card_type}</p>
                        </>
                      )}
                    </Col>
                    <Col span={5}>
                      <Popconfirm placement="topLeft" title="Are you sure to delete this card?" onConfirm={() => this.delCard(item.id)} okText="Confirm" cancelText="Cancel">
                        <Tooltip placement="top" title="Delete">
                          <a className="iconfont iconDelete" style={{ float: 'right' }}></a>
                        </Tooltip>
                      </Popconfirm>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          <div className="bar-button">
            <Button>
              <Link to="/customer-list">Cancel</Link>
            </Button>
          </div>

          {/* <Col span={20}>
            {this.state.cardList.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : null}
            
            
            <Card
              style={{
                display: this.state.cardList.length === 0 ? 'none' : 'block'
              }}
            >
              <Form {...formItemLayout}>
                <Row gutter={16}>
                  <Col span={12}>
                    <FormItem label="Card number">
                      {getFieldDecorator('cardNumber', {
                      })(
                        <Input
                          disabled
                        />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={12}>
                    <FormItem label="Card owner">
                      {getFieldDecorator('cardOwner', {
                      })(
                        <Input disabled/>
                      )}
                    </FormItem>
                  </Col>

                  <Col span={24}>
                    <FormItem>
                      <Popconfirm placement="topRight" title="Are you sure to delete this item?" onConfirm={() => this.delCard()} okText="Confirm" cancelText="Cancel">
                        <Button
                          style={{
                            marginRight: '20px',
                            display: this.props.customerType === 'Guest' ? 'none' : null
                          }}
                        >
                          <FormattedMessage id="delete" />
                        </Button>
                      </Popconfirm>

                      <Button>
                        <Link to="/customer-list">Cancel</Link>
                      </Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
         */}
        </Row>
      </Spin>
    );
  }
}
export default Form.create()(PaymentInformation);
