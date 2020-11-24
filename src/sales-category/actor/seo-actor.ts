import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class SeoActor extends Actor {
  defaultState() {
    return {
      seoForm: {
        titleSource: '{name}',
        metaKeywordsSource: '{name}',
        metaDescriptionSource: '{description}'
      },
      seoModalVisible: false,
      currentStoreCateId: null,
      loading: false
    };
  }

  @Action('seoActor: seoModal')
  setSeoModalVisible(state, seoModalVisible) {
    return state.set('seoModalVisible', seoModalVisible);
  }

  //seo
  @Action('seoActor: seoForm')
  updateSeoForm(state: IMap, { field, value }) {
    return state.setIn(['seoForm', field], value);
  }

  @Action('seoActor: setSeoForm')
  setSeoForm(state: IMap, form) {
    return state.set('seoForm', form);
  }
  @Action('seoActor: currentStoreCateId')
  setCurrentStoreCateId(state: IMap, currentStoreCateId) {
    return state.set('currentStoreCateId', currentStoreCateId);
  }

  @Action('seoActor: clear')
  clear(state) {
    return state.set(
      'seoForm',
      fromJS({
        titleSource: '{name}',
        metaKeywordsSource: '{name}',
        metaDescriptionSource: '{description}'
      })
    );
  }

  @Action('loading:start')
  start(state: IMap) {
    return state.set('loading', true);
  }

  @Action('loading:end')
  end(state: IMap) {
    return state.set('loading', false);
  }
}
