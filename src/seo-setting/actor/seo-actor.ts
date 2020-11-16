import { Actor, Action, IMap } from 'plume2';

export default class SeoActor extends Actor {
  defaultState() {
    return {
      seoForm: {
        title: '',
        metaKeywords: '',
        description: ''
      },
      seoModalVisible: false
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
}
