import { Store } from 'plume2';
import { message } from 'antd';
//import { fromJS } from 'immutable';
import { cache, Const, history, util, RCi18n } from 'qmkit';
import * as webapi from './webapi';
import FormActor from './actor/form-actor';
//import Item from 'antd/lib/list/Item';
//import { array } from 'prop-types';
const pcLogo = require('../../public/images/login/logo1.png');

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
    // webapi
    //   .getSiteInfo()
    //   .then((resIco: any) => {
    //     if (resIco.res.code == Const.SUCCESS_CODE) {
    //       const logo = JSON.parse((resIco.res.context as any).pcLogo);
    //       if(logo && logo.length > 0) {
    //         this.dispatch('login:logo', logo[0].url);
    //         sessionStorage.setItem(cache.SITE_LOGO, logo[0].url);
    //       }
    //     }
    //     this.dispatch('login:refresh', true);
    //   })
    //   .catch((err) => {});
    const configLogo = sessionStorage.getItem(cache.SITE_LOGO) ?? pcLogo;
    this.dispatch('login:logo', configLogo);
    this.dispatch('login:refresh', true);
  };

  /**
   *  输入
   */
  onInput = (param) => {
    this.dispatch('login:input', param);
  };

  messageByResult(res) {
    if (res.code === Const.SUCCESS_CODE) {
      message.success(RCi18n({id:'Public.OperateSucc'}));
    } else {
      //登录失败原因
    }
  }
}
