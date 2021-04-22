import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

export function getStatisticsData(startDate, endDate) {
  return Fetch<TResult>('/search/details/statistics' + '?startDate=' + startDate + '&endDate=' + endDate, {
    method: 'GET'
  });
}

export function getAllSearchData(filterParams = {}) {
  return Fetch<TResult>('/search/details/term/statistics', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getNoResultsData(filterParams = {}) {
  return Fetch<TResult>('/search/details/term/statistics', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getRebuild(filterParams = {}) {
  return Fetch<TResult>('/esIndex/rebuild', {
    method: 'POST',
  });
}

export function getRepair(filterParams = {}) {
  return Fetch<TResult>('/esIndex/repair', {
    method: 'POST',
  });
}
