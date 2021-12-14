import { Action, Actor } from 'plume2';
import { IMap, IList } from 'typings/globalType';
import { fromJS } from 'immutable';
import moment from 'moment';
export default class FillInPetInfoActor extends Actor {
  defaultState() {
    return {
      currentStep: 0,
      recommendParams:{
        goodsQuantity: [],//产品新
        felinRecoId: undefined,
        storeId: undefined,
        apptId: undefined,
        expert: undefined,
        paris: true,
        suggest: undefined,
        optimal: undefined,
        pickup: true,
        fillDate: null,
        isSend:undefined,
        appointmentVO: {},//扫码信息
        customerPet: [{
          petsId:undefined,
          petsName: '',
          birthOfPets: null,
          petsSex: 1,
          petsBreed: undefined,
          lifestyle: undefined,
          needs: undefined,
          sterilized: 1,
          type: undefined,
          measure: 0,
          measureUnit: 'kg'
        }]
      },
      funType: false,
      petsList: [],
      goodsInfoPage: [],
      fillAutoList:[]
    }
  }


  @Action('pets:step')
  petsStep(state, step) {
    return state.set('currentStep', step)
  }

  @Action('pets:fillAutoList')
  petsFillAutoList(state, list:IList) {
    return state.set('fillAutoList', fromJS(list))
  }
 
  @Action('pets:recommendParams')
  petsRecommendParams(state, all) {
    return state.set('recommendParams', fromJS(all));
  }


  //产品信息
  @Action('goods:infoPage')
  goodsInfoPage(state, list) {
    return state.set('goodsInfoPage', list);
  }




  @Action('pets:funType')
  petsFunType(state, value) {
    return state.set('funType', value);
  }
  @Action('pets:list')
  petsList(state, value) {
    return state.set('petsList', fromJS(value));
  }



  @Action('loading:start')
  start(state: IMap) {
    return state.set('loading', true);
  }

  @Action('loading:end')
  end(state: IMap) {
    return state.set('loading', false);
  }
}
