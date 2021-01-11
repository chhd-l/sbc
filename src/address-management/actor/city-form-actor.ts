import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class CityFormActor extends Actor {
  defaultState() {
    return {
      cityModalVisible: false,
      isEdit: false,
      cityForm: {
        country: null,
        state: null,
        city: null,
        postCode: null
      }
    };
  }

  @Action('CityFormActor:setModalVisible')
  setModalVisible(state, visible) {
    return state.set('cityModalVisible', visible);
  }
  @Action('CityFormActor:setIsEdit')
  setIsEdit(state, isEdit) {
    return state.set('isEdit', isEdit);
  }

  @Action('CityFormActor:cityForm')
  changeImageForm(state: IMap, cityForm) {
    return state.set('cityForm', fromJS(cityForm));
  }

  @Action('CityFormActor:resetForm')
  resetForm(state: IMap) {
    const cityForm = {
      country: '',
      state: '',
      city: '',
      postCode: ''
    };
    return state.set('cityForm', fromJS(cityForm));
  }
  @Action('CityFormActor:field')
  changeField(state: IMap, { field, value }) {
    return state.setIn(['stateForm', field], value);
  }
}
