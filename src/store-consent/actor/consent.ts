import { Actor, Action, IMap } from 'plume2';
import { fromJS, Map } from 'immutable';

import { IList } from 'typings/globalType';

export default class ModalActor extends Actor {
  defaultState() {
    return {
      loading: true,
      //列表
      consentList: [],
      //语言
      consentLanguage: [],
      //category
      consentCategory: [],
      //new consent
      consentForm: {
        languageTypeId: '',
        consentCategory: 'Prescriber',
        filedType: 'Optional',
        consentPage: ['Landing page'].toString(),
        consentId: '',
        consentCode: '',
        consentType: 'Email in',
        consentTitleType: 'Content',
        consentTitle: '',
        consentDetailList: [],
        parentId: '',
        consentVersion: '',
        consentDesc: '',
        consentGroup: '',
        communicationType: '',
        pushOktaFlag: 0,
        sendEmailFlag: 0
      },
      pageChangeType: 'List',
      editList: {},
      detailList: [],
      editId: null,
      formEdit: [],
      selectedConsentIds: [],
      parentConsentList: []
    };
  }

  /**
   * 列表
   */
  @Action('consent:consentList')
  consentList(state: IMap, res) {
    return state.set('consentList', res);
  }

  @Action('consent:parentConsentList')
  parentConsentList(state: IMap, payload) {
    return state.set('parentConsentList', payload);
  }

  //语言
  @Action('consent:consentLanguage')
  consentLanguage(state: IMap, res) {
    return state.set('consentLanguage', res);
  }

  //category
  @Action('consent:consentCategory')
  consentCategory(state: IMap, res) {
    return state.set('consentCategory', res);
  }

  //new
  @Action('consent:consentForm')
  consentForm(state: IMap, res) {
    return state.set('consentForm', res);
  }
  /* consentForm(state: IMap, { field, value }) {
   return state.setIn(['consentForm', field], value);
 }*/

  @Action('consent:detailList')
  detailList(state: IMap, res) {
    return state.set('detailList', res);
  }

  //formEdit
  @Action('consent:formEdit')
  formEdit(state: IMap, res) {
    return state.set('formEdit', res);
  }

  //pageChangeType
  @Action('consent:pageChange')
  pageChange(state: IMap, res) {
    return state.set('pageChangeType', res);
  }

  //editList
  @Action('consent:editList')
  editList(state: IMap, res) {
    return state.set('editList', res);
  }

  @Action('consent:editId')
  editId(state: IMap, res) {
    return state.set('editId', res);
  }

  @Action('loading:start')
  start(state: IMap) {
    return state.set('loading', true);
  }

  @Action('loading:end')
  end(state: IMap) {
    return state.set('loading', false);
  }

  @Action('consent:setSelectedConsentIds')
  setSelectedConsentIds(state: IMap, ids) {
    return state.set('selectedConsentIds', ids);
  }
}
