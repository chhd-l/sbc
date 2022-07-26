import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

export function getLandingPageList(params = {}) {
  return Fetch<TResult>('/landingPage/list', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

export function updateLandingPageStatus(id, status) {
  return Fetch<TResult>('/landingPage/activeUpdate', {
    method: 'POST',
    body: JSON.stringify({ id, status })
  });
};

export function getLandingPageDetail(id) {
  return Fetch<TResult>(`/landingPage/detail/${id}`, { method: 'GET' });
};

export function updateLandingPage(params = {}) {
  return Fetch<TResult>('/landingPage/update', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

export function getResponderList(params = {}) {
  return Fetch<TResult>('/landingPage/responderList', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
