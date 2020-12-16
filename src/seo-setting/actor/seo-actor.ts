import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class SeoActor extends Actor {
  defaultState() {
    return {
      seoForm: {
        title: '',
        metaKeywords: '',
        description: ''
      },
      seoModalVisible: false,
      currentTab: 'siteSeo',
      currentPage: '',
      pageNum: 1, //当前页数
      total: 1, //总数
      allPages: []
    };
  }

  @Action('seoActor: seoModal')
  setSeoModalVisible(state, seoModalVisible) {
    return state.set('seoModalVisible', seoModalVisible);
  }
  @Action('seoActor: clear')
  clear(state) {
    return state.set(
      'seoForm',
      fromJS({
        title: '',
        metaKeywords: '',
        description: ''
      })
    );
  }
  @Action('seoActor: setSeoForm')
  setSeoForm(state: IMap, form) {
    return state.set('seoForm', form);
  }

  @Action('seoActor: seoForm')
  updateSeoForm(state: IMap, { field, value }) {
    return state.setIn(['seoForm', field], value);
  }
  @Action('seoActor: currentTab')
  changeTab(state, tab) {
    return state.set('currentTab', tab);
  }

  @Action('seoActor: currentPage')
  changeCurrentPage(state, currentPage) {
    return state.set('currentPage', currentPage);
  }
  @Action('seoActor: pageNum')
  changePageNum(state, pageNum) {
    return state.set('pageNum', pageNum);
  }
  @Action('seoActor: total')
  changeTotalPages(state, total) {
    return state.set('total', total);
  }
  @Action('seoActor: allPages')
  changeSEOPages(state, allPages) {
    return state.set('allPages', allPages);
  }
}
