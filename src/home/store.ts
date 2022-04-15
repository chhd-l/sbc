import { IOptions, Store } from 'plume2';
import { fromJS } from 'immutable';
import { message, Modal } from 'antd';

import moment from 'moment';
import { cache, checkAuth, Const, history } from 'qmkit';
import * as webapi from './webapi';
import TodoItemsActor from './actor/todo-items-actor';
import DataBoardActor from './actor/data-board';
import ShowBoardActor from './actor/show-board';
import ShowTodoActor from './actor/show-todo';
import OverViewBoardActor from './actor/overview-board';
import RankingActor from './actor/ranking-actor';
import ReportActor from './actor/report-actor';
import TrendActor from './actor/trend-actor';
import HomeAuthActor from './actor/home-auth-actor';
import HeaderActor from './actor/header-actor';
import SettlementActor from './actor/settlement-actor';
import EvaluateSumActor from './actor/evaluate-sum-actor';
import { getEditProductResource, getPreEditProductResource } from '@/goods-add/webapi';
import {getPrescriberRecommentCodeUseView} from './webapi';

const SUCCESS = Modal.success;


export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    (window as any)._store = this;
  }

  bindActor() {
    return [new TodoItemsActor(), new DataBoardActor(), new ShowBoardActor(), new ShowTodoActor(), new OverViewBoardActor(), new RankingActor(), new ReportActor(), new TrendActor(), new HomeAuthActor(), new HeaderActor(), new SettlementActor(), new EvaluateSumActor()];
  }

  //新版

  newInit = async (data) => {
    this.dispatch('loading:start');
    const { res } = await webapi.getStoreDashboardCollectViewstore(data);
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('loading:end');
      this.dispatch('home:tradeCustomerView', res.context ? res.context.tradeCustomerView : []);
      this.dispatch('home:goodsInfoTopView', res.context.goodsInfoTopView.goodsInfoTopViewItemList || []);
      this.dispatch('home:conversionFunnelDashboardView', res.context ? res.context.conversionFunnelDashboardView : []);
      this.dispatch('home:prescriberTrendView', res.context ? res.context.prescriberTrendView : []);
      this.dispatch('home:prescriberTopView', res.context ? res.context.prescriberTopView : []);
      this.dispatch('home:trafficDashboardView', res.context ? res.context.trafficDashboardView : []);
      this.dispatch('home:taskEmployeeStatisticsView', res.context?.taskEmployeeStatisticsView?.taskStatistics ?? {});
      this.dispatch('home:transactionTrendView', res.context ? res.context.transactionTrendView : []);
      this.dispatch('home:trafficTrendDashboardView', res.context ? res.context.trafficTrendDashboardView : []);
      this.dispatch('home:prescriberTradeTopView', res.context ? res.context.prescriberTradeTopView : []);
      this.dispatch('home:prescriberTradeItemTopView', res.context ? res.context.prescriberTradeItemTopView : []);
      this.dispatch('home:prescriberTradeAndItemTopView', res.context ? res.context.prescriberTradeAndItemTopView : []);
      this.dispatch('home:prescriberRecommentCodeUseView', res.context ? res.context.prescriberRecommentCodeUseView : []);
      this.dispatch('prescriber:countByPrescriberIdView', res.context?.countByPrescriberIdView ?? []);

      //this.dispatch('home:searchData', getListAll.context);
    } else {
      this.dispatch('loading:end');
    }
  };

  prescriberInit = async (data) => {
    this.dispatch('loading:start');
    // const { res: getTradeCustomerView } = await webapi.getPrescriberTradeAndCustomerData(data);
    // const { res: getPrescriberTopView } = await webapi.getPrescriberTopView(data);
    // const { res: getConversionFunnelDashboardView } = await webapi.getPrescriberConversionFunnelDashboardView(data);
    // const { res: getTrafficTrendDashboardView } = await webapi.getPrescriberTrafficTrendDashboardView(data);
    // const { res: getTransactionTrendView } = await webapi.getPrescriberTransactionTrendView(data);
    // const { res: getTrafficDashboardView } = await webapi.getTrafficDashboardView(data);
    //
    // if (getTradeCustomerView.code == Const.SUCCESS_CODE) {
    //   this.dispatch('loading:end');
    //   this.dispatch('prescriber:p_trafficDashboardView', getTrafficDashboardView.context);
    //   this.dispatch('prescriber:p_tradeCustomerView', getTradeCustomerView.context);
    //   this.dispatch('prescriber:p_prescriberTopView', getPrescriberTopView.context);
    //   this.dispatch('prescriber:p_conversionFunnelDashboardView', getConversionFunnelDashboardView.context);
    //   this.dispatch('prescriber:p_trafficTrendDashboardView', getTrafficTrendDashboardView.context);
    //   this.dispatch('prescriber:p_transactionTrendView', getTransactionTrendView.context);
    // } else {
    //   this.dispatch('loading:end');
    // }
    await Promise.all([
      webapi.getPrescriberTradeAndCustomerData(data),
      webapi.getPrescriberTopView(data),
      webapi.getPrescriberConversionFunnelDashboardView(data),
      webapi.getPrescriberTrafficTrendDashboardView(data),
      webapi.getPrescriberTransactionTrendView(data),
      webapi.getTrafficDashboardView(data),
      webapi.getPrescriberRecommentCodeUseView(data)

    ])
      .then((results) => {
        this.dispatch('loading:end');
        this.transaction(() => {
          this.dispatch('prescriber:p_tradeCustomerView', (results[0].res as any).context);
          this.dispatch('prescriber:p_prescriberTopView', (results[1].res as any).context);
          this.dispatch('prescriber:p_conversionFunnelDashboardView', (results[2].res as any).context);
          this.dispatch('prescriber:p_trafficTrendDashboardView', (results[3].res as any).context);
          this.dispatch('prescriber:p_transactionTrendView', (results[4].res as any).context);
          this.dispatch('prescriber:p_trafficDashboardView', (results[5].res as any).context);
          this.dispatch('prescriber:p_prescriberRecommentCodeUseView', (results[6].res as any).context);
        });
      })
      .catch((err) => {
        this.dispatch('loading:end');
      });
  };

  onSearchData = async (data) => {
    const { res } = await webapi.getListAll(data);
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('home:searchData', res.context);
    }
  };

  selectSearch = (data) => {
    this.dispatch('home:selectSearchData', data);
  };

  cleanRedux = () => {
    setTimeout(() => {
      this.dispatch('home:tradeCustomerView', []);
      this.dispatch('home:goodsInfoTopView', []);
      this.dispatch('home:conversionFunnelDashboardView', []);
      this.dispatch('home:prescriberTrendView', []);
      this.dispatch('home:prescriberTopView', []);
      this.dispatch('home:trafficDashboardView', []);
      this.dispatch('home:transactionTrendView', []);
      this.dispatch('home:trafficTrendDashboardView', []);
      this.dispatch('home:taskEmployeeStatisticsView', []);
    }, 3000);
  };
}
