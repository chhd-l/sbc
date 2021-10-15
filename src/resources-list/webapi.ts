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
  return Fetch(`/resouceSetting/list`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
};