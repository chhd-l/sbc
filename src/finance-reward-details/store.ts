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
    if (history.location.params) {
      sessionStorage.setItem('prescriberId', history.location.params.prescriberId);
      sessionStorage.setItem('prescriberName', history.location.params.prescriberName);
    } else {
      sessionStorage.getItem('prescriberId');
    }
    // sessionStorage.setItem('prescriberId', history.location.params?history.location.params.prescriberId:sessionStorage.getItem('prescriberId'));
    let prescriberId = sessionStorage.getItem('prescriberId');
    this.dispatch('getPrescribe:prescriber', history.location.params ? history.location.params : prescriberId);

    //sessionStorage.setItem('prescriberId', history.location.params?history.location.params.prescriber.prescriberId:sessionStorage.getItem('prescriberId'));
    param = Object.assign(this.state().get('searchForm').merge({ prescriberId }).toJS(), param);

    const res1 = await webapi.fetchFinanceRewardDetails(param);
    const res2 = await webapi.fetchEverydayAmountTotal(param);
    const PeriodAmountTotal = await webapi.fetchPeriodAmountTotal(param);
    const findListByPrescriberId = await webapi.fetchFindListByPrescriberId(param);

    if (res1.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('list:init', res1.res.context.content);
        //this.dispatch('list:init', [111,222,333]);
        this.dispatch('list:EchartsData', res2.res.context);
        this.dispatch('current', param && param.pageNum + 1);
        this.dispatch('list:PeriodAmountTotal', PeriodAmountTotal.res.context);
        this.dispatch('list:fetchFindListByPrescriber', findListByPrescriberId.res.context);
        this.dispatch('list:setName', prescriberId);
        this.dispatch('ticket:onRewardExport', fromJS(param));
      });
      //获取收入对账明细
      const searchTime = {
        beginTime: this.state().get('dateRange').get('beginTime') + ' ' + '00:00:00',
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
  /**
   * 改变时间
   * @param params
   */
  changeDateRange = (field, value) => {
    this.dispatch('finance:dateRange', { field, value });
  };
  /**
   * 带着搜索条件的分页点击查询
   */
  onSearch = async () => {
    let getTime = this.state().get('dateRange').toJS();
    getTime = await Object.assign(getTime, { pageNum: 0, pageSize: 10 });
    await this.init(getTime);
  };
  /**
   * 验证InputGroupCompact控件数值大小，并进行大小值交换
   */
  checkSwapInputGroupCompact = () => {
    const params = this.state().get('form').toJS();
    const {
      salePriceFirst,
      salePriceLast,
      distributionCommissionFirst,
      distributionCommissionLast, // distributionSalesCountFirst,
      stockFirst,
      stockLast,
      commissionRateFirst,
      commissionRateLast
    } = params;

    let validateFlag = false;
    // 校验数据
    if (salePriceFirst && !ValidConst.zeroPrice.test(salePriceFirst)) {
      return validateFlag;
    }

    if (salePriceLast && !ValidConst.zeroPrice.test(salePriceLast)) {
      return validateFlag;
    }

    if (distributionCommissionFirst && !ValidConst.zeroPrice.test(distributionCommissionFirst)) {
      return validateFlag;
    }

    if (distributionCommissionLast && !ValidConst.zeroPrice.test(distributionCommissionLast)) {
      return validateFlag;
    }

    if (stockFirst && !ValidConst.numbezz.test(stockFirst)) {
      return validateFlag;
    }

    if (stockLast && !ValidConst.numbezz.test(stockLast)) {
      return validateFlag;
    }

    if (commissionRateFirst && !ValidConst.zeroPrice.test(commissionRateFirst)) {
      return validateFlag;
    }

    if (commissionRateLast && !ValidConst.zeroPrice.test(commissionRateLast)) {
      return validateFlag;
    }
    if (parseFloat(salePriceFirst) > parseFloat(salePriceLast)) {
      this.onFormFieldChange({
        key: 'salePriceFirst',
        value: salePriceLast
      });
      this.onFormFieldChange({
        key: 'salePriceLast',
        value: salePriceFirst
      });
    }
    if (parseFloat(distributionCommissionFirst) > parseFloat(distributionCommissionLast)) {
      this.onFormFieldChange({
        key: 'distributionCommissionFirst',
        value: distributionCommissionLast
      });
      this.onFormFieldChange({
        key: 'distributionCommissionLast',
        value: distributionCommissionFirst
      });
    }
    if (parseFloat(commissionRateFirst) > parseFloat(commissionRateLast)) {
      this.onFormFieldChange({
        key: 'commissionRateFirst',
        value: commissionRateLast
      });
      this.onFormFieldChange({
        key: 'commissionRateLast',
        value: commissionRateFirst
      });
    }
    if (parseInt(stockFirst) > parseInt(stockLast)) {
      this.onFormFieldChange({
        key: 'stockFirst',
        value: stockLast
      });
      this.onFormFieldChange({
        key: 'stockLast',
        value: stockFirst
      });
    }

    return !validateFlag;
  };

  /**
   * enter键搜索时，参数错误调用此方法，默认查不到数据
   */
  wrongSearch = () => {
    this.dispatch('wrong:search');
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
        this.dispatch('settleDetail:list', this.renderSettleDetailList(settleDetailList.res.context));
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
      const exportHref = Const.HOST + `/finance/settlement/detail/export/${encrypted}`;
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

  //导出
  bulkExport = async () => {
    const orderId = this.state().get('searchForm').toJS();
    const queryParams = this.state().get('onRewardExportData').toJS();

    const { beginTime, endTime, prescriberId, id } = queryParams;
    return new Promise((resolve) => {
      setTimeout(() => {
        // 参数加密
        const base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          const result = JSON.stringify({
            beginTime: beginTime,
            endTime: endTime,
            prescriberId: prescriberId,
            id: orderId.id,
            token: token
          });
          const encrypted = base64.urlEncode(result);
          // 新窗口下载
          const exportHref = Const.HOST + `/trade/prescriber/export/rewardDetails/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('请登录');
        }
        resolve();
      }, 500);
    });
  };
}
