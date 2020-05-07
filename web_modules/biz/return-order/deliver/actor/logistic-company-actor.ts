import { Action, Actor } from 'plume2';
import { IMap, IList } from 'typings/globalType';

export default class LogisticCompanyActor extends Actor {
  defaultState() {
    return {
      // 物流公司列表
      logisticCompanyList: []
    };
  }

  @Action('return-order:deliver:logisticCompanyList')
  companys(state: IMap, logisticCompanyList: IList) {
    return state.set('logisticCompanyList', logisticCompanyList);
  }
}
