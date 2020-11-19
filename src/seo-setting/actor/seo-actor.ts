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
      pageForm: {
        title: '',
        metaKeywords: '',
        description: ''
      },
      seoModalVisible: false,
      currentTab: 'siteSeo',
      currentPage: '',
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

  @Action('seoActor: allPages')
  changeSEOPages(state, allPages) {
    return state.set('allPages', allPages);
  }
}