import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

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
export const getPetApiInfo = () => {
  return Fetch<TResult>('/storeConfig/getStoreConfigPetList');
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

export const getHubStoreConfigList = () => {
  return Fetch<TResult>('/storeConfig/getStoreConfigHubList');
};

interface UpdateHubParams{
  status: number,
  url: string | null
}
export function updateHub(params:UpdateHubParams) {
  return Fetch<TResult>('/storeConfig/updateHub', {
    method: 'POST',
    body: JSON.stringify({
      configType: 'hubConfig',
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
