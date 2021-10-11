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
  uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  init = async (param?: any) => {
    this.dispatch('loading:start');
    const { res } = await webapi.fetchFindById(param);
    if (res.code === Const.SUCCESS_CODE) {
      let { goodsQuantity, appointmentVO, customerPet, storeId, suggest, expert, fillDate, optimal, pickup, paris, apptId, felinRecoId } = res.context;
      const felinReco = { felinRecoId, storeId, apptId, expert, paris, suggest, pickup, fillDate, optimal }
      customerPet = customerPet && customerPet.map(item => {
        let _tempWeight = item.weight ? JSON.parse(item.weight) : {}
        let { measure = 0, measureUnit = '' } = _tempWeight
        item.measure = measure;
        item.measureUnit = measureUnit;
        item.birthOfPets = moment(item.birthOfPets).format('YYYY-MM-DD')
        return item;
      }) || []

      this.initDistaptch({ felinReco, goodsQuantity, appointmentVO, customerPet, list: [] });
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
  findByApptNo = async (apptNo) => {
    const { res } = await webapi.fetchFelinFindByNoScan({ apptNo })
    if (res.code === Const.SUCCESS_CODE) {
      const { settingVO, pets, felinReco } = res.context;
      let goodsQuantity = JSON.parse(felinReco?.goodsIds ?? '[]')
      let list = pets.map(item => {
        let _tempWeight = item.weight ? JSON.parse(item.weight) : {}
        item.measure = _tempWeight?.measure ?? 0;
        item.measureUnit = _tempWeight?.measureUnit ?? 'Kg';
        return item
      })
      if (list.length > 0) {
        list.map(item => {
          item.birthOfPets = moment(item.birthOfPets).format('YYYY-MM-DD')
        })
      }
      let _recommendParams = this.state().get('recommendParams')
      this.savepetsRecommendParams({ ..._recommendParams, appointmentVO: settingVO, goodsQuantity })
      this.dispatch('pets:list', list)
      // felinReco.fillDate=felinReco?.fillDate??moment().format('YYYY-MM-DD')
      // let _felinReco = { ...felinReco, expert: this.state().get('felinReco').expert }
      // this.initDistaptch({ felinReco: _felinReco, goodsQuantity, appointmentVO: settingVO, customerPet: list.length > 0 ? list[0] : {}, list });
      if (settingVO.apptNo) {
        message.success(res.message)
      } else {
        message.error((window as any).RCi18n({ id: 'Prescriber.appointmentIdNotExist' }))
      }

    }
  }
  //查询全部
  getFillAutofindAllTitle = async () => {
    this.dispatch('loading:start');
    const { res } = await webapi.fetchFindFillAutoAllTitle()
    if ((res as any).code == Const.SUCCESS_CODE) {
      this.dispatch('pets:fillAutoList', res.context)
    }
    this.dispatch('loading:end');
  }


  //goods info 

  getGoodsInfoPage = async () => {
    this.dispatch('loading:start');
    const { res } = await webapi.fetchproductTooltip();
    if ((res as any).code == Const.SUCCESS_CODE) {
      let goodsInfoList = (res as any).context.goodsInfoList;
      this.dispatch('goods:infoPage', goodsInfoList)
      // let goods = this.state().get('goodsQuantity')
      let goods = this.state().get('recommendParams').get('goodsQuantity')
      let obj = {}, productSelect = []
      goodsInfoList.map(item => {
        obj[item.goodsInfoNo] = item
      })
      goods.map(item => {
        let goodsInfoWeight: any = 0, goodsInfoUnit = (obj[item.goodsInfoNo]?.goodsInfoUnit ?? '').toLowerCase();
        obj[item.goodsInfoNo].goodsInfoWeight = obj[item.goodsInfoNo]?.goodsInfoWeight ?? 0
        if (goodsInfoUnit === 'g') {
          goodsInfoWeight = item.quantity * obj[item.goodsInfoNo].goodsInfoWeight
        } else if (goodsInfoUnit === 'kg') {
          let d: any = (item.quantity * obj[item.goodsInfoNo].goodsInfoWeight) / 1000
          goodsInfoWeight = parseInt(d)
        }

        productSelect.push({ ...obj[item.goodsInfoNo], quantity: item.quantity, goodsInfoWeight })
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
