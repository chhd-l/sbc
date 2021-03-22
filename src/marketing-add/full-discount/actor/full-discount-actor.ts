/**
 * Created by hht on 2018/2/28.
 */
import { Action, Actor, IMap } from 'plume2';
import { fromJS } from 'immutable';
import { IList } from '../../../../typings/globalType';

export default class FullDiscountActor extends Actor {
  defaultState() {
    return {
      marketingBean: {},
      allGroups: [],
      // 店铺分类信息
      storeCateList: [],
      sourceStoreCateList: [],

      //Attribute
      attributesList: []
    };
  }

  constructor() {
    super();
  }

  @Action('marketing:discountBean')
  getDiscountBean(state: IMap, res) {
    const bean = fromJS(res).set(
      'fullDiscountLevelList',
      fromJS(res)
        .get('fullDiscountLevelList')
        .map((item) => item.set('discount', (item.get('discount') * 10).toFixed(1)))
    );
    return state.set('marketingBean', bean);
  }

  @Action('marketing:allGroups')
  getAllGroups(state, allGroups) {
    return state.set('allGroups', fromJS(allGroups));
  }

  @Action('marketing:attributesList')
  getAllAttributesList(state, attributesList) {
    return state.set('attributesList', fromJS(attributesList));
  }

  /**
   * 初始化店铺分类
   * @param state
   * @param dataList
   */
  @Action('goodsActor: initStoreCateList')
  initStoreCateList(state, dataList: IList) {
    // 改变数据形态，变为层级结构
    const newDataList = dataList
      .filter((item) => item.get('cateParentId') == 0)
      .map((data) => {
        const children = dataList
          .filter((item) => item.get('cateParentId') == data.get('storeCateId'))
          .map((childrenData) => {
            const lastChildren = dataList.filter((item) => item.get('cateParentId') == childrenData.get('storeCateId'));
            if (!lastChildren.isEmpty()) {
              childrenData = childrenData.set('children', lastChildren);
            }
            return childrenData;
          });

        if (!children.isEmpty()) {
          data = data.set('children', children);
        }
        return data;
      });
    return state.set('storeCateList', newDataList).set('sourceStoreCateList', dataList);
  }
}
