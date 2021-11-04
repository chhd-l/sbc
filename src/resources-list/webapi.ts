import { Fetch } from 'qmkit';

/**
 * resources 列表获取
 */
 type ResourcesListType = {
  serviceTypeId?: string;
  email?: string;
  name?: string;
  appointmentTypeId?: string;
  arranged?: number
};
export const getResourcesList = (params={}) => {
  return Fetch(`/resourceSetting/list`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 获取下拉枚举字典
 */
export const goodsDict = (type) =>{
  return Fetch(`/goodsDictionary/queryGoodsDictionary`, {
    method: 'POST',
    body: JSON.stringify(type)
  });
}

/**
 * 编辑单条数据时查询resource信息
 */
 export const findByEmployeeId = (params) =>{
  return Fetch("/resourceSetting/findByEmployeeId", {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 保存单条resource信息
 */
 export const saveOrUpdateResource = (params) =>{
  return Fetch(`/resourceSetting/saveOrUpdate`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 批量保存resource信息
 */
 export const batchSaveOrUpdate = (params) =>{
  return Fetch(`/resourceSetting/batchSaveOrUpdate`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 每日排版计划表
 */
 export const calendarByDay = (params) =>{
  return Fetch(`/resourceDatePlan/calendarByDay`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 人员列表
 */
 export const AllEmployeePerson = (params={}) =>{
  return Fetch(`/resourceSetting/getAllEmployeeForResource`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

