import { IOptions, Store } from 'plume2';
import { message } from 'antd';
import LoadingActor from './actor/loading-actor';
import ListActor from './actor/list-actor';
import FormActor from './actor/form-actor';
import TabActor from './actor/tab-actor';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import { cache, Const, history, RCi18n, util } from 'qmkit';

export default class AppStore extends Store {
  //btn加载
  btnLoading = false;

  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new LoadingActor(), new ListActor(), new FormActor(), new TabActor()];
  }

  /**
   * 页面初始化
   * @param pageNum
   * @param pageSize
   */
  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    this.dispatch('loading:start');
    //获取form数据
    let form = this.state().get('form').toJS();
    const key = this.state().getIn(['tab', 'key']);

    if (key != '0') {
      form['tradeState']['flowState'] = key;
    }
    form['orderType'] = form['orderType'] ? form['orderType'] : 'ALL_ORDER';

    webapi.fetchOrderList({ ...form, pageNum, pageSize }).then(({ res }) => {
      if (res.code == Const.SUCCESS_CODE) {
        res.context.content = this.handleOrderList(res.context.content, res.defaultLocalDateTime);
        this.transaction(() => {
          this.dispatch('loading:end');
          this.dispatch('list:init', res.context);
          this.dispatch('list:page', fromJS({ currentPage: pageNum + 1 }));
          this.dispatch(
            'list:defaultLocalDateTime',
            fromJS({ defaultLocalDateTime: res.defaultLocalDateTime })
          );
          this.btnLoading = false;
        });
      } else {
        this.dispatch('loading:end');
      }
    });
  };

  handleOrderList = (orderList, defaultLocalDateTime) => {
    return Array.from(orderList, (ele: any) => {
      const tradeState = ele.tradeState;
      if (ele.id == 'SITRCFJP000000822')
        console.log(
          1111111111111,
          ele.paymentItem,
          ele.paymentItem !== 'cod_japan' &&
            ele.paymentItem !== 'adyen_convenience_store' &&
            tradeState.payState === 'PAID',
          new Date(defaultLocalDateTime).getTime() < new Date(ele.orderCancelTimeOut).getTime() &&
            ((ele.paymentItem === 'cod_japan' && tradeState.flowState === 'PENDING_REVIEW') ||
              (ele.paymentItem !== 'cod_japan' &&
                ele.paymentItem !== 'adyen_convenience_store' &&
                tradeState.payState === 'PAID'))
        );
      return Object.assign(ele, {
        //只有未审核状态才显示修改
        canEdit:
          (tradeState.flowState === 'INIT' || tradeState.flowState === 'AUDIT') &&
          tradeState.payState === 'NOT_PAID' &&
          ele.tradeItems &&
          !ele.tradeItems[0]?.isFlashSaleGoods,
        //审核按钮显示
        showAuditBtn:
          tradeState.flowState === 'INIT' &&
          tradeState.auditState === 'NON_CHECKED' &&
          tradeState.payState === 'PAID' &&
          JSON.parse(sessionStorage.getItem(cache.EMPLOYEE_DATA))?.roleName?.indexOf(
            'Prescriber'
          ) !== -1,
        //驳回按钮显示
        showRejectBtn:
          tradeState.flowState === 'INIT' &&
          tradeState.auditState === 'NON_CHECKED' &&
          tradeState.payState === 'PAID' &&
          JSON.parse(sessionStorage.getItem(cache.EMPLOYEE_DATA))?.roleName?.indexOf(
            'Prescriber'
          ) !== -1,
        //待发货状态显示
        showToBeDeliverStatus:
          Const.SITE_NAME !== 'MYVETRECO' &&
          (tradeState.auditState === 'INSIDE_CHECKED' || tradeState.auditState === 'CHECKED') &&
          tradeState.flowState === 'AUDIT' &&
          tradeState.deliverStatus === 'NOT_YET_SHIPPED' &&
          tradeState.payState === 'PAID',
        //部分发货状态显示
        showPartShippedStatus:
          Const.SITE_NAME !== 'MYVETRECO' &&
          (tradeState.flowState === 'TO_BE_DELIVERED' ||
            tradeState.flowState === 'PARTIALLY_SHIPPED') &&
          (tradeState.deliverStatus === 'PART_SHIPPED' ||
            tradeState.deliverStatus === 'NOT_YET_SHIPPED') &&
          (tradeState.payState === 'PAID' || tradeState.payState === 'AUTHORIZED'),
        //人工审核按钮显示  isAuditOpen:订单审核方式 true:手动审核  false:自动审核
        showManualReviewBtn:
          ele.isAuditOpen &&
          (tradeState.flowState === 'PENDING_REVIEW' ||
            tradeState.flowState === 'TO_BE_DELIVERED') &&
          tradeState.auditState === 'NON_CHECKED',
        //下游审核按钮显示
        showDownstreamReviewBtn:
          tradeState.flowState === 'PENDING_REVIEW' && tradeState.auditState === 'INSIDE_CHECKED',
        //日本取消订单按钮显示
        showJpCancelOrderBtn:
          JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).storeId === 123457919 &&
          new Date(defaultLocalDateTime).getTime() < new Date(ele.orderCancelTimeOut).getTime() &&
          ((ele.paymentItem === 'cod_japan' && tradeState.flowState === 'PENDING_REVIEW') ||
            (ele.paymentItem !== 'cod_japan' &&
              ele.paymentItem !== 'adyen_convenience_store' &&
              ((tradeState.flowState == 'PENDING_REVIEW' && tradeState.payState == 'AUTHORIZED') ||
                (tradeState.flowState == 'TO_BE_DELIVERED' && tradeState.payState == 'PAID')) &&
              tradeState.flowState !== 'VOID'))
      });
    });
  };

  onTabChange = (key) => {
    this.dispatch('tab:init', key);
    this.init({ pageNum: 0, pageSize: 10 });
  };

  /**
   * 搜索
   * @param params
   */
  onSearch = (params) => {
    this.dispatch('form:clear');
    this.dispatch('form:field', params);
    this.init({ pageNum: 0, pageSize: 10 });
  };

  /**
   * 全选
   * @param checked
   */
  onCheckedAll = (checked: boolean) => {
    this.dispatch('list:checkedAll', checked);
  };

  /**
   * 单选
   * @param index
   * @param checked
   */
  onChecked = (index: number, checked: boolean) => {
    this.dispatch('list:check', {
      index,
      checked
    });
  };

  /**
   * 批量审核
   */
  onBatchAudit = async () => {
    const checkedIds = this.state()
      .get('dataList')
      .filter((v) => v.get('checked'))
      .map((v) => v.get('id'))
      .toJS();

    if (checkedIds.length == 0) {
      message.error('请选择需要操作的订单');
      return;
    }

    const { res } = await webapi.batchAudit(checkedIds);
    if (res.code == Const.SUCCESS_CODE) {
      message.success(RCi18n({ id: 'Order.OperateSuccessfully' }));
      //refresh
      this.init();
    } else {
      message.error('批量审核失败');
    }
  };

  onAudit = async (tid: string, audit: string, reason?: string) => {
    if (audit !== 'CHECKED') {
      if (!reason.trim()) {
        message.error('请填写驳回原因');
        return;
      }
    }

    if (!this.btnLoading) {
      this.btnLoading = true;
      //set loading true
      // this.dispatch('detail-actor:setButtonLoading', true)

      const { res } = await webapi.audit(tid, audit);
      this.hideRejectModal();
      if (res.code == Const.SUCCESS_CODE) {
        message.success(RCi18n({ id: 'Order.OperateSuccessfully' }));
        this.init();
      } else {
        message.error(res.message || (audit == 'CHECKED' ? '审核失败' : '驳回失败'));
        this.btnLoading = false;
        //set loading false
        // this.dispatch('detail-actor:setButtonLoading', false)
      }
    }
  };

  onValidateAudit = async (tid: string, audit, curOrderAuditType = '') => {
    this.dispatch('loading:start');
    let result = { code: '' };
    if (curOrderAuditType === 'ManualReview') {
      const { res } = await webapi.manualAudit(tid, audit);
      result = res;
    } else {
      const { res } = await webapi.audit(tid, audit);
      result = res;
    }
    if (result.code == Const.SUCCESS_CODE) {
      message.success(RCi18n({ id: 'Order.OperateSuccessfully' }));
      this.init();
    }
    this.dispatch('loading:end');
  };

  onRetrial = async (tid: string) => {
    const { res } = await webapi.retrial(tid);
    if (res.code == Const.SUCCESS_CODE) {
      this.init();
      message.success(RCi18n({ id: 'Order.OperateSuccessfully' }));
    }
  };

  /**
   * 确认收货
   */
  onConfirm = async (tid: string) => {
    this.dispatch('loading:start');
    const { res } = await webapi.confirm(tid);
    if (res.code == Const.SUCCESS_CODE) {
      //成功
      message.success(RCi18n({ id: 'Order.receipt' }));
      //刷新
      this.init();
    } else if (res.code == 'K-000001') {
      this.dispatch('loading:end');
      message.error('订单状态已改变，请刷新页面后重试!');
    }
  };

  /**
   * 发货前 验证订单是否存在售后申请
   * @param tid
   * @returns {Promise<void>}
   */
  onCheckReturn = async (tid: string) => {
    const { res } = await webapi.deliverVerify(tid);
    if (res.code === Const.SUCCESS_CODE) {
      history.push({
        pathname: `/order-detail/${tid}`,
        state: { tab: '2' }
      });
    }
  };

  /**
   * 隐藏导出modal
   */
  onExportModalHide = () => {
    this.dispatch('list:export-modal:hide');
  };

  /**
   * 线上导出modal
   * @param status
   */
  onExportModalChange = (status) => {
    this.dispatch('list:export-modal:change', fromJS(status));
  };

  /**
   * 按选中的编号导出
   * @returns {Promise<T>}
   */
  onExportByIds = () => {
    let selected = this.state()
      .get('dataList')
      .filter((v) => v.get('checked'))
      .map((v) => v.get('id'))
      .toJS();

    if (selected.length === 0) {
      message.error(RCi18n({ id: 'Order.exportedTip' }));
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }

    return this._onExport({ ids: selected });
  };

  /**
   * 按搜索条件导出
   * @returns {Promise<T>}
   */
  onExportByParams = () => {
    // 搜索条件
    let params = this.state().get('form').toJS();
    // tab
    const key = this.state().getIn(['tab', 'key']);
    if (key != '0') {
      const [state, value] = key.split('-');
      params['tradeState'][state] = value;
    }

    const total = this.state().get('total');
    if (total > 0) {
      return this._onExport(params);
    } else {
      message.error('当前搜索结果没有要导出的订单');
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }
  };

  _onExport = (params: {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 参数加密
        let base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          let result = JSON.stringify({ ...params, token: token });
          let encrypted = base64.urlEncode(result);

          // 新窗口下载
          const exportHref = Const.HOST + `/trade/export/params/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('请登录');
        }

        resolve(() => {});
      }, 500);
    });
  };

  /**
   * 证订单客户是否已刪除
   * @returns {Promise<void>}
   */
  verify = async (tid: string, buyerId: string) => {
    const { res } = await webapi.verifyBuyer(buyerId);
    if (res) {
      message.error(RCi18n({ id: 'Order.modifiedErr' }));
      return;
    } else {
      history.push('/order-edit/' + tid);
    }
  };

  /**
   * 显示驳回弹框
   */
  showRejectModal = () => {
    this.dispatch('order:list:reject:show');
  };

  showAuditModal = () => {
    this.dispatch('order:list:audit:show');
  };

  /**
   *关闭驳回弹框
   */
  hideRejectModal = () => {
    this.dispatch('order:list:reject:hide');
  };

  hideAuditModal = () => {
    this.dispatch('order:list:audit:hide');
  };
}
