import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class FormActor extends Actor {
  defaultState() {
    return {
      modalVisible: false,//company-modal
      isEdit: false,
      companyForm: {status:false},
      saveLoading: false,

      settingModalVisible: false, //setting-modal
      settingForm: {"id":'',"headerToken":"","userName":"","outUrl":"","lang":""},
      saveSettingLoading: false,
    };
  }


  @Action('formActor:field')
  setFeild(state, { field, value }) {
    return state.set(field, value);
  }


  //company-modal
  @Action('formActor:formField')
  changeField(state: IMap, { field, value }) {
    return state.setIn(['companyForm', field], value);
  }

  @Action('formActor:form')
  companyForm(state: IMap, form) {
    return state.set('companyForm', fromJS(form));
  }


  //setting-modal
  @Action('formActor:settingFormField')
  settingFormField(state: IMap, { field, value }) {
    return state.setIn(['settingForm', field], value);
  }

  @Action('formActor:settingForm')
  settingForm(state: IMap, form) {
    return state.set('settingForm', fromJS(form));
  }

}
