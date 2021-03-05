/**
 * Created by hht on 2018/2/28.
 */
import { Action, Actor, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class FullGiftActor extends Actor {
  defaultState() {
    return {
      marketingBean: {}
    };
  }

  constructor() {
    super();
  }

  @Action('marketing:giftBean')
  getGiftBean(state: IMap, res) {
    return state.set('marketingBean', fromJS(res));
  }
}
