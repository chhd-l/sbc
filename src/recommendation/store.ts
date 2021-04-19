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
    return [new LoadingActor(), new ListActor(), new FormActor(), new TabActor()];
  }

  /**
   * 页面初始化
   * @param pageNum
   * @param pageSize
   */
  init = async ({ pageNum, pageSize,...result } = { pageNum: 0, pageSize: 10 }) => {
    this.dispatch('loading:start');

    webapi.fetchOrderList({  ...result, pageNum, pageSize }).then(({ res }) => {
      if (res.code == Const.SUCCESS_CODE) {
        this.transaction(() => {
          this.dispatch('loading:end');
          this.dispatch('list:init', res.context.microPage);
          this.dispatch('list:page', fromJS({ currentPage: pageNum + 1 }));
          this.btnLoading = false;
        });
      } else {
        this.dispatch('loading:end');
      }
    });
  };

  //详情
  /*onFindById = async (param?: any) => {
    const res = await webapi.fetchFindById(param);
    if (res.res.code === Const.SUCCESS_CODE) {
      //this.dispatch('get:getDetail', res.res.context);
      history.push({
        pathname: '/recomm-page-detail',
        state: state
      });
    } else {
      message.error(res.res.message);
      if (res.res.code === 'K-110001') {
        message.success('send failed!');
        return false;
      }
    }
  };*/

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
    this.init({ pageNum: 0, pageSize: 10,...params });
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
}
