import { Fetch } from 'qmkit';

/**
 * 查询所有单品模板
 *
 * @export
 * @returns
 */
export function freightTemplateGoods() {
  return Fetch('/freightTemplate/freightTemplateGoods');
}

/**
 * 查询所有店铺模板
 *
 * @export
 * @returns
 */
export function freightTemplateStore(request) {
  return Fetch('/freightTemplate/freightTemplateStore/list', {
    method: 'POST',
    body: JSON.stringify(request)
  });
}

/**
 * 删除店铺运费模板
 * @param freightId
 */
export function deleteFreightStore(freightId) {
  return Fetch(`/freightTemplate/freightTemplateStore/${freightId}`, {
    method: 'DELETE'
  });
}

/**
 * 删除单品运费模板
 * @param freightId
 */
export function deleteFreightGoods(freightId) {
  return Fetch(`/freightTemplate/freightTemplateGoods/${freightId}`, {
    method: 'DELETE'
  });
}

/**
 * 复制运费模板
 * @param freightId
 */
export function copyFreightGoods(freightId) {
  return Fetch(
    `/freightTemplate/freightTemplateGoods/${freightId}`,
    {
      method: 'PUT'
    },
    { isHandleResult: true, customerTip: true }
  );
}

/**
 * 修改店铺运费模板计算方式
 * @param freightId
 */
export function changeStoreFreightType(request) {
  return Fetch('/store/storeInfo/freightType', {
    method: 'PUT',
    body: JSON.stringify(request)
  });
}

/**
 * 查询店铺信息
 *
 * @export
 * @returns
 */
export function fetchStore() {
  return Fetch('/store/storeInfo');
}

/**
 * 查询service fee基础配置
 * @returns
 */
export function fetchServiceFeeConf() {
  return Fetch('/order/config/listByConfigKeyAndDelFlagForServiceFee');
}

/**
 * 修改service fee基础配置
 * @returns
 */
export function updateServiceFeeConf(params = {}) {
  return Fetch('/order/config/batchEnableAndDisable', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}
