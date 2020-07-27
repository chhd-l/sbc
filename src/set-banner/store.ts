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
      this.dispatch('imageActor:setBannerName', res.context[0].bannerName);
    } else {
      message.error(res.message);
    }
  };

  editBanner = async (params) => {
    const { res } = await webapi.editRow(params);
    if (res.code === Const.SUCCESS_CODE) {
    } else {
      message.error(res.message);
    }
  };
  uploadBanner = async (params) => {
    const { res } = await webapi.uploadBanner(params);
    const ref = this;
    if (res.code === Const.SUCCESS_CODE) {
      // confirm({
      //   title: 'Tip',
      //   content: '是否继续添加banner',
      //   onOk() {
      //     ref.setBannerName('')
      //   },
      //   onCancel() {
      //     debugger
      //     ref.setModalVisible(false);
      //     ref.getList({ storeId: this.getStoreId() });
      //   },
      //   okText: 'OK',
      //   cancelText: 'Cancel'
      // });
    } else {
      message.error(res.message);
    }
  };
  getStoreId = () => {
    const { storeId } = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
    return storeId;
  };

  setBannerId = (bannerId) => {
    this.dispatch('imageActor:setBannerId', bannerId);
  };
  setBannerName = (bannerName) => {
    this.dispatch('imageActor:setBannerName', bannerName);
  };

  onImageFormChange = ({ field, value }) => {
    this.dispatch('imageActor:field', { field, value });
  };
}
