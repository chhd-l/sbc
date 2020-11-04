import { IOptions, Store } from 'plume2';
import { fromJS } from 'immutable';
import { message, Modal } from 'antd';

import moment from 'moment';
import { cache, checkAuth, Const } from 'qmkit';
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
    const { res: getTradeCustomerView } = await webapi.getTradeCustomerView(data);
    const { res: getGoodsInfoTopView } = await webapi.getGoodsInfoTopView(data);
    const { res: getConversionFunnelDashboardView } = await webapi.getConversionFunnelDashboardView(data);
    const { res: getPrescriberTrendView } = await webapi.getPrescriberTrendView(data);
    const { res: getPrescriberTopView } = await webapi.getPrescriberTopView(data);
    const { res: getTrafficDashboardView } = await webapi.getTrafficDashboardView(data);
    const { res: getTransactionTrendView } = await webapi.getTransactionTrendView(data);
    const { res: getTrafficTrendDashboardView } = await webapi.getTrafficTrendDashboardView(data);
    //const { res: getListAll } = await webapi.getListAll(data);

    if (getTradeCustomerView.code == Const.SUCCESS_CODE) {
      this.dispatch('home:tradeCustomerView', getTradeCustomerView.context);
      this.dispatch('home:goodsInfoTopView', getGoodsInfoTopView.context);
      this.dispatch('home:conversionFunnelDashboardView', getConversionFunnelDashboardView.context);
      this.dispatch('home:prescriberTrendView', getPrescriberTrendView.context);
      this.dispatch('home:prescriberTopView', getPrescriberTopView.context);
      this.dispatch('home:trafficDashboardView', getTrafficDashboardView.context);
      this.dispatch('home:transactionTrendView', getTransactionTrendView.context);
      this.dispatch('home:trafficTrendDashboardView', getTrafficTrendDashboardView.context);
      //this.dispatch('home:searchData', getListAll.context);
    }
  };

  prescriberInit = async (data) => {
    const { res: getTradeCustomerView } = await webapi.getPrescriberTradeAndCustomerData(data);
    const { res: getPrescriberTopView } = await webapi.getPrescriberTopView(data);
    const { res: getConversionFunnelDashboardView } = await webapi.getPrescriberConversionFunnelDashboardView(data);
    const { res: getTrafficTrendDashboardView } = await webapi.getPrescriberTrafficTrendDashboardView(data);
    const { res: getTransactionTrendView } = await webapi.getPrescriberTransactionTrendView(data);

    if (getTradeCustomerView.code == Const.SUCCESS_CODE) {
      this.dispatch('home:tradeCustomerView', getTradeCustomerView.context);
      this.dispatch('home:prescriberTopView', getPrescriberTopView.context);
      this.dispatch('home:conversionFunnelDashboardView', getConversionFunnelDashboardView.context);
      this.dispatch('home:trafficTrendDashboardView', getTrafficTrendDashboardView.context);
      this.dispatch('home:transactionTrendView', getTransactionTrendView.context);
    }
  };

  onSearchData = async (data) => {
    const { res } = await webapi.getListAll(data);
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('home:searchData', res.context);
    }
  };

  selectSearch = (data) => {
    console.log(data);
    this.dispatch('home:selectSearchData', data);
  };
}
