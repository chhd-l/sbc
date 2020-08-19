import { IOptions, Store } from 'plume2';
import { message } from 'antd';

import { Const, history, util, ValidConst } from 'qmkit';
import { fromJS } from 'immutable';
import * as webapi from './webapi';
import SettleDetailActor from './actor/settle-detail-actor';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new SettleDetailActor()];
  }

  init = async (param?: any) => {
    this.dispatch('loading:start');

    this.dispatch(
      'getPrescribe:prescriber',
      history.location.params ? history.location.params : ''
    );

    //sessionStorage.setItem('prescriberId', history.location.params?history.location.params.prescriber.prescriberId:sessionStorage.getItem('prescriberId'));

    const res1 = await webapi.fetchFinanceRewardDetails(param);

    if (res1.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        // this.dispatch('loading:end');
        this.dispatch('list:init', res1.res.context.content);
        //this.dispatch('list:init', [111,222,333]);
      });
      //获取收入对账明细
      const searchTime = {
        beginTime:
          this.state().get('dateRange').get('beginTime') + ' ' + '00:00:00',
        endTime: this.state().get('dateRange').get('endTime') + ' ' + '23:59:59'
      };
      this.dispatch('finance:searchTime', fromJS(searchTime));
      /*this.transaction(() => {
        this.dispatch('list:init', res1.res.context.content);
        this.dispatch('list:echarts', res2.res.context);
        /!*this.dispatch('loading:end');
        this.dispatch('list:init', res.context);
        this.dispatch('current', param && param.pageNum + 1);
        this.dispatch('select:init', []);*!/
      });*/
    } else {
      message.error(res1.res.message);
      if (res1.res.code === 'K-110001') {
        this.dispatch('loading:end');
      }
    }
  };
  onFormChange = (searchParam) => {
    this.dispatch('change:searchForm', searchParam);
  };

  //Send & Another
  onSharing = (sharing) => {
    this.dispatch('detail:sharing', sharing);
  };
}
