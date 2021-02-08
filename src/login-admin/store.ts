import { Store } from 'plume2';
import { message } from 'antd';
import { cache, Const, history, util } from 'qmkit';
import * as webapi from './webapi';
import FormActor from './actor/form-actor';
const pcLogo = require('../../public/images/login/logo1.png');
const pcIco = require('../../public/images/login/pcIco.ico');

//import { fromJS } from 'immutable';
//import Item from 'antd/lib/list/Item';
//import { array } from 'prop-types';

export default class AppStore extends Store {
  bindActor() {
    return [new FormActor()];
  }

  constructor(props) {
    super(props);
    //debug
    (window as any)._store = this;
  }

  //;;;;;;;;;;;;;action;;;;;;;;;;;;;;;;;;;;;;;
  init = async () => {
    const linkEle = document.getElementById('icoLink') as any;
    linkEle.href = pcIco;
    linkEle.type = 'image/x-icon';
    webapi.getSiteInfo().then((resIco: any) => {
      if (resIco.res && resIco.res.code && resIco.res.code == Const.SUCCESS_CODE) {
        //logo
        this.dispatch('login:logo', pcLogo);
        sessionStorage.setItem(cache.SITE_LOGO, pcLogo); //放入缓存,以便登陆后获取
        //icon
        /*const ico = (resIco.res.context as any).pcIco
          ? JSON.parse((resIco.res.context as any).pcIco)
          : null;
        if (ico) {
          const linkEle = document.getElementById('icoLink') as any;
          linkEle.href = pcIco;
          linkEle.type = 'image/x-icon';
        }*/
      }
      this.dispatch('login:refresh', true);
    });
  };

  /**
   *  输入
   */
  onInput = (param) => {
    this.dispatch('login:input', param);
  };

  messageByResult(res) {
    if (res.code === Const.SUCCESS_CODE) {
      message.success('Operate successfully');
    } else {
      //登录失败原因
    }
  }
}
