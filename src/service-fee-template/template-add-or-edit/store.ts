import { Store, IOptions } from 'plume2';

import { message } from 'antd';
import { fromJS } from 'immutable';
import { Const, history } from 'qmkit';

import FreightStoreActor from './actor/freight-store-actor';
import * as webapi from './webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new FreightStoreActor()];
  }

  /**
   * 初始化模板信息
   */
  init = async (id) => {
    const { res } = (await webapi.fetchServiceFeeDetails({ id })) as any;

    const { freightTempName, ruleName, paymentMethodCode, minAcount, ruleList } = res.context;
    this.dispatch('freight: init', {
      freightTempName,
      ruleName,
      paymentMethodCode,
      minimumServiceFee: minAcount,
      ruleTableList: fromJS(
        ruleList.map((r) => ({
          id: r.id,
          orderInitialAmount: r.initAmount,
          orderMaxAmount: r.maxAmount,
          ruleSetting: r.type,
          amountOrPercentageVal: r.fee,
          valid: true,
          delFlag: 0
        }))
      )
    });
  };

  /**
   * 店铺模板根据字段修改值
   *
   * @memberof AppStore
   */
  storeFreightFieldsValue = ({ field, value }) => {
    this.dispatch('freight: store: field: value', { field, value });
  };

  /**
   * 保存service fee规则
   */
  saveServiceFeeRule = async (id) => {
    try {
      let { ruleName, paymentMethodList, paymentMethodCode, minimumServiceFee, ruleTableList } =
        this.state().toJS();
      const targetPaymentItem = paymentMethodList.find((f) => f.code === paymentMethodCode);
      await (id ? webapi.updateServiceFeeRule : webapi.saveServiceFeeRule)({
        id,
        ruleName,
        paymentMethodId: targetPaymentItem.id,
        paymentMethodCode: targetPaymentItem.code,
        paymentMethodName: targetPaymentItem.name,
        minAcount: minimumServiceFee,
        ruleList: ruleTableList
          .filter((el) => el.delFlag == 0)
          .map((r, idx) => ({
            id: r.id,
            initAmount: parseFloat(r.orderInitialAmount),
            maxAmount: parseFloat(r.orderMaxAmount),
            type: r.ruleSetting,
            fee: parseFloat(r.amountOrPercentageVal),
            sort: idx
          }))
      });
      message.success('Operate successfully');
      history.push({
        pathname: '/service-fee-template'
      });
    } catch (err) {
      message.error(err.message);
    }
  };

  getPaymentMethod = async () => {
    const list = (await webapi.getPaymentSetting()) as any;
    this.dispatch('freight: store: field: value', {
      field: 'paymentMethodList',
      value: fromJS(list.res?.context ? list.res?.context[0]?.payPspItemVOList : [])
    });
  };
  tableRulesAdd = () => {
    this.dispatch('freight: rules: add');
  };
  tableRulesDelete = (id) => {
    this.dispatch('freight: rules: delete', { id });
  };
  tableRulesEdit = ({ id, index, field, value }) => {
    this.dispatch('freight: rules: edit', { id, field, index, value });
    let { ruleTableList } = this.state().toJS();
    const targetItem = id ? ruleTableList.find((r) => r.id == id) : ruleTableList[index];
    this.dispatch('freight: rules: edit', {
      id,
      field: 'valid',
      index,
      value:
        targetItem.orderInitialAmount !== '' &&
        targetItem.orderMaxAmount !== '' &&
        targetItem.ruleSetting !== '' &&
        targetItem.amountOrPercentageVal !== ''
    });
  };
}
