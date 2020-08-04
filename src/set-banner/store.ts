import { IOptions, Store, ViewAction } from 'plume2';
import { message, Modal } from 'antd';
import LoadingActor from './actor/loading-actor';
import ListActor from './actor/list-actor';
import ImageActor from './actor/image-actor';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import { cache, Const, history, util } from 'qmkit';

const confirm = Modal.confirm;
export default class AppStore extends Store {
  //btn加载
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new LoadingActor(), new ListActor(), new ImageActor()];
  }

  setModalVisible = async (visible) => {
    this.dispatch('imageActor:setModalVisible', visible);
  };
  onFormChange = ({ field, value }) => {
    this.dispatch('list:changeFormField', { field, value });
  };
  onSearch = (params) => {
    this.getList(params);
  };
  deleteRow = async (params) => {
    this.dispatch('loading:start');
    const { res } = await webapi.deleteRow(params);
    this.dispatch('loading:end');
    if (res.code === Const.SUCCESS_CODE) {
      this.getList({ storeId: this.getStoreId() });
    } else {
      message.error(res.message);
    }
  };

  editRow = async (params) => {
    const res = await webapi.editRow(params);
  };

  getList = async (params) => {
    this.dispatch('loading:start');
    const { res } = await webapi.getList(params);
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('loading:end');
      this.dispatch('list:getList', fromJS(res.context));
    } else {
      message.error(res.message);
    }
  };
  getBannerById = async (params) => {
    const { res } = await webapi.getList(params);
    if (res.code === Const.SUCCESS_CODE) {
      this.onImageFormChange({
        field: 'bannerId',
        value: res.context[0].bannerId
      });
      this.onImageFormChange({
        field: 'bannerName',
        value: res.context[0].bannerName
      });
      this.onImageFormChange({
        field: 'bannerNo',
        value: res.context[0].bannerNo
      });
      this.onImageFormChange({
        field: 'webUrl',
        value: res.context[0].webUrl
      });
      this.onImageFormChange({
        field: 'mobiUrl',
        value: res.context[0].mobiUrl
      });
      this.onImageFormChange({
        field: 'webSkipUrl',
        value: res.context[0].webSkipUrl
      });
      this.onImageFormChange({
        field: 'mobiSkipUrl',
        value: res.context[0].mobiSkipUrl
      });
      this.onImageFormChange({
        field: 'webUuid',
        value: res.context[0].webUuid
      });
      this.onImageFormChange({
        field: 'mobiUuid',
        value: res.context[0].mobiUuid
      });
      this.onImageFormChange({
        field: 'webImgName',
        value: res.context[0].webImgName
      });
      this.onImageFormChange({
        field: 'mobiImgName',
        value: res.context[0].mobiImgName
      });

      const fileList = [
        {
          name: res.context[0].webImgName,
          percent: 100,
          response: [res.context[0].webUrl],
          status: 'done',
          type: 'image/jpg',
          uid: res.context[0].webUuid
        }
      ];
      this.onImageFormChange({
        field: 'fileList',
        value: fileList
      });

      const mFileList = [
        {
          name: res.context[0].mobiImgName,
          percent: 100,
          response: [res.context[0].mobiUrl],
          status: 'done',
          type: 'image/jpg',
          uid: res.context[0].mobiUuid
        }
      ];
      this.onImageFormChange({
        field: 'mFileList',
        value: mFileList
      });
    } else {
      message.error(res.message);
    }
  };

  editBanner = async (params) => {
    const { res } = await webapi.editRow(params);
    if (res.code === Const.SUCCESS_CODE) {
      this.setModalVisible(false);
      this.getList({ storeId: this.getStoreId() });
      message.success('Edit successfully.');
    } else {
      message.error(res.message);
    }
  };
  uploadBanner = async (params) => {
    const { res } = await webapi.uploadBanner(params);
    const ref = this;
    if (res.code === Const.SUCCESS_CODE) {
      return res;
    } else {
      message.error(res.message);
      return -1;
    }
  };
  getStoreId = () => {
    const { storeId } = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
    return storeId;
  };

  onImageFormChange = ({ field, value }) => {
    this.dispatch('imageActor:field', { field, value });
  };

  resetForm = () => {
    this.dispatch('imageActor:resetForm');
  };

  setIsEdit = (isEdit) => {
    this.dispatch('imageActor:setIsEdit', isEdit);
  };
  // setFileList = (list) => {
  //   this.dispatch('imageActor:setFileList', list);
  // };
  // setMFileList = (list) => {
  //   this.dispatch('imageActor:setMFileList', list);
  // };

  setList = (list) => {
    this.dispatch('imageActor:list', list);
  };
}
