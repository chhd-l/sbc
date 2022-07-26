import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

export function trafficReportPage(filterParams = {}) {
  return Fetch<TResult>('/digitalStrategy/trafficReportPage', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
export function trafficStatistics(filterParams = {}) {
  return Fetch<TResult>('/digitalStrategy/trafficStatistics', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
export function trafficTrend() {
  return Fetch<TResult>('/digitalStrategy/trafficTrend', {
    method: 'POST'
  });
}
export function trafficTrendDay() {
  return Fetch<TResult>('/digitalStrategy/trafficTrendDay', {
    method: 'POST'
  });
}
