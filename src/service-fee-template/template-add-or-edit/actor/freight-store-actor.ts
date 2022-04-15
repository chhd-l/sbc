import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';
import { forEach } from 'lodash';

export default class FreightStoreActor extends Actor {
  defaultState() {
    return {
      // 模板Id
      freightTempId: 0,
      // 模板名称
      freightTempName: '',
      // 规则名称
      ruleName: '',
      // 地区Ids
      destinationArea: [],
      // 计费规则
      freightType: 0,
      // 不满*元
      satisfyPrice: 0,
      // 运费
      satisfyFreight: 0,
      // 固定运费
      fixedFreight: 0,
      // 已被选中的区域Id
      selectedAreas: [],
      // 是否默认 1: 默认 0: 非默认
      defaultFlag: 0,
      // 发货地区名字
      destinationAreaName: [],
      treeNode: [],
      // 支付方式code
      paymentMethodCode: '',
      // 最低service fee
      minimumServiceFee: '',
      // 支付方式列表
      paymentMethodList: [],
      // 规则表格
      ruleTableList: [
        {
          //id
          id: new Date().getTime(),
          // 最小订单金额
          orderInitialAmount: 0,
          // 最小订单金额校验状态
          orderInitialAmountValid: true,
          // 最大订单金额
          orderMaxAmount: '',
          // 最大订单金额校验状态
          orderMaxAmountValid: false,
          // 规则类型: Percent/Amount
          ruleSetting: '',
          // 具体额度
          amountOrPercentageVal: '',
          // 具体额度校验状态
          amountOrPercentageValValid: false,
          valid: false,
          // 是否删除 0: 否   1: 是
          delFlag: 0
        }
      ]
    };
  }

  /**
   * 修改指定字段值
   *
   * @param {IMap} state
   * @param {any} { field, value }
   * @returns
   * @memberof FreightStoreActor
   */
  @Action('freight: store: field: value')
  storeFreightFieldsValue(state: IMap, { field, value }) {
    return state.set(field, value);
  }

  /**
   * 初始化店铺运费模板
   * @param state
   * @param param1
   */
  @Action('freight: init')
  init(
    state: IMap,
    {
      ruleName,
      freightTempName,
      destinationArea,
      freightType,
      satisfyPrice,
      satisfyFreight,
      minimumDeliveryFee,
      minimumServiceFee,
      fixedFreight,
      selectedAreas,
      destinationAreaName,
      freightTempId,
      defaultFlag,
      treeNode,
      paymentMethodCode,
      // paymentMethodList,
      ruleTableList
    }
  ) {
    return state
      .set('freightTempName', freightTempName)
      .set('ruleName', ruleName)
      .set('destinationArea', destinationArea)
      .set('freightType', freightType)
      .set('satisfyPrice', satisfyPrice)
      .set('satisfyFreight', satisfyFreight)
      .set('fixedFreight', fixedFreight)
      .set('minimumDeliveryFee', minimumDeliveryFee)
      .set('minimumServiceFee', minimumServiceFee)
      .set('destinationAreaName', destinationAreaName)
      .set('selectedAreas', selectedAreas)
      .set('freightTempId', freightTempId)
      .set('defaultFlag', defaultFlag)
      .set('treeNode', treeNode)
      .set('ruleTableList', ruleTableList)
      .set('paymentMethodCode', paymentMethodCode);
    // .set('paymentMethodList', paymentMethodList);
  }

  @Action('freight: rules: add')
  tableRulesAdd(state: IMap) {
    const lastItem = state
      .get('ruleTableList')
      .filter((f) => f.get('delFlag') == 0)
      .last();
    return state.set(
      'ruleTableList',
      state.get('ruleTableList').concat(
        fromJS([
          {
            //id
            id: new Date().getTime(),
            // 最小订单金额
            orderInitialAmount: parseFloat(lastItem.get('orderMaxAmount')) + 1,
            // 最小订单金额校验状态
            orderInitialAmountValid: true,
            // 最大订单金额
            orderMaxAmount: '',
            // 最大订单金额校验状态
            orderMaxAmountValid: false,
            // 规则类型: Percent/Amount
            ruleSetting: '',
            // 具体额度
            amountOrPercentageVal: '',
            // 具体额度校验状态
            amountOrPercentageValValid: false,
            valid: false,
            // 是否删除 0: 否   1: 是
            delFlag: 0
          }
        ])
      )
    );
  }

  @Action('freight: rules: delete')
  tableRulesDelete(state: IMap, { id }) {
    const index = state.get('ruleTableList').findIndex((r) => r.get('id') == id);
    return state.updateIn(['ruleTableList', index, 'delFlag'], () => 1);
  }
  /**
   * 修改rule table list的值
   * @param state
   * @param param1
   */
  @Action('freight: rules: edit')
  tableRulesEdit(state: IMap, { id, index, field, value }) {
    const idx = id ? state.get('ruleTableList').findIndex((r) => r.get('id') == id) : index;
    return state.updateIn(['ruleTableList', idx, field], () => value);
  }
}
