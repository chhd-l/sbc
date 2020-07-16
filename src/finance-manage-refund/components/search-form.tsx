import React from 'react';
import { Relax } from 'plume2';
import { Form, Select, Button, Input } from 'antd';

import { SelectGroup, noop, AuthWrapper } from 'qmkit';

const FormItem = Form.Item;
const Option = Select.Option;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      //改变支付方式
      changePayWay: Function;
      changeTradeNo: Function;
      payWaysObj: any;
      incomeDetail: any;
      kind: string;
      //导出收入明细
      exportIncomeDetail: Function;
      exportRefundDetail: Function;
      refundDetail: any;
    };
    name?: string;
  };

  static relaxProps = {
    changePayWay: noop,
    changeTradeNo: noop,
    payWaysObj: 'payWaysObj',
    incomeDetail: 'incomeDetail',
    kind: 'kind',
    exportIncomeDetail: noop,
    exportRefundDetail: noop,
    refundDetail: 'refundDetail'
  };

  render() {
    const {
      changePayWay,
      changeTradeNo,
      kind,
      exportIncomeDetail,
      exportRefundDetail,
      refundDetail,
      incomeDetail
    } = this.props.relaxProps;
    return (
      <div>
        <div style={styles.head}>
          <Form className="filter-content" layout="inline">
            <FormItem>
              <SelectGroup
                onChange={(value) => changePayWay(value)}
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label={this.props.name}
                style={{ width: 80 }}
              >
                <Option value={null}>All</Option>
                <Option value="ALIPAY">VISA</Option>
                <Option value="CASH">AMERICAN EXPRESS</Option>
                <Option value="CASH">DISCOVER</Option>
                {/*  <Option value="UNIONPAY"></Option>
                <Option value="WECHAT">微信</Option>
                <Option value="UNIONPAY_B2B">企业银联</Option>
                <Option value="POINT">积分兑换</Option>
                <Option value="BALANCE">余额</Option>*/}
              </SelectGroup>
            </FormItem>

            <FormItem>
              <Input
                addonBefore="Transaction serial number"
                onChange={(e) => changeTradeNo(e.target.value)}
              />
            </FormItem>

            <AuthWrapper functionName="f_finance_export">
              <FormItem>
                {kind == 'income' ? (
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={incomeDetail.toJS().length <= 0}
                    onClick={(e) => {
                      e.preventDefault();
                      exportIncomeDetail();
                    }}
                  >
                    Search
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={refundDetail.toJS().length <= 0}
                    onClick={(e) => {
                      e.preventDefault();
                      exportRefundDetail();
                    }}
                  >
                    Search
                  </Button>
                )}
              </FormItem>
            </AuthWrapper>
          </Form>
          {/*<div>*/}
          {/*<Icon type="shop" style={styles.shopIcon}/>*/}
          {/*/!*{incomeDetail.toJS().length>0?incomeDetail.toJS()[0].storeName:''}*!/*/}
          {/*</div>*/}
        </div>
      </div>
    );
  }
}

const styles = {
  head: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  } as any,
  shopIcon: {
    color: '#3d85cc',
    fontSize: 16,
    marginRight: 5
  }
};
