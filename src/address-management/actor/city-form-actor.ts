import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class CityFormActor extends Actor {
  defaultState() {
    return {
      cityModalVisible: false,
      isEdit: false,
      stateNameList: [],
      cityForm: {
        country: '',
        state: '',
        city: '',
        postCodeArr: [
          {
            value: new Date().getTime(),
            preCode: '',
            suffCode: ''
          }
        ]
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
      country: JSON.parse(sessionStorage.getItem('currentCountry')).name,
      state: '',
      city: '',
      postCodeArr: [
        {
          value: new Date().getTime(),
          preCode: '',
          suffCode: ''
        }
      ]
    };
    return state.set('cityForm', fromJS(cityForm));
  }
  @Action('CityFormActor:field')
  changeField(state: IMap, { field, value }) {
    return state.setIn(['cityForm', field], value);
  }

  @Action('CityFormActor:stateNameList')
  stateNameList(state, stateNameList) {
    return state.set('stateNameList', stateNameList);
  }
}
