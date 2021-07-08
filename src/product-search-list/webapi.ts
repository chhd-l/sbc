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

//同义词列表
export function getSynonList(filterParams = {}) {
  return Fetch<TResult>('/synon/findPage', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

//添加同义词
export function addSynon(filterParams = {}) {
  return Fetch<TResult>('/synon/addSynon', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

//添加同义词
export function eidtSynon(filterParams = {}) {
  return Fetch<TResult>('/synon/modifySynon', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

//删除同义词
export function delSynon(filterParams = {}) {
  return Fetch<TResult>('/synon/deleteSynon', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

//根据id查询同义词
export function synonFindById(filterParams = {}) {
  return Fetch<TResult>('/synon/findById', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
