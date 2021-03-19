import React, { Component } from 'react';
import { Relax } from 'plume2';
import {} from 'immutable';
import { Form, Input, Select, Button, Row, Col } from 'antd';
import { Headline, noop } from 'qmkit';
import { FormattedMessage } from 'react-intl';
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

/**
 * 订单查询头
 */
@Relax
export default class SearchHead extends Component<any, any> {
  props: {
    relaxProps?: {
      onSearch: Function;
      total: number;
    };
  };

  static relaxProps = {
    onSearch: noop,
    total: 'total'
  };

  constructor(props) {
    super(props);

    this.state = {
      goodsOptions: 'skuName',
      buyerSelect: 'buyerName',
      receiverSelect: 'consigneeName',

      id: '',
      goodsOptionsValue: '',
      buyerSelectValue: '',
      receiverSelectValue: ''
    };
  }
  handleSearch = (e) => {
    const { onSearch } = this.props.relaxProps;
    e.preventDefault();
    let { goodsOptions, buyerSelect, receiverSelect, id, goodsOptionsValue, buyerSelectValue, receiverSelectValue } = this.state;

    let params = {
      id,
      [goodsOptions]: goodsOptionsValue,
      [buyerSelect]: buyerSelectValue,
      [receiverSelect]: receiverSelectValue
    };

    onSearch(params);
  };

  render() {
    const { total } = this.props.relaxProps;

    return (
      <div>
        <Headline title={<FormattedMessage id="initiateApplication" />} number={total && total.toString()} />

        <div>
          <Form className="filter-content" layout="inline">
            <Row>
              <Col span={8}>
                <FormItem>
                  <InputGroup compact style={styles.formItemStyle}>
                    <Input style={styles.leftLabel} disabled defaultValue={'Order id'} />
                    <Input
                      style={styles.wrapper}
                      onChange={(e) => {
                        this.setState({
                          id: (e.target as any).value
                        });
                      }}
                    />
                  </InputGroup>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <InputGroup compact style={styles.formItemStyle}>
                    {this._renderGoodsOptionSelect()}
                    <Input
                      style={styles.wrapper}
                      onChange={(e) => {
                        this.setState({
                          goodsOptionsValue: (e.target as any).value
                        });
                      }}
                    />
                  </InputGroup>
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem>
                  <InputGroup compact style={styles.formItemStyle}>
                    {this._renderBuyerOptionSelect()}
                    <Input
                      style={styles.wrapper}
                      onChange={(e) => {
                        this.setState({
                          buyerOptionsValue: (e.target as any).value
                        });
                      }}
                    />
                  </InputGroup>
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem>
                  <InputGroup compact style={styles.formItemStyle}>
                    {this._renderReceiverSelect()}
                    <Input
                      style={styles.wrapper}
                      onChange={(e) => {
                        this.setState({
                          receiverSelectValue: (e.target as any).value
                        });
                      }}
                    />
                  </InputGroup>
                </FormItem>
              </Col>
              <Col span="24" style={{ textAlign: 'center' }}>
                <FormItem>
                  <Button
                    htmlType="submit"
                    type="primary"
                    shape="round"
                    icon="search"
                    onClick={(e) => {
                      this.handleSearch(e);
                    }}
                  >
                    {
                      <span>
                        <FormattedMessage id="search" />
                      </span>
                    }
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }

  // order/subscription id

  _renderNumberSelect = () => {
    return (
      <Select
        onChange={(val, a) => {
          this.setState({
            numberSelect: val
          });
        }}
        getPopupContainer={(trigger: any) => trigger.parentNode}
        value={this.state.numberSelect}
        style={styles.label}
      >
        <Option title="Order id" value="orderNumber">
          <FormattedMessage id="order.orderNumber" />
        </Option>
        <Option title="Subscriptio id" value="subscriptionNumber">
          <FormattedMessage id="order.subscriptionNumber" />
        </Option>
      </Select>
    );
  };

  //product 相关

  _renderGoodsOptionSelect = () => {
    return (
      <Select
        onChange={(val) => {
          this.setState({
            goodsOptions: val
          });
        }}
        getPopupContainer={(trigger: any) => trigger.parentNode}
        value={this.state.goodsOptions}
        style={styles.label}
      >
        <Option title="Product name" value="skuName">
          <FormattedMessage id="productName" />
        </Option>
        <Option title="Sku code" value="skuNo">
          <FormattedMessage id="skuCode" />
        </Option>
      </Select>
    );
  };

  // consumer 相关
  _renderBuyerOptionSelect = () => {
    return (
      <Select
        onChange={(value, a) => {
          this.setState({
            buyerSelect: value
          });
        }}
        getPopupContainer={(trigger: any) => trigger.parentNode}
        value={this.state.buyerSelect}
        style={styles.label}
      >
        <Option title="Consumer name" value="buyerName">
          <FormattedMessage id="consumerName" />
        </Option>
        <Option title="Consumer account" value="buyerAccount">
          <FormattedMessage id="consumerAccount" />
        </Option>
      </Select>
    );
  };

  // 收件人相关
  _renderReceiverSelect = () => {
    return (
      <Select
        onChange={(val) =>
          this.setState({
            receiverSelect: val
          })
        }
        getPopupContainer={(trigger: any) => trigger.parentNode}
        value={this.state.receiverSelect}
        style={styles.label}
      >
        <Option title="Recipient" value="consigneeName">
          <FormattedMessage id="recipient" />
        </Option>
        <Option title="Recipient phone" value="consigneePhone">
          <FormattedMessage id="recipientPhone" />
        </Option>
      </Select>
    );
  };
}

const styles = {
  formItemStyle: {
    width: 335
  },
  label: {
    width: 135,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.65)',
    backgroundColor: '#fff',
    cursor: 'text'
  },
  leftLabel: {
    width: 135,
    textAlign: 'left',
    color: 'rgba(0, 0, 0, 0.65)',
    backgroundColor: '#fff',
    cursor: 'text'
  },
  wrapper: {
    width: 200
  }
} as any;
