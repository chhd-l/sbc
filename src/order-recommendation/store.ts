import { IOptions, Store } from 'plume2';
import { message } from 'antd';
import LoadingActor from './actor/loading-actor';
import ListActor from './actor/list-actor';
import FormActor from './actor/form-actor';
import TabActor from './actor/tab-actor';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import { Const, history, util } from 'qmkit';

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
    return [
      new LoadingActor(),
      new ListActor(),
      new FormActor(),
      new TabActor()
    ];
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
      const [state, value] = key.split('-');
      form['tradeState'][state] = value;
    }
    form['orderType'] = 'NORMAL_ORDER';
    const { res: needRes } = await webapi.getOrderNeedAudit();
    if (needRes.code == Const.SUCCESS_CODE) {
      webapi.fetchOrderList({ ...form, pageNum, pageSize }).then(({ res }) => {
        if (res.code == Const.SUCCESS_CODE) {
          this.transaction(() => {
            this.dispatch('loading:end');
            this.dispatch('list:init', res.context);
            this.dispatch('list:page', fromJS({ currentPage: pageNum + 1 }));
            this.btnLoading = false;
          });
        } else {
          message.error(res.message);
          if (res.code === 'K-110001') {
            this.dispatch('loading:end');
          }
        }
      });
    }
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
}
