import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class ImageActor extends Actor {
  defaultState() {
    return {
      modalVisible: false
    };
  }

  @Action('imageActor:setModalVisible')
  setModalVisible(state, visible) {
    return state.set('modalVisible', visible);
  }
}
