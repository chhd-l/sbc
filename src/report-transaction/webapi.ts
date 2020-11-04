import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function transactionReportPage(filterParams = {}) {
  return Fetch<TResult>('/digitalStrategy/transactionReportPage', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
export function transactionStatistics(filterParams = {}) {
  return Fetch<TResult>('/digitalStrategy/transactionStatistics', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
export function transactionTrend() {
  return Fetch<TResult>('/digitalStrategy/transactionTrend', {
    method: 'POST'
  });
}
export function transactionTrendDay() {
  return Fetch<TResult>('/digitalStrategy/transactionTrendDay', {
    method: 'POST'
  });
}
