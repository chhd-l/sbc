import { Store } from 'plume2';
import { message } from 'antd';
import { Const, util } from 'qmkit';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import CouponDetailActor from './actor/coupon-info-actor';
import { getAactivity } from './webapi';

export default class AppStore extends Store {
  bindActor() {
    return [new CouponDetailActor()];
  }

  /**
   * 初始化信息
   */
  init = async (couponId?: string, { pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    this.dispatch('loading', true);
    /**获取优惠券详细信息*/
    const { res } = await webapi.getAactivity({
      pageNum,
      pageSize,
      couponId
    });
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('page', {
        total: res.context.couponActivityConfigPage.total,
        pageNum: pageNum + 1
      });
      // Activities Info信息
      this.dispatch('activityConfigPage', res.context.couponActivityConfigPage);
      this.transaction(() => {
        this.dispatch('coupon: detail: field: value', {
          field: 'couponCates',
          value: fromJS(res.context.couponInfo.cateNames.length == 0 ? ['其他'] : res.context.couponInfo.cateNames)
        });

        // 设置优惠券信息
        this.dispatch('coupon: detail: field: value', {
          field: 'coupon',
          value: fromJS(res.context.couponInfo)
        });
        if (res.context.couponInfo.scopeType == 5) { //category
          this.seCurrentCategory(res.context.couponInfo.storeCateIds);
        } else if (res.context.couponInfo.scopeType == 6) { //Attribute
          this.setCurrentAttribute(res.context.couponInfo.attributeValueIds);
        }
        if (res.context.couponInfo.couponJoinLevel == -3) {
          this.setCurrentGroup(res.context.couponInfo.segmentIds[0]);
        }
        // 设置商品品牌信息
        this.dispatch('coupon: detail: field: value', {
          field: 'skuBrands',
          value: fromJS(res.context.couponInfo.scopeNames)
        });
        // 设置商品分类信息
        this.dispatch('coupon: detail: field: value', {
          field: 'skuCates',
          value: fromJS(res.context.couponInfo.scopeNames)
        });
        // 设置商品列表
        this.dispatch('coupon: detail: field: value', {
          field: 'skus',
          value: fromJS(null == res.context.goodsList ? [] : res.context.goodsList) // 设置商品列表
        });

        this.dispatch('coupon: detail: field: value', {
          field: 'goodsList',
          value: fromJS(res.context.goodsList) // 设置商品列表
        });
      });
      this.dispatch('loading', false);
    } else {
      this.dispatch('loading', false);
    }

  };


  /**
   * 店铺分类
   * @param discountBean
   * @returns {Promise<void>}
   */
  seCurrentCategory = async (storeCateIds) => {
    const { res } = await webapi.getGoodsCate();
    if (res && res.code === Const.SUCCESS_CODE) {
      const allCategary = res.context;
      let currentCategary = [];
      allCategary.map(item => {
        storeCateIds.map(cate => {
          if (item.storeCateId == cate) {
            currentCategary.push(item);
          }
        });
      });
      this.dispatch('coupon: detail: field: value', {
        field: 'currentCategary',
        value: fromJS(currentCategary)
      });
    }
  };


  setCurrentAttribute = async (attributeValueIds) => {
    let params = {
      attributeName: '',
      displayName: '',
      attributeValue: '',
      displayValue: '',
      pageSize: 10000,
      pageNum: 0
    };
    const { res } = await webapi.getAllAttribute(params);
    if (res.code == Const.SUCCESS_CODE) {
      let currentAttribute = [];
      let attributesList = fromJS(res.context.attributesList);
      attributesList = this.generateAttributeTree(attributesList);
      attributesList = attributesList.toJS().flat(2);
      attributesList.map(item => {
        attributeValueIds.map(attribute => {
          if (item.id == attribute) {
            currentAttribute.push(item);
          }
        });
      });

      this.dispatch('coupon: detail: field: value', {
        field: 'currentAttribute',
        value: fromJS(currentAttribute)
      });
    } else {
      // message.error('load group error.');
    }
  };

  /**
   * Attribute分类树形下拉框
   * @param storeCateList
   */
  generateAttributeTree = (attributesList) => {
    return (
      attributesList &&
      attributesList.map((item) => {
        if (item.get('attributesValuesVOList') && item.get('attributesValuesVOList').count()) {
          return (
            this.generateAttributeTree(item.get('attributesValuesVOList'))
          );
        }
        return item;
      })
    );
  };

  setCurrentGroup = async (id) => {
    const { res } = await webapi.getAllGroups({
      pageNum: 0,
      pageSize: 1000000,
      segmentType: 0
    });

    if (res.code == Const.SUCCESS_CODE) {
      const allGroups = res.context.segmentList;
      const group = allGroups.find(item => item.id == id);
      this.dispatch('marketingActor:allGroups', fromJS(res.context.segmentList));
      this.dispatch('marketingActor:currentGroup', fromJS(group));
    } else {
      // message.error('load group error.');
    }
  };

  couponExport = async (couponId: any,activityId:any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          const result = JSON.stringify({
            couponId,
            activityId,
            token: token
          });
          const encrypted = base64.urlEncode(result);
          const exportHref = Const.HOST + `/coupon-info/coupon-code/export/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('请登录');
        }
        resolve();
      }, 500);
    });
  };
}
