import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class ImageActor extends Actor {
  defaultState() {
    return {
      modalVisible: false,
      isEdit: false,
      bannerNoList: [1, 2, 3, 4, 5],
      // fileList: [],
      // mFileList: [],
      imageForm: {
        bannerId: null,
        bannerName: '',
        bannerNo: null,
        webUrl: '',
        mobiUrl: '',
        webSkipUrl: '',
        mobiSkipUrl: '',
        webUuid: 0,
        mobiUuid: 0,
        webImgName: '',
        mobiImgName: '',
        fileList: [],
        mFileList: []
      }
    };
  }

  @Action('imageActor:setModalVisible')
  setModalVisible(state, visible) {
    return state.set('modalVisible', visible);
  }
  @Action('imageActor:setIsEdit')
  setIsEdit(state, isEdit) {
    return state.set('isEdit', isEdit);
  }

  @Action('imageActor:bannerNoList')
  bannerNoList(state, bannerNoList) {
    return state.set('bannerNoList', bannerNoList);
  }

  @Action('imageActor:field')
  changeField(state: IMap, { field, value }) {
    return state.setIn(['imageForm', field], value);
  }
  @Action('imageActor:setMFileList')
  setMFileList(state, mFileList) {
    return state.set('mFileList', mFileList);
  }
  @Action('imageActor:setFileList')
  setFileList(state, fileList) {
    return state.set('fileList', fileList);
  }

  @Action('imageActor:resetForm')
  resetForm(state: IMap) {
    const imageForm = {
      bannerId: null,
      bannerName: '',
      bannerNo: null,
      webSkipUrl: '',
      mobiSkipUrl: '',
      webUuid: 0,
      mobiUuid: 0
    };
    return state.set('imageForm', fromJS(imageForm));
  }
}
