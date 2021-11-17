import { Fetch, cache } from 'qmkit';
import { querySysDictionary } from '../webapi';
import { Const } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 *
 * @returns 获取地址输入类型
 * 法国暂时不使用配置，直接条用MANUALLY的设置
 */
export async function getAddressInputTypeSetting() {
  const currentCountry = (window as any).countryEnum[JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}').storeId];
  if (currentCountry === 'fr' || currentCountry === 'uk') {
    return Promise.resolve('MANUALLY');
  }
  return await Fetch<TResult>('/system/config/listSystemConfigByStoreId', {
    method: 'POST',
    body: JSON.stringify({
      configType: 'address_input_type'
    })
  })
    .then((data) => {
      if (data.res.code === Const.SUCCESS_CODE && data.res.context && data.res.context.length > 0) {
        return data.res.context.findIndex((ad) => ad.configKey === 'address_input_type_manually' && ad.context === '1') > -1 ? 'MANUALLY' : 'AUTOMATICALLY';
      } else {
        return '';
      }
    })
    .catch(() => {
      return '';
    });
}

/**
 * 获取地址form的排列设置
 * @returns
 */
export async function getAddressFieldList(type: string = 'MANUALLY') {
  return await Fetch<TResult>('/addressDisplaySetting/queryByStoreId/' + type, {
    method: 'GET'
  })
    .then((data) => {
      if (data.res.code === Const.SUCCESS_CODE) {
        return data.res.context.addressDisplaySettings.filter((field) => field.enableFlag === 1 && field.occupancyNum > 0).sort((a, b) => a.sequence - b.sequence);
      } else {
        return [];
      }
    })
    .catch(() => {
      return [];
    });
}

/**
 * 获取是否进行地址验证的设置
 * addressApiType: 1 - suggestion  0 - validation
 * @returns
 */
export async function getSuggestionOrValidationMethodName(addressApiType = 1) {
  return await Fetch<TResult>('/addressApiSetting/queryByStoreId', {
    method: 'POST',
    body: JSON.stringify({ addressApiType })
  })
    .then((data) => {
      if (data.res.code === Const.SUCCESS_CODE) {
        return (data.res.context.addressApiSettings.findIndex((item) => item.isOpen === 1) ?? {})['name'] ?? 'FGS';
      } else {
        return 'FGS';
      }
    })
    .catch(() => {
      return 'FGS';
    });
}

/**
 * 获取地址验证的结果
 * @param params
 * @returns
 */
export function validateAddress(params = {}) {
  return Fetch<TResult>('/addressValidation/validation', {
    method: 'POST',
    body: JSON.stringify({
      ...params,
      storeId: JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).storeId || ''
    })
  });
}

/**
 * 获取国家列表
 */
export async function getCountryList() {
  let countryList = JSON.parse(sessionStorage.getItem('dict-country'));
  if (countryList && countryList.length > 0) {
    return countryList;
  } else {
    return await querySysDictionary({ type: 'country' })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          sessionStorage.setItem('dict-country', JSON.stringify(res.context.sysDictionaryVOS));
          return res.context.sysDictionaryVOS;
        } else {
          return [];
        }
      })
      .catch((err) => {
        return [];
      });
  }
}

/**
 * 获取州或省列表
 */
export async function getStateList() {
  let stateList = JSON.parse(sessionStorage.getItem('dict-state'));
  if (stateList && stateList.length > 0) {
    return stateList;
  } else {
    return await Fetch<TResult>('/systemState/queryByStoreId', {
      method: 'POST',
      body: JSON.stringify({
        storeId: JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).storeId || ''
      })
    })
      .then((data) => {
        if (data.res.code === Const.SUCCESS_CODE) {
          sessionStorage.setItem('dict-state', JSON.stringify(data.res.context.systemStates));
          return data.res.context.systemStates;
        } else {
          return [];
        }
      })
      .catch(() => {
        return [];
      });
  }
}

/**
 * 获取城市列表
 */
export async function getCityList() {
  let cityList = JSON.parse(sessionStorage.getItem('dict-city'));
  if (cityList && cityList.length > 0) {
    return cityList;
  } else {
    return await Fetch<TResult>('/system-city/queryPageView', {
      method: 'POST',
      body: JSON.stringify({
        pageNum: 0,
        pageSize: 99999
      })
    })
      .then((data) => {
        if (data.res.code === Const.SUCCESS_CODE) {
          sessionStorage.setItem('dict-city', JSON.stringify(data.res.context?.systemCitys?.content ?? []));
          return data.res.context?.systemCitys?.content ?? [];
        } else {
          return [];
        }
      })
      .catch(() => {
        return [];
      });
  }
}

/**
 * 根据searchTxt搜索城市列表
 * @param searchTxt
 */
export function searchCity(searchTxt: string) {
  return Fetch<TResult>('/system-city/query-system-city-by-name', {
    method: 'POST',
    body: JSON.stringify({
      cityName: searchTxt,
      pageNum: 0,
      pageSize: 30,
      storeId: Const.SITE_NAME === 'MYVETRECO' ? 123457915 : undefined
    })
  });
}

/**
 * 根据city id查询region list
 * @param id
 * @returns
 */
export function getRegionListByCityId(id: number) {
  return Fetch<TResult>(`/systemRegion/queryByStoreId/${id}`, {
    method: 'GET'
  });
}

/**
 * 搜索地址 Dadata
 * @param txt
 * @returns
 */
export function getAddressListByDadata(txt: string) {
  return Fetch<TResult>(`/address-input-auto/list?keyword=${txt}`, {
    method: 'GET'
  });
}

/**
 * 俄罗斯验证地址是不是在配送范围
 * @param addressFias
 * @returns
 */
export async function validateAddressScope(addressFias = {}) {
  return await Fetch<TResult>('/tempoline', {
    method: 'POST',
    body: JSON.stringify(addressFias)
  })
    .then((data) => {
      if (data.res.code === Const.SUCCESS_CODE) {
        return data.res.context.success;
      } else {
        return false;
      }
    })
    .catch(() => {
      return false;
    });
}

/**
 * 获取候选tagging
 */
export function getTaggingList() {
  return Fetch<TResult>('/customer/segment/segment/query', {
    method: 'POST',
    body: JSON.stringify({
      pageNum: 0,
      pageSize: 1000,
      isPublished: 1
    })
  });
}

/**
 * 合并包裹
 */
export function dimensionsByPackage(filterParams = {}) {
  return Fetch<TResult>('/pick-up-supplier/dimensionsByPackage-supplier', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 根据关键字搜索城市列表
 */
export function pickupQueryCity(city = '') {
  return Fetch<TResult>(
    '/pick-up-supplier/queryCity?keyword=' + city + '',
    {
      method: 'Get'
    }
  );
}

/**
 * 根据城市信息查询运费
 */
export function pickupQueryCityFee(filterParams = {}) {
  return Fetch<TResult>('/pick-up-supplier/queryCityFee', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 建议地址 DQE
 * @param address 
 * @returns 
 */
export function getSuggestionAddressListByDQE(address = '') {
  return Fetch<TResult>(`/address-input-auto/DQElist?address=${address}`, {
    method: 'GET'
  });
}
