import {IOptions, Store, ViewAction} from 'plume2';
import {message, Modal} from 'antd';
import LoadingActor from './actor/loading-actor';
import SeoActor from './actor/seo-actor';
import ImageActor from './actor/image-actor';
import * as webapi from './webapi';
import {fromJS} from 'immutable';
import {cache, Const, history, util} from 'qmkit';
import moment from 'moment';

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

  updateSeoForm = ({field, value}) => {
    this.dispatch('seoActor: seoForm', {field, value});
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
    this.dispatch('loading:start');
    const {res} = (await webapi.getSeo(type, pageName)) as any;
    if (res.code === Const.SUCCESS_CODE && res.context && res.context.seoSettingVO) {
      this.dispatch('loading:end');
      //console.log(momnet(res.context.seoSettingVO.priorityStartTime),2222222);
      let priorityStartTime = moment(res.context.seoSettingVO.priorityStartTime != null? res.context.seoSettingVO.priorityStartTime: new Date(), 'YYYY-MM-DD')
      let priorityEndTime = moment(res.context.seoSettingVO.priorityEndTime != null? res.context.seoSettingVO.priorityEndTime : new Date(), 'YYYY-MM-DD')
      this.dispatch(
        'seoActor: setSeoForm',
        fromJS({
          title: res.context.seoSettingVO.titleSource,
          metaKeywords: res.context.seoSettingVO.metaKeywordsSource,
          description: res.context.seoSettingVO.metaDescriptionSource,
          priorityFlag: res.context.seoSettingVO.priorityFlag != null ? res.context.seoSettingVO.priorityFlag : 0,
          priorityTime: [priorityStartTime, priorityEndTime],
        })
      );
    } else {
      this.dispatch('loading:end');
    }
  };
  clear = () => {
    this.dispatch('seoActor: clear');
  };
  editSeo = async (params, type = null) => {
    this.dispatch('loading:start');
    const {res} = (await webapi.editSeo(params)) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('loading:end');
      message.success('Save successfully.');
      if (type === 1) {
        this.setSeoModalVisible(false);
      }
    } else {
      this.dispatch('loading:end');
      message.error('Save Error.');
    }
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
    const {res} = (await webapi.getPages({
      pageNum,
      pageSize,
      type: 'pageType'
    })) as any;
    if (res.code === Const.SUCCESS_CODE && res.context && res.context.sysDictionaryPage.content) {
      const pages = res.context.sysDictionaryPage.content;
      this.dispatch('loading:end');
      this.dispatch('seoActor: allPages', fromJS(pages));
      this.dispatch('seoActor: pageNum', res.context.sysDictionaryPage.number + 1);
      this.dispatch('seoActor: total', res.context.sysDictionaryPage.totalElements);
    }
  };
}
