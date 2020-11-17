import { IOptions, Store, ViewAction } from 'plume2';
import { message, Modal } from 'antd';
import LoadingActor from './actor/loading-actor';
import SeoActor from './actor/seo-actor';
import ImageActor from './actor/image-actor';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import { cache, Const, history, util } from 'qmkit';
import { getEquitiesList } from '@/role-list/webapi';

const confirm = Modal.confirm;
export default class AppStore extends Store {
  //btn加载
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new LoadingActor(), new SeoActor()];
  }
  updateSeoForm = ({ field, value }) => {
    this.dispatch('seoActor: seoForm', { field, value });
  };

  getContent = async () => {
    const { res } = (await webapi.getContent()) as any;
    if (res && res.code === Const.SUCCESS_CODE && res.context.siteMapVO) {
      this.updateSeoForm({
        field: 'content',
        value: res.context.siteMapVO.content
      });
    }
  };
  save = async (params) => {
    const res = await webapi.save(params);
  };
}
