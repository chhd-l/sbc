import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';


export function resetPassword(params) {
  return Fetch<TResult>('/employee/reset-password', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}