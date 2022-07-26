import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';
//获取当前用户是否已经开店
export function getUserStatus(email) {
  return Fetch<TResult>(`/store/create/queryReqJson?email=${email}`);
}