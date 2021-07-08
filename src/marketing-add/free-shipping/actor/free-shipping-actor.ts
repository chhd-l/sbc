/**
 * Created by hht on 2018/2/28.
 */
import { Action, Actor, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class FreeShippingActor extends Actor {
  defaultState() {
    return {
      marketingBean: {
        subType: 10, // 10 11
        joinLevel: -1,
        promotionType: 0,
      },
      allGroups: []
    };
  }

  constructor() {
    super();
  }

  @Action('marketing:shippingBean')
  getShippingBean(state: IMap, bean) {
    return state.set('marketingBean', bean);
  }

  @Action('marketing:allGroups')
  getAllGroups(state, allGroups) {
    return state.set('allGroups', fromJS(allGroups));
  }
}
