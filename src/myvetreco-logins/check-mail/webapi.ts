import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';


export function sendEmail(email) {
  return Fetch<TResult>('/employee/send-email', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}