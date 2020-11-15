import { Store } from 'plume2';
import DetailActor from './actor/detail-actor';
import LoadingActor from './actor/loading-actor';
import TidActor from './actor/tid-actor';
import TabActor from './actor/tab-actor';
import PayRecordActor from './actor/pay-record-actor';
import dictActor from './actor/dict-actor';
import { fromJS, Map } from 'immutable';

import * as webapi from './webapi';
import { addPay, fetchLogistics, fetchOrderDetail, payRecord, queryDictionary, refresh } from './webapi';
import { message } from 'antd';
import LogisticActor from './actor/logistic-actor';
import { Const, history, ValidConst } from 'qmkit';

export default class AppStore extends Store {
  bindActor() {
    return [new DetailActor(), new LoadingActor(), new TidActor(), new TabActor(), new PayRecordActor(), new LogisticActor(), new dictActor()];
  }

  constructor(props) {
    super(props);
    (window as any)._store = this;
  }

  //;;;;;;;;;;;;;action;;;;;;;;;;;;;;;;;;;;;;;
  init = async (tid: string) => {
    this.transaction(() => {
      this.dispatch('loading:start');
      this.dispatch('tid:init', tid);
      this.dispatch('detail-actor:hideDelivery');
    });

    const { res } = (await fetchOrderDetail(tid)) as any;
    let { code, context: orderInfo, message: errorInfo } = res;
    if (code == Const.SUCCESS_CODE) {
      const payRecordResult = (await payRecord(orderInfo.totalTid)) as any;
      const { context: logistics } = (await fetchLogistics()) as any;
      const { res: needRes } = (await webapi.getOrderNeedAudit()) as any;
      const { res: payRecordResult2 } = (await webapi.getPaymentInfo(orderInfo.totalTid)) as any;
      const { res: cityDictRes } = (await queryDictionary({
        type: 'city'
      })) as any;
      const { res: countryDictRes } = (await queryDictionary({
        type: 'country'
      })) as any;
      const { res: refresh } = (await webapi.refresh(orderInfo.totalTid)) as any;
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('detail:init', orderInfo);
        this.dispatch('receive-record-actor:init', payRecordResult.res.payOrderResponses);
        this.dispatch('receive-record-actor:initPaymentInfo', payRecordResult2.context);
        this.dispatch('detail-actor:setSellerRemarkVisible', true);
        this.dispatch('logistics:init', logistics);
        this.dispatch('detail:setNeedAudit', needRes.context.audit);
        this.dispatch('dict:initCity', cityDictRes.context.sysDictionaryVOS);
        this.dispatch('dict:initCountry', countryDictRes.context.sysDictionaryVOS);
        this.dispatch('dict:refresh', refresh.context.tradeDelivers);
      });
    } else {
      message.error(errorInfo);
    }
  };

  /* 刷新物流信息*/
  onRefresh = async (params) => {
    const tid = this.state().get('tid');
    const { res } = (await webapi.refresh(tid)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('dict:refresh', res.context.tradeDelivers);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 添加收款单
   */
  onSavePayOrder = async (params) => {
    let copy = Object.assign({}, params);
    const payOrder = this.state()
      .get('payRecord')
      .filter((payOrder) => payOrder.payOrderStatus == 1)
      .first();
    copy.payOrderId = payOrder.payOrderId;
    const { res } = await addPay(copy);
    if (res.code == Const.SUCCESS_CODE) {
      //成功
      message.success('添加收款单成功!');
      //刷新
      const tid = this.state().get('tid');
      this.setReceiveVisible();
      this.init(tid);
    } else {
      message.error(res.message);
    }
  };

  onTabsChange = (key: string) => {
    this.dispatch('tab:init', key);
  };

  /**
   * 详情页签 发货
   * @returns {Promise<void>}
   */
  onDelivery = async () => {
    const tid = this.state().getIn(['detail', 'id']);
    const { res } = await webapi.deliverVerify(tid);
    if (res.code !== Const.SUCCESS_CODE) {
      message.error(res.message);
    } else {
      this.dispatch('tab:init', '2');
    }
  };

  onAudit = async (tid: string, audit: string, reason?: string) => {
    if (audit !== 'CHECKED') {
      if (!reason.trim()) {
        message.error('请填写驳回原因');
        return;
      }
    }

    const { res } = await webapi.audit(tid, audit, reason);

    this.hideRejectModal();
    if (res.code == Const.SUCCESS_CODE) {
      message.success(audit == 'CHECKED' ? 'Audit successfully' : '驳回成功');
      const tid = this.state().get('tid');
      this.init(tid);
    } else {
      message.error(audit == 'CHECKED' ? '审核失败' : '驳回失败');
    }
  };

  /**
   * 发货
   */
  deliver = async () => {
    const tid = this.state().getIn(['detail', 'id']);
    await this.fetchLogistics();
    const { res } = await webapi.deliverVerify(tid);
    if (res.code !== Const.SUCCESS_CODE) {
      message.error(res.message);
    } else {
      const tradeItems = this.state()
        .getIn(['detail', 'tradeItems'])
        .concat(this.state().getIn(['detail', 'gifts']));

      const shippingItemList = tradeItems
        .filter((v) => {
          return v.get('deliveringNum') && v.get('deliveringNum') != 0;
        })
        .map((v) => {
          return {
            skuId: v.get('skuId'),
            itemNum: v.get('deliveringNum')
          };
        })
        .toJS();
      if (shippingItemList.length <= 0 || fromJS(shippingItemList).some((val) => !ValidConst.noZeroNumber.test(val.get('itemNum')))) {
        message.error('Please input the delivery quantity');
      } else {
        this.showDeliveryModal();
      }
    }
  };

  changeDeliverNum = (skuId, isGift, num) => {
    this.dispatch('detail-actor:changeDeliverNum', { skuId, isGift, num });
  };

  /**
   * 确认收货
   */
  confirm = async () => {
    const tid = this.state().getIn(['detail', 'id']);
    const { res } = await webapi.confirm(tid);
    if (res.code == Const.SUCCESS_CODE) {
      //成功
      message.success('Confirm successful receipt!');
      //刷新
      const tid = this.state().get('tid');
      this.init(tid);
    } else if (res.code == 'K-000001') {
      message.error('订单状态已改变，请刷新页面后重试!');
    } else {
      message.error(res.message);
    }
  };

  /**
   * 显示发货modal
   */
  showDeliveryModal = () => {
    this.dispatch('detail-actor:showDelivery', true);
  };

  /**
   * 关闭发货modal
   */
  hideDeliveryModal = () => {
    this.dispatch('detail-actor:hideDelivery');
  };

  /**
   * 发货
   */
  saveDelivery = async (param) => {
    const tid = this.state().getIn(['detail', 'id']);

    // if (__DEV__) {
    //   console.log('保存发货', tradeItems, tid)
    // }
    // const shippingItemList = tradeItems.filter((v) => {
    //   return v.get('deliveringNum') && v.get('deliveringNum') != 0
    // }).map((v) => {
    //   return {
    //     skuId: v.get('skuId'),
    //     skuNo: v.get('skuNo'),
    //     itemNum: v.get('deliveringNum')
    //   }
    // }).toJS()
    //
    //

    let tradeDelivery = Map();
    tradeDelivery = tradeDelivery.set('shippingItemList', this.handleShippingItems(this.state().getIn(['detail', 'tradeItems'])));
    tradeDelivery = tradeDelivery.set('giftItemList', this.handleShippingItems(this.state().getIn(['detail', 'gifts'])));
    tradeDelivery = tradeDelivery.set('deliverNo', param.deliverNo);
    tradeDelivery = tradeDelivery.set('deliverId', param.deliverId);
    tradeDelivery = tradeDelivery.set('deliverTime', param.deliverTime);

    const { res } = await webapi.deliver(tid, tradeDelivery);
    if (res.code == Const.SUCCESS_CODE) {
      //成功
      message.success('Save deliver successfully!');
      //刷新
      this.init(tid);
    } else {
      message.error(res.message);
    }
  };

  handleShippingItems = (tradeItems) => {
    return tradeItems
      .filter((v) => {
        return v.get('deliveringNum') && v.get('deliveringNum') != 0;
      })
      .map((v) => {
        return {
          skuId: v.get('skuId'),
          skuNo: v.get('skuNo'),
          itemNum: v.get('deliveringNum')
        };
      })
      .toJS();
  };

  /**
   * 作废发货记录
   * @param params
   * @returns {Promise<void>}
   */
  obsoleteDeliver = async (params) => {
    const tid = this.state().getIn(['detail', 'id']);

    const { res } = await webapi.obsoleteDeliver(tid, params);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('Void shipment record succeeded!');
      this.init(tid);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 回审
   * @param params
   * @returns {Promise<void>}
   */
  retrial = async (_params) => {
    const tid = this.state().getIn(['detail', 'id']);

    const { res } = await webapi.retrial(tid);
    if (res.code == Const.SUCCESS_CODE) {
      this.init(tid);
      message.success('回审成功!');
    } else {
      message.error(res.message);
    }
  };

  /**
   * 作废收款记录
   * @param params
   * @returns {Promise<void>}
   */
  destroyOrder = async (params) => {
    const tid = this.state().getIn(['detail', 'id']);
    const { res: verifyRes } = await webapi.verifyAfterProcessing(tid);

    if (verifyRes.code === Const.SUCCESS_CODE && verifyRes.context.length > 0) {
      message.error('订单已申请退货，不能作废收款记录');
      return;
    }

    const { res } = await webapi.destroyOrder(params);

    if (res.code === Const.SUCCESS_CODE) {
      message.success('作废成功');
      this.init(tid);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 显示/取消卖家备注修改
   * @param param
   */
  setSellerRemarkVisible = (param: boolean) => {
    this.dispatch('detail-actor:setSellerRemarkVisible', param);
  };

  /**
   * 设置卖家备注
   * @param param
   */
  setSellerRemark = (param: string) => {
    this.dispatch('detail-actor:remedySellerRemark', param);
  };

  /**
   * 修改卖家备注
   * @param param
   * @returns {Promise<void>}
   */
  remedySellerRemark = async () => {
    const tid = this.state().getIn(['detail', 'id']);
    const sellerRemark = this.state().get('remedySellerRemark');
    if (sellerRemark.length > 60) {
      message.error('备注长度不得超过60个字符');
      return;
    }
    const { res } = await webapi.remedySellerRemark(tid, sellerRemark);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('save successful');
      const tid = this.state().getIn(['detail', 'id']);
      this.init(tid);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 获取物流公司
   * @returns {Promise<void>}
   */
  fetchLogistics = async () => {
    const { res: logistics } = (await webapi.fetchLogistics()) as any;

    this.dispatch('logistics:init', logistics.context);
  };

  /**
   * 验证订单客户是否已刪除
   * @returns {Promise<void>}
   */
  verify = async (tid: string) => {
    const buyerId = this.state().getIn(['detail', 'buyer', 'id']);
    const { res } = await webapi.verifyBuyer(buyerId);
    if (res) {
      message.error('The customer has been deleted and cannot be modified！');
      return;
    } else {
      history.push('/order-edit/' + tid);
    }
  };

  /**
   * 获取卖家收款账号
   * @returns {Promise<void>}
   */
  fetchOffLineAccounts = async () => {
    const { res } = await webapi.checkFunctionAuth('/account/receivable', 'POST');
    if (!res.context) {
      message.error('此功能您没有权限访问');
      return;
    }

    const result = await webapi.fetchOffLineAccout();
    if (result) {
      this.dispatch('receive-record-actor:setReceiveVisible');
    }
  };

  /**
   * 设置添加收款记录是否显示
   */
  setReceiveVisible = () => {
    this.dispatch('receive-record-actor:setReceiveVisible');
  };

  /**
   * 确认收款单
   */
  onConfirm = async (id) => {
    let ids = [];
    ids.push(id);
    const { res } = await webapi.payConfirm(ids);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('确认成功');
      const tid = this.state().getIn(['detail', 'id']);
      this.init(tid);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 显示驳回弹框
   */
  showRejectModal = () => {
    this.dispatch('detail-actor:reject:show');
  };

  /**
   *关闭驳回弹框
   */
  hideRejectModal = () => {
    this.dispatch('detail-actor:reject:hide');
  };
}
