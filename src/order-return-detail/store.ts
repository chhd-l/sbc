import { Store } from 'plume2';
import { fromJS } from 'immutable';
import { message } from 'antd';
import DetailActor from './actor/detail-actor';
import RefundRecordActor from './actor/refund-record-actor';
import LoadingActor from './actor/loading-actor';
import * as webapi from './webapi';
import { Const } from 'qmkit';

export default class AppStore extends Store {
  bindActor() {
    return [new DetailActor(), new RefundRecordActor(),new LoadingActor()];
  }

  constructor(props) {
    super(props);
    (window as any)._store = this;
  }

  //;;;;;;;;;;;;;action;;;;;;;;;;;;;;;;;;;;;;;
  init = async (rid: string) => {
    this.dispatch('loading:start');
    const res = await webapi.fetchReturnDetail(rid);
    if (fromJS(res.res).get('code') == Const.SUCCESS_CODE) {
      this.dispatch('order-return-detail:init', fromJS(res.res).get('context'));
      const returnFlowState = this.state().getIn(['detail', 'returnFlowState']);
      // 只有已完成的退单，能看到退款记录
      if ('COMPLETED' == returnFlowState) {
        this.fetchRefundOrder();
      } else if ('REJECT_RECEIVE' == returnFlowState || 'VOID' == returnFlowState) {
        // 拒绝收货 或者 审核驳回
        this.dispatch('order-return-detail:rejectReason', this.state().getIn(['detail', 'rejectReason']) || '');
      } else if ('REJECT_REFUND' == returnFlowState) {
        // 拒绝退款
        webapi.fetchRefundOrdeById(this.state().getIn(['detail', 'id'])).then((res) => {
          const result = fromJS(res.res);
          this.dispatch('order-return-detail:rejectReason', result.getIn(['context', 'refuseReason']) || '');
        });
      }
      this.dispatch('loading:end');
      // this.fetchRefundOrder();
    }
  };

  // 驳回／拒绝收货 modal状态改变
  onRejectModalChange = (status) => {
    this.dispatch('order-return-detail:reject-modal:change', fromJS(status));
  };

  onRejectModalHide = () => {
    this.dispatch('order-return-detail:reject-modal:hide');
  };

  // 填写物流 modal状态改变
  onDeliverModalChange = (status) => {
    this.dispatch('order-return-detail:deliver-modal:change', fromJS(status));
  };

  onDeliverModalHide = () => {
    this.dispatch('order-return-detail:deliver-modal:hide');
  };

  // 线下退款 modal状态改变
  onRefundModalChange = (status) => {
    this.dispatch('order-return-detail:refund-modal:change', fromJS(status));
  };

  //线上退款 modal状态改变
  onRefundOnlineModalChange = (status) => {
    this.dispatch('order-return-detail:refund-online-modal:change', fromJS(status));
  };

  onRefundModalHide = () => {
    this.dispatch('order-return-detail:refund-modal:hide');
  };

  onlineRefundModalShow = () => {
    this.dispatch('order-return-detail:show');
  };

  onlineRefundModalHide = () => {
    this.dispatch('order-return-detail:hide');
  };

  onAudit = (rid: string) => {
    this.dispatch('loading:start');
    return webapi
      .audit(rid)
      .then((data) => {
        const {res} = data
        if(res.code === Const.SUCCESS_CODE){
          this.init(rid);
        }
        this.dispatch('loading:end');
        
      })
      .catch(() => {});
  };

  onReject = (rid: string, reason: string) => {
    this.dispatch('loading:start');
    return webapi
      .reject(rid, reason)
      .then(() => {
        this.init(rid);
      })
      .catch(() => {
        this.dispatch('loading:end');
      });
  };

  onDeliver = (rid: string, values) => {
    this.dispatch('loading:start');
    return webapi
      .deliver(rid, values)
      .then(() => {
        this.init(rid);
      })
      .catch(() => {
        this.dispatch('loading:end');
      });
  };

  onReceive = (rid: string) => {
    this.dispatch('loading:start');
    return webapi
      .receive(rid)
      .then(() => {
        this.init(rid);
      })
      .catch(() => {
        this.dispatch('loading:end');
      });
  };

  onRejectReceive = (rid: string, reason: string) => {
    this.dispatch('loading:start');
    return webapi.rejectReceive(rid, reason).then(() => {
      this.init(rid);
    }).catch(()=>{
      this.dispatch('loading:end');
    });
  };

  onRejectRefund = (rid: string, reason: string) => {
    this.dispatch('loading:start');
    return webapi.rejectRefund(rid, reason).then(() => {
      this.init(rid);
    }).catch(()=>{
      this.dispatch('loading:end');
    });
  };

  onOnlineRefund = (rid: string, formData: any) => {
    return webapi.refundOnline(rid, formData).then((result) => {
      const { res } = result;
      const code = res.code;
      const errorInfo = res.message;

      // 提示异常信息
      if (code != Const.SUCCESS_CODE) {
      } else {
        // 退款的回调是异步的，立刻刷新页面可能退单的状态还没有被回调修改。所以先给个提示信息，延迟3秒后再刷新列表
        message.success(RCi18n({id:'Order.OperateSuccessfully'}));
      }

      setTimeout(() => this.init(rid), 3000);
    });
  };

  onOfflineRefund = (rid: string, formData: any) => {
    return webapi.refundOffline(this.state().getIn(['detail', 'id']), formData).then((result) => {
      const { res } = result;
      const code = res.code;
      const errorInfo = res.message;
      // 提示异常信息
      if (code != Const.SUCCESS_CODE) {
        if (code === 'K-040017') {
          throw Error('K-040017');
        }
      } else {
        message.success(RCi18n({id:'Order.OperateSuccessfully'}));
      }
      this.init(rid);
    });
  };

  fetchRefundOrder = () => {
    webapi.fetchRefundOrdeById(this.state().getIn(['detail', 'id'])).then((res) => {
      const result = fromJS(res.res);
      this.dispatch('order-return-detail:refund-record', result.get('context'));
    });
  };

  onRefundDestroy = (refundId: string) => {
    webapi.destroyRefundOrder(refundId).then(() => {
      this.init(this.state().getIn(['detail', 'id']));
    });
  };

  /**
   * 校验退款单的状态，是否已经在退款处理中
   * @param {string} rid
   * @returns {Promise<IAsyncResult<any>>}
   */
  checkRefundStatus = async (rid: string) => {
    return await webapi.checkRefundStatus(rid);
  };

  onRealRefund = (rid: string,applyPrice) => {
    this.dispatch('loading:start');
    let refundPrice = this.state().get('refundPrice') || this.state().get('refundPrice').refundPrice ===0?this.state().get('refundPrice').refundPrice:applyPrice
    return webapi
      .realRefund(rid,refundPrice)
      .then(({ res }) => {
        if (res.code == Const.SUCCESS_CODE) {
          message.success(RCi18n({id:'Order.OperateSuccessfully'}));
          this.dispatch('change-refund-price', {
            refundPrice:null
          });
          this.init(rid);
        }
      })
      .catch(() => {
        this.dispatch('loading:end');
        this.dispatch('change-refund-price', {
          refundPrice:null
        });
      });
  };

  changeRefundPrice=(refundPrice:number)=>{
    this.dispatch('change-refund-price', {
      refundPrice
    });
  }
}
