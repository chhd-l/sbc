import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class ImageActor extends Actor {
  defaultState() {
    return {
      modalVisible: false
      // imageForm: {
      //   bannerName: ''
      // }
    };
  }

  @Action('imageActor:setModalVisible')
  setModalVisible(state, visible) {
    return state.set('modalVisible', visible);
  }

  // @Action('imageActor:setBannerName')
  // setBannerName(state, bannerName) {
  //   return state.setIn(['form','bannerName'], bannerName);
  // }
}
