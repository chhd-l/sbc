import {Fetch} from 'qmkit'

type TResult = {
  code:string,
  message:string,
  context:any
}

// 获取logList列表
export function fetchLogList(filterParams = {}) {
  return Fetch<TResult>('/request/log/page', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

// 获取interface详情
export function getInterfaceDetail(filterParams = {}) {
  return Fetch<TResult>('/intInterface/findById', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

//serviceLoad
export function getServiceLoad(filterParams = {}) {
  return Fetch<TResult>('/requestLogStatistical/serviceLoad', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
//apdex
export function getApdex(filterParams = {}) {
  return Fetch<TResult>('/requestLogStatistical/apdex', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

//error
export function getError(filterParams = {}) {
  return Fetch<TResult>('/requestLogStatistical/error', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

//sucessfulRate
export function getSucessfulRate(filterParams = {}) {
  return Fetch<TResult>('/requestLogStatistical/sucessfulRate', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}


//responseTime
export function getResponseTime(filterParams = {}) {
  return Fetch<TResult>('/requestLogStatistical/responseTime', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

//responseTimePercentile
export function getResponseTimePercentile(filterParams = {}) {
  return Fetch<TResult>('/requestLogStatistical/responseTimePercentile', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}



