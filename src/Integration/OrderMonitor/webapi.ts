import {Fetch} from 'qmkit';
import {TResult} from 'qmkit/type';


// 获取Order Monitor列表
export function fetchOrderMonitorList(filterParams = {}) {
  return Fetch<TResult>('/orderMonitor/page', {
    method: 'POST',
    body: JSON.stringify({...filterParams})
  });
}

// 通过id获取Order Monitor详情
export function fetchOrderMonitorDetails(filterParams = {}) {
  return Fetch<TResult>('/orderMonitor/findOrderMonitorById', {
    method: 'POST',
    body: JSON.stringify({...filterParams})
  });
}
// 获取ExceptionType列表
export function getExceptionType() {
  return Fetch<TResult>('/orderMonitor/findExceptionTypes', {
    method: 'GET'
  });
}

///orderMonitor/toPushDownStream

export function toPushDownStream(filterParams = {}) {
  return Fetch<TResult>('/orderMonitor/toPushDownStream', {
    method: 'POST',
    body: JSON.stringify({...filterParams})
  });
}

// 获取pay status列表
export function getOrderStatus() {
  return Fetch<TResult>('/orderMonitor/pay-status', {
    method: 'GET'
  });
}

