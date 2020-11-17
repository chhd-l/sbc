import { Actor, Action, IMap } from 'plume2';

export default class SeoActor extends Actor {
  defaultState() {
    return {
      seoForm: {
        content: ''
      }
    };
  }

  //seo
  @Action('seoActor: seoForm')
  updateSeoForm(state: IMap, { field, value }) {
    return state.setIn(['seoForm', field], value);
  }
}
