import { IOptions, Store } from 'plume2';
import { message } from 'antd';

import { Const, history, util } from 'qmkit';

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
    param = Object.assign(this.state().get('searchForm').toJS(), param);

    const res1 = await webapi.fetchFinanceRewardDetails(param);
    const res2 = await webapi.fetchEverydayAmountTotal(param);
    const PeriodAmountTotal = await webapi.fetchPeriodAmountTotal(param);
    const findListByPrescriberId = await webapi.fetchFindListByPrescriberId(
      param
    );

    if (res1.res.code === Const.SUCCESS_CODE) {
      this.dispatch('list:init', res1.res.context.content);
      this.dispatch('list:echarts', res2.res.context);
      this.dispatch('list:PeriodAmountTotal', PeriodAmountTotal.res.context);
      this.dispatch(
        'list:fetchFindListByPrescriber',
        findListByPrescriberId.res.context
      );

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

  /**
   * 查询结算单明细列表
   * @returns {Promise<void>}
   */
  fetchSettlementDetailList = async (settleId) => {
    const settleDetailList = await webapi.fetchSettlementDetailList(settleId);
    const settlement = await webapi.getSettlementById(settleId);
    this.transaction(() => {
      if (settleDetailList.res.code == Const.SUCCESS_CODE) {
        this.dispatch(
          'settleDetail:list',
          this.renderSettleDetailList(settleDetailList.res.context)
        );
      }
      if (settlement.res.code == Const.SUCCESS_CODE) {
        this.dispatch('settleDetail:settlement', settlement.res.context);
      }
    });
  };

  /**
   *
   * @param settleId
   * @returns {Promise<void>}
   */
  exportSettlementDetailList = async (settleId) => {
    let base64 = new util.Base64();
    const token = (window as any).token;
    if (token) {
      let result = JSON.stringify({ settleId: settleId, token: token });
      let encrypted = base64.urlEncode(result);

      // 新窗口下载
      const exportHref =
        Const.HOST + `/finance/settlement/detail/export/${encrypted}`;
      window.open(exportHref);
    } else {
      message.error('请登录');
    }
  };

  renderSettleDetailList = (settleList) => {
    settleList.forEach((settle) => {
      settle.key = `p_${settle.index}`;

      let settleGoodsArray = settle.goodsViewList;

      Object.assign(settle, settleGoodsArray[0]);

      if (settleGoodsArray.length > 1) {
        settleGoodsArray.shift();
        let array = [];
        settleGoodsArray.forEach((good, goodIndex) => {
          good['key'] = `c_${settle.index}_${goodIndex}`;
          array.push(good);
        });
        settle.children = array;
      }
    });
    return settleList;
  };

  /**
   * 修改结算单状态
   * @param settleIdArray
   * @param status
   * @returns {Promise<void>}
   */
  changeSettleStatus = async (settleIdArray, status) => {
    const { res } = await webapi.changeSettleStatus(settleIdArray, status);
    if (res.code == Const.SUCCESS_CODE) {
      history.push('/finance-manage-settle');
    } else {
      message.error(res.message);
    }
  };
}
