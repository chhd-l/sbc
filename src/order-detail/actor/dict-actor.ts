import { Actor, Action, IMap } from 'plume2';

export default class DictActor extends Actor {
  defaultState() {
    return {
      countryDict: [],
      cityDict: []
    };
  }

  @Action('dict:initCity')
  initCity(state: IMap, list: IMap) {
    return state.set('cityDict', list);
  }

  @Action('dict:initCountry')
  initCountry(state: IMap, list: IMap) {
    return state.set('countryDict', list);
  }
}
