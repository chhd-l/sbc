import { Actor, Action, IMap } from 'plume2';

export default class TabActor extends Actor {
  defaultState() {
    return {
      tab: {
        key: '0'
      },
      tabConfig:{
        pendingReview:0,
        toBeDelivery:0,
        toBeReceived:0,
        pendingRefund:0
      },
      pendingRefundConfig:{
        online:0,
        cash:0,
        cashOnDelivery:0
      }
    };
  }

  @Action('order-return-list:tab:init')
  init(state: IMap, key: string) {
    return state.setIn(['tab', 'key'], key);
  }

  /**
   * Return Order 根据配置项显示tab页，如果配置都为0（自动审核），
   * 则不显示对应Tab页(目前需求为Pending review、 To be delivery)
   */

  @Action('order-return-hide')
  hideTabConfig(state:IMap,config:IMap){
    return state.set('tabConfig',config)
  }

  @Action('order-return-pending-refund-config')
  getPendingRefundConfig(state:IMap,config:IMap){
    return state.set('pendingRefundConfig',config)
  }
}

