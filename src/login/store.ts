import { Store } from 'plume2';
import { message } from 'antd';
//import { fromJS } from 'immutable';
import { cache, Const, history, util, RCi18n } from 'qmkit';
import * as webapi from './webapi';
import FormActor from './actor/form-actor';
//import Item from 'antd/lib/list/Item';
//import { array } from 'prop-types';
const pcIco = require('../../public/images/login/pcIco.ico');

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
    // const linkEle = document.getElementById('icoLink') as any;
    // linkEle.href = pcIco;
    // linkEle.type = 'image/x-icon';
    webapi
      .getSiteInfo()
      .then((resIco: any) => {
        if (resIco.res.code == Const.SUCCESS_CODE) {
          //logo
          const logo = JSON.parse((resIco.res.context as any).pcLogo);
          this.dispatch('login:logo', logo[0].url);
          sessionStorage.setItem(cache.SITE_LOGO, logo[0].url); //放入缓存,以便登陆后获取
          //icon
          /*const ico = (resIco.res.context as any).pcIco
          ? JSON.parse((resIco.res.context as any).pcIco)
          : null;
        if (ico) {
          const linkEle = document.getElementById('icoLink') as any;
          linkEle.href = ico[0].url;
          linkEle.type = 'image/x-icon';
        }*/
        }
        this.dispatch('login:refresh', true);
      })
      .catch((err) => {
        message.error(err.toString());
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
      message.success(RCi18n({id:'Public.OperateSucc'}));
    } else {
      //登录失败原因
    }
  }
}
