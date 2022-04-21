import React from 'react';
import { Relax } from 'plume2';
import { Form, Select, Button, Input } from 'antd';
import { FormattedMessage } from 'react-intl';
import { SelectGroup, noop, AuthWrapper } from 'qmkit';

const FormItem = Form.Item;
const Option = Select.Option;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      //改变支付方式
      changePayWay: Function;
      changeVendorWay: Function;
      changeTradeNo: Function;
      onSearch: Function;
      payWaysObj: any;
      incomeDetail: any;
      kind: string;
      //导出收入明细
      exportIncomeDetail: Function;
      exportRefundDetail: Function;
      refundDetail: any;
      payW: any;
    };
    name?: string;
  };

  static relaxProps = {
    changePayWay: noop,
    changeVendorWay: noop,
    changeTradeNo: noop,
    payWaysObj: 'payWaysObj',
    incomeDetail: 'incomeDetail',
    kind: 'kind',
    exportIncomeDetail: noop,
    exportRefundDetail: noop,
    onSearch: noop,
    refundDetail: 'refundDetail',
    payW: 'payW'
  };

  render() {
    const { changePayWay, changeVendorWay, changeTradeNo, kind, exportIncomeDetail, exportRefundDetail, refundDetail, incomeDetail, onSearch, payW } = this.props.relaxProps;
    return (
      <div>
        <div style={styles.head}>
          <Form className="filter-content" layout="inline">
            {/* <FormItem>
              <SelectGroup
                onChange={(value) => changePayWay(value)}
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                defaultValue="All"
                label="Payment type"
                style={{ width: 180 }}
              >
                <Option value={null}>All</Option>
                <Option value="PAYU">PayU</Option>
                <Option value="OXXO">OXXO</Option>
              </SelectGroup>
            </FormItem>*/}
            {/*<FormItem>
              <SelectGroup
                onChange={(value) => changeVendorWay(value)}
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label={this.props.name}
                style={{ width: 180 }}
                defaultValue="All"
              >
                <Option value={null}>All</Option>
                {payW.map((element, index) => {
                  return (
                    <Option key={index} value={element}>
                      {element}
                    </Option>
                  );
                })}
                  <Option value="UNIONPAY"></Option>
                <Option value="WECHAT">微信</Option>
                <Option value="UNIONPAY_B2B">企业银联</Option>
                <Option value="POINT">积分兑换</Option>
                <Option value="BALANCE">余额</Option>
              </SelectGroup>
            </FormItem>*/}

            <FormItem>
              <Input addonBefore={<FormattedMessage id="Order.number"/>} onChange={(e) => changeTradeNo(e.target.value)} />
            </FormItem>

            <AuthWrapper functionName="f_finance_export">
              <FormItem>
                    <Button
                      type="primary"
                      htmlType="submit"
                      // disabled={incomeDetail.toJS().length <= 0}
                      onClick={(e) => {
                        e.preventDefault();
                        onSearch();
                      }}
                    >
                      <FormattedMessage id="Finance.Search" />
                    </Button>
              </FormItem>
              {/*<FormItem>*/}
              {/*  {kind == 'income' ? (*/}
              {/*    <Button*/}
              {/*      type="primary"*/}
              {/*      htmlType="submit"*/}
              {/*      // disabled={incomeDetail.toJS().length <= 0}*/}
              {/*      onClick={(e) => {*/}
              {/*        e.preventDefault();*/}
              {/*        onSearch();*/}
              {/*      }}*/}
              {/*    >*/}
              {/*      <FormattedMessage id="Finance.Search" />*/}
              {/*    </Button>*/}
              {/*  ) : (*/}
              {/*    <Button*/}
              {/*      type="primary"*/}
              {/*      htmlType="submit"*/}
              {/*      // disabled={refundDetail.toJS().length <= 0}*/}
              {/*      onClick={(e) => {*/}
              {/*        e.preventDefault();*/}
              {/*        onSearch();*/}
              {/*        //exportRefundDetail();*/}
              {/*      }}*/}
              {/*    >*/}
              {/*      <FormattedMessage id="Finance.Search" />*/}
              {/*    </Button>*/}
              {/*  )}*/}
              {/*</FormItem>*/}
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
