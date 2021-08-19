import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};


export function resetPassword(params) {
  return Fetch<TResult>('/employee/reset-password', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}