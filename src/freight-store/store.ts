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
  };

  /**
   * 查询已经被选中的区域Ids
   */
  fetchSelectedAreaIds = async () => {
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
    const country = (await webapi.querySysDictionary({
      type: 'country'
    })) as any;

    const city = (await webapi.querySysDictionary({
      type: 'city'
    })) as any;

    if (
      city.res.code === Const.SUCCESS_CODE &&
      country.res.code === Const.SUCCESS_CODE
    ) {
      let countryList = country.res.context.sysDictionaryVOS
        ? country.res.context.sysDictionaryVOS
        : [];
      let cityList = city.res.context.sysDictionaryVOS
        ? city.res.context.sysDictionaryVOS
        : [];
      let treeNode = this.treeDataSource(countryList, cityList);
      this.dispatch('freight: store: field: value', {
        field: 'treeNode',
        value: fromJS(treeNode)
      });
    }
  };
  treeDataSource = (parent, children) => {
    let parentNodes = [];
    let childrenNodes = [];
    if (parent && parent.length > 0) {
      for (let i = 0; i < parent.length; i++) {
        let parentNode = {
          title: parent[i].name,
          value: parent[i].id,
          key: parent[i].id,
          children: []
        };
        parentNodes.push(parentNode);
      }
    }
    if (children && children.length > 0) {
      for (let i = 0; i < children.length; i++) {
        let childrenNode = {
          title: children[i].name,
          value: children[i].id,
          key: children[i].id
        };
        childrenNodes.push(childrenNode);
      }
    }
    if (parentNodes.length > 0) {
      parentNodes[0].children = childrenNodes;
    }
    return parentNodes;
  };
}
