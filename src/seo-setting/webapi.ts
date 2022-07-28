import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';
const api = {
  getSeo: '/seo/setting',
  getPages: '/sysdict/pageView'
};

export const getPages = (params) => {
  return Fetch<TResult>(api.getPages, {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

export const getSeo = (type, pageName = null) => {
  const url = pageName ? `${api.getSeo}?type=${type}&pageName=${pageName}` : `${api.getSeo}?type=${type}`;
  return Fetch<TResult>(url);
};

export const editSeo = (params) => {
  return Fetch<TResult>(api.getSeo, {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

export const addSeo = (params) => {
  return Fetch<TResult>(api.getSeo, {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
