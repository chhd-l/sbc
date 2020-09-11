import { cache, Const, history, util } from 'qmkit';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import { message } from 'antd';

type TResult = {
  code: string;
  message: string;
  context: any;
};


export async function login(form, oktaToken: string) {
    let base64 = new util.Base64();
    var res = {} as TResult;
    if (oktaToken) {
      sessionStorage.setItem(
        cache.OKTA_TOKEN,
        oktaToken
      );
      const resOkta  = await webapi.getJwtToken(oktaToken) as any;
      res = resOkta.res as TResult;
      if ((res as any).code === Const.SUCCESS_CODE) {
        if(res.context.checkState === 1) { // Not checked
          sessionStorage.setItem(
            cache.LOGIN_ACCOUNT_NAME,
            res.context.accountName
          );
          history.push('login-verify')
          return
        }
      }

    } else {
      const account = form.account;
      const password = form.password;
      const resLocal  = await webapi.login(
        base64.urlEncode(account),
        base64.urlEncode(password)
      ) as any ;
      res = resLocal.res as TResult;
    }
    
    if ((res as any).code === Const.SUCCESS_CODE) {
      if (form.isRemember) {
        localStorage.setItem(cache.LOGIN_DATA, JSON.stringify(res.context));
      }
      window.token = res.context.token;
      window.companyType = res.context.companyType;
      sessionStorage.setItem(cache.LOGIN_DATA, JSON.stringify(res.context));
      sessionStorage.setItem('employeeId', res.context.employeeId);

      // 获取登录人拥有的菜单
      const menusRes = (await webapi.fetchMenus()) as any;
      if (menusRes.res.code === Const.SUCCESS_CODE) {
        let dataList = fromJS(menusRes.res.context);
        if (window.companyType == 0) {
          dataList = dataList.filterNot(
            (item) => item.get('title') == '业务员统计'
          );
        }

        let allGradeMenus = _getChildren(
          dataList.filter((item) => item.get('grade') === 1),
          dataList
        );

        sessionStorage.setItem(
          cache.LOGIN_MENUS,
          JSON.stringify(allGradeMenus)
        );
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

        //Perscriber used
        const employee = (await webapi.employee()) as any;
        sessionStorage.setItem(
          cache.EMPLOYEE_DATA,
          JSON.stringify(employee.res)
        );

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
            message.success('login successful');
            //登录成功之后，塞入baseConfig
            const config = (await webapi.getUserSiteInfo()) as any;
            sessionStorage.setItem(
              cache.SYSTEM_BASE_CONFIG,
              JSON.stringify(config.res.context)
            );
            let hasHomeFunction = functionsRes.res.context.includes('f_home');
            if (hasHomeFunction) {
              history.push('/');
            } else {
              let url = _getUrl(allGradeMenus);
              history.push(url);
            }
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

 function _getChildren (list, dataList) {
    return list.map((data) => {
      const children = dataList.filter(
        (item) => item.get('pid') == data.get('id')
      );
      if (!children.isEmpty()) {
        data = data.set('children', _getChildren(children, dataList));
      }
      return data;
    });
  };

  
  function _getUrl(allGradeMenus) {
    if (!allGradeMenus) {
      message.error('No Menus');
    }
    let menus = allGradeMenus.title ? allGradeMenus : allGradeMenus.toJS();
    let firstMenus = menus.length > 0 ? menus[0] : menus;
    if (firstMenus.url) {
      return firstMenus.url;
    } else {
      let currentMenus = menus[0] ? menus[0] : menus;
      return _getUrl(currentMenus.children[0]);
    }
  };