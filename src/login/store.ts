import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS } from 'immutable';
import { cache, Const, history, util } from 'qmkit';
import * as webapi from './webapi';
import FormActor from './actor/form-actor';
import Item from 'antd/lib/list/Item';

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
    webapi.getSiteInfo().then((resIco: any) => {
      if (resIco.res.code == Const.SUCCESS_CODE) {
        //logo
        const logo = JSON.parse((resIco.res.context as any).pcLogo);
        this.dispatch('login:logo', logo[0].url);
        sessionStorage.setItem(cache.SITE_LOGO, logo[0].url); //放入缓存,以便登陆后获取
        //icon
        const ico = (resIco.res.context as any).pcIco
          ? JSON.parse((resIco.res.context as any).pcIco)
          : null;
        if (ico) {
          const linkEle = document.getElementById('icoLink') as any;
          linkEle.href = ico[0].url;
          linkEle.type = 'image/x-icon';
        }
      }
      this.dispatch('login:refresh', true);
    });
  };

  /**
   * 账户密码登录;
   */
  login = async (form) => {
    const account = form.account;
    const password = form.password;
    const isRemember = form.isRemember;
    let base64 = new util.Base64();
    const { res } = await webapi.login(
      base64.urlEncode(account),
      base64.urlEncode(password)
    );
    if ((res as any).code === Const.SUCCESS_CODE) {
      if (isRemember) {
        localStorage.setItem(cache.LOGIN_DATA, JSON.stringify(res.context));
      }
      window.token = res.context.token;
      window.companyType = res.context.companyType;
      sessionStorage.setItem(cache.LOGIN_DATA, JSON.stringify(res.context));

      // 获取登录人拥有的菜单
      const menusRes = (await webapi.fetchMenus()) as any;
      if (menusRes.res.code === Const.SUCCESS_CODE) {
        let dataList = fromJS(menusRes.res.context);
        if (window.companyType == 0) {
          dataList = dataList.filterNot(
            (item) => item.get('title') == '业务员统计'
          );
        }
        // 非自营店铺 隐藏企业会员
        // if (window.companyType == 1) {
        dataList = dataList.filterNot(
          (item) => item.get('title') == '企业会员'
        );
        dataList = dataList.filterNot(
          (item) => item.get('title') == '评价管理'
        );
        dataList = dataList.filterNot(
          (item) => item.get('title') == 'Order list(3PL)'
        );
        dataList = dataList.filterNot(
          (item) => item.get('title') == '积分订单'
        );
        // }
        // 主页菜单不在权限中配置，写死第一个
        dataList = dataList.insert(
          0,
          fromJS({
            id: 'menu_a',
            pid: 'menu_0',
            realId: -1,
            title: 'Home',
            grade: 1,
            icon: '1505551659667.jpg',
            authNm: '',
            url: '/',
            reqType: '',
            authRemark: '',
            isMenuUrl: null,
            sort: 0
          })
        );
        // 临时新增一个Clinic
        dataList = dataList.push(
          fromJS({
            id: 'menu_clinic',
            pid: 'menu_0',
            realId: -1,
            title: 'Prescriber',
            grade: 1,
            icon: '1505551659667.jpg',
            authNm: '',
            url: '',
            reqType: '',
            authRemark: '',
            isMenuUrl: null,
            sort: 4,
            children: [
              {
                id: 'menu_clinic_msg',
                pid: 'menu_0',
                realId: -1,
                title: 'Prescriber',
                grade: 2,
                icon: '1505551659667.jpg',
                authNm: '',
                url: '',
                reqType: '',
                authRemark: '',
                isMenuUrl: null,
                sort: 0,
                children: [
                  {
                    id: 'menu_clinic_list',
                    pid: 'menu_0',
                    realId: -1,
                    title: 'Prescriber List',
                    grade: 3,
                    icon: '1505551659667.jpg',
                    authNm: '',
                    url: '/clinic',
                    reqType: '',
                    authRemark: '',
                    isMenuUrl: null,
                    sort: 0
                  },
                  {
                    id: 'menu_clinic_new',
                    pid: 'menu_0',
                    realId: -1,
                    title: 'Prescriber Type',
                    grade: 3,
                    icon: '1505551659667.jpg',
                    authNm: '',
                    url: '/clinic-type',
                    reqType: '',
                    authRemark: '',
                    isMenuUrl: null,
                    sort: 1
                  }
                ]
              }
            ]
          })
        );

        const allGradeMenus = this._getChildren(
          dataList.filter((item) => item.get('grade') === 1),
          dataList
        );
        let filterMenu = allGradeMenus
          .toJS()
          .filter(
            (item) =>
              item.title !== '数谋' &&
              item.title !== '魔方' &&
              item.title !== '应用'
          );
        sessionStorage.setItem(cache.LOGIN_MENUS, JSON.stringify(filterMenu));

        const functionsRes = (await webapi.fetchFunctions()) as any;
        sessionStorage.setItem(
          cache.LOGIN_FUNCTIONS,
          JSON.stringify(functionsRes.res.context)
        );
        //获取店铺ID
        const storeId = res.context.storeId;
        //获取店铺主页的小程序码
        const { res: qrcode } = (await webapi.fetchMiniProgramQrcode(
          storeId
        )) as any;
        if (qrcode.code == Const.SUCCESS_CODE) {
          //获取小程序码的地址，保存到本地
          localStorage.setItem(cache.MINI_QRCODE, qrcode.context);
        }

        /**
         * 审核状态 0、待审核 1、已审核 2、审核未通过 -1、未开店
         */
        switch ((res.context as any).auditState) {
          /**待审核*/
          case 0:
            //将审核中的店铺信息存入本地缓存
            history.push('/shop-info');
            break;
          /**审核通过，成功登录*/
          case 1:
            message.success('登录成功');
            //登录成功之后，塞入baseConfig
            const config = (await webapi.getSiteInfo()) as any;
            sessionStorage.setItem(
              cache.SYSTEM_BASE_CONFIG,
              JSON.stringify(config.res.context)
            );
            history.push('/');
            break;
          /**审核未通过*/
          case 2:
            history.push('/shop-info');
            break;
          default:
            //申请开店
            history.push('/shop-process');
        }
      } else {
        message.error(menusRes.res.message);
      }
    } else {
      message.error(res.message);
    }
  };

  /**
   * 获取子菜单
   * @param list
   * @private
   */
  _getChildren = (list, dataList) => {
    return list.map((data) => {
      const children = dataList.filter(
        (item) => item.get('pid') == data.get('id')
      );
      if (!children.isEmpty()) {
        data = data.set('children', this._getChildren(children, dataList));
      }
      return data;
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
      message.success('操作成功');
    } else {
      //登录失败原因
      message.error(res.message);
    }
  }
}
