import { Actor, Action } from 'plume2';
import { fromJS } from 'immutable';
import moment from 'moment';
import { Const } from 'qmkit';
import { IList } from '../../../typings/globalType';

export default class CouponInfoActor extends Actor {
  defaultState() {
    return {
      // 优惠券Id
      couponId: '',
      // 优惠券名称
      couponName: '',
      // 优惠券类型 0通用券 1店铺券 2运费券
      couponType: '1',
      // 选中的优惠券分类
      couponCateIds: [],
      // 起止时间类型 0：按起止时间，1：按N天有效
      rangeDayType: 0,
      // 优惠券开始时间
      startTime: '',
      // 优惠券结束时间
      endTime: '',
      // 有效天数
      effectiveDays: '',
      // 优惠券分类
      couponCates: [],
      // 优惠券面值
      denomination: null,
      // 购满类型 0：无门槛，1：满N元可使用
      fullBuyType: 1,
      // 购满多少钱
      fullBuyPrice: null,
      fullbuyCount: null,
      // 营销类型(0,1,2,3) 0全部商品，1品牌，2平台类目/店铺分类，3自定义货品（店铺可用）
      scopeType: 0,
      // 分类
      cates: [],
      // 品牌
      brands: [],
      // 选择的品牌
      chooseBrandIds: [],
      // 选择的分类
      chooseCateIds: [],
      // 选择的商品ids
      chooseSkuIds: [],
      // 选择的具体商品信息
      goodsRows: [],
      // 优惠券说明
      couponDesc: '',
      // 按钮禁用
      btnDisabled: false,
      goodsModalVisible: false,
      // 聚合给选择分类使用
      reducedCateIds: [],
      customProductsType:0,

      // 店铺分类信息
      storeCateList: [],
      sourceStoreCateList: [],
      storeCateIds: [],
      couponJoinLevel: 0,
      allGroups: [],
      segmentIds: [],
      couponPromotionType: 0, //Amount: 0 or Percentage: 1
      couponDiscount: null,
      attributesList: [],
      attributeValueIds: null,
      couponPurchaseType: 0,
      isSuperimposeSubscription: 1, //未勾选
      limitAmount: null

    };
  }
  /**
   * 键值设置
   * @param state
   * @param param1
   */
  @Action('coupon: info: field: value')
  fieldsValue(state, { field, value }) {
    state = state.set(field, fromJS(value));
    // debugger
    return state;
  }

  /**
   * 修改时间区间
   * @param state
   * @param param1
   */
  @Action('coupon: info: date: range')
  changeDateRange(state, { startTime, endTime }) {
    return state.set('startTime', startTime).set('endTime', endTime);
  }

  /**
   * 存储优惠券信息
   * @param state
   * @param params
   */
  @Action('coupon: info: data')
  fetchCouponInfo(state, params) {
    const {
      cateIds,
      couponDesc,
      couponId,
      couponName,
      couponType,
      denomination,
      effectiveDays,
      endTime,
      fullBuyPrice,
      fullBuyType,
      fullbuyCount,
      rangeDayType,
      scopeIds,
      scopeType,
      startTime,
      goodsList,
      storeCateIds,
      couponJoinLevel,
      segmentIds,
      couponPromotionType,
      couponDiscount,
      attributeValueIds,
      couponPurchaseType,
      isSuperimposeSubscription,
      limitAmount,
      customProductsType
    } = params;
    state = state
      .set('couponCateIds', fromJS(cateIds))
      .set('couponName', couponName)
      .set('couponId', couponId)
      .set('couponType', couponType)
      .set('denomination', denomination)
      .set('effectiveDays', effectiveDays)
      .set('endTime', endTime ? moment(endTime).format(Const.DAY_FORMAT) : '')
      .set('fullBuyPrice', fullBuyPrice)
      .set('fullbuyCount', fullbuyCount)
      .set('fullBuyType', fullBuyType)
      .set('rangeDayType', rangeDayType)
      .set('scopeType', scopeType)
      .set('startTime', startTime ? moment(startTime).format(Const.DAY_FORMAT) : '')
      .set('couponDesc', couponDesc)
      .set('storeCateIds', fromJS(storeCateIds))
      .set('couponJoinLevel', couponJoinLevel)
      .set('segmentIds', fromJS(segmentIds))
      .set('couponPromotionType', couponPromotionType)
      .set('couponDiscount', fromJS(couponDiscount))
      .set('attributeValueIds', fromJS(attributeValueIds))
      .set('couponPurchaseType', couponPurchaseType)
      .set('isSuperimposeSubscription', isSuperimposeSubscription)
      .set('limitAmount', limitAmount)
      .set('customProductsType',customProductsType)

    if (scopeType === 1) {
      state = state.set('chooseBrandIds', fromJS(scopeIds));
    } else if (scopeType === 3) {
      state = state.set('chooseCateIds', fromJS(scopeIds));
    } else if (scopeType === 4) {
      state = state.set('chooseSkuIds', fromJS(scopeIds));
      const goodsRows = this.changeGoodsListData(goodsList);
      state = state.set('goodsRows', fromJS(goodsRows));
    }
    return state;
  }

  @Action('delete: selected: sku')
  deleteSelectSku(state, skuId) {
    let goodsRows = state.get('goodsRows');
    let chooseSkuIds = state.get('chooseSkuIds');
    chooseSkuIds = chooseSkuIds.splice(
      chooseSkuIds.findIndex((item) => item == skuId),
      1
    );
    goodsRows = goodsRows.delete(goodsRows.findIndex((row) => row.get('goodsInfoId') == skuId));
    return state.set('goodsRows', goodsRows).set('chooseSkuIds', chooseSkuIds);
  }

  /**
   * 转换商品数据
   * @param goodsList
   * @returns {any[]}
   */
  changeGoodsListData(goodsList) {
    if (!goodsList) {
      return [];
    }
    const { brands, cates, goodsInfoPage } = goodsList;
    const rows = goodsInfoPage.content.map((sku) => {
      sku.brandName = '';
      sku.cateName = '';
      const cate = cates.find((item) => item.cateId == sku.cateId);
      const brand = brands.find((item) => item.brandId == sku.brandId);
      sku.brandName = brand ? brand.brandName : '';
      sku.cateName = cate ? cate.cateName : '';
      return sku;
    });
    return rows;
  }

  /**
   * 改变按钮禁用状态
   * @param state
   * @returns {any}
   */
  @Action('coupon: info: btn: disabled')
  changeBtnDisabled(state) {
    return state.set('btnDisabled', !state.get('btnDisabled'));
  }

  /**
   * 聚合存储分类Ids
   *
   * @param {*} state
   * @param {*} cates
   * @returns
   * @memberof CouponInfoActor
   */
  @Action('coupon: info: cates')
  fetchCates(state, cates) {
    const newCates = fromJS(cates);
    let cateList = newCates
      .filter((i) => i.get('cateParentId') == 0)
      .map((i) => {
        return fromJS({
          cateId: i.get('storeCateId'),
          cateIds: [i.get('storeCateId')]
        });
      });
    cateList = cateList.map((cate) => {
      const newCate = newCates.filter((i) => i.get('cateParentId') == cate.get('cateId'));
      if (newCate) {
        const concatCates = newCate.map((c) => c.get('storeCateId'));
        cate = cate.update((i) => i.set('cateIds', i.get('cateIds').concat(concatCates)));
      }
      return cate;
    });
    return state.set('reducedCateIds', cateList).set('cates', newCates);
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

  @Action('goodsActor: allGroups')
  getAllGroups(state, allGroups) {
    return state.set('allGroups', fromJS(allGroups));
  }

  @Action('goodsActor:attributesList')
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
}
