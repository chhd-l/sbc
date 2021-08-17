import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};


export function sendEmail(email) {
  return Fetch<TResult>('/employee/send-email', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}