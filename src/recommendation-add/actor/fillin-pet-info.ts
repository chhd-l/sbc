import { Action, Actor } from 'plume2';
import { IMap, IList } from 'typings/globalType';
import { fromJS } from 'immutable';
import moment from 'moment';
export default class FillInPetInfoActor extends Actor {
  defaultState() {
    return {
      goodsQuantity: [],//产品新
      felinReco: {
        felinRecoId: null,
        storeId: null,
        apptId: null,
        expert: '',
        paris: true,
        suggest: '',
        optimal: '',
        pickup: true,
        fillDate: null
      },//基础
      appointmentVO: {},//扫码信息
      customerPet: {},//宠物信息
      funType: false,
      petsList: [],
      goodsInfoPage:[]

    }
  }

  @Action('pets:felinReco')
  petsFelinReco(state, felinReco) {
    delete felinReco['goodsIds'];
    return state.set('felinReco', felinReco)
  }
  @Action('pets:goodsQuantity')
  petsGoodsQuantity(state, goodsQuantity) {
    return state.set('goodsQuantity', goodsQuantity);
  }

  @Action('pets:appointmentVO')
  petsAppointmentVO(state, appointmentVO) {
    return state.set('appointmentVO', appointmentVO);
  }

  @Action('pets:customerPet')
  petsCustomerPet(state, customerPet) {
    customerPet.birthOfPets=moment(customerPet.birthOfPets).format('YYYY-MM-DD')
    return state.set('customerPet', customerPet);
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
    return state.set('petsList', value);
  }



    @Action('loading:start')
    start(state:IMap) {
      return state.set('loading', true);
    }

    @Action('loading:end')
    end(state:IMap) {
      return state.set('loading', false);
    }
}
