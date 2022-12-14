/**
 * Created by hht on 2018/2/28.
 */
import { Action, Actor, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class FullDiscountActor extends Actor {
  defaultState() {
    return {
      marketingBean: {
        promotionType: 0,
        publicStatus: 1,
        subType: 12,
        isClub: false,
        fullDiscountLevelList: []
      },
      allGroups: []
    };
  }

  constructor() {
    super();
  }

  // @Action('marketing:discountBean')
  // getDiscountBean(state: IMap, res) {
  //   const bean = fromJS(res).set(
  //     'fullDiscountLevelList',
  //     fromJS(res)
  //       .get('fullDiscountLevelList')
  //       .map((item) => item.set('discount', (item.get('discount') * 10).toFixed(1)))
  //   );
  //   return state.set('marketingBean', bean);
  // }
  @Action('marketing:discountBean')
  getDiscountBean(state: IMap, bean) {
    return state.set('marketingBean', bean);
  }
  @Action('marketing:allGroups')
  getAllGroups(state, allGroups) {
    return state.set('allGroups', fromJS(allGroups));
  }
}
