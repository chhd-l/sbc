import { cache, Const, history, util, Fetch,RCi18n } from 'qmkit';
import * as webapi from './webapi';
import {InitLanguage} from '../lang/webapi'
import { fromJS } from 'immutable';
import { message,notification } from 'antd';

type TResult = {
  code: string;
  message: string;
  context: any;
};
let shouldChangeLanguageSetting = false;

export function getRoutType(callbackUrl: string) {
  var callBackType = ''
  if (callbackUrl === '?type=staff') {
    callBackType = 'staff'
  } else if (callbackUrl === '?type=prescriber') {
    callBackType = 'prescriber'
  }

  if (callBackType) {
    sessionStorage.setItem(cache.OKTA_ROUTER_TYPE, callBackType)
    return callBackType
  } else {
    return sessionStorage.getItem(cache.OKTA_ROUTER_TYPE)
  }
}
async function handleInitLanguage(){

  // 初始化用户当前的语言
  if (Const.SITE_NAME !== 'MYVETRECO') {
    const langRes = await InitLanguage()
    if (langRes.res.code === Const.SUCCESS_CODE) {
      const lang = langRes?.res?.context?.replace('es-MX', 'es') || 'en-US';
      const initLang = localStorage.getItem(cache.LANGUAGE) || 'en-US';
      if (lang !== initLang) {
        shouldChangeLanguageSetting = true;
      }
      sessionStorage.setItem(cache.LANGUAGE, lang);
      localStorage.setItem(cache.LANGUAGE, lang);
    }
  }
}
export async function login(routerType, oktaToken: string, callback?: Function) {
  var res = {} as TResult;
  if (oktaToken) {
    console.log(oktaToken,'oktaTokenoktaToken===')
    sessionStorage.setItem(
      cache.OKTA_TOKEN,
      oktaToken
    );
    if (routerType === 'prescriber') {
      const resOkta = await webapi.getJwtToken(oktaToken) as any;
      res = resOkta.res as TResult;
      sessionStorage.setItem('loginType', 'Prescriber');

    } else if (routerType === 'staff') {
      const resOkta = await webapi.getRCJwtToken(oktaToken) as any;
      res = resOkta.res as TResult;
      sessionStorage.setItem('loginType', 'Staff');
    }
  }
  else {
    let base64 = new util.Base64();
    const account = routerType.account;
    const password = routerType.password;
    const resLocal = await webapi.login(
      base64.urlEncode(account),
      base64.urlEncode(password)
    ) as any;
    res = resLocal.res as TResult;
    sessionStorage.setItem('loginType', 'Admin');
  }

  

  if ((res as any).code === Const.SUCCESS_CODE) {
    if (res.context.checkState === 1) { // need checked
      window.token = res.context.token; 
      // verify login需要初始化语言，刷新页面后拿不到token，需要存一个处理
      sessionStorage.setItem(
        'token-for-verify',
         res.context.token
      );
      sessionStorage.setItem(
        cache.LOGIN_ACCOUNT_NAME,
        res.context.accountName
      );
      sessionStorage.setItem(
        cache.LOGIN_EMPLOYEE_NAME,
        res.context.employeeName
      );
      await handleInitLanguage()
      if(shouldChangeLanguageSetting){
        location.href = `${location.origin}/login-verify`
      }else{
        history.push('login-verify')
      }
      return
    }
    if (res.context.accountState === 4) {
      message.error('The user account need to be audit and application has be submitted to relevant prescriber, we will notify you the result by email.')
      history.push('/login', { oktaLogout: true })
      return
    }
    if (res.context.accountState === 1) {
      message.error('Your account is disabled')
      history.push('/login', { oktaLogout: true })
      return
    }
    if (res.context.accountState === 3) {
      message.error('Your account is inactivated')
      history.push('/login', { oktaLogout: true })
      return
    }


    window.token = res.context.token;
    window.companyType = res.context.companyType;
    sessionStorage.setItem(cache.LOGIN_DATA, JSON.stringify(res.context));
    sessionStorage.setItem('employeeId', res.context.employeeId);

    // 获取登录人拥有的菜单
    const menusRes = (await webapi.menusAndFunctions()) as any;
    if (menusRes.res.code === Const.SUCCESS_CODE) {
      let dataList = fromJS(menusRes.res.context.menuInfoResponseList);
      if (window.companyType == 0) {
        dataList = dataList.filterNot(
          (item) => item.get('title') == '业务员统计'
        );
      }

      let allGradeMenus = _getChildren(
        dataList.filter((item) => item.get('grade') === 1 && item.get('sort') > 0),  //去掉Base菜单，Base菜单用来挂一些通用的权限，避免将通用的接口重复配置到各具体的菜单里
        dataList
      );

      sessionStorage.setItem(cache.LOGIN_MENUS, JSON.stringify(allGradeMenus));
      const functionsRes = menusRes.res.context.functionList
      sessionStorage.setItem(cache.LOGIN_FUNCTIONS, JSON.stringify(functionsRes));

      const addressApiSettings = menusRes.res.context &&
        menusRes.res.context.addressApiSettingVOListResponse &&
        menusRes.res.context.addressApiSettingVOListResponse.addressApiSettings
      const taxApiSettings = menusRes.res.context &&
        menusRes.res.context.addressApiSettingVOListResponse &&
        menusRes.res.context.addressApiSettingVOListResponse.taxApiSettings
      if (taxApiSettings) {
        sessionStorage.setItem(cache.TAX_API_SETTINGS, JSON.stringify(taxApiSettings))
      }
      if (addressApiSettings) {
        sessionStorage.setItem(cache.ADDRESS_API_SETTINGS, JSON.stringify(addressApiSettings))
      }


      const settingConfigList = menusRes.res.context &&
        menusRes.res.context.systemTaxSettingResponse &&
        menusRes.res.context.systemTaxSettingResponse.configVOList
        sessionStorage.setItem(cache.LANGUAGE, 'en-US');
        await handleInitLanguage()

      if (settingConfigList) {
        let element = settingConfigList.find((item) => item.configKey === 'enter_price_type');
        if (element) {
          sessionStorage.setItem(cache.TAX_SWITCH, element.context.toString());
        } else {
          sessionStorage.setItem(cache.TAX_SWITCH, '0');
        }
      }


      /*const functionsRes = (await webapi.fetchFunctions()) as any;
      if (functionsRes.res.code === Const.SUCCESS_CODE) {
        sessionStorage.setItem(
          cache.LOGIN_FUNCTIONS,
          JSON.stringify(functionsRes.res.context)
        );
      } else {
        message.error(functionsRes.res.message)
      }*/
      //获取店铺ID
      const storeId = res.context.storeId;
      //获取店铺主页的小程序码
      /*const { res: qrcode } = (await webapi.fetchMiniProgramQrcode(
        storeId
      )) as any;
      if (qrcode.code == Const.SUCCESS_CODE) {
        //获取小程序码的地址，保存到本地
        localStorage.setItem(cache.MINI_QRCODE, qrcode.context);
      }*/

      //Perscriber used
      /*const employee = (await webapi.employee()) as any;
      if (employee.res) {
        sessionStorage.setItem(cache.EMPLOYEE_DATA, JSON.stringify(employee.res));
      } else {
        message.error(employee.res.message)
      }*/



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
          // const config = (await webapi.getUserSiteInfo()) as any;
          // if (config.res.code === Const.SUCCESS_CODE) {
          sessionStorage.setItem(cache.SYSTEM_BASE_CONFIG, JSON.stringify(menusRes.res.context.baseConfigRopResponse));
          sessionStorage.setItem(cache.EMPLOYEE_DATA, JSON.stringify(menusRes.res.context.employeeAccountByIdResponse));
          let configResponse = menusRes.res.context.configResponse
          let defaultPurchase = {
            defaultPurchaseType: parseInt((configResponse as any).storeVO?.defaultPurchaseType ?? -1),
            defaultSubscriptionFrequencyId: (configResponse as any).storeVO?.defaultSubscriptionFrequencyId ?? '',
            defaultSubscriptionClubFrequencyId:(configResponse as any).storeVO?.defaultSubscriptionClubFrequencyId ?? '',
            languageId: (configResponse as any).storeVO?.languageId ?? '',
            basePricePDPShowedFlag:(configResponse as any).storeVO?.basePricePDPShowedFlag ?? 0,
            priceDisplayMethod:(configResponse as any).storeVO?.priceDisplayMethod ?? 0
          }
          sessionStorage.setItem(cache.SYSTEM_GET_CONFIG, (configResponse as any).currency?.valueEn); //货币符号
          sessionStorage.setItem(cache.SYSTEM_GET_CONFIG_NAME, (configResponse as any).currency?.name); //货币名称
          sessionStorage.setItem(cache.MAP_MODE, (configResponse as any).storeVO.prescriberMap); //货币名称

          sessionStorage.setItem(cache.PRODUCT_SALES_SETTING, JSON.stringify(defaultPurchase));//add product sales setting 
          sessionStorage.setItem(cache.PRODUCT_SALES_CONFIG, JSON.stringify(configResponse?.productSalesConfig ?? '{}')); //add product sales config

          sessionStorage.setItem(cache.CURRENT_YEAR, (configResponse as any).currentDate); //年
          sessionStorage.setItem(cache.SYSTEM_GET_WEIGHT, (configResponse as any).weight ? (configResponse as any).weight.valueEn : ''); //weight
          // } else {
          //   message.error(config.res.message)
          // }
          await fetchStore();
          let hasHomeFunction = functionsRes.includes('f_home');
          if (hasHomeFunction) {
            //如果设置语言和默认语言不同，则需要刷新页面
            if (shouldChangeLanguageSetting) {
              window.location.href='/';
            } else {
              history.push('/');
            }
          } else {
            let url = _getUrl(allGradeMenus);
            if (shouldChangeLanguageSetting) {
              window.location.href = url;
            } else {
              history.push(url);
            }
          }
          callback(res.context)
          break;
        /**审核未通过*/
        case 2:
          history.push('/shop-info');
          break;
        default:
          //申请开店
          history.push('/create-store');
      }
      callback(res.context)
    } else {
      callback(res)
    }

  }
  else {
    if (res.message === 'E-000052' || res.code === 'E-000052') {
      history.push('/403')
    } else if(res.code === 'E-000099') {
      message.error('No prescriber available')
      history.push('/login', { oktaLogout: true })
    } else {
      callback(res)
      //
    }
  }

};

/**
 * 切换店铺 获取login信息
 **/
export async function switchLogin(params, callback?: Function) {
  // let res = {} as TResult;
  // if (oktaToken) {
  //   sessionStorage.setItem(
  //       cache.OKTA_TOKEN,
  //       oktaToken
  //   );
  //   if (routerType === 'prescriber') {
  //     const resOkta = await webapi.getJwtToken(oktaToken) as any;
  //     res = resOkta.res as TResult;
  //
  //   } else if (routerType === 'staff') {
  //     const resOkta = await webapi.getRCJwtToken(oktaToken) as any;
  //     res = resOkta.res as TResult;
  //   }
  // }
  // else {
  //   let base64 = new util.Base64();
  //   const account = routerType.account;
  //   const password = routerType.password;
  //   const resLocal = await webapi.login(
  //       base64.urlEncode(account),
  //       base64.urlEncode(password)
  //   ) as any;
  //   res = resLocal.res as TResult;
  // }
  let { res } = await webapi.switchStore(params);

  if ((res as any).code === Const.SUCCESS_CODE) {
    if (res.context.checkState === 1) { // need checked
      sessionStorage.setItem(
          cache.LOGIN_ACCOUNT_NAME,
          res.context.accountName
      );
      sessionStorage.setItem(
          cache.LOGIN_EMPLOYEE_NAME,
          res.context.employeeName
      );
      history.push('login-verify')
      return
    }
    if (res.context.accountState === 4) {
      message.error('The user account need to be audit and application has be submitted to relevant prescriber, we will notify you the result by email.')
      history.push('/login', { oktaLogout: true })
      return
    }
    if (res.context.accountState === 1) {
      message.error('Your account is disabled')
      history.push('/login', { oktaLogout: true })
      return
    }
    if (res.context.accountState === 3) {
      message.error('Your account is inactivated')
      history.push('/login', { oktaLogout: true })
      return
    }
    window.token = res.context.token;
    window.companyType = res.context.companyType;
    sessionStorage.setItem(cache.LOGIN_DATA, JSON.stringify(res.context));
    sessionStorage.setItem('employeeId', res.context.employeeId);


    // 获取登录人拥有的菜单
    const menusRes = (await webapi.menusAndFunctions()) as any;
    if (menusRes.res.code === Const.SUCCESS_CODE) {
      let dataList = fromJS(menusRes.res.context.menuInfoResponseList);
      if (window.companyType == 0) {
        dataList = dataList.filterNot(
            (item) => item.get('title') == '业务员统计'
        );
      }

      let allGradeMenus = _getChildren(
          dataList.filter((item) => item.get('grade') === 1 && item.get('sort') > 0),
          dataList
      );

      sessionStorage.setItem(cache.LOGIN_MENUS, JSON.stringify(allGradeMenus));
      const functionsRes = menusRes.res.context.functionList
      sessionStorage.setItem(cache.LOGIN_FUNCTIONS, JSON.stringify(functionsRes));

      const addressApiSettings = menusRes.res.context &&
          menusRes.res.context.addressApiSettingVOListResponse &&
          menusRes.res.context.addressApiSettingVOListResponse.addressApiSettings
      const taxApiSettings = menusRes.res.context &&
          menusRes.res.context.addressApiSettingVOListResponse &&
          menusRes.res.context.addressApiSettingVOListResponse.taxApiSettings
      if (taxApiSettings) {
        sessionStorage.setItem(cache.TAX_API_SETTINGS, JSON.stringify(taxApiSettings))
      }
      if (addressApiSettings) {
        sessionStorage.setItem(cache.ADDRESS_API_SETTINGS, JSON.stringify(addressApiSettings))
      }


      const settingConfigList = menusRes.res.context &&
          menusRes.res.context.systemTaxSettingResponse &&
          menusRes.res.context.systemTaxSettingResponse.configVOList
      sessionStorage.setItem(cache.LANGUAGE, 'en-US');
      if (settingConfigList) {
        let element = settingConfigList.find((item) => item.configKey === 'enter_price_type');
        if (element) {
          sessionStorage.setItem(cache.TAX_SWITCH, element.context.toString());
        } else {
          sessionStorage.setItem(cache.TAX_SWITCH, '0');
        }
      }


      /*const functionsRes = (await webapi.fetchFunctions()) as any;
      if (functionsRes.res.code === Const.SUCCESS_CODE) {
        sessionStorage.setItem(
          cache.LOGIN_FUNCTIONS,
          JSON.stringify(functionsRes.res.context)
        );
      } else {
        message.error(functionsRes.res.message)
      }*/
      //获取店铺ID
      const storeId = res.context.storeId;
      //获取店铺主页的小程序码
      /*const { res: qrcode } = (await webapi.fetchMiniProgramQrcode(
        storeId
      )) as any;
      if (qrcode.code == Const.SUCCESS_CODE) {
        //获取小程序码的地址，保存到本地
        localStorage.setItem(cache.MINI_QRCODE, qrcode.context);
      }*/

      //Perscriber used
      /*const employee = (await webapi.employee()) as any;
      if (employee.res) {
        sessionStorage.setItem(cache.EMPLOYEE_DATA, JSON.stringify(employee.res));
      } else {
        message.error(employee.res.message)
      }*/



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
          // const config = (await webapi.getUserSiteInfo()) as any;
          // if (config.res.code === Const.SUCCESS_CODE) {
          sessionStorage.setItem(cache.SYSTEM_BASE_CONFIG, JSON.stringify(menusRes.res.context.baseConfigRopResponse));
          sessionStorage.setItem(cache.EMPLOYEE_DATA, JSON.stringify(menusRes.res.context.employeeAccountByIdResponse));
          let configResponse = menusRes.res.context.configResponse
          let defaultPurchase = {
            defaultPurchaseType: parseInt((configResponse as any).storeVO?.defaultPurchaseType ?? -1),
            defaultSubscriptionFrequencyId: (configResponse as any).storeVO?.defaultSubscriptionFrequencyId ?? '',
            defaultSubscriptionClubFrequencyId:(configResponse as any).storeVO?.defaultSubscriptionClubFrequencyId ?? '',
            languageId: (configResponse as any).storeVO?.languageId ?? '',
            basePricePDPShowedFlag:(configResponse as any).storeVO?.basePricePDPShowedFlag ?? 0,
            priceDisplayMethod:(configResponse as any).storeVO?.priceDisplayMethod ?? 0
          }
          sessionStorage.setItem(cache.SYSTEM_GET_CONFIG, (configResponse as any).currency?.valueEn); //货币符号
          sessionStorage.setItem(cache.SYSTEM_GET_CONFIG_NAME, (configResponse as any).currency?.name); //货币名称
          sessionStorage.setItem(cache.MAP_MODE, (configResponse as any).storeVO.prescriberMap); //货币名称

          sessionStorage.setItem(cache.PRODUCT_SALES_SETTING, JSON.stringify(defaultPurchase));//add product sales setting
          sessionStorage.setItem(cache.PRODUCT_SALES_CONFIG, JSON.stringify(configResponse?.productSalesConfig ?? '{}')); //add product sales config

          sessionStorage.setItem(cache.CURRENT_YEAR, (configResponse as any).currentDate); //年
          sessionStorage.setItem(cache.SYSTEM_GET_WEIGHT, (configResponse as any).weight ? (configResponse as any).weight.valueEn : ''); //weight
          // } else {
          //   message.error(config.res.message)
          // }
          await fetchStore();
          let hasHomeFunction = functionsRes.includes('f_home');
          if (hasHomeFunction) {
            history.push('/');
          } else {
            let url = _getUrl(allGradeMenus);
            history.push(url);
          }
          callback(res)
          break;
          /**审核未通过*/
        case 2:
          history.push('/shop-info');
          break;
        default:
          //申请开店
          history.push('/create-store');
      }
      callback(res)
    } else {
      callback(res)
    }

  }
  else {
    if (res.message === 'E-000052' || res.code === 'E-000052') {
      history.push('/403')
    } else if(res.code === 'E-000099') {
      message.error('No prescriber available')
      history.push('/login', { oktaLogout: true })
    } else {
      callback(res)
      //
    }
  }

};


 /**
   * 查询店铺信息
   *
   * @memberof AppStore
   */
  async function fetchStore  () {
    const { res } = (await webapi.fetchStore()) as any;
    if (res.code == Const.SUCCESS_CODE) {
      sessionStorage.setItem(cache.DOMAINNAME,res.context.domainName); //domain
      sessionStorage.setItem(cache.POXDOMAINNAME,res.context.poxDomainName); //CRMS domain
    }
  };


function _getChildren(list, dataList) {
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
