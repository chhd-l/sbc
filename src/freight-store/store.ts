import { Store, IOptions } from 'plume2';

import { message } from 'antd';
import { fromJS } from 'immutable';
import { Const, history } from 'qmkit';

import FreightStoreActor from './actor/freight-store-actor';
import * as webapi from './webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new FreightStoreActor()];
  }

  /**
   * 初始化模板信息
   */
  init = async (freightId) => {
    const { res } = (await webapi.fetchFreightStore(freightId)) as any;
    const {
      freightTempName,
      destinationArea,
      destinationAreaName,
      freightType,
      satisfyPrice,
      satisfyFreight,
      fixedFreight,
      minimumDeliveryFee,
      defaultFlag,
      selectedAreas
    } = res.context;

    this.dispatch('freight: init', {
      freightTempName,
      destinationArea: fromJS(destinationArea.split(',')),
      destinationAreaName: fromJS(destinationAreaName.split(',')),
      freightType,
      satisfyPrice,
      satisfyFreight,
      fixedFreight,
      minimumDeliveryFee,
      defaultFlag,
      selectedAreas: fromJS(selectedAreas),
      freightTempId: freightId
    });
    this.getCountryCity();
  };

  /**
   * 查询已经被选中的区域Ids
   */
  fetchSelectedAreaIds = async () => {
    this.getCountryCity();
    const { res } = (await webapi.fetchSelectedAreaIds()) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('freight: store: field: value', {
        field: 'selectedAreas',
        value: fromJS(res.context)
      });
    }
  };

  /**
   * 存储区域Id
   */
  areaIdsSave = (ids, labels) => {
    this.transaction(() => {
      this.dispatch('freight: store: field: value', {
        field: 'destinationArea',
        value: fromJS(ids)
      });
      this.dispatch('freight: store: field: value', {
        field: 'destinationAreaName',
        value: fromJS(labels)
      });
    });
  };

  /**
   * 店铺模板根据字段修改值
   *
   * @memberof AppStore
   */
  storeFreightFieldsValue = ({ field, value }) => {
    this.dispatch('freight: store: field: value', { field, value });
  };

  /**
   * 保存运费模板
   */
  saveStoreFreight = async () => {
    let request = this.state().toJS();
    const { freightType, freightTempId } = request;
    if (freightType == 0) {
      request.fixedFreight = null;
    } else {
      request.satisfyPrice = null;
      request.satisfyFreight = null;
    }
    if (!freightTempId) {
      request.freightTempId = null;
    }
    const { res } = (await webapi.freightStoreSave(request)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('save successful');
      history.push({
        pathname: '/freight',
        state: { tab: 0 }
      });
    } else {
      message.error(res.message);
    }
  };

  getCountryCity = async () => {
    debugger;
    const country = (await webapi.querySysDictionary({
      type: 'country'
    })) as any;
    const city = (await webapi.querySysDictionary({
      type: 'city'
    })) as any;
  };
}
