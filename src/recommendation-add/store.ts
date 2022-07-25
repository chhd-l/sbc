import { IOptions, Store } from 'plume2';
import { message } from 'antd';

import { Const, history, util, ValidConst } from 'qmkit';
import * as webapi from './webapi';
import SettleDetailActor from './actor/settle-detail-actor';
import FillInPetInfoActor from './actor/fillin-pet-info'
import moment from 'moment';
import { fromJS, Set } from 'immutable';
export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new SettleDetailActor(), new FillInPetInfoActor()];
  }
  uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (window.crypto.getRandomValues(new Uint8Array(1)) * 0.001) * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  init = async (param?: any) => {
    this.dispatch('loading:start');
    const { res } = await webapi.fetchFindById(param);
    if (res.code === Const.SUCCESS_CODE) {
      let { goodsQuantity, appointmentVO, customerPet, storeId, suggest, expert, fillDate, optimal, pickup, paris, apptId, felinRecoId } = res.context;
      fillDate=(fillDate.includes('Invalid')||!fillDate)?moment().format('YYYY-MM-DD'):fillDate
      const felinReco = { felinRecoId, storeId, apptId, expert, paris, suggest, pickup, fillDate, optimal }
      customerPet = customerPet && customerPet.map(item => {
        let _tempWeight = item.weight ? JSON.parse(item.weight) : {}
        let { measure = 0, measureUnit = '' } = _tempWeight
        item.measure = measure;
        item.measureUnit = measureUnit;
        item.birthOfPets = moment(item.birthOfPets).format('YYYY-MM-DD')
        return item;
      }) || []

      // 编辑进来 主动根据 apptNo 查询一次pets list
      let  petsList = [];
      if (appointmentVO?.apptNo) {
        const { res } = await webapi.fetchFelinFindByNoScan({ apptNo: appointmentVO?.apptNo });
        if (res.code === Const.SUCCESS_CODE) {
          const { pets } = res.context;
          petsList = pets.map(item => {
            let _tempWeight = item.weight ? JSON.parse(item.weight) : {}
            item.measure = _tempWeight?.measure ?? 0;
            item.measureUnit = _tempWeight?.measureUnit ?? 'kg';
            return item
          })
          if (petsList.length > 0) {
            petsList.map(item => {
              item.birthOfPets = moment(item.birthOfPets).format('YYYY-MM-DD')
            })
          }
        }
      }

      this.initDistaptch({ felinReco, goodsQuantity, appointmentVO, customerPet, list: petsList });
    } else {
      this.dispatch('loading:end');
    }
  };

  savepetsRecommendParams = (all) => {
    this.dispatch('pets:recommendParams', all)
  }



  initDistaptch = ({ felinReco, goodsQuantity, appointmentVO, customerPet, list }) => {
    this.transaction(() => {
      this.savepetsRecommendParams({ appointmentVO, goodsQuantity, ...felinReco, customerPet })
      this.dispatch('pets:list', list)

      this.dispatch('loading:end');
    })
  }
  onProductForm = async (param?: any) => {
    param = Object.assign(this.state().get('onProductForm').toJS(), param);
    this.dispatch('loading:start');
    const res1 = await webapi.fetchFelinRecoProducts(param);
    if (res1.res.code === Const.SUCCESS_CODE) {
      param.total = res1.res.context.goodsInfoPage.total;
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('product:productForm', param);
        this.dispatch('productList:productInit', res1.res.context.goodsInfoList);
      });
    } else {
      this.dispatch('loading:end');
    }
  };

  //步骤
  onChangeStep = (step) => {
    this.dispatch(`pets:step`, step)
  }


  onChangePestsForm = (params, type?: any) => {
    this.dispatch('loading:start');
    this.dispatch(`pets:${type}`, params)
    this.dispatch('loading:end');
  }
  //保存

  fetchFelinSave = async (params:any = {}) => {
    this.dispatch('loading:start');

   let customerPet= params.customerPet.map(item=>{
      return{
        ...item,
        weight:JSON.stringify({measure:item.measure,measureUnit:item.measureUnit})
      }
    })
    // let isSend=params.isSend===0?false:true
    const oktaToken = JSON.parse(localStorage.getItem('okta-token-storage') || '{}')?.accessToken?.value || ''
    const { res } = await webapi.fetchFelinSave({...params, customerPet, oktaToken})
    if (res.code === Const.SUCCESS_CODE) {
      history.push('/recommendation')
    }
    this.dispatch('loading:end');
  }
  // seting add or edit

  onSettingAddOrEdit = (value: boolean) => {
    this.dispatch('pets:funType', value)
  }
  //scan result
  findByApptNo = async (apptNo) => {
    const { res } = await webapi.fetchFelinFindByNoScan({ apptNo })
    if (res.code === Const.SUCCESS_CODE) {
      const { settingVO, pets, felinReco } = res.context;
      let goodsQuantity = JSON.parse(felinReco?.goodsIds ?? '[]')
      let list = pets.map(item => {
        let _tempWeight = item.weight ? JSON.parse(item.weight) : {}
        item.measure = _tempWeight?.measure ?? 0;
        item.measureUnit = _tempWeight?.measureUnit ?? 'kg';
        return item
      })
      if (list.length > 0) {
        list.map(item => {
          item.birthOfPets = moment(item.birthOfPets).format('YYYY-MM-DD')
        })
      } 
      let _recommendParams = this.state().get('recommendParams').toJS()
      let _te={ ..._recommendParams,expert:settingVO.expertNames,apptNo:settingVO.apptNo, apptId:settingVO.id, fillDate:moment().format('YYYY-MM-DD'),storeId:settingVO.storeId, appointmentVO: settingVO, goodsQuantity }
      this.savepetsRecommendParams(_te)
      this.dispatch('pets:list', list)
      if (settingVO.apptNo) {
        message.success(res.message)
      } else {
        message.error((window as any).RCi18n({ id: 'Prescriber.appointmentIdNotExist' }))
      }

    }
  }
  //查询全部
  getFillAutofindAllTitle = async (param) => {
    this.dispatch('loading:start');
    const { res } = await webapi.fetchFindAllCate(param)
    if ((res as any).code == Const.SUCCESS_CODE) {
      this.dispatch('pets:fillAutoList', res.context?.result??[])
    }
    this.dispatch('loading:end');
  }


  getGoodsInfoPage = async () => {
    this.dispatch('loading:start');

    let goods = this.state().get('recommendParams').get('goodsQuantity').toJS()
     const list=await Promise.all(goods.map(async(item)=>{
     let {res}=await  webapi.fetchFelinRecoProducts({goodsSku:item.goodsInfoNo})
      if ((res as any).code == Const.SUCCESS_CODE) {
        let _item=res.context.goodsInfoPage.content;
        if(_item.length>0){
          
          return {..._item[0],quantity:item.quantity}
        }
       return undefined;
      }
    }))
    let _list=list.filter(item=>item!==undefined)
    this.onProductselect(_list)
    this.dispatch('loading:end');
  }

     

  //goods info 
//这个是查询全部fgs 的数据
 /* getGoodsInfoPage = async () => {
    this.dispatch('loading:start');

    let goods = this.state().get('recommendParams').get('goodsQuantity').toJS()

     const list=await Promise.all(goods.map(async(item)=>{
     let {res}=await  webapi.fetchFelinRecoProducts({likeGoodsInfoNo:item.goodsInfoNo})
      if ((res as any).code == Const.SUCCESS_CODE) {
        res = (res as any).context;
        res['goodsInfoPage'].content.map((goodInfo) => {
          const cId = fromJS(res['goodses'])
            .find((s) => s.get('goodsId') === goodInfo.goodsId)
            .get('cateId');
          const cate = fromJS(res['cates']).find((s) => s.get('cateId') === cId);
          goodInfo['cateName'] = cate ? cate.get('cateName') : '';
  
          const bId = fromJS(res['goodses'])
            .find((s) => s.get('goodsId') === goodInfo.goodsId)
            .get('brandId');
          const brand =
            res['brands'] == null
              ? ''
              : fromJS(res['brands']).find((s) => s.get('brandId') === bId);
          goodInfo['brandName'] = brand ? brand.get('brandName') : '';
  
          return goodInfo;
        });        

      let goodsInfoList = res['goodsInfoPage']['content']
          if(goodsInfoList.length>0){
            goodsInfoList[0].quantity=1
            return goodsInfoList[0]
          }
       
     }
     }))
     this.onProductselect(list)
    this.dispatch('loading:end');
  }
*/
  //productselect
  onProductselect = (addProduct=[]) => {
   this.dispatch('product:productselect', addProduct);
  };

  //Create Link
  onCreateLink = (Link) => {
    this.dispatch('create:createLink', Link);
  };

  //Get Link
  onCreate = async (param, type) => {
    const res = await webapi.fetchCreateLink(param);
    this.dispatch('create:createLinkType', type);
    this.dispatch('get:getLink', res.res.context);
  };

  //Send & Another
  onSharing = (sharing) => {
    this.dispatch('detail:sharing', sharing);
  };

  //Send
  onSend = async (type, param?: any) => {
    const res = await webapi.fetchModify(param);
    if (res.res.code === Const.SUCCESS_CODE) {
      message.success('send successfully!');
      if (type == 'send') {
        history.goBack();
      } else {
        this.dispatch('get:send', true);
      }
    } else {
      if (res.res.code === 'K-110001') {
        message.success('send failed!');
        return false;
      }
    }
  };

  //LinkStatus
  onLinkStatus = async (param?: any) => {
    const res = await webapi.fetchLinkStatus(param);
    if (res.res.code === Const.SUCCESS_CODE) {
      //message.success('switch successfully!');
      this.dispatch('get:linkStatus', res.res.context.linkStatus);
    } else {
      if (res.res.code === 'K-110001') {
        message.success('switch failed!');
        return false;
      }
    }
  };
}
