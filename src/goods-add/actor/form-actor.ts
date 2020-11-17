import { Actor, Action } from 'plume2';
import { IMap } from '../../../typings/globalType';

export default class FormActor extends Actor {
  defaultState() {
    return {
      goodsForm: {},
      skuForm: {},
      specForm: {},
      levelPriceForm: {},
      userPriceForm: {},
      areaPriceForm: {},
      logisticsForm: {},
      seoForm: {
        titleSource: '{name}-Royal Canin}',
        metaKeywordsSource: '{name}, {subtitle}, {sales category}, {tagging}',
        metaDescriptionSource: '{description}'
      },
      //分销 切换类型是否要提示
      checkFlag: false,
      //企业购提示按钮
      enterpriseFlag: false,
      AlertInfo: ''
    };
  }

  @Action('formActor:goods')
  updateGoodsForm(state, goodsForm) {
    return state.set('goodsForm', goodsForm);
  }

  @Action('formActor:logistics')
  updateLogisticsForm(state, logisticsForm) {
    return state.set('logisticsForm', logisticsForm);
  }

  @Action('formActor:sku')
  updateSkuForm(state, skuForm) {
    return state.set('skuForm', skuForm);
  }

  //seo
  @Action('formActor:seo')
  updateSeoForm(state: IMap, { field, value }) {
    return state.setIn(['seoForm', field], value);
  }
  @Action('seoActor: setSeoForm')
  setSeoForm(state: IMap, form) {
    return state.set('seoForm', form);
  }
  @Action('formActor:spec')
  updateSpecForm(state, specForm) {
    return state.set('specForm', specForm);
  }

  @Action('formActor:levelprice')
  updateLevelPriceForm(state, levelPriceForm) {
    return state.set('levelPriceForm', levelPriceForm);
  }

  @Action('formActor:userprice')
  updateUserPriceForm(state, userPriceForm) {
    return state.set('userPriceForm', userPriceForm);
  }

  @Action('formActor:areaprice')
  updateAreaPriceForm(state, areaPriceForm) {
    return state.set('areaPriceForm', areaPriceForm);
  }

  @Action('formActor:check')
  setCheckFlag(state, value) {
    return state.set('checkFlag', value);
  }

  @Action('formActor:enterpriseFlag')
  setEnterpriseFlag(state, value) {
    return state.set('enterpriseFlag', value);
  }
}
