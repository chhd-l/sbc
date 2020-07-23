import { IOptions, Store, ViewAction } from 'plume2';
import { message } from 'antd';
import LoadingActor from './actor/loading-actor';
import ListActor from './actor/list-actor';
import ImageActor from './actor/image-actor';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import { Const, history, util } from 'qmkit';

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
    const res = await webapi.deleteRow(params);
  };

  editRow = async (params) => {
    const res = await webapi.editRow(params);
  };

  getList = async (params) => {
    debugger;
    this.dispatch('loading:start');
    // const res = await webapi.getList(params)
    const list = [
      {
        id: 1,
        pcName: 'test.png',
        mobileName: 'test.mp4',
        pcImage:
          'https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202004291813187993.png',
        mobileImage:
          'https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202004291813187993.png'
      },
      {
        id: 2,
        pcName: 'ddd.mp4',
        mobileName: 'ddd.mp4',
        pcImage:
          'https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/201912042220517874.mp4',
        mobileImage:
          'https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/201912042220517874.mp4'
      },
      {
        id: 3,
        pcName: '123.mp4',
        mobileName: '123.mp4',
        pcImage:
          'https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/201912042220517874.mp4',
        mobileImage:
          'https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/201912042220517874.mp4'
      }
    ];
    this.dispatch('list:setCurrentPage', 2);
    this.dispatch('list:setTotalPages', 3);
    this.dispatch('list:getList', fromJS(list));
    setTimeout(() => {
      this.dispatch('loading:end');
    }, 3000);
    // if(res) {
    // } else {
    //   this.dispatch('loading:end')
    // }
  };

  // setBannerName = (bannerName) => {
  //   debugger
  //   this.dispatch('imageActor:setBannerName', bannerName)
  // }
}
