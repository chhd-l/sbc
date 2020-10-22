import { Action, Actor, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class HomeAuthActor extends Actor {
  defaultState() {
    return {
      session: {}, //授权信息
      isAuthVisible: false, //授权modal是否显示
      isAuthTipVisible: false, //授权tip是否显示
      tradeCustomerView: '',
      goodsInfoTopView: '',
      prescriberTrendView: '',
      prescriberTopView: '',
      trafficDashboardView: '',
      transactionTrendView: '',
      trafficTrendDashboardView: '',
      conversionFunnelDashboardView: '',
      search: '',
      searchData: ''
    };
  }

  /**
   * 初始化授权码信息
   */
  @Action('home:tradeCustomerView')
  tradeCustomerView(state: IMap, res) {
    return state.set('tradeCustomerView', res);
  }
  @Action('home:goodsInfoTopView')
  goodsInfoTopView(state: IMap, res) {
    return state.set('goodsInfoTopView', res);
  }
  @Action('home:prescriberTrendView')
  prescriberTrendView(state: IMap, res) {
    return state.set('prescriberTrendView', res);
  }
  @Action('home:prescriberTopView')
  prescriberTopView(state: IMap, res) {
    return state.set('prescriberTopView', res);
  }
  @Action('home:trafficDashboardView')
  trafficDashboardView(state: IMap, res) {
    return state.set('trafficDashboardView', res);
  }
  @Action('home:transactionTrendView')
  transactionTrendView(state: IMap, res) {
    return state.set('transactionTrendView', res);
  }
  @Action('home:trafficTrendDashboardView')
  trafficTrendDashboardView(state: IMap, res) {
    return state.set('trafficTrendDashboardView', res);
  }
  @Action('home:conversionFunnelDashboardView')
  conversionFunnelDashboardView(state: IMap, res) {
    return state.set('conversionFunnelDashboardView', res);
  }

  /*Prescriber*/
  @Action('prescriber:prescriberConversionFunnelDashboardView')
  prescriberConversionFunnelDashboardView(state: IMap, res) {
    return state.set('prescriberConversionFunnelDashboardView', res);
  }

  @Action('home:search')
  search(state: IMap, res) {
    return state.set('search', res);
  }

  @Action('home:searchData')
  searchData(state: IMap, res) {
    return state.set('searchData', res);
  }

  /**
   * 初始化授权码信息
   */
  @Action('home-auth-actor:init')
  init(state: IMap, res) {
    return state.set('session', fromJS(res));
  }

  /**
   * 设置授权modal是否显示
   */
  @Action('home-auth-actor:setAuthVisible')
  setAuthVisible(state: IMap, res: boolean) {
    return state.set('isAuthVisible', res);
  }

  /**
   * 设置授权tip是否显示
   */
  @Action('home-auth-actor:setAuthTipVisible')
  setAuthTipVisible(state: IMap, res: boolean) {
    return state.set('isAuthTipVisible', res);
  }
}
