import { IOptions, Store } from 'plume2';
import { message } from 'antd';

import { Const, history, util, ValidConst } from 'qmkit';
import * as webapi from './webapi';
import SettleDetailActor from './actor/settle-detail-actor';
import FillInPetInfoActor from './actor/fillin-pet-info'
import moment from 'moment';

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

  init = async (param?: any) => {
    this.dispatch('loading:start');
    const { res } = await webapi.fetchFindById(param);
    if (res.code === Const.SUCCESS_CODE) {
      const { goodsQuantity, appointmentVO, customerPet, storeId, suggest, expert, fillDate, optimal, pickup, paris, apptId, felinRecoId } = res.context;
      const felinReco = { felinRecoId, storeId, apptId, expert, paris, suggest, pickup, fillDate, optimal }
      let { measure = 0, measureUnit = '' } = customerPet.weight ? JSON.parse(JSON.parse(customerPet.weight)) : {}

      customerPet.measure = measure;
      customerPet.measureUnit = measureUnit;
      customerPet.birthOfPets=moment(customerPet.birthOfPets).format('YYYY-MM-DD')
      console.log(measure, measureUnit, 'customerPet', felinReco)
      this.initDistaptch({ felinReco, goodsQuantity, appointmentVO, customerPet, list: [] });
    } else {
      this.dispatch('loading:end');
    }
  };
  initDistaptch = ({ felinReco, goodsQuantity, appointmentVO, customerPet, list }) => {
    this.transaction(() => {
      this.dispatch('pets:felinReco', felinReco)
      this.dispatch('pets:goodsQuantity', goodsQuantity);
      this.dispatch('pets:appointmentVO', appointmentVO);
      this.dispatch('pets:customerPet', customerPet);
      this.dispatch('pets:list', list)

      this.dispatch('loading:end');
    })
  }
  onProductForm = async (param?: any) => {
    param = Object.assign(this.state().get('onProductForm').toJS(), param);
    this.dispatch('loading:start');
    const res1 = await webapi.fetchproductTooltip();
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

  onChangePestsForm = (params, type?: any) => {
    this.dispatch('loading:start');
    this.dispatch(`pets:${type}`, params)
    this.dispatch('loading:end');
  }
  //保存

  fetchFelinSave = async (params = {}) => {
    this.dispatch('loading:start');
    const { res } = await webapi.fetchFelinSave(params)
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
  findByApptNo = async (apptNo = 'AP663253') => {
    const { res } = await webapi.fetchFelinFindByNoScan({ apptNo })
    if (res.code === Const.SUCCESS_CODE) {
      const { settingVO, pets, felinReco } = res.context;
      let goodsQuantity = JSON.parse(felinReco?.goodsIds ?? '[]')
      let list = pets.map(item => {
        let _tempWeight =JSON.parse(JSON.parse(item.weight))
        item.measure = _tempWeight.measure;
        item.measureUnit = _tempWeight.measureUnit;
        return item
      })
      if(list.length>0){
        list.map(item=>{
          item.birthOfPets=moment(item.birthOfPets).format('YYYY-MM-DD')
        })
      }
      let _felinReco = { ...felinReco, expert: this.state().get('felinReco').expert }
      this.initDistaptch({ felinReco: _felinReco, goodsQuantity, appointmentVO: settingVO, customerPet: list.length > 0 ? list[0] : {}, list });
    }
  }


  //goods info 

  getGoodsInfoPage = async () => {
    this.dispatch('loading:start');
    const { res } = await webapi.fetchproductTooltip();
    if ((res as any).code == Const.SUCCESS_CODE) {
      let goodsInfoList = (res as any).context.goodsInfoList;
      this.dispatch('goods:infoPage', goodsInfoList)
      let goods = this.state().get('goodsQuantity')
      let obj = {}, productSelect = []
      goodsInfoList.map(item => {
        obj[item.goodsInfoNo] = item
      })
     // _clone[index].goodsInfoWeight = value * (_clone[index].goodsInfoWeight/_clone[index].quantity)
      goods.map(item => {
       let goodsInfoWeight:any=0,goodsInfoUnit=(obj[item.goodsInfoNo]?.goodsInfoUnit??'').toLowerCase();
       if(goodsInfoUnit==='g'){
          goodsInfoWeight=item.quantity*obj[item.goodsInfoNo].goodsInfoWeight
       }else if(goodsInfoUnit==='kg'){
          let d:any=(item.quantity*obj[item.goodsInfoNo].goodsInfoWeight)/1000
          goodsInfoWeight=parseInt(d)
       }

        productSelect.push({ ...obj[item.goodsInfoNo], quantity: item.quantity ,goodsInfoWeight})
      })
      this.onProductselect(productSelect)
    }
    this.dispatch('loading:end');
  }

  //productselect
  onProductselect = (addProduct) => {
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
