import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class CityFormActor extends Actor {
  defaultState() {
    return {
      cityModalVisible: false,
      isEdit: false,
      stateNameList: [
        { value: 'China', name: 'China' },
        { value: 'China1', name: 'China1' }
      ],
      cityForm: {
        country: 'United States',
        state: '',
        city: '',
        postCodeArr: [
          {
            id: new Date().getTime(),
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
      country: 'United States',
      state: '',
      city: '',
      postCodeArr: [
        {
          id: new Date().getTime(),
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
}
