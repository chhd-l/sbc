/**
 * Created by hht on 2018/2/28.
 */
import { Action, Actor, IMap } from 'plume2';
import { fromJS } from 'immutable';
import { IList } from '../../../../typings/globalType';

export default class FullGiftActor extends Actor {
  defaultState() {
    return {
      marketingBean: {
        promotionType: 0,
        publicStatus: 1,
        subType: 5, // 4 5
        isClub: false,
        fullGiftLevelList: []
      },
      allGroups: [],
      // 店铺分类信息
      storeCateList: [],
      sourceStoreCateList: [],

      //Attribute
      attributesList: [],

      //营销活动已选的商品信息
      selectedSkuIds: [],
      selectedRows: [],

      selectedGiftRows: []
    };
  }

  constructor() {
    super();
  }

  @Action('marketing:giftBean')
  getGiftBean(state: IMap, res) {
    return state.set('marketingBean', fromJS(res));
  }

  @Action('marketing:initBeanLevelList')
  initBeanLevelList(state: IMap) {
    const fullGiftLevelList = [
      {
        key: this.makeRandom(),
        fullAmount: null,
        fullCount: null,
        giftType: 1,
        fullGiftDetailList: []
      }
    ]

    return state.update('marketingBean', (bean) => {
      return bean.set('fullGiftLevelList', fromJS(fullGiftLevelList))
    });
  }

  @Action('marketing:allGroups')
  getAllGroups(state, allGroups) {
    return state.set('allGroups', fromJS(allGroups));
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

  @Action('marketing:selectedRows')
  selectedRows(state, selectedRows) {
    return state.set('selectedRows', fromJS(selectedRows));
  }

  @Action('marketing:selectedGiftRows')
  selectedGiftRows(state, selectedGiftRows) {
    return state.set('selectedGiftRows', fromJS(selectedGiftRows));
  }


  @Action('marketing:selectedSkuIds')
  selectedSkuIds(state, selectedSkuIds) {
    return state.set('selectedSkuIds', selectedSkuIds);
  }

  @Action('marketing:attributesList')
  getAllAttributesList(state, attributesList) {
    attributesList.forEach((item) => {
      if (item.attributesValuesVOList) {
        item.attributesValuesVOList.forEach((child) => {
          child.attributeName = child.attributeDetailName;
        });
      }
    });
    return state.set('attributesList', fromJS(attributesList));
  }

  /**
   * 生成随机数，作为key值
   * @returns {string}
   */
  makeRandom = () => {
    return 'key' + (Math.random() as any).toFixed(6) * 1000000;
  };
}
