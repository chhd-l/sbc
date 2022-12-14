import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

/**
 * 查询logo
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchBossLogo = () => {
  return Fetch('/bosslogo');
};

/**
 * 查询手机是否存在
 * @param phone
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchPhoneExist(phone: string) {
  return Fetch<TResult>(`/customer/${phone}/supplier`);
}

/**
 * 发送手机验证码
 * @param phone
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function sendValidCode(phone) {
  return Fetch<TResult>(`/password/sms/${phone}`, {
    method: 'POST',
    body: JSON.stringify({})
  });
}

/**
 * 校验验证码
 * @param phone phone
 * @param code code
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function validCode(phone: string, code: string) {
  return Fetch<TResult>(`/password/sms/${phone}/${code}`, {
    method: 'POST',
    body: JSON.stringify({})
  });
}

/**
 * 设置手机密码
 * @param phone phone
 * @param password password
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function resetPassword(
  phone: string,
  password: string,
  smsVerifyCode: string
) {
  return Fetch<TResult>(`/password/${phone}/${password}/${smsVerifyCode}`, {
    method: 'POST',
    body: JSON.stringify({})
  });
}

/**
 * 修改密码
 * @param employee
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function updatePassword(employee) {
  return Fetch<TResult>('/password/user/reset', {
    method: 'POST',
    body: JSON.stringify(employee)
  });
}
