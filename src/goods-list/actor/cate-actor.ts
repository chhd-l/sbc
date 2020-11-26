import { Actor, Action } from 'plume2';
import { List } from 'immutable';

declare type IList = List<any>;

export default class CateActor extends Actor {
  defaultState() {
    return {
      cateList: [], //层级结构的分类列表
      allCateList: [], //扁平的分类列表

      productCateList: [],
      sourceGoodCateList: []
    };
  }

  @Action('cateActor: init')
  init(state, cateList: IList) {
    const newDataList = cateList
    .filter((item) => item.get('cateParentId') == 0)
    .map((data) => {
      const children = cateList
        .filter((item) => item.get('cateParentId') == data.get('storeCateId'))
        .map((childrenData) => {
          const lastChildren = cateList.filter((item) => item.get('cateParentId') == childrenData.get('storeCateId'));
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
    return state.set('cateList', newDataList).set('allCateList', cateList);
  }

  @Action('goodsActor:getGoodsCate')
  getGoodsCate(state, dataList) {
    const newDataList = dataList
      .filter((item) => item.get('cateParentId') == 0)
      .map((data) => {
        const children = dataList
          .filter((item) => item.get('cateParentId') == data.get('cateId'))
          .map((childrenData) => {
            const lastChildren = dataList.filter((item) => item.get('cateParentId') == childrenData.get('cateId'));
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
    return state.set('productCateList', newDataList).set('sourceGoodCateList', dataList);
  }
}
