import { Store, IOptions } from 'plume2';

import { message, Modal } from 'antd';
import { fromJS } from 'immutable';
import { Const, history } from 'qmkit';

import ListActor from './actor/list-actor';
import * as webapi from './webapi';

const confirm = Modal.confirm;

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new ListActor()];
  }

  /**
   * 查询service fee列表
   */
  initList = async () => {
    this.dispatch('loading:start');
    const { res } = await webapi.fetchAllServiceFeeTemplate();
    this.dispatch('list:table', res.context ? res.context : []);
    this.dispatch('loading:end');
  };

  /**
   * 删除
   * @param record
   */
  deleteRow = async (record) => {
    await webapi.deleteServiceFeeRow({ id: record.id });
  };

  startLoading = () => {
    this.dispatch('loading:start');
  };
  endLoading = () => {
    this.dispatch('loading:end');
  };
}
