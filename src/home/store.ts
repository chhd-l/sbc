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

const SUCCESS = Modal.success;

const dataBoardUi = {
  f_trade_watch_1: [
    {
      label: 'Transaction Profile',
      dataKey: 'tradeOview',
      priority: 2,
      onOff: true,
      isOview: true
    },
    {
      label: 'Transaction Reports',
      dataKey: 'tradeReport',
      priority: 6,
      onOff: true
    },
    { label: 'Trading trend', dataKey: 'tradeTrends', priority: 9, onOff: true }
  ],
  f_flow_watch_1: [
    {
      label: 'Flow profile',
      dataKey: 'trafficOview',
      priority: 1,
      onOff: true,
      isOview: true
    },
    {
      label: 'Flow Reports',
      dataKey: 'trafficReport',
      priority: 5,
      onOff: true
    },
    {
      label: 'Traffic trend',
      dataKey: 'trafficTrends',
      priority: 8,
      onOff: true
    }
  ],
  f_goods_watch_1: [
    {
      label: 'Commodity Profile',
      dataKey: 'skuOview',
      priority: 3,
      onOff: true,
      isOview: true
    },
    {
      label: 'Product sales ranking',
      dataKey: 'skuSaleRanking',
      priority: 11,
      onOff: true
    }
  ],
  f_customer_watch_1: [
    {
      label: 'Customer Profile',
      dataKey: 'customerOview',
      priority: 4,
      onOff: true,
      isOview: true
    },
    {
      label: 'Customer growth report',
      dataKey: 'customerGrowthReport',
      priority: 7,
      onOff: true
    },
    {
      label: 'Customer growth trend',
      dataKey: 'customerGrowthTrends',
      priority: 10,
      onOff: true
    },
    {
      label: 'Customer order ranking',
      dataKey: 'customerOrderRanking',
      priority: 12,
      onOff: true
    }
  ],
  f_employee_watch_1: [
    {
      label: '业务员业绩排行',
      dataKey: 'employeeAchieve',
      priority: 13,
      onOff: true
    }
  ]
};

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
      this.dispatch('home:tradeCustomerView', res.context ? res.context.tradeCustomerView : null);
      this.dispatch('home:goodsInfoTopView', res.context.goodsInfoTopView.goodsInfoTopViewItemList || []);
      this.dispatch('home:conversionFunnelDashboardView', res.context ? res.context.conversionFunnelDashboardView : null);
      this.dispatch('home:prescriberTrendView', res.context ? res.context.prescriberTrendView : null);
      this.dispatch('home:prescriberTopView', res.context ? res.context.prescriberTopView : null);
      this.dispatch('home:trafficDashboardView', res.context ? res.context.trafficDashboardView : null);
      this.dispatch('home:transactionTrendView', res.context ? res.context.transactionTrendView : null);
      this.dispatch('home:trafficTrendDashboardView', res.context ? res.context.trafficTrendDashboardView : null);
      //this.dispatch('home:searchData', getListAll.context);
    } else {
      this.dispatch('loading:end');
    }
  };

  prescriberInit = async (data) => {
    console.log(data, '---------params');
    this.dispatch('loading:start');
    const { res: getTradeCustomerView } = await webapi.getPrescriberTradeAndCustomerData(data);
    const { res: getPrescriberTopView } = await webapi.getPrescriberTopView(data);
    const { res: getConversionFunnelDashboardView } = await webapi.getPrescriberConversionFunnelDashboardView(data);
    const { res: getTrafficTrendDashboardView } = await webapi.getPrescriberTrafficTrendDashboardView(data);
    const { res: getTransactionTrendView } = await webapi.getPrescriberTransactionTrendView(data);
    const { res: getTrafficDashboardView } = await webapi.getTrafficDashboardView(data);

    if (getTradeCustomerView.code == Const.SUCCESS_CODE) {
      this.dispatch('loading:end');
      this.dispatch('prescriber:p_trafficDashboardView', getTrafficDashboardView.context);
      this.dispatch('prescriber:p_tradeCustomerView', getTradeCustomerView.context);
      this.dispatch('prescriber:p_prescriberTopView', getPrescriberTopView.context);
      this.dispatch('prescriber:p_conversionFunnelDashboardView', getConversionFunnelDashboardView.context);
      this.dispatch('prescriber:p_trafficTrendDashboardView', getTrafficTrendDashboardView.context);
      this.dispatch('prescriber:p_transactionTrendView', getTransactionTrendView.context);
    } else {
      this.dispatch('loading:end');
    }
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
      this.dispatch('home:tradeCustomerView', null);
      this.dispatch('home:goodsInfoTopView', null);
      this.dispatch('home:conversionFunnelDashboardView', null);
      this.dispatch('home:prescriberTrendView', null);
      this.dispatch('home:prescriberTopView', null);
      this.dispatch('home:trafficDashboardView', null);
      this.dispatch('home:transactionTrendView', null);
      this.dispatch('home:trafficTrendDashboardView', null);
    }, 3000);
  };
}
