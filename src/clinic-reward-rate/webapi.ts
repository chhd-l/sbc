import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * get rewardList
 * @param filterParams
 */
export function queryClinicsReward(filterParams = {}) {
  return Fetch<TResult>('/clinicsReward/queryClinicsReward', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * add rewardList
 * @param filterParams
 */
export function addClinicsReward(filterParams = {}) {
  return Fetch<TResult>('/clinicsReward/addClinicsReward', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * update rewardList
 * @param filterParams
 */
export function updateClinicsReward(filterParams = {}) {
  return Fetch<TResult>('/clinicsReward/upDateClinicsReward', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
/**
 * delete rewardList
 * @param filterParams
 */
export function delClinicsReward(filterParams = {}) {
  return Fetch<TResult>('/clinicsReward/delClinicsReward', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
