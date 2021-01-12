import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class StateFormActor extends Actor {
  defaultState() {
    return {
      modalVisible: false,
      isEdit: false,
      stateForm: {
        country: 'United States',
        state: '',
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
      country: 'United States',
      state: '',
      postCodeArr: [
        {
          id: new Date().getTime(),
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
