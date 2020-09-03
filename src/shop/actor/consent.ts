import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';
import { IList } from 'typings/globalType';

export default class ModalActor extends Actor {
  defaultState() {
    return {
      loading: true,
      //列表
      consentList: [],
      //语言
      consentLanguage: [],
      //new consent
      consentForm: {
        languageTypeId: 'Spanish',
        consentCategory: 'Prescriber',
        filedType: 'Optional',
        consentPage: 'Landing page',
        consentId: '',
        consentCode: '',
        consentType: 'Email in',
        consentTitleType: '',
        consentTitle: '',
        consentDetailList: []
      }
    };
  }

  /**
   * 列表
   */
  @Action('consent:consentList')
  consentList(state: IMap, res) {
    return state.set('consentList', res);
  }

  //语言
  @Action('consent:consentLanguage')
  consentLanguage(state: IMap, res) {
    return state.set('consentLanguage', res);
  }

  //new
  @Action('consent:consentForm')
  consentForm(state: IMap, { field, value }) {
    return state.setIn(['consentForm', field], value);
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
