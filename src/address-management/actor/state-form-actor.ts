import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class StateFormActor extends Actor {
  defaultState() {
    return {
      modalVisible: false,
      isEdit: false,
      stateForm: {
        id: null,
        country: '',
        state: '',
        abbreviation: '',
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

  @Action('StateFormActor:setModalVisible')
  setModalVisible(state, visible) {
    return state.set('modalVisible', visible);
  }
  @Action('StateFormActor:setIsEdit')
  setIsEdit(state, isEdit) {
    return state.set('isEdit', isEdit);
  }

  @Action('StateFormActor:stateForm')
  changeImageForm(state: IMap, stateForm) {
    return state.set('stateForm', fromJS(stateForm));
  }

  @Action('StateFormActor:resetForm')
  resetForm(state: IMap) {
    const stateForm = {
      id: null,
      country: JSON.parse(sessionStorage.getItem('currentCountry')).name,
      state: '',
      postCodeArr: [
        {
          value: new Date().getTime(),
          preCode: '',
          suffCode: ''
        }
      ]
    };
    return state.set('stateForm', fromJS(stateForm));
  }
  @Action('StateFormActor:field')
  changeField(state: IMap, { field, value }) {
    return state.setIn(['stateForm', field], value);
  }
}
