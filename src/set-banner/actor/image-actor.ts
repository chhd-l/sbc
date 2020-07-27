import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class ImageActor extends Actor {
  defaultState() {
    return {
      modalVisible: false,
      bannerNoList: [1, 2, 3, 4, 5],
      imageForm: {
        bannerId: null,
        bannerName: '',
        bannerNo: null
      }
    };
  }

  @Action('imageActor:setModalVisible')
  setModalVisible(state, visible) {
    return state.set('modalVisible', visible);
  }

  @Action('imageActor:setBannerName')
  setBannerName(state, bannerName) {
    return state.setIn(['imageForm', 'bannerName'], bannerName);
  }
  @Action('imageActor:bannerNo')
  bannerNo(state, bannerNo) {
    return state.setIn(['imageForm', 'bannerNo'], bannerNo);
  }

  @Action('imageActor:filed')
  setBannerId(state, { bannerId }) {
    return state.setIn(['imageForm', 'bannerId'], bannerId);
  }

  @Action('imageActor:bannerNoList')
  bannerNoList(state, bannerNoList) {
    return state.set('bannerNoList', bannerNoList);
  }

  @Action('imageActor:field')
  changeField(state: IMap, { field, value }) {
    return state.setIn(['imageForm', field], value);
  }
}
