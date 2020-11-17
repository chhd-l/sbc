import { IOptions, Store, ViewAction } from 'plume2';
import { message, Modal } from 'antd';
import LoadingActor from './actor/loading-actor';
import SeoActor from './actor/seo-actor';
import ImageActor from './actor/image-actor';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import { cache, Const, history, util } from 'qmkit';

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
  setSeoModalVisible = (visible) => {
    this.dispatch('seoActor: seoModal', visible);
  };
  changeTab = (tab) => {
    this.dispatch('seoActor: currentTab', tab);
    if (tab === 'siteSeo') {
      this.getSeo(4);
    } else {
      this.getPages();
    }
  };
  getSeo = async (type, pageName = null) => {
    this.clear();
    if (pageName) {
      this.changeCurrentPage(pageName);
      this.setSeoModalVisible(true);
    }
    const { res } = (await webapi.getSeo(type, pageName)) as any;
    if (res.code === Const.SUCCESS_CODE && res.context && res.context.seoSettingVO) {
      this.dispatch(
        'seoActor: setSeoForm',
        fromJS({
          title: res.context.seoSettingVO.titleSource,
          metaKeywords: res.context.seoSettingVO.metaKeywordsSource,
          description: res.context.seoSettingVO.metaDescriptionSource
        })
      );
    }
  };
  clear = () => {
    this.dispatch('seoActor: clear');
  };
  editSeo = async (params) => {
    const res = await webapi.editSeo(params);
  };
  addSeo = async (params) => {
    const res = await webapi.addSeo(params);
    this.setSeoModalVisible(false);
  };

  changeCurrentPage = (currentPage) => {
    this.dispatch('seoActor: currentPage', currentPage);
  };

  getPages = async (pageNum = 0, pageSize = 10) => {
    this.dispatch('loading:start');
    const { res } = (await webapi.getPages({
      pageNum,
      pageSize,
      type: 'pageType'
    })) as any;
    if (res.code === Const.SUCCESS_CODE && res.context && res.context.sysDictionaryPage.content) {
      const pages = res.context.sysDictionaryPage.content;
      this.dispatch('loading:end');
      this.dispatch('seoActor: allPages', fromJS(pages));
    }
  };
}
