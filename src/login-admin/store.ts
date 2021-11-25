import { Store } from 'plume2';
import { message } from 'antd';
import { cache, Const, history, util, RCi18n } from 'qmkit';
import * as webapi from './webapi';
import FormActor from './actor/form-actor';
const pcLogo = require('../../public/images/login/logo1.png');

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
    // webapi.getSiteInfo().then((resIco: any) => {
    //   if (resIco.res && resIco.res.code && resIco.res.code == Const.SUCCESS_CODE) {
    //     const configLog = JSON.parse(resIco.res.context?.pcLogo ?? '[{}]')[0]['url'] ?? pcLogo;
    //     this.dispatch('login:logo', configLog);
    //     sessionStorage.setItem(cache.SITE_LOGO, configLog);
    //   }
    //   this.dispatch('login:refresh', true);
    // });
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
