import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

/*************** OKTA ****************/
export const getOKTAList = () => {
  return Fetch<TResult>('/oktaSetting/oktaByStoreId/List');
};

export function updateOKTA(params:any) {
  return Fetch<TResult>('/oktaSetting/batchSave', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/************** Pet-Api **************/
export const getPetApiInfo = (configType) => {
  return Fetch<TResult>(`/storeConfig/queryStoreConfig/${configType}`);
};

interface UpdatePetApiParams{
  id: string,
  countryCode: number,
  url: string | null
}
export function updatePetApi(params:UpdatePetApiParams) {
  return Fetch<TResult>('/storeConfig/savePetApi', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/************** Hub *****************/

export const getHubStoreConfigList = (configType) => {
  // return Fetch<TResult>('/storeConfig/getStoreConfigHubList');
  return Fetch<TResult>(`/storeConfig/queryStoreConfig/${configType}`);

};

interface UpdateHubParams{
  id: string,
  status: number,
  // url: string | null
}
export function updateHub(params:UpdateHubParams) {
  return Fetch<TResult>('/storeConfig/updateHub', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/************** product-api *****************/
export const getProductApiList = () => {
  return Fetch<TResult>('/synchronizationConfig/find');
};

interface UpdateProductApiObj{
  id: number,
  url: string,
  clientId: number,
  type: string,
  clientSecret: string,
  countryCode: string,
}

export function updateProductApi(params:{
  productSynchronizationConfigVos: Array<UpdateProductApiObj>
}) {
  return Fetch<TResult>('/synchronizationConfig/edit', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}


/************** retailer *****************/
export const findBuyFromRetailer = () => {
  return Fetch<TResult>('/storeConfig/findBuyFromRetailer', {
    method: 'GET',
  });
};

export const editBuyFromRetailer = (params) => {
  return Fetch<TResult>('/storeConfig/editBuyFromRetailer', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};