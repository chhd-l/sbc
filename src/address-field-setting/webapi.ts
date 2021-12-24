import { Fetch, Const } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export const getFieldList = async (type: string = 'MANUALLY') => {
  return await Fetch<TResult>('/addressDisplaySetting/queryByStoreId/' + type, {
    method: 'GET'
  })
    .then((data) => {
      if (data.res.code === Const.SUCCESS_CODE) {
        return data.res.context.addressDisplaySettings;
      } else {
        return [];
      }
    })
    .catch(() => {
      return [];
    });
};

export const saveFieldList = (params = {}) => {
  return Fetch<TResult>('/addressDisplaySetting/batchEditAddressDisplaySetting', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

export function getAddressSetting(param = {}) {
  return Fetch<TResult>('/addressApiSetting/queryByStoreId', {
    method: 'POST',
    body: JSON.stringify({
      ...param,
      addressApiType: 1
    })
  });
}

export function getAddressInputTypeSetting() {
  return Fetch<TResult>('/system/config/listSystemConfigByStoreId', {
    method: 'POST',
    body: JSON.stringify({
      configType: 'address_input_type'
    })
  });
}

export function saveAddressInputTypeSetting(params = {}) {
  return Fetch<TResult>('/system/config/batchModifyConfig', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

export function editAddressApiSetting(param = {}) {
  return Fetch<TResult>('/addressApiSetting/editAddressApiSetting', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

// 编辑 editPostCodeBlockList
export function editPostCodeBlockList(param = {}) {
  return Fetch<TResult>('/addressDisplaySetting/editPostCodeBlockList', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

// 获取 PostCodeBlockList
export const getPostCodeBlockList = async (addressDisplaySettingId) => {
  return await Fetch<TResult>(`/addressDisplaySetting/getPostCodeBlockList?addressDisplaySettingId=${addressDisplaySettingId}`, {
    method: 'GET'
  })
};

// 校验新增 PostCode
export function validPostCodeBlock(param = {}) {
  return Fetch<TResult>('/addressDisplaySetting/validPostCodeBlock', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

// 设置address1的suggestionFlag和validationFlag
export function setFlagForAddress1(params = {}) {
  return Fetch<TResult>('/addressDisplaySetting/edit-address-switch-setting', {
    method: 'POST',
    body: JSON.stringify(params)
  })
}
