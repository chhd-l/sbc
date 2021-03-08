import React, { Component } from 'react';
import { Relax } from 'plume2';
import {} from 'immutable';
import { Form, Input, Select, Button, Row, Col } from 'antd';
import { Headline, noop } from 'qmkit';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;

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

  render() {
    const { onSearch, total } = this.props.relaxProps;

    return (
      <div>
        <Headline title={<FormattedMessage id="OrderReturnApplyList.initiateApplication" />} number={total} />

        <div>
          <Form className="filter-content" layout="inline">
            <Row id="input-lable-wwidth">
              <Col span="8">
                <FormItem>
                  <Input
                    addonBefore={<FormattedMessage id="Order.OrderNumber" />}
                    onChange={(e) => {
                      this.setState({
                        id: (e.target as any).value
                      });
                    }}
                  />
                </FormItem>
              </Col>
              {/*商品名称、SKU编码*/}
              <Col span="8">
                <FormItem>
                  <Input
                    addonBefore={this._renderGoodsOptionSelect()}
                    onChange={(e) => {
                      this.setState({
                        goodsOptionsValue: (e.target as any).value
                      });
                    }}
                  />
                </FormItem>
              </Col>
              {/*客户名称、客户账号*/}
              <Col span="8">
                <FormItem>
                  <Input
                    addonBefore={this._renderBuyerSelect()}
                    onChange={(e) => {
                      this.setState({
                        buyerSelectValue: (e.target as any).value
                      });
                    }}
                  />
                </FormItem>
              </Col>
              {/*收件人、收件人手机*/}
              <Col span="8">
                <FormItem>
                  <Input
                    addonBefore={this._renderReceiverSelect()}
                    onChange={(e) => {
                      this.setState({
                        receiverSelectValue: (e.target as any).value
                      });
                    }}
                  />
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
                      e.preventDefault();
                      let { goodsOptions, buyerSelect, receiverSelect, id, goodsOptionsValue, buyerSelectValue, receiverSelectValue } = this.state;

                      let params = {
                        id,
                        [goodsOptions]: goodsOptionsValue,
                        [buyerSelect]: buyerSelectValue,
                        [receiverSelect]: receiverSelectValue
                      };

                      onSearch(params);
                    }}
                  >
                    {
                      <span>
                        <FormattedMessage id="OrderReturnApplyList.search" />
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

  /**
   * 买家相关查询条件
   * @returns {any}
   * @private
   */
  _renderBuyerSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) =>
          this.setState({
            buyerSelect: val
          })
        }
        value={this.state.buyerSelect}
        style={{ width: 100 }}
      >
        <Option value="buyerName">{<FormattedMessage id="OrderReturnApplyList.consumerName" />}</Option>
        <Option value="buyerAccount">{<FormattedMessage id="OrderReturnApplyList.consumerAccount" />}</Option>
      </Select>
    );
  };

  /**
   * 收件人相关查询条件
   * @returns {any}
   * @private
   */
  _renderReceiverSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) =>
          this.setState({
            receiverSelect: val
          })
        }
        value={this.state.receiverSelect}
        style={{ width: 100 }}
      >
        <Option value="consigneeName">{<FormattedMessage id="OrderReturnApplyList.recipient" />}</Option>
        <Option value="consigneePhone">{<FormattedMessage id="OrderReturnApplyList.recipientPhone" />}</Option>
      </Select>
    );
  };

  /**
   * 商品相关查询条件
   * @returns {any}
   * @private
   */
  _renderGoodsOptionSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => {
          this.setState({
            goodsOptions: val
          });
        }}
        value={this.state.goodsOptions}
        style={{ width: 100 }}
      >
        <Option value="skuName">{<FormattedMessage id="OrderReturnApplyList.productName" />}</Option>
        <Option value="skuNo">{<FormattedMessage id="OrderReturnApplyList.skuCode" />}</Option>
      </Select>
    );
  };
}
