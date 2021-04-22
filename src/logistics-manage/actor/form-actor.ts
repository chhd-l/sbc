import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class FormActor extends Actor {
  defaultState() {
    return {
      modalVisible: false,
      isEdit: false,
      companyForm: {
        status: 1
      },
      saveLoading: false,
    };
  }

  @Action('formActor:field')
  setFeild(state, { field, value }) {
    return state.set(field, value);
  }
  @Action('formActor:formField')
  changeField(state: IMap, { field, value }) {
    return state.setIn(['companyForm', field], value);
  }
  @Action('formActor:form')
  changeImageForm(state: IMap, form) {
    return state.set('companyForm', fromJS(form));
  }
}
