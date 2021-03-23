/**
 * Created by hht on 2018/2/28.
 */
import { Action, Actor, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class FreeShippingActor extends Actor {
  defaultState() {
    return {
      marketingBean: {
        shippingType: 1,
        joinLevel: -1
      },
      allGroups: []
    };
  }

  constructor() {
    super();
  }

  @Action('marketing:discountBean')
  getDiscountBean(state: IMap, res) {
    const bean = fromJS(res).set(
      'fullDiscountLevelList',
      fromJS(res)
        .get('fullDiscountLevelList')
        .map((item) => item.set('discount', (item.get('discount') * 10).toFixed(1)))
    );
    return state.set('marketingBean', bean);
  }

  @Action('marketing:allGroups')
  getAllGroups(state, allGroups) {
    return state.set('allGroups', fromJS(allGroups));
  }
}
