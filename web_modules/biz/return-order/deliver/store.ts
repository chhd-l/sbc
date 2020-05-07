import { Store } from 'plume2';
import { fromJS } from 'immutable';
import LogisticCompanyActor from './actor/logistic-company-actor';
import * as webapi from './webapi';

export default class AppStore extends Store {
  bindActor() {
    return [new LogisticCompanyActor()];
  }

  constructor(props) {
    super(props);
    //debug
    (window as any)._store = this;
  }

  /**
   * 加载物流公司列表
   */
  init = () => {
    webapi.fetchLogisticCompany().then((result) => {
      let data = (result.res as any).context.map((item) => {
        return {
          expressCompanyId: item['expressCompanyId'],
          expressCompany: item
        };
      });

      this.dispatch('return-order:deliver:logisticCompanyList', fromJS(data));
    });
  };
}
