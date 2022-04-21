import { Fetch } from 'qmkit';

/**
 * get Dict
 * @param filterParams
 */
export function querySysDictionary(filterParams = {}) {
  return Fetch('/sysdict/querySysDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 获取Payment Setting
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getPaymentSetting() {
  return Fetch('/serviceFee/getPaymentMethodList');
}

/**
 *
 * @param params 保存service fee规则
 * @returns
 */
export function saveServiceFeeRule(params) {
  return Fetch('/serviceFee/add', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 *
 * @param params 修改service fee规则
 * @returns
 */
export function updateServiceFeeRule(params) {
  return Fetch('/serviceFee/update', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 查询service fee详情
 */
export function fetchServiceFeeDetails(params) {
  return Fetch('/serviceFee/details', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}
